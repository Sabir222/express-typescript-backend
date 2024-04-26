import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    user_email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});
