import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = Number(process.env.BACKEND_PORT) || 3000;

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Ping Pong Ding Dong' });
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' , "message": 'i am in good condition and healthy af' });
});

app.use((err: any, req: Request, res: Response) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
