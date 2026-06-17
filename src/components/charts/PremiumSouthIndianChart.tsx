import React, { useState, useEffect } from 'react';
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
    chartStyle?: 'South Indian' | 'North Indian';
    janmaNakshatra?: string;
    pada?: number;
    rashi?: string;
    forceVarga?: string;
    onVargaChange?: (varga: string) => void;
}

const PremiumSouthIndianChart: React.FC<PremiumSouthIndianChartProps> = ({
    vargaCharts,
    planets,
    ascendant,
    birthDetails,
    chartMode = 'Rashi',
    chartStyle: _chartStyle = 'South Indian',
    janmaNakshatra,
    pada,
    rashi,
    forceVarga,
    onVargaChange
}) => {
    const [selectedVarga, setSelectedVarga] = useState<string>(forceVarga || 'D1');

    // Sync state if prop changes
    useEffect(() => {
        if (forceVarga) setSelectedVarga(forceVarga);
    }, [forceVarga]);

    const vargas = [
        'D1', 'D2', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'
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

    const currentVargaData = (selectedVarga === 'D1' || !vargaCharts?.[selectedVarga]) ? {
        planets: planets.map(p => ({ planet: p.planet, sign: p.sign, is_retrograde: p.is_retrograde, is_combust: p.is_combust, house_placed: p.house_placed })),
        ascendant: { sign: ascendant.sign }
    } : {
        ...vargaCharts[selectedVarga],
        planets: vargaCharts[selectedVarga].planets.map(p => ({ ...p, is_combust: false, house_placed: 0 }))
    };

    const getPlanetsInBox = (sign: string) => {
        const items: any[] = [];

        if (chartMode === 'Bhava' && selectedVarga === 'D1') {
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

    const calculateAge = (dob: string) => {
        if (!dob) return '';
        const birth = new Date(dob);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        return `${age}Y ${now.getMonth() + 1}M`;
    };

    const formatDate = (date: string) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB');
    };

    return (
        <div style={{ background: '#FDFCF8', padding: '1rem', borderRadius: '12px', border: '3px solid #000', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', margin: '0 auto', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                    {chartMode === 'Bhava' ? 'KP BHAVA CHART' : `${selectedVarga} CHART`}
                </div>
                {chartMode !== 'Bhava' && (
                    <div style={{ 
                        display: 'flex', 
                        gap: '4px', 
                        padding: '4px', 
                        background: '#f1f5f9', 
                        borderRadius: '8px', 
                        overflowX: 'auto',
                        maxWidth: '220px',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
                        border: '1px solid #ddd'
                    }}>
                        {vargas.map(v => (
                            <button
                                key={v}
                                onClick={() => {
                                    setSelectedVarga(v);
                                    if (onVargaChange) onVargaChange(v);
                                }}
                                style={{
                                    padding: '4px 8px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: selectedVarga === v ? 'var(--primary)' : 'transparent',
                                    color: selectedVarga === v ? '#000000' : 'var(--text-muted)',
                                    boxShadow: selectedVarga === v ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
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
                gap: '1px',
                background: '#000',
                border: '2px solid #000',
                aspectRatio: '1/1',
                width: '100%',
                maxWidth: '450px',
                margin: '0 auto',
                flexShrink: 0
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
                                    background: 'var(--secondary-light)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    fontSize: '0.65rem',
                                    color: '#334155',
                                    padding: '4px',
                                    lineHeight: '1.4'
                                }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', marginBottom: '2px' }}>
                                        {chartMode === 'Bhava' ? 'KP' : selectedVarga}
                                    </div>
                                    <div style={{ fontWeight: 700 }}>{birthDetails?.name || 'Native'}</div>
                                    <div style={{ fontSize: '0.6rem' }}>
                                        {birthDetails?.date_of_birth && `(${calculateAge(birthDetails.date_of_birth)})`}
                                    </div>
                                    <div style={{ marginTop: '2px' }}>{formatDate(birthDetails?.date_of_birth)} {birthDetails?.time_of_birth}</div>
                                    <div style={{ fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>
                                        {rashi && `${rashi} Rashi`} {janmaNakshatra && `| ${janmaNakshatra}${pada ? '-' + pada : ''}`}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }

                    const sign = Object.entries(signCoords).find(([_, coord]) => coord.r === r && coord.c === c)?.[0];
                    const signPlanets = sign ? getPlanetsInBox(sign) : [];

                    let boxLabel = sign?.slice(0, 3).toUpperCase() || '';
                    if (sign) {
                        const lagnaSign = (chartMode === 'Bhava' && selectedVarga === 'D1') ? ascendant.sign : currentVargaData.ascendant.sign;
                        const ascSignIdx = signList.indexOf(lagnaSign);
                        const currentSignIdx = signList.indexOf(sign);
                        let houseNum = (currentSignIdx - ascSignIdx + 12) % 12 + 1;

                        if (chartMode === 'Bhava' && selectedVarga === 'D1') {
                            boxLabel = `H${houseNum}`;
                        } else {
                            boxLabel = `${sign.slice(0, 3).toUpperCase()} (H${houseNum})`;
                        }
                    }

                    return (
                        <div key={i} style={{ background: '#fff', padding: '4px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#64748b', marginBottom: '2px', textTransform: 'uppercase' }}>
                                {boxLabel}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', alignItems: 'flex-start', contentVisibility: 'auto' }}>
                                {signPlanets.map((p, idx) => (
                                    <span key={idx} style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        color: p.isAsc ? '#d97706' : (p.isRetro ? '#7c3aed' : (p.isCombust ? '#b91c1c' : '#1e40af')),
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {p.name}{p.isRetro ? '*' : ''}{p.isCombust ? '(c)' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.65rem', fontWeight: 700, color: '#64748b', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                <span style={{ color: '#d97706' }}>Lagna = Ascendant</span>
                <span style={{ color: '#7c3aed' }}>* = Retrograde</span>
                <span style={{ color: '#b91c1c' }}>(c) = Combust</span>
            </div>
        </div>
    );
};

export default PremiumSouthIndianChart;
