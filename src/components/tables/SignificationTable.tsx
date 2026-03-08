import React from 'react';
import type { Signification } from '../../types/astrology';

interface SignificationTableProps {
    significations: Signification[];
}

const SignificationTable: React.FC<SignificationTableProps> = ({ significations }) => {
    return (
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 800, textAlign: 'center' }}>
                Planet Significators (Grades A-D)
            </h2>
            <div className="table-container" style={{ border: '1px solid #e2e8f0' }}>
                <table style={{ fontSize: '0.85rem', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                            <th style={{ textAlign: 'left', padding: '12px', border: '1px solid #e2e8f0' }}>Planet</th>
                            <th style={{ textAlign: 'center', padding: '8px', border: '1px solid #e2e8f0' }}>Grade A</th>
                            <th style={{ textAlign: 'center', padding: '8px', border: '1px solid #e2e8f0' }}>Grade B</th>
                            <th style={{ textAlign: 'center', padding: '8px', border: '1px solid #e2e8f0' }}>Grade C</th>
                            <th style={{ textAlign: 'center', padding: '8px', border: '1px solid #e2e8f0' }}>Grade D</th>
                        </tr>
                    </thead>
                    <tbody>
                        {significations.map((sig: any) => {
                            // Helper to extract house numbers from various formats
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

                            // Last resort fallback for older backends: if L1/L2 are empty but 'total' exists
                            const finalL1 = l1;
                            const finalL2 = l2.length > 0 ? l2 : (sig.total || []);

                            return (
                                <tr key={sig.planet}>
                                    <td style={{ fontWeight: '800', color: 'var(--primary)', padding: '12px', border: '1px solid #e2e8f0' }}>
                                        {sig.planet}
                                        {sig.levels?.is_self_strength && (
                                            <span title="Self-Strength Reordering Applied" style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                                        )}
                                        {sig.agent && (
                                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 400 }}>
                                                Rep: {sig.agent}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '8px', fontWeight: 700, color: 'var(--secondary)', border: '1px solid #e2e8f0' }}>
                                        {finalL1.length > 0 ? finalL1.join(', ') : '-'}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '8px', fontWeight: 600, border: '1px solid #e2e8f0' }}>
                                        {finalL2.length > 0 ? finalL2.join(', ') : '-'}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '8px', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                        {l3.length > 0 ? l3.join(', ') : '-'}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '8px', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                                        {l4.length > 0 ? l4.join(', ') : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Reference:</strong></p>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    <li><strong>Grade A:</strong> SL Occupation | <strong>Grade B:</strong> Planet Occupation</li>
                    <li><strong>Grade C:</strong> SL Ownership | <strong>Grade D:</strong> Planet Ownership</li>
                    <li><span style={{ color: '#ef4444' }}>*</span> Planets with no Star-Lord occupants use reordered strength (B-A-D-C).</li>
                    <li>Nodes (Ra/Ke) signify their own results + results of their most prominent agent.</li>
                </ul>
            </div>
        </div>
    );
};

export default SignificationTable;
