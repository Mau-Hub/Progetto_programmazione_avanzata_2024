import express, { Request, Response, NextFunction } from 'express';
import authenticationRoute from './routes/authenticationRoute';
import parcheggioRoutes from './routes/parcheggioRoutes';
import varcoRoutes from './routes/varcoRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authenticationMiddleware } from './middleware/authenticationMiddleware';
import tariffaRoutes from './routes/tariffeRoutes';
import transitoRoutes from './routes/transitoRoutes';

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

// Route di autenticazione (non protette)
app.use('/api', authenticationRoute);

// Applica il middleware di autenticazione a tutte le altre route /api
app.use('/api', authenticationMiddleware);
// Collegamento delle route del parcheggio (ora protette dall'autenticazione)
app.use('/api', parcheggioRoutes);
app.use('/api', varcoRoutes);
app.use('/api', tariffaRoutes);
app.use('/api', transitoRoutes);

// Middleware per la gestione degli errori
app.use(errorHandler);

// Gestione delle route non trovate
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Not Found');
});

// Middleware per la gestione degli errori
app.use(errorHandler);

// TODO: MODIFICARE
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log('Server is running at http://localhost:${port}');
  console.log('Port number:', port);
});
export default app;