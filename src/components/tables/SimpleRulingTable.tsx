import React from 'react';
import type { Planet, Ascendant } from '../../types/astrology';

interface SimpleRulingTableProps {
    planets: Planet[];
    ascendant: Ascendant;
}

const planetShortNames: Record<string, string> = {
    'Sun': 'SU', 'Moon': 'MO', 'Mars': 'MA', 'Mercury': 'ME', 'Jupiter': 'JU', 
    'Venus': 'VE', 'Saturn': 'SA', 'Rahu': 'RA', 'Ketu': 'KE'
};

const getPlanetShort = (name: string) => {
    const n = (name || '').trim();
    const found = Object.keys(planetShortNames).find(key => 
        n.toLowerCase().startsWith(key.toLowerCase()) || key.toLowerCase().startsWith(n.toLowerCase())
    );
    if (found) return planetShortNames[found];
    return n.substring(0, 2).toUpperCase();
};

const SimpleRulingTable: React.FC<SimpleRulingTableProps> = ({ planets, ascendant }) => {
    const moon = planets.find(p => p.planet?.toLowerCase().includes('moon'));

    const getPlacement = (name: string) => {
        if (!name) return '-';
        const pData = planets.find(p => 
            p.planet?.toLowerCase().startsWith(name.toLowerCase()) || 
            name.toLowerCase().startsWith(p.planet?.toLowerCase() || '')
        );
        return pData?.house_placed || '-';
    };

    const RenderLordItem = ({ label, name }: { label: string, name: string }) => (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 16px', 
            borderBottom: '2px solid #000',
            background: '#fff'
        }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#000' }}>{getPlanetShort(name)}</span>
                <div style={{ 
                    border: '2px solid #000', 
                    borderRadius: '6px', 
                    width: '40px', 
                    height: '40px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: '#3b82f6'
                }}>
                    {getPlacement(name)}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* LAGNA BOX */}
            <div style={{ border: '3px solid #000', borderRadius: '0', overflow: 'hidden', boxShadow: 'none' }}>
                <div style={{ background: '#d4af37', padding: '12px', borderBottom: '3px solid #000', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: '#000', textTransform: 'uppercase', letterSpacing: '1px' }}>LAGNA</h3>
                </div>
                <div style={{ background: '#fff' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        borderBottom: '2px solid #000' 
                    }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>RASHI</span>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: '#000' }}>{ascendant?.sign || '-'}</span>
                    </div>
                    <RenderLordItem label="SIGN LORD" name={ascendant?.sign_lord} />
                    <RenderLordItem label="NAKSHATRA LORD" name={ascendant?.star_lord} />
                    <RenderLordItem label="SUB LORD" name={ascendant?.sub_lord} />
                </div>
            </div>

            {/* MOON BOX */}
            <div style={{ border: '3px solid #000', borderRadius: '0', overflow: 'hidden', boxShadow: 'none' }}>
                <div style={{ background: '#d4af37', padding: '12px', borderBottom: '3px solid #000', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: '#000', textTransform: 'uppercase', letterSpacing: '1px' }}>MOON</h3>
                </div>
                <div style={{ background: '#fff' }}>
                    <RenderLordItem label="SIGN LORD" name={moon?.sign_lord || ''} />
                    <RenderLordItem label="NAKSHATRA LORD" name={moon?.star_lord || ''} />
                    <RenderLordItem label="SUB LORD" name={moon?.sub_lord || ''} />
                </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', fontStyle: 'italic', color: '#64748b', marginTop: '10px' }}>
                * Box indicates the house position of the lord.
            </p>
        </div>
    );
};

export default SimpleRulingTable;
