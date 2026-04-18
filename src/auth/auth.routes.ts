import { Router, Request, Response } from 'express';
import { loginRequestSchema, registerRequestSchema } from './schema/auth.schema';
import { requireAuth, AuthedRequest } from './auth.middleware';
import { signAccessToken } from './jwt';
import { createUser, findUserByEmail, verifyUserPassword } from './user.repository';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const parsed = registerRequestSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
        return;
    }

    const { username, email, password } = parsed.data;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        res.status(409).json({ error: 'Email already exists' });
        return;
    }

    const user = await createUser({ username, email, password });

    res.status(201).json({
        message: `User registered successfully with ${user.email}`,
    });
});

router.post('/login', async (req: Request, res: Response) => {
    const parsed = loginRequestSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
        return;
    }

    const { email, password } = parsed.data;
    const user = await findUserByEmail(email);

    if (!user || !(await verifyUserPassword(user, password))) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }

    const { accessToken, exp } = signAccessToken({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
    });

    res.json({
        message: 'Login successful',
        accessToken,
        exp,
    });
});

router.get('/validate', requireAuth, (req: AuthedRequest, res: Response) => {
    res.json({
        authenticated: true,
        user: req.auth,
    });
});

export default router;