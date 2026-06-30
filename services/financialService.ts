import { db } from './persistence';
import { CropExpense, CropIncome } from '../types';

export class FinancialService {
  static async getAllExpenses(): Promise<CropExpense[]> {
    return await db.getCropExpenses();
  }

  static async getExpensesByCrop(cropId: string): Promise<CropExpense[]> {
    const all = await db.getCropExpenses();
    return all.filter(e => e.cropId === cropId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async addExpense(data: Omit<CropExpense, 'id'>): Promise<CropExpense[]> {
    if (!data.cropId || !data.category || data.amount <= 0) {
      throw new Error("Invalid expense: cropId, category, and amount > 0 required.");
    }
    const current = await db.getCropExpenses();
    const newExpense: CropExpense = {
      ...data,
      id: db.generateId('exp'),
      date: data.date || new Date().toISOString()
    };
    const updated = [newExpense, ...current];
    await db.saveCropExpenses(updated);
    return updated;
  }

  static async deleteExpense(id: string): Promise<CropExpense[]> {
    const current = await db.getCropExpenses();
    const updated = current.filter(e => e.id !== id);
    await db.saveCropExpenses(updated);
    return updated;
  }

  static async deleteExpensesByCrop(cropId: string): Promise<CropExpense[]> {
    const current = await db.getCropExpenses();
    const updated = current.filter(e => e.cropId !== cropId);
    await db.saveCropExpenses(updated);
    return updated;
  }

  static async getAllIncomes(): Promise<CropIncome[]> {
    return await db.getCropIncomes();
  }

  static async getIncomesByCrop(cropId: string): Promise<CropIncome[]> {
    const all = await db.getCropIncomes();
    return all.filter(i => i.cropId === cropId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async addIncome(data: Omit<CropIncome, 'id'>): Promise<CropIncome[]> {
    if (!data.cropId || !data.type || data.totalAmount <= 0) {
      throw new Error("Invalid income: cropId, type, and totalAmount > 0 required.");
    }
    const current = await db.getCropIncomes();
    const newIncome: CropIncome = {
      ...data,
      id: db.generateId('inc'),
      date: data.date || new Date().toISOString()
    };
    const updated = [newIncome, ...current];
    await db.saveCropIncomes(updated);
    return updated;
  }

  static async deleteIncome(id: string): Promise<CropIncome[]> {
    const current = await db.getCropIncomes();
    const updated = current.filter(i => i.id !== id);
    await db.saveCropIncomes(updated);
    return updated;
  }

  static async deleteIncomesByCrop(cropId: string): Promise<CropIncome[]> {
    const current = await db.getCropIncomes();
    const updated = current.filter(i => i.cropId !== cropId);
    await db.saveCropIncomes(updated);
    return updated;
  }
}
