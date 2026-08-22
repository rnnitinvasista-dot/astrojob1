import React, { useState } from 'react';
import type { Planet, Ascendant, House } from '../../types/astrology';

interface FortunaAnalysisProps {
    planets: Planet[];
    ascendant: Ascendant;
    houses: House[];
}

const signList = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const fortunaPredictions: Record<number, string> = {
    1: "Fortunate in Self effort and Successful in all Areas.",
    2: "Fortunate from Family, Wealth, Speech and Investment.",
    3: "Fortunate from Siblings, Communication, Commission, Courage and Effort.",
    4: "Fortunate from Studies, Teaching, Home, Real estate and Mother.",
    5: "Fortunate from Art, Creative, Children, Sports, Music, Healer and Past Deeds.",
    6: "Fortunate from Job, Service, No Enemies, No Disease and Partnership.",
    7: "Fortunate from Spouse, Partnership, Public, Dealer and Business.",
    8: "Fortunate from Unearned wealth, Inheritance, Legacy and No Pain / Suffering.",
    9: "Fortunate from Spirituality, Father, Philosophy, Moral, Values and Institution.",
    10: "Fortunate from Career, Name, Fame, Public, Government and Authority.",
    11: "Fortunate from Friends, Socializing, Networking and Profits from all Areas.",
    12: "Fortunate from Spirituality, Hospital, Meditation, No loss and Suffering."
};

