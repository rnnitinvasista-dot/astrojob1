import React, { useState, useEffect, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';
import { getApiUrl } from '../../services/api';
import type { Planet, Ascendant, BirthDetails } from '../../types/astrology';
import { calculateKPLevels } from '../../utils/astrologyUtils';

interface RulingPlanetsTableProps {
    birthPlanets: Planet[];
    birthAscendant: Ascendant;
    birthDetails: BirthDetails;
    ayanamsa?: string;
    showCurrentTime?: boolean;
    isFinderMode?: boolean; 
    onUpdateDetails?: (newDate: string, newTime: string) => void;
}

const planetShortNames: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me', 'Jupiter': 'Ju', 
    'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke', 'Lagna': 'La'
};

const getPlanetShort = (name: string) => {
    const n = (name || '').trim();
    if (n === 'Ascendant' || n === 'Lagna') return 'La';
    const found = Object.keys(planetShortNames).find(key => 
        n.toLowerCase().startsWith(key.toLowerCase()) || key.toLowerCase().startsWith(n.toLowerCase())
    );
    if (found) return planetShortNames[found];
    return n.substring(0, 2);
};

interface TimeState { y: string; m: string; d: string; h: string; min: string; s: string; }

const RulingPlanetsTable: React.FC<RulingPlanetsTableProps> = ({ 
    birthPlanets, birthAscendant, birthDetails, ayanamsa = 'KP', showCurrentTime = true, isFinderMode = false,
    onUpdateDetails
}) => {
    const getInitialSegments = (date: string, time: string): TimeState => {
        const [y, m, d] = date.split('-');
        const [h, min, s] = time.split(':');
        return { y: y || '2026', m: m || '01', d: d || '01', h: h || '00', min: min || '00', s: s || '00' };
    };

    const [curSeg, setCurSeg] = useState<TimeState>(() => getInitialSegments(new Date().toISOString().split('T')[0], new Date().toTimeString().split(' ')[0]));
    const [btSeg, setBtSeg] = useState<TimeState>(() => getInitialSegments(birthDetails.date_of_birth, birthDetails.time_of_birth));
    
    const [currentData, setCurrentData] = useState<{ planets: Planet[], ascendant: Ascendant } | null>(null);
    const [btData, setBtData] = useState<{ planets: Planet[], ascendant: Ascendant }>({
        planets: birthPlanets, ascendant: birthAscendant
    });

    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(false);
    const lastPropsBirth = useRef(birthDetails.date_of_birth + birthDetails.time_of_birth);

    // Sync only when person changes explicitly
    useEffect(() => {
        const currentPropKey = birthDetails.date_of_birth + birthDetails.time_of_birth;
        if (lastPropsBirth.current !== currentPropKey) {
            setBtSeg(getInitialSegments(birthDetails.date_of_birth, birthDetails.time_of_birth));
            setBtData({ planets: birthPlanets, ascendant: birthAscendant });
            lastPropsBirth.current = currentPropKey;
        }
    }, [birthDetails, birthPlanets, birthAscendant]);

    const fetchRulingPlanets = async (s: TimeState, isCurrent: boolean, useLocation = false) => {
        if (loading && !isLive) return;
        setLoading(true);
        try {
            let lat = birthDetails.latitude;
            let lon = birthDetails.longitude;
            const dateStr = `${s.y}-${s.m.padStart(2, '0')}-${s.d.padStart(2, '0')}`;
            const timeStr = `${s.h.padStart(2, '0')}:${s.min.padStart(2, '0')}:${s.s.padStart(2, '0')}`;

            if (useLocation && isCurrent) {
                try {
                    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
                    lat = pos.coords.latitude; lon = pos.coords.longitude;
                } catch (e) {}
            }

            const response = await axios.post(`${getApiUrl()}/kundli`, {
                birth_details: {
                    date_of_birth: dateStr, time_of_birth: timeStr, timezone: "Asia/Kolkata",
                    latitude: lat, longitude: lon, place: (isCurrent && useLocation) ? "Current Location" : birthDetails.place
                },
                calculation_settings: { ayanamsa, house_system: "Placidus", node_type: "Mean" }
            });

            if (response.data.status === 'success') {
                const newData = { planets: response.data.planets, ascendant: response.data.ascendant };
                if (isCurrent) setCurrentData(newData); else setBtData(newData);
            }
        } catch (err) {} finally { setLoading(false); }
    };

    // Live clock
    useEffect(() => {
        if (!isLive) return;
        const interval = setInterval(() => {
            const now = new Date();
            const y = now.getFullYear().toString();
            const m = (now.getMonth() + 1).toString().padStart(2, '0');
            const d = now.getDate().toString().padStart(2, '0');
            const [h, min, s] = now.toTimeString().split(' ')[0].split(':');
            setCurSeg({ y, m, d, h, min, s });
        }, 1000);
        return () => clearInterval(interval);
    }, [isLive]);

    // Data trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRulingPlanets(curSeg, true);
        }, isLive ? 3000 : 1000); // 1s throttle so user can finish typing
        return () => clearTimeout(timer);
    }, [curSeg.y, curSeg.m, curSeg.d, curSeg.h, curSeg.min, curSeg.s]);

    const dmsToDecimal = (dms: string): number | undefined => {
        if (!dms) return undefined;
        const parts = dms.split(/[°'"]/);
        if (parts.length < 3) return undefined;
        return parseFloat(parts[0]) + parseFloat(parts[1]) / 60 + parseFloat(parts[2]) / 3600;
    };

    const renderTable = (planets: Planet[], ascendant: any, isCurrent: boolean) => {
        const moon = planets.find(p => p.planet?.toLowerCase().includes('moon'));
        const enrich = (item: any) => {
            if (!item || (!item.degree_decimal && !item.degree_dms)) return null;
            const deg = item.degree_decimal || dmsToDecimal(item.degree_dms) || 0;
            const levels = calculateKPLevels(deg);
            return {
                ...item,
                sign_lord: item.sign_lord || levels.sign_lord,
                star_lord: item.star_lord || levels.star_lord,
                sub_lord: item.sub_lord || levels.sub_lord,
                sub_sub_lord: item.sub_sub_lord || levels.sub_sub_lord,
                sub_sub_sub_lord: item.sub_sub_sub_lord || levels.sub_sub_sub_lord
            };
        };

        const enrichedAsc = enrich(ascendant);
        const enrichedMoon = enrich(moon);
        const s = isCurrent ? curSeg : btSeg;
        const setS = isCurrent ? setCurSeg : setBtSeg;
        
        const rows = [ 
            { label: 'Lagna', data: enrichedAsc },
            { label: `Moon [${moon?.house_placed || '-'}]`, data: enrichedMoon }
        ];

        const updateSeg = (part: keyof TimeState, val: string) => {
            const cleaned = val.replace(/[^0-9]/g, '');
            setS(prev => ({ ...prev, [part]: cleaned }));
            if (isCurrent) setIsLive(false);
        };

        return (
            <div style={{ marginBottom: isFinderMode ? '1.5rem' : '2rem', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h3 style={{ fontWeight: 900, fontSize: '1rem', color: isFinderMode ? '#000' : '#d4af37', textTransform: 'uppercase', margin: 0 }}>
                            {isCurrent ? "1. CURRENT RULING PLANETS" : "2. BIRTH TIME RULING PLANETS"}
                        </h3>
                        {isCurrent && isLive && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ef4444' }}>LIVE</span>
                            </div>
                        )}
                    </div>
                    {/* Date Segment */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '3px solid #000', borderRadius: '4px', padding: '0 10px', height: '52px' }}>
                        <input type="text" inputMode="numeric" value={s.d} onChange={(e) => updateSeg('d', e.target.value)} onFocus={(e) => e.target.select()} style={{ width: '48px', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#000', outline: 'none', padding: 0 }} placeholder="DD" />
                        <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>/</span>
                        <input type="text" inputMode="numeric" value={s.m} onChange={(e) => updateSeg('m', e.target.value)} onFocus={(e) => e.target.select()} style={{ width: '48px', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#000', outline: 'none', padding: 0 }} placeholder="MM" />
                        <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>/</span>
                        <input type="text" inputMode="numeric" value={s.y} onChange={(e) => updateSeg('y', e.target.value)} onFocus={(e) => e.target.select()} style={{ width: '84px', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#000', outline: 'none', padding: 0 }} placeholder="YYYY" />
                    </div>
                    {/* Time Segment */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '3px solid #000', borderRadius: '4px', padding: '0 10px', height: '52px' }}>
                        <input type="text" inputMode="numeric" value={s.h} onChange={(e) => updateSeg('h', e.target.value)} onFocus={(e) => e.target.select()} style={{ width: '48px', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#000', outline: 'none', padding: 0 }} placeholder="HH" />
                        <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>:</span>
                        <input type="text" inputMode="numeric" value={s.min} onChange={(e) => updateSeg('min', e.target.value)} onFocus={(e) => e.target.select()} style={{ width: '48px', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#000', outline: 'none', padding: 0 }} placeholder="MM" />
                        <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>:</span>
                        <input type="text" inputMode="numeric" value={s.s} onChange={(e) => updateSeg('s', e.target.value)} onFocus={(e) => e.target.select()} style={{ width: '48px', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#000', outline: 'none', padding: 0 }} placeholder="SS" />
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => {
                            if (isCurrent) {
                                const n = new Date();
                                const seg = {
                                    y: n.getFullYear().toString(), m: (n.getMonth()+1).toString().padStart(2,'0'), d: n.getDate().toString().padStart(2,'0'),
                                    h: n.getHours().toString().padStart(2,'0'), min: n.getMinutes().toString().padStart(2,'0'), s: n.getSeconds().toString().padStart(2,'0')
                                };
                                setCurSeg(seg); fetchRulingPlanets(seg, true, true);
                            } else { 
                                // NEW: Notify app of changed birth time
                                if (onUpdateDetails) {
                                    const dateStr = `${btSeg.y}-${btSeg.m.padStart(2, '0')}-${btSeg.d.padStart(2, '0')}`;
                                    const timeStr = `${btSeg.h.padStart(2, '0')}:${btSeg.min.padStart(2, '0')}:${btSeg.s.padStart(2, '0')}`;
                                    onUpdateDetails(dateStr, timeStr);
                                }
                                fetchRulingPlanets(btSeg, false); 
                            }
                        }} style={{ padding: '0 16px', background: '#d4af37', border: '2px solid #000', borderRadius: '4px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', height: '46px' }}>{isCurrent ? 'NOW' : 'FETCH'}</button>
                        {isCurrent && <button onClick={() => setIsLive(!isLive)} style={{ padding: '0 16px', background: isLive ? '#ef4444' : '#10b981', color: '#fff', border: '2px solid #000', borderRadius: '4px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', height: '46px' }}>{isLive ? 'STOP' : 'LIVE'}</button>}
                    </div>
                </div>
                <div style={{ border: '3px solid #000', overflow: 'hidden', boxShadow: 'none', width: '100%', overflowX: 'auto', background: '#fff' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                            <tr style={{ background: '#f97316' }}>
                                {['Planets', 'Rashi L', 'StL', 'SbL', 'SSL', 'SSSL'].map(h => (
                                    <th key={h} style={{ padding: '12px 4px', color: '#000', fontWeight: 900, fontSize: '0.85rem', border: '1px solid #000' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => {
                                const renderLord = (name: string) => {
                                    if (!name) return '-';
                                    const short = getPlanetShort(name);
                                    const pData = planets.find(p => 
                                        p.planet?.toLowerCase().startsWith(name.toLowerCase()) || 
                                        name.toLowerCase().startsWith(p.planet?.toLowerCase() || '')
                                    );
                                    return pData?.house_placed ? `${short} [${pData.house_placed}]` : short;
                                };

                                return (
                                    <tr key={row.label} style={{ background: '#fff' }}>
                                        <td style={{ padding: '12px 10px', border: '1px solid #000', fontWeight: 900, fontSize: '0.9rem', textAlign: 'left' }}>{row.label}</td>
                                        <td style={{ padding: '12px 4px', border: '1px solid #000', fontWeight: 800 }}>{renderLord(row.data?.sign_lord || '')}</td>
                                        <td style={{ padding: '12px 4px', border: '1px solid #000', fontWeight: 800 }}>{renderLord(row.data?.star_lord || '')}</td>
                                        <td style={{ padding: '12px 4px', border: '1px solid #000', fontWeight: 800 }}>{renderLord(row.data?.sub_lord || '')}</td>
                                        <td style={{ padding: '12px 4px', border: '1px solid #000', fontWeight: 800 }}>{renderLord(row.data?.sub_sub_lord || '')}</td>
                                        <td style={{ padding: '12px 4px', border: '1px solid #000', fontWeight: 800 }}>{renderLord(row.data?.sub_sub_sub_lord || '')}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '12px' }}>
            {showCurrentTime && renderTable(currentData?.planets || [], currentData?.ascendant || {} as Ascendant, true)}
            <div style={{ height: showCurrentTime ? '1.5rem' : '0' }}></div>
            {renderTable(btData.planets, btData.ascendant, false)}
            {loading && <div style={{ textAlign: 'center', padding: '12px', fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 'bold' }}>Updating...</div>}
        </div>
    );
};

export default RulingPlanetsTable;
