import type { Planet, Ascendant, House, ChartPlanet } from '../types/astrology';

// ... (imports)

interface SouthIndianChartProps {
    planets: Planet[];
    ascendant: Ascendant;
    houses?: House[]; // Added houses for Bhava Chart
    birthDetails?: any;
    meta?: any;
    chartType?: 'Rashi' | 'Bhava'; // New Prop
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ planets, ascendant, houses, birthDetails, meta, chartType = 'Rashi' }) => {
    // ... (coords)

    const toRoman = (num: number): string => {
        const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        return roman[num] || `${num}`;
    };

    const getPlanetsInSign = (sign: string): ChartPlanet[] => {
        let displayItems: ChartPlanet[] = [];

        // 1. Add Ascendant (Lagna)
        if (ascendant.sign === sign) {
            displayItems.push({ name: "Lagna", isRetro: false, isCusp: true });
        }

        // 2. Add Planets
        // IF BHAVA MODE: We need to see if a planet is in House X.
        // In South Indian Chart, House X maps to a specific Sign based on the Ascendant?
        // NO - Bhava Chalit in South Indian style is tricky.
        // Usually, we just show planets in their SIGNS. 
        // BUT the User explicitly said: "if I click on KP Houses then the new KP planet should come" (shift).
        // So, if chartType is Bhava, we filter planets that are *placed in the House(s)* that start in this Sign?
        // OR we filter planets that are in this *Sign* (Rashi) but annotate them?

        // Let's try the "Visual Shift" approach. 
        // If chartType == Bhava, we iterate through HOUSES that fall in this sign?
        // No, that's getting complicated. 

        // Simpler approach: 
        // If chartType == 'Rashi': Use physical sign (p.sign === sign).
        // If chartType == 'Bhava': 
        //   Find which House Cusp is in this Sign. Let's say House 12 Cusp is in Leo.
        //   Then we show planets that are in House 12 here?
        //   This is conflicting because House 12 might span Leo and Virgo.

        // Let's stick to the User's likely mental model:
        // They want to see Venus in the "12th House Box".
        // In South Indian, the "12th House Box" is relative to the "Ascendant Box".
        // So we need to know the Ascendant Sign.

        if (chartType === 'Bhava') {
            // Logic: Calculate which House looks like it belongs to this Sign relative to Lagna?
            // This relies on the assumption that 1 Sign = 1 House, which is NOT true for Bhava/KP (unequal houses).
            // properly displaying Bhava Chalit on a South Indian grid is non-standard.

            // HYBRID APPROACH:
            // We just show planets where `p.sign === sign` (Physical Sign).
            // BUT we annotate them heavily.
            // AND we can try to "push" them if they are close? 

            // Re-reading user: "Planets should shift... Venus is sitting in 12th house".
            // If Venus is in Virgo (Physical), but 12th House (KP), and 12th House Cusp is Leo.
            // User expects Venus to be in Leo box?

            // Implemenation: Find planets whose `house_placed` corresponds to the House Cusp located in this sign?
            // Too complex.

            // Let's try matching `house_placed` to the signs "Count" from Lagna?
            // e.g. If Lagna is Aries. 12th House is Pisces. 
            // If Venus is in 12th House, show it in Pisces box.

            // Calculate House Number of this Sign relative to Lagna
            // This only works if we assume 1 Sign = 1 House for the GRID mapping.
            const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
            const lagnaIndex = signs.indexOf(ascendant.sign);
            const currentSignIndex = signs.indexOf(sign);

            // Calculate which House Number stands for this box (1-based)
            let virtualHouseNum = (currentSignIndex - lagnaIndex + 12) % 12 + 1;

            // Find planets that are in this House Number
            const pList = planets.filter(p => p.house_placed === virtualHouseNum);
            displayItems.push(...pList.map(p => ({
                name: p.planet ? p.planet.slice(0, 2).toUpperCase() : '??',
                isRetro: p.is_retrograde,
                isCombust: p.is_combust,
                subScript: `${p.house_placed}`,
                color: 'purple' // Highlight that these are Bhava positions
            })));

        } else {
            // RASHI Chart (Standard)
            const pList = planets.filter(p => p.sign === sign);
            displayItems.push(...pList.map(p => ({
                name: p.planet ? p.planet.slice(0, 2).toUpperCase() : '??',
                isRetro: p.is_retrograde,
                isCombust: p.is_combust,
                subScript: undefined
            })));
        }

        // 3. Add House Cusps (Bhava Mode Only)
        if (chartType === 'Bhava' && houses) {
            const cuspsInSign = houses.filter(h => h.sign === sign);
            cuspsInSign.forEach(h => {
                displayItems.push({ name: `${toRoman(h.house_number)}`, isRetro: false, isCusp: true, color: 'blue' });
            });
        }

        return displayItems;
    };

    // ... (rest of render)
    // Update renderItem to handle `subScript` and `isCusp`.

    // Grid coordinates for the signs
    const signCoords: Record<string, { r: number, c: number }> = {
        "Pisces": { r: 0, c: 0 },
        "Aries": { r: 0, c: 1 },
        "Taurus": { r: 0, c: 2 },
        "Gemini": { r: 0, c: 3 },
        "Cancer": { r: 1, c: 3 },
        "Leo": { r: 2, c: 3 },
        "Virgo": { r: 3, c: 3 },
        "Libra": { r: 3, c: 2 },
        "Scorpio": { r: 3, c: 1 },
        "Sagittarius": { r: 3, c: 0 },
        "Capricorn": { r: 2, c: 0 },
        "Aquarius": { r: 1, c: 0 },
    };


    const calculateAge = (dob: string): string => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years}Y ${months}M ${days}D`;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    return (
        <div className="card" style={{ padding: '1rem', background: '#fff' }}>
            <h2 style={{ marginBottom: '1rem', color: '#3b82f6', fontSize: '1.1rem', fontWeight: 800, textAlign: 'center' }}>
                {chartType === 'Rashi' ? 'South Indian Rashi Chart' : 'KP Bhava Chalit Chart'}
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                gap: '2px',
                background: '#e2e8f0',
                border: '1px solid #e2e8f0',
                aspectRatio: '1/1',
                maxWidth: '400px',
                margin: '0 auto'
            }}>
                {Array.from({ length: 16 }).map((_, i) => {
                    const r = Math.floor(i / 4);
                    const c = i % 4;

                    // Middle 4 squares
                    if (r > 0 && r < 3 && c > 0 && c < 3) {
                        if (r === 1 && c === 1) {
                            return (
                                <div key={i} style={{
                                    gridRow: '2 / 4',
                                    gridColumn: '2 / 4',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    fontSize: '0.7rem',
                                    color: '#334155',
                                    padding: '4px',
                                    lineHeight: '1.4'
                                }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '2px' }}>{birthDetails?.name || 'Native'}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                        ({calculateAge(birthDetails?.date_of_birth)})
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: '0.65rem' }}>Bal: {meta?.balance || '--'}</div>
                                    <div style={{ marginTop: '2px' }}>{formatDate(birthDetails?.date_of_birth)} {birthDetails?.time_of_birth}</div>
                                    <div>{birthDetails?.place || 'Unknown'}</div>
                                    <div style={{ marginTop: '4px', fontWeight: 600 }}>{chartType === 'Rashi' ? 'Rashi' : 'KP Lagna'}: {meta?.moonSign}</div>
                                    <div>{meta?.nakshatra} ({meta?.pada})</div>
                                </div>
                            );
                        }
                        return null;
                    }

                    // Find sign for this coordinate
                    const sign = Object.entries(signCoords).find(([_, coord]) => coord.r === r && coord.c === c)?.[0];
                    const signPlanets = sign ? getPlanetsInSign(sign) : [];

                    return (
                        <div key={i} style={{
                            background: '#fff',
                            padding: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            minHeight: '80px'
                        }}>
                            {sign && (
                                <>
                                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>{sign.slice(0, 3).toUpperCase()}</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
                                        {signPlanets.map((p, pi) => (
                                            <span key={pi} style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: p.name === 'Lagna' ? '#0284c7' : '#1e293b',
                                                padding: '1px 2px',
                                                borderRadius: '2px'
                                            }}>
                                                {p.name}
                                                {p.isRetro && <span style={{ color: 'red', marginLeft: '1px' }}>*</span>}
                                                {p.isCombust && <span style={{ color: '#8b5cf6', marginLeft: '1px', fontSize: '0.6rem' }}>(c)</span>}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#64748b', fontWeight: 500, display: 'flex', gap: '15px' }}>
                <span><span style={{ color: 'red' }}>*</span> = Retrograde</span>
                <span><span style={{ color: '#8b5cf6' }}>(c)</span> = Combust</span>
            </div>
        </div>
    );
};

export default SouthIndianChart;
