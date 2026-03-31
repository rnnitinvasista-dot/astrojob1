import type { Planet } from '../types/astrology';

export type Grade = 'A++' | 'A+' | 'A' | 'B' | 'C' | 'LOW' | 'MEDIUM' | 'GOOD' | 'VERY GOOD' | 'EXCELLENT';

export interface VargaResult {
    field: string;
    planet?: string;
    grade?: Grade | string;
    result: string;
    points?: number;
    parihara?: string;
}

const SIGN_RULERS: Record<string, string> = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
};

const getSignIndex = (sign: string) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs.indexOf(sign);
};

const getHouse = (planetSign: string, ascSign: string) => {
    const pIdx = getSignIndex(planetSign);
    const aIdx = getSignIndex(ascSign);
    if (pIdx === -1 || aIdx === -1) return 1;
    return ((pIdx - aIdx + 12) % 12) + 1;
};

// D2 (Hora) Logic
export const calculateD2Result = (vargaPlanets: any[], vargaAsc: any): VargaResult[] => {
    let points = 0;
    const ascSign = vargaAsc.sign;
    const lagnadipathi = ascSign === 'Cancer' ? 'Moon' : 'Sun';
    
    // 01. IF LAGNA ADIPATHI IN LAGNA +100
    const lpInVarga = vargaPlanets.find(p => p.planet === lagnadipathi);
    if (lpInVarga && lpInVarga.sign === ascSign) {
        points += 100;
    }

    // 03. JU, ME, VE in Lagna +25
    vargaPlanets.forEach(p => {
        if (['Jupiter', 'Mercury', 'Venus'].includes(p.planet) && p.sign === ascSign) {
            points += 25;
        }
    });

    // 04. MA in Simha +25
    const mars = vargaPlanets.find(p => p.planet === 'Mars');
    if (mars && mars.sign === 'Leo') points += 25;

    // 05. JU in Karkataka +25
    const jupiter = vargaPlanets.find(p => p.planet === 'Jupiter');
    if (jupiter && jupiter.sign === 'Cancer') points += 25;

    // MINUS POINTS
    // 01. MA in Karkataka -10
    if (mars && mars.sign === 'Cancer') points -= 10;

    // 02-04. SA, RA, KE in Lagna -25
    vargaPlanets.forEach(p => {
        if (['Saturn', 'Rahu', 'Ketu'].includes(p.planet) && p.sign === ascSign) {
            points -= 25;
        }
    });

    let result = "BALANCED LIFE AND BEST INCOME";
    let grade: Grade = 'A';
    if (Math.abs(points) > 150) {
        result = "EXCESS LAVISH OR EXCESS SAVING (WHICH IS UNHEALTHY)";
        grade = 'B';
    } else if (Math.abs(points) > 50) {
        result = "MEDIUM WEALTH TO THE LIFE";
        grade = 'A+';
    } else if (points >= 100) {
        result = "EXCELLENT WEALTH AND LUXURY";
        grade = 'A++';
    } else if (points < 0) {
        grade = 'C';
    }

    return [{
        field: "Wealth & Life Quality",
        points,
        result,
        grade
    }];
};

// D4 (Chaturthamsa) Logic
export const calculateD4Result = (vargaPlanets: any[], vargaAsc: any, natalPlanets: Planet[]): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const ascSignNatal = natalPlanets.find(p => p.planet === 'Ascendant')?.sign || 'Aries';
    const lagnadipathi = SIGN_RULERS[ascSignNatal];

    const getGrade = (h: number, type: 'LP' | 'SA' | 'VE' | 'MA'): Grade => {
        if (type === 'LP' && h === 4) return 'A++';
        if ([1, 5, 9, 11].includes(h)) return 'A+';
        if (type === 'LP' && [7, 10].includes(h)) return 'A';
        if (type !== 'LP' && [4, 7, 10].includes(h)) return 'A';
        if ([2, 3].includes(h)) return 'B';
        return 'C';
    };

    const getResultText = (g: Grade) => {
        if (g === 'A++') return 'EXCELLENT';
        if (g === 'A+') return 'VERY GOOD';
        if (g === 'A') return 'GOOD';
        if (g === 'B') return 'MEDIUM';
        return 'LOW';
    };

    const results: VargaResult[] = [];
    
    // Lagnadipathi
    const lpV = vargaPlanets.find(p => p.planet === lagnadipathi);
    if (lpV) {
        const h = getHouse(lpV.sign, ascSign);
        const g = getGrade(h, 'LP');
        results.push({ field: "Education / Property", planet: lagnadipathi, grade: g, result: getResultText(g) });
    }

    // Saturn
    const saV = vargaPlanets.find(p => p.planet === 'Saturn');
    if (saV) {
        const h = getHouse(saV.sign, ascSign);
        const g = getGrade(h, 'SA');
        results.push({ field: "Agriculture Land", planet: "Saturn", grade: g, result: getResultText(g) });
    }

    // Venus
    const veV = vargaPlanets.find(p => p.planet === 'Venus');
    if (veV) {
        const h = getHouse(veV.sign, ascSign);
        const g = getGrade(h, 'VE');
        results.push({ field: "Comfort from Vehicle", planet: "Venus", grade: g, result: getResultText(g) });
    }

    // Mars
    const maV = vargaPlanets.find(p => p.planet === 'Mars');
    if (maV) {
        const h = getHouse(maV.sign, ascSign);
        const g = getGrade(h, 'MA');
        results.push({ field: "Money / Income from Property", planet: "Mars", grade: g, result: getResultText(g) });
    }

    return results;
};

