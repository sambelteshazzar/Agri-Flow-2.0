
import { db } from './persistence';
import { Crop } from '../types';

export class CropService {
  static async getAll(): Promise<Crop[]> {
    return await db.getCrops();
  }

  static async add(cropData: Omit<Crop, 'id'>): Promise<Crop[]> {
    // Backend Validation
    if (!cropData.name || !cropData.variety || cropData.area <= 0) {
      throw new Error("Invalid crop data: Name, Variety, and Area > 0 are required.");
    }

    const currentCrops = await db.getCrops();
    
    const newCrop: Crop = {
      ...cropData,
      id: db.generateId('crop'),
      biodiversityScore: cropData.biodiversityScore ?? 50,
      soilHealth: cropData.soilHealth || 'Unknown',
      waterEfficiency: cropData.waterEfficiency || 'Moderate',
      status: cropData.status || 'Healthy'
    };

    const updatedCrops = [newCrop, ...currentCrops];
    await db.saveCrops(updatedCrops);
    return updatedCrops;
  }

  static async delete(id: string): Promise<Crop[]> {
    const currentCrops = await db.getCrops();
    const updatedCrops = currentCrops.filter(c => c.id !== id);
    await db.saveCrops(updatedCrops);
    return updatedCrops;
  }

  static async updateStatus(id: string, status: Crop['status']): Promise<Crop[]> {
    const currentCrops = await db.getCrops();
    const updatedCrops = currentCrops.map(c => 
      c.id === id ? { ...c, status } : c
    );
    await db.saveCrops(updatedCrops);
    return updatedCrops;
  }

  static async update(id: string, data: Partial<Omit<Crop, 'id'>>): Promise<Crop[]> {
    const currentCrops = await db.getCrops();
    const updatedCrops = currentCrops.map(c =>
      c.id === id ? { ...c, ...data } : c
    );
    await db.saveCrops(updatedCrops);
    return updatedCrops;
  }

  /**
   * Calculates projected revenue based on area, soil health, and current market price.
   * This represents logic that would typically live on a backend server.
   */
  static async replaceAll(crops: Crop[]): Promise<Crop[]> {
    await db.saveCrops(crops);
    return crops;
  }

  static calculateProjectedYield(crop: Crop, marketPricePerUnit: number): number {
    // Base yield per acre (hypothetical generic unit)
    let baseYield = 100;

    // Modifiers based on soil health. 'Unknown' soil gets a small penalty so
    // it doesn't silently inherit the 'Good' multiplier — the user should be
    // incented to assess the plot rather than leave it unmeasured.
    if (crop.soilHealth === 'Excellent') baseYield *= 1.2;
    else if (crop.soilHealth === 'Good') baseYield *= 1.0;
    else if (crop.soilHealth === 'Degraded') baseYield *= 0.7;
    else baseYield *= 0.85; // Unknown

    // Modifiers based on water efficiency. Same logic — Unknown is not free.
    if (crop.waterEfficiency === 'High') baseYield *= 1.1;
    else if (crop.waterEfficiency === 'Moderate') baseYield *= 1.0;
    else if (crop.waterEfficiency === 'Low') baseYield *= 0.9;
    else baseYield *= 0.92; // Unknown — defensive fallback (CurrentCrop type
                             // only allows the three above, but legacy data
                             // may have other values)

    const totalYield = baseYield * crop.area;
    return Math.floor(totalYield * marketPricePerUnit);
  }
}
