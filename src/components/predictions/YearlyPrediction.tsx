import React, { useState, useMemo, useEffect } from 'react';
import { HIT_NUMBER_DESCRIPTIONS, NN_PLANET_MAP } from '../../utils/yearlyPredictions';
import { Star } from 'lucide-react';

interface YearlyPredictionProps {
    kundliData: any;
    birthDetails: any;
}

const PLANET_ORDER = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
const PLANET_SHORT: Record<string, string> = {
    'SUN': 'Su', 'MOON': 'Mo', 'MARS': 'Ma', 'MERCURY': 'Me', 
    'JUPITER': 'Ju', 'VENUS': 'Ve', 'SATURN': 'Sa', 'RAHU': 'Ra', 'KETU': 'Ke',
    'UNKNOWN': 'Un'
};

const YearlyPrediction: React.FC<YearlyPredictionProps> = ({ kundliData, birthDetails }) => {
    const currentRunningYear = useMemo(() => {
        if (!birthDetails) return new Date().getFullYear();
        const dob = new Date(birthDetails.date_of_birth);
        const now = new Date();
        let year = now.getFullYear();
        if (now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) {
            year -= 1;
        }
        return year;
    }, [birthDetails]);

    const [selectedYear, setSelectedYear] = useState(currentRunningYear);
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        setSelectedYear(currentRunningYear);
    }, [currentRunningYear]);

    const calculateNNPlanet = (day: number, month: number, year: number) => {
        const digits = `${day}${month}${year}`.split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);
        while (sum > 9) {
            sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }
        return {
            number: sum,
            name: NN_PLANET_MAP[sum] || 'UNKNOWN'
        };
    };

    const birthInfo = useMemo(() => {
        if (!birthDetails) return null;
        const dob = new Date(birthDetails.date_of_birth);
        return {
            day: dob.getDate(),
            month: dob.getMonth() + 1,
            birthYear: dob.getFullYear()
        };
    }, [birthDetails]);

    const planetYearMap = useMemo(() => {
        if (!birthInfo) return {};
        const map: Record<string, number[]> = {};
        for (let y = birthInfo.birthYear; y < birthInfo.birthYear + 100; y++) {
            const info = calculateNNPlanet(birthInfo.day, birthInfo.month, y);
            if (!map[info.name]) map[info.name] = [];
            map[info.name].push(y);
        }
        return map;
    }, [birthInfo]);

    const calculation = useMemo(() => {
        if (!birthInfo || !kundliData) return null;

        const { day, month } = birthInfo;
        const nnPlanetInfo = calculateNNPlanet(day, month, selectedYear);
        const nnPlanetName = nnPlanetInfo.name;

        const nnPlanetEntry = kundliData.nakshatra_nadi.find(
            (item: any) => item.planet && (
                item.planet.toUpperCase() === nnPlanetName ||
                item.planet.toUpperCase().startsWith(nnPlanetName.slice(0, 2))
            )
        );

        if (!nnPlanetEntry) return { error: `Planet ${nnPlanetName} not found in chart data.` };

        const starLord = (nnPlanetEntry.star_lord || "UNKNOWN").toUpperCase();
        
        const placedHouse = nnPlanetEntry.nl_signified?.find((h: any) => h.is_placed);
        const hitNumber = placedHouse ? placedHouse.house : (nnPlanetEntry.nl_signified?.[0]?.house || 0);
        
        const highResults = HIT_NUMBER_DESCRIPTIONS[hitNumber] || [];

        const secondaryHouses = nnPlanetEntry.nl_signified?.filter((h: any) => h.house !== hitNumber).map((h: any) => h.house) || [];
        const secondaryResultsGrouped: Record<number, string[]> = {};
        secondaryHouses.forEach((h: number) => {
            if (HIT_NUMBER_DESCRIPTIONS[h]) {
                secondaryResultsGrouped[h] = HIT_NUMBER_DESCRIPTIONS[h];
            }
        });

        const startDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${selectedYear}`;
        const endD = new Date(selectedYear + 1, month - 1, day - 1);
        const endDate = `${endD.getDate().toString().padStart(2, '0')}/${(endD.getMonth() + 1).toString().padStart(2, '0')}/${endD.getFullYear()}`;

        return {
            dateRange: `${startDate} - ${endDate}`,
            nnPlanet: nnPlanetName,
            nakshatraLord: starLord,
            hitNumber,
            highResults,
            secondaryResultsGrouped
        };
    }, [selectedYear, birthInfo, kundliData]);

    const availableYears = useMemo(() => {
        if (!selectedPlanet || !planetYearMap[selectedPlanet]) {
            return Array.from({ length: 100 }, (_, i) => (birthInfo?.birthYear || 1990) + i);
        }
        return planetYearMap[selectedPlanet];
    }, [selectedPlanet, planetYearMap, birthInfo]);

    const handlePlanetClick = (planet: string) => {
        setSelectedPlanet(planet);
        const matchYears = planetYearMap[planet] || [];
        if (matchYears.length > 0) {
            const closest = matchYears.reduce((prev, curr) => 
                Math.abs(curr - selectedYear) < Math.abs(prev - selectedYear) ? curr : prev
            );
            setSelectedYear(closest);
        }
    };

    if (!birthDetails) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please enter birth details first.</div>;

    return (
        <div style={{
            background: '#eceff1',
            padding: '1rem',
            minHeight: '100%',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: '#1a237e'
        }}>
            <div style={{
                display: 'flex',
                background: '#cfd8dc',
                padding: '4px',
                borderRadius: '8px',
                marginBottom: '1rem',
                overflowX: 'auto',
                gap: '4px',
                scrollbarWidth: 'none'
            }}>
                {PLANET_ORDER.map(p => {
                    const short = PLANET_SHORT[p];
                    const isActive = calculation?.nnPlanet === p;
                    return (
                        <button
                            key={p}
                            onClick={() => handlePlanetClick(p)}
                            style={{
                                flex: 1,
                                minWidth: '45px',
                                padding: '8px 4px',
                                borderRadius: '6px',
                                border: 'none',
                                background: isActive ? 'white' : 'transparent',
                                color: isActive ? '#d84315' : '#455a64',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            {short}
                        </button>
                    );
                })}
            </div>

            <div style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                <select 
                    value={selectedYear}
                    onChange={(e) => {
                        const y = parseInt(e.target.value);
                        setSelectedYear(y);
                        const info = calculateNNPlanet(birthInfo!.day, birthInfo!.month, y);
                        setSelectedPlanet(info.name);
                    }}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #90a4ae',
                        background: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#37474f'
                    }}
                >
                    {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {calculation && !('error' in calculation) ? (
                <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    <div style={{ background: '#f5f5f5', borderRadius: '8px', border: '1px solid #d1d1d1', overflow: 'hidden' }}>
                        <div style={{ background: '#e0e0e0', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#8b0000', textTransform: 'uppercase' }}>
                            Prediction for the Year
                        </div>
                        <div style={{ padding: '15px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', background: '#e3f2fd' }}>
                            {calculation.dateRange}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '-5px' }}>
                        <button 
                            onClick={() => setShowDetails(!showDetails)}
                            style={{ 
                                background: 'none', border: 'none', color: '#d84315', 
                                fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {showDetails ? 'Hide Calculation' : 'Show Calculation'}
                        </button>
                    </div>

                    {showDetails && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.3s ease-in-out' }}>
                            <div style={{ background: '#f5f5f5', borderRadius: '8px', border: '1px solid #d1d1d1', overflow: 'hidden' }}>
                                <div style={{ background: '#e0e0e0', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#8b0000', textTransform: 'uppercase' }}>
                                    NN Planet
                                </div>
                                <div style={{ padding: '10px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', background: '#e3f2fd' }}>
                                    {PLANET_SHORT[calculation.nnPlanet]?.toUpperCase() || calculation.nnPlanet.slice(0, 2).toUpperCase()}
                                </div>
                            </div>

                            <div style={{ background: '#f5f5f5', borderRadius: '8px', border: '1px solid #d1d1d1', overflow: 'hidden' }}>
                                <div style={{ background: '#e0e0e0', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#8b0000', textTransform: 'uppercase' }}>
                                    Nakshatra Lord of the Planet
                                </div>
                                <div style={{ padding: '10px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', background: '#e3f2fd' }}>
                                    {PLANET_SHORT[calculation.nakshatraLord]?.toUpperCase() || calculation.nakshatraLord.slice(0, 2).toUpperCase()}
                                </div>
                            </div>

                            <div style={{ background: '#f5f5f5', borderRadius: '8px', border: '1px solid #d1d1d1', overflow: 'hidden' }}>
                                <div style={{ background: '#e0e0e0', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#8b0000', textTransform: 'uppercase' }}>
                                    Nakshatra Lord Hit Number
                                </div>
                                <div style={{ padding: '10px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', background: '#e3f2fd' }}>
                                    {calculation.hitNumber}
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #ef9a9a', padding: '1.5rem 1rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#b71c1c', textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #ffcdd2', paddingBottom: '8px', textTransform: 'uppercase' }}>
                            High Result (House {calculation.hitNumber}):
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {(calculation.highResults as string[]).map((res, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#2e7d32', fontWeight: 700, fontSize: '1rem' }}>
                                    <Star size={20} fill="#2e7d32" color="#2e7d32" />
                                    <span>{res}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {calculation.secondaryResultsGrouped && Object.keys(calculation.secondaryResultsGrouped).length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {Object.entries(calculation.secondaryResultsGrouped).map(([house, results]: [string, any]) => (
                                <div key={house} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cfd8dc', padding: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#37474f', marginBottom: '1rem', borderBottom: '1px solid #eceff1', paddingBottom: '6px' }}>
                                        Secondary Result (House {house}):
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {results.map((res: string, i: number) => (
                                            <div key={i} style={{ fontSize: '0.95rem', color: '#546e7a', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                <span style={{ color: '#ff9800', marginTop: '2px' }}>★</span>
                                                <span>{res}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : calculation && 'error' in calculation ? (
                <div style={{ textAlign: 'center', color: '#b91c1c', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>Data Missing</div>
                    {calculation.error}
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.7 }}>
                        Planets in chart: {kundliData?.nakshatra_nadi.map((n:any) => n.planet).join(', ')}
                    </div>
                </div>
            ) : null}

            <div style={{ textAlign: 'center', padding: '2rem 1rem', opacity: 0.5, fontSize: '0.75rem' }}>
                KP Astrology Precision • Yearly NN
            </div>
        </div>
    );
};

export default YearlyPrediction;
