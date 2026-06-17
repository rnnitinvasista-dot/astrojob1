import React, { useState, useEffect } from 'react';
import { 
    calculateD2Result, calculateD4Result, calculateD5Result, calculateD6Result, 
    calculateD7Result, calculateD8Result, calculateD9Result, calculateD10Result, 
    calculateD11Result, calculateD12Result, calculateD1Result, type VargaResult 
} from '../../utils/dChartPredictions';

interface DChartResultTableProps {
    vargaName: string;
    kundliData: any;
}

const DChartResultTable: React.FC<DChartResultTableProps> = ({ vargaName, kundliData }) => {
    const [results, setResults] = useState<VargaResult[]>([]);

    if (!kundliData || !kundliData.varga_charts || !kundliData.varga_charts[vargaName]) {
        return null;
    }

    const vargaData = kundliData.varga_charts[vargaName];
    const natalLagna = kundliData.varga_charts?.["D1"]?.ascendant?.sign || kundliData.ascendant?.sign || 'Aries';

    useEffect(() => {
        let houseResults: VargaResult[] = [];
        switch (vargaName) {
            case 'D1': houseResults = calculateD1Result(vargaData.planets, vargaData.ascendant); break;
            case 'D2': houseResults = calculateD2Result(vargaData.planets, vargaData.ascendant); break;
            case 'D4': houseResults = calculateD4Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D5': houseResults = calculateD5Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D6': houseResults = calculateD6Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D7': houseResults = calculateD7Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D8': houseResults = calculateD8Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D9': houseResults = calculateD9Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D10': houseResults = calculateD10Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D11': houseResults = calculateD11Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
            case 'D12': houseResults = calculateD12Result(vargaData.planets, vargaData.ascendant, natalLagna); break;
        }
        setResults(houseResults);
    }, [vargaName, vargaData, natalLagna]);

    const getGradeColor = (grade: string | undefined) => {
        if (!grade) return '#1e293b';
        if (grade === 'A+' || grade === 'A++') return '#16a34a'; // Green
        if (grade === 'A') return '#b45309'; // Gold
        if (grade === 'B') return '#1e40af'; // Blue
        if (grade === 'C') return '#dc2626'; // Red
        return '#64748b';
    };

    const getShortPlanet = (longName: string | undefined) => {
        if (!longName) return '-';
        const map: Record<string, string> = {
            'Sun': 'SU', 'Moon': 'MO', 'Mars': 'MA', 'Mercury': 'ME', 
            'Jupiter': 'JU', 'Venus': 'VE', 'Saturn': 'SA', 'Rahu': 'RA', 'Ketu': 'KE'
        };
        return map[longName] || longName;
    };

    const hasGrades = results.some((r: any) => r.grade);
    const isParticulars = ['D8', 'D10'].includes(vargaName);
    const is5Col = ['D1', 'D2', 'D4', 'D7', 'D12'].includes(vargaName);

    const getPlanetHouse = (fallbackPlanet: string | undefined) => {
        const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const pName = fallbackPlanet || 'Sun';
        const pV = vargaData.planets.find((p: any) => p.planet === pName);
        if (!pV) return '1';
        
        const pIdx = signs.findIndex(s => s.toLowerCase() === pV.sign.toLowerCase().trim());
        const aIdx = signs.findIndex(s => s.toLowerCase() === vargaData.ascendant.sign.toLowerCase().trim());
        if (pIdx === -1 || aIdx === -1) return '1';
        return ((pIdx - aIdx + 12) % 12 + 1).toString();
    };

    return (
        <div className="mt-8 mb-12" style={{ width: '100%', maxWidth: '100%', minWidth: '0', overflow: 'hidden' }}>
            <h3 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', color: '#000', textTransform: 'uppercase' }}>
                {vargaName === 'D1' ? 'LAGNA CHART' : (vargaName === 'D2' ? 'HORA' : vargaName)} RESULT:
            </h3>
            <div style={{ background: '#fff', padding: '0.25rem', border: '3px solid #000', borderRadius: '8px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '100%', overflow: 'hidden' }}>
                {/* Desktop View (Hidden on Mobile) */}
                <div className="desktop-only overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch', width: '100%', display: 'block', paddingBottom: '12px', minWidth: '0' }}>
                    <table style={{ 
                        width: '100%', 
                        minWidth: is5Col ? '650px' : '400px', 
                        borderCollapse: 'collapse', 
                        fontFamily: 'system-ui, sans-serif'
                    }}>
                        <thead>
                            <tr style={{ background: '#CFAE5D', borderBottom: '2px solid #000' }}>
                                <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', fontSize: '10px' }}>
                                    {isParticulars ? 'PARTICULARS' : 'HOUSE / PLANET'}
                                </th>
                                {is5Col && <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 900, color: '#fff', fontSize: '10px' }}>FIELD / HORA</th>}
                                <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: 900, color: '#fff', fontSize: '10px' }}>
                                    {is5Col ? 'POSITION' : (vargaName === 'D2' ? 'HORA' : 'PLANET')}
                                </th>
                                {hasGrades && <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: 900, color: '#fff', fontSize: '10px' }}>GRADE</th>}
                                <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 900, color: '#fff', fontSize: '10px' }}>RESULT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((res: any, i: number) => {
                                const isSplit = res.field.includes('::');
                                const [label, field] = isSplit ? res.field.split('::') : [res.field, ''];
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                        <td style={{ padding: '8px 4px', fontWeight: 700, color: '#000', textTransform: 'uppercase', fontSize: '10px' }}>{label}</td>
                                        {is5Col && <td style={{ padding: '8px 4px', fontWeight: 700, color: '#64748b', fontSize: '9px' }}>{field}</td>}
                                        <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 700, color: '#1e40af', fontSize: '10px' }}>
                                            {is5Col ? ( (vargaName === 'D2' && res.planet !== 'TOTAL') ? getShortPlanet(res.planet) : (res.planet === 'TOTAL' ? '-' : getPlanetHouse(res.planet)) ) : getShortPlanet(res.planet)}
                                        </td>
                                        {hasGrades && (
                                            <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                                                <span style={{ 
                                                    fontWeight: 900, 
                                                    color: getGradeColor(res.grade),
                                                    fontSize: '10px'
                                                }}>
                                                    {res.grade || '-'}
                                                </span>
                                            </td>
                                        )}
                                        <td style={{ padding: '8px 4px', lineHeight: '1.4', color: getGradeColor(res.grade), fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', minWidth: '200px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                            {res.result}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Friendly Vertical View (Visible on Mobile) */}
                <div className="mobile-only" style={{ padding: '4px' }}>
                    {results.map((res: any, i: number) => {
                        const isSplit = res.field.includes('::');
                        const [label, field] = isSplit ? res.field.split('::') : [res.field, ''];
                        const position = is5Col ? ( (vargaName === 'D2' && res.planet !== 'TOTAL') ? getShortPlanet(res.planet) : (res.planet === 'TOTAL' ? '-' : getPlanetHouse(res.planet)) ) : getShortPlanet(res.planet);
                        
                        return (
                            <div key={i} style={{ 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '6px', 
                                marginBottom: '10px', 
                                overflow: 'hidden',
                                background: i % 2 === 0 ? '#fff' : '#f8fafc'
                            }}>
                                <div style={{ background: '#CFAE5D', color: '#fff', padding: '6px 8px', fontSize: '11px', fontWeight: 900, display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{label}</span>
                                    {res.grade && <span style={{ background: '#fff', color: getGradeColor(res.grade), padding: '0 4px', borderRadius: '3px' }}>{res.grade}</span>}
                                </div>
                                <div style={{ padding: '8px', fontSize: '10px' }}>
                                    {field && <div style={{ marginBottom: '4px' }}><span style={{ color: '#64748b' }}>FIELD:</span> <span style={{ fontWeight: 700 }}>{field}</span></div>}
                                    <div style={{ marginBottom: '6px' }}><span style={{ color: '#64748b' }}>{is5Col ? 'POSITION' : 'PLANET'}:</span> <span style={{ fontWeight: 700, color: '#1e40af' }}>{position}</span></div>
                                    <div style={{ color: getGradeColor(res.grade), fontWeight: 900, lineHeight: '1.4', borderTop: '1px solid #eee', paddingTop: '6px' }}>
                                        {res.result}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {hasGrades && vargaName !== 'D2' && (
                    <div style={{ 
                        marginTop: '0.75rem', 
                        paddingTop: '0.4rem', 
                        borderTop: '1px solid #eee',
                        textAlign: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '9px', fontWeight: 900, justifyContent: 'center', flexWrap: 'wrap', textTransform: 'uppercase' }}>
                            <span style={{ color: '#16a34a' }}>A++ EXCELLENT</span>
                            <span style={{ color: '#2563eb' }}>A+ VERY GOOD</span>
                            <span style={{ color: '#b45309' }}>A GOOD</span>
                            <span style={{ color: '#1e40af' }}>B MEDIUM</span>
                            <span style={{ color: '#dc2626' }}>C LOW</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DChartResultTable;