// D6 (Disease) Logic
export const calculateD6Result = (vargaPlanets: any[], vargaAsc: any, natalPlanets: Planet[]): VargaResult[] => {
    const ascSignNatal = natalPlanets.find(p => p.planet === 'Ascendant')?.sign || 'Aries';
    const lagnadipathi = SIGN_RULERS[ascSignNatal];
    
    // Find 6th Lord from Natal Lagna
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const sixthSignIdx = (signs.indexOf(ascSignNatal) + 5) % 12;
    const sixthLord = SIGN_RULERS[signs[sixthSignIdx]];

    const diseaseMap: Record<string, string> = {
        "Sun": "Headache, Eyesight, Fever, Migraine, Heart, Acidity, Spinal Cord, Bile",
        "Moon": "Poor blood circulation, Heart, Cough/Cold, Depression, Fears, Phobia, Insomnia",
        "Mars": "Blood, Accidents, Operations, Bone marrow, Fracture, B.P., Varicose Veins, Fever",
        "Mercury": "Fits, Skin/Nerve, Deaf/Dumb, Psoriasis, Memory Loss, Alzheimer's, Parkinson's",
        "Jupiter": "Diabetes, Cholesterol, Lungs, Thyroid, Obesity, Jaundice, Liver",
        "Venus": "Kidney, PCOD, Spermatozoa, Fungus/Infection, Skin, Stones, Uterus",
        "Saturn": "Joint/Back pain, Spondylitis, Hair fall, Disc slip, Leprosy, Asthma, Snoring",
        "Rahu": "Incurable disease like Cancer, Aids, Operations, Hospitalization",
        "Ketu": "Allergies, Infections, Contagious disease, Piles, Fistula, Constipation"
    };

    const pariharaMap: Record<string, string> = {
        "Sun": "Wheat / Red Chilly / Copper Item",
        "Moon": "Rice / Water / Food to the Needy",
        "Mars": "Rock Sugar / Masoor Dal / Pepper",
        "Mercury": "Moong Dal / Green Gram / New Cloth to female child",
        "Jupiter": "Turmeric / Spiritual Books",
        "Venus": "Wash private parts with Curd and then water",
        "Saturn": "Black Kambli / Gingelly Oil / Construction items",
        "Rahu": "Garlic / Charcoal",
        "Ketu": "Onion"
    };

    const results: VargaResult[] = [];
    [lagnadipathi, sixthLord].forEach((planet, idx) => {
        results.push({
            field: idx === 0 ? "Lagnadipathi Lord (Main Health)" : "6th House Lord (Disease Source)",
            planet,
            result: diseaseMap[planet] || "General weakness",
            parihara: pariharaMap[planet]
        });
    });

    // Combined Rahu/Ketu check (Only one note as requested)
    const badNodes = vargaPlanets.filter(p => ['Rahu', 'Ketu'].includes(p.planet) && [6, 8, 12].includes(getHouse(p.sign, vargaAsc.sign)));
    if (badNodes.length > 0) {
        const names = badNodes.map(p => p.planet).join(" & ");
        results.push({ 
            field: "Critical Note: Nodes", 
            planet: names, 
            result: `${names} in challenging houses (6/8/12) indicates long-term chronic health patterns or unexpected hospitalizations. Precaution and regular health checkups are highly advised.` 
        });
    }

    return results;
};

