import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../services/api';
import type { Planet, Ascendant, House, BirthDetails } from '../../types/astrology';
import { calculateKPLevels } from '../../utils/astrologyUtils';

interface BirthTimeRectificationProps {
    houses: House[];
    planets: Planet[];
    ascendant: Ascendant;
    birthDetails: BirthDetails;
    ayanamsa?: string;
    onUpdateDetails?: (newDate: string, newTime: string) => void;
    metadata?: any;
}

const signList = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const vighatiPlanets: Record<number, string> = {
    1: "Ketu",
    2: "Venus",
    3: "Sun",
    4: "Moon",
    5: "Mars",
    6: "Rahu",
    7: "Jupiter",
    8: "Saturn",
    9: "Mercury"
};

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const nakshatraLords: Record<string, string> = {
    "ashwini": "Ketu", "magha": "Ketu", "moola": "Ketu", "mula": "Ketu",
    "bharani": "Venus", "purva phalguni": "Venus", "purvaphalguni": "Venus", "purva ashadha": "Venus", "purvashadha": "Venus", "poorvashadha": "Venus",
    "krittika": "Sun", "krithika": "Sun", "uttara phalguni": "Sun", "uttaraphalguni": "Sun", "uttara ashadha": "Sun", "uttarashadha": "Sun", "utoorvashadha": "Sun",
    "rohini": "Moon", "hasta": "Moon", "shravana": "Moon", "sravana": "Moon",
    "mrigasira": "Mars", "mrigashira": "Mars", "chitra": "Mars", "dhanishta": "Mars", "dhanishtha": "Mars",
    "ardra": "Rahu", "aaridra": "Rahu", "swati": "Rahu", "shatabhisha": "Rahu", "shatabhaj": "Rahu", "satabhisha": "Rahu",
    "punarvasu": "Jupiter", "vishakha": "Jupiter", "visakha": "Jupiter", "purva bhadrapada": "Jupiter", "purvabhadrapada": "Jupiter", "poorvabhadrapada": "Jupiter",
    "pushya": "Saturn", "anuradha": "Saturn", "uttara bhadrapada": "Saturn", "uttarabhadrapada": "Saturn",
    "ashlesha": "Mercury", "aslesha": "Mercury", "jyeshtha": "Mercury", "jyestha": "Mercury", "revati": "Mercury"
};

const getStarLordOfNakshatra = (nakName: string): string => {
    if (!nakName) return '';
    const clean = nakName.toLowerCase().replace(/[^a-z]/g, '');
    for (const [key, lord] of Object.entries(nakshatraLords)) {
        const cleanKey = key.replace(/[^a-z]/g, '');
        if (clean.includes(cleanKey) || cleanKey.includes(clean)) {
            return lord;
        }
    }
    return '';
};

const dmsToDecimal = (dms: string | undefined): number => {
    if (!dms) return 0;
    const parts = dms.split(/[°'":]/).map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    if (parts.length === 0) return 0;
    let dec = parts[0];
    if (parts.length > 1) dec += parts[1] / 60;
    if (parts.length > 2) dec += parts[2] / 3600;
    return dec;
};

const getAbsoluteDegrees = (sign: string, dms: string | undefined): number => {
    const signIdx = signList.findIndex(s => s.toLowerCase() === sign.toLowerCase());
    if (signIdx === -1) return 0;
    return signIdx * 30 + dmsToDecimal(dms);
};

// Robust timezone offset parser
const parseTimezoneOffset = (tzStr: string | undefined): number => {
    if (!tzStr) return 5.5; // Default Indian Standard Time
    if (tzStr.includes('Kolkata') || tzStr.includes('India')) return 5.5;
    
    const match = tzStr.match(/^([+-])(\d+):(\d+)$/);
    if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const h = parseInt(match[2]);
        const m = parseInt(match[3]);
        return sign * (h + m / 60);
    }
    
    const parsed = parseFloat(tzStr);
    return isNaN(parsed) ? 5.5 : parsed;
};

// Sunrise Time Calculation (US Naval Observatory Formula)
const getSunriseTime = (date: Date, latitude: number, longitude: number, timezoneOffset: number): Date => {
    const zenith = 90.8333; // official sunrise zenith
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;
    
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    
    const lngHour = longitude / 15;
    const t = day + ((6 - lngHour) / 24);
    
    const M = (0.9856 * t) - 3.289;
    
    let L = M + (1.916 * Math.sin(M * toRad)) + (0.020 * Math.sin(2 * M * toRad)) + 282.634;
    L = (L + 360) % 360;
    
    let RA = toDeg * Math.atan(0.91764 * Math.tan(L * toRad));
    RA = (RA + 360) % 360;
    
    const Lquadrant  = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = RA + (Lquadrant - RAquadrant);
    RA = RA / 15;
    
    const sinDec = 0.39782 * Math.sin(L * toRad);
    const cosDec = Math.cos(Math.asin(sinDec));
    
    const cosH = (Math.cos(zenith * toRad) - (sinDec * Math.sin(latitude * toRad))) / (cosDec * Math.cos(latitude * toRad));
    
    if (cosH > 1) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0); // polar night fallback
    }
    if (cosH < -1) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0); // polar day fallback
    }
    
    const H = (360 - toDeg * Math.acos(cosH)) / 15;
    const T = H + RA - (0.06571 * t) - 6.622;
    
    let ut = T - lngHour;
    ut = (ut + 24) % 24;
    
    let localTime = ut + timezoneOffset;
    localTime = (localTime + 24) % 24;
    
    const hour = Math.floor(localTime);
    const minFloat = (localTime - hour) * 60;
    const minute = Math.floor(minFloat);
    const second = Math.round((minFloat - minute) * 60);
    
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, second);
};

// Adjust time and date by offset seconds
const addDateTimeOffset = (dateStr: string, timeStr: string, secondsOffset: number) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [h, min, s] = timeStr.split(':').map(Number);
    const dt = new Date(y, m - 1, d, h, min, s || 0);
    dt.setSeconds(dt.getSeconds() + secondsOffset);
    
    const ny = dt.getFullYear();
    const nm = (dt.getMonth() + 1).toString().padStart(2, '0');
    const nd = dt.getDate().toString().padStart(2, '0');
    
    const nh = dt.getHours().toString().padStart(2, '0');
    const nmin = dt.getMinutes().toString().padStart(2, '0');
    const ns = dt.getSeconds().toString().padStart(2, '0');
    
    return {
        date: `${ny}-${nm}-${nd}`,
        time: `${nh}:${nmin}:${ns}`
    };
};

interface RawMatch {
    offsetSeconds: number;
    planet: string;
}

interface GroupedMatch {
    planet: string;
    startOffset: number;
    endOffset: number;
    midpointOffset: number;
}

const groupConsecutiveMatches = (matches: RawMatch[]): GroupedMatch[] => {
    if (matches.length === 0) return [];
    
    const sorted = [...matches].sort((a, b) => a.offsetSeconds - b.offsetSeconds);
    
    const groups: GroupedMatch[] = [];
    let currentGroup: { planet: string, offsets: number[] } | null = null;
    
    for (const m of sorted) {
        if (!currentGroup) {
            currentGroup = { planet: m.planet, offsets: [m.offsetSeconds] };
        } else if (m.planet === currentGroup.planet && m.offsetSeconds === currentGroup.offsets[currentGroup.offsets.length - 1] + 1) {
            currentGroup.offsets.push(m.offsetSeconds);
        } else {
            const start = currentGroup.offsets[0];
            const end = currentGroup.offsets[currentGroup.offsets.length - 1];
            groups.push({
                planet: currentGroup.planet,
                startOffset: start,
                endOffset: end,
                midpointOffset: Math.round((start + end) / 2)
            });
            currentGroup = { planet: m.planet, offsets: [m.offsetSeconds] };
        }
    }
    
    if (currentGroup) {
        const start = currentGroup.offsets[0];
        const end = currentGroup.offsets[currentGroup.offsets.length - 1];
        groups.push({
            planet: currentGroup.planet,
            startOffset: start,
            endOffset: end,
            midpointOffset: Math.round((start + end) / 2)
        });
    }
    
    return groups;
};

const formatOffset = (seconds: number): string => {
    const sign = seconds >= 0 ? '+' : '';
    const absSec = Math.abs(seconds);
    const m = Math.floor(absSec / 60);
    const s = absSec % 60;
    if (m === 0) return `${sign}${s}s`;
    return `${sign}${m}m ${s}s`;
};

const BirthTimeRectification: React.FC<BirthTimeRectificationProps> = ({
    houses,
    planets,
    ascendant: _ascendant,
    birthDetails,
    ayanamsa = 'KP',
    onUpdateDetails,
    metadata
}) => {
    const [method, setMethod] = useState<'CUSP_ALIGN' | 'SUNRISE_VIGHATI'>('CUSP_ALIGN');
    const [loading, setLoading] = useState(false);
    const [sublordMatches, setSublordMatches] = useState<GroupedMatch[]>([]);
    const [subSublordMatches, setSubSublordMatches] = useState<GroupedMatch[]>([]);
    const [showCalculations, setShowCalculations] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const scanCusps = async () => {
            setLoading(true);
            try {
                const offsetTime = addDateTimeOffset(birthDetails.date_of_birth, birthDetails.time_of_birth, 180);
                
                const response = await axios.post(`${getApiUrl()}/kundli`, {
                    birth_details: {
                        date_of_birth: offsetTime.date,
                        time_of_birth: offsetTime.time,
                        timezone: birthDetails.timezone || "Asia/Kolkata",
                        latitude: birthDetails.latitude,
                        longitude: birthDetails.longitude,
                        place: birthDetails.place
                    },
                    calculation_settings: {
                        ayanamsa,
                        house_system: "Placidus",
                        node_type: "Mean"
                    }
                });

                if (response.data.status === 'success' && isMounted) {
                    const offsetHouses: House[] = response.data.houses;

                    const c1_t0 = getAbsoluteDegrees(houses[0].sign, houses[0].cusp_degree_dms);
                    const c9_t0 = getAbsoluteDegrees(houses[8].sign, houses[8].cusp_degree_dms);

                    const c1_t180 = getAbsoluteDegrees(offsetHouses[0].sign, offsetHouses[0].cusp_degree_dms);
                    const c9_t180 = getAbsoluteDegrees(offsetHouses[8].sign, offsetHouses[8].cusp_degree_dms);

                    const v1 = (c1_t180 - c1_t0) / 180;
                    const v9 = (c9_t180 - c9_t0) / 180;

                    const rawSublord: RawMatch[] = [];
                    const rawSubSublord: RawMatch[] = [];

                    for (let t = -180; t <= 180; t++) {
                        const deg1 = c1_t0 + v1 * t;
                        const deg9 = c9_t0 + v9 * t;

                        const kp1 = calculateKPLevels(deg1);
                        const kp9 = calculateKPLevels(deg9);

                        if (kp1.sub_lord === kp9.sub_lord) {
                            rawSublord.push({ offsetSeconds: t, planet: kp1.sub_lord });
                        }
                        if (kp1.sub_sub_lord === kp9.sub_sub_lord) {
                            rawSubSublord.push({ offsetSeconds: t, planet: kp1.sub_sub_lord });
                        }
                    }

                    setSublordMatches(groupConsecutiveMatches(rawSublord));
                    setSubSublordMatches(groupConsecutiveMatches(rawSubSublord));
                }
            } catch (err) {
                console.error("Error scanning cusp rectification:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        scanCusps();
        return () => { isMounted = false; };
    }, [birthDetails.date_of_birth, birthDetails.time_of_birth, ayanamsa, houses]);

    const handleApplyTime = (offsetSeconds: number) => {
        if (onUpdateDetails) {
            const adjusted = addDateTimeOffset(birthDetails.date_of_birth, birthDetails.time_of_birth, offsetSeconds);
            onUpdateDetails(adjusted.date, adjusted.time);
        }
    };

    // Current Cusp Sublords
    const currentC1Sublord = houses[0]?.sub_lord || '-';
    const currentC9Sublord = houses[8]?.sub_lord || '-';
    const currentC1SSL = houses[0]?.sub_sub_lord || '-';
    const currentC9SSL = houses[8]?.sub_sub_lord || '-';

    const sublordMatchText = currentC1Sublord === currentC9Sublord 
        ? "✅ MATCHED" 
        : "❌ MISMATCHED";

    const sslMatchText = currentC1SSL === currentC9SSL 
        ? "✅ MATCHED" 
        : "❌ MISMATCHED";

    // Target parameters for Sunrise Vighati Method
    const targetNakshatra = metadata?.janma_nakshatra || '';
    const moonPlanet = planets.find(p => p.planet.toLowerCase().includes('moon'));
    const moonStarLord = moonPlanet?.star_lord || '-';
    const targetNakLord = getStarLordOfNakshatra(targetNakshatra) || moonStarLord;
    const targetGender = birthDetails.gender || 'Male';
    
    // Calendar weekday of actual birth date
    const [origY, origM, origD] = birthDetails.date_of_birth.split('-').map(Number);
    const origDateObj = new Date(origY, origM - 1, origD);
    const targetWeekday = weekdayNames[origDateObj.getDay()];

    const getVighatiResult = (offsetSec: number) => {
        // Calculate shifted date & time using our helper
        const shifted = addDateTimeOffset(birthDetails.date_of_birth, birthDetails.time_of_birth, offsetSec);
        
        // Parse timezone offset
        const tzOffset = parseTimezoneOffset(birthDetails.timezone);
        
        // Parse shifted date
        const [sy, sm, sd] = shifted.date.split('-').map(Number);
        const shiftedDateObj = new Date(sy, sm - 1, sd);
        
        // Parse shifted time
        const [sh, smin, ssec] = shifted.time.split(':').map(Number);
        const shiftedTotalSeconds = sh * 3600 + smin * 60 + (ssec || 0);
        
        // Get sunrise for the shifted date
        const sunriseDate = getSunriseTime(shiftedDateObj, birthDetails.latitude, birthDetails.longitude, tzOffset);
        const sunriseTotalSeconds = sunriseDate.getHours() * 3600 + sunriseDate.getMinutes() * 60 + sunriseDate.getSeconds();
        
        let elapsedSec = shiftedTotalSeconds - sunriseTotalSeconds;
        let isPreviousDaySunrise = false;
        
        if (elapsedSec < 0) {
            // Birth is before today's sunrise. In Vedic system, this belongs to the previous Vedic day!
            // So we need to calculate elapsed time relative to yesterday's sunrise.
            const prevDateObj = new Date(shiftedDateObj.getTime() - 24 * 60 * 60 * 1000);
            const prevSunriseDate = getSunriseTime(prevDateObj, birthDetails.latitude, birthDetails.longitude, tzOffset);
            const prevSunriseTotalSeconds = prevSunriseDate.getHours() * 3600 + prevSunriseDate.getMinutes() * 60 + prevSunriseDate.getSeconds();
            
            // Elapsed seconds is from yesterday's sunrise to today's birth time
            elapsedSec = (shiftedTotalSeconds + 24 * 3600) - prevSunriseTotalSeconds;
            isPreviousDaySunrise = true;
        }
        
        const elapsedMin = elapsedSec / 60;
        const V = elapsedMin * 2.5;
        const R = (Math.floor(Math.round(V * 4)) % 9) || 9;
        const planet = vighatiPlanets[R] || "Mercury";
        
        // Gender Calculation
        const genderRemainder = Math.floor(V) % 225;
        let gender: 'Male' | 'Female' = 'Male';
        if (genderRemainder >= 16 && genderRemainder <= 45) {
            gender = 'Female';
        } else if (genderRemainder >= 91 && genderRemainder <= 150) {
            gender = 'Female';
        }
        
        // Vedic Weekday:
        // If birth is before today's sunrise, Vedic day is previous calendar day.
        // Otherwise, it is the shifted calendar day's weekday.
        let dayIdx = shiftedDateObj.getDay();
        if (shiftedTotalSeconds < sunriseTotalSeconds) {
            dayIdx = (dayIdx - 1 + 7) % 7;
        }
        const vedicWeekday = weekdayNames[dayIdx];
        
        const sunriseTimeStr = [
            sunriseDate.getHours().toString().padStart(2, '0'),
            sunriseDate.getMinutes().toString().padStart(2, '0'),
            sunriseDate.getSeconds().toString().padStart(2, '0')
        ].join(':');
        
        return {
            elapsedMin,
            V,
            R,
            planet,
            gender,
            genderRemainder,
            vedicWeekday,
            shiftedDate: shifted.date,
            shiftedTime: shifted.time,
            sunriseTimeStr,
            isPreviousDaySunrise
        };
    };

    // Current unrectified Vighati result
    const currentVighati = getVighatiResult(0);

    const isNakLordMatched = currentVighati.planet.toLowerCase() === targetNakLord.toLowerCase();
    const isGenderMatched = currentVighati.gender.toLowerCase() === targetGender.toLowerCase();
    const isWeekdayMatched = currentVighati.vedicWeekday.toLowerCase() === targetWeekday.toLowerCase();

    const vighatiMatchText = isNakLordMatched ? "✅ MATCHED" : "❌ MISMATCHED";
    const genderMatchText = isGenderMatched ? "✅ MATCHED" : "❌ MISMATCHED";
    const weekdayMatchText = isWeekdayMatched ? "✅ MATCHED" : "❌ MISMATCHED";

    // Scan for three categories of matches in the ±3 minutes window
    const rawPerfectMatches: RawMatch[] = [];
    const rawNakshatraMatches: RawMatch[] = [];
    const rawGenderWeekdayMatches: RawMatch[] = [];

    for (let t = -180; t <= 180; t++) {
        const res = getVighatiResult(t);
        const matchesNak = res.planet.toLowerCase() === targetNakLord.toLowerCase();
        const matchesGender = res.gender.toLowerCase() === targetGender.toLowerCase();
        const matchesWeekday = res.vedicWeekday.toLowerCase() === targetWeekday.toLowerCase();

        if (matchesNak && matchesGender && matchesWeekday) {
            rawPerfectMatches.push({ offsetSeconds: t, planet: `${res.planet} (Perfect Match)` });
        } else if (matchesNak) {
            rawNakshatraMatches.push({ offsetSeconds: t, planet: res.planet });
        } else if (matchesGender && matchesWeekday) {
            rawGenderWeekdayMatches.push({ offsetSeconds: t, planet: `Gender & Weekday Match` });
        }
    }

    const perfectMatches = groupConsecutiveMatches(rawPerfectMatches);
    const nakshatraMatches = groupConsecutiveMatches(rawNakshatraMatches);
    const genderWeekdayMatches = groupConsecutiveMatches(rawGenderWeekdayMatches);

    return (
        <div style={{ padding: '16px', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', gap: '20px', background: '#fdfdfd' }}>
            
            {/* Method Selection Sub-Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <button 
                    onClick={() => setMethod('CUSP_ALIGN')}
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        background: method === 'CUSP_ALIGN' ? '#f1f5f9' : '#ffffff',
                        color: method === 'CUSP_ALIGN' ? '#000000' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    1st & 9th Cusp Match
                </button>
                <button 
                    onClick={() => setMethod('SUNRISE_VIGHATI')}
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        background: method === 'SUNRISE_VIGHATI' ? '#f1f5f9' : '#ffffff',
                        color: method === 'SUNRISE_VIGHATI' ? '#000000' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Sunrise Vighati Match
                </button>
            </div>

            {method === 'CUSP_ALIGN' ? (
                <>
                    {/* Method 1: Cusp Status Header Card */}
                    <div style={{
                        border: '1px solid #000000',
                        padding: '14px',
                        borderRadius: '6px',
                        background: '#ffffff'
                    }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
                            1st & 9th Cusp Alignment Status
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '10px' }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>1st Cusp Sublord</div>
                                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#000000' }}>{currentC1Sublord}</div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>SSL: {currentC1SSL}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>9th Cusp Sublord</div>
                                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#000000' }}>{currentC9Sublord}</div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>SSL: {currentC9SSL}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                            <span>Sublord Status: {sublordMatchText}</span>
                            <span>Sub-Sublord Status: {sslMatchText}</span>
                        </div>
                    </div>

                    {/* Scanner Suggestions Panel */}
                    <div style={{
                        border: '1px solid #000000',
                        padding: '14px',
                        borderRadius: '6px',
                        background: '#ffffff'
                    }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
                            Rectified Time Scan Recommendations (±3m)
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic', padding: '20px 0', fontWeight: 'bold' }}>
                                Scanning seconds in range...
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                
                                {/* Sublord alignment matches */}
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', borderBottom: '1px solid #fcd34d', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase' }}>
                                        🔸 Option A: Sublord Matches (High Priority)
                                    </div>
                                    {sublordMatches.length === 0 ? (
                                        <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#64748b', padding: '4px' }}>
                                            No exact sublord alignment found in ±3 minutes.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {sublordMatches.map((m) => (
                                                <div key={m.midpointOffset} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '8px 10px',
                                                    border: '1px solid #000000',
                                                    borderRadius: '4px',
                                                    background: '#fffdf5'
                                                }}>
                                                    <div>
                                                        <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{m.planet}</span>
                                                        <span style={{ fontSize: '0.65rem', color: '#64748b', marginLeft: '6px' }}>
                                                            (Span: {formatOffset(m.startOffset)} to {formatOffset(m.endOffset)})
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleApplyTime(m.midpointOffset)}
                                                        style={{
                                                            background: '#ffffff',
                                                            color: '#000000',
                                                            border: '1px solid #000000',
                                                            padding: '3px 8px',
                                                            fontSize: '0.68rem',
                                                            fontWeight: 700,
                                                            borderRadius: '3px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Apply {formatOffset(m.midpointOffset)}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Sub-sublord alignment matches */}
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369a1', borderBottom: '1px solid #bae6fd', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase' }}>
                                        🔹 Option B: Sub-Sublord Matches (Secondary Priority)
                                    </div>
                                    {subSublordMatches.length === 0 ? (
                                        <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#64748b', padding: '4px' }}>
                                            No sub-sublord alignment found in ±3 minutes.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                                            {subSublordMatches.map((m) => (
                                                <div key={m.midpointOffset} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '8px 10px',
                                                    border: '1px solid #000000',
                                                    borderRadius: '4px',
                                                    background: '#f0f9ff'
                                                }}>
                                                    <div>
                                                        <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{m.planet}</span>
                                                        <span style={{ fontSize: '0.65rem', color: '#64748b', marginLeft: '6px' }}>
                                                            (Span: {formatOffset(m.startOffset)} to {formatOffset(m.endOffset)})
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleApplyTime(m.midpointOffset)}
                                                        style={{
                                                            background: '#ffffff',
                                                            color: '#000000',
                                                            border: '1px solid #000000',
                                                            padding: '3px 8px',
                                                            fontSize: '0.68rem',
                                                            fontWeight: 700,
                                                            borderRadius: '3px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Apply {formatOffset(m.midpointOffset)}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* Target Parameters Summary */}
                    <div style={{
                        border: '1px solid #000000',
                        padding: '14px',
                        borderRadius: '6px',
                        background: '#ffffff'
                    }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
                            Target Match Parameters
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.75rem' }}>
                            <div>
                                <span style={{ color: '#64748b', fontWeight: 700 }}>Moon Nakshatra:</span> <strong style={{ color: '#000' }}>{targetNakshatra || 'Unknown'}</strong>
                            </div>
                            <div>
                                <span style={{ color: '#64748b', fontWeight: 700 }}>Nakshatra Lord:</span> <strong style={{ color: '#000' }}>{targetNakLord}</strong>
                            </div>
                            <div>
                                <span style={{ color: '#64748b', fontWeight: 700 }}>Native Gender:</span> <strong style={{ color: '#000' }}>{targetGender}</strong>
                            </div>
                            <div>
                                <span style={{ color: '#64748b', fontWeight: 700 }}>Birth Weekday:</span> <strong style={{ color: '#000' }}>{targetWeekday}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Method 2: Sunrise Vighati Status Header Card */}
                    <div style={{
                        border: '1px solid #000000',
                        padding: '14px',
                        borderRadius: '6px',
                        background: '#ffffff',
                        fontSize: '0.75rem'
                    }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center', color: '#000000' }}>
                            Sunrise Vighati Alignment Status
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><strong>Vighati Lord:</strong> {currentVighati.planet} <span style={{ color: '#64748b' }}>(R: {currentVighati.R})</span></span>
                                <strong style={{ color: isNakLordMatched ? '#166534' : '#b91c1c' }}>{vighatiMatchText}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><strong>Calculated Gender:</strong> {currentVighati.gender} <span style={{ color: '#64748b' }}>(Rem: {currentVighati.genderRemainder})</span></span>
                                <strong style={{ color: isGenderMatched ? '#166534' : '#b91c1c' }}>{genderMatchText}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><strong>Vedic Weekday:</strong> {currentVighati.vedicWeekday}</span>
                                <strong style={{ color: isWeekdayMatched ? '#166534' : '#b91c1c' }}>{weekdayMatchText}</strong>
                            </div>
                        </div>

                        {/* Overall Alignment Summary Banner */}
                        <div style={{
                            padding: '10px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            border: '1px solid #000',
                            borderRadius: '4px',
                            background: (isNakLordMatched && isGenderMatched && isWeekdayMatched) ? '#f0fdf4' : '#fffbeb',
                            color: (isNakLordMatched && isGenderMatched && isWeekdayMatched) ? '#166534' : '#92400e'
                        }}>
                            {(isNakLordMatched && isGenderMatched && isWeekdayMatched) 
                                ? "🎉 PERFECT ALIGNMENT MATCH ACHIEVED!" 
                                : "⚠️ Parameters mismatched. Please apply a rectified time below."}
                        </div>

                        {/* Calculation Toggle Button */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                            <button
                                onClick={() => setShowCalculations(!showCalculations)}
                                style={{
                                    background: '#ffffff',
                                    color: '#000000',
                                    border: '1px solid #000000',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {showCalculations ? 'Hide Calculations' : 'Show Calculations'}
                            </button>
                        </div>

                        {/* Calculation Steps Flow */}
                        {showCalculations && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155', padding: '10px 0', borderTop: '1px solid #e2e8f0', marginTop: '10px' }}>
                                <div>
                                    <strong>Astronomical Sunrise:</strong> {currentVighati.sunriseTimeStr} {currentVighati.isPreviousDaySunrise && "(Previous Day Sunrise used)"}
                                </div>
                                <div>
                                    <strong>Birth Time:</strong> {birthDetails.time_of_birth}
                                </div>
                                <div>
                                    <strong>Elapsed Time from Sunrise:</strong> {Math.floor(currentVighati.elapsedMin)}m {Math.round((currentVighati.elapsedMin % 1) * 60)}s
                                </div>
                                <div>
                                    <strong>Vighati (Elapsed min × 2.5):</strong> {currentVighati.V.toFixed(2)} Vighatis
                                </div>
                                <div>
                                    <strong>Kunda Planet Formula:</strong> (Vighati × 4) % 9 = <strong style={{ color: '#0369a1' }}>{currentVighati.R}</strong> ({currentVighati.planet})
                                </div>
                                <div>
                                    <strong>Gender Formula:</strong> Vighati % 225 = <strong style={{ color: '#0369a1' }}>{currentVighati.genderRemainder}</strong> ({currentVighati.gender})
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                                        * Male Ranges: 0-15, 46-90, 151-224 | Female Ranges: 16-45, 91-150
                                    </div>
                                </div>
                                <div>
                                    <strong>Vedic Weekday:</strong> <strong style={{ color: '#0369a1' }}>{currentVighati.vedicWeekday}</strong>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                                        * A new Vedic Day starts exactly at astronomical sunrise.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vighati Matches Suggestions Panel */}
                    <div style={{
                        border: '1px solid #000000',
                        padding: '14px',
                        borderRadius: '6px',
                        background: '#ffffff'
                    }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
                            Vighati Time Rectification Options (±3m)
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Category A: Perfect Matches */}
                            <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', borderBottom: '1px solid #bbf7d0', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    🌟 Category 1: Perfect Alignment Matches (All 3 Align)
                                </div>
                                {perfectMatches.length === 0 ? (
                                    <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#64748b', padding: '4px' }}>
                                        No perfect alignment found in ±3 minutes.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {perfectMatches.map((m) => (
                                            <div key={m.midpointOffset} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 10px',
                                                border: '1px solid #000000',
                                                borderRadius: '4px',
                                                background: '#f0fdf4'
                                            }}>
                                                <div>
                                                    <span style={{ fontWeight: 800, fontSize: '0.78rem', color: '#166534' }}>{targetNakLord} (Perfect)</span>
                                                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginLeft: '6px' }}>
                                                        (Span: {formatOffset(m.startOffset)} to {formatOffset(m.endOffset)})
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleApplyTime(m.midpointOffset)}
                                                    style={{
                                                        background: '#ffffff',
                                                        color: '#000000',
                                                        border: '1px solid #000000',
                                                        padding: '3px 8px',
                                                        fontSize: '0.68rem',
                                                        fontWeight: 700,
                                                        borderRadius: '3px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Apply {formatOffset(m.midpointOffset)}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Category B: Nakshatra Lord Matches */}
                            <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369a1', borderBottom: '1px solid #bae6fd', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    🔸 Category 2: Nakshatra Lord Matches
                                </div>
                                {nakshatraMatches.length === 0 ? (
                                    <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#64748b', padding: '4px' }}>
                                        No Nakshatra Lord matches found in ±3 minutes.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                                        {nakshatraMatches.map((m) => (
                                            <div key={m.midpointOffset} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 10px',
                                                border: '1px solid #000000',
                                                borderRadius: '4px',
                                                background: '#f0f9ff'
                                            }}>
                                                <div>
                                                    <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{m.planet}</span>
                                                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginLeft: '6px' }}>
                                                        (Span: {formatOffset(m.startOffset)} to {formatOffset(m.endOffset)})
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleApplyTime(m.midpointOffset)}
                                                    style={{
                                                        background: '#ffffff',
                                                        color: '#000000',
                                                        border: '1px solid #000000',
                                                        padding: '3px 8px',
                                                        fontSize: '0.68rem',
                                                        fontWeight: 700,
                                                        borderRadius: '3px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Apply {formatOffset(m.midpointOffset)}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Category C: Gender & Weekday Matches */}
                            <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', borderBottom: '1px solid #fcd34d', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    🔹 Category 3: Gender & Vedic Weekday Matches
                                </div>
                                {genderWeekdayMatches.length === 0 ? (
                                    <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#64748b', padding: '4px' }}>
                                        No Gender & Weekday matches found in ±3 minutes.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                                        {genderWeekdayMatches.map((m) => (
                                            <div key={m.midpointOffset} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 10px',
                                                border: '1px solid #000000',
                                                borderRadius: '4px',
                                                background: '#fffdf5'
                                            }}>
                                                <div>
                                                    <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{m.planet}</span>
                                                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginLeft: '6px' }}>
                                                        (Span: {formatOffset(m.startOffset)} to {formatOffset(m.endOffset)})
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleApplyTime(m.midpointOffset)}
                                                    style={{
                                                        background: '#ffffff',
                                                        color: '#000000',
                                                        border: '1px solid #000000',
                                                        padding: '3px 8px',
                                                        fontSize: '0.68rem',
                                                        fontWeight: 700,
                                                        borderRadius: '3px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Apply {formatOffset(m.midpointOffset)}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </>
            )}

            <p style={{ textAlign: 'center', fontSize: '0.68rem', fontStyle: 'italic', color: '#64748b', lineHeight: 1.3 }}>
                * Click "Apply" to instantly update the birth chart time to the rectified coordinates.
            </p>
        </div>
    );
};

export default BirthTimeRectification;
