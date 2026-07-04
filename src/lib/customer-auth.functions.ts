import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

import {
  createCustomer,
  createCustomerAccessToken,
  fetchCustomer,
} from "./shopify-customer.server";

export const CUSTOMER_TOKEN_COOKIE = "6foot_customer_token";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

function setCustomerTokenCookie(accessToken: string, expiresAt: string) {
  const expiresMs = new Date(expiresAt).getTime() - Date.now();
  const maxAge = Math.max(60, Math.floor(expiresMs / 1000));

  setCookie(CUSTOMER_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

function clearCustomerTokenCookie() {
  deleteCookie(CUSTOMER_TOKEN_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export const loginCustomer = createServerFn({ method: "POST" })
  .validator(credentialsSchema)
  .handler(async ({ data }) => {
    const { token, errors } = await createCustomerAccessToken(data.email, data.password);

    if (errors.length > 0 || !token) {
      throw new Error(errors[0] ?? "Unable to sign in.");
    }

    setCustomerTokenCookie(token.accessToken, token.expiresAt);

    const customer = await fetchCustomer(token.accessToken);

    return {
      email: customer?.email ?? data.email,
      firstName: customer?.firstName ?? null,
      lastName: customer?.lastName ?? null,
    };
  });

export const signupCustomer = createServerFn({ method: "POST" })
  .validator(credentialsSchema)
  .handler(async ({ data }) => {
    const { customer, errors: createErrors } = await createCustomer(data.email, data.password);

    if (createErrors.length > 0) {
      throw new Error(createErrors[0]);
    }

    const { token, errors: loginErrors } = await createCustomerAccessToken(
      data.email,
      data.password,
    );

    if (loginErrors.length > 0 || !token) {
      throw new Error(loginErrors[0] ?? "Account created but sign-in failed. Try logging in.");
    }

    setCustomerTokenCookie(token.accessToken, token.expiresAt);

    return {
      email: customer?.email ?? data.email,
      firstName: customer?.firstName ?? null,
      lastName: customer?.lastName ?? null,
    };
  });

export const logoutCustomer = createServerFn({ method: "POST" }).handler(async () => {
  clearCustomerTokenCookie();
  return { ok: true as const };
});

export const getCustomerSession = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(CUSTOMER_TOKEN_COOKIE);

  if (!token) {
    return { authenticated: false as const };
  }

  try {
    const customer = await fetchCustomer(token);

    if (!customer) {
      clearCustomerTokenCookie();
      return { authenticated: false as const };
    }

    return {
      authenticated: true as const,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    };
  } catch (error) {
    console.error("getCustomerSession failed:", error);
    clearCustomerTokenCookie();
    return { authenticated: false as const };
  }
});
