import 'dotenv/config';
import app from './app.ts';

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});