// D7 (Child Birth) Logic
export const calculateD7Result = (vargaPlanets: any[], vargaAsc: any, natalPlanets: Planet[]): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const ascSignNatal = natalPlanets.find(p => p.planet === 'Ascendant')?.sign || 'Aries';
    const lagnadipathi = SIGN_RULERS[ascSignNatal];

    const lagnaChanceMap: Record<string, string> = {
        "Cancer": "HIGH", "Scorpio": "HIGH", "Pisces": "HIGH",
        "Taurus": "MEDIUM", "Libra": "MEDIUM", "Capricorn": "MEDIUM", "Aquarius": "MEDIUM",
        "Aries": "LOW", "Leo": "LOW", "Sagittarius": "LOW",
        "Gemini": "VERY LOW", "Virgo": "VERY LOW"
    };

    const results: VargaResult[] = [];
    results.push({ field: "Lagna Basis Chance", result: lagnaChanceMap[ascSign] || "MEDIUM" });

    const lpV = vargaPlanets.find(p => p.planet === lagnadipathi);
    if (lpV) {
        const h = getHouse(lpV.sign, vargaAsc.sign);
        let grade: Grade = 'C';
        if ([1, 4, 5, 7, 9, 10, 11].includes(h)) grade = 'A';
        else if ([2, 3].includes(h)) grade = 'B';
        results.push({ field: "Lagnadipathi Support", planet: lagnadipathi, grade, result: grade === 'A' ? "PROMOTES BIRTH" : "LOW CHANCE" });
    }

    const jupiter = vargaPlanets.find(p => p.planet === 'Jupiter');
    if (jupiter) {
        const h = getHouse(jupiter.sign, vargaAsc.sign);
        if ([1, 4, 5, 7, 9, 10, 11].includes(h)) {
            results.push({ field: "Karaka Jupiter", planet: "Jupiter", result: "PROMOTES CHILD BIRTH" });
        }
    }

    return results;
};

// D8 (Longevity) Logic
export const calculateD8Result = (vargaPlanets: any[], vargaAsc: any, natalPlanets: Planet[]): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const ascSignNatal = natalPlanets.find(p => p.planet === 'Ascendant')?.sign || 'Aries';
    const lagnadipathi = SIGN_RULERS[ascSignNatal];

    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const eighthSignIdx = (signs.indexOf(ascSignNatal) + 7) % 12;
    const eighthLord = SIGN_RULERS[signs[eighthSignIdx]];

    const getPoints = (h: number) => {
        if ([1, 5, 8, 9, 11].includes(h)) return 80;
        if ([4, 7, 10].includes(h)) return 70;
        if ([2, 3].includes(h)) return 50;
        return 40;
    };

    let totalPoints = 0;
    const lpV = vargaPlanets.find(p => p.planet === lagnadipathi);
    if (lpV) totalPoints += getPoints(getHouse(lpV.sign, ascSign));
    
    const eighthV = vargaPlanets.find(p => p.planet === eighthLord);
    if (eighthV) totalPoints += getPoints(getHouse(eighthV.sign, ascSign));

    const saturnV = vargaPlanets.find(p => p.planet === 'Saturn');
    if (saturnV) totalPoints += getPoints(getHouse(saturnV.sign, ascSign));

    const finalAge = Math.round(totalPoints / 2); // (LL + 8L + SA points) / 2 approx longevity
    let grade: Grade = 'B';
    if (finalAge > 80) grade = 'A++';
    else if (finalAge > 70) grade = 'A+';
    else if (finalAge > 60) grade = 'A';
    else if (finalAge < 40) grade = 'C';

    return [{
        field: "Longevity (D8)",
        grade,
        result: `${finalAge} YEARS (Calculated using strength of Lagnadipathi, 8th Lord & Saturn in D8 chart)`
    }];
};

// D10 (Dashamsa) Logic
export const calculateD10Result = (vargaPlanets: any[], vargaAsc: any, natalPlanets: Planet[]): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const ascSignNatal = natalPlanets.find(p => p.planet === 'Ascendant')?.sign || 'Aries';
    const lagnadipathi = SIGN_RULERS[ascSignNatal];

    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const tenthSignIdx = (signs.indexOf(ascSignNatal) + 9) % 12;
    const tenthLord = SIGN_RULERS[signs[tenthSignIdx]];

    const profMap: Record<string, string> = {
        "Sun": "Government, Medicine, Commission, Authority, Forest Dept",
        "Moon": "Import-Export, Dairy, Chemistry, Arts, Navy, Water",
        "Mars": "Dentist, Wrestling, Engineering, Surgeons, Chemist",
        "Mercury": "Editors, Publishers, Computer, Communication, CA",
        "Jupiter": "Law, Admin, Religion, Education, Preachers, Astrology",
        "Venus": "Music, Art, Acting, Luxury, Jewellery, Hotel",
        "Saturn": "Land, Mining, History, Iron/Steel, Digger"
    };

    const results: VargaResult[] = [];
    [lagnadipathi, tenthLord].forEach((planet, idx) => {
        const pV = vargaPlanets.find(p => p.planet === planet);
        if (pV) {
            const h = getHouse(pV.sign, ascSign);
            let grade: Grade = 'C';
            if ([1, 2, 4, 6, 7, 9, 10, 11].includes(h)) grade = 'A+';
            else if ([3, 5].includes(h)) grade = 'A';
            else grade = 'B';
            
            results.push({
                field: idx === 0 ? "Self Strength (Lagnadipathi)" : "Career Pivot (10th Lord)",
                planet,
                grade,
                result: profMap[planet] || "Standard Profession"
            });
        }
    });

    return results;
};

