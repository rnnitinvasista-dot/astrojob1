import React from 'react';
import type { Planet, Ascendant } from '../../types/astrology';

interface SimpleRulingPlanetsProps {
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

const SimpleRulingPlanets: React.FC<SimpleRulingPlanetsProps> = ({ planets, ascendant }) => {
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
            padding: '14px 16px', 
            borderBottom: '1px solid rgba(124, 92, 183, 0.08)',
            background: '#fff'
        }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)' }}>{getPlanetShort(name)}</span>
                <div style={{ 
                    background: 'var(--primary-light)', 
                    borderRadius: '8px', 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--primary)'
                }}>
                    {getPlacement(name)}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* LAGNA BOX */}
            <div style={{ border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'none' }}>
                <div style={{ background: 'var(--primary)', padding: '12px 16px', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>LAGNA</h3>
                </div>
                <div style={{ background: '#fff' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '14px 16px', 
                        borderBottom: '1px solid rgba(124, 92, 183, 0.08)' 
                    }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>RASHI</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--secondary)' }}>{ascendant?.sign || '-'}</span>
                    </div>
                    <RenderLordItem label="SIGN LORD" name={ascendant?.sign_lord} />
                    <RenderLordItem label="NAKSHATRA LORD" name={ascendant?.star_lord} />
                    <RenderLordItem label="SUB LORD" name={ascendant?.sub_lord} />
                </div>
            </div>

            {/* MOON BOX */}
            <div style={{ border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'none' }}>
                <div style={{ background: 'var(--primary)', padding: '12px 16px', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>MOON</h3>
                </div>
                <div style={{ background: '#fff' }}>
                    <RenderLordItem label="SIGN LORD" name={moon?.sign_lord || ''} />
                    <RenderLordItem label="NAKSHATRA LORD" name={moon?.star_lord || ''} />
                    <RenderLordItem label="SUB LORD" name={moon?.sub_lord || ''} />
                </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                * Box indicates the house position of the lord.
            </p>
        </div>
    );
};

export default SimpleRulingPlanets;
