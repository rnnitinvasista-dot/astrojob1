import React from 'react';
import type { Aspect } from '../../types/astrology';

interface AspectsTableProps {
    aspects: Aspect[];
}

const AspectsTable: React.FC<AspectsTableProps> = ({ aspects }) => {
    return (
        <div className="card">
            <h2 style={{ marginBottom: '1rem', color: '#6EB5FF' }}>Planetary Aspects</h2>
            <div className="table-container">
                <table style={{ fontSize: '0.8125rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={{ textAlign: 'left' }}>Planet</th>
                            <th style={{ textAlign: 'left' }}>Aspect</th>
                            <th style={{ textAlign: 'left' }}>Target Planet</th>
                            <th style={{ textAlign: 'right' }}>Distance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aspects.map((asp, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: '600', color: '#1e293b' }}>{asp.planet}</td>
                                <td style={{ color: '#3b82f6' }}>{asp.aspect}</td>
                                <td style={{ fontWeight: '600' }}>{asp.target}</td>
                                <td style={{ textAlign: 'right', color: '#64748b' }}>{asp.degree_diff.toFixed(2)}°</td>
                            </tr>
                        ))}
                        {aspects.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    No major aspects formed within 6° orb
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#64748b' }}>
                Orb: 6° (Standard for professional KP analysis)
            </div>
        </div>
    );
};

export default AspectsTable;
