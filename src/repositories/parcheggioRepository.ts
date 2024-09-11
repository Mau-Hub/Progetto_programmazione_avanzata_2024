import { DaoI } from '../dao/DaoI';
import Parcheggio from '../models/parcheggio';
import Varco from '../models/varco';

interface ParcheggioData {
  nome: string;
  capacita: number;
  varchi?: { tipo: 'INGRESSO' | 'USCITA'; bidirezionale: boolean }[];
}

class ParcheggioRepository implements DaoI<Parcheggio, number> {
  async create(data: ParcheggioData): Promise<Parcheggio> {
    const { nome, capacita, varchi } = data;
  
    // Crea il nuovo parcheggio
    const nuovoParcheggio = await Parcheggio.create({ nome, capacita });
  
    // Se ci sono varchi, li crea e li associa al parcheggio
    if (varchi && varchi.length > 0) {
      await Promise.all(
        varchi.map((varco) =>
          Varco.create({
            tipo: varco.tipo,
            bidirezionale: varco.bidirezionale,
            id_parcheggio: nuovoParcheggio.id,
          })
        )
      );
    }
  
    // Aggiunge al parcheggio i varchi e  lo restituisce
    const parcheggioConVarchi = await Parcheggio.findByPk(nuovoParcheggio.id, {
      include: [{ model: Varco, as: 'varchi' }],
    });
  
    // Gestione nel caso in cui il parcheggio non venga trovato
    if (!parcheggioConVarchi) {
      throw new Error('Parcheggio non trovato');
    }
  
    return parcheggioConVarchi;
  }
  

  async findById(id: number): Promise<Parcheggio | null> {
    return await Parcheggio.findByPk(id, {
      include: [{ model: Varco, as: 'varchi' }],
    });
  }

  async findAll(): Promise<Parcheggio[]> {
    return await Parcheggio.findAll({
      include: [{ model: Varco, as: 'varchi' }],
    });
  }

  async update(id: number, data: ParcheggioData): Promise<boolean> {
    const parcheggio = await Parcheggio.findByPk(id);
    if (!parcheggio) {
      throw new Error('Parcheggio non trovato');
    }

    const { nome, capacita, varchi } = data;
    await parcheggio.update({ nome, capacita });

    if (varchi && varchi.length > 0) {
      await Varco.destroy({ where: { id_parcheggio: id } });

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
    const parcheggio = await Parcheggio.findByPk(id);
    if (!parcheggio) {
      throw new Error('Parcheggio non trovato');
    }

    await Varco.destroy({ where: { id_parcheggio: id } });
    await parcheggio.destroy();

    return true;
  }
}

export default new ParcheggioRepository();
