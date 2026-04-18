import { NextFunction, Request, Response } from 'express';
import { AuthTokenPayload, verifyAccessToken } from './jwt';

export type AuthedRequest = Request & {
    auth?: AuthTokenPayload;
};

const getBearerToken = (authorizationHeader?: string): string | null => {
    if (!authorizationHeader) {
        return null;
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return null;
    }

    return token;
};

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction): void => {
    try {
        const token = getBearerToken(req.headers.authorization);

        if (!token) {
            res.status(401).json({ error: 'Missing or invalid authorization token' });
            return;
        }

        req.auth = verifyAccessToken(token);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};