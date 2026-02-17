
export interface DecimaTime {
  dayCount: number;
  deca: number;
  cent: number;
  millim: number;
  rawDeca: number; // Float 0-10 representing time of day
}

export interface Sector {
  id: number;
  name: string;
  centerLon: number;
  offset: number; // Deca offset from Makkah
}

export interface PrayerWindow {
  name: string;
  startDeca: number; // The generic local decima time this prayer starts
  color: string;
}

export interface GeoJsonWorld {
  type: string;
  objects: {
    land: {
      type: string;
      geometries: any[];
    };
  };
  arcs: any[];
}

export type LetterType = 'sun' | 'moon';

export interface ArabicLetter {
  char: string;
  name: string;
  type: LetterType;
}

export interface HijriMonthData {
  number: number;
  name: string;
  persona: string;
  baseClock: string;
  domain: string;
  letters: ArabicLetter[];
  season: string;
  freq: string;
  colorType: string;
  honeycomb: string;
  hexColor: string; // For UI visualization
}
