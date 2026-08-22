import React, { useState } from 'react';
import type { House, Planet } from '../../types/astrology';

interface NPTableProps {
    planets: Planet[];
    houses: House[];
    dasha?: any;
}

const NPTable: React.FC<NPTableProps> = ({ planets, houses, dasha }) => {
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

    const getCurrentDashaAndBukthiLords = (targetDate: Date) => {
        if (!dasha || !dasha.mahadasha_sequence) return { dasha: 'None', bukthi: 'None' };
        const targetTime = targetDate.getTime();
        
        for (const md of dasha.mahadasha_sequence) {
            const start = parseDashaDate(md.start_date);
            const end = parseDashaDate(md.end_date);
            if (targetTime >= start && targetTime <= end) {
                let bukthi = 'None';
                if (md.bukthis && Array.isArray(md.bukthis)) {
                    for (const bk of md.bukthis) {
                        const bStart = parseDashaDate(bk.start_date);
                        const bEnd = parseDashaDate(bk.end_date);
                        if (targetTime >= bStart && targetTime <= bEnd) {
                            bukthi = bk.planet;
                            break;
                        }
                    }
                }
                return { dasha: md.planet, bukthi };
            }
        }
        return { dasha: 'None', bukthi: 'None' };
    };
    // Helper function to normalize planet names for matching
    const isPlanetMatch = (p1: string, p2: string) => {
        if (!p1 || !p2) return false;
        return p1.toLowerCase() === p2.toLowerCase() || 
               p1.toLowerCase().startsWith(p2.toLowerCase()) || 
               p2.toLowerCase().startsWith(p1.toLowerCase());
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
        <div className="card" style={{ 
            background: 'var(--secondary-light)', 
            border: '1px solid rgba(124, 92, 183, 0.08)', 
            borderRadius: '12px',
            marginBottom: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0, color: 'var(--text)', fontWeight: 800 }}>NP Technique</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    
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

            {tableType === 'planets' && (
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
                                const activeLords = getCurrentDashaAndBukthiLords(new Date(transitDate));
                                nlName = activeLords.dasha;
                                slName = activeLords.bukthi;
                            }

                            const pHouses = calculateHousesForPlanet(pName);
                            const nlHouses = calculateHousesForPlanet(nlName);
                            const slHouses = calculateHousesForPlanet(slName);
                            
                            const pDisplay = dataType === 'all' ? Array.from(new Set(pHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(pHouses);
                            const nlDisplay = dataType === 'all' ? Array.from(new Set(nlHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(nlHouses);
                            const slDisplay = dataType === 'all' ? Array.from(new Set(slHouses)).sort((a,b)=>a-b) : calculateCancelledHouses(slHouses);

                            return (
                                <tr key={planet.planet}>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', ...getPlanetHighlight(pName) }}>{pName}</span></div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(pDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', ...getPlanetHighlight(nlName) }}>{nlName || '-'}</span></div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(nlDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', ...getPlanetHighlight(slName) }}>{slName || '-'}</span></div>
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
                                const activeLords = getCurrentDashaAndBukthiLords(new Date(transitDate));
                                nlOfSL = activeLords.dasha;
                                slOfSL = activeLords.bukthi;
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
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', ...getPlanetHighlight(cuspSL) }}>{cuspSL || '-'}</span></div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(cuspSLDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', ...getPlanetHighlight(nlOfSL) }}>{nlOfSL || '-'}</span></div>
                                        <div style={{ color: '#475569', fontSize: '0.85rem' }}>{renderHouses(nlOfSLDisplay)}</div>
                                    </td>
                                    <td style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', ...getPlanetHighlight(slOfSL) }}>{slOfSL || '-'}</span></div>
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

