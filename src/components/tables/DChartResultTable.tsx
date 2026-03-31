import React from 'react';

import PremiumSouthIndianChart from '../charts/PremiumSouthIndianChart';
import { 
    calculateD2Result, calculateD4Result, calculateD6Result, calculateD7Result, 
    calculateD8Result, calculateD10Result, calculateD11Result, calculateD12Result
} from '../../utils/dChartPredictions';
import type { VargaResult } from '../../utils/dChartPredictions';

interface DChartResultTableProps {
    vargaName: string;
    kundliData: any;
    birthDetails: any;
}

const DChartResultTable: React.FC<DChartResultTableProps> = ({ vargaName, kundliData, birthDetails }) => {
    if (!kundliData || !kundliData.varga_charts?.[vargaName]) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                Chart data for {vargaName} not found. Please try refreshing or re-calculating.
            </div>
        );
    }

    const vargaData = kundliData.varga_charts[vargaName];
    const natalPlanets = kundliData.planets;
    
    let results: VargaResult[] = [];
    switch (vargaName) {
        case 'D2': results = calculateD2Result(vargaData.planets, vargaData.ascendant); break;
        case 'D4': results = calculateD4Result(vargaData.planets, vargaData.ascendant, natalPlanets); break;
        case 'D6': results = calculateD6Result(vargaData.planets, vargaData.ascendant, natalPlanets); break;
        case 'D7': results = calculateD7Result(vargaData.planets, vargaData.ascendant, natalPlanets); break;
        case 'D8': results = calculateD8Result(vargaData.planets, vargaData.ascendant, natalPlanets); break;
        case 'D10': results = calculateD10Result(vargaData.planets, vargaData.ascendant, natalPlanets); break;
        case 'D11': results = calculateD11Result(vargaData.planets, vargaData.ascendant, natalPlanets); break;
        case 'D12': results = calculateD12Result(vargaData.planets, vargaData.ascendant, natalPlanets); break;
    }

    const getGradeColor = (grade: string | undefined) => {
        if (!grade) return '#1e293b';
        if (grade.includes('A++') || grade.includes('EXCELLENT') || grade.includes('HIGH')) return '#15803d';
        if (grade.includes('A+') || grade.includes('VERY GOOD') || grade.includes('GOOD')) return '#1d4ed8';
        if (grade.includes('A') || grade.includes('MEDIUM')) return '#b45309';
        return '#dc2626';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <PremiumSouthIndianChart
                planets={kundliData.planets}
                ascendant={kundliData.ascendant}
                vargaCharts={kundliData.varga_charts}
                birthDetails={birthDetails}
                forceVarga={vargaName}
                chartMode="Rashi"
                janmaNakshatra={kundliData.metadata.janma_nakshatra}
                pada={kundliData.metadata.pada}
                rashi={kundliData.planets.find((p: any) => p.planet === 'Moon')?.sign}
            />

            <div className="card" style={{ background: '#fff', padding: '1.25rem', border: '3px solid #000', borderRadius: '0' }}>
                <h3 style={{ 
                    textAlign: 'center', 
                    color: '#8b0000', 
                    fontWeight: 900, 
                    fontSize: '1.3rem', 
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #e2e8f0',
                    paddingBottom: '8px'
                }}>
                    Parashara Results: {vargaName}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {results.map((res, idx) => (
                        <div key={idx} style={{ 
                            background: '#f8fafc', 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            borderLeft: `6px solid ${getGradeColor(res.grade as string)}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>{res.field}</span>
                                {res.grade && (
                                    <span style={{ 
                                        fontWeight: 900, 
                                        color: 'white', 
                                        background: getGradeColor(res.grade as string),
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem'
                                    }}>
                                        {res.grade}
                                    </span>
                                )}
                            </div>
                            
                            {res.planet && (
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                                    Target Planet: <span style={{ color: '#d84315' }}>{res.planet}</span>
                                </div>
                            )}

                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.4' }}>
                                {res.result}
                            </div>

                            {res.grade && (
                                <div style={{ 
                                    marginTop: '8px', 
                                    paddingLeft: '10px', 
                                    borderLeft: '3px solid #e2e8f0', 
                                    fontSize: '0.85rem', 
                                    fontStyle: 'italic',
                                    color: '#64748b',
                                    fontWeight: 600
                                }}>
                                    <span style={{ fontWeight: 800, color: getGradeColor(res.grade as string), marginRight: '4px' }}>Note:</span>
                                    {(() => {
                                        const g = res.grade as string;
                                        if (g.includes('A++') || g.includes('EXCELLENT')) return "Exceptional results. Promises extraordinary success, abundance, and very strong positive energy in this area.";
                                        if (g.includes('A+') || g.includes('VERY GOOD')) return "Highly favorable placement. Indicates significant gains, steady growth, and successful outcomes.";
                                        if (g.includes('A') || g.includes('GOOD')) return "Positive influence. Ensures good progress and consistent results with reasonable effort.";
                                        if (g.includes('B') || g.includes('MEDIUM')) return "Balanced results. Success is possible through consistent effort and a steady approach.";
                                        if (g.includes('C') || g.includes('LOW')) return "Challenging placement. May require extra hard work, patience, or specific remedies to overcome obstacles.";
                                        return "General results based on planetary strength.";
                                    })()}
                                </div>
                            )}

                            {res.points !== undefined && (
                                <div style={{ marginTop: '8px', fontWeight: 700, color: '#1e40af', fontSize: '0.85rem' }}>
                                    Total Calculated Points: {res.points}
                                </div>
                            )}

                            {res.parihara && (
                                <div style={{ marginTop: '10px', background: 'rgba(217, 119, 6, 0.1)', padding: '8px', borderRadius: '6px', border: '1px dashed #d97706' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#b45309', display: 'block', marginBottom: '2px' }}>REMEDY / PARIHARA:</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>{res.parihara}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Grade Key & Summary:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '30px', background: '#15803d', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '10px' }}>A++</span>
                            <span style={{ color: '#15803d' }}>EXCELLENT: Extraordinary strength.</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '30px', background: '#1d4ed8', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '10px' }}>A+</span>
                            <span style={{ color: '#1d4ed8' }}>VERY GOOD: High positive results.</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '30px', background: '#b45309', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '10px' }}>A / B</span>
                            <span style={{ color: '#b45309' }}>GOOD / MEDIUM: Stable, balanced.</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '30px', background: '#dc2626', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '10px' }}>C</span>
                            <span style={{ color: '#dc2626' }}>LOW: Challenging, needs care.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DChartResultTable;
