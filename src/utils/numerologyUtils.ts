import { 
  LUCKY_NUMBERS_PER_NUMBER, 
  LUCKY_COLORS_PER_NUMBER, 
  BEST_LUCKY_NUMBERS, 
  NUMEROLOGY_COMBINATIONS,
  MAHURTHAM_SCHEDULES,
  MOBILE_VALIDATION_RULES,
  ARROW_DEFINITIONS
} from './numerologyData';

export const reduceToSingleDigit = (num: number): number => {
  if (num === 0) return 0;
  let result = num;
  while (result > 9) {
    result = String(result).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result;
};
export const calculateBirthNumber = (dob: string): number => {
  const parts = dob.split('-');
  const day = parseInt(parts[2]);
  return reduceToSingleDigit(day);
};

export const calculateDestinyNumber = (dob: string): number => {
  const digits = dob.replace(/-/g, '').split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
};

export const generateSoulNumberPyramid = (dob: string): number[][] => {
  // Input: YYYY-MM-DD. Need: DDMMYYYY
  const parts = dob.split('-');
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  const digitString = day + month + year;
  const digits = digitString.split('').map(Number);
  const pyramid: number[][] = [digits];

  let currentLevel = digits;
  while (currentLevel.length > 1) {
    const nextLevel: number[] = [];
    for (let i = 0; i < currentLevel.length - 1; i++) {
      nextLevel.push(reduceToSingleDigit(currentLevel[i] + currentLevel[i + 1]));
    }
    pyramid.push(nextLevel);
    currentLevel = nextLevel;
  }

  return pyramid; 
};

export const calculateSoulNumber = (_name: string, dob: string): number => {
  const pyramid = generateSoulNumberPyramid(dob);
  const topValue = pyramid[pyramid.length - 1][0];
  return topValue;
};

export const calculateCurrentYearNumber = (dob: string) => {
  const parts = dob.split('-').map(Number);
  const birthMonth = parts[1];
  const birthDay = parts[2];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  // Logic: Current year means whichever is running until the person's birth date come
  let runningYear = currentYear;
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    runningYear = currentYear - 1;
  }

  const yearDigits = String(runningYear).split('').map(Number);
  const dayDigits = String(birthDay).padStart(2, '0').split('').map(Number);
  const monthDigits = String(birthMonth).padStart(2, '0').split('').map(Number);
  
  const allDigits = [...dayDigits, ...monthDigits, ...yearDigits];
  const total = allDigits.reduce((a, b) => a + b, 0);
  const finalValue = reduceToSingleDigit(total);

  return {
    value: finalValue,
    runningYear: runningYear,
    breakdown: `${birthDay} + ${birthMonth} + ${runningYear} = ${total} -> ${finalValue}`
  };
};

export const generateLoshuGrid = (dob: string): Record<number, number> => {
  // Rule: Only use digits found directly in the DOB string. 
  // No derived numbers (Birth, Destiny, Soul) should be added.
  const digits = dob.replace(/-/g, '').split('').map(Number).filter(d => d !== 0);
  const grid: Record<number, number> = {};
  
  for (const d of digits) {
    grid[d] = (grid[d] || 0) + 1;
  }
  
  return grid;
};

export const analyzeArrows = (grid: Record<number, number>) => {
  const result: { name: string, isPresent: boolean, type: 'Strength' | 'Weakness' }[] = [];
  
  for (const arrow of ARROW_DEFINITIONS) {
    const presentCount = arrow.cells.filter(n => grid[n]).length;
    
    if (arrow.type === 'Strength') {
      if (presentCount === 3) {
        result.push({ name: arrow.name, isPresent: true, type: 'Strength' });
      }
    } else { // Weakness
      if (presentCount === 0) {
        result.push({ name: arrow.name, isPresent: true, type: 'Weakness' });
      }
    }
  }
  
  return result;
};
export const analyzeYinYang = (dob: string) => {
  const digits = dob.replace(/-/g, '').split('').map(Number).filter(d => d !== 0);
  const yinNums = [2, 4, 6, 8];
  const yangNums = [1, 3, 5, 7, 9];
  
  let yinCount = 0;
  let yangCount = 0;
  
  for (const d of digits) {
    if (yinNums.includes(d)) yinCount++;
    if (yangNums.includes(d)) yangCount++;
  }
  
  const total = yinCount + yangCount;
  return {
    yin: yinCount,
    yang: yangCount,
    yinPercent: total > 0 ? Math.round((yinCount / total) * 100) : 0,
    yangPercent: total > 0 ? Math.round((yangCount / total) * 100) : 0,
    summary: (yinCount > yangCount) ? "INDOOR ACTIVITY" : (yangCount > yinCount ? "OUTDOOR ACTIVITY" : "INDOOR ACTIVITY && OUTDOOR ACTIVITY MIXED")
  };
};

export const getLuckyInfo = (birthNum: number) => {
  const luckyNumbers = LUCKY_NUMBERS_PER_NUMBER[birthNum] || [];
  const bestLuckyNumbers = BEST_LUCKY_NUMBERS[birthNum] || [];
  const luckyColors = LUCKY_COLORS_PER_NUMBER[birthNum] || [];
  
  // Best colors for UI representation
  const bestLuckyColors = luckyColors.slice(0, 2);

  return {
    luckyNumbers,
    bestLuckyNumbers,
    luckyColors,
    bestLuckyColors
  };
};

export const getMahurthamDates = (category: keyof typeof MAHURTHAM_SCHEDULES, birthDay: number) => {
  const schedule = MAHURTHAM_SCHEDULES[category];
  const bStr = birthDay.toString();
  return (schedule as any)[bStr] || [];
};

export const checkMobileRules = (phone: string) => {
  const issues: string[] = [];
  if (!phone) return issues;
  
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.endsWith('0')) issues.push("Mobile number should never end with Zero (0)");
  
  const zeros = (cleanPhone.match(/0/g) || []).length;
  if (zeros > 2) issues.push("Mobile number should never contain more than 2 Zeros");
  
  const startsWith = cleanPhone[0];
  const endsWith = cleanPhone[cleanPhone.length - 1];
  
  const rules = MOBILE_VALIDATION_RULES;
  if ((rules.startConflicts as any)[startsWith]?.includes(endsWith)) {
    const forbidden = (rules.startConflicts as any)[startsWith];
    issues.push(`If mobile number starts with ${startsWith}, it should never end with ${forbidden.join(' or ')}`);
  }
  
  for (const group of rules.conflictPairs) {
    if (cleanPhone.includes(group)) {
      issues.push(`Conflict numbers ${group} should not be together`);
    }
  }
  for (const group of rules.conflictTriples) {
    if (cleanPhone.includes(group)) {
      issues.push(`Conflict numbers ${group} should not be together`);
    }
  }
  
  return issues;
};

export const checkVehicleRules = (vehicleNum: string) => {
  const issues: string[] = [];
  if (!vehicleNum) return issues;
  
  const cleanNum = vehicleNum.replace(/\D/g, '');
  if (cleanNum.endsWith('0')) issues.push("Vehicle number should never end with Zero (0)");
  if (cleanNum.endsWith('8')) issues.push("Vehicle number should never end with Eight (8)");
  
  return issues;
};

export const getCombinationLuckyInfo = (n1: number, n2: number) => {
  const key = `${n1}-${n2}`;
  return NUMEROLOGY_COMBINATIONS[key] || { numbers: [], colors: [] };
};

