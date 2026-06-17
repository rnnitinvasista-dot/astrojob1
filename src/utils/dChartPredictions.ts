/* Divisional Chart Prediction Logic - Strict Institutional Style 
   Updated: 2026-03-31 20:10 (Varga Lord Logic) */

export type Grade = 'A++' | 'A+' | 'A' | 'B' | 'C';

export interface VargaResult {
    field: string;
    planet?: string;
    grade?: Grade;
    result: string;
    parihara?: string;
}

const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const SIGN_RULERS: Record<string, string> = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
};

const getSignIndex = (sign: string) => {
    return signs.findIndex(s => s.toLowerCase() === sign.toLowerCase().trim());
};

const getShortPlanet = (longName: string | undefined) => {
    if (!longName) return '-';
    const map: Record<string, string> = {
        'Sun': 'SU', 'Moon': 'MO', 'Mars': 'MA', 'Mercury': 'ME', 
        'Jupiter': 'JU', 'Venus': 'VE', 'Saturn': 'SA', 'Rahu': 'RA', 'Ketu': 'KE'
    };
    return map[longName] || longName;
};

const DISEASE_MAP: Record<string, string> = {
    "Sun": "Headache, Eyesight problem, Fever, Migraine, Brain and Heart related Problem, Acidity, Spinal Cord, Loss of appetite, Bile, Sun stroke.",
    "Moon": "Poor blood circulation, Heart related Problem, Common Cough and Cold, Depression, Poor Eyesight, Fears and Phobia, Wetting in hand, Unconsciousness ( Coma ), Breast related problem, stomach problem, Insomnia.",
    "Mars": "All Blood related problem, Accidents, Operation to any part of body, Bone marrow, Fracture, Calcium deficiency, High BP and low BP, Varicose Veins, Tooth related problem, Nail problems, Fever.",
    "Mercury": "Fits or Epilepsy, Skin and Nerve problem, Deaf and Dumb, Psoriasis, White Patches, Varicose Veins, Ear Nose Throat Problems, Memory Loss, Alzimer's disease, Parkinson's disease.",
    "Jupiter": "Diabetes, Cholesterol, Lungs, Thyroid, Obesity, Jaundice, Liver problems, fat accumulation.",
    "Venus": "Kidney, PCOD, Spermatozoa, Fungus and Infection, Skin problem, White Patches, Stones, Urine and Uterus.",
    "Saturn": "De-formalities of a body, Joint and Back pain, Spondylitis, Hair fall and White hair, Disc slip, Leprosy, Asthma, Snoring, Knee pain, Insomnia, Leg pain.",
    "Rahu": "Incurable disease like Cancer, Aids, Disease which is difficult to diagnosis, Immunity, Bite of poisonous insects, Operations, Hospitalization.",
    "Ketu": "Allergies and Infections, BP, Contagious disease, Airborne disease, Infections, Amputations, Heat-related problems, Piles and Fistula, Intestine, Constipation."
};

const PARIHARA_MAP: Record<string, string> = {
    "Sun": "Wheat / Red Chilly / Copper Item.",
    "Moon": "Rice / Water / Food to the Needy.",
    "Mars": "Rock Sugar (Red Color) / Masoor Dal / Pepper / Keep Teeth Clean.",
    "Mercury": "Moong Dal / Green Gram / New Cloth to female Child below 9 yrs.",
    "Jupiter": "Turmeric / Spiritual Books.",
    "Venus": "Wash Private parts with Curd and then with Water.",
    "Saturn": "Black Kambli / Gingelly Oil / Items used for Construction.",
    "Rahu": "Garlic / Charcoal.",
    "Ketu": "Onion."
};

const PROFESSION_MAP: Record<string, string> = {
    "Sun": "GOVERNMENT JOB, MEDICINE, BROKERAGE OR COMMISSION, AUTHORITY AND POWER, DESIGNER, FOREST DEPARTMENT, ADMINISTRATOR.",
    "Moon": "IMPORT – EXPORT, DAIRY, CHEMISTRY, PHARMACY MEDICINE, MUSIC, ARTS, NAVY, WATER ANALYSIS.",
    "Mars": "DENTIST, WRESTLING, STEEL, IRON, SURGEONS, CHEMIST, ENGINEER.",
    "Mercury": "EDITORS, PUBLISHERS, JOURNALIST, COMPUTER RELATED JOB, COMMUNICATON RELATED JOB, CA.",
    "Jupiter": "LAW, ADMINISTRATION, RELIGION, FINANCE, EDUCATION, JUDGE, PREACHERS, ASTROLOGY, TEACHERS.",
    "Venus": "MUSIC, ENTERTAINMENT, ART, PAINTER, POET, ACTOR, HOTEL, FANCY ARTICLE, LUXURY ARTICLES, JEWELLERY.",
    "Saturn": "LAND, PROPERTY, MINING, COAL, JAIL, CREMATION, PHILOSOPHY, HISTORY, DIGGER, IRON AND STEEL INDUSTRY."
};

