import './config/env';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { authRouter, requireAuth, AuthedRequest } from './auth';
import { initializeDatabase } from './db';

const app: Express = express();
const port = Number(process.env.BACKEND_PORT) || 3000;

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Ping Pong Ding Dong' });
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' , "message": 'i am in good condition and healthy af' });
});

app.get('/protected', requireAuth, (req: AuthedRequest, res: Response) => {
    res.json({
        message: 'Protected route accessed successfully',
    });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    void next;
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
});

const startServer = async (): Promise<void> => {
    await initializeDatabase();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

void startServer();

export default app;
