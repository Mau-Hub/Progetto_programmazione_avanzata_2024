import express, { Request, Response, NextFunction } from 'express';
import parcheggioRoutes from './routes/parcheggioRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

// Middleware per il parsing del JSON
app.use(express.json());

// Middleware per il parsing di URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ...
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Collegamento delle route del parcheggio
app.use('/api', parcheggioRoutes);

// Middleware per la gestione degli errori
app.use(errorHandler);

// TODO:dbbiamo usare in nostro errorHandler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log('Server is running at http://localhost:${port}');
  console.log('Port number:', port);
});

export default app;