const getHouse = (planetSign: string, ascSign: string) => {
    const pIdx = getSignIndex(planetSign);
    const aIdx = getSignIndex(ascSign);
    if (pIdx === -1 || aIdx === -1) return 1;
    return (pIdx - aIdx + 12) % 12 + 1;
};

// D1 (Lagna) Logic - Basic Rashi details
export const calculateD1Result = (vargaPlanets: any[], vargaAsc: any): VargaResult[] => {
    const results: VargaResult[] = [];
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const ascSign = vargaAsc.sign;

    planets.forEach(pName => {
        const pV = vargaPlanets.find(p => p.planet === pName);
        if (pV) {
            const h = getHouse(pV.sign, ascSign);
            results.push({
                field: `${pName}::${pV.sign.toUpperCase()}`,
                planet: pName,
                grade: [1, 4, 5, 7, 9, 10].includes(h) ? 'A+' : 'A',
                result: `PLACED IN HOUSE ${h} OF D1.`
            });
        }
    });

    return results;
};

// D2 (Hora) Logic - Point Scoring System from Screenshots
export const calculateD2Result = (vargaPlanets: any[], vargaAsc: any): VargaResult[] => {
    const results: VargaResult[] = [];
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const ascSign = vargaAsc.sign;
    const lp = vargaAsc.sign_lord || 'Sun';
    let totalPoints = 0;

    planets.forEach(pName => {
        const pV = vargaPlanets.find(p => p.planet === pName);
        if (pV) {
            let pts = 0;
            const inLagna = pV.sign === ascSign;
            const inCancer = pV.sign === 'Cancer';
            const inLeo = pV.sign === 'Leo';

            // Logic Note 02 & 03
            if (pName === lp && inLagna) pts += 100;
            if (pName === lp && ( (pName === 'Sun' && inCancer) || (pName === 'Moon' && inLeo) )) pts += 0;
            if (['Jupiter', 'Mercury', 'Venus'].includes(pName) && inLagna) pts += 25;
            if (pName === 'Mars' && inLeo) pts += 25;
            if (pName === 'Jupiter' && inCancer) pts += 25;
            
            if (pName === 'Mars' && inCancer) pts -= 10;
            if (pName === 'Saturn' && inLagna) pts -= 25;
            if (pName === 'Rahu' && inLagna) pts -= 25;
            if (pName === 'Ketu' && inLagna) pts -= 25;

            totalPoints += pts;

            results.push({
                field: `${pName}::${inLagna ? "IN LAGNA" : (inCancer ? "IN CANCER" : (inLeo ? "IN LEO" : "OTHER"))}`,
                planet: pName,
                grade: pts >= 0 ? (pts > 0 ? 'A+' : 'A') : 'C',
                result: pts === 0 ? "0 POINTS" : `${pts > 0 ? '+' : ''}${pts} POINTS`
            });
        }
    });

    const getLifeResult = (pts: number): string => {
        if (pts >= -50 && pts <= 50) return "BALANCED OR BEST WEALTH LIFE";
        if ( (pts > 50 && pts <= 150) || (pts < -50 && pts >= -75) ) return "MEDIUM WEALTH LIFE";
        return "EXCESS LAVISH OR EXCESS SAVING WEALTH (WHICH IS BAD AS PER PARASHARA)";
    };

    results.push({
        field: `TOTAL::SCORING SUMMARY`,
        planet: "TOTAL",
        grade: 'A++',
        result: `${totalPoints} POINTS = ${getLifeResult(totalPoints)}`
    });

    return results;
};

