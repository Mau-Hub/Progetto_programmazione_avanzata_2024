import ParcheggioDao from '../dao/parcheggioDao';
import Parcheggio from '../models/parcheggio';
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
    const parcheggioConVarchi = await ParcheggioDao.findById(
      nuovoParcheggio.id
    );
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

    // Calcola la differenza di capacità
    const differenzaCapacita = capacita - parcheggio.capacita;

    // Aggiorna il parcheggio
    await ParcheggioDao.update(id, { nome, capacita });

    // Aggiorna posti_disponibili in base alla differenza di capacità
    parcheggio.posti_disponibili += differenzaCapacita;

    // Assicurati che posti_disponibili non superi la nuova capacità
    if (parcheggio.posti_disponibili > capacita) {
      parcheggio.posti_disponibili = capacita;
    }

    // Salva le modifiche
    await parcheggio.save();

    // Aggiorna i varchi se necessario
    if (varchi && varchi.length > 0) {
      // Elimina i varchi esistenti
      await Varco.destroy({ where: { id_parcheggio: id } });

      // Crea i nuovi varchi
      await Promise.all(
        varchi.map((varco) =>
          Varco.create({
            tipo: varco.tipo,
            bidirezionale: varco.bidirezionale,
            id_parcheggio: id,
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
    const parcheggio = await ParcheggioDao.findById(parcheggioId);
    if (!parcheggio) {
      throw new Error('Parcheggio non trovato');
    }
    return parcheggio.posti_disponibili > 0;
  }
}

export default new ParcheggioRepository();
