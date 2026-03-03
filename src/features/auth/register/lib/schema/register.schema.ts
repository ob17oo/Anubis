import { emailSchema } from "@/shared/schema/email.schema";
import { passwordSchema } from "@/shared/schema/password.schema";
import z from "zod";

export const registerSchema = z.object({
    email: emailSchema,
    userName: z.string().min(4, { error: 'Логин должен содержать минимум 4 символа' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
}).refine((value) => value.password === value.confirmPassword, { error: `Пароли не совпадают` })

export type RegisterFormData = z.infer<typeof registerSchema>