const dmsToDecimal = (dms: string | undefined, decimalVal?: number): number => {
    if (decimalVal !== undefined) return decimalVal;
    if (!dms) return 0;
    const parts = dms.split(/[°'":]/).map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    if (parts.length === 0) return 0;
    let dec = parts[0];
    if (parts.length > 1) dec += parts[1] / 60;
    if (parts.length > 2) dec += parts[2] / 3600;
    return dec;
};

const decimalToDMS = (decimal: number): string => {
    const deg = Math.floor(decimal);
    const minFloat = (decimal - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    return `${deg}° ${min}' ${sec}"`;
};

const getAbsoluteDegrees = (sign: string, dms: string | undefined, decimalVal?: number): number => {
    const signIdx = signList.findIndex(s => s.toLowerCase() === sign.toLowerCase());
    if (signIdx === -1) return 0;
    const deg = dmsToDecimal(dms, decimalVal);
    return signIdx * 30 + deg;
};

const FortunaAnalysis: React.FC<FortunaAnalysisProps> = ({ planets, ascendant, houses }) => {
    const [showCalculation, setShowCalculation] = useState(false);

    const sun = planets.find(p => p.planet.toLowerCase() === 'sun');
    const moon = planets.find(p => p.planet.toLowerCase() === 'moon');

    if (!sun || !moon || !ascendant) {
        return (
            <div style={{
                padding: '16px',
                background: '#ffffff',
                border: '1px solid #000000',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: '#ef4444',
                textAlign: 'center',
                marginTop: '1.5rem',
                margin: '1.5rem auto 0 auto',
                maxWidth: '500px'
            }}>
                Missing Sun, Moon, or Ascendant data to calculate Fortuna Point.
            </div>
        );
    }

    // Lagna (L)
    const L = getAbsoluteDegrees(ascendant.sign, ascendant.degree_dms, ascendant.degree_decimal);
    const L_dms = ascendant.degree_dms || decimalToDMS(ascendant.degree_decimal || 0);

    // Moon (M)
    const M = getAbsoluteDegrees(moon.sign, moon.degree_dms, moon.degree_decimal);
    const M_dms = moon.degree_dms || decimalToDMS(moon.degree_decimal || 0);

    // Sun (S)
    const S = getAbsoluteDegrees(sun.sign, sun.degree_dms, sun.degree_decimal);
    const S_dms = sun.degree_dms || decimalToDMS(sun.degree_decimal || 0);

    // Calculate raw and balanced totals
    const rawTotal = L + M - S;
    let balance = rawTotal % 360;
    if (balance < 0) balance += 360;

    // Resolve Rasi / Degree of Fortuna Point
    const fSignIdx = Math.floor(balance / 30);
    const fSign = signList[fSignIdx];
    const fDeg = balance % 30;
    const fDMS = decimalToDMS(fDeg);

    // Resolve Fortuna House placement (As per Bhava Cusp absolute degrees)
    const cuspAbsDegrees = houses.map(h => {
        return getAbsoluteDegrees(h.sign, h.cusp_degree_dms, h.cusp_degree_decimal);
    });

    let fortunaHouse = 1;
    const isDegreeInHouse = (deg: number, startCusp: number, endCusp: number) => {
        if (startCusp < endCusp) {
            return deg >= startCusp && deg < endCusp;
        } else {
            return deg >= startCusp || deg < endCusp;
        }
    };

    if (cuspAbsDegrees.length === 12) {
        for (let i = 0; i < 12; i++) {
            const startCusp = cuspAbsDegrees[i];
            const endCusp = cuspAbsDegrees[(i + 1) % 12];
            if (isDegreeInHouse(balance, startCusp, endCusp)) {
                fortunaHouse = i + 1;
                break;
            }
        }
    } else {
        // Fallback Rashi-based counting from Lagna sign index
        const ascSignIdx = signList.findIndex(s => s.toLowerCase() === ascendant.sign.toLowerCase());
        fortunaHouse = (fSignIdx - ascSignIdx + 12) % 12 + 1;
    }

    const prediction = fortunaPredictions[fortunaHouse] || "Highly fortunate and prosperous results.";

    // Formatting ordinals helper
    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #000000',
            padding: '16px',
            fontFamily: "'Inter', sans-serif",
            marginTop: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            margin: '1.5rem auto 0 auto',
            borderRadius: '6px'
        }}>
            {/* Simple Text Title */}
            <div style={{
                fontWeight: 800,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                textAlign: 'center',
                letterSpacing: '0.5px',
                marginBottom: '12px',
                color: '#000000'
            }}>
                Fortuna Point Analysis
            </div>

            {/* Simple Text Axiom */}
            <div style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#475569',
                lineHeight: '1.4',
                textAlign: 'center',
                marginBottom: '14px',
                padding: '0 4px',
                fontStyle: 'italic'
            }}>
                {`{ Fortuna Point house from Lagna prospers with very less negativity of that particular house and increases it's positivity highly }`}
            </div>

            {/* Simple Result Block */}
            <div style={{
                textAlign: 'center',
                padding: '10px 0',
                borderTop: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                marginBottom: '14px'
            }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
                    Fortuna Placement
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#000000', margin: '4px 0' }}>
                    {getOrdinal(fortunaHouse)} House
                </div>
                <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#000000',
                    lineHeight: '1.4',
                    padding: '4px 0'
                }}>
                    <strong>{fortunaHouse} = </strong> {prediction}
                </div>
            </div>

            {/* Toggle Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: showCalculation ? '14px' : '0px' }}>
                <button
                    onClick={() => setShowCalculation(!showCalculation)}
                    style={{
                        background: '#ffffff',
                        color: '#000000',
                        border: '1px solid #000000',
                        padding: '4px 12px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                >
                    {showCalculation ? 'Hide Calculation' : 'Show Calculation'}
                </button>
            </div>

            {/* Detailed Calculation Section (Hidden by Default) */}
            {showCalculation && (
                <div style={{
                    paddingTop: '12px',
                    borderTop: '1px dashed #e2e8f0',
                    fontSize: '0.75rem',
                    color: '#334155'
                }}>
                    {/* Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                        <div>
                            <strong>Lagna (Ascendant):</strong> {ascendant.sign} {L_dms} ({L.toFixed(4)}°)
                        </div>
                        <div>
                            <strong>Moon (Mo):</strong> {moon.sign} {M_dms} ({M.toFixed(4)}°)
                        </div>
                        <div>
                            <strong>Sun (Su):</strong> {sun.sign} {S_dms} ({S.toFixed(4)}°)
                        </div>
                    </div>

                    {/* Math Formulation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                        <div>
                            <strong>Formula:</strong> Lagna + Moon - Sun
                        </div>
                        <div>
                            <strong>Steps:</strong> {L.toFixed(4)}° + {M.toFixed(4)}° - {S.toFixed(4)}° = {rawTotal.toFixed(4)}°
                        </div>
                        <div>
                            <strong>Modulus 360° Balance:</strong> {balance.toFixed(4)}°
                        </div>
                    </div>

                    {/* Resolved Coordinates */}
                    <div style={{
                        paddingTop: '8px',
                        borderTop: '1px solid #f1f5f9',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
                            Calculated Fortuna Coordinate
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                            {fSign} {fDMS}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FortunaAnalysis;
