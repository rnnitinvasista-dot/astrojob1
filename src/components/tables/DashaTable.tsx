import React from 'react';
import type { Dasha, DashaSequenceItem } from '../../types/astrology';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getCurrentDashaLords } from '../../services/api';

interface DashaTableProps {
    dasha: Dasha;
}

const DashaTable: React.FC<DashaTableProps> = ({ dasha }) => {
    const [expandedMD, setExpandedMD] = React.useState<number | null>(null);
    const [expandedAD, setExpandedAD] = React.useState<string | null>(null);
    const [expandedPD, setExpandedPD] = React.useState<string | null>(null);
    const [expandedSD, setExpandedSD] = React.useState<string | null>(null);

    // Helper function to format date from 'YYYY-MM-DD' to 'DD/MM/YYYY'
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateString;
    };

    // Auto-expand current period on load
    React.useEffect(() => {
        const trueLords = getCurrentDashaLords(dasha.mahadasha_sequence);
        const activeDasha = trueLords.dasha || dasha.current_dasha;
        const activeBukthi = trueLords.bukthi || dasha.current_bukthi;
        const activeAntara = trueLords.antara || dasha.current_antara;
        const activePratyantar = trueLords.pratyantar || dasha.current_pratyantar;

        const mdIdx = dasha.mahadasha_sequence.findIndex(md => md.planet === activeDasha);
        if (mdIdx !== -1) {
            setExpandedMD(mdIdx);
            const adIdx = dasha.mahadasha_sequence[mdIdx].bukthis?.findIndex(ad => ad.planet === activeBukthi);
            if (adIdx !== undefined && adIdx !== -1) {
                setExpandedAD(`${mdIdx}-${adIdx}`);
                const pdIdx = dasha.mahadasha_sequence[mdIdx].bukthis?.[adIdx].antaras?.findIndex(pd => pd.planet === activeAntara);
                if (pdIdx !== undefined && pdIdx !== -1) {
                    setExpandedPD(`${mdIdx}-${adIdx}-${pdIdx}`);
                    const sdIdx = dasha.mahadasha_sequence[mdIdx].bukthis?.[adIdx].antaras?.[pdIdx].pratyantars?.findIndex(sd => sd.planet === activePratyantar);
                    if (sdIdx !== undefined && sdIdx !== -1) {
                        setExpandedSD(`${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}`);
                    }
                }
            }
        }
    }, [dasha.mahadasha_sequence, dasha.current_dasha]); // Only re-run if sequence changes or on initial load

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

    const trueLords = getCurrentDashaLords(dasha.mahadasha_sequence);
    const activeD = trueLords.dasha || dasha.current_dasha;
    const activeB = trueLords.bukthi || dasha.current_bukthi;
    const activeA = trueLords.antara || dasha.current_antara;
    const activeP = trueLords.pratyantar || dasha.current_pratyantar;
    const activeS = trueLords.sookshma || dasha.current_sookshma;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '100%' }}>
            <div className="card" style={{
                borderLeft: '4px solid #35a4f4',
                borderTop: '5px solid #35a4f4',
                width: '100%',
                maxWidth: '100%',
                padding: '1rem 0.5rem'
            }}>
                <h2 style={{ marginBottom: '1rem', color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 700 }}>Dasha Summary</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Balance</label>
                        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{dasha.balance_at_birth}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active Path</label>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {activeD}/{activeB}/{activeA}{activeP ? `/${activeP}` : ''}{activeS ? `/${activeS}` : ''}
                        </div>
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
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0' }}>Planet</th>
                                <th style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0' }}>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dasha.mahadasha_sequence.map((md: DashaSequenceItem, mdIdx: number) => (
                                <React.Fragment key={mdIdx}>
                                    <tr
                                        onClick={() => toggleMD(mdIdx)}
                                        style={{
                                            cursor: 'pointer',
                                            background: md.planet === activeD ? '#1d4ed8' : 'white',
                                            color: md.planet === activeD ? 'white' : 'inherit'
                                        }}
                                    >
                                        <td style={{ padding: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0' }}>
                                            {expandedMD === mdIdx ? <ChevronDown size={16} color={md.planet === activeD ? 'white' : 'currentColor'} /> : <ChevronRight size={16} color={md.planet === activeD ? 'white' : 'currentColor'} />}
                                            {md.planet} (D)
                                        </td>
                                        <td style={{ padding: '1rem', color: md.planet === activeD ? 'rgba(255,255,255,0.8)' : '#64748b', border: '1px solid #e2e8f0' }}>{formatDate(md.end_date)}</td>
                                    </tr>

                                    {/* Bukthis (AD) */}
                                    {expandedMD === mdIdx && md.bukthis?.map((ad: DashaSequenceItem, adIdx: number) => (
                                        <React.Fragment key={adIdx}>
                                            <tr
                                                onClick={(e) => { e.stopPropagation(); toggleAD(mdIdx, adIdx); }}
                                                style={{
                                                    background: (md.planet === activeD && ad.planet === activeB) ? '#15803d' : (expandedAD === `${mdIdx}-${adIdx}` ? '#eff6ff' : '#fafafa'),
                                                    color: (md.planet === activeD && ad.planet === activeB) ? 'white' : 'inherit',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <td style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: (md.planet === activeD && ad.planet === activeB) ? 'white' : '#475569', border: '1px solid #e2e8f0' }}>
                                                    {expandedAD === `${mdIdx}-${adIdx}` ? <ChevronDown size={14} color={(md.planet === activeD && ad.planet === activeB) ? 'white' : 'currentColor'} /> : <ChevronRight size={14} color={(md.planet === activeD && ad.planet === activeB) ? 'white' : 'currentColor'} />}
                                                    {ad.planet} (B)
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: (md.planet === activeD && ad.planet === activeB) ? 'rgba(255,255,255,0.8)' : '#94a3b8', border: '1px solid #e2e8f0' }}>{formatDate(ad.end_date)}</td>
                                            </tr>

                                            {/* Antaras (PD) */}
                                            {expandedAD === `${mdIdx}-${adIdx}` && ad.antaras?.map((pd: DashaSequenceItem, pdIdx: number) => (
                                                <React.Fragment key={pdIdx}>
                                                    <tr
                                                        onClick={(e) => { e.stopPropagation(); togglePD(mdIdx, adIdx, pdIdx); }}
                                                        style={{
                                                            background: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA) ? '#b45309' : (expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` ? '#fef3c7' : '#ffffff'),
                                                            color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA) ? 'white' : 'inherit',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <td style={{ padding: '0.5rem 1rem 0.5rem 4rem', fontSize: '0.85rem', color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA) ? 'white' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0' }}>
                                                            {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` ? <ChevronDown size={12} color={(md.planet === activeD && ad.planet === activeB && pd.planet === activeA) ? 'white' : 'currentColor'} /> : <ChevronRight size={12} color={(md.planet === activeD && ad.planet === activeB && pd.planet === activeA) ? 'white' : 'currentColor'} />}
                                                            {pd.planet} (A)
                                                        </td>
                                                        <td style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA) ? 'rgba(255,255,255,0.8)' : '#cbd5e1', border: '1px solid #e2e8f0' }}>{formatDate(pd.end_date)}</td>
                                                    </tr>

                                                    {/* Pratyantars (SD) */}
                                                    {expandedPD === `${mdIdx}-${adIdx}-${pdIdx}` && pd.pratyantars?.map((sd: DashaSequenceItem, sdIdx: number) => (
                                                        <React.Fragment key={sdIdx}>
                                                            <tr
                                                                onClick={(e) => { e.stopPropagation(); toggleSD(mdIdx, adIdx, pdIdx, sdIdx); }}
                                                                style={{
                                                                    background: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP) ? '#7c3aed' : (expandedSD === `${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}` ? '#f5f3ff' : '#ffffff'),
                                                                    color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP) ? 'white' : 'inherit',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <td style={{ padding: '0.4rem 1rem 0.4rem 5.5rem', fontSize: '0.8rem', color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP) ? 'white' : '#7c3aed', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0' }}>
                                                                    {expandedSD === `${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}` ? <ChevronDown size={10} color={(md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP) ? 'white' : 'currentColor'} /> : <ChevronRight size={10} color={(md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP) ? 'white' : 'currentColor'} />}
                                                                    {sd.planet} (P)
                                                                </td>
                                                                <td style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP) ? 'rgba(255,255,255,0.8)' : '#d1d5db', border: '1px solid #e2e8f0' }}>{formatDate(sd.end_date)}</td>
                                                            </tr>

                                                            {/* Sookshmas (PR) */}
                                                            {expandedSD === `${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}` && sd.sookshmas?.map((pr: DashaSequenceItem, prIdx: number) => (
                                                                <tr key={prIdx} style={{
                                                                    background: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP && pr.planet === activeS) ? '#db2777' : '#ffffff',
                                                                    color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP && pr.planet === activeS) ? 'white' : 'inherit'
                                                                }}>
                                                                    <td style={{ padding: '0.3rem 1rem 0.3rem 7rem', fontSize: '0.75rem', color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP && pr.planet === activeS) ? 'white' : '#db2777', border: '1px solid #e2e8f0' }}>
                                                                        • {md.planet.substring(0, 2)}/{ad.planet.substring(0, 2)}/{pd.planet.substring(0, 2)}/{sd.planet.substring(0, 2)}/{pr.planet.substring(0, 2)}
                                                                    </td>
                                                                    <td style={{ padding: '0.3rem 1rem', fontSize: '0.65rem', color: (md.planet === activeD && ad.planet === activeB && pd.planet === activeA && sd.planet === activeP && pr.planet === activeS) ? 'rgba(255,255,255,0.8)' : '#e5e7eb', border: '1px solid #e2e8f0' }}>{formatDate(pr.end_date)}</td>
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
