import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { assert } from 'node:console';
import { type User } from '../schema';

type UserRole = NonNullable<User['role']>;

export type AuthTokenPayload = {
    sub: string;
    email: string;
    username?: string;
    role?: UserRole;
};

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET?.trim() ? process.env.JWT_SECRET.trim() : "";

    assert(secret, 'JWT_SECRET environment variable must be set and non-empty');
    return secret;
};

const getAccessTokenExpiry = (): SignOptions['expiresIn'] => {
    return (process.env.JWT_EXPIRES_IN || '5m') as SignOptions['expiresIn'];
};

export const signAccessToken = (payload: AuthTokenPayload): { accessToken: string; exp: number } => {
    const accessToken = jwt.sign(payload, getJwtSecret(), {
        expiresIn: getAccessTokenExpiry(),
    });

    const decoded = jwt.decode(accessToken) as JwtPayload | null;

    if (!decoded?.exp) {
        throw new Error('Unable to read token expiry');
    }

    return {
        accessToken,
        exp: decoded.exp,
    };
};

export const verifyAccessToken = (token: string): AuthTokenPayload => {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload & AuthTokenPayload;

    return {
        sub: String(decoded.sub),
        email: String(decoded.email),
        username: decoded.username,
        role: decoded.role as UserRole | undefined,
    };
};