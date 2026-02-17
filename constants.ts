
import { Sector, PrayerWindow, HijriMonthData } from './types';

// Makkah Coordinates
export const MAKKAH_LON = 39.8262;
export const MAKKAH_LAT = 21.4225;

// MMT Configuration
export const SECTOR_WIDTH = 36.0; // 360 degrees / 10 decas
export const MMT_OFFSET_UTC = 3; // UTC+3

// Day Count Offset to align with aesthetic goal (approx MJD + offset to reach ~543k)
// MJD today is approx 60300. We add ~482900 to get to a cool "543,210" range for the demo logic
export const DAY_COUNT_OFFSET = 482910; 

export const SECTORS: Sector[] = Array.from({ length: 10 }, (_, i) => {
  // Sector 0 is Makkah.
  // Sector index increases Eastward.
  // Center = MakkahLon + (i * 36)
  // Normalize to -180 to 180
  let center = MAKKAH_LON + (i * 36);
  if (center > 180) center -= 360;
  
  // Naming logic based on approximate locations
  let name = `Sector ${i}`;
  if (i === 0) name = "0: Makkah Prime";
  if (i === 1) name = "1: Indus / Ural";
  if (i === 2) name = "2: Mekong / Baikal";
  if (i === 3) name = "3: Nippon / Oceania";
  if (i === 4) name = "4: Pacific Central";
  if (i === 5) name = "5: Hawaii / Alaska";
  if (i === 6) name = "6: Rockies / Andes"; // Boulder (105W) matches closely here
  if (i === 7) name = "7: Mississippi / Amazon";
  if (i === 8) name = "8: Atlantic / Greenland";
  if (i === 9) name = "9: Maghreb / Albion";

  return {
    id: i,
    name,
    centerLon: center,
    offset: i, 
  };
});

export const PRAYER_WINDOWS: PrayerWindow[] = [
  { name: 'Fajr', startDeca: 2.20, color: '#10b981' }, // Emerald
  { name: 'Dhuhr', startDeca: 5.20, color: '#fbbf24' }, // Amber/Gold
  { name: 'Asr', startDeca: 6.50, color: '#f59e0b' },
  { name: 'Maghrib', startDeca: 7.80, color: '#ef4444' }, // Red/Sunset
  { name: 'Isha', startDeca: 8.80, color: '#6366f1' }, // Indigo/Night
];

