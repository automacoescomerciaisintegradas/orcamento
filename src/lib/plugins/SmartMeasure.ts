import { registerPlugin } from '@capacitor/core';

export interface SmartMeasurePlugin {
  /**
   * Tira uma "foto" e calcula a área da parede segmentada através da NPU.
   * Suporta detecção de vãos (janelas/portas) para desconto.
   */
  measureArea(options: { 
    image: string; 
    referenceSize: number; 
  }): Promise<{ 
    grossArea: number; 
    netArea: number; 
    openings: Array<{ id: string; type: string; area: number }>;
  }>;
}

const SmartMeasure = registerPlugin<SmartMeasurePlugin>('SmartMeasure');

export default SmartMeasure;
