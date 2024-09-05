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
    const nuovoParcheggio = await Parcheggio.create({ nome, capacita });

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

    return nuovoParcheggio;
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
