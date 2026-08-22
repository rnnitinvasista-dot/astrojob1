
export interface KootaResult {
    name: string;
    maxPoints: number;
    gotPoints: number;
    description?: string;
}

export interface MatchMakingResult {
    totalPoints: number;
    kootas: KootaResult[];
    placements: {
        planet: string;
        boySign: string;
        girlSign: string;
        boyHouse: number;
        girlHouse: number;
        placement1: number;
        placement2: number;
        percentage: number;
        rating: 'Very Good' | 'Good' | 'Bad';
    }[];
    isRecommended: boolean;
    notes: {
        vargottamaLagna: { boy: boolean, girl: boolean };
        vargottamaPlanets: { boy: string[], girl: string[] };
        seventhLordResult: { boy: string, girl: string };
        aspectsOnSeventh: { boy: string[], girl: string[] };
    };
    criticalWarning?: string;
}

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const RASHIS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_LORDS: Record<string, string> = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
};

const PLANET_FRIENDS: Record<string, string[]> = {
    "Sun": ["Moon", "Mars", "Jupiter"],
    "Moon": ["Sun", "Mercury"],
    "Mars": ["Sun", "Moon", "Jupiter"],
    "Mercury": ["Sun", "Venus"],
    "Jupiter": ["Sun", "Moon", "Mars"],
    "Venus": ["Mercury", "Saturn"],
    "Saturn": ["Mercury", "Venus"]
};

const PLANET_ENEMIES: Record<string, string[]> = {
    "Sun": ["Venus", "Saturn"],
    "Moon": [],
    "Mars": ["Mercury"],
    "Mercury": ["Moon"],
    "Jupiter": ["Mercury", "Venus"],
    "Venus": ["Sun", "Moon"],
    "Saturn": ["Sun", "Moon", "Mars"]
};

const GANA_MAP: Record<string, string> = {
    "Ashwini": "Deva", "Mrigashira": "Deva", "Punarvasu": "Deva", "Pushya": "Deva", "Hasta": "Deva", "Swati": "Deva", "Anuradha": "Deva", "Shravana": "Deva", "Revati": "Deva",
    "Bharani": "Manushya", "Rohini": "Manushya", "Ardra": "Manushya", "Purva Phalguni": "Manushya", "Uttara Phalguni": "Manushya", "Purva Ashadha": "Manushya", "Uttara Ashadha": "Manushya", "Purva Bhadrapada": "Manushya",
    "Krittika": "Rakshasa", "Ashlesha": "Rakshasa", "Magha": "Rakshasa", "Chitra": "Rakshasa", "Vishakha": "Rakshasa", "Jyeshtha": "Rakshasa", "Mula": "Rakshasa", "Dhanishta": "Rakshasa", "Shatabhisha": "Rakshasa", "Uttara Bhadrapada": "Rakshasa"
};

const NADI_MAP: Record<string, string> = {
    "Ashwini": "Adi", "Ardra": "Adi", "Punarvasu": "Adi", "Uttara Phalguni": "Adi", "Hasta": "Adi", "Jyeshtha": "Adi", "Mula": "Adi", "Shatabhisha": "Adi", "Purva Bhadrapada": "Adi",
    "Bharani": "Madhya", "Mrigashira": "Madhya", "Pushya": "Madhya", "Purva Phalguni": "Madhya", "Chitra": "Madhya", "Anuradha": "Madhya", "Purva Ashadha": "Madhya", "Dhanishta": "Madhya", "Uttara Bhadrapada": "Madhya",
    "Krittika": "Antya", "Rohini": "Antya", "Ashlesha": "Antya", "Magha": "Antya", "Swati": "Antya", "Vishakha": "Antya", "Uttara Ashadha": "Antya", "Shravana": "Antya", "Revati": "Antya"
};

const VARNA_MAP: Record<string, number> = {
    "Cancer": 4, "Scorpio": 4, "Pisces": 4, // Brahmin
    "Aries": 3, "Leo": 3, "Sagittarius": 3, // Kshatriya
    "Taurus": 2, "Virgo": 2, "Capricorn": 2, // Vaishya
    "Gemini": 1, "Libra": 1, "Aquarius": 1 // Shudra
};

