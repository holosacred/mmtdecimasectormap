import { MMT_OFFSET_UTC, DAY_COUNT_OFFSET } from '../constants';
import { DecimaTime } from '../types';

/**
 * Calculates the current Global MMT (Makkah Time in Decima)
 */
export const getGlobalMMT = (): DecimaTime => {
  const now = new Date();
  
  // 1. Calculate UTC milliseconds
  const utcMillis = now.getTime();
  
  // 2. Adjust for Makkah (UTC+3)
  // We need to find the "start of the day" in Makkah to get the fraction.
  // Or simpler: (Hours*3600 + Min*60 + Sec) / 86400 * 10
  
  // Construct Makkah Date object
  // Create a date object adjusted by offset
  const makkahDate = new Date(utcMillis + (MMT_OFFSET_UTC * 3600 * 1000));
  
  const hours = makkahDate.getUTCHours();
  const minutes = makkahDate.getUTCMinutes();
  const seconds = makkahDate.getUTCSeconds();
  const millis = makkahDate.getUTCMilliseconds();
  
  const totalSecondsInDay = (hours * 3600) + (minutes * 60) + seconds + (millis / 1000);
  const dayFraction = totalSecondsInDay / 86400;
  
  const rawDeca = dayFraction * 10;
  
  const deca = Math.floor(rawDeca);
  const remainderAfterDeca = rawDeca - deca;
  
  const rawCent = remainderAfterDeca * 100;
  const cent = Math.floor(rawCent);
  
  const rawMillim = (rawCent - cent) * 1000;
  const millim = Math.floor(rawMillim);

  // Day Count Calculation
  // Using unix epoch days + offset
  const daysSinceEpoch = Math.floor(utcMillis / (86400 * 1000));
  const dayCount = daysSinceEpoch + DAY_COUNT_OFFSET;

  return {
    dayCount,
    deca,
    cent,
    millim,
    rawDeca
  };
};

/**
 * Calculates Local Sector Time given Global MMT and Sector ID (0-9)
 */
export const getSectorTime = (globalDeca: number, sectorId: number): number => {
  // S6 is East of S0. Solar time is ahead.
  // Local = (Global + SectorID) % 10
  let local = (globalDeca + sectorId) % 10;
  if (local < 0) local += 10;
  return local;
};

/**
 * Checks for numerical symmetry in the day count
 */
export const checkSymmetry = (dayCount: number): boolean => {
  const s = dayCount.toString();
  // Check for descending sequential (e.g. 543210)
  const sequentialDesc = "9876543210";
  if (sequentialDesc.includes(s)) return true;
  
  // Check for palindrome
  const rev = s.split('').reverse().join('');
  if (s === rev) return true;
  
  // Check for repeated digits (e.g. 555555)
  if (/^(\d)\1+$/.test(s)) return true;

  return false;
};
