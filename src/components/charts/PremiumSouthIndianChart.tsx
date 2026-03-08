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
}

const PremiumSouthIndianChart: React.FC<PremiumSouthIndianChartProps> = ({
    vargaCharts,
    planets,
    ascendant,
    birthDetails
}) => {
    const [selectedVarga, setSelectedVarga] = useState<string>('D1');

    const vargas = ['D1', 'D9', 'D10', 'D12', 'D30', 'D60'];

    const signCoords: Record<string, { r: number, c: number }> = {
        "Pisces": { r: 0, c: 0 }, "Aries": { r: 0, c: 1 }, "Taurus": { r: 0, c: 2 }, "Gemini": { r: 0, c: 3 },
        "Cancer": { r: 1, c: 3 }, "Leo": { r: 2, c: 3 }, "Virgo": { r: 3, c: 3 }, "Libra": { r: 3, c: 2 },
        "Scorpio": { r: 3, c: 1 }, "Sagittarius": { r: 3, c: 0 }, "Capricorn": { r: 2, c: 0 }, "Aquarius": { r: 1, c: 0 },
    };

    const currentVargaData = selectedVarga === 'D1' || !vargaCharts ? {
        planets: planets.map(p => ({ planet: p.planet, sign: p.sign, is_retrograde: p.is_retrograde })),
        ascendant: { sign: ascendant.sign }
    } : vargaCharts[selectedVarga];

    const getPlanetsInSign = (sign: string) => {
        const items = [];
        if (currentVargaData.ascendant.sign === sign) {
            items.push({ name: 'Lagna', isRetro: false, isAsc: true });
        }
        currentVargaData.planets.filter(p => p.sign === sign).forEach(p => {
            items.push({
                name: p.planet.slice(0, 2),
                isRetro: p.is_retrograde,
                isAsc: false
            });
        });
        return items;
    };

    return (
        <div className="premium-chart-container" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '2rem',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxWidth: '500px',
            margin: '2rem auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    Divisional Chart
                </h2>
                <div style={{ display: 'flex', gap: '4px', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
                    {vargas.map(v => (
                        <button
                            key={v}
                            onClick={() => setSelectedVarga(v)}
                            style={{
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: selectedVarga === v ? '#fff' : 'transparent',
                                color: selectedVarga === v ? '#3b82f6' : '#64748b',
                                boxShadow: selectedVarga === v ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                gap: '8px',
                aspectRatio: '1/1',
                background: '#cbd5e1',
                padding: '8px',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                {Array.from({ length: 16 }).map((_, i) => {
                    const r = Math.floor(i / 4);
                    const c = i % 4;

                    if (r > 0 && r < 3 && c > 0 && c < 3) {
                        if (r === 1 && c === 1) {
                            return (
                                <div key={i} style={{
                                    gridRow: '2 / 4',
                                    gridColumn: '2 / 4',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: '1rem',
                                    color: '#334155'
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{selectedVarga}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>{birthDetails?.name || 'Native'}</div>
                                </div>
                            );
                        }
                        return null;
                    }

                    const sign = Object.entries(signCoords).find(([_, coord]) => coord.r === r && coord.c === c)?.[0];
                    const signPlanets = sign ? getPlanetsInSign(sign) : [];

                    return (
                        <div key={i} style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            transition: 'all 0.2s',
                            cursor: 'default'
                        }}>
                            {sign && (
                                <>
                                    <span style={{
                                        fontSize: '0.55rem',
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        position: 'absolute',
                                        top: '4px',
                                        left: '6px'
                                    }}>{sign.slice(0, 3).toUpperCase()}</span>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '4px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '1.2rem',
                                        height: '100%'
                                    }}>
                                        {signPlanets.map((p, pi) => (
                                            <div key={pi} style={{
                                                fontSize: '0.85rem',
                                                fontWeight: 800,
                                                color: p.isAsc ? '#ef4444' : '#1e293b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: p.isAsc ? '#fef2f2' : 'transparent',
                                                padding: '2px 4px',
                                                borderRadius: '4px'
                                            }}>
                                                {p.name}
                                                {p.isRetro && <span style={{ color: '#f59e0b', marginLeft: '1px' }}>*</span>}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#fff',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: '#64748b',
                lineHeight: 1.5,
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span><span style={{ color: '#ef4444', fontWeight: 800 }}>Lagna</span> = Ascendant</span>
                    <span><span style={{ color: '#f59e0b', fontWeight: 800 }}>*</span> = Retrograde</span>
                </div>
            </div>
        </div>
    );
};

export default PremiumSouthIndianChart;
