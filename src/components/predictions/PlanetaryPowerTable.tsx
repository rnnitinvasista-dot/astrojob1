import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet, HouseDetail } from '../../types/astrology';

interface PlanetaryPowerTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
}

const JOB_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "L", 9: "M", 10: "H", 11: "H", 12: "B!" },
    2: { 1: "H", 2: "H", 3: "M", 4: "H", 5: "H", 6: "E", 7: "H", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    3: { 1: "L", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "L", 9: "M", 10: "H", 11: "H", 12: "B!" },
    4: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "M", 6: "H", 7: "H", 8: "M", 9: "M", 10: "H", 11: "H", 12: "B!" },
    5: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "B!", 9: "M", 10: "M", 11: "M", 12: "VB!" },
    6: { 1: "H", 2: "E", 3: "H", 4: "H", 5: "H", 6: "E", 7: "E", 8: "M", 9: "H", 10: "E", 11: "E", 12: "M" },
    7: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "E", 7: "H", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    8: { 1: "L", 2: "M", 3: "L", 4: "L", 5: "B!", 6: "M", 7: "M", 8: "B!", 9: "L", 10: "M", 11: "M", 12: "VB!" },
    9: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "M", 6: "H", 7: "H", 8: "L", 9: "H", 10: "H", 11: "H", 12: "B!" },
    10: { 1: "H", 2: "E", 3: "H", 4: "H", 5: "H", 6: "E", 7: "H", 8: "H", 9: "E", 10: "H", 11: "E", 12: "M" },
    11: { 1: "H", 2: "E", 3: "H", 4: "H", 5: "H", 6: "E", 7: "E", 8: "H", 9: "E", 10: "E", 11: "E", 12: "M" },
    12: { 1: "VB!", 2: "B!", 3: "VB!", 4: "VB!", 5: "VB!", 6: "B!", 7: "B!", 8: "VB!", 9: "B!", 10: "B!", 11: "B!", 12: "VB!" }
};

const EDU_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "M", 2: "M", 3: "L", 4: "H", 5: "M", 6: "M", 7: "M", 8: "L", 9: "M", 10: "M", 11: "H", 12: "VB!" },
    2: { 1: "M", 2: "M", 3: "M", 4: "H", 5: "M", 6: "M", 7: "M", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    3: { 1: "L", 2: "M", 3: "L", 4: "M", 5: "L", 6: "L", 7: "M", 8: "B!", 9: "M", 10: "M", 11: "M", 12: "VB!" },
    4: { 1: "H", 2: "H", 3: "M", 4: "H", 5: "M", 6: "M", 7: "M", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    5: { 1: "M", 2: "M", 3: "L", 4: "M", 5: "M", 6: "L", 7: "M", 8: "L", 9: "L", 10: "M", 11: "H", 12: "B!" },
    6: { 1: "M", 2: "M", 3: "L", 4: "M", 5: "L", 6: "L", 7: "M", 8: "B!", 9: "L", 10: "M", 11: "H", 12: "VB!" },
    7: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "M", 9: "M", 10: "H", 11: "H", 12: "B!" },
    8: { 1: "B!", 2: "M", 3: "B!", 4: "M", 5: "B!", 6: "B!", 7: "M", 8: "B!", 9: "L", 10: "M", 11: "M", 12: "VB!" },
    9: { 1: "M", 2: "H", 3: "M", 4: "H", 5: "L", 6: "L", 7: "M", 8: "L", 9: "M", 10: "H", 11: "E", 12: "M" },
    10: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "E", 12: "M" },
    11: { 1: "H", 2: "E", 3: "H", 4: "E", 5: "H", 6: "H", 7: "H", 8: "H", 9: "E", 10: "E", 11: "E", 12: "M" },
    12: { 1: "B!", 2: "M", 3: "VB!", 4: "M", 5: "B!", 6: "VB!", 7: "VB!", 8: "VB!", 9: "B!", 10: "M", 11: "M", 12: "VB!" }
};

const MARRIAGE_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "B", 2: "M", 3: "B", 4: "B", 5: "B", 6: "VB", 7: "L", 8: "B", 9: "L", 10: "VB", 11: "M", 12: "B" },
    2: { 1: "M", 2: "E", 3: "M", 4: "M", 5: "M", 6: "M", 7: "E", 8: "M", 9: "E", 10: "M", 11: "E", 12: "M" },
    3: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "L", 6: "B", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    4: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "L", 6: "B", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    5: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "L", 6: "B", 7: "M", 8: "B", 9: "M", 10: "B", 11: "M", 12: "B" },
    6: { 1: "VB", 2: "L", 3: "VB", 4: "VB", 5: "VB", 6: "VB", 7: "L", 8: "VB", 9: "L", 10: "VB", 11: "L", 12: "VB" },
    7: { 1: "M", 2: "E", 3: "M", 4: "M", 5: "M", 6: "M", 7: "E", 8: "M", 9: "E", 10: "M", 11: "E", 12: "M" },
    8: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "B", 6: "VB", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    9: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "M", 6: "M", 7: "H", 8: "M", 9: "M", 10: "L", 11: "H", 12: "M" },
    10: { 1: "VB", 2: "M", 3: "B", 4: "B", 5: "B", 6: "VB", 7: "M", 8: "B", 9: "L", 10: "B", 11: "M", 12: "B" },
    11: { 1: "H", 2: "E", 3: "M", 4: "M", 5: "H", 6: "M", 7: "E", 8: "M", 9: "H", 10: "M", 11: "E", 12: "M" },
    12: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "B", 6: "VB", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" }
};

const CHILD_BIRTH_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "B", 2: "M", 3: "B", 4: "VB", 5: "M", 6: "B", 7: "L", 8: "B", 9: "L", 10: "B", 11: "M", 12: "B" },
    2: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "E", 6: "M", 7: "M", 8: "M", 9: "H", 10: "M", 11: "H", 12: "M" },
    3: { 1: "B", 2: "M", 3: "L", 4: "B", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    4: { 1: "VB", 2: "VB", 3: "VB", 4: "VB", 5: "B", 6: "VB", 7: "VB", 8: "VB", 9: "VB", 10: "VB", 11: "B", 12: "VB" },
    5: { 1: "M", 2: "E", 3: "H", 4: "M", 5: "E", 6: "H", 7: "H", 8: "M", 9: "E", 10: "M", 11: "E", 12: "M" },
    6: { 1: "B", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    7: { 1: "L", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "L", 11: "M", 12: "L" },
    8: { 1: "B", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    9: { 1: "M", 2: "H", 3: "M", 4: "B", 5: "H", 6: "M", 7: "M", 8: "M", 9: "M", 10: "L", 11: "H", 12: "M" },
    10: { 1: "B", 2: "B", 3: "L", 4: "VB", 5: "M", 6: "B", 7: "L", 8: "B", 9: "L", 10: "B", 11: "M", 12: "L" },
    11: { 1: "M", 2: "E", 3: "M", 4: "M", 5: "E", 6: "M", 7: "M", 8: "M", 9: "H", 10: "M", 11: "H", 12: "M" },
    12: { 1: "B", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" }
};

const HEALTH_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "M", 2: "M", 3: "L", 4: "B", 5: "M", 6: "B", 7: "M", 8: "VB", 9: "M", 10: "B", 11: "M", 12: "B" },
    2: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "B", 7: "M", 8: "B", 9: "M", 10: "M", 11: "M", 12: "B" },
    3: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "L", 6: "L", 7: "M", 8: "B", 9: "M", 10: "M", 11: "M", 12: "B" },
    4: { 1: "B", 2: "B", 3: "B", 4: "VB", 5: "L", 6: "VB", 7: "B", 8: "VB", 9: "B", 10: "VB", 11: "M", 12: "VB" },
    5: { 1: "E", 2: "G", 3: "G", 4: "M", 5: "E", 6: "M", 7: "G", 8: "M", 9: "E", 10: "G", 11: "E", 12: "M" },
    6: { 1: "B", 2: "B", 3: "B", 4: "B", 5: "L", 6: "B", 7: "L", 8: "VB", 9: "L", 10: "VB", 11: "M", 12: "VB" },
    7: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "B", 7: "M", 8: "B", 9: "M", 10: "B", 11: "M", 12: "B" },
    8: { 1: "B", 2: "B", 3: "B", 4: "B", 5: "L", 6: "VB", 7: "B", 8: "VB", 9: "L", 10: "VB", 11: "M", 12: "VB" },
    9: { 1: "G", 2: "G", 3: "G", 4: "M", 5: "G", 6: "M", 7: "M", 8: "M", 9: "G", 10: "M", 11: "E", 12: "M" },
    10: { 1: "B", 2: "M", 3: "M", 4: "B", 5: "M", 6: "B", 7: "B", 8: "B", 9: "M", 10: "VB", 11: "M", 12: "VB" },
    11: { 1: "G", 2: "G", 3: "G", 4: "M", 5: "E", 6: "M", 7: "M", 8: "M", 9: "G", 10: "G", 11: "E", 12: "M" },
    12: { 1: "VB", 2: "B", 3: "B", 4: "VB", 5: "B", 6: "VB", 7: "B", 8: "VB", 9: "B", 10: "VB", 11: "B", 12: "VB" }
};

const getSuccessInfo = (code: string) => {
    switch (code) {
        case 'VB!': case 'VB': return { label: 'Bad', color: '#ef4444' }; // Red
        case 'B!': case 'B': return { label: 'Bad', color: '#ef4444' };   // Red
        case 'M': case 'L': return { label: 'Medium', color: '#3b82f6' };  // Blue
        case 'H': case 'G': case 'E': return { label: 'Good', color: '#22c55e' }; // Green
        default: return { label: 'Medium', color: '#3b82f6' };
    }
};

const PLANET_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

const getPlanetShort = (name: string) => {
    const map: Record<string, string> = {
        'Ketu': 'KE', 'Venus': 'VE', 'Sun': 'SU', 'Moon': 'MO', 'Mars': 'MA', 
        'Rahu': 'RA', 'Jupiter': 'JU', 'Saturn': 'SA', 'Mercury': 'ME'
    };
    return map[name] || name.substring(0, 2).toUpperCase();
};

const PlanetaryPowerTable: React.FC<PlanetaryPowerTableProps> = ({ data, planets }) => {
    const [selectedArea, setSelectedArea] = useState<string>('Job');

    const AREAS = ["Job", "Education", "Marriage", "Child Birth", "Health"];

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { placementMap[p.planet.toUpperCase()] = p.house_placed; });

    const matrixMap: Record<string, any> = {
        'Job': JOB_SUCCESS_MATRIX,
        'Education': EDU_SUCCESS_MATRIX,
        'Marriage': MARRIAGE_SUCCESS_MATRIX,
        'Child Birth': CHILD_BIRTH_SUCCESS_MATRIX,
        'Health': HEALTH_SUCCESS_MATRIX
    };

    const activeMatrix = matrixMap[selectedArea];

    const renderCellContent = (planetName: string, houses: HouseDetail[], isFirstCol: boolean = false) => {
        const short = getPlanetShort(planetName);
        const placement = placementMap[planetName.toUpperCase()] ?? '-';
        const houseString = `[${houses.map(h => h.house).join(', ')}]`;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '4px' }}>
                <div style={{ 
                    border: '1.5px solid #000', borderRadius: '4px', padding: '2px 6px', 
                    fontSize: '0.75rem', fontWeight: 900, background: '#fff' 
                }}>
                    {short}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ef4444' }}>{placement}</div>
                {!isFirstCol && <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155' }}>{houseString}</div>}
            </div>
        );
    };

    const renderPlanetRow = (item: NakshatraNadiItem) => {
        const nlHit = placementMap[item.star_lord.toUpperCase()];
        const nlData = data.find(p => p.planet === item.star_lord);
        const nlsSubLord = nlData?.sub_lord || item.sub_lord;
        const nlsHit = placementMap[nlsSubLord.toUpperCase()];

        const successCode = activeMatrix[nlsHit]?.[nlHit] || "M";
        const success = getSuccessInfo(successCode);

        const rowBg = `${success.color}10`; // Very light transparent

        return (
            <tr key={item.planet} style={{ background: rowBg, borderBottom: '1.5px solid #000' }}>
                <td style={{ border: '1.5px solid #000', padding: '8px' }}>
                    {renderCellContent(item.planet, item.pl_signified, true)}
                </td>
                <td style={{ border: '1.5px solid #000', padding: '8px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, textAlign: 'center', marginBottom: '2px', opacity: 0.5 }}>PL</div>
                    {renderCellContent(item.planet, item.pl_signified)}
                </td>
                <td style={{ border: '1.5px solid #000', padding: '8px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, textAlign: 'center', marginBottom: '2px', opacity: 0.5 }}>NL</div>
                    {renderCellContent(item.star_lord, item.nl_signified)}
                </td>
                <td style={{ border: '1.5px solid #000', padding: '8px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, textAlign: 'center', marginBottom: '2px', opacity: 0.5 }}>SL</div>
                    {renderCellContent(nlsSubLord, item.sl_signified)}
                </td>
            </tr>
        );
    };

    return (
        <div style={{ background: 'var(--secondary-light)', border: '3px solid #000', borderRadius: '0', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'none' }}>
            {/* Header */}
            <div style={{ background: '#1e293b', padding: '12px 16px', borderBottom: '3px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ margin: 0, color: '#fff', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>PLANETARY POWER POSITION</h2>
                <select 
                    value={selectedArea} 
                    onChange={(e) => setSelectedArea(e.target.value)}
                    style={{ background: '#fff', border: '2px solid #000', borderRadius: '4px', fontWeight: 900, fontSize: '0.85rem', padding: '6px 12px', width: 'auto', minWidth: '140px' }}
                >
                    {AREAS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                </select>
            </div>

            {/* Subheader */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#d4af37' }}>
                            <th style={{ padding: '10px', border: '1.5px solid #000', fontWeight: 900, fontSize: '0.75rem', width: '60px' }}>STRENGTH</th>
                            <th style={{ padding: '10px', border: '1.5px solid #000', fontWeight: 900, fontSize: '0.75rem' }}>PL</th>
                            <th style={{ padding: '10px', border: '1.5px solid #000', fontWeight: 900, fontSize: '0.75rem' }}>NL</th>
                            <th style={{ padding: '10px', border: '1.5px solid #000', fontWeight: 900, fontSize: '0.75rem' }}>SL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PLANET_ORDER.map(pName => {
                            const item = data.find(it => it.planet === pName);
                            return item ? renderPlanetRow(item) : null;
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div style={{ padding: '12px', background: '#fff', display: 'flex', justifyContent: 'center', gap: '20px', borderTop: '3px solid #000' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#22c55e', border: '1.5px solid #000' }}></div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>GOOD</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#3b82f6', border: '1.5px solid #000' }}></div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>MEDIUM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ef4444', border: '1.5px solid #000' }}></div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>BAD</span>
                </div>
            </div>
        </div>
    );
};

export default PlanetaryPowerTable;
