import { z } from 'zod';

export const userSchema = z.object({
    id: z.uuid(),
    username: z.string().min(3).max(20).optional(),
    email: z.email(),
    first_name: z.string().min(1).max(50),
    last_name: z.string().min(1).max(50).optional(),
    created_at: z.string(),
    updated_at: z.string(),
    role: z.enum(['creator', 'auditor']).optional(),
});

export type User = z.infer<typeof userSchema>;