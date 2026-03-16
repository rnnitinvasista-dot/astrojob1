import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';

interface PropertyPredictionTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
    types: ('Dasha' | 'Bhukti' | 'Antara')[];
    planetName: string;
}

// PURCHASE rules: 4-6-8-11-12
const PURCHASE_RULES: { houses: number[]; label: string }[] = [
    { houses: [4, 6, 8, 11, 12], label: 'VERY HIGH' },
    { houses: [4, 6, 11, 12],    label: 'VERY HIGH' },
    { houses: [4, 8, 11, 12],    label: 'HIGH' },
    { houses: [4, 11, 12],       label: 'HIGH' },
    { houses: [4, 6, 11],        label: 'HIGH' },
    { houses: [4, 8, 11],        label: 'MEDIUM' },
    { houses: [4, 11],           label: 'MEDIUM' },
    { houses: [4],               label: 'LOW' },
    { houses: [8, 11],           label: 'LOW' },
];

// SALE rules: 3-5-10-11
const SALE_RULES: { houses: number[]; label: string }[] = [
    { houses: [3, 5, 10, 11],    label: 'VERY HIGH' },
    { houses: [3, 5, 10, 11, 12],label: 'VERY HIGH' },
    { houses: [3, 5, 11],        label: 'HIGH' },
    { houses: [3, 5, 11, 12],    label: 'HIGH' },
    { houses: [3, 5, 10],        label: 'MEDIUM' },
    { houses: [3, 11],           label: 'MEDIUM' },
    { houses: [3, 11, 12],       label: 'MEDIUM' },
    { houses: [3, 12],           label: 'LOW' },
    { houses: [3, 5],            label: 'LOW' },
    { houses: [3, 10],           label: 'LOW' },
    { houses: [3],               label: 'LOW' },
];

// Problem time for sale
const PROBLEM_RULES: { houses: number[] }[] = [
    { houses: [3, 5, 6, 8, 12] },
    { houses: [3, 5, 8, 12] },
    { houses: [3, 5, 12] },
    { houses: [3, 5, 6, 8] },
    { houses: [3, 5, 6, 12] },
];

const LABEL_COLOR: Record<string, string> = {
    'VERY HIGH':    '#15803d',
    'HIGH':         '#0284c7',
    'MEDIUM':       '#b45309',
    'LOW':          '#64748b',
    'PROBLEM TIME': '#dc2626',
};

const PURCHASE_HOUSES = [4, 6, 8, 11, 12];
const SALE_HOUSES     = [3, 5, 10, 11];

function getIndication(allHouses: number[], rules: { houses: number[]; label: string }[]): string {
    for (const rule of rules) {
        if (rule.houses.every(h => allHouses.includes(h))) return rule.label;
    }
    return '';
}

function isProblemTime(allHouses: number[]): boolean {
    return PROBLEM_RULES.some(r => r.houses.every(h => allHouses.includes(h)));
}

const PropertyPredictionTable: React.FC<PropertyPredictionTableProps> = ({ data, planets, types, planetName }) => {
    const [activeTab, setActiveTab] = useState<'purchase' | 'sale'>('purchase');

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

    const isPurchase = activeTab === 'purchase';
    const targetHouses = isPurchase ? PURCHASE_HOUSES : SALE_HOUSES;
    const rules = isPurchase ? PURCHASE_RULES : SALE_RULES;

    const indication = getIndication(allHouses, rules);
    const problemTime = !isPurchase && isProblemTime(allHouses);

    const getHouseColor = (h: number) => {
        if (targetHouses.includes(h)) return isPurchase ? '#0284c7' : '#b45309';
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
                    <span style={{ color: 'var(--primary)' }}>{pName.substring(0, 2).toUpperCase()}</span>
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
        Dasha:  { label: 'Dasha', color: '#ffd8d1', text: '#000000' },
        Bhukti: { label: 'Bukthi', color: '#a2d5c6', text: '#000000' },
        Antara: { label: 'Antar Bhukthi', color: '#e9d5ff', text: '#000000' }
    }[t]));


    return (
        <div style={{ background: 'var(--secondary-light)', border: '3px solid #000', marginBottom: '0.75rem', overflow: 'hidden' }}>
            {/* Planet header */}
            <div style={{ 
                background: types.includes('Dasha') ? '#ffd8d1' : types.includes('Bhukti') ? '#a2d5c6' : types.includes('Antara') ? '#e9d5ff' : 'var(--primary)', 
                padding: '10px 8px', 
                textAlign: 'center', 
                borderBottom: '2px solid #000' 
            }}>
                <h3 style={{ margin: 0, color: '#000000', fontWeight: 900, fontSize: '1rem' }}>
                    {planetData.planet.toUpperCase()}
                </h3>
                {activeThemes.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                        {activeThemes.map((t, i) => (
                            <span key={i} style={{ color: t?.text || '#000000', fontSize: '0.65rem', fontWeight: 800, opacity: 0.85, textTransform: 'uppercase' }}>{t?.label}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
                {(['purchase', 'sale'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        flex: 1, padding: '8px', border: 'none', borderRight: tab === 'purchase' ? '1px solid #000' : 'none',
                        background: activeTab === tab ? '#1e3a8a' : '#f8fafc',
                        color: activeTab === tab ? '#fff' : '#1e3a8a',
                        fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase'
                    }}>
                        {tab === 'purchase' ? '🏠 Purchase' : '💰 Sale'}
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
                        {isPurchase ? '🏠 Purchase Indication' : '💰 Sale Indication'}
                    </span>
                    <span style={{
                        fontWeight: 900, fontSize: '0.85rem', padding: '4px 12px',
                        background: LABEL_COLOR[indication] || '#64748b', color: '#fff',
                        borderRadius: '0'
                    }}>{indication}</span>
                </div>
            )}

            {/* Problem time (sale only) */}
            {!isPurchase && problemTime && (
                <div style={{ padding: '8px 12px', background: '#fef2f2', borderTop: '1.5px solid #dc2626', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#dc2626' }}>⚠ PROBLEM TIME</div>
                        <div style={{ fontSize: '0.65rem', color: '#7f1d1d', marginTop: '2px' }}>
                            Litigation risk: houses 3·5·6·8·12 present — dispute/legal problem likely
                        </div>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '0.8rem', padding: '4px 10px', background: '#dc2626', color: '#fff' }}>⚠</span>
                </div>
            )}

            {/* Key houses note */}
            <div style={{ padding: '6px 12px', background: '#eff6ff', borderTop: '1px solid #dbeafe', fontSize: '0.65rem', color: '#1e40af', fontWeight: 600 }}>
                {isPurchase
                    ? '🔑 Purchase: 4·6·8·11·12 | Cash: 4·11·12 | Loan: 4·6·11·12 | Inheritance: 4·8·11'
                    : '🔑 Sale: 3·5·10·11 | Profit: 3·5·10·11 | Loss: 3·5·10·12 | Problem: 3·5·6·8·12'}
            </div>
        </div>
    );
};

export default PropertyPredictionTable;
