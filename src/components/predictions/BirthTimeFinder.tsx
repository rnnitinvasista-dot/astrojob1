import React from 'react';
import RulingPlanetsTable from '../tables/RulingPlanetsTable';
import HouseTable from '../tables/HouseTable';
import NakshatraNadiTable from '../tables/NakshatraNadiTable';
import DashaTable from '../tables/DashaTable';
import PlanetaryPowerTable from './PlanetaryPowerTable';
import type { Planet, Ascendant, House, NakshatraNadiItem, BirthDetails } from '../../types/astrology';

interface BirthTimeFinderProps {
    planets: Planet[];
    ascendant: Ascendant;
    houses: House[];
    nakshatraNadi: NakshatraNadiItem[];
    dasha: any;
    birthDetails: BirthDetails;
    ayanamsa?: string;
}

const BirthTimeFinder: React.FC<BirthTimeFinderProps> = ({
    planets, ascendant, houses, nakshatraNadi, dasha, birthDetails, ayanamsa
}) => {
    // Style override to remove shadows and add black borders
    const finderCardStyle: React.CSSProperties = {
        background: 'var(--secondary-light)',
        border: '3px solid #000',
        borderRadius: '0',
        boxShadow: 'none', // Removed shadow per audio
        overflow: 'hidden',
        marginBottom: '2rem',
        padding: '8px'
    };

    const sectionTitleStyle: React.CSSProperties = {
        textAlign: 'center',
        background: '#d4af37',
        padding: '10px',
        border: '2px solid #000',
        fontWeight: 900,
        fontSize: '1rem',
        marginBottom: '1rem',
        textTransform: 'uppercase'
    };

    return (
        <div style={{ padding: '8px', maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', borderRadius: '0', border: '3px solid #000', boxShadow: 'none', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', margin: 0, color: '#d4af37' }}>Birth Time Finder</h1>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.9, marginTop: '8px' }}>KP PRECISION RECTIFICATION</p>
            </div>

            {/* 1. Ruling Planets - Top */}
            <div style={finderCardStyle}>
                 <RulingPlanetsTable 
                    birthPlanets={planets} 
                    birthAscendant={ascendant} 
                    birthDetails={birthDetails} 
                    ayanamsa={ayanamsa} 
                    showCurrentTime={true} 
                    isFinderMode={true} // Add this prop for no-shadow/border box 
                />
            </div>

            {/* 2. Power Position Table - (Strength table with colors) */}
            <PlanetaryPowerTable data={nakshatraNadi} planets={planets} />

            {/* 3. House Significance */}
            <div style={finderCardStyle}>
                <h2 style={sectionTitleStyle}>House Significators</h2>
                <HouseTable houses={houses} planets={planets} isFinderMode={true} />
            </div>

            {/* 4. Vimshottari Dasha */}
            <div style={finderCardStyle}>
                <h2 style={sectionTitleStyle}>Vimshottari Dasha</h2>
                <DashaTable dasha={dasha} isFinderMode={true} />
            </div>

            {/* 5. KP Combination - Last */}
            <div style={{ ...finderCardStyle, marginBottom: '5rem' }}>
                <NakshatraNadiTable data={nakshatraNadi} isFinderMode={true} />
            </div>
        </div>
    );
};

export default BirthTimeFinder;