// D4 (Chaturtamsa) Logic - Exact Screening matching PDF
export const calculateD4Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;
    
    const lp = SIGN_RULERS[signs[safeAIdx]];
    const saLord = "Saturn";
    const veLord = "Venus";
    const maLord = "Mars";

    const getD4Grade = (planet: string, house: number): Grade => {
        const isLp = planet === lp;
        if (isLp && house === 4) return 'A++';
        if ([1, 5, 9, 11].includes(house)) return 'A+';
        if (isLp && [7, 10].includes(house)) return 'A';
        if (!isLp && [4, 7, 10].includes(house)) return 'A';
        if ([2, 3].includes(house)) return 'B';
        return 'C';
    };

    const getD4Text = (grade: Grade): string => {
        if (grade === 'A++') return 'EXCELLENT';
        if (grade === 'A+') return 'VERY GOOD';
        if (grade === 'A') return 'GOOD';
        if (grade === 'B') return 'MEDIUM';
        return 'LOW';
    };

    const results: VargaResult[] = [];
    [
        { p: lp, f: "EDUCATION / PROPERTY", label: "LAGNADIPATHI" },
        { p: saLord, f: "AGRICULTURE LAND", label: "SATURN" },
        { p: veLord, f: "COMFORT FROM VEHICLE", label: "VENUS" },
        { p: maLord, f: "MONEY / INCOME FROM SITE OR BUILDING", label: "MARS" }
    ].forEach((item) => {
        const pV = vargaPlanets.find(p => p.planet === item.p);
        if (pV) {
            const h = getHouse(pV.sign, ascSign);
            const grade = getD4Grade(item.p, h);
            results.push({ 
                field: item.f, 
                planet: item.label, // Show the label in the House/Particulars col? No, screenshot says 'HOUSE' col shows Label.
                grade: grade, 
                result: getD4Text(grade)
            });
        }
    });

    // We need to pass the "House" label to the 'field' property because of how DChartResultTable is built.
    // In Screenshot:
    // HOUSE           | FIELD               | PLANET POSITION | GRADE | RESULT
    // LAGNADIPATHI    | EDUCATION / PROPERTY| 3               | B     | MEDIUM
    
    return results.map(r => ({
        ...r,
        field: `${r.planet}::${r.field}` // We'll split this in the Table component
    }));
};

// D5 (Panchamsha) Logic - Use Varga Lagna
export const calculateD5Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;

    const fifthLord = SIGN_RULERS[signs[(safeAIdx + 4) % 12]];
    const ninthLord = SIGN_RULERS[signs[(safeAIdx + 8) % 12]];

    const janmaMap: Record<string, string> = {
        "Sun": "THE PERSON WOULD BE WORKING IN GOVERNMENT RELATED WORKS IN PREVIOUS OR FUTURE JANMA.",
        "Moon": "THE PERSON WOULD BE WORKING HAS MIDWIFE / NURSERY / MOTHERWOOD / SERVICE TO PEOPLE IN PREVIOUS OR FUTURE JANMA.",
        "Mars": "THE PERSON WOULD BE LIVING HAS PET ANIMALS / DOMESTIC ANIMALS IN PREVIOUS OR FUTURE JANMA.",
        "Mercury": "THE PERSON WOULD BE WORKING IN BUSINESS FAMILY OR DOING BUSINESS IN PREVIOUS OR FUTURE JANMA.",
        "Jupiter": "THE PERSON WOULD BE WORKING AS A PRIEST / TEACHER / PREACHER / SAINT IN PREVIOUS OR FUTURE JANMA.",
        "Venus": "THE PERSON WOULD BE WORKING IN ENTERTAINMENT PLACES LIKE RESTAURANT / CINEMA / DANCE / CLUB IN PREVIOUS OR FUTURE JANMA.",
        "Saturn": "THE PERSON WOULD BE EMPLOYED IN LABOUR CLASS LIKE SECURITY / FACTORY / DOMESTIC HELP IN PREVIOUS OR FUTURE JANMA."
    };

    const results: VargaResult[] = [];
    results.push({ field: "5TH HOUSE LORD", planet: fifthLord, result: janmaMap[fifthLord] || "PREVIOUS JANMA ACTIVITY INDICATED." });
    results.push({ field: "9TH HOUSE LORD", planet: ninthLord, result: janmaMap[ninthLord] || "FUTURE JANMA ACTIVITY INDICATED." });

    const rahu = vargaPlanets.find(p => p.planet === 'Rahu');
    if (rahu) {
        const h = getHouse(rahu.sign, ascSign);
        results.push({ field: "NOTE", result: `IN D5 CHART WHERE RAHU IS POSITED FROM LAGNA WILL BE OUR JANMA ( EX : IF RAHU IS IN ${h}TH HOUSE THEN OUR JANMA BE ${h}TH ).` });
    }

    const maleficNode = vargaPlanets.find(p => ['Rahu', 'Ketu'].includes(p.planet) && [2, 4, 6, 8].includes(getHouse(p.sign, ascSign)));
    if (maleficNode) {
        results.push({ field: "CAUTION", result: "IF RAHU OR KETU ARE IN 2, 4, 6, 8 HOUSE FROM D5 LAGNA THERE IS A CHANCE OF BLACK MAGIC." });
    }

    return results;
};

// D6 (Shasthamsa) Logic - Use Varga Lagna
export const calculateD6Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;

    const lp = SIGN_RULERS[signs[safeAIdx]];
    const sixthLord = SIGN_RULERS[signs[(safeAIdx + 5) % 12]];

    const results: VargaResult[] = [];
    results.push({ field: "LAGNADIPATHI LORD", planet: lp, result: DISEASE_MAP[lp] || "STABLE.", parihara: PARIHARA_MAP[lp] });
    results.push({ field: "6TH HOUSE LORD", planet: sixthLord, result: DISEASE_MAP[sixthLord] || "CHALLENGE.", parihara: PARIHARA_MAP[sixthLord] });

    const badNodes = vargaPlanets.filter(p => ['Rahu', 'Ketu'].includes(p.planet) && [6, 8, 12].includes(getHouse(p.sign, ascSign)));
    if (badNodes.length > 0) {
        results.push({ field: "NOTE", result: "IN D6 Chart if RAHU or KETU is in the 6th, 8th or 12th House indicates long-term DISEASE, HOSPITALIZATION, or BAD DEATH due to DISEASE." });
    }
    return results;
};

// D7 (Saptamsa) Logic - Exact Grading mapping
export const calculateD7Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;
    const lp = SIGN_RULERS[signs[safeAIdx]];

    const getD7Grade = (house: number): Grade => {
        if (house === 5) return 'A++';
        if ([1, 9, 11].includes(house)) return 'A+';
        if ([4, 7, 10].includes(house)) return 'A';
        if ([2, 3].includes(house)) return 'B';
        return 'C';
    };

    const getD7Text = (grade: Grade): string => {
        if (grade === 'A++') return 'EXCELLENT';
        if (grade === 'A+') return 'VERY GOOD';
        if (grade === 'A') return 'GOOD';
        if (grade === 'B') return 'MEDIUM';
        return 'LOW';
    };

    const results: VargaResult[] = [];
    const lpV = vargaPlanets.find(p => p.planet === lp);
    if (lpV) {
        const h = getHouse(lpV.sign, ascSign);
        const grade = getD7Grade(h);
        results.push({ 
            field: `LAGNADIPATHI::PROGENY (CHILD BIRTH)`, 
            planet: lp, 
            grade: grade, 
            result: getD7Text(grade)
        });
    }
    return results;
};

// D8 (Longevity) Logic - Use Varga Lagna
export const calculateD8Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;

    const lp = SIGN_RULERS[signs[safeAIdx]];
    const eighthLord = SIGN_RULERS[signs[(safeAIdx + 7) % 12]];

    const getPoints = (h: number) => {
        if ([1, 5, 8, 9, 11].includes(h)) return 80;
        if ([4, 7, 10].includes(h)) return 70;
        if ([2, 3].includes(h)) return 50;
        return 40;
    };

    let total = 0; let count = 0;
    const lpV = vargaPlanets.find(p => p.planet === lp);
    if (lpV) { total += getPoints(getHouse(lpV.sign, ascSign)); count++; }
    
    const eighthV = vargaPlanets.find(p => p.planet === eighthLord);
    if (eighthV) { total += getPoints(getHouse(eighthV.sign, ascSign)); count++; }

    const finalAge = count > 0 ? Math.round(total / count) : 60;
    
    let resultText = `${finalAge}+ YEARS (ACCORDING TO PLACEMENT OF LL & 8L IN D8).`;
    resultText += " NOTE: LONGEVITY ALSO DEPENDS ON KARMA (+ -).";

    return [{ 
        field: "LONGEVITY (D8)", 
        planet: `${getShortPlanet(lp)} & ${getShortPlanet(eighthLord)}`, 
        grade: finalAge >= 80 ? 'A++' : (finalAge >= 65 ? 'A+' : 'A'), 
        result: resultText 
    }];
};

// D9 (Navamsa) Logic - Use Varga Lagna
export const calculateD9Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;
    const lp = SIGN_RULERS[signs[safeAIdx]];
    const seventhLord = SIGN_RULERS[signs[(safeAIdx + 6) % 12]];

    const results: VargaResult[] = [];
    [
        { p: lp, f: "LAGNADIPATHI" },
        { p: seventhLord, f: "7TH HOUSE LORD" },
        { p: "Venus", f: "VENUS" },
        { p: "Jupiter", f: "JUPITER" }
    ].forEach((item) => {
        const pV = vargaPlanets.find(p => p.planet === item.p);
        if (pV) {
            const h = getHouse(pV.sign, ascSign);
            results.push({ 
                field: item.f, 
                planet: item.p, 
                grade: [1, 4, 7, 10, 5, 9].includes(h) ? 'A+' : 'A', 
                result: `Placement in House ${h} of D9.` 
            });
        }
    });
    return results;
};

