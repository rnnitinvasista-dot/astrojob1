import React from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';

interface AdvancePredictionTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
    types: ('Dasha' | 'Bhukti' | 'Antara')[];
    planetName: string;
    selectedArea: string;
}

const AdvancePredictionTable: React.FC<AdvancePredictionTableProps> = ({ data, planets, types, planetName, selectedArea }) => {
    const planetData = data.find(p => p.planet === planetName) || data[0];
    if (!planetData) return <div>No data available</div>;

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { placementMap[p.planet.toUpperCase()] = p.house_placed; });

    const plHit = placementMap[planetData.planet.toUpperCase()];
    const nlHit = placementMap[planetData.star_lord.toUpperCase()];
    const slHit = placementMap[planetData.sub_lord.toUpperCase()];

    const plHouses = planetData.pl_signified.map(h => h.house);
    const nlHouses = planetData.nl_signified.map(h => h.house);
    const slHouses = planetData.sl_signified.map(h => h.house);

    const getHouseColor = (h: number, area: string) => {
        if (area === 'Education') {
            if ([2, 4, 10, 11].includes(h)) return '#16a34a';
            if ([1, 5, 7].includes(h)) return '#0ea5e9';
            return '#ef4444';
        }
        if (area === 'Marriage') {
            if ([2, 7].includes(h)) return '#16a34a';
            if ([3, 4, 9, 11].includes(h)) return '#60a5fa';
            return '#ef4444';
        }
        if (area === 'Health') {
            if (h === 1) return '#16a34a'; // Simplification for neutral healthy
            if ([5, 9, 11].includes(h)) return '#16a34a';
            if ([2, 3, 7].includes(h)) return '#60a5fa';
            return '#ef4444';
        }
        if ([2, 5, 6, 7, 8, 9, 10, 11].includes(h)) return '#16a34a';
        if ([1, 3, 4].includes(h)) return '#0ea5e9';
        return '#1e293b';
    };

    const renderHouses = (sigs: number[], hit: number) => {
        // POSITION = ALWAYS ONLY THE HIT HOUSE
        const position = hit !== -1 ? [hit] : [];
        
        // SIGNIFICATRS = ALL SIGNIFIED HOUSES EXCEPT THE HIT HOUSE
        const significators = sigs.filter(h => h !== hit).sort((a, b) => a - b);

        const renderCell = (list: number[], isPosition: boolean) => {
            if (list.length === 0) return <span style={{ color: '#ccc', fontSize: '11px' }}>-</span>;
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1px' }}>
                    {list.map((h, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: isPosition ? '24px' : 'auto', height: isPosition ? '24px' : 'auto',
                            border: isPosition ? '1.5px solid #000000' : 'none',
                            borderRadius: '3px', margin: '0 2px', padding: isPosition ? '0' : '0 3px',
                            background: isPosition ? '#f8fafc' : 'transparent',
                            color: getHouseColor(h, selectedArea),
                            fontWeight: '800'
                        }}>
                            {h}
                        </span>
                    ))}
                </div>
            );
        };
        return { position, significators, renderCell };
    };

    const activeThemes = types.map(t => ({
        Dasha: { color: '#1d4ed8', text: '#ffffff', label: 'Dasha' },
        Bhukti: { color: '#15803d', text: '#ffffff', label: 'Bukthi' },
        Antara: { color: '#b45309', text: '#ffffff', label: 'Antar Bhukthi' }
    }[t]));

    const getHeaderStyle = () => {
        if (types.includes('Dasha')) return { background: '#1d4ed8', color: '#ffffff' };
        if (types.includes('Bhukti')) return { background: '#15803d', color: '#ffffff' };
        if (types.includes('Antara')) return { background: '#b45309', color: '#ffffff' };
        return { background: '#f8fafc', color: '#1e3a8a' };
    };
    const headerStyle = getHeaderStyle();

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            width: '100%',
            maxWidth: '100%',
            margin: '0 0 0.75rem',
            border: '3px solid #000000',
        }}>
            <div style={{ background: headerStyle.background, padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #000000' }}>
                <h3 style={{ margin: 0, color: headerStyle.color, fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}>
                    {planetData.planet.toUpperCase()}
                </h3>
                {activeThemes.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                        {activeThemes.map((t, idx) => (
                            <span key={idx} style={{ color: t?.text, fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase' }}>
                                {t?.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: '0px' }}>
                {[
                    { label: 'PL', p: planetData.planet, h: plHit, sigs: plHouses },
                    { label: 'NL', p: planetData.star_lord, h: nlHit, sigs: nlHouses },
                    { label: 'SL', p: planetData.sub_lord, h: slHit, sigs: slHouses }
                ].map((row) => {
                    const bifurcation = renderHouses(row.sigs, row.h);
                    return (
                        <div key={row.label} style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: '#1d4ed8' }}>{row.p.substring(0, 2).toUpperCase()}</span>
                                <span style={{ opacity: 0.8, fontSize: '0.65rem' }}>({row.label})</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', marginBottom: '4px', textTransform: 'uppercase' }}>POSITION</div>
                                    {bifurcation.renderCell(bifurcation.position, true)}
                                </div>
                                <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', marginBottom: '4px', textTransform: 'uppercase' }}>SIGNIFICATRS</div>
                                    {bifurcation.renderCell(bifurcation.significators, false)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdvancePredictionTable;
