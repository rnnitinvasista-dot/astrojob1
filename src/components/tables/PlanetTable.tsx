import React from 'react';
import type { Planet } from '../../types/astrology';

interface PlanetTableProps {
    planets: Planet[];
}

const PlanetTable: React.FC<PlanetTableProps> = ({ planets }) => {
    return (
        <div className="card" style={{
            width: '100%',
            maxWidth: '100%',
            padding: '1rem 0.5rem',
            borderTop: '5px solid #35a4f4'
        }}>
            <h2 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>KP Planets</h2>
            <div className="table-container">
                <table style={{ fontSize: '0.8125rem' }}>
                    <thead>
                        <tr>
                            <th>Pla</th>
                            <th>Degree</th>
                            <th>SL</th>
                            <th>NL</th>
                            <th>SB</th>
                            <th>SS</th>
                            <th>H</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planets.map((planet) => (
                            <tr key={planet.planet}>
                                <td style={{ fontWeight: '600' }}>
                                    {planet.planet}
                                    {planet.is_retrograde && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginLeft: '2px' }}>(R)</span>}
                                    {planet.is_combust && <span style={{ color: '#8b5cf6', fontSize: '0.7rem', marginLeft: '2px' }}>(C)</span>}
                                </td>
                                <td>{planet.degree_dms}</td>
                                <td style={{ color: '#6366f1' }}>{planet.sign_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#3b82f6' }}>{planet.star_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#10b981' }}>{planet.sub_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ color: '#ec4899' }}>{planet.sub_sub_lord?.substring(0, 2) || '--'}</td>
                                <td style={{ fontWeight: 600 }}>{planet.house_placed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span><b>SL:</b> Sign Lord</span>
                <span><b>NL:</b> Star Lord</span>
                <span><b>SB:</b> Sub Lord</span>
                <span><b>SS:</b> Sub-Sub Lord</span>
            </div>
        </div>
    );
};

export default PlanetTable;
