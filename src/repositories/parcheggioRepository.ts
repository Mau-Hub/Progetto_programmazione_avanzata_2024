import ParcheggioDao from '../dao/parcheggioDao';
import Parcheggio from '../models/parcheggio';
import Posto from '../models/posto';
import Varco from '../models/varco';


interface ParcheggioData {
  nome: string;
  capacita: number;
  varchi?: { tipo: 'INGRESSO' | 'USCITA'; bidirezionale: boolean }[];
}

class ParcheggioRepository {
  async create(data: ParcheggioData): Promise<Parcheggio> {
    const { nome, capacita, varchi } = data;
  
    // Crea il nuovo parcheggio tramite DAO, id sarà generato automaticamente
    const nuovoParcheggio = await ParcheggioDao.create({ nome, capacita });
  
    // Se ci sono varchi, li crea e li associa al parcheggio
    if (varchi && varchi.length > 0) {
      await Promise.all(
        varchi.map((varco) =>
          Varco.create({
            tipo: varco.tipo,
            bidirezionale: varco.bidirezionale,
            id_parcheggio: nuovoParcheggio.id, // Associa i varchi al parcheggio appena creato
          })
        )
      );
    }

    // Ritorna il parcheggio con i varchi associati
    const parcheggioConVarchi = await ParcheggioDao.findById(nuovoParcheggio.id);
    if (!parcheggioConVarchi) {
      throw new Error('Parcheggio non trovato');
    }
    return parcheggioConVarchi;
  }

  async findById(id: number): Promise<Parcheggio | null> {
    return await ParcheggioDao.findById(id);
  }

  async findAll(): Promise<Parcheggio[]> {
    return await ParcheggioDao.findAll();
  }

  async update(id: number, data: ParcheggioData): Promise<boolean> {
    const parcheggio = await ParcheggioDao.findById(id);
    if (!parcheggio) {
      throw new Error('Parcheggio non trovato');
    }

    const { nome, capacita, varchi } = data;
    await ParcheggioDao.update(id, { nome, capacita });

    // Aggiorna anche i varchi
    if (varchi && varchi.length > 0) {
      // Prima elimina tutti i varchi associati a questo parcheggio
      await Varco.destroy({ where: { id_parcheggio: id } });

      // Poi ricrea i varchi con i nuovi dati
      await Promise.all(
        varchi.map((varco) =>
          Varco.create({
            tipo: varco.tipo,
            bidirezionale: varco.bidirezionale,
            id_parcheggio: id, // Associa i nuovi varchi al parcheggio esistente
          })
        )
      );
    }

    return true;
  }

  async delete(id: number): Promise<boolean> {
    const parcheggio = await ParcheggioDao.findById(id);
    if (!parcheggio) {
      throw new Error('Parcheggio non trovato');
    }

    // Elimina prima tutti i varchi associati al parcheggio
    await Varco.destroy({ where: { id_parcheggio: id } });
    
    // Elimina il parcheggio
    return await ParcheggioDao.delete(id);
  }

  async checkPostiDisponibili(parcheggioId: number): Promise<boolean> {
    const postiLiberi = await Posto.count({
      where: {
        id_parcheggio: parcheggioId,
        stato: 'libero'
      }
    });
    return postiLiberi > 0;
  }
}

export default new ParcheggioRepository();
