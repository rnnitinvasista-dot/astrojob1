
export const PLANETS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
export const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
export const TOTAL_YEARS = 120;

const RASHI_LORDS = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

export interface KPLevels {
    sign_lord: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord: string;
    sub_sub_sub_lord: string;
}

export function calculateKPLevels(degree: number): KPLevels {
    // Normalize degree to 0-360
    degree = ((degree % 360) + 360) % 360;

    // 1. Sign Lord
    const rashiIndex = Math.floor(degree / 30);
    const sign_lord = RASHI_LORDS[rashiIndex];

    // 2. Star Lord (Nakshatra)
    const nakshatraSpan = 13 + 20/60; // 13° 20' = 800 minutes
    const nakshatraIndex = Math.floor(degree / nakshatraSpan);
    const star_lord = PLANETS[nakshatraIndex % 9];
    const starStartDegree = nakshatraIndex * nakshatraSpan;
    const degreeInStar = degree - starStartDegree;

    // 3. Sub Lord
    const subResult = findSubDivision(degreeInStar, nakshatraSpan, nakshatraIndex % 9);
    const sub_lord = subResult.lord;

    // 4. Sub-Sub-Lord
    const sslResult = findSubDivision(subResult.remainder, subResult.span, PLANETS.indexOf(sub_lord));
    const sub_sub_lord = sslResult.lord;

    // 5. Sub-Sub-Sub-Lord (SSSL)
    const ssslResult = findSubDivision(sslResult.remainder, sslResult.span, PLANETS.indexOf(sub_sub_lord));
    const sub_sub_sub_lord = ssslResult.lord;

    return {
        sign_lord,
        star_lord,
        sub_lord,
        sub_sub_lord,
        sub_sub_sub_lord
    };
}

function findSubDivision(degreeInParent: number, parentSpan: number, startPlanetIndex: number) {
    let currentPos = 0;
    for (let i = 0; i < 9; i++) {
        const planetIndex = (startPlanetIndex + i) % 9;
        const planetSpan = (DASHA_YEARS[planetIndex] / TOTAL_YEARS) * parentSpan;
        
        if (degreeInParent >= currentPos && degreeInParent < currentPos + planetSpan + 0.0000000001) {
            return {
                lord: PLANETS[planetIndex],
                span: planetSpan,
                remainder: degreeInParent - currentPos
            };
        }
        currentPos += planetSpan;
    }
    
    // Fallback for floating point errors
    const lastIndex = (startPlanetIndex + 8) % 9;
    return {
        lord: PLANETS[lastIndex],
        span: (DASHA_YEARS[lastIndex] / TOTAL_YEARS) * parentSpan,
        remainder: 0
    };
}
