import React from 'react';
import type { Planet, Ascendant } from '../../types/astrology';

interface PlanetTableProps {
    planets: Planet[];
    ascendant?: Ascendant;
}

const PlanetTable: React.FC<PlanetTableProps> = ({ planets, ascendant }) => {
    return (
        <div className="card" style={{
            width: '100%',
            maxWidth: '100%',
            padding: '1rem 0.5rem',
            borderTop: '5px solid #35a4f4'
        }}>
            <h2 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>KP Planets</h2>
            <div className="table-container" style={{ border: '1px solid #e2e8f0' }}>
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
                            <tr key={planet.planet}>
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
        </div>
    );
};

export default PlanetTable;
