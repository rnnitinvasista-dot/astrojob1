import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PremiumSouthIndianChart from '../charts/PremiumSouthIndianChart';
import type { House, Planet, Ascendant } from '../../types/astrology';

interface NPTableProps {
    planets: Planet[];
    houses: House[];
    dasha?: any;
    birthDetails?: any;
    metadata?: any;
    ascendant?: Ascendant;
}

const NPTable: React.FC<NPTableProps> = ({ planets, houses, dasha, birthDetails, metadata, ascendant }) => {
    const exportRef = useRef<HTMLDivElement>(null);
    const [exportType, setExportType] = useState<'pdf' | 'image' | null>(null);

    useEffect(() => {
        if (exportType && exportRef.current) {
            setTimeout(async () => {
                try {
                    const canvas = await html2canvas(exportRef.current!, {
                        scale: 2,
                        backgroundColor: '#ffffff',
                        logging: false
                    });
                    
                    if (exportType === 'image') {
                        const link = document.createElement('a');
                        link.download = `${birthDetails?.name || 'Kundali'}_NP_Technique.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    } else {
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF({
                            orientation: 'portrait',
                            unit: 'px',
                            format: [canvas.width, canvas.height]
                        });
                        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                        pdf.save(`${birthDetails?.name || 'Kundali'}_NP_Technique.pdf`);
                    }
                } catch (error) {
                    console.error('Export failed:', error);
                } finally {
                    setExportType(null);
                }
            }, 500);
        }
    }, [exportType, birthDetails]);
    const [tableType, setTableType] = useState<'planets' | 'cusps'>('planets');
    const [dataType, setDataType] = useState<'all' | 'no_result'>('all');

    const [transitDate, setTransitDate] = useState<string>(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    const parseDashaDate = (dateStr: string) => {
        if (!dateStr) return 0;
        const [datePart, timePart] = dateStr.split(' ');
        const [d, m, y] = datePart.split('/');
        const [h, min, s] = (timePart || '00:00:00').split(':');
        return new Date(Number(y), Number(m)-1, Number(d), Number(h), Number(min), Number(s)).getTime();
    };

    const getCurrentActiveLords = (targetDate: Date) => {
        if (!dasha || !dasha.mahadasha_sequence) return { dasha: 'None', bukthi: 'None', antara: 'None' };
        const targetTime = targetDate.getTime();
        
        for (const md of dasha.mahadasha_sequence) {
            const start = parseDashaDate(md.start_date);
            const end = parseDashaDate(md.end_date);
            if (targetTime >= start && targetTime <= end) {
                let bukthi = 'None';
                let antara = 'None';
                if (md.bukthis && Array.isArray(md.bukthis)) {
                    for (const bk of md.bukthis) {
                        const bStart = parseDashaDate(bk.start_date);
                        const bEnd = parseDashaDate(bk.end_date);
                        if (targetTime >= bStart && targetTime <= bEnd) {
                            bukthi = bk.planet;
                            if (bk.antaras && Array.isArray(bk.antaras)) {
                                for (const an of bk.antaras) {
                                    const aStart = parseDashaDate(an.start_date);
                                    const aEnd = parseDashaDate(an.end_date);
                                    if (targetTime >= aStart && targetTime <= aEnd) {
                                        antara = an.planet;
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                return { dasha: md.planet, bukthi, antara };
            }
        }
        return { dasha: 'None', bukthi: 'None', antara: 'None' };
    };

    const isPlanetMatch = (p1: string, p2: string) => {
        if (!p1 || !p2) return false;
        return p1.toLowerCase() === p2.toLowerCase() || 
               p1.toLowerCase().startsWith(p2.toLowerCase()) || 
               p2.toLowerCase().startsWith(p1.toLowerCase());
    };

    const globalActiveLords = getCurrentActiveLords(new Date(transitDate));

    const getPlanetHighlight = (planetName: string) => {
        if (!planetName || planetName === 'None' || planetName === '-') return {};
        const isDasha = isPlanetMatch(planetName, globalActiveLords.dasha);
        const isBukthi = isPlanetMatch(planetName, globalActiveLords.bukthi);
        const isAntara = isPlanetMatch(planetName, globalActiveLords.antara);

        const colors = [];
        if (isDasha) colors.push('rgba(59, 130, 246, 0.25)'); // Light Blue
        if (isBukthi) colors.push('rgba(168, 85, 247, 0.25)'); // Light Purple
        if (isAntara) colors.push('rgba(234, 179, 8, 0.25)'); // Light Yellow

        if (colors.length === 0) return {};
        
        if (colors.length === 1) {
            return { background: colors[0] };
        }
        
        // Gradient for multiple matches
        return { background: `linear-gradient(135deg, ${colors.join(', ')})` };
    };

    // Calculate house numbers for a given planet based on priority logic
    const calculateHousesForPlanet = (planetName: string): number[] => {
        if (!planetName) return [];

        const targetPlanet = planets.find(p => isPlanetMatch(p.planet, planetName));
        if (!targetPlanet) return [];

        // 1. Sub Lord priority: Check if this planet is the Sub Lord of any house cusps
        const slHouses = houses.filter(h => isPlanetMatch(h.sub_lord, planetName)).map(h => h.house_number);
        if (slHouses.length > 0) {
            return slHouses.sort((a, b) => a - b);
        }

        // 2. Nakshatra Lord priority: Check if this planet is the Nakshatra Lord (star_lord) of any house cusps
        const nlHouses = houses.filter(h => isPlanetMatch(h.star_lord, planetName)).map(h => h.house_number);
        if (nlHouses.length > 0) {
            return nlHouses.sort((a, b) => a - b);
        }

        // 3. Planet position fallback: If neither... use only the house in which the planet itself is positioned.
        return [targetPlanet.house_placed].filter(Boolean);
    };

    const calculateCancelledHouses = (housesArray: number[]) => {
        const cancelled = new Set<number>();
        housesArray.forEach(x => {
            if (x !== 1) {
                const twelfth = x === 1 ? 12 : x - 1;
                cancelled.add(twelfth);
                
                const eighth = ((x + 6) % 12) + 1;
                cancelled.add(eighth);
            }
        });
        return Array.from(cancelled).sort((a, b) => a - b);
    };

    const renderHouses = (housesArr: number[]) => {
        if (housesArr.length === 0) return '-';
        return housesArr.map((h, i) => {
            let color = 'inherit';
            if (h === 5 || h === 9) color = '#3b82f6';
            else if (h === 8 || h === 12) color = '#ef4444';
            
            return (
                <React.Fragment key={i}>
                    <span style={{ color, fontWeight: color !== 'inherit' ? 700 : 'inherit' }}>{h}</span>
                    {i < housesArr.length - 1 ? ', ' : ''}
                </React.Fragment>
            );
        });
    };

    // Define the correct order of planets
    const PLANET_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const sortedPlanets = [...planets].sort((a, b) => {
        return PLANET_ORDER.indexOf(a.planet) - PLANET_ORDER.indexOf(b.planet);
    });

    return (
        <div className="card" ref={exportRef} style={{ 
            background: 'var(--secondary-light)', 
            border: '1px solid rgba(124, 92, 183, 0.08)', 
            borderRadius: '12px',
            marginBottom: '1rem',
            padding: exportType ? '2rem' : undefined // Add padding for export
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0, color: 'var(--text)', fontWeight: 800 }}>NP Technique</h2>
                <div style={{ display: exportType ? 'none' : 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            onClick={() => setExportType('image')}
                            disabled={exportType !== null}
                            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            {exportType === 'image' ? 'Exporting...' : 'Export Photo'}
                        </button>
                        <button 
                            onClick={() => setExportType('pdf')}
                            disabled={exportType !== null}
                            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            {exportType === 'pdf' ? 'Exporting...' : 'Export PDF'}
                        </button>
                    </div>
                    
                    {/* Transit Date Picker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Transit Date:</span>
                        <input 
                            type="datetime-local" 
                            value={transitDate}
                            onChange={(e) => setTransitDate(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', background: 'transparent' }}
                        />
                    </div>

                    {/* Table Type Toggle */}
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(124, 92, 183, 0.05)', padding: '4px', borderRadius: '10px' }}>
                        <button 
                            onClick={() => setTableType('planets')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
                                background: tableType === 'planets' ? 'white' : 'transparent',
                                color: tableType === 'planets' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                                boxShadow: tableType === 'planets' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            Planets View
                        </button>
                        <button 
                            onClick={() => setTableType('cusps')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
                                background: tableType === 'cusps' ? 'white' : 'transparent',
                                color: tableType === 'cusps' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                                boxShadow: tableType === 'cusps' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            Cusps View
                        </button>
                    </div>

                    {/* Data Type Toggle */}
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', padding: '4px', borderRadius: '10px' }}>
                        <button 
                            onClick={() => setDataType('all')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
                                background: dataType === 'all' ? 'white' : 'transparent',
                                color: dataType === 'all' ? '#ef4444' : 'var(--text-muted)',
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                                boxShadow: dataType === 'all' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            All Numbers
                        </button>
                        <button 
                            onClick={() => setDataType('no_result')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
                                background: dataType === 'no_result' ? 'white' : 'transparent',
                                color: dataType === 'no_result' ? '#ef4444' : 'var(--text-muted)',
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                                boxShadow: dataType === 'no_result' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            Bad Result
                        </button>
                    </div>
                </div>
            </div>

            {exportType && (
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center', background: 'white', padding: '1rem 2rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '1.5rem' }}>{birthDetails?.name || 'Kundali'}</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: '#475569' }}>
                            <div><strong>Nakshatra:</strong> {metadata?.janma_nakshatra || '-'}</div>
                            <div><strong>Rashi:</strong> {planets.find(p => p.planet === 'Moon')?.sign || '-'}</div>
                        </div>
                    </div>
                    {ascendant && (
                        <div style={{ width: '100%', maxWidth: '500px' }}>
                            <PremiumSouthIndianChart planets={planets} ascendant={ascendant} />
                        </div>
                    )}
                    <h3 style={{ margin: '1rem 0 0 0', alignSelf: 'flex-start' }}>Planets View</h3>
                </div>
            )}
            
            {(tableType === 'planets' || exportType) && (
                <div className="table-container" style={{ border: '1px solid rgba(124, 92, 183, 0.08)' }}>
                <table style={{ fontSize: '0.9rem', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '33%', border: '1px solid #e2e8f0', padding: '12px', color: 'var(--text)', textAlign: 'center' }}>Planet</th>
                            <th style={{ width: '33%', border: '1px solid #e2e8f0', padding: '12px', color: 'var(--text)', textAlign: 'center' }}>Nakshatra Lord</th>
                            <th style={{ width: '33%', border: '1px solid #e2e8f0', padding: '12px', color: 'var(--text)', textAlign: 'center' }}>Sub Lord</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlanets.map((planet) => {
                            const pName = planet.planet;
                            let nlName = planet.star_lord || '';
                            let slName = planet.sub_lord || '';

                            if (isPlanetMatch(pName, 'Moon')) {
                                nlName = globalActiveLords.dasha;
                                slName = globalActiveLords.bukthi;
                            }

                            const pHouses = calculateHousesForPlanet(pName);
                            const nlHouses = calculateHousesForPlanet(nlName);
                            const slHouses = calculateHousesForPlanet(slName);
                            
                            const pDisplay = dataType === 'all' ? Array.from(new Set(pHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(pHouses);
                            const nlDisplay = dataType === 'all' ? Array.from(new Set(nlHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(nlHouses);
                            const slDisplay = dataType === 'all' ? Array.from(new Set(slHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(slHouses);

                            return (
                                <tr key={planet.planet}>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', ...getPlanetHighlight(pName) }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{pName}</div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(pDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', ...getPlanetHighlight(nlName) }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{nlName || '-'}</div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(nlDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', ...getPlanetHighlight(slName) }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{slName || '-'}</div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(slDisplay)}</div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            )}

            {/* Second Table: Cusp Sub Lords */}
            {tableType === 'cusps' && (
            <div className="table-container" style={{ border: '1px solid rgba(124, 92, 183, 0.08)' }}>
                <table style={{ fontSize: '0.9rem', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '10%', border: '1px solid #e2e8f0', padding: '12px', color: 'var(--text)', textAlign: 'center' }}>Cusp</th>
                            <th style={{ width: '30%', border: '1px solid #e2e8f0', padding: '12px', color: 'var(--text)', textAlign: 'center' }}>Sub Lord</th>
                            <th style={{ width: '30%', border: '1px solid #e2e8f0', padding: '12px', color: 'var(--text)', textAlign: 'center' }}>NL of Sub Lord</th>
                            <th style={{ width: '30%', border: '1px solid #e2e8f0', padding: '12px', color: 'var(--text)', textAlign: 'center' }}>SL of Sub Lord</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houses.map((house) => {
                            const cuspSL = house.sub_lord || '';
                            const slPlanet = planets.find(p => isPlanetMatch(p.planet, cuspSL));
                            
                            let nlOfSL = slPlanet ? slPlanet.star_lord || '' : '';
                            let slOfSL = slPlanet ? slPlanet.sub_lord || '' : '';

                            if (isPlanetMatch(cuspSL, 'Moon')) {
                                nlOfSL = globalActiveLords.dasha;
                                slOfSL = globalActiveLords.bukthi;
                            }

                            const cuspSLHouses = calculateHousesForPlanet(cuspSL);
                            const nlOfSLHouses = calculateHousesForPlanet(nlOfSL);
                            const slOfSLHouses = calculateHousesForPlanet(slOfSL);
                            
                            const cuspSLDisplay = dataType === 'all' ? Array.from(new Set(cuspSLHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(cuspSLHouses);
                            const nlOfSLDisplay = dataType === 'all' ? Array.from(new Set(nlOfSLHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(nlOfSLHouses);
                            const slOfSLDisplay = dataType === 'all' ? Array.from(new Set(slOfSLHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(slOfSLHouses);

                            return (
                                <tr key={house.house_number}>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', fontWeight: 800, color: '#1e293b' }}>
                                        {house.house_number}
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', ...getPlanetHighlight(cuspSL) }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{cuspSL || '-'}</div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(cuspSLDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', ...getPlanetHighlight(nlOfSL) }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{nlOfSL || '-'}</div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(nlOfSLDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', ...getPlanetHighlight(slOfSL) }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{slOfSL || '-'}</div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(slOfSLDisplay)}</div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
};

export default NPTable;