const YONI_MAP: Record<string, string> = {
    "Ashwini": "Horse", "Shatabhisha": "Horse",
    "Bharani": "Elephant", "Revati": "Elephant",
    "Krittika": "Sheep", "Pushya": "Sheep",
    "Rohini": "Snake", "Mrigashira": "Snake",
    "Ardra": "Dog", "Mula": "Dog",
    "Punarvasu": "Cat", "Ashlesha": "Cat",
    "Magha": "Rat", "Purva Phalguni": "Rat",
    "Uttara Phalguni": "Cow", "Uttara Bhadrapada": "Cow",
    "Hasta": "Buffalo", "Swati": "Buffalo",
    "Chitra": "Tiger", "Vishakha": "Tiger",
    "Anuradha": "Deer", "Jyeshtha": "Deer",
    "Purva Ashadha": "Monkey", "Shravana": "Monkey",
    "Uttara Ashadha": "Mongoose",
    "Purva Bhadrapada": "Lion", "Dhanishta": "Lion"
};

const YONI_FRIENDSHIP: Record<string, Record<string, number>> = {
    "Horse": { "Horse": 4, "Elephant": 2, "Sheep": 2, "Snake": 2, "Dog": 1, "Cat": 2, "Rat": 2, "Cow": 1, "Buffalo": 0, "Tiger": 1, "Deer": 3, "Monkey": 3, "Mongoose": 2, "Lion": 1 },
    "Elephant": { "Horse": 2, "Elephant": 4, "Sheep": 3, "Snake": 3, "Dog": 2, "Cat": 2, "Rat": 2, "Cow": 2, "Buffalo": 3, "Tiger": 1, "Deer": 2, "Monkey": 3, "Mongoose": 2, "Lion": 0 },
    "Sheep": { "Horse": 2, "Elephant": 3, "Sheep": 4, "Snake": 2, "Dog": 1, "Cat": 2, "Rat": 1, "Cow": 3, "Buffalo": 3, "Tiger": 1, "Deer": 2, "Monkey": 0, "Mongoose": 3, "Lion": 1 },
    "Snake": { "Horse": 2, "Elephant": 3, "Sheep": 2, "Snake": 4, "Dog": 2, "Cat": 1, "Rat": 1, "Cow": 2, "Buffalo": 2, "Tiger": 2, "Deer": 2, "Monkey": 2, "Mongoose": 0, "Lion": 2 },
    "Dog": { "Horse": 1, "Elephant": 2, "Sheep": 1, "Snake": 2, "Dog": 4, "Cat": 2, "Rat": 1, "Cow": 2, "Buffalo": 2, "Tiger": 1, "Deer": 0, "Monkey": 2, "Mongoose": 1, "Lion": 2 },
    "Cat": { "Horse": 2, "Elephant": 2, "Sheep": 2, "Snake": 1, "Dog": 2, "Cat": 4, "Rat": 0, "Cow": 2, "Buffalo": 2, "Tiger": 2, "Deer": 3, "Monkey": 2, "Mongoose": 1, "Lion": 2 },
    "Rat": { "Horse": 2, "Elephant": 2, "Sheep": 1, "Snake": 1, "Dog": 1, "Cat": 0, "Rat": 4, "Cow": 2, "Buffalo": 2, "Tiger": 1, "Deer": 2, "Monkey": 2, "Mongoose": 1, "Lion": 2 },
    "Cow": { "Horse": 1, "Elephant": 2, "Sheep": 3, "Snake": 2, "Dog": 2, "Cat": 2, "Rat": 2, "Cow": 4, "Buffalo": 3, "Tiger": 0, "Deer": 2, "Monkey": 1, "Mongoose": 1, "Lion": 2 },
    "Buffalo": { "Horse": 0, "Elephant": 3, "Sheep": 3, "Snake": 2, "Dog": 2, "Cat": 2, "Rat": 2, "Cow": 3, "Buffalo": 4, "Tiger": 2, "Deer": 2, "Monkey": 2, "Mongoose": 1, "Lion": 1 },
    "Tiger": { "Horse": 1, "Elephant": 1, "Sheep": 1, "Snake": 2, "Dog": 1, "Cat": 2, "Rat": 1, "Cow": 0, "Buffalo": 2, "Tiger": 4, "Deer": 1, "Monkey": 2, "Mongoose": 1, "Lion": 2 },
    "Deer": { "Horse": 3, "Elephant": 2, "Sheep": 2, "Snake": 2, "Dog": 0, "Cat": 3, "Rat": 2, "Cow": 2, "Buffalo": 2, "Tiger": 1, "Deer": 4, "Monkey": 2, "Mongoose": 2, "Lion": 2 },
    "Monkey": { "Horse": 3, "Elephant": 3, "Sheep": 0, "Snake": 2, "Dog": 2, "Cat": 2, "Rat": 2, "Cow": 1, "Buffalo": 2, "Tiger": 2, "Deer": 2, "Monkey": 4, "Mongoose": 3, "Lion": 2 },
    "Mongoose": { "Horse": 2, "Elephant": 2, "Sheep": 3, "Snake": 0, "Dog": 1, "Cat": 1, "Rat": 1, "Cow": 1, "Buffalo": 1, "Tiger": 1, "Deer": 2, "Monkey": 3, "Mongoose": 4, "Lion": 2 },
    "Lion": { "Horse": 1, "Elephant": 0, "Sheep": 1, "Snake": 2, "Dog": 2, "Cat": 2, "Rat": 2, "Cow": 2, "Buffalo": 1, "Tiger": 2, "Deer": 2, "Monkey": 2, "Mongoose": 2, "Lion": 4 }
};

