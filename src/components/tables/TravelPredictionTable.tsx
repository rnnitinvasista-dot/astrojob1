import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';

interface TravelPredictionTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
    types: ('Dasha' | 'Bhukti' | 'Antara')[];
    planetName: string;
}

// ABROAD / AWAY FROM HOME: Houses 1-3-7-9-11-12
// HOME INDICATION: Houses 2-4-11

// Indication rules (abroad)
const ABROAD_RULES: { houses: number[]; label: string }[] = [
    { houses: [1, 3, 7, 9, 11, 12], label: 'VERY HIGH' },
    { houses: [3, 7, 9, 12],        label: 'VERY HIGH' },
    { houses: [3, 9, 12],           label: 'VERY HIGH' },
    { houses: [9, 12],              label: 'HIGH' },
    { houses: [3, 12],              label: 'HIGH' },
    { houses: [12],                 label: 'HIGH' },
    { houses: [9],                  label: 'MEDIUM' },
    { houses: [3],                  label: 'MEDIUM' },
];

// Home indication rules
const HOME_RULES: { houses: number[]; label: string }[] = [
    { houses: [2, 4, 11], label: 'VERY HIGH' },
    { houses: [2, 11],    label: 'HIGH' },
    { houses: [4, 11],    label: 'MEDIUM' },
    { houses: [2, 4],     label: 'LOW' },
    { houses: [2],        label: 'LOW' },
    { houses: [4],        label: 'LOW' },
];

const LABEL_COLOR: Record<string, string> = {
    'VERY HIGH': '#15803d',
    'HIGH':      '#0284c7',
    'MEDIUM':    '#b45309',
    'LOW':       '#64748b',
};

const ABROAD_HOUSES = [1, 3, 7, 9, 11, 12];
const HOME_HOUSES   = [2, 4, 11];

function getIndication(allHouses: number[], rules: typeof ABROAD_RULES): string {
    for (const rule of rules) {
        if (rule.houses.every(h => allHouses.includes(h))) return rule.label;
    }
    return '';
}

const TravelPredictionTable: React.FC<TravelPredictionTableProps> = ({ data, planets, types, planetName }) => {
    const [activeTab, setActiveTab] = useState<'abroad' | 'home'>('abroad');

    const planetData = data.find(p => p.planet === planetName);
    if (!planetData) return null;

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { placementMap[p.planet.toUpperCase()] = p.house_placed; });

    const plHit = placementMap[planetData.planet.toUpperCase()] ?? -1;
    const nlHit = placementMap[planetData.star_lord?.toUpperCase()] ?? -1;
    const slHit = placementMap[planetData.sub_lord?.toUpperCase()] ?? -1;

    const plHouses = planetData.pl_signified.map(h => h.house);
    const nlHouses = planetData.nl_signified.map(h => h.house);
    const slHouses = planetData.sl_signified.map(h => h.house);

    const allHouses = [...new Set([...plHouses, ...nlHouses, ...slHouses])];

    const isAbroad = activeTab === 'abroad';
    const targetHouses = isAbroad ? ABROAD_HOUSES : HOME_HOUSES;
    const rules = isAbroad ? ABROAD_RULES : HOME_RULES;
    const indication = getIndication(allHouses, rules);

    const getHouseColor = (h: number) => {
        if (targetHouses.includes(h)) return isAbroad ? '#15803d' : '#0284c7';
        return '#94a3b8';
    };

    const renderHouseRow = (label: string, pName: string, hit: number, sigs: number[]) => {
        const position = hit !== -1 ? [hit] : [];
        const significators = sigs.filter(h => h !== hit).sort((a, b) => a - b);
        const renderCell = (list: number[], isPos: boolean) => {
            if (list.length === 0) return <span style={{ color: '#ccc', fontSize: '11px' }}>-</span>;
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
                    {list.map((h, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: isPos ? '24px' : 'auto', height: isPos ? '24px' : 'auto',
                            border: isPos ? '1.5px solid #000' : 'none',
                            borderRadius: '3px', padding: isPos ? '0' : '0 3px',
                            background: isPos ? '#f8fafc' : 'transparent',
                            color: getHouseColor(h),
                            fontWeight: '800', fontSize: '0.85rem'
                        }}>
                            {h}
                        </span>
                    ))}
                </div>
            );
        };
        return (
            <div key={label} style={{ borderBottom: '1.5px solid #000', padding: '8px 12px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#1d4ed8' }}>{pName.substring(0, 2).toUpperCase()}</span>
                    <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>({label})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: '#f0fdf4', padding: '6px', border: '1px solid #dcfce7' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', marginBottom: '4px' }}>POSITION</div>
                        {renderCell(position, true)}
                    </div>
                    <div style={{ background: '#fef2f2', padding: '6px', border: '1px solid #fee2e2' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', marginBottom: '4px' }}>SIGNIFICATORS</div>
                        {renderCell(significators, false)}
                    </div>
                </div>
            </div>
        );
    };

    const activeThemes = types.map(t => ({
        Dasha:  { color: '#1d4ed8', label: 'Dasha' },
        Bhukti: { color: '#15803d', label: 'Bukthi' },
        Antara: { color: '#b45309', label: 'Antar Bhukthi' }
    }[t]));

    const headerBg = types.includes('Dasha') ? '#1d4ed8' : types.includes('Bhukti') ? '#15803d' : types.includes('Antara') ? '#b45309' : '#1e3a8a';

    return (
        <div style={{ background: '#fff', border: '3px solid #000', marginBottom: '0.75rem', overflow: 'hidden' }}>
            {/* Planet header */}
            <div style={{ background: headerBg, padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #000' }}>
                <h3 style={{ margin: 0, color: '#fff', fontWeight: 900, fontSize: '1rem' }}>
                    {planetData.planet.toUpperCase()}
                </h3>
                {activeThemes.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                        {activeThemes.map((t, i) => (
                            <span key={i} style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800, opacity: 0.85, textTransform: 'uppercase' }}>{t?.label}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
                {(['abroad', 'home'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        flex: 1, padding: '8px', border: 'none', borderRight: tab === 'abroad' ? '1px solid #000' : 'none',
                        background: activeTab === tab ? '#1e3a8a' : '#f8fafc',
                        color: activeTab === tab ? '#fff' : '#1e3a8a',
                        fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase'
                    }}>
                        {tab === 'abroad' ? '✈ Abroad / Away' : '🏠 Home'}
                    </button>
                ))}
            </div>

            {/* Rows */}
            {renderHouseRow('PL', planetData.planet, plHit, plHouses)}
            {renderHouseRow('NL', planetData.star_lord, nlHit, nlHouses)}
            {renderHouseRow('SL', planetData.sub_lord, slHit, slHouses)}

            {/* Indication */}
            {indication && (
                <div style={{ padding: '10px 12px', background: '#f8fafc', borderTop: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1e3a8a', textTransform: 'uppercase' }}>
                        {isAbroad ? '✈ Abroad/Away Indication' : '🏠 Home Indication'}
                    </span>
                    <span style={{
                        fontWeight: 900, fontSize: '0.85rem', padding: '4px 12px',
                        background: LABEL_COLOR[indication] || '#64748b', color: '#fff',
                        borderRadius: '0'
                    }}>{indication}</span>
                </div>
            )}

            {/* Key houses note */}
            <div style={{ padding: '6px 12px', background: '#eff6ff', borderTop: '1px solid #dbeafe', fontSize: '0.65rem', color: '#1e40af', fontWeight: 600 }}>
                {isAbroad
                    ? '🔑 Abroad/Away: 1·3·7·9·11·12 | Note: Saturn/Rahu/Ketu/Sun alone also promotes travel'
                    : '🔑 Home Return: 2·4·11 | Absconding: 3·8·12'}
            </div>
        </div>
    );
};

export default TravelPredictionTable;
