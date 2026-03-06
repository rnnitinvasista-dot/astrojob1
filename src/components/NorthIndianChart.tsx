import React from 'react';

interface PlanetInfo {
    planet: string;
    sign: string;
    house_placed: number;
    is_retrograde?: boolean;
    is_combust?: boolean;
}

interface AstroChartProps {
    planets: PlanetInfo[];
    ascendantSign: string;
}

const NorthIndianChart: React.FC<AstroChartProps> = ({ planets, ascendantSign }) => {
    // Map of house number to planets in that house
    const housePlanets: Record<number, string[]> = {};
    planets.forEach(p => {
        if (!housePlanets[p.house_placed]) housePlanets[p.house_placed] = [];
        let label = p.planet.substring(0, 2);
        if (p.is_retrograde) label += '(R)';
        if (p.is_combust) label += '(C)';
        housePlanets[p.house_placed].push(label);
    });

    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const ascIdx = signs.indexOf(ascendantSign);

    const getSignForHouse = (houseNum: number) => {
        if (ascIdx === -1) return '';
        return (ascIdx + houseNum - 1) % 12 + 1; // Display sign number 1-12
    };

    return (
        <div className="chart-container" style={{ width: '100%', maxWidth: '400px', margin: '2rem auto' }}>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: 'auto', background: '#fff' }}>
                {/* Outer Box */}
                <rect x="0" y="0" width="300" height="300" fill="none" stroke="#6EB5FF" strokeWidth="2" />

                {/* Diagonals */}
                <line x1="0" y1="0" x2="300" y2="300" stroke="#6EB5FF" strokeWidth="1" />
                <line x1="300" y1="0" x2="0" y2="300" stroke="#6EB5FF" strokeWidth="1" />

                {/* Inner Diamond */}
                <line x1="150" y1="0" x2="300" y2="150" stroke="#6EB5FF" strokeWidth="1" />
                <line x1="300" y1="150" x2="150" y2="300" stroke="#6EB5FF" strokeWidth="1" />
                <line x1="150" y1="300" x2="0" y2="150" stroke="#6EB5FF" strokeWidth="1" />
                <line x1="0" y1="150" x2="150" y2="0" stroke="#6EB5FF" strokeWidth="1" />

                {/* House Content */}
                {/* House 1 (Top Center Diamond) */}
                <text x="150" y="140" textAnchor="middle" fontSize="12" fill="#1e293b" fontWeight="bold">
                    {housePlanets[1]?.join(', ') || ''}
                </text>
                <text x="150" y="155" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(1)}</text>

                {/* House 2 (Top Left Triangle) */}
                <text x="75" y="65" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[2]?.join(', ') || ''}
                </text>
                <text x="75" y="80" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(2)}</text>

                {/* House 3 (Left Top Triangle) */}
                <text x="40" y="100" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[3]?.join(', ') || ''}
                </text>
                <text x="40" y="115" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(3)}</text>

                {/* House 4 (Left center Diamond) */}
                <text x="100" y="150" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[4]?.join(', ') || ''}
                </text>
                <text x="100" y="165" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(4)}</text>

                {/* House 5 (Left Bottom Triangle) */}
                <text x="40" y="200" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[5]?.join(', ') || ''}
                </text>
                <text x="40" y="215" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(5)}</text>

                {/* House 6 (Bottom Left Triangle) */}
                <text x="75" y="235" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[6]?.join(', ') || ''}
                </text>
                <text x="75" y="250" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(6)}</text>

                {/* House 7 (Bottom Center Diamond) */}
                <text x="150" y="180" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[7]?.join(', ') || ''}
                </text>
                <text x="150" y="195" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(7)}</text>

                {/* House 8 (Bottom Right Triangle) */}
                <text x="225" y="235" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[8]?.join(', ') || ''}
                </text>
                <text x="225" y="250" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(8)}</text>

                {/* House 9 (Right Bottom Triangle) */}
                <text x="260" y="200" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[9]?.join(', ') || ''}
                </text>
                <text x="260" y="215" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(9)}</text>

                {/* House 10 (Right Center Diamond) */}
                <text x="200" y="150" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[10]?.join(', ') || ''}
                </text>
                <text x="200" y="165" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(10)}</text>

                {/* House 11 (Right Top Triangle) */}
                <text x="260" y="100" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[11]?.join(', ') || ''}
                </text>
                <text x="260" y="115" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(11)}</text>

                {/* House 12 (Top Right Triangle) */}
                <text x="225" y="65" textAnchor="middle" fontSize="11" fill="#1e293b">
                    {housePlanets[12]?.join(', ') || ''}
                </text>
                <text x="225" y="80" textAnchor="middle" fontSize="8" fill="#64748b">{getSignForHouse(12)}</text>

            </svg>
        </div>
    );
};

export default NorthIndianChart;
