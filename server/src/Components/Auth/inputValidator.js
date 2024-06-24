import { z } from 'zod'

const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid Email Address" })
        .trim()
        .min(4, { message: "Email must be at least 4 chars" })
        .max(255, { message: "Email must be at most 255 chars" }),

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(7, { message: "Password must be at least 7 chars" })
        .max(255, { message: "Password must be at most 255 chars" })
})


const registerSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .trim()
        .min(4, { message: "Name must be at least 4 chars" })
        .max(255, { message: "Name must be at most 255 chars" }),
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(4, { message: "Name must be at least 4 chars" })
        .max(255, { message: "Name must be at most 255 chars" }),

    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid Email Address" })
        .trim()
        .min(4, { message: "Email must be at least 4 chars" })
        .max(255, { message: "Email must be at most 255 chars" }),

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(7, { message: "Password must be at least 7 chars" })
        .max(255, { message: "Password must be at most 255 chars" }),

    isGuest: z.boolean().optional(),
});

export { registerSchema, loginSchema }