// D10 (Dashamsa) Logic - Use Varga Lagna
export const calculateD10Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;
    
    const lp = SIGN_RULERS[signs[safeAIdx]];
    const tenthLord = SIGN_RULERS[signs[(safeAIdx + 9) % 12]];

    const results: VargaResult[] = [];

    // LAGNADIPATHI row
    const lpV = vargaPlanets.find(p => p.planet === lp);
    if (lpV) {
        const h = getHouse(lpV.sign, ascSign);
        let grade: Grade = 'B';
        if ([1, 2, 4, 6, 7, 9, 10, 11].includes(h)) grade = 'A+';
        else if ([3, 5].includes(h)) grade = 'A';
        
        results.push({
            field: "LAGNADIPATHI",
            planet: lp,
            grade,
            result: PROFESSION_MAP[lp] || "PROFESSIONAL VITALITY AND STATUS."
        });
    }

    // 10TH HOUSE LORD row
    const tenthV = vargaPlanets.find(p => p.planet === tenthLord);
    if (tenthV) {
        const h = getHouse(tenthV.sign, ascSign);
        let grade: Grade = 'B';
        if ([1, 2, 4, 6, 7, 9, 10, 11].includes(h)) grade = 'A+';
        else if ([3, 5].includes(h)) grade = 'A';

        results.push({
            field: "10TH HOUSE LORD",
            planet: tenthLord,
            grade,
            result: PROFESSION_MAP[tenthLord] || "MAIN OCCUPATION AND CAREER PROGRESS."
        });
    }

    return results;
};

// D11 (Ekadashansha) Logic - Use Varga Lagna
export const calculateD11Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;
    const eleventhLord = SIGN_RULERS[signs[(safeAIdx + 10) % 12]];

    const results: VargaResult[] = [];
    const pV = vargaPlanets.find(p => p.planet === eleventhLord);
    if (pV) {
        const h = getHouse(pV.sign, ascSign);
        let grade: Grade = 'C'; let resText = "LOW INFLOW OF MONEY";
        if ([2, 11].includes(h)) { grade = 'A+'; resText = "EXCELLENT INFLOW OF MONEY"; }
        else if ([1, 4, 5, 7, 9, 10].includes(h)) { grade = 'A'; resText = "GOOD INFLOW OF MONEY"; }
        else if ([3, 6].includes(h)) { grade = 'C'; resText = "MEDIUM INFLOW OF MONEY"; }
        
        results.push({ field: "11TH HOUSE LORD", planet: eleventhLord, grade, result: resText });
    }
    return results;
};

// D12 (Dwadasamsa) Logic - Exact Grading mapping
export const calculateD12Result = (vargaPlanets: any[], vargaAsc: any, _natalAscSign: string): VargaResult[] => {
    const ascSign = vargaAsc.sign;
    const aIdx = getSignIndex(ascSign);
    const safeAIdx = aIdx === -1 ? 0 : aIdx;
    
    const lp = SIGN_RULERS[signs[safeAIdx]];
    const fourthLord = SIGN_RULERS[signs[(safeAIdx + 3) % 12]];
    const ninthLord = SIGN_RULERS[signs[(safeAIdx + 8) % 12]];

    const getD12Grade = (house: number): Grade => {
        if (house === 4 || house === 9) return 'A++';
        if ([1, 5, 11].includes(house)) return 'A+';
        if ([7, 10].includes(house)) return 'A';
        if ([2, 3].includes(house)) return 'B';
        return 'C';
    };

    const getD12Text = (grade: Grade): string => {
        if (grade === 'A++') return 'EXCELLENT';
        if (grade === 'A+') return 'VERY GOOD';
        if (grade === 'A') return 'GOOD';
        if (grade === 'B') return 'MEDIUM';
        return 'LOW';
    };

    const results: VargaResult[] = [];
    [ 
        { p: lp, f: "PARENTS LINEAGE", label: "LAGNADIPATHI" },
        { p: ninthLord, f: "FATHER'S LINEAGE", label: "9TH HOUSE LORD" },
        { p: fourthLord, f: "MOTHER'S LINEAGE", label: "4TH HOUSE LORD" } 
    ].forEach(item => {
        const pV = vargaPlanets.find(p => p.planet === item.p);
        if (pV) {
            const h = getHouse(pV.sign, ascSign);
            const grade = getD12Grade(h);
            results.push({ 
                field: `${item.label}::${item.f}`, 
                planet: item.p, 
                grade: grade, 
                result: getD12Text(grade) 
            });
        }
    });
    return results;
};
