import React from 'react';
import type { Planet } from '../../types/astrology';

export interface BNNGroupedPlanets {
    NORTH: Planet[];
    EAST: Planet[];
    SOUTH: Planet[];
    WEST: Planet[];
}

interface BNNCrossChartProps {
    groupedPlanets: BNNGroupedPlanets;
}

const getPlanetColor = (planetName: string) => {
    const colorsUpper: Record<string, string> = {
        "SU": "#dc2626", // Red
        "MO": "#2563eb", // Blue
        "MA": "#b91c1c", // Dark Red
        "ME": "#15803d", // Green
        "JU": "#d97706", // Orange/Yellow
        "VE": "#db2777", // Pink
        "SA": "#000000", // Black
        "RA": "#4a044e", // Dark Purple
        "KE": "#5b21b6", // Violet
    };
    return colorsUpper[planetName.slice(0, 2).toUpperCase()] || "#1e293b";
};

const BNNCrossChart: React.FC<BNNCrossChartProps> = ({ groupedPlanets }) => {
    const renderBox = (title: string, planets: Planet[], gridArea: string) => (
        <div style={{
            gridArea,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ea580c', // Orange border as requested by general theme
            background: 'var(--secondary-light)',
            padding: '5px',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '-20px', fontSize: '0.8rem', fontWeight: 'bold', color: '#ea580c', textTransform: 'uppercase' }}>
                {title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {planets.map((p, i) => (
                    <span key={i} style={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        color: getPlanetColor(p.planet)
                    }}>
                        {p.planet.slice(0, 2).toUpperCase()} {p.is_retrograde && '(R)'}
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            background: 'var(--secondary-light)'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 120px 120px',
                gridTemplateRows: '120px 120px 120px',
                gap: '0px',
                justifyContent: 'center'
            }}>
                {/* Center empty space */}
                <div style={{ gridArea: '2 / 2 / 3 / 3', background: '#e2e8f0', opacity: 0.5 }}></div>
                
                {renderBox('NORTH', groupedPlanets.NORTH, '1 / 2 / 2 / 3')}
                {renderBox('WEST', groupedPlanets.WEST, '2 / 1 / 3 / 2')}
                {renderBox('EAST', groupedPlanets.EAST, '2 / 3 / 3 / 4')}
                {renderBox('SOUTH', groupedPlanets.SOUTH, '3 / 2 / 4 / 3')}
            </div>
        </div>
    );
};

export default BNNCrossChart;
