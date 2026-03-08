import React from 'react';
import type { House, Planet } from '../../types/astrology';

interface HouseTableProps {
    houses: House[];
    planets: Planet[];
}

const HouseTable: React.FC<HouseTableProps> = ({ houses, planets }) => {
    const getPlanetStatus = (planetName: string) => {
        if (!planetName) return null;
        // Normalize name for lookup (lords might be short names or full names)
        const p = planets.find(pl =>
            pl.planet === planetName ||
            pl.planet.startsWith(planetName) ||
            planetName.startsWith(pl.planet)
        );
        return p ? { is_retrograde: p.is_retrograde, is_combust: p.is_combust } : null;
    };

    const renderLord = (name: string, defaultColor: string) => {
        const status = getPlanetStatus(name);
        return (
            <span style={{ color: defaultColor }}>
                {name}
                {status?.is_retrograde && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginLeft: '2px' }}>(R)</span>}
                {status?.is_combust && <span style={{ color: '#8b5cf6', fontSize: '0.7rem', marginLeft: '2px' }}>(C)</span>}
            </span>
        );
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1rem', color: '#6EB5FF' }}>KP Houses (Cusps)</h2>
            <div className="table-container">
                <table style={{ fontSize: '0.8125rem' }}>
                    <thead>
                        <tr>
                            <th>Hos</th>
                            <th>Degree</th>
                            <th>SL</th>
                            <th>NL</th>
                            <th>SB</th>
                            <th>SS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houses.map((house) => (
                            <tr key={house.house_number}>
                                <td style={{ fontWeight: 600 }}>{house.house_number}</td>
                                <td>{house.degree_dms || house.cusp_degree_dms}</td>
                                <td>{renderLord(house.sign_lord, '#6366f1')}</td>
                                <td>{renderLord(house.star_lord, '#3b82f6')}</td>
                                <td>{renderLord(house.sub_lord, '#10b981')}</td>
                                <td>{renderLord(house.sub_sub_lord, '#ec4899')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span><b>SL:</b> Sign Lord</span>
                <span><b>NL:</b> Nakshatra Lord</span>
                <span><b>SB:</b> Sub Lord</span>
                <span><b>SS:</b> Sub-Sub Lord</span>
                <span style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                    <b style={{ color: '#ef4444' }}>(R):</b> Retrograde
                </span>
                <span>
                    <b style={{ color: '#8b5cf6' }}>(C):</b> Combust
                </span>
            </div>
        </div>
    );
};

export default HouseTable;
