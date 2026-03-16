import React from 'react';
import type { NakshatraNadiItem, HouseDetail } from '../../types/astrology';

interface NakshatraNadiTableProps {
    data: NakshatraNadiItem[];
}

const HouseList: React.FC<{ houses: HouseDetail[], color: string }> = ({ houses, color }) => {
    if (!houses || houses.length === 0) return <span style={{ color: '#94a3b8' }}>-</span>;
    return (
        <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {houses.map((h, i) => (
                <span key={i} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '24px',
                    border: h.is_placed ? `2px solid ${color}` : 'none',
                    background: h.is_placed ? `${color}15` : 'transparent',
                    borderRadius: '50%',
                    padding: h.is_placed ? '0' : '0 1px',
                    fontWeight: 800,
                    color: h.is_placed ? color : 'inherit',
                    transition: 'all 0.2s',
                    fontSize: h.is_placed ? '0.75rem' : 'inherit'
                }}>
                    {h.house}{i < houses.length - 1 && !h.is_placed && ','}
                </span>
            ))}
        </span>
    );
};

const NakshatraNadiTable: React.FC<NakshatraNadiTableProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="card" style={{
            marginTop: '1rem',
            width: '100%',
            maxWidth: '100%',
            padding: '1rem 0.5rem',
            borderTop: '5px solid #d4af37',
            background: 'var(--secondary-light)',
            border: '3px solid #000000'
        }}>
            <h2 style={{ textAlign: 'center', color: 'var(--text)', marginBottom: '1.5rem', fontWeight: 800 }}>
                Gold Nadi Combination
            </h2>
            <div className="table-container" style={{ border: 'none' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                            <th style={{ width: '100px', border: '1px solid #e2e8f0', padding: '8px' }}>Planet</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>PL.</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>NL.</th>
                            <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>SL.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 800, color: 'var(--primary)', border: '1px solid #e2e8f0', padding: '8px' }}>
                                    {item.planet} {item.is_retrograde && '(R)'} {item.is_combust && <span style={{ color: '#8b5cf6' }}>(C)</span>}
                                </td>
                                <td style={{ border: '1px solid #e2e8f0', padding: '8px' }}>
                                    <span style={{ fontWeight: 800, marginRight: '8px', fontSize: '0.7rem' }}>{item.planet?.substring(0, 2).toUpperCase()}:</span>
                                    <HouseList houses={item.pl_signified} color="#1e293b" />
                                </td>
                                <td style={{ border: '1px solid #e2e8f0', padding: '8px' }}>
                                    <span style={{ fontWeight: 800, marginRight: '8px', fontSize: '0.7rem' }}>{item.star_lord?.substring(0, 2).toUpperCase()}:</span>
                                    <HouseList houses={item.nl_signified} color="#1e293b" />
                                </td>
                                <td style={{ border: '1px solid #e2e8f0', padding: '8px' }}>
                                    <span style={{ fontWeight: 800, marginRight: '8px', fontSize: '0.7rem' }}>{item.sub_lord?.substring(0, 2).toUpperCase()}:</span>
                                    <HouseList houses={item.sl_signified} color="#1e293b" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
                * Circled numbers indicate the house where the planet is actually placed.
            </div>
        </div>
    );
};

export default NakshatraNadiTable;
