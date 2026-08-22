import React, { useState } from 'react';
import PremiumSouthIndianChart from '../charts/PremiumSouthIndianChart';
import type { MatchMakingResult as ResultType } from '../../utils/matchMakingUtils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MatchMakingResultProps {
    boyDetails: any;
    girlDetails: any;
    boyRes: any;
    girlRes: any;
    result: ResultType;
}

const SectionHeader = ({ children, onClick, isOpen }: { children: React.ReactNode, onClick?: () => void, isOpen?: boolean }) => (
    <div 
        onClick={onClick}
        style={{ 
            background: '#e5e7eb', 
            padding: '12px', 
            textAlign: 'center', 
            color: '#991b1b', 
            fontWeight: 900, 
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '1px',
            borderTop: '1px solid #d1d5db',
            borderBottom: '1px solid #d1d5db',
            cursor: onClick ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        }}
    >
        {children}
        {onClick && (isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
    </div>
);

const MatchMakingResult: React.FC<MatchMakingResultProps> = ({ boyDetails, girlDetails, boyRes, girlRes, result }) => {
    const [showKoota, setShowKoota] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1rem', animation: 'fadeIn 0.5s ease', maxWidth: '100vw', overflowX: 'hidden' }}>
            
            {/* 1. MARRIAGE VERDICT (Top) - Box Style */}
            <div style={{ 
                padding: '1.2rem', 
                background: result.isRecommended ? 'var(--secondary-light)' : '#fff7ed', 
                border: `3px solid #000`, 
                borderTop: `5px solid ${result.isRecommended ? '#059669' : '#f97316'}`,
                borderRadius: '0',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 950, color: result.isRecommended ? '#166534' : '#9a3412', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {result.isRecommended ? "Marriage Recommended ✅" : "Match is High Risk ⚠️"}
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 950, margin: '0.4rem 0' }}>
                    {result.totalPoints}<span style={{ fontSize: '1rem', opacity: 0.6 }}>/36</span>
                </div>
                {result.criticalWarning && (
                    <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: '#fef2f2', border: '1.5px solid #ef4444', borderRadius: '0', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 800 }}>
                        {result.criticalWarning}
                    </div>
                )}
            </div>

            {/* 2. SHOW CALCULATION - Numerology Style Toggle (Below Recommendation) */}
            <div style={{ border: '3px solid #000', borderRadius: '0', background: 'var(--secondary-light)', overflow: 'hidden' }}>
                <SectionHeader onClick={() => setShowKoota(!showKoota)} isOpen={showKoota}>
                    {showKoota ? "Hide Calculation Details" : "Show Calculation (36 Gunas)"}
                </SectionHeader>
                {showKoota && (
                    <div style={{ padding: '0.5rem', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '300px' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ border: '1px solid #e2e8f0', padding: '10px', textAlign: 'left' }}>Koota Factor</th>
                                    <th style={{ border: '1px solid #e2e8f0', padding: '10px' }}>Max</th>
                                    <th style={{ border: '1px solid #e2e8f0', padding: '10px', textAlign: 'right' }}>Gained</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.kootas.map((k, i) => (
                                    <tr key={i} style={{ background: 'white' }}>
                                        <td style={{ padding: '10px', fontWeight: 700, border: '1px solid #e2e8f0' }}>{k.name}</td>
                                        <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>{k.maxPoints}</td>
                                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 900, border: '1px solid #e2e8f0', color: k.gotPoints > 0 ? '#059669' : '#dc2626' }}>{k.gotPoints}</td>
                                    </tr>
                                ))}
                                <tr style={{ background: '#f1f5f9', color: '#000', fontWeight: 950 }}>
                                    <td style={{ padding: '12px', border: '1px solid #000' }}>TOTAL SCORE</td>
                                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #000' }}>36</td>
                                    <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #000', fontSize: '1.2rem' }}>{result.totalPoints}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 3. PLANETARY PLACEMENTS MATCH (Third) - Box style */}
            <div style={{ 
                padding: '1rem 0.5rem',
                borderTop: '5px solid #d4af37',
                background: 'var(--secondary-light)',
                border: '3px solid #000000',
                borderRadius: '0'
            }}>
                <div style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text)', fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>Placements Match</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', minWidth: '400px' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9' }}>
                                <th style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'left' }}>Planet</th>
                                <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>Boy (H/S)</th>
                                <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>Girl (H/S)</th>
                                <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>Match</th>
                                <th style={{ border: '1px solid #e2e8f0', padding: '8px' }}>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.placements.map((p, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                                    <td style={{ fontWeight: '700', border: '1px solid #e2e8f0', padding: '8px', color: '#1e3a8a' }}>{p.planet}</td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>
                                        <span style={{ fontWeight: 800, color: '#000' }}>H{p.boyHouse}</span>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{p.boySign.substring(0, 3)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>
                                        <span style={{ fontWeight: 800, color: '#000' }}>H{p.girlHouse}</span>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{p.girlSign.substring(0, 3)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center', fontWeight: 900, color: '#1e3a8a', fontSize: '0.85rem' }}>
                                        {p.placement1}/{p.placement2}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center', fontWeight: 900,
                                        color: p.rating === 'Bad' ? '#dc2626' : (p.rating === 'Very Good' ? '#059669' : '#0891b2')
                                    }}>
                                        {p.rating}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. DETAILS - Reduced redundant info */}
            <div style={{ 
                padding: '1rem 0.5rem',
                borderTop: '5px solid #d4af37',
                background: 'var(--secondary-light)',
                border: '3px solid #000000',
                borderRadius: '0'
            }}>
                <div style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text)', fontSize: '1rem', fontWeight: 900 }}>Birth Analysis</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <tbody>
                            {[
                                { label: 'RASHI', b: boyRes.planets.find((p:any)=>p.planet.toLowerCase()==='moon')?.sign, g: girlRes.planets.find((p:any)=>p.planet.toLowerCase()==='moon')?.sign },
                                { label: 'NAKSHATRA', b: boyRes.metadata.janma_nakshatra, g: girlRes.metadata.janma_nakshatra },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                                    <td style={{ padding: '10px', fontWeight: 800, color: '#1e3a8a', width: '30%' }}>{row.label}</td>
                                    <td style={{ padding: '10px', width: '35%', textAlign: 'center' }}>{row.b}</td>
                                    <td style={{ padding: '10px', width: '35%', textAlign: 'center' }}>{row.g}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5. VERTICAL KUNDLI CHARTS - Compact Layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{ background: '#1e3a8a', color: 'white', padding: '6px 16px', borderRadius: '0', fontSize: '0.75rem', fontWeight: 800, display: 'inline-block', marginBottom: '0.5rem', border: '2.5px solid #000' }}>
                        Boy: {boyDetails.name || 'Male'}
                    </div>
                    <div style={{ background: 'white', border: '3px solid #000', padding: '4px', borderRadius: '0' }}>
                        <PremiumSouthIndianChart 
                            planets={boyRes.planets} 
                            ascendant={boyRes.ascendant} 
                            vargaCharts={boyRes.varga_charts}
                            chartMode="Rashi"
                            chartStyle="South Indian"
                            janmaNakshatra={boyRes.metadata.janma_nakshatra}
                            pada={boyRes.metadata.pada}
                        />
                    </div>
                </div>
                <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{ background: '#be185d', color: 'white', padding: '6px 16px', borderRadius: '0', fontSize: '0.75rem', fontWeight: 800, display: 'inline-block', marginBottom: '0.5rem', border: '2.5px solid #000' }}>
                        Girl: {girlDetails.name || 'Female'}
                    </div>
                    <div style={{ background: 'white', border: '3px solid #000', padding: '4px', borderRadius: '0' }}>
                        <PremiumSouthIndianChart 
                            planets={girlRes.planets} 
                            ascendant={girlRes.ascendant} 
                            vargaCharts={girlRes.varga_charts}
                            chartMode="Rashi"
                            chartStyle="South Indian"
                            janmaNakshatra={girlRes.metadata.janma_nakshatra}
                            pada={girlRes.metadata.pada}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MatchMakingResult;
