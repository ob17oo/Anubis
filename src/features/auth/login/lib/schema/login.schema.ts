import { emailSchema } from "@/shared/schema/email.schema";
import { passwordSchema } from "@/shared/schema/password.schema";
import z from "zod";

export const LoginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})

export type LoginFormData = z.infer<typeof LoginSchema>