import React from 'react';
import { Moon, Star } from 'lucide-react';

interface LandingPageProps {
    onExploreSign: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onExploreSign }) => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Soft Radial Ambient Glow */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(124, 92, 183, 0.08) 0%, rgba(250, 248, 245, 0) 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Header Navigation */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(124, 92, 183, 0.08)',
                zIndex: 10,
                position: 'relative',
                background: 'rgba(253, 251, 249, 0.8)',
                backdropFilter: 'blur(8px)'
            }}>
                {/* Brand Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                }} onClick={onExploreSign}>
                    <Moon size={22} style={{ color: 'var(--primary)', transform: 'rotate(-25deg)' }} />
                    <span style={{
                        fontFamily: "'Cinzel', 'Playfair Display', serif, Georgia",
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        color: 'var(--secondary)'
                    }}>
                        JYOTISH
                    </span>
                </div>

                {/* Right side kept blank */}
                <div />
            </header>

            {/* Hero Main Content */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '4rem 1.5rem 2rem',
                zIndex: 1,
                position: 'relative',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {/* Main Heading */}
                <h1 style={{
                    fontFamily: "'Cinzel', 'Playfair Display', serif, Georgia",
                    fontSize: 'clamp(2.2rem, 5vw + 1.2rem, 4rem)',
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: 'var(--secondary)',
                    letterSpacing: '0.02em',
                    marginBottom: '2rem',
                    marginTop: '1.5rem'
                }}>
                    READ THE <br />
                    <span style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: 'var(--primary)',
                        position: 'relative'
                    }}>
                        LANGUAGE
                    </span> <br />
                    OF THE STARS
                </h1>

                {/* Subtitle description */}
                <p style={{
                    fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.15rem)',
                    color: 'var(--text-muted)',
                    maxWidth: '550px',
                    lineHeight: 1.65,
                    fontWeight: 400,
                    marginBottom: '3rem'
                }}>
                    Ancient wisdom decoded for the modern seeker. Daily horoscopes, birth charts, planetary transits, and the celestial forces shaping your path.
                </p>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    alignItems: 'center',
                    marginBottom: '4rem'
                }}>
                    <button
                        onClick={onExploreSign}
                        style={{
                            padding: '1rem 2.5rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 14px rgba(124, 92, 183, 0.25)',
                            transition: 'all 0.2s',
                            textTransform: 'uppercase'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 92, 183, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 92, 183, 0.25)';
                        }}
                    >
                        EXPLORE YOUR SIGN
                    </button>
                </div>

                {/* Celestial orbits illustration (Rings with moon and stars) */}
                <div style={{
                    position: 'relative',
                    width: '220px',
                    height: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    <style>{`
                        @keyframes orbit-slow {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                    {/* Outer Orbit */}
                    <div style={{
                        position: 'absolute',
                        width: '200px',
                        height: '200px',
                        border: '1px dashed rgba(124, 92, 183, 0.15)',
                        borderRadius: '50%',
                        animation: 'orbit-slow 40s linear infinite'
                    }}>
                        <Star size={10} style={{ color: 'var(--primary)', position: 'absolute', top: '10px', left: '50px', opacity: 0.5 }} />
                        <Star size={8} style={{ color: 'var(--primary)', position: 'absolute', bottom: '15px', right: '40px', opacity: 0.3 }} />
                    </div>

                    {/* Middle Orbit */}
                    <div style={{
                        position: 'absolute',
                        width: '140px',
                        height: '140px',
                        border: '1px solid rgba(124, 92, 183, 0.1)',
                        borderRadius: '50%',
                        animation: 'orbit-slow 25s linear infinite reverse'
                    }}>
                        <Star size={6} style={{ color: 'var(--accent)', position: 'absolute', top: '30px', right: '10px', opacity: 0.6 }} />
                    </div>

                    {/* Inner Orbit */}
                    <div style={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        border: '1.5px solid rgba(124, 92, 183, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Moon size={24} style={{ color: 'var(--primary)', transform: 'rotate(-20deg)' }} />
                    </div>
                </div>
            </main>

        </div>
    );
};

export default LandingPage;
