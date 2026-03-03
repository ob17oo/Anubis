import z from "zod";

export const emailSchema = z
    .email({error: 'Введите корректный формат'})
    .min(5,{error: 'Почта должна содержать минимум 5 символов'})
    .max(50, { error: 'Почта должна содержать максимум 50 символов'})
    .transform((value) => value.toLowerCase().trim())

export type Email = z.infer<typeof emailSchema>