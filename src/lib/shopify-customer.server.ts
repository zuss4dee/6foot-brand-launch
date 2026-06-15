const STOREFRONT_API_VERSION = "2024-10";

export const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = /* GraphQL */ `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_QUERY = /* GraphQL */ `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
    }
  }
`;

type ShopifyUserError = {
  field?: string[] | null;
  message: string;
  code?: string;
};

type StorefrontResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

  if (!domain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN environment variable.");
  }
  if (!token) {
    throw new Error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable.");
  }

  return { domain, token };
}

async function storefrontFetch<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<StorefrontResponse<TData>> {
  const { domain, token } = getShopifyConfig();

  const response = await fetch(`https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed (${response.status}).`);
  }

  return (await response.json()) as StorefrontResponse<TData>;
}

function formatUserErrors(errors: ShopifyUserError[] | undefined | null): string[] {
  return (errors ?? []).map((error) => error.message).filter(Boolean);
}

export type CustomerAccessTokenResult = {
  accessToken: string;
  expiresAt: string;
};

export type CustomerProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export async function createCustomer(
  email: string,
  password: string,
): Promise<{ customer: CustomerProfile | null; errors: string[] }> {
  const json = await storefrontFetch<{
    customerCreate?: {
      customer?: CustomerProfile | null;
      customerUserErrors?: ShopifyUserError[];
    };
  }>(CUSTOMER_CREATE_MUTATION, {
    input: { email, password },
  });

  if (json.errors?.length) {
    return { customer: null, errors: json.errors.map((e) => e.message) };
  }

  const payload = json.data?.customerCreate;
  const userErrors = formatUserErrors(payload?.customerUserErrors);

  if (userErrors.length > 0) {
    return { customer: null, errors: userErrors };
  }

  return { customer: payload?.customer ?? null, errors: [] };
}

export async function createCustomerAccessToken(
  email: string,
  password: string,
): Promise<{ token: CustomerAccessTokenResult | null; errors: string[] }> {
  const json = await storefrontFetch<{
    customerAccessTokenCreate?: {
      customerAccessToken?: CustomerAccessTokenResult | null;
      customerUserErrors?: ShopifyUserError[];
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password },
  });

  if (json.errors?.length) {
    return { token: null, errors: json.errors.map((e) => e.message) };
  }

  const payload = json.data?.customerAccessTokenCreate;
  const userErrors = formatUserErrors(payload?.customerUserErrors);

  if (userErrors.length > 0) {
    return { token: null, errors: userErrors };
  }

  const token = payload?.customerAccessToken;
  if (!token?.accessToken || !token.expiresAt) {
    return { token: null, errors: ["Shopify did not return a customer access token."] };
  }

  return { token, errors: [] };
}

export async function fetchCustomer(
  customerAccessToken: string,
): Promise<CustomerProfile | null> {
  const json = await storefrontFetch<{
    customer?: CustomerProfile | null;
  }>(CUSTOMER_QUERY, { customerAccessToken });

  if (json.errors?.length) {
    return null;
  }

  return json.data?.customer ?? null;
}
