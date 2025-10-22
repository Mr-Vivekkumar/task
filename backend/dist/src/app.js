import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
export default app;
//# sourceMappingURL=app.js.map