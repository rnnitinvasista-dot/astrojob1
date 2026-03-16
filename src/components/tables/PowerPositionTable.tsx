import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';
import { getCurrentDashaLords } from '../../services/api';

interface PowerPositionTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
    dasha: any; // Add dasha prop
}

const PowerPositionTable: React.FC<PowerPositionTableProps> = ({ data, planets, dasha }) => {
    const [selectedArea, setSelectedArea] = useState('Job');
    
    // Robust dasha detection
    const trueLords = getCurrentDashaLords(dasha.mahadasha_sequence);
    const activeDasha = trueLords.dasha || dasha.current_dasha;
    const activeBukthi = trueLords.bukthi || dasha.current_bukthi;
    const activeAntara = trueLords.antara || dasha.current_antara;

    // ... existing logic (calculatePower, getHouseColor, placementMap)
    
    // Power calculation: count occurrences of a planet as star_lord or sub_lord across all entries
    const calculatePower = (planetName: string) => {
        let count = 0;
        data.forEach(item => {
            if (item.star_lord === planetName) count++;
            if (item.sub_lord === planetName) count++;
        });
        return count;
    };

    const getHouseColor = (h: number, area: string) => {
        if (area === 'Education') {
            if ([2, 4, 10, 11].includes(h)) return '#16a34a'; // Good
            if ([1, 5, 7, 9].includes(h)) return '#2563eb'; // Medium (Blue)
            return '#ef4444'; // Bad (Red)
        }
        if (area === 'Marriage') {
            if ([2, 7, 11].includes(h)) return '#16a34a';
            if ([3, 9].includes(h)) return '#2563eb';
            return '#ef4444';
        }
        if (area === 'Child Birth') {
            if ([2, 5, 11].includes(h)) return '#16a34a';
            if ([9].includes(h)) return '#2563eb';
            return '#ef4444';
        }
        if (area === 'Health') {
            if ([1, 5, 9, 11].includes(h)) return '#16a34a';
            if ([2, 3, 7].includes(h)) return '#2563eb';
            return '#ef4444';
        }
        // Default area: Job/Business
        if ([2, 6, 10, 11].includes(h)) return '#16a34a';
        if ([1, 3, 7, 9].includes(h)) return '#2563eb';
        return '#ef4444';
    };

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { 
        placementMap[p.planet.toUpperCase()] = p.house_placed; 
    });

    const isPlanetRetrograde = (planetName: string) => {
        const p = planets.find(pl => pl.planet.toUpperCase() === planetName.toUpperCase());
        return p?.is_retrograde || false;
    };

    const renderCell = (planetName: string, hit: number, significators: number[]) => {
        const isRetro = isPlanetRetrograde(planetName);
        const filteredSigs = significators.filter(s => s !== hit);
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ 
                    display: 'inline-block',
                    padding: '1px',
                    border: isRetro ? '2px solid #ef4444' : 'none',
                    borderRadius: '4px'
                }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#334155' }}>
                        {planetName.substring(0, 2).toUpperCase()}
                    </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: getHouseColor(hit, selectedArea), lineHeight: 1 }}>
                    {hit}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1px' }}>
                    <span style={{ color: '#000' }}>[</span>
                    {filteredSigs.map((s, idx) => (
                        <span key={idx} style={{ color: getHouseColor(s, selectedArea) }}>
                            {s}{idx < filteredSigs.length - 1 ? ',' : ''}
                        </span>
                    ))}
                    <span style={{ color: '#000' }}>]</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '8px', backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
            {/* Legend with Dasha Info */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 800, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#16a34a' }}></div>
                    <span>Good</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--primary)' }}></div>
                    <span>Medium</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#000000' }}></div>
                    <span>Bad</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#ffd8d1' }}></div>
                    <span style={{ color: '#000000' }}>(D) Dasha</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#a2d5c6' }}></div>
                    <span style={{ color: '#000000' }}>(B) Bukthi</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#e9d5ff' }}></div>
                    <span style={{ color: '#000000' }}>(A) Antar</span>
                  </div>
                </div>
            </div>

            {/* Selector */}
            <div style={{ marginBottom: '8px' }}>
                <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: 'none',
                        borderBottom: '1.5px solid #ccc',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        outline: 'none'
                    }}
                >
                    <option>Job</option>
                    <option>Business</option>
                    <option>Education</option>
                    <option>Marriage</option>
                    <option>Child Birth</option>
                    <option>Health</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #000' }}>
                            <th style={{ padding: '4px', color: '#000000', fontSize: '0.8rem', borderRight: '1.5px solid #ccc' }}>STRENGTH</th>
                            <th style={{ padding: '4px', color: '#000000', fontSize: '0.8rem', borderRight: '1.5px solid #ccc' }}>PL</th>
                            <th style={{ padding: '4px', color: '#000000', fontSize: '0.8rem', borderRight: '1.5px solid #ccc' }}>NL</th>
                            <th style={{ padding: '4px', color: '#000000', fontSize: '0.8rem' }}>SL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => {
                            const planetPower = calculatePower(item.planet);
                            const plHit = placementMap[item.planet.toUpperCase()];
                            const nlHit = placementMap[item.star_lord.toUpperCase()];
                            const slHit = placementMap[item.sub_lord.toUpperCase()];

                            const plSigs = item.pl_signified.map(h => h.house);
                            const nlSigs = item.nl_signified.map(h => h.house);
                            const slSigs = item.sl_signified.map(h => h.house);

                            const plHitColor = getHouseColor(plHit, selectedArea);
                            
                            const isDasha = item.planet === activeDasha;
                            const isBukthi = item.planet === activeBukthi;
                            const isAntara = item.planet === activeAntara;

                            const activeRoles = [];
                            if (isDasha) activeRoles.push('#ffd8d1');
                            if (isBukthi) activeRoles.push('#a2d5c6');
                            if (isAntara) activeRoles.push('#e9d5ff');

                            let rowBg = 'transparent';
                            if (activeRoles.length === 1) {
                                rowBg = activeRoles[0];
                            } else if (activeRoles.length > 1) {
                                const step = 100 / activeRoles.length;
                                const stops = activeRoles.map((color, i) => `${color} ${i * step}%, ${color} ${(i + 1) * step}%`);
                                rowBg = `linear-gradient(to right, ${stops.join(', ')})`;
                            } else {
                                rowBg = 'var(--secondary-light)';
                            }

                            const plRetro = isPlanetRetrograde(item.planet);

                                return (
                                    <tr key={idx} style={{ 
                                        borderBottom: '1.5px solid #ccc',
                                        backgroundColor: rowBg.includes('gradient') ? 'transparent' : rowBg,
                                        backgroundImage: rowBg.includes('gradient') ? rowBg : 'none'
                                    }}>
                                        <td style={{ padding: '4px', fontWeight: 800, borderRight: '1.5px solid #ccc' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                                <div style={{ 
                                                    padding: '1px', 
                                                    border: plRetro ? '2px solid #ef4444' : 'none',
                                                    borderRadius: '4px'
                                                }}>
                                                    <span style={{ fontSize: '0.9rem', color: plHitColor }}>{item.planet.substring(0, 2).toUpperCase()}</span>
                                                </div>
                                                <span style={{ fontSize: '0.9rem', color: plHitColor, lineHeight: 1 }}>{planetPower}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '4px', borderRight: '1.5px solid #ccc' }}>
                                            {renderCell(item.planet, plHit, plSigs)}
                                        </td>
                                        <td style={{ padding: '4px', borderRight: '1.5px solid #ccc' }}>
                                            {renderCell(item.star_lord, nlHit, nlSigs)}
                                        </td>
                                        <td style={{ padding: '4px' }}>
                                            {renderCell(item.sub_lord, slHit, slSigs)}
                                        </td>
                                    </tr>
                                );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PowerPositionTable;