export const HIJRI_MONTHS: HijriMonthData[] = [
  {
    number: 1,
    name: "Muharram - Forbidden",
    persona: "Vita",
    baseClock: "Base 1.324... (Plastic)",
    domain: "Life Sciences, Agriculture & Medicine",
    letters: [
      { char: "ب", name: "ba", type: "moon" },
      { char: "س", name: "sin", type: "sun" },
      { char: "م", name: "mim", type: "moon" }
    ],
    season: "Lucas Primus; Abacus",
    freq: "F# - 369.99 Hz",
    colorType: "Primary Subtractive",
    honeycomb: "Cubic, Rectified Cubic",
    hexColor: "#991b1b" // Deep Red
  },
  {
    number: 2,
    name: "Safar - Void",
    persona: "Gnara",
    baseClock: "Base 1.220... (Quartic)",
    domain: "Theology, Philosophy, & Experientials",
    letters: [
      { char: "ا", name: "alif", type: "moon" },
      { char: "ل", name: "lam", type: "sun" }
    ],
    season: "Lucas Secundus; Depth",
    freq: "G - 392.005 Hz",
    colorType: "Secondary",
    honeycomb: "Bitruncated Cubic",
    hexColor: "#7c3aed" // Violet
  },
  {
    number: 3,
    name: "Rabi'l - First Spring",
    persona: "Doma",
    baseClock: "Base 1.167... (Quintic)",
    domain: "Hearth, Home & Community",
    letters: [
      { char: "ه", name: "ha", type: "moon" },
      { char: "ر", name: "ra", type: "sun" }
    ],
    season: "Lucus Tertius; Fango",
    freq: "G# - 415.30 Hz",
    colorType: "Primary Additive",
    honeycomb: "Cantitruncated Cubic",
    hexColor: "#ef4444" // Red-Orange
  },
  {
    number: 4,
    name: "Rabi'll - Second Spring",
    persona: "Necta",
    baseClock: "Base 1.618... (Phi)",
    domain: "Matter, Mass, Gravity & Physics (Islam)",
    letters: [
      { char: "ح", name: "ha", type: "moon" },
      { char: "ن", name: "nun", type: "sun" }
    ],
    season: "Lucas Quaternius; Helio",
    freq: "A - 440.00 Hz",
    colorType: "Tertiary",
    honeycomb: "Runcitruncated Cubic",
    hexColor: "#f97316" // Orange
  },
  {
    number: 5,
    name: "Jumada I - First Summer",
    persona: "Lusa",
    baseClock: "Base 2 (Binary)",
    domain: "Entertainment, Recreation & Sports",
    letters: [
      { char: "ي", name: "ya", type: "moon" },
      { char: "د", name: "dal", type: "sun" }
    ],
    season: "Nemus Primus; Jocky",
    freq: "A# - 466.16 Hz",
    colorType: "Primary Subtractive",
    honeycomb: "Tetrahedral-Octahedral",
    hexColor: "#eab308" // Yellow-Gold
  },
  {
    number: 6,
    name: "Jumada II - Second Summer",
    persona: "Flecta",
    baseClock: "Base 2.718... (Euler's)",
    domain: "Energy, Electromagnetism & Maths (Iman)",
    letters: [
      { char: "ع", name: "ain", type: "moon" },
      { char: "و", name: "waw", type: "moon" }
    ],
    season: "Nemus Secundus; Lumen",
    freq: "B - 493.881 Hz",
    colorType: "Tertiary",
    honeycomb: "Truncated Tetrahedral",
    hexColor: "#facc15" // Yellow
  },
  {
    number: 7,
    name: "Rajab - Respected",
    persona: "Educa",
    baseClock: "Base 3",
    domain: "Education, Research & Training",
    letters: [
      { char: "ك", name: "kaf", type: "moon" },
      { char: "ق", name: "qaf", type: "moon" },
      { char: "ص", name: "sad", type: "sun" }
    ],
    season: "Nemus Tertius; Noble",
    freq: "C - 523.25 Hz",
    colorType: "Secondary",
    honeycomb: "Cantellated Tetrahedral",
    hexColor: "#22c55e" // Green
  },
  {
    number: 8,
    name: "Sha'ban - Dispersion",
    persona: "Plecta",
    baseClock: "Base 3.1415... (Pi)",
    domain: "Spacetime, Strong/Weak Force & Language",
    letters: [
      { char: "ط", name: "ta", type: "sun" },
      { char: "ذ", name: "dhal", type: "sun" }
    ],
    season: "Nemus Quaternius; Pique",
    freq: "C# - 554.37 Hz",
    colorType: "Primary Additive",
    honeycomb: "Runcitruncated Tetrahedral",
    hexColor: "#10b981" // Emerald/Green-Cyan
  },
  {
    number: 9,
    name: "Ramadan - Burning Heat",
    persona: "Industria",
    baseClock: "Base 4",
    domain: "Industry, Business & Markets",
    letters: [
      { char: "ت", name: "ta", type: "sun" },
      { char: "ش", name: "shin", type: "sun" }
    ],
    season: "Saltus Primus; Rebus",
    freq: "D - 587.33 Hz",
    colorType: "Primary Subtractive",
    honeycomb: "Triangular Prismatic",
    hexColor: "#0ea5e9" // Sky Blue
  },
  {
    number: 10,
    name: "Shawwal - Raised",
    persona: "Imperia",
    baseClock: "Base 5",
    domain: "Governance, Administration & Authorities",
    letters: [
      { char: "ز", name: "zay", type: "sun" },
      { char: "غ", name: "ghayn", type: "moon" }
    ],
    season: "Saltus Secundus; Turbo",
    freq: "D# - 622.25 Hz",
    colorType: "Tertiary",
    honeycomb: "Truncated Triangular",
    hexColor: "#06b6d4" // Cyan/Teal
  },
  {
    number: 11,
    name: "Dhu al-Qa'dah - Sitting",
    persona: "Civia",
    baseClock: "Base 6",
    domain: "Civics, Public Infrastructure & Services",
    letters: [
      { char: "ض", name: "dad", type: "sun" },
      { char: "ج", name: "jim", type: "moon" },
      { char: "ف", name: "fa", type: "moon" }
    ],
    season: "Saltus Tertius; Views",
    freq: "E - 659.26 Hz",
    colorType: "Primary Additive",
    honeycomb: "Cantitruncated Triangular",
    hexColor: "#3b82f6" // Blue
  },
  {
    number: 12,
    name: "Dhu al-Hijjah - Pilgrimage",
    persona: "Saxa",
    baseClock: "Base 7",
    domain: "Exploration, Colonization & Cartography",
    letters: [
      { char: "ث", name: "tha", type: "sun" },
      { char: "خ", name: "kha", type: "moon" },
      { char: "ظ", name: "dha", type: "sun" }
    ],
    season: "Saltus Quaternius; Xyztus",
    freq: "F - 698.46 Hz",
    colorType: "Secondary",
    honeycomb: "Truncated Hexagonal",
    hexColor: "#6366f1" // Indigo
  }
];
