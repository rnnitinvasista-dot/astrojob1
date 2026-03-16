import React from 'react';
import type { Signification } from '../../types/astrology';

interface SignificationTableProps {
    significations: Signification[];
}

const SignificationTable: React.FC<SignificationTableProps> = ({ significations }) => {
    return (
        <div className="card" style={{ borderTop: '4px solid var(--primary)', background: 'var(--secondary-light)', border: '3px solid #000000', borderRadius: '0' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.25rem', fontWeight: 800, textAlign: 'center' }}>
                Planet Significators (Grades A-D)
            </h2>
            <div className="table-container" style={{ border: '2px solid #000000' }}>
                <table style={{ fontSize: '0.85rem', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ background: 'var(--primary)', color: '#000000' }}>
                            <th style={{ textAlign: 'left', padding: '12px', border: '1px solid #000000' }}>Planet</th>
                            <th style={{ textAlign: 'center', padding: '8px', border: '1px solid #000000' }}>Signified Houses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {significations.map((sig: any) => {
                            const extractHouses = (data: any) => {
                                if (!data) return [];
                                if (Array.isArray(data)) {
                                    return data.map((item: any) => {
                                        if (typeof item === 'object' && item !== null) {
                                            return item.house !== undefined ? item.house : item;
                                        }
                                        return item;
                                    }).filter(h => h !== undefined);
                                }
                                return [];
                            };

                            const l1 = sig.levels?.L1 || extractHouses(sig.level1);
                            const l2 = sig.levels?.L2 || extractHouses(sig.level2);
                            const l3 = sig.levels?.L3 || extractHouses(sig.level3);
                            const l4 = sig.levels?.L4 || [];

                            // Combine all levels for a unified view
                            const allHouses = Array.from(new Set([...l1, ...l2, ...l3, ...l4])).sort((a, b) => a - b);

                            return (
                                <tr key={sig.planet}>
                                    <td style={{ fontWeight: '800', color: 'var(--primary)', padding: '12px', border: '1px solid #000000' }}>
                                        {sig.planet}
                                        {sig.agent && (
                                            <div style={{ fontSize: '0.65rem', color: '#000', fontWeight: 600 }}>
                                                Rep: {sig.agent}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text)', border: '1px solid #000000' }}>
                                        {allHouses.length > 0 ? allHouses.join(', ') : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Note:</strong></p>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    <li>Nodes (Ra/Ke) signify their own results + results of their agents (Sign Lord, Conjunctions & Aspects).</li>
                    <li>Unified houses represent the complete potential of the planet across all levels.</li>
                </ul>
            </div>
        </div>
    );
};

export default SignificationTable;