const VASHYA_MAP: Record<string, string> = {
    "Aries": "Chatushpada", "Taurus": "Chatushpada",
    "Gemini": "Nara", "Leo": "Vanchar", "Virgo": "Nara", "Libra": "Nara", "Scorpio": "Keeta",
    "Aquarius": "Nara", "Pisces": "Jalchar", "Cancer": "Jalchar",
    "Sagittarius": "Nara", "Capricorn": "Jalchar"
};

const VASHYA_MATRIX: Record<string, Record<string, number>> = {
    "Nara": { "Nara": 2, "Chatushpada": 1, "Jalchar": 1, "Vanchar": 0, "Keeta": 1 },
    "Chatushpada": { "Nara": 1, "Chatushpada": 2, "Jalchar": 1, "Vanchar": 0, "Keeta": 1 },
    "Jalchar": { "Nara": 1, "Chatushpada": 1, "Jalchar": 2, "Vanchar": 1, "Keeta": 1 },
    "Vanchar": { "Nara": 0, "Chatushpada": 0, "Jalchar": 1, "Vanchar": 2, "Keeta": 0 },
    "Keeta": { "Nara": 1, "Chatushpada": 1, "Jalchar": 1, "Vanchar": 0, "Keeta": 2 }
};

export const calculateAshtaKoota = (boyNk: string, boyRashi: string, girlNk: string, girlRashi: string): KootaResult[] => {
    const results: KootaResult[] = [];

    // 1. Varna (1)
    const boyVarna = VARNA_MAP[boyRashi] || 1;
    const girlVarna = VARNA_MAP[girlRashi] || 1;
    results.push({ name: "Varna", maxPoints: 1, gotPoints: boyVarna >= girlVarna ? 1 : 0 });

    // 2. Vashya (2)
    const boyVashya = VASHYA_MAP[boyRashi] || "Nara";
    const girlVashya = VASHYA_MAP[girlRashi] || "Nara";
    results.push({ name: "Vashya", maxPoints: 2, gotPoints: VASHYA_MATRIX[boyVashya]?.[girlVashya] ?? 0 });

    // 3. Tara (3)
    const bIndex = NAKSHATRAS.indexOf(boyNk);
    const gIndex = NAKSHATRAS.indexOf(girlNk);
    let taraPts = 0;
    if (bIndex !== -1 && gIndex !== -1) {
        const count = (gIndex - bIndex + 27) % 27;
        const rem = (count + 1) % 9;
        if ([1, 3, 5, 7].includes(rem)) taraPts = 1.5;
        else if ([2, 4, 6, 8, 0].includes(rem)) taraPts = 3;
    }
    results.push({ name: "Tara", maxPoints: 3, gotPoints: taraPts });

    // 4. Yoni (4)
    const boyYoni = YONI_MAP[boyNk];
    const girlYoni = YONI_MAP[girlNk];
    results.push({ name: "Yoni", maxPoints: 4, gotPoints: YONI_FRIENDSHIP[boyYoni]?.[girlYoni] ?? 0 });

    // 5. Graha Maitri (5)
    const boyLord = RASHI_LORDS[boyRashi];
    const girlLord = RASHI_LORDS[girlRashi];
    let gmPts = 0;
    if (boyLord === girlLord) gmPts = 5;
    else {
        const bIsFriend = PLANET_FRIENDS[boyLord]?.includes(girlLord);
        const gIsFriend = PLANET_FRIENDS[girlLord]?.includes(boyLord);
        const bIsEnemy = PLANET_ENEMIES[boyLord]?.includes(girlLord);
        const gIsEnemy = PLANET_ENEMIES[girlLord]?.includes(boyLord);

        if (bIsFriend && gIsFriend) gmPts = 5;
        else if ((bIsFriend && !gIsEnemy) || (gIsFriend && !bIsEnemy)) gmPts = 4;
        else if (!bIsEnemy && !gIsEnemy) gmPts = 3;
        else if (bIsFriend || gIsFriend) gmPts = 1;
        else gmPts = 0;
    }
    results.push({ name: "Graha Maitri", maxPoints: 5, gotPoints: gmPts });

    // 6. Gana (6)
    const boyGana = GANA_MAP[boyNk];
    const girlGana = GANA_MAP[girlNk];
    let ganaPts = 0;
    if (boyGana === girlGana) ganaPts = 6;
    else if (boyGana === "Deva" && girlGana === "Manushya") ganaPts = 5;
    else if (boyGana === "Manushya" && girlGana === "Rakshasa") ganaPts = 1;
    else if (boyGana === "Deva" && girlGana === "Rakshasa") ganaPts = 0;
    results.push({ name: "Gana", maxPoints: 6, gotPoints: ganaPts });

    // 7. Bhakoot (7)
    const bRIndex = RASHIS.indexOf(boyRashi);
    const gRIndex = RASHIS.indexOf(girlRashi);
    const dist = (gRIndex - bRIndex + 12) % 12 + 1;
    let bhakootPts = 7;
    if ([2, 12, 5, 9, 6, 8].includes(dist)) bhakootPts = 0;
    results.push({ name: "Bhakoot", maxPoints: 7, gotPoints: bhakootPts });

    // 8. Nadi (8)
    const boyNadi = NADI_MAP[boyNk];
    const girlNadi = NADI_MAP[girlNk];
    results.push({ name: "Nadi", maxPoints: 8, gotPoints: boyNadi !== girlNadi ? 8 : 0 });

    return results;
};

