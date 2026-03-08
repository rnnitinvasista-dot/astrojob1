import React, { useState } from 'react';
import type { Planet, Ascendant } from '../../types/astrology';

interface VargaPlanet {
    planet: string;
    sign: string;
    is_retrograde: boolean;
}

interface VargaChartData {
    planets: VargaPlanet[];
    ascendant: { sign: string };
}

interface PremiumSouthIndianChartProps {
    vargaCharts?: Record<string, VargaChartData>;
    planets: Planet[]; // D1 fallback
    ascendant: Ascendant; // D1 fallback
    birthDetails?: any;
    chartMode?: 'Rashi' | 'Bhava';
}

const PremiumSouthIndianChart: React.FC<PremiumSouthIndianChartProps> = ({
    vargaCharts,
    planets,
    ascendant,
    birthDetails,
    chartMode = 'Rashi'
}) => {
    const [selectedVarga, setSelectedVarga] = useState<string>('D1');

    const vargas = [
        'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12',
        'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
    ];

    const signCoords: Record<string, { r: number, c: number }> = {
        "Pisces": { r: 0, c: 0 }, "Aries": { r: 0, c: 1 }, "Taurus": { r: 0, c: 2 }, "Gemini": { r: 0, c: 3 },
        "Cancer": { r: 1, c: 3 }, "Leo": { r: 2, c: 3 }, "Virgo": { r: 3, c: 3 }, "Libra": { r: 3, c: 2 },
        "Scorpio": { r: 3, c: 1 }, "Sagittarius": { r: 3, c: 0 }, "Capricorn": { r: 2, c: 0 }, "Aquarius": { r: 1, c: 0 },
    };

    const signList = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    const currentVargaData = (selectedVarga === 'D1' || !vargaCharts) ? {
        planets: planets.map(p => ({ planet: p.planet, sign: p.sign, is_retrograde: p.is_retrograde, is_combust: p.is_combust, house_placed: p.house_placed })),
        ascendant: { sign: ascendant.sign }
    } : {
        ...vargaCharts[selectedVarga],
        planets: vargaCharts[selectedVarga].planets.map(p => ({ ...p, is_combust: false, house_placed: 0 }))
    };

    const getPlanetsInBox = (sign: string) => {
        const items: any[] = [];

        if (chartMode === 'Bhava') {
            const ascSignIdx = signList.indexOf(ascendant.sign);
            const currentSignIdx = signList.indexOf(sign);
            let houseNum = (currentSignIdx - ascSignIdx + 12) % 12 + 1;

            if (houseNum === 1) {
                items.push({ name: 'Lagna', isRetro: false, isAsc: true });
            }

            planets.filter(p => p.house_placed === houseNum).forEach(p => {
                items.push({ name: p.planet.slice(0, 2).toUpperCase(), isRetro: p.is_retrograde, isCombust: p.is_combust, isAsc: false });
            });

        } else {
            if (currentVargaData.ascendant.sign === sign) {
                items.push({ name: 'Lagna', isRetro: false, isAsc: true });
            }
            currentVargaData.planets.filter(p => p.sign === sign).forEach((p: any) => {
                items.push({ name: p.planet.slice(0, 2).toUpperCase(), isRetro: p.is_retrograde, isCombust: p.is_combust, isAsc: false });
            });
        }
        return items;
    };

    const calculateAge = (dob: string): string => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years}Y ${months}M`;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    return (
        <div className="card" style={{ padding: '1rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ color: '#3b82f6', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                    {chartMode === 'Bhava' ? 'KP Bhava Chalit Chart' : 'Divisional Chart'}
                </h2>
                {chartMode === 'Rashi' && (
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        background: '#e2e8f0',
                        padding: '4px',
                        borderRadius: '8px',
                        overflowX: 'auto',
                        maxWidth: '220px',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}>
                        {vargas.map(v => (
                            <button
                                key={v}
                                onClick={() => setSelectedVarga(v)}
                                style={{
                                    padding: '4px 8px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: selectedVarga === v ? '#fff' : 'transparent',
                                    color: selectedVarga === v ? '#3b82f6' : '#64748b',
                                    boxShadow: selectedVarga === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    flexShrink: 0
                                }}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                gap: '2px',
                background: '#e2e8f0',
                border: '1px solid #e2e8f0',
                aspectRatio: '1/1',
                maxWidth: '400px',
                margin: '0 auto'
            }}>
                {Array.from({ length: 16 }).map((_, i) => {
                    const r = Math.floor(i / 4);
                    const c = i % 4;

                    // Middle 4 squares
                    if (r > 0 && r < 3 && c > 0 && c < 3) {
                        if (r === 1 && c === 1) {
                            return (
                                <div key={i} style={{
                                    gridRow: '2 / 4',
                                    gridColumn: '2 / 4',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    fontSize: '0.75rem',
                                    color: '#334155',
                                    padding: '4px',
                                    lineHeight: '1.4'
                                }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>
                                        {chartMode === 'Bhava' ? 'KP Bhava' : selectedVarga}
                                    </div>
                                    <div style={{ fontWeight: 700 }}>{birthDetails?.name || 'Native'}</div>
                                    <div style={{ fontSize: '0.7rem' }}>
                                        {birthDetails?.date_of_birth && `(${calculateAge(birthDetails.date_of_birth)})`}
                                    </div>
                                    <div style={{ marginTop: '4px' }}>{formatDate(birthDetails?.date_of_birth)} {birthDetails?.time_of_birth}</div>
                                    <div>{birthDetails?.place || 'Unknown'}</div>
                                </div>
                            );
                        }
                        return null;
                    }

                    const sign = Object.entries(signCoords).find(([_, coord]) => coord.r === r && coord.c === c)?.[0];
                    const signPlanets = sign ? getPlanetsInBox(sign) : [];

                    let boxLabel = sign?.slice(0, 3).toUpperCase() || '';
                    if (sign && chartMode === 'Bhava') {
                        const ascSignIdx = signList.indexOf(ascendant.sign);
                        const currentSignIdx = signList.indexOf(sign);
                        let houseNum = (currentSignIdx - ascSignIdx + 12) % 12 + 1;
                        boxLabel = `H${houseNum}`;
                    }

                    return (
                        <div key={i} style={{
                            background: '#fff',
                            padding: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            minHeight: '60px'
                        }}>
                            {sign && (
                                <>
                                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>{boxLabel}</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
                                        {signPlanets.map((p, pi) => (
                                            <span key={pi} style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 800,
                                                color: p.isAsc ? '#0284c7' : '#1e293b',
                                                padding: '1px 2px',
                                                borderRadius: '2px'
                                            }}>
                                                {p.name}
                                                {p.isRetro && <span style={{ color: 'red', marginLeft: '1px' }}>*</span>}
                                                {p.isCombust && <span style={{ color: '#8b5cf6', marginLeft: '1px', fontSize: '0.6rem' }}>(c)</span>}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#64748b', fontWeight: 500, display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <span><span style={{ color: '#0284c7', fontWeight: 800 }}>Lagna</span> = Ascendant</span>
                <span><span style={{ color: 'red' }}>*</span> = Retrograde</span>
                <span><span style={{ color: '#8b5cf6' }}>(c)</span> = Combust</span>
            </div>
        </div>
    );
};

export default PremiumSouthIndianChart;
