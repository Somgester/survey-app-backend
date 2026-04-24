import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../db';
import { userSchema, type User } from '../schema';

type UserRole = NonNullable<User['role']>;

export type DbUser = {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
};

export type PublicUser = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
};

const createUserParamsSchema = userSchema
    .pick({ username: true, email: true })
    .extend({
        password: z.string().min(1),
        role: userSchema.shape.role.unwrap().default('creator'),
    });

const mapUser = (user: DbUser): PublicUser => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
});

export const findUserByEmail = async (email: string): Promise<DbUser | null> => {
    const result = await pool.query<DbUser>(
        `SELECT id, username, email, password_hash, role, created_at, updated_at
         FROM users
         WHERE email = $1
         LIMIT 1`,
        [email]
    );

    return result.rows[0] ?? null;
};

export const createUser = async (params: {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}): Promise<PublicUser> => {
    const parsedParams = createUserParamsSchema.parse(params);
    const passwordHash = await bcrypt.hash(parsedParams.password, 10);
    const result = await pool.query<DbUser>(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, password_hash, role, created_at, updated_at`,
        [parsedParams.username, parsedParams.email, passwordHash, parsedParams.role]
    );

    return mapUser(result.rows[0]);
};

export const verifyUserPassword = async (user: DbUser, password: string): Promise<boolean> => {
    return bcrypt.compare(password, user.password_hash);
};

export const toPublicUser = mapUser;
