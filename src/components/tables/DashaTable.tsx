import React from 'react';
import type { Dasha } from '../../types/astrology';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface DashaTableProps {
    dasha: Dasha;
}

const DashaTable: React.FC<DashaTableProps> = ({ dasha }) => {
    const [expandedMD, setExpandedMD] = React.useState<number | null>(null);
    const [expandedAD, setExpandedAD] = React.useState<string | null>(null);
    const [expandedPD, setExpandedPD] = React.useState<string | null>(null);

    // Auto-expand current period on load
    React.useEffect(() => {
        const mdIdx = dasha.mahadasha_sequence.findIndex(md => md.planet === dasha.current_dasha);
        if (mdIdx !== -1) {
            setExpandedMD(mdIdx);
            const adIdx = dasha.mahadasha_sequence[mdIdx].bukthis?.findIndex(ad => ad.planet === dasha.current_bukthi);
            if (adIdx !== undefined && adIdx !== -1) {
                setExpandedAD(`${mdIdx}-${adIdx}`);
                const pdIdx = dasha.mahadasha_sequence[mdIdx].bukthis?.[adIdx].antaras?.findIndex(pd => pd.planet === dasha.current_antara);
                if (pdIdx !== undefined && pdIdx !== -1) {
                    setExpandedPD(`${mdIdx}-${adIdx}-${pdIdx}`);
                }
            }
        }
    }, [dasha.current_dasha, dasha.current_bukthi, dasha.current_antara, dasha.mahadasha_sequence]);

    const toggleMD = (idx: number) => {
        setExpandedMD(expandedMD === idx ? null : idx);
        setExpandedAD(null);
        setExpandedPD(null);
    };

    const toggleAD = (mdIdx: number, adIdx: number) => {
        const key = `${mdIdx}-${adIdx}`;
        setExpandedAD(expandedAD === key ? null : key);
        setExpandedPD(null);
    };

    const togglePD = (mdIdx: number, adIdx: number, pdIdx: number) => {
        const key = `${mdIdx}-${adIdx}-${pdIdx}`;
        setExpandedPD(expandedPD === key ? null : key);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>
            {/* Summary Card */}
            <div className="card" style={{
                borderLeft: '4px solid #35a4f4',
                borderTop: '5px solid #35a4f4',
                padding: '1.25rem',
                background: '#ffffff'
            }}>
                <h2 style={{ marginBottom: '1rem', color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vimshottari Dasha Summary</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Balance at Birth</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{dasha.balance_at_birth}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Current MD / AD</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>{dasha.current_dasha} / {dasha.current_bukthi}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Current PD / SD</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b45309' }}>{dasha.current_antara} / {dasha.current_sukshma}</div>
                    </div>
                </div>
            </div>

            {/* Hierarchical Tables */}
            <div className="dasha-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="table-wrapper" style={{ border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#ffffff' }}>
                    <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase' }}>Level 1 – Mahadasha Table</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '0.75rem 1rem' }}>Planet</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Start Date</th>
                                <th style={{ padding: '0.75rem 1rem' }}>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dasha.mahadasha_sequence.map((md, mdIdx) => (
                                <React.Fragment key={mdIdx}>
                                    <tr
                                        onClick={() => toggleMD(mdIdx)}
                                        style={{
                                            cursor: 'pointer',
                                            background: md.planet === dasha.current_dasha ? '#eff6ff' : 'white',
                                            borderBottom: '1px solid #f1f5f9',
                                            fontWeight: md.planet === dasha.current_dasha ? 700 : 500
                                        }}
                                    >
                                        <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', color: md.planet === dasha.current_dasha ? '#1d4ed8' : '#334155' }}>
                                            {expandedMD === mdIdx ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            {md.planet}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem' }}>{md.start_date}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem' }}>{md.end_date}</td>
                                    </tr>

                                    {/* Level 2 - Bhukti Table */}
                                    {expandedMD === mdIdx && (
                                        <tr>
                                            <td colSpan={3} style={{ padding: '0 0.5rem 0.5rem' }}>
                                                <div style={{ border: '1.5px solid #d1fae5', borderRadius: '8px', overflow: 'hidden', marginTop: '0.5rem' }}>
                                                    <div style={{ padding: '0.5rem', background: '#ecfdf5', borderBottom: '1px solid #d1fae5', fontSize: '0.75rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase' }}>
                                                        Level 2 – {md.planet} Bhukti Table
                                                    </div>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                                        <thead style={{ background: '#f9fafb', color: '#6b7280' }}>
                                                            <tr>
                                                                <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left' }}>Bhukti Lord</th>
                                                                <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left' }}>Start</th>
                                                                <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left' }}>End</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {md.bukthis?.map((ad, adIdx) => (
                                                                <React.Fragment key={adIdx}>
                                                                    <tr
                                                                        onClick={(e) => { e.stopPropagation(); toggleAD(mdIdx, adIdx); }}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            background: ad.planet === dasha.current_bukthi ? '#f0fdf4' : 'white',
                                                                            borderBottom: '1px solid #f3f4f6'
                                                                        }}
                                                                    >
                                                                        <td style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '6px', color: ad.planet === dasha.current_bukthi ? '#16a34a' : '#4b5563', fontWeight: ad.planet === dasha.current_bukthi ? 700 : 500 }}>
                                                                            {expandedAD === `${mdIdx}-${adIdx}` ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                                            {ad.planet}
                                                                        </td>
                                                                        <td style={{ padding: '0.4rem 0.75rem', color: '#9ca3af', fontSize: '0.7rem' }}>{ad.start_date}</td>
                                                                        <td style={{ padding: '0.4rem 0.75rem', color: '#9ca3af', fontSize: '0.7rem' }}>{ad.end_date}</td>
                                                                    </tr>

                                                                    {/* Level 3 - Antar Table */}
                                                                    {expandedAD === `${mdIdx}-${adIdx}` && (
                                                                        <tr>
                                                                            <td colSpan={3} style={{ padding: '0 0.4rem 0.4rem' }}>
                                                                                <div style={{ border: '1px solid #ffedd5', borderRadius: '6px', overflow: 'hidden', marginTop: '0.4rem' }}>
                                                                                    <div style={{ padding: '0.4rem', background: '#fff7ed', borderBottom: '1px solid #ffedd5', fontSize: '0.7rem', fontWeight: 800, color: '#9a3412', textTransform: 'uppercase' }}>
                                                                                        Level 3 – {ad.planet} Antar Table
                                                                                    </div>
                                                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                                                                        <tbody>
                                                                                            {ad.antaras?.map((pd, pdIdx) => (
                                                                                                <React.Fragment key={pdIdx}>
                                                                                                    <tr
                                                                                                        onClick={(e) => { e.stopPropagation(); togglePD(mdIdx, adIdx, pdIdx); }}
                                                                                                        style={{
                                                                                                            cursor: 'pointer',
                                                                                                            background: pd.planet === dasha.current_antara ? '#fffbeb' : 'white',
                                                                                                            borderBottom: '1px solid #fff7ed'
                                                                                                        }}
                                                                                                    >
                                                                                                        <td style={{ padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '5px', color: pd.planet === dasha.current_antara ? '#b45309' : '#6b7280', fontWeight: pd.planet === dasha.current_antara ? 700 : 500 }}>
                                                                                                            {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                                                                                            {pd.planet}
                                                                                                        </td>
                                                                                                        <td style={{ padding: '0.35rem 0.75rem', color: '#d1d5db', fontSize: '0.65rem' }}>{pd.start_date}</td>
                                                                                                        <td style={{ padding: '0.35rem 0.75rem', color: '#d1d5db', fontSize: '0.65rem' }}>{pd.end_date}</td>
                                                                                                    </tr>

                                                                                                    {/* Level 4 - Sukshma Table */}
                                                                                                    {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` && (
                                                                                                        <tr>
                                                                                                            <td colSpan={3} style={{ padding: '0 0.3rem 0.3rem' }}>
                                                                                                                <div style={{ border: '1px solid #f3e8ff', borderRadius: '4px', overflow: 'hidden', marginTop: '0.3rem' }}>
                                                                                                                    <div style={{ padding: '0.3rem', background: '#faf5ff', borderBottom: '1px solid #f3e8ff', fontSize: '0.65rem', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase' }}>
                                                                                                                        Level 4 – {pd.planet} Sukshma Table
                                                                                                                    </div>
                                                                                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                                                                                                                        <tbody style={{ background: 'white' }}>
                                                                                                                            {pd.sukshmas?.map((sd, sdIdx) => (
                                                                                                                                <tr key={sdIdx} style={{ background: sd.planet === dasha.current_sukshma ? '#f3e8ff' : 'white', borderBottom: '1px solid #f3f4f6' }}>
                                                                                                                                    <td style={{ padding: '0.25rem 0.75rem', color: sd.planet === dasha.current_sukshma ? '#7e22ce' : '#9ca3af', fontWeight: sd.planet === dasha.current_sukshma ? 700 : 400 }}>
                                                                                                                                        • {sd.planet}
                                                                                                                                    </td>
                                                                                                                                    <td style={{ padding: '0.25rem 0.75rem', color: '#e5e7eb', fontSize: '0.6rem' }}>{sd.start_date}</td>
                                                                                                                                    <td style={{ padding: '0.25rem 0.75rem', color: '#e5e7eb', fontSize: '0.6rem' }}>{sd.end_date}</td>
                                                                                                                                </tr>
                                                                                                                            ))}
                                                                                                                        </tbody>
                                                                                                                    </table>
                                                                                                                </div>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    )}
                                                                                                </React.Fragment>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </React.Fragment>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashaTable;
