import React from 'react';
import type { Planet, Ascendant } from '../../types/astrology';
import { getCurrentDashaLords } from '../../services/api';

interface PlanetTableProps {
    planets: Planet[];
    ascendant?: Ascendant;
    dasha: any;
}

const PlanetTable: React.FC<PlanetTableProps> = ({ planets, ascendant, dasha }) => {
    // Robust dasha detection
    const trueLords = getCurrentDashaLords(dasha.mahadasha_sequence);
    const activeDasha = trueLords.dasha || dasha.current_dasha;
    const activeBukthi = trueLords.bukthi || dasha.current_bukthi;
    const activeAntara = trueLords.antara || dasha.current_antara;

    const getRowStyle = (planetName: string) => {
        const isDasha = planetName === activeDasha;
        const isBukthi = planetName === activeBukthi;
        const isAntara = planetName === activeAntara;

        const activeRoles = [];
        if (isDasha) activeRoles.push('#ffd8d1'); 
        if (isBukthi) activeRoles.push('#a2d5c6'); 
        if (isAntara) activeRoles.push('#e9d5ff'); 

        if (activeRoles.length === 0) return {};
        
        if (activeRoles.length === 1) {
            return { backgroundColor: activeRoles[0] };
        }
        
        const step = 100 / activeRoles.length;
        const stops = activeRoles.map((color, i) => `${color} ${i * step}%, ${color} ${(i + 1) * step}%`);
        return { backgroundImage: `linear-gradient(to right, ${stops.join(', ')})` };
    };

    return (
        <div className="card" style={{
            width: '100%',
            maxWidth: '100%',
            padding: '1rem 0.5rem',
            borderTop: '5px solid #d4af37',
            background: 'var(--secondary-light)',
            border: '3px solid #000000'
        }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text)' }}>KP Planets</h2>
            <div className="table-container" style={{ border: 'none' }}>
                <table style={{ fontSize: '0.8125rem', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>Pla</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>Degree</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>SL</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>NL</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>SB</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>SS</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>H</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Ascendant row */}
                        {ascendant && (
                            <tr style={{ background: '#fff7ed' }}>
                                <td style={{ fontWeight: '700', border: '1px solid #e2e8f0', padding: '8px', color: '#ea580c' }}>
                                    Lagna
                                </td>
                                <td style={{ border: '1px solid #e2e8f0', padding: '8px' }}>{ascendant.degree_dms}</td>
                                <td style={{ color: '#6366f1', border: '1px solid #e2e8f0', padding: '8px' }}>{ascendant.sign_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#3b82f6', border: '1px solid #e2e8f0', padding: '8px' }}>{ascendant.star_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#10b981', border: '1px solid #e2e8f0', padding: '8px' }}>{ascendant.sub_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#ec4899', border: '1px solid #e2e8f0', padding: '8px' }}>{ascendant.sub_sub_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ fontWeight: 600, border: '1px solid #e2e8f0', padding: '8px' }}>1</td>
                            </tr>
                        )}
                        {planets.map((planet) => (
                            <tr key={planet.planet} style={getRowStyle(planet.planet)}>
                                <td style={{ fontWeight: '600', border: '1px solid #e2e8f0', padding: '8px' }}>
                                    {planet.planet}
                                    {planet.is_retrograde && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginLeft: '2px' }}>(R)</span>}
                                    {planet.is_combust && <span style={{ color: '#8b5cf6', fontSize: '0.7rem', marginLeft: '2px' }}>(C)</span>}
                                </td>
                                <td style={{ border: '1px solid #e2e8f0', padding: '8px' }}>{planet.degree_dms}</td>
                                <td style={{ color: '#6366f1', border: '1px solid #e2e8f0', padding: '8px' }}>{planet.sign_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#3b82f6', border: '1px solid #e2e8f0', padding: '8px' }}>{planet.star_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#10b981', border: '1px solid #e2e8f0', padding: '8px' }}>{planet.sub_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#ec4899', border: '1px solid #e2e8f0', padding: '8px' }}>{planet.sub_sub_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ fontWeight: 600, border: '1px solid #e2e8f0', padding: '8px' }}>{planet.house_placed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span><b>SL:</b> Sign Lord</span>
                <span><b>NL:</b> Nakshatra Lord</span>
                <span><b>SB:</b> Sub Lord</span>
                <span><b>SS:</b> Sub-Sub Lord</span>
            </div>
            {/* Added Legend for Highlighting */}
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '12px', fontSize: '0.65rem', fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                   <div style={{ width: '10px', height: '10px', backgroundColor: '#ffd8d1' }}></div>
                   <span>Dasha</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                   <div style={{ width: '10px', height: '10px', backgroundColor: '#a2d5c6' }}></div>
                   <span>Bhukti</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                   <div style={{ width: '10px', height: '10px', backgroundColor: '#e9d5ff' }}></div>
                   <span>Antara</span>
                </div>
            </div>
        </div>
    );
};

export default PlanetTable;