const checkAspectOnHouse = (houseNum: number, planets: any[]): string[] => {
    const aspects: string[] = [];
    planets.forEach(p => {
        const h = p.house_placed;
        if (!h) return;
        const name = p.planet;
        
        const relativePos = (houseNum - h + 12) % 12 + 1;

        if (relativePos === 7) aspects.push(name);
        if (name === 'Mars' && [4, 8].includes(relativePos)) aspects.push(name);
        if (name === 'Saturn' && [3, 10].includes(relativePos)) aspects.push(name);
        if (['Jupiter', 'Rahu', 'Ketu'].includes(name) && [5, 9].includes(relativePos)) aspects.push(name);
    });
    return Array.from(new Set(aspects));
};

const getVargottamaStatus = (res: any) => {
    const status = { lagna: false, planets: [] as string[] };
    const d9 = res.varga_charts?.D9;
    if (!d9) return status;

    if (res.ascendant.sign === d9.ascendant?.sign) status.lagna = true;
    res.planets.forEach((p: any) => {
        const d9p = d9.planets.find((dp: any) => dp.planet === p.planet);
        if (d9p && d9p.sign === p.sign) status.planets.push(p.planet);
    });
    return status;
};

const getSeventhLordResult = (res: any) => {
    const lagnaIdx = RASHIS.indexOf(res.ascendant.sign);
    const seventhSignIdx = (lagnaIdx + 6) % 12;
    const seventhSign = RASHIS[seventhSignIdx];
    const lord = RASHI_LORDS[seventhSign];
    const lordData = res.planets.find((p: any) => p.planet === lord);
    const house = lordData?.house_placed || 0;

    if ([1, 4, 5, 7, 9, 10, 11].includes(house)) return `7th Lord (${lord}) in ${house} House: Good Marriage Life`;
    if (house === 6) return `7th Lord (${lord}) in 6 House: Problems in marriage`;
    if (house === 8) return `7th Lord (${lord}) in 8 House: Some problems`;
    if (house === 12) return `7th Lord (${lord}) in 12 House: Average success`;
    return `7th Lord (${lord}) in ${house} House`;
};

