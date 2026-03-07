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
    const [expandedSD, setExpandedSD] = React.useState<string | null>(null);

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
                    const sdIdx = dasha.mahadasha_sequence[mdIdx].bukthis?.[adIdx].antaras?.[pdIdx].sukshmas?.findIndex(sd => sd.planet === dasha.current_sukshma);
                    if (sdIdx !== undefined && sdIdx !== -1) {
                        setExpandedSD(`${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}`);
                    }
                }
            }
        }
    }, [dasha.current_dasha, dasha.current_bukthi, dasha.current_antara, dasha.current_sukshma, dasha.mahadasha_sequence]);

    const toggleMD = (idx: number) => {
        setExpandedMD(expandedMD === idx ? null : idx);
        setExpandedAD(null);
        setExpandedPD(null);
        setExpandedSD(null);
    };

    const toggleAD = (mdIdx: number, adIdx: number) => {
        const key = `${mdIdx}-${adIdx}`;
        setExpandedAD(expandedAD === key ? null : key);
        setExpandedPD(null);
        setExpandedSD(null);
    };

    const togglePD = (mdIdx: number, adIdx: number, pdIdx: number) => {
        const key = `${mdIdx}-${adIdx}-${pdIdx}`;
        setExpandedPD(expandedPD === key ? null : key);
        setExpandedSD(null);
    };

    const toggleSD = (mdIdx: number, adIdx: number, pdIdx: number, sdIdx: number) => {
        const key = `${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}`;
        setExpandedSD(expandedSD === key ? null : key);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Summary Card */}
            <div className="card" style={{
                borderLeft: '4px solid #35a4f4',
                borderTop: '5px solid #35a4f4',
                padding: '1.25rem',
                background: '#ffffff'
            }}>
                <h2 style={{ marginBottom: '1rem', color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>Vimshottari Dasha Summary</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>MD / AD</label>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1d4ed8' }}>{dasha.current_dasha} / {dasha.current_bukthi}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PD / SD</label>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>{dasha.current_antara} / {dasha.current_sukshma}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Prana</label>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#7c2d12' }}>{dasha.current_prana}</div>
                    </div>
                </div>
            </div>

            {/* Nested Table View */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderTop: '5px solid #35a4f4' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                    <h2 style={{ color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 700 }}>Dasha Sequence</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left' }}>
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
                                            background: md.planet === dasha.current_dasha ? '#1d4ed8' : 'white',
                                            color: md.planet === dasha.current_dasha ? 'white' : 'inherit',
                                            borderBottom: '1px solid #e2e8f0'
                                        }}
                                    >
                                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {expandedMD === mdIdx ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            {md.planet}
                                        </td>
                                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', opacity: 0.8 }}>{md.start_date}</td>
                                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', opacity: 0.8 }}>{md.end_date}</td>
                                    </tr>

                                    {/* Bhuktis */}
                                    {expandedMD === mdIdx && md.bukthis?.map((ad, adIdx) => (
                                        <React.Fragment key={`${mdIdx}-${adIdx}`}>
                                            <tr
                                                onClick={(e) => { e.stopPropagation(); toggleAD(mdIdx, adIdx); }}
                                                style={{
                                                    cursor: 'pointer',
                                                    background: ad.planet === dasha.current_bukthi ? '#15803d' : '#f8fafc',
                                                    color: ad.planet === dasha.current_bukthi ? 'white' : 'inherit',
                                                    borderBottom: '1px solid #e2e8f0'
                                                }}
                                            >
                                                <td style={{ padding: '0.7rem 1rem 0.7rem 2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {expandedAD === `${mdIdx}-${adIdx}` ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                    {ad.planet}
                                                </td>
                                                <td style={{ padding: '0.7rem 1rem', fontSize: '0.7rem', opacity: 0.8 }}>{ad.start_date}</td>
                                                <td style={{ padding: '0.7rem 1rem', fontSize: '0.7rem', opacity: 0.8 }}>{ad.end_date}</td>
                                            </tr>

                                            {/* Antaras */}
                                            {expandedAD === `${mdIdx}-${adIdx}` && ad.antaras?.map((pd, pdIdx) => (
                                                <React.Fragment key={`${mdIdx}-${adIdx}-${pdIdx}`}>
                                                    <tr
                                                        onClick={(e) => { e.stopPropagation(); togglePD(mdIdx, adIdx, pdIdx); }}
                                                        style={{
                                                            cursor: 'pointer',
                                                            background: pd.planet === dasha.current_antara ? '#b45309' : '#ffffff',
                                                            color: pd.planet === dasha.current_antara ? 'white' : 'inherit',
                                                            borderBottom: '1px solid #f1f5f9'
                                                        }}
                                                    >
                                                        <td style={{ padding: '0.6rem 1rem 0.6rem 3rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                                                            {pd.planet}
                                                        </td>
                                                        <td style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', opacity: 0.8 }}>{pd.start_date}</td>
                                                        <td style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', opacity: 0.8 }}>{pd.end_date}</td>
                                                    </tr>

                                                    {/* Sukshmas */}
                                                    {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` && pd.sukshmas?.map((sd, sdIdx) => (
                                                        <React.Fragment key={`${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}`}>
                                                            <tr
                                                                onClick={(e) => { e.stopPropagation(); toggleSD(mdIdx, adIdx, pdIdx, sdIdx); }}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    background: sd.planet === dasha.current_sukshma ? '#7c2d12' : '#f8f9fa',
                                                                    color: sd.planet === dasha.current_sukshma ? 'white' : 'inherit',
                                                                    borderBottom: '1px solid #f1f5f9'
                                                                }}
                                                            >
                                                                <td style={{ padding: '0.5rem 1rem 0.5rem 4rem', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    {expandedSD === `${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}` ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                                                    • {sd.planet}
                                                                </td>
                                                                <td style={{ padding: '0.5rem 1rem', fontSize: '0.6rem', opacity: 0.8 }}>{sd.start_date}</td>
                                                                <td style={{ padding: '0.5rem 1rem', fontSize: '0.6rem', opacity: 0.8 }}>{sd.end_date}</td>
                                                            </tr>

                                                            {/* Pranas */}
                                                            {expandedSD === `${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}` && sd.pranas?.map((pr, prIdx) => (
                                                                <tr key={prIdx} style={{
                                                                    background: pr.planet === dasha.current_prana ? '#451a03' : '#ffffff',
                                                                    color: pr.planet === dasha.current_prana ? 'white' : '#64748b',
                                                                    borderBottom: '1px solid #f8f9fa'
                                                                }}>
                                                                    <td style={{ padding: '0.4rem 1rem 0.4rem 5rem', fontSize: '0.75rem' }}>
                                                                        » {pr.planet}
                                                                    </td>
                                                                    <td style={{ padding: '0.4rem 1rem', fontSize: '0.6rem', opacity: 0.7 }}>{pr.start_date}</td>
                                                                    <td style={{ padding: '0.4rem 1rem', fontSize: '0.6rem', opacity: 0.7 }}>{pr.end_date}</td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ))}
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