// D11 (Rudramsa) Logic
export const calculateD11Result = (vargaPlanets: any[], vargaAsc: any, natalPlanets: Planet[]): VargaResult[] => {
    const ascSignNatal = natalPlanets.find(p => p.planet === 'Ascendant')?.sign || 'Aries';
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const eleventhSignIdx = (signs.indexOf(ascSignNatal) + 10) % 12;
    const eleventhLord = SIGN_RULERS[signs[eleventhSignIdx]];
    const lagnadipathi = SIGN_RULERS[ascSignNatal];

    const results: VargaResult[] = [];
    const pV = vargaPlanets.find(p => p.planet === eleventhLord);
    const lpV = vargaPlanets.find(p => p.planet === lagnadipathi);

    if (pV) {
        const h = getHouse(pV.sign, vargaAsc.sign);
        let grade: Grade = 'LOW';
        if ([2, 11].includes(h)) grade = 'EXCELLENT';
        else if ([1, 4, 5, 7, 9, 10].includes(h)) grade = 'A+';
        else if ([3, 6].includes(h)) grade = 'MEDIUM';
        
        results.push({ 
            field: "Primary Wealth Inflow (11th Lord)", 
            planet: eleventhLord, 
            grade, 
            result: `GAINS STATUS: ${grade}. Main wealth comes through your primary pursuits.` 
        });
    }

    if (lpV) {
        const h = getHouse(lpV.sign, vargaAsc.sign);
        let grade: Grade = 'LOW';
        if ([1, 5, 9, 11].includes(h)) grade = 'A+';
        else if ([4, 7, 10].includes(h)) grade = 'A';
        else grade = 'MEDIUM';

        results.push({
            field: "Self-Effort Gains (Lagnadipathi)",
            planet: lagnadipathi,
            grade,
            result: `Self wealth and savings status: ${grade}. Focus on personal skills to increase income.`
        });
    }

    return results;
};

// D12 (Parents) Logic
export const calculateD12Result = (vargaPlanets: any[], vargaAsc: any, natalPlanets: Planet[]): VargaResult[] => {
    const ascSignNatal = natalPlanets.find(p => p.planet === 'Ascendant')?.sign || 'Aries';
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const fourthLord = SIGN_RULERS[signs[(signs.indexOf(ascSignNatal) + 3) % 12]];
    const ninthLord = SIGN_RULERS[signs[(signs.indexOf(ascSignNatal) + 8) % 12]];
    const lagnadipathi = SIGN_RULERS[ascSignNatal];

    const getGrade = (h: number, type: 'LP' | 'F4'): Grade => {
        if (type === 'LP' && [1, 5, 9, 11].includes(h)) return 'A+';
        if (type === 'F4' && [1, 4, 5, 9, 11].includes(h)) return 'A+';
        if ([4, 7, 10].includes(h)) return 'A';
        if ([2, 3].includes(h)) return 'B';
        return 'C';
    };

    const results: VargaResult[] = [];
    
    // Lagnadipathi (Both)
    const lpV = vargaPlanets.find(p => p.planet === lagnadipathi);
    if (lpV) {
        const h = getHouse(lpV.sign, vargaAsc.sign);
        const g = getGrade(h, 'LP');
        results.push({ field: "Support: Both Parents", planet: lagnadipathi, grade: g, result: `${g} SUPPORT` });
    }

    // 4th Lord (Mother)
    const fV = vargaPlanets.find(p => p.planet === fourthLord);
    if (fV) {
        const h = getHouse(fV.sign, vargaAsc.sign);
        const g = getGrade(h, 'F4');
        results.push({ field: "Support: Mother", planet: fourthLord, grade: g, result: `${g} SUPPORT` });
    }

    // 9th Lord (Father)
    const nV = vargaPlanets.find(p => p.planet === ninthLord);
    if (nV) {
        const h = getHouse(nV.sign, vargaAsc.sign);
        const g = getGrade(h, 'LP'); // 9th follows LP logic in PDF
        results.push({ field: "Support: Father", planet: ninthLord, grade: g, result: `${g} SUPPORT` });
    }

    return results;
};
