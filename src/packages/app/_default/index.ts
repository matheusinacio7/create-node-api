import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3030;

app.use(
  express.json(),
  helmet(),
  cors(),
);

app.listen(PORT, () => {
  console.log('Server is up on port', PORT);
});
