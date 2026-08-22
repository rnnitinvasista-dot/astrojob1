import React from 'react';
import { 
  calculateBirthNumber, 
  calculateDestinyNumber, 
  calculateSoulNumber, 
  generateLoshuGrid, 
  analyzeArrows, 
  calculateCurrentYearNumber,
  generateSoulNumberPyramid,
  analyzeYinYang,
  getCombinationLuckyInfo,
  getMahurthamDates,
  checkMobileRules,
  checkVehicleRules
} from '../../utils/numerologyUtils';
import { 
  NUMBER_MEANINGS, 
  PERSONAL_YEAR_PREDICTIONS,
  GRID_CELL_MEANINGS,
  ABSENCE_MEANINGS,
  MAHURTHAM_PROCEDURES,
  VEHICLE_REG_RULES,
  MONTHLY_LUCKY_DATES,
  ECONOMIC_PROSPERITY_YEARS,
  DAY_SPECIFIC_PREDICTIONS
} from '../../utils/numerologyData';
import { ArrowLeft, AlertCircle, Phone, Truck } from 'lucide-react';

interface NumerologyReportProps {
    data: { name: string; dob: string; phone: string; vehicleNumber: string };
    onBack: () => void;
}

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <div style={{ 
        background: '#e5e7eb', 
        padding: '10px', 
        textAlign: 'center', 
        color: '#991b1b', 
        fontWeight: 900, 
        textTransform: 'uppercase',
        fontSize: '0.9rem',
        letterSpacing: '1px',
        borderTop: '1px solid #d1d5db',
        borderBottom: '1px solid #d1d5db'
    }}>
        {children}
    </div>
);

const InfoCard = ({ children, noPadding = false, style = {} }: { children: React.ReactNode, noPadding?: boolean, style?: React.CSSProperties }) => (
    <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '4px', 
        margin: '15px 10px', 
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '3px solid #000000',
        ...style
    }}>
        <div style={{ padding: noPadding ? '0' : '15px' }}>
            {children}
        </div>
    </div>
);

const MahurthamCard = ({ title, dates, procedure, color, icon: Icon, rules }: { title: string, dates: number[], procedure?: string, color: string, icon?: any, rules?: string }) => (
    <div style={{
        background: '#ffffff',
        border: '3px solid #000000',
        marginBottom: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
        <div style={{ 
            background: color, 
            padding: '10px 12px', 
            borderBottom: '2.5px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <h3 style={{ margin: 0, color: '#000000', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {Icon && <Icon size={16} />} {title}
            </h3>
        </div>
        
        <div style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', marginBottom: '8px', textTransform: 'uppercase', opacity: 0.7 }}>FAVORABLE DATES</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '12px' }}>
                {dates.length > 0 ? (
                    dates.sort((a,b) => a-b).map((date, idx) => (
                        <div key={idx} style={{
                            background: '#f8fafc',
                            border: '1.5px solid #000000',
                            borderRadius: '4px',
                            padding: '4px 0',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: '#1e3a8a'
                        }}>
                            {date}
                        </div>
                    ))
                ) : (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', gridColumn: 'span 5' }}>No specific dates indicated for this birth number.</div>
                )}
            </div>

            {rules && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', marginBottom: '6px', textTransform: 'uppercase' }}>REGISTRATION RULES</div>
                    <div style={{ background: '#fef2f2', border: '1.5px solid #ef4444', borderRadius: '4px', padding: '8px', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 700 }}>
                        {rules}
                    </div>
                </div>
            )}

            {procedure && (
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', marginBottom: '6px', textTransform: 'uppercase' }}>WHAT TO DO / PROCEDURE</div>
                    <div style={{ background: '#f0fdf4', border: '1.5px solid #22c55e', borderRadius: '4px', padding: '10px', fontSize: '0.85rem', color: '#166534', fontWeight: 600, lineHeight: '1.4' }}>
                        {procedure}
                    </div>
                </div>
            )}
        </div>
    </div>
);

const NumerologyReport: React.FC<NumerologyReportProps> = ({ data, onBack }) => {
    const { name, dob, phone, vehicleNumber } = data;
    
    // Core Calculations
    const birthNum = calculateBirthNumber(dob);
    const birthDayOnly = parseInt(dob.split('-')[2]);
    const destinyNum = calculateDestinyNumber(dob);
    const soulNum = calculateSoulNumber(name, dob);
    const curYearData = calculateCurrentYearNumber(dob);
    
    // Combination-based Lucky Info
    const comboA = getCombinationLuckyInfo(birthNum, soulNum);
    const comboB = getCombinationLuckyInfo(destinyNum, soulNum);

    const luckyNumbers = Array.from(new Set([...comboA.numbers, ...comboB.numbers])).sort((a,b) => a-b);
    const bestLuckyNumbers = comboA.numbers.filter(n => comboB.numbers.includes(n));

    const luckyColours = Array.from(new Set([...comboA.colors.map(c => c.trim()), ...comboB.colors.map(c => c.trim())]));
    const bestLuckyColours = comboA.colors.map(c => c.trim()).filter(c => comboB.colors.map(cb => cb.trim()).includes(c));

    const yinYang = analyzeYinYang(dob);
    const grid = generateLoshuGrid(dob);
    const analyzedArrows = analyzeArrows(grid);
    const pyramid = generateSoulNumberPyramid(dob);
    
    const birthInfo = NUMBER_MEANINGS[birthNum];
    const gridLayout = [4, 9, 2, 3, 5, 7, 8, 1, 6];

    // Mahurthams
    const landDates = getMahurthamDates('landWorship', birthDayOnly);
    const vehicleDates = getMahurthamDates('vehiclePurchase', birthDayOnly);
    const houseOwnDates = getMahurthamDates('houseWarmingOwn', birthDayOnly);
    const houseRentDates = getMahurthamDates('houseWarmingRent', birthDayOnly);
    const marriageDates = getMahurthamDates('marriage', birthDayOnly);

    // Validations
    const phoneIssues = checkMobileRules(phone);
    const vehicleIssues = checkVehicleRules(vehicleNumber);

    // Colors for present/absent
    const presentColor = '#059669'; // Green
    const absentColor = '#dc2626';  // Red

    return (
        <div style={{ 
            background: 'url("https://www.transparenttextures.com/patterns/old-wall.png"), #fdf5e6', 
            minHeight: '100vh', 
            paddingBottom: '50px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Header */}
            <div style={{ padding: '15px', color: '#3e2723', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <ArrowLeft onClick={onBack} size={24} style={{ position: 'absolute', left: '15px', cursor: 'pointer' }} />
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>Detailed Analysis</h2>
            </div>

            <div style={{ padding: '5px' }}></div>

            {/* 1. Profile Table */}
            <InfoCard noPadding>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', tableLayout: 'fixed' }}>
                    <thead>
                        <tr style={{ color: '#3e2723', fontSize: '0.65rem', fontWeight: 900, background: '#f5d142' }}>
                            <th style={{ padding: '12px 4px', borderRight: '2px solid #000' }}>BIRTH<br/><span style={{fontWeight: 600, fontSize: '0.55rem', display: 'block', marginTop: '2px'}}>(Persons characteristics)</span></th>
                            <th style={{ padding: '12px 4px', borderRight: '2px solid #000' }}>DESTINY<br/><span style={{fontWeight: 600, fontSize: '0.55rem', display: 'block', marginTop: '2px'}}>(Adopted traits)</span></th>
                            <th style={{ padding: '12px 4px' }}>SOUL<br/>NUMBER</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000', borderTop: '2px solid #000' }}>
                            <td style={{ padding: '12px', borderRight: '2px solid #000' }}>{birthNum}</td>
                            <td style={{ padding: '12px', borderRight: '2px solid #000' }}>{destinyNum}</td>
                            <td style={{ padding: '12px' }}>{soulNum}</td>
                        </tr>
                    </tbody>
                </table>
            </InfoCard>

            <InfoCard noPadding>
                <SectionHeader>LUCKY NUMBERS</SectionHeader>
                <div style={{ padding: '15px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>
                    {luckyNumbers.join(', ')}
                </div>
                
                {bestLuckyNumbers.length > 0 && (
                  <>
                    <SectionHeader>BEST LUCKY NUMBERS</SectionHeader>
                    <div style={{ padding: '15px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>
                        {bestLuckyNumbers.join(', ')}
                    </div>
                  </>
                )}

                <SectionHeader>LUCKY DATES IN A MONTH</SectionHeader>
                <div style={{ padding: '15px', textAlign: 'center', fontSize: '1rem', fontWeight: 800, color: '#1e40af' }}>
                    {MONTHLY_LUCKY_DATES[birthNum]?.join(', ') || 'N/A'}
                </div>

                <SectionHeader>ECONOMIC PROSPERITY YEARS</SectionHeader>
                <div style={{ padding: '15px', textAlign: 'center', fontSize: '1rem', fontWeight: 800, color: '#854d0e' }}>
                    {ECONOMIC_PROSPERITY_YEARS[birthNum]?.join(', ') || 'N/A'}
                </div>

                <SectionHeader>LUCKY COLOURS</SectionHeader>
                <div style={{ padding: '15px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#000' }}>
                    {luckyColours.join(', ')}
                </div>

                {bestLuckyColours.length > 0 && (
                  <>
                    <SectionHeader>BEST LUCKY COLOURS</SectionHeader>
                    <div style={{ padding: '15px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 900, color: '#059669' }}>
                        {bestLuckyColours.join(', ')}
                    </div>
                  </>
                )}
            </InfoCard>

            {/* Mahurthams Section */}
            <div style={{ padding: '0 10px' }}>
                <SectionHeader>FAVORABLE DATES (MAHURTHAMS)</SectionHeader>
                <div style={{ marginTop: '15px' }}>
                    <MahurthamCard 
                        title="Land Worship"
                        dates={landDates}
                        color="#a2d5c6"
                        procedure={MAHURTHAM_PROCEDURES[birthNum]?.land}
                    />
                    <MahurthamCard 
                        title="Vehicle Purchase"
                        icon={Truck}
                        dates={vehicleDates}
                        color="#ffd8d1"
                        rules={VEHICLE_REG_RULES[birthNum] ? `Avoid Digits: ${VEHICLE_REG_RULES[birthNum].avoid.join(', ')} | Recommended Sum: ${VEHICLE_REG_RULES[birthNum].targetSum.join(' or ')}` : undefined}
                    />
                    <MahurthamCard 
                        title="House-Warming (Own)"
                        dates={houseOwnDates}
                        color="#e9d5ff"
                        procedure={MAHURTHAM_PROCEDURES[birthNum]?.house}
                    />
                    <MahurthamCard 
                        title="House-Warming (Rent)"
                        dates={houseRentDates}
                        color="#FFD700"
                        procedure={MAHURTHAM_PROCEDURES[birthNum]?.house}
                    />
                    <MahurthamCard 
                        title="Marriage Dates"
                        dates={marriageDates}
                        color="#fde68a"
                    />
                </div>
            </div>

            {/* Current Year Prediction */}
            <InfoCard noPadding>
                <SectionHeader>EXPLORING PERSONAL YEARS</SectionHeader>
                <div style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 800, color: '#991b1b', marginBottom: '10px', textAlign: 'center', fontSize: '1rem' }}>
                         Personal Year: {curYearData.value} ({curYearData.runningYear})
                    </div>
                    <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '10px', borderRadius: '4px', marginBottom: '10px', fontWeight: 600, borderLeft: '4px solid #1e3a8a' }}>
                        Calculation: {curYearData.breakdown}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6', fontWeight: 500 }}>
                        {PERSONAL_YEAR_PREDICTIONS[curYearData.value]}
                    </div>
                </div>
            </InfoCard>

            {/* Mobile & Vehicle Analysis */}
            {(phoneIssues.length > 0 || vehicleIssues.length > 0 || phone || vehicleNumber) && (
                <InfoCard noPadding>
                    <SectionHeader>MOBILE & VEHICLE ANALYSIS</SectionHeader>
                    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                         {phone && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: 800, marginBottom: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px' }}>
                                    <Phone size={16} /> MOBILE: {phone}
                                </div>
                                {phoneIssues.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {phoneIssues.map((issue, idx) => (
                                            <div key={idx} style={{ color: '#dc2626', fontSize: '0.8rem', display: 'flex', gap: '6px', fontWeight: 600 }}>
                                                <AlertCircle size={14} style={{ flexShrink: 0 }} /> {issue}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>Excellent number! No issues found.</div>
                                )}
                            </div>
                         )}

                         {vehicleNumber && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: 800, marginBottom: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px' }}>
                                    <Truck size={16} /> VEHICLE: {vehicleNumber}
                                </div>
                                {vehicleIssues.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {vehicleIssues.map((issue, idx) => (
                                            <div key={idx} style={{ color: '#dc2626', fontSize: '0.8rem', display: 'flex', gap: '6px', fontWeight: 600 }}>
                                                <AlertCircle size={14} style={{ flexShrink: 0 }} /> {issue}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>Good vehicle number choice.</div>
                                )}
                            </div>
                         )}
                    </div>
                </InfoCard>
            )}

            {/* Date Pyramid */}
            <InfoCard noPadding>
                <SectionHeader>DATE PYRAMID</SectionHeader>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '8px' }}>
                    {pyramid.map((row, i) => (
                        <div key={i} style={{ display: 'flex', gap: '15px', fontSize: '1rem', fontWeight: 700, color: '#333', fontFamily: 'monospace' }}>
                            {row.map((d, j) => <span key={j}>{d}</span>)}
                        </div>
                    ))}
                </div>
            </InfoCard>

            {/* Lo Shu Grid */}
            <InfoCard noPadding>
                <SectionHeader>LO SHU GRID</SectionHeader>
                <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '300px', margin: '0 auto' }}>
                    {gridLayout.map(num => (
                        <div key={num} style={{ 
                            aspectRatio: '1/1', 
                            borderRadius: '50%', 
                            border: `2px solid ${grid[num] ? presentColor : '#e5e7eb'}`,
                            background: grid[num] ? 'white' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: grid[num] ? '#1e3a8a' : 'transparent',
                            boxShadow: grid[num] ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                        }}>
                            {grid[num] ? num : ''}
                        </div>
                    ))}
                </div>
            </InfoCard>

            {/* Present Birth Numbers */}
            <InfoCard noPadding>
                <SectionHeader>PRESENT BIRTH NUMBER</SectionHeader>
                <div style={{ padding: '0 15px' }}>
                    {Object.keys(grid).sort().map(num => (
                        <div key={num} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ fontWeight: 800, width: '30px', flexShrink: 0, color: '#1e3a8a' }}>{num}</div>
                            <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.4' }}>{GRID_CELL_MEANINGS[parseInt(num)]}</div>
                        </div>
                    ))}
                </div>
            </InfoCard>

            {/* Missing Birth Numbers */}
            <InfoCard noPadding>
                <SectionHeader>MISSING BIRTH NUMBER</SectionHeader>
                <div style={{ padding: '0 15px' }}>
                    {[1,2,3,4,5,6,7,8,9].filter(n => !grid[n]).map(num => (
                        <div key={num} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ fontWeight: 800, width: '30px', flexShrink: 0, color: '#b91c1c' }}>{num}.</div>
                            <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.4' }}>{ABSENCE_MEANINGS[num]}</div>
                        </div>
                    ))}
                </div>
            </InfoCard>

            {/* Arrows of Strength */}
            {analyzedArrows.filter(a => a.type === 'Strength').length > 0 && (
                <InfoCard noPadding>
                    <SectionHeader>ARROW OF STRENGTH</SectionHeader>
                    <div style={{ padding: '0 15px' }}>
                        {analyzedArrows.filter(a => a.type === 'Strength').map(arrow => (
                            <div key={arrow.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#333' }}>{arrow.name}:</div>
                                <div style={{ color: presentColor, fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase' }}>Present</div>
                            </div>
                        ))}
                    </div>
                </InfoCard>
            )}

            {/* Arrows of Weakness */}
            {analyzedArrows.filter(a => a.type === 'Weakness').length > 0 && (
                <InfoCard noPadding>
                    <SectionHeader>ARROW OF WEAKNESS</SectionHeader>
                    <div style={{ padding: '0 15px' }}>
                        {analyzedArrows.filter(a => a.type === 'Weakness').map(arrow => (
                            <div key={arrow.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#333' }}>{arrow.name}:</div>
                                <div style={{ color: absentColor, fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase' }}>Present</div>
                            </div>
                        ))}
                    </div>
                </InfoCard>
            )}

            {/* Yin and Yang */}
            <InfoCard noPadding>
                <SectionHeader>YIN AND YANG</SectionHeader>
                <div style={{ padding: '15px', textAlign: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#1e3a8a' }}>
                    PERSON LIFE: {yinYang.summary}
                    <div style={{ marginTop: '5px', color: '#444', fontWeight: 600 }}>
                        Yin: {yinYang.yinPercent}% | Yang: {yinYang.yangPercent}%
                    </div>
                </div>
            </InfoCard>

            {/* Character Traits */}
            <InfoCard noPadding>
                <SectionHeader>CHARACTER TRAITS</SectionHeader>
                <div style={{ padding: '15px' }}>
                    <ul style={{ 
                        margin: 0, 
                        padding: '0 0 0 15px', 
                        fontSize: '0.9rem', 
                        color: '#1e293b', 
                        lineHeight: '1.6', 
                        fontWeight: 600,
                        listStyleType: 'disc'
                    }}>
                        {/* Day-specific prediction first */}
                        <li style={{ color: '#3e2723', fontStyle: 'italic', marginBottom: '8px' }}>
                            <strong>Day {birthDayOnly} Special:</strong> {DAY_SPECIFIC_PREDICTIONS[birthDayOnly] || ''}
                        </li>
                        {/* General Number Traits */}
                        {birthInfo.traits.split(/[.?;]/).filter(t => t.trim().length > 10).map((trait, idx) => (
                            <li key={idx} style={{ marginBottom: '8px' }}>
                                {trait.trim()}.
                            </li>
                        ))}
                    </ul>
                </div>
            </InfoCard>

        </div>
    );
};

export default NumerologyReport;
