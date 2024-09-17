import { Request, Response, NextFunction } from 'express';
import CsvService from '../ext/csvExportService';
import PdfService from '../ext/pdfExportService';
import pdfStatisticheService from '../ext/pdfStatisticheService';
import csvStaticticheService from '../ext/csvStaticticheService';
import TransitoExportRepository from '../repositories/transitoExportRepository';
import statisticheRepository from '../repositories/statisticheRepository';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';

class TransitiExportController {
  // Rotta per ottenere i transiti in formato CSV o PDF
  public async exportTransiti(req: Request, res: Response, next: NextFunction) {
    try {
      const { targhe, from, to, formato } = req.body;
      const user = (req as any).user;
      console.log('Parametri ricevuti:', { targhe, from, to, formato });

      if (!targhe || !from || !to) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'Targhe, from e to sono richiesti'
        );
      }

      // Ottenere i transiti dal repository
      const transiti =
        await TransitoExportRepository.findTransitiByTargheAndPeriodo(
          targhe as string[],
          new Date(from as string),
          new Date(to as string),
          user.id,
          user.ruolo
        );

      if (transiti.length === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Nessun transito trovato per i parametri forniti'
        );
      }

      // Generazione del file in base al formato specificato
      if (formato === 'csv') {
        const csv = await CsvService.generaCsv(transiti);
        res.header('Content-Type', 'text/csv');
        res.attachment('transiti.csv');
        return res.send(csv);
      } else if (formato === 'pdf') {
        const pdf = await PdfService.generaPdf(transiti);
        res.header('Content-Type', 'application/pdf');
        res.attachment('transiti.pdf');
        return res.send(pdf);
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'Formato non supportato. Usa "csv" o "pdf".'
        );
      }
    } catch (error) {
      console.error('Errore nella rotta exportTransiti:', error);
      next(error);
    }
  }

  public async getStatistiche(req: Request, res: Response, next: NextFunction) {
    try {
      const { from, to, formato } = req.body;

      if (!from || !to) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'From e to sono richiesti'
        );
      }

      // Calcolare le statistiche
      const statistiche = await statisticheRepository.calcolaStatistiche(
        new Date(from as string),
        new Date(to as string)
      );

      // Generazione del file in base al formato specificato
      if (formato === 'csv') {
        const csv = await csvStaticticheService.generaCsv(statistiche);
        res.header('Content-Type', 'text/csv');
        res.attachment('statistiche.csv');
        return res.send(csv);
      } else if (formato === 'pdf') {
        const pdf = await pdfStatisticheService.generaPdf(statistiche);
        res.header('Content-Type', 'application/pdf');
        res.attachment('statistiche.pdf');
        return res.send(pdf);
      } else if (formato === 'json') {
        return res.json(statistiche);
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'Formato non supportato. Usa "csv", "pdf" o "json".'
        );
      }
    } catch (error) {
      console.error('Errore nella rotta getStatistiche:', error);
      next(error);
    }
  }

  public async getStatistichePerParcheggio(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { idParcheggio, from, to } = req.body;

      if (!idParcheggio || !from || !to) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'idParcheggio, from e to sono richiesti'
        );
      }

      // Calcolare le statistiche per il parcheggio specificato
      const statistiche =
        await statisticheRepository.calcolaStatistichePerParcheggio(
          idParcheggio,
          new Date(from as string),
          new Date(to as string)
        );

      return res.json(statistiche);
    } catch (error) {
      console.error('Errore nella rotta getStatistichePerParcheggio:', error);
      next(error);
    }
  }
}

export default new TransitiExportController();
