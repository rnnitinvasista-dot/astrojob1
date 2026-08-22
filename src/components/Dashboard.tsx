import React, { useState } from 'react';
import { 
    Calendar, Moon, Sun, Heart, Briefcase, Leaf, Lightbulb, 
    Compass, Binary, BookOpen, User, Users, ChevronRight, X 
} from 'lucide-react';

interface DashboardProps {
    onSelect: (mode: 'Natal' | 'Prashna' | 'Parashara' | 'BNN' | 'Yearly' | 'Numerology' | 'MatchMaking', id?: string) => void;
    hasKPAccess?: boolean;
    hasBNNAccess?: boolean;
    hasYearlyAccess?: boolean;
    hasNumerologyAccess?: boolean;
    hasMatchmakingAccess?: boolean;
    isAdmin?: boolean;
    username?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    onSelect, hasKPAccess, hasBNNAccess, hasYearlyAccess, 
    hasNumerologyAccess, hasMatchmakingAccess, isAdmin, username
}) => {
    const [showPopup, setShowPopup] = useState(false);

    // Format current date dynamically
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const menuItems = [
        {
            id: 'gns',
            label: 'Birth Chart',
            description: 'Generate your birth chart and explore planetary positions.',
            icon: <User size={24} style={{ color: 'var(--primary)' }} />,
            mode: 'Natal',
            requiresKP: true
        },
        {
            id: 'prashna',
            label: 'Prashana Kundali',
            description: 'Ask any question and receive guidance through astrology.',
            icon: <Compass size={24} style={{ color: 'var(--primary)' }} />,
            mode: 'Prashna',
            requiresKP: true
        },
        {
            id: 'numerology',
            label: 'Numerology',
            description: 'Discover hidden patterns and insights through numbers.',
            icon: <Binary size={24} style={{ color: 'var(--primary)' }} />,
            mode: 'Numerology',
            requiresKP: false
        },
        {
            id: 'yearly',
            label: 'Yearly Prediction',
            description: 'Get a detailed overview of your year ahead.',
            icon: <Calendar size={24} style={{ color: 'var(--primary)' }} />,
            mode: 'Yearly',
            requiresYearly: true
        },
        {
            id: 'bnn',
            label: 'Bhrigu Nandi Nadi',
            description: 'Ancient Nadi astrology with deep karmic insights.',
            icon: <BookOpen size={24} style={{ color: 'var(--primary)' }} />,
            mode: 'BNN',
            requiresBNN: true
        },
        {
            id: 'parashara',
            label: 'Parashara Kundli',
            description: 'Classical Vedic astrology chart calculations.',
            icon: <BookOpen size={24} style={{ color: 'var(--primary)' }} />,
            mode: 'Parashara',
            requiresKP: false
        },
        {
            id: 'matchmaking',
            label: 'Match Making',
            description: 'Evaluate relationship compatibility between charts.',
            icon: <Users size={24} style={{ color: 'var(--primary)' }} />,
            mode: 'MatchMaking',
            requiresKP: false
        }
    ];

    const handleItemClick = (item: any) => {
        if (isAdmin) {
            onSelect(item.mode as any, item.id);
            return;
        }
        
        if (item.requiresKP && !hasKPAccess) {
            setShowPopup(true);
            return;
        }
        if (item.requiresBNN && !hasBNNAccess) {
            setShowPopup(true);
            return;
        }
        if (item.requiresYearly && !hasYearlyAccess) {
            setShowPopup(true);
            return;
        }
        if (item.id === 'numerology' && !hasNumerologyAccess) {
            setShowPopup(true);
            return;
        }
        if (item.id === 'matchmaking' && !hasMatchmakingAccess) {
            setShowPopup(true);
            return;
        }
        onSelect(item.mode as any, item.id);
    };

    return (
        <div style={{
            flex: 1,
            padding: 'calc(env(safe-area-inset-top, 20px) + 2.5rem) 1.5rem 2.5rem',
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            animation: 'fadeIn 0.5s ease-out',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
        }}>
            {/* Header section with Date badge */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        fontWeight: 700,
                        color: 'var(--secondary)',
                        margin: '0 0 0.5rem'
                    }}>
                        Welcome back, {username || 'Star Seeker'} ✨
                    </h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                        margin: 0,
                        fontWeight: 400
                    }}>
                        Explore today's cosmic energies and your personalized insights.
                    </p>
                </div>

                {/* Calendar Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(124, 92, 183, 0.15)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                }}>
                    <Calendar size={18} />
                    <span>{formattedDate} · Full Moon in Capricorn</span>
                </div>
            </div>

            {/* Daily Prediction Highlight Card */}
            <div style={{
                background: 'white',
                border: '1px solid rgba(124, 92, 183, 0.08)',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: 'var(--shadow)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1.2fr',
                gap: '2rem',
                alignItems: 'center'
            }} className="daily-forecast-grid">
                <style>{`
                    @media (max-width: 900px) {
                        .daily-forecast-grid {
                            gridTemplateColumns: 1fr !important;
                            gap: 1.5rem !important;
                            padding: 1.5rem !important;
                        }
                        .daily-forecast-center {
                            display: none !important;
                        }
                    }
                `}</style>
                
                {/* Left Side: Text Forecast */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                        <Sun size={20} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Daily Prediction
                        </span>
                    </div>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--secondary)',
                        margin: 0
                    }}>
                        Your cosmic forecast for today
                    </h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        <p style={{ margin: '0 0 0.5rem' }}>
                            The Full Moon in Capricorn brings clarity to your goals.
                        </p>
                        <p style={{ margin: 0 }}>
                            A day for focus, responsibility, and steady progress.
                        </p>
                    </div>

                    <button 
                        onClick={() => handleItemClick(menuItems[0])}
                        style={{
                            marginTop: '0.75rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 10px rgba(124, 92, 183, 0.15)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                        READ FULL PREDICTION
                    </button>
                </div>

                {/* Middle Side: Moon Icon Graphics */}
                <div className="daily-forecast-center" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    height: '100%',
                    borderLeft: '1px solid rgba(124, 92, 183, 0.08)',
                    borderRight: '1px solid rgba(124, 92, 183, 0.08)'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        border: '1px solid rgba(124, 92, 183, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--primary-light)'
                    }}>
                        <Moon size={36} style={{ color: 'var(--primary)', transform: 'rotate(-20deg)' }} />
                    </div>
                    {/* Tiny orbit rings */}
                    <div style={{
                        position: 'absolute',
                        width: '160px',
                        height: '160px',
                        border: '1px dashed rgba(124, 92, 183, 0.15)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }} />
                </div>

                {/* Right Side: Quadrants List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { icon: <Heart size={18} />, label: 'Love', val: 'Emotional clarity and deeper understanding.' },
                        { icon: <Briefcase size={18} />, label: 'Career', val: 'Stay disciplined—your efforts will be noticed.' },
                        { icon: <Leaf size={18} />, label: 'Health', val: 'Balance your energy and get enough rest.' },
                        { icon: <Lightbulb size={18} />, label: 'Personal Growth', val: 'Trust your intuition and take the next step.' }
                    ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ color: 'var(--primary)', marginTop: '3px' }}>
                                {item.icon}
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>
                                    {item.label}
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                    {item.val}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Explore Tools Grid Section */}
            <div>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: 'var(--secondary)',
                    marginBottom: '1.5rem'
                }}>
                    Explore Astrology Tools
                </h2>

                {/* Cards responsive grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.25rem',
                    width: '100%'
                }}>
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '160px',
                                cursor: 'pointer',
                                transition: 'all 0.25s',
                                boxShadow: 'var(--shadow)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            className="tool-hover-card"
                        >
                            <style>{`
                                .tool-hover-card:hover {
                                    transform: translateY(-2px);
                                    border-color: rgba(124, 92, 183, 0.2);
                                    box-shadow: var(--shadow-lg);
                                }
                            `}</style>
                            
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                {/* Left icon circle */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {item.icon}
                                </div>
                                {/* Right text columns */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: 'var(--secondary)',
                                        margin: 0
                                    }}>
                                        {item.label}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        margin: 0,
                                        lineHeight: 1.45,
                                        fontWeight: 400
                                    }}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* Arrow Indicator */}
                            <div style={{
                                display: 'flex',
                                alignSelf: 'flex-start',
                                marginTop: '1rem',
                                color: 'var(--text-muted)',
                                fontSize: '1rem'
                            }}>
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Access Popup */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        position: 'relative',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid rgba(124, 92, 183, 0.1)'
                    }}>
                        <button 
                            onClick={() => setShowPopup(false)}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#64748b'
                            }}
                        >
                            <X size={20} />
                        </button>
                        
                        <div style={{
                            color: '#ef4444',
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            lineHeight: 1.4,
                            textTransform: 'uppercase',
                            marginTop: '0.5rem'
                        }}>
                            YOU NEED TO PURCHASE THE FULL APP ACCESS
                        </div>
                        
                        <button
                            onClick={() => setShowPopup(false)}
                            style={{
                                marginTop: '1.5rem',
                                padding: '10px 24px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
