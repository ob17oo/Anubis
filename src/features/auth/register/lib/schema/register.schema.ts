import { emailSchema } from "@/shared/schema/email.schema";
import { passwordSchema } from "@/shared/schema/password.schema";
import z from "zod";

const registerFieldsSchema = z.object({
    email: emailSchema,
    userName: z.string().min(4, { error: 'Логин должен содержать минимум 4 символа' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
})

export const registerSchema = registerFieldsSchema.refine(
    (value) => value.password === value.confirmPassword,
    { error: `Пароли не совпадают`, path: ['confirmPassword'] }
)

/** Для server action — без confirmPassword и без refine */
export const registerServerSchema = registerFieldsSchema.pick({
    email: true,
    userName: true,
    password: true,
})

export type RegisterFormData = z.infer<typeof registerSchema>