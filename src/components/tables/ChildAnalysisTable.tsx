import React, { useState } from 'react';
import type { Planet } from '../../types/astrology';

interface ChildAnalysisTableProps {
    reports: any[];
    planets: Planet[];
    dashaType: string;
    planetName: string;
}

const CHILD_BIRTH_RESULT_MAP: Record<number, string> = {
    1: "Difficulty / Obstacles in Child Birth.",
    2: "Good Fertility / Family Addition Indicated.",
    3: "Neutral / Mixed Results.",
    4: "Obstacles / Delay in Child Birth.",
    5: "High Fertility / Strong Child Birth Indicated.",
    6: "Complications / Health issues in Pregnancy.",
    7: "Partnership support / Neutral.",
    8: "Potential Surgery / Complications / Risk.",
    9: "God's Grace / High Fertility / Protection.",
    10: "Delay / High Pressure / Obstacles.",
    11: "Gains / Success in Child Birth.",
    12: "Medical expenses / Complications / Risk."
};

const ChildAnalysisTable: React.FC<ChildAnalysisTableProps> = ({ reports, planets, dashaType, planetName }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const planetReport = reports.find(r => r.planet === planetName) || reports[0];
    if (!planetReport) return <div>No data available</div>;

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { placementMap[p.planet] = p.house_placed; });

    const nlHit = planetReport.prediction.hits.nl;
    const slHit = planetReport.prediction.hits.sl;

    const plHouses = planetReport.pl || [];
    const nlHouses = planetReport.nl || [];
    const slHouses = planetReport.sl || [];

    const getHouseColor = (h: number) => {
        if ([2, 5, 9, 11].includes(h)) return '#16a34a'; // Green (Good)
        if ([3, 7].includes(h)) return '#2563eb'; // Blue (Neutral)
        if ([1, 4, 6, 8, 10, 12].includes(h)) return '#ef4444'; // Red (Bad)
        return '#1e293b';
    };

    const renderHousesPerRow = (sigs: number[], hit: number | null) => {
        const uniquePool = Array.from(new Set([...sigs, ...(hit ? [hit] : [])])).sort((a, b) => a - b);

        const good = uniquePool.filter(h => [2, 5, 9, 11].includes(h));
        const neutral = uniquePool.filter(h => [3, 7].includes(h));
        const bad = uniquePool.filter(h => [1, 4, 6, 8, 10, 12].includes(h));

        const renderCell = (list: number[]) => {
            if (list.length === 0) return <span style={{ color: '#ccc', fontSize: '11px' }}>-</span>;
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
                    {list.map((h, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: (h === hit) ? '24px' : 'auto', height: (h === hit) ? '24px' : 'auto',
                            border: (h === hit) ? '1.5px solid #000000' : 'none',
                            borderRadius: '3px', margin: '0 2px', padding: (h === hit) ? '0' : '0 3px',
                            background: (h === hit) ? '#f8fafc' : 'transparent',
                            color: getHouseColor(h),
                            fontWeight: '800',
                            fontSize: '0.85rem'
                        }}>
                            {h}
                        </span>
                    ))}
                </div>
            );
        };
        return { good, neutral, bad, renderCell };
    };

    const plBif = renderHousesPerRow(plHouses, null); // PL hit is ignored per user req
    const nlBif = renderHousesPerRow(nlHouses, nlHit);
    const slBif = renderHousesPerRow(slHouses, slHit);

    const comboGoodSet = new Set([...plBif.good, ...nlBif.good, ...slBif.good]);
    const comboBadSet = new Set([...plBif.bad, ...nlBif.bad, ...slBif.bad]);

    const renderCombination = (hSet: Set<number>) => {
        const sorted = Array.from(hSet).sort((a, b) => a - b);
        if (sorted.length === 0) return <span style={{ color: '#ccc' }}>-</span>;
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
                {sorted.map((h, i) => {
                    const isBoxed = h === nlHit || h === slHit;
                    return (
                        <span key={h} style={{
                            color: getHouseColor(h),
                            fontWeight: '800',
                            width: isBoxed ? '24px' : 'auto',
                            height: isBoxed ? '24px' : 'auto',
                            border: isBoxed ? '1.5px solid #000000' : 'none',
                            borderRadius: '3px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: isBoxed ? '0' : '0 2px',
                            margin: '0 2px'
                        }}>
                            {h}
                            {i < sorted.length - 1 && !isBoxed ? <span style={{ opacity: 0.4, marginLeft: '2px' }}>,</span> : ''}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            width: '100%',
            border: '2px solid #000000',
            borderTop: '5px solid #000000'
        }}>
            <div style={{ background: '#1d4ed8', padding: '10px 8px', textAlign: 'center', borderBottom: '1.5px solid #000000' }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}>
                    {planetReport.planet.toUpperCase()}
                </h3>
                <div style={{ color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', marginTop: '2px' }}>
                    {dashaType}
                </div>
            </div>

            <div style={{ padding: '0px' }}>
                {[
                    { label: 'PL', p: planetReport.planet, h: null, bif: plBif },
                    { label: 'NL', p: planetReport.star_lord, h: nlHit, bif: nlBif },
                    { label: 'SL', p: planetReport.sub_lord, h: slHit, bif: slBif }
                ].map((row) => (
                    <div key={row.label} style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#1d4ed8' }}>{row.p.substring(0, 2).toUpperCase()}</span>
                            <span style={{ opacity: 0.8, fontSize: '0.65rem' }}>({row.label})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', marginBottom: '4px', textTransform: 'uppercase' }}>GOOD</div>
                                {row.bif.renderCell(row.bif.good)}
                            </div>
                            <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', marginBottom: '4px', textTransform: 'uppercase' }}>BAD</div>
                                {row.bif.renderCell(row.bif.bad)}
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>COMBINATION</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {renderCombination(comboGoodSet)}
                        <span style={{ color: '#000000', fontWeight: 900, fontSize: '1rem' }}>/</span>
                        {renderCombination(comboBadSet)}
                    </div>
                </div>

                <div style={{ borderBottom: '1.5 solid #000000', padding: '12px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>FERTILITY</div>
                    <div style={{ display: 'flex', gap: '8px', fontWeight: 900, fontSize: '1.1rem', alignItems: 'center' }}>
                        <span style={{ color: '#16a34a' }}>
                            {planetReport.prediction.indication_report.toUpperCase()}
                        </span>
                        <span style={{ color: '#cbd5e1', fontWeight: 400 }}>/</span>
                        <span style={{ color: '#ef4444' }}>
                            {planetReport.prediction.loss_report.toUpperCase()}
                        </span>
                    </div>
                    {planetReport.prediction.special_status && (
                        <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800, marginTop: '4px', textTransform: 'uppercase' }}>
                            ★ {planetReport.prediction.special_status}
                        </div>
                    )}
                </div>

                <div onClick={() => setIsExpanded(!isExpanded)} style={{ padding: '10px', textAlign: 'center', cursor: 'pointer', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', borderBottom: '1.5px solid #000000' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>DETAILED FINDINGS (BOXED ONLY)</div>
                    <span style={{ fontSize: '0.75rem', color: '#000000', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                </div>

                {isExpanded && (
                    <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {nlHit && (
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 900, color: '#35a4f4' }}>NL [{nlHit}]:</span>
                                    <span style={{ color: '#334155', fontWeight: 600 }}>{CHILD_BIRTH_RESULT_MAP[nlHit]}</span>
                                </div>
                            )}
                            {slHit && (
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 900, color: '#15803d' }}>SL [{slHit}]:</span>
                                    <span style={{ color: '#334155', fontWeight: 600 }}>{CHILD_BIRTH_RESULT_MAP[slHit]}</span>
                                </div>
                            )}

                            {!nlHit && !slHit && (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    No primary houses are boxed for analysis.
                                </div>
                            )}

                            <div style={{ marginTop: '8px', padding: '10px', background: '#e0f2fe', borderRadius: '8px', fontSize: '0.8rem', color: '#0369a1', fontWeight: 700, border: '1px solid #bae6fd' }}>
                                ! Note: Detailed findings are strictly filtered to showing only the results for the BOXED houses (Hits) as per your rules.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChildAnalysisTable;
