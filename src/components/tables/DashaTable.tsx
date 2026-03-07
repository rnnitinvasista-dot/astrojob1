import React from 'react';
import type { Dasha, DashaSequenceItem } from '../../types/astrology';
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '100%' }}>
            <div className="card" style={{
                borderLeft: '4px solid #35a4f4',
                borderTop: '5px solid #35a4f4',
                width: '100%',
                maxWidth: '100%',
                padding: '1rem 0.5rem'
            }}>
                <h2 style={{ marginBottom: '1rem', color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 700 }}>Vimshottari Dasha Summary</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Balance</label>
                        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{dasha.balance_at_birth}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Dasha / Bukthi</label>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{dasha.current_dasha} / {dasha.current_bukthi}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Antar / Sukshma</label>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>{dasha.current_antara} / {dasha.current_sukshma}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{
                padding: 0,
                overflow: 'hidden',
                width: '100%',
                maxWidth: '100%',
                borderTop: '5px solid #35a4f4'
            }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                    <h2 style={{ color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 700 }}>Vimshottari Dasha Sequence</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem 1rem' }}>Planet</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Start Date</th>
                                <th style={{ padding: '0.75rem 1rem' }}>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dasha.mahadasha_sequence.map((md: DashaSequenceItem, mdIdx: number) => (
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
                                        <td style={{ padding: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {expandedMD === mdIdx ? <ChevronDown size={16} color={md.planet === dasha.current_dasha ? 'white' : 'currentColor'} /> : <ChevronRight size={16} color={md.planet === dasha.current_dasha ? 'white' : 'currentColor'} />}
                                            {md.planet}
                                        </td>
                                        <td style={{ padding: '1rem', color: md.planet === dasha.current_dasha ? 'rgba(255,255,255,0.8)' : '#64748b' }}>{md.start_date}</td>
                                        <td style={{ padding: '1rem', color: md.planet === dasha.current_dasha ? 'rgba(255,255,255,0.8)' : '#64748b' }}>{md.end_date}</td>
                                    </tr>

                                    {/* Bukthis (AD) */}
                                    {expandedMD === mdIdx && md.bukthis?.map((ad: DashaSequenceItem, adIdx: number) => (
                                        <React.Fragment key={adIdx}>
                                            <tr
                                                onClick={(e) => { e.stopPropagation(); toggleAD(mdIdx, adIdx); }}
                                                style={{
                                                    background: ad.planet === dasha.current_bukthi ? '#15803d' : (expandedAD === `${mdIdx}-${adIdx}` ? '#eff6ff' : '#fafafa'),
                                                    color: ad.planet === dasha.current_bukthi ? 'white' : 'inherit',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <td style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: ad.planet === dasha.current_bukthi ? 'white' : '#475569' }}>
                                                    {expandedAD === `${mdIdx}-${adIdx}` ? <ChevronDown size={14} color={ad.planet === dasha.current_bukthi ? 'white' : 'currentColor'} /> : <ChevronRight size={14} color={ad.planet === dasha.current_bukthi ? 'white' : 'currentColor'} />}
                                                    {ad.planet}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: ad.planet === dasha.current_bukthi ? 'rgba(255,255,255,0.8)' : '#94a3b8' }}>{ad.start_date}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: ad.planet === dasha.current_bukthi ? 'rgba(255,255,255,0.8)' : '#94a3b8' }}>{ad.end_date}</td>
                                            </tr>

                                            {/* Antaras (PD) */}
                                            {expandedAD === `${mdIdx}-${adIdx}` && ad.antaras?.map((pd: DashaSequenceItem, pdIdx: number) => (
                                                <React.Fragment key={pdIdx}>
                                                    <tr
                                                        onClick={(e) => { e.stopPropagation(); togglePD(mdIdx, adIdx, pdIdx); }}
                                                        style={{
                                                            background: pd.planet === dasha.current_antara ? '#b45309' : (expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` ? '#fffbeb' : '#ffffff'),
                                                            color: pd.planet === dasha.current_antara ? 'white' : 'inherit',
                                                            borderBottom: '1px solid #f8fafc',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <td style={{ padding: '0.5rem 1rem 0.5rem 4rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: pd.planet === dasha.current_antara ? 'white' : '#64748b' }}>
                                                            {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` ? <ChevronDown size={12} color={pd.planet === dasha.current_antara ? 'white' : 'currentColor'} /> : <ChevronRight size={12} color={pd.planet === dasha.current_antara ? 'white' : 'currentColor'} />}
                                                            {pd.planet}
                                                        </td>
                                                        <td style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: pd.planet === dasha.current_antara ? 'rgba(255,255,255,0.8)' : '#cbd5e1' }}>{pd.start_date}</td>
                                                        <td style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: pd.planet === dasha.current_antara ? 'rgba(255,255,255,0.8)' : '#cbd5e1' }}>{pd.end_date}</td>
                                                    </tr>

                                                    {/* Sukshmas (SD) */}
                                                    {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` && pd.sukshmas?.map((sd: DashaSequenceItem, sdIdx: number) => (
                                                        <tr key={sdIdx} style={{
                                                            background: sd.planet === dasha.current_sukshma ? '#7c2d12' : '#ffffff',
                                                            color: sd.planet === dasha.current_sukshma ? 'white' : 'inherit',
                                                            borderBottom: '1px solid #f8fafc'
                                                        }}>
                                                            <td style={{ padding: '0.35rem 1rem 0.35rem 5.5rem', fontSize: '0.8rem', color: sd.planet === dasha.current_sukshma ? 'white' : '#94a3b8' }}>
                                                                • {sd.planet}
                                                            </td>
                                                            <td style={{ padding: '0.35rem 1rem', fontSize: '0.7rem', color: sd.planet === dasha.current_sukshma ? 'rgba(255,255,255,0.8)' : '#e2e8f0' }}>{sd.start_date}</td>
                                                            <td style={{ padding: '0.35rem 1rem', fontSize: '0.7rem', color: sd.planet === dasha.current_sukshma ? 'rgba(255,255,255,0.8)' : '#e2e8f0' }}>{sd.end_date}</td>
                                                        </tr>
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