export const calculateMatch = (boyData: any, girlData: any): MatchMakingResult => {
    const findSign = (res: any, planet: string) => res.planets.find((p: any) => p.planet.toLowerCase() === planet.toLowerCase())?.sign || '';
    
    // Calculate D1 house (Sign-relative house)
    const getD1House = (lagnaSign: string, planetSign: string) => {
        const lIdx = RASHIS.indexOf(lagnaSign);
        const pIdx = RASHIS.indexOf(planetSign);
        if (lIdx === -1 || pIdx === -1) return 0;
        return (pIdx - lIdx + 12) % 12 + 1;
    };

    const boyNk = boyData.metadata.janma_nakshatra || boyData.metadata.nakshatra;
    const boyRashi = findSign(boyData, 'Moon');
    const girlNk = girlData.metadata.janma_nakshatra || girlData.metadata.nakshatra;
    const girlRashi = findSign(girlData, 'Moon');

    const kootas = calculateAshtaKoota(boyNk, boyRashi, girlNk, girlRashi);
    const totalPoints = kootas.reduce((acc, curr) => acc + curr.gotPoints, 0);

    const boyLagnaSign = boyData.ascendant.sign;
    const girlLagnaSign = girlData.ascendant.sign;
    const boyLagnaLord = RASHI_LORDS[boyLagnaSign];
    const girlLagnaLord = RASHI_LORDS[girlLagnaSign];

    const targets = [
        { name: 'Lagna', boySign: boyLagnaSign, girlSign: girlLagnaSign, boyHouse: 1, girlHouse: 1, weight: 25 },
        { 
            name: 'Moon', 
            boySign: boyRashi, 
            girlSign: girlRashi, 
            boyHouse: getD1House(boyLagnaSign, boyRashi), 
            girlHouse: getD1House(girlLagnaSign, girlRashi), 
            weight: 25 
        },
        { 
            name: 'Venus', 
            boySign: findSign(boyData, 'Venus'), 
            girlSign: findSign(girlData, 'Venus'), 
            boyHouse: getD1House(boyLagnaSign, findSign(boyData, 'Venus')), 
            girlHouse: getD1House(girlLagnaSign, findSign(girlData, 'Venus')), 
            weight: 20 
        },
        { 
            name: 'Jupiter', 
            boySign: findSign(boyData, 'Jupiter'), 
            girlSign: findSign(girlData, 'Jupiter'), 
            boyHouse: getD1House(boyLagnaSign, findSign(boyData, 'Jupiter')), 
            girlHouse: getD1House(girlLagnaSign, findSign(girlData, 'Jupiter')), 
            weight: 15 
        },
        { 
            name: 'Mars', 
            boySign: findSign(boyData, 'Mars'), 
            girlSign: findSign(girlData, 'Mars'), 
            boyHouse: getD1House(boyLagnaSign, findSign(boyData, 'Mars')), 
            girlHouse: getD1House(girlLagnaSign, findSign(girlData, 'Mars')), 
            weight: 15 
        },
        { 
            name: 'Lagna Lord', 
            boySign: findSign(boyData, boyLagnaLord), 
            girlSign: findSign(girlData, girlLagnaLord), 
            boyHouse: getD1House(boyLagnaSign, findSign(boyData, boyLagnaLord)), 
            girlHouse: getD1House(girlLagnaSign, findSign(girlData, girlLagnaLord)), 
            weight: 15 
        }
    ];

    let criticalWarn = '';
    const placements = targets.map(t => {
        const bPos = RASHIS.indexOf(t.boySign);
        const gPos = RASHIS.indexOf(t.girlSign);
        if (bPos === -1 || gPos === -1) return null;

        const d1 = (gPos - bPos + 12) % 12 + 1;

        let rating: 'Very Good' | 'Good' | 'Bad' = 'Good';
        let percentage = t.weight;

        if ([2, 12, 6, 8].includes(d1)) {
            rating = 'Bad';
            percentage = 0;
            if (t.name === 'Lagna' || t.name === 'Moon') {
                criticalWarn = "After marriage will not be nice, may lead to misunderstanding or divorce";
            }
        } else if ([4, 10, 5, 9].includes(d1)) {
            rating = 'Very Good';
        }

        return {
            planet: t.name,
            boySign: t.boySign,
            girlSign: t.girlSign,
            boyHouse: t.boyHouse,
            girlHouse: t.girlHouse,
            placement1: t.boyHouse,
            placement2: t.girlHouse,
            percentage,
            rating
        };
    }).filter(Boolean) as any[];

    const boyV = getVargottamaStatus(boyData);
    const girlV = getVargottamaStatus(girlData);

    return {
        totalPoints,
        kootas,
        placements,
        isRecommended: totalPoints >= 18,
        criticalWarning: criticalWarn,
        notes: {
            vargottamaLagna: { boy: boyV.lagna, girl: girlV.lagna },
            vargottamaPlanets: { boy: boyV.planets, girl: girlV.planets },
            seventhLordResult: { boy: getSeventhLordResult(boyData), girl: getSeventhLordResult(girlData) },
            aspectsOnSeventh: { boy: checkAspectOnHouse(7, boyData.planets), girl: checkAspectOnHouse(7, girlData.planets) }
        }
    };
};
