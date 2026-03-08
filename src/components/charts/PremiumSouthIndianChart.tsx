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

    // Signs in order for indexing
    const signList = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    const currentVargaData = (selectedVarga === 'D1' || !vargaCharts) ? {
        planets: planets.map(p => ({ planet: p.planet, sign: p.sign, is_retrograde: p.is_retrograde, house: p.house_placed })),
        ascendant: { sign: ascendant.sign }
    } : {
        ...vargaCharts[selectedVarga],
        planets: vargaCharts[selectedVarga].planets.map(p => ({ ...p, house: 0 })) // House not applicable for vargas in this view
    };

    const getPlanetsInBox = (boxName: string, mode: 'Rashi' | 'Bhava') => {
        const items = [];
        if (mode === 'Bhava') {
            // boxName is House number "1" to "12"
            const hNum = parseInt(boxName);
            if (hNum === 1) items.push({ name: 'Lagna', isRetro: false, isAsc: true });
            planets.filter(p => p.house_placed === hNum).forEach(p => {
                items.push({ name: p.planet.slice(0, 2), isRetro: p.is_retrograde, isAsc: false });
            });
        } else {
            // boxName is Sign name
            if (currentVargaData.ascendant.sign === boxName) {
                items.push({ name: 'Lagna', isRetro: false, isAsc: true });
            }
            currentVargaData.planets.filter(p => p.sign === boxName).forEach(p => {
                items.push({ name: p.planet.slice(0, 2), isRetro: p.is_retrograde, isAsc: false });
            });
        }
        return items;
    };

    // For Bhava mode, we map 12 houses to the 12 boxes.
    // Box (0,0) = Pisces Sign OR House 12
    // Box (0,1) = Aries Sign OR House 1
    const getBoxLabel = (r: number, c: number) => {
        const sign = Object.entries(signCoords).find(([_, coord]) => coord.r === r && coord.c === c)?.[0];
        if (chartMode === 'Bhava') {
            if (!sign) return null;
            // Map Aries box to House 1, etc.
            const sIdx = signList.indexOf(sign); // Aries = 0, Taurus = 1...
            // Shift so Aries Box shows House 1?
            // Usually, Bhava Chart Box 1 = House 1.
            // In South Indian style, box indices are fixed.
            // Let's just use the sign's position to show the house. 
            // e.g. Box Aries shows house number?
            return `H${(sIdx + 1)}`;
        }
        return sign?.slice(0, 3).toUpperCase();
    };

    return (
        <div className="premium-chart-container" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '1.5rem',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxWidth: '500px',
            margin: '1rem auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    {chartMode === 'Bhava' ? 'KP Bhava Chart' : 'Divisional Chart'}
                </h2>
                {chartMode === 'Rashi' && (
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        background: '#e2e8f0',
                        padding: '4px',
                        borderRadius: '12px',
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
                                    padding: '6px 10px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: selectedVarga === v ? '#fff' : 'transparent',
                                    color: selectedVarga === v ? '#3b82f6' : '#64748b',
                                    boxShadow: selectedVarga === v ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
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
                                    padding: '0.5rem',
                                    color: '#334155'
                                }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#3b82f6' }}>{chartMode === 'Bhava' ? 'KP' : selectedVarga}</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>{birthDetails?.name || 'Native'}</div>
                                </div>
                            );
                        }
                        return null;
                    }

                    const label = getBoxLabel(r, c);
                    const sign = Object.entries(signCoords).find(([_, coord]) => coord.r === r && coord.c === c)?.[0];
                    const planetsInBox = sign ? getPlanetsInBox(chartMode === 'Bhava' ? (signList.indexOf(sign) + 1).toString() : sign, chartMode) : [];

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
                            {label && (
                                <>
                                    <span style={{
                                        fontSize: '0.55rem',
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        position: 'absolute',
                                        top: '4px',
                                        left: '6px'
                                    }}>{label}</span>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '4px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '1.2rem',
                                        height: '100%'
                                    }}>
                                        {planetsInBox.map((p, pi) => (
                                            <div key={pi} style={{
                                                fontSize: '0.8rem',
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
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#fff',
                borderRadius: '12px',
                fontSize: '0.7rem',
                color: '#64748b',
                lineHeight: 1.4,
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
