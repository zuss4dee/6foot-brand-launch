import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createRegistryCustomer } from "./shopify-customer.server";

const emailSchema = z.object({
  email: z.string().email(),
});

export const registerVaultRegistry = createServerFn({ method: "POST" })
  .validator(emailSchema)
  .handler(async ({ data }) => {
    const result = await createRegistryCustomer(data.email);

    if (result.errors.length > 0) {
      throw new Error(result.errors[0]);
    }

    return { ok: true as const, duplicate: Boolean(result.duplicate) };
  });
