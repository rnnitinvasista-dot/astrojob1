import React from 'react';
import { Clock, ArrowLeft, Menu, LogOut, Moon, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    showTabs: boolean;
    onBack: () => void;
    isAdmin?: boolean;
    expiryDate?: string;
    onLogout: () => void;
    currentView: string;
    chartMode?: 'Rashi' | 'Bhava';
    chartStyle?: 'South Indian' | 'North Indian';
    onChartStyleChange?: (style: 'South Indian' | 'North Indian') => void;
    title?: string;
    onAdminToggle?: () => void;
    mode?: string;
    onNavigate?: (view: string, mode?: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
    children, activeTab, onTabChange, showTabs, onBack, 
    isAdmin, expiryDate, onLogout, currentView, chartMode, 
    chartStyle: _chartStyle, onChartStyleChange: _onChartStyleChange, 
    title, onAdminToggle, mode, onNavigate 
}) => {
    const { userData } = useAuth();
    const [showMenu, setShowMenu] = React.useState(false);

    // Access flags
    const hasPowerPositionAccess = isAdmin || userData?.hasPowerPositionAccess;

    const getDaysRemaining = () => {
        if (!expiryDate) return null;
        const diff = new Date(expiryDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const days = getDaysRemaining();

    const navItems = [
        { label: 'DASHBOARD', view: 'dashboard' },
        { label: 'BIRTH CHART', view: 'form', mode: 'Natal' },
        { label: 'PRASHANA KUNDALI', view: 'form', mode: 'Prashna' },
        { label: 'NUMEROLOGY', view: 'numerologyForm' },
        { label: 'YEARLY PREDICTION', view: 'form', mode: 'Yearly' },
        { label: 'BHRIGU NANDI NADI', view: 'bnn' },
        { label: 'MATCH MAKING', view: 'matchMakingForm' }
    ];

    const isItemActive = (item: typeof navItems[0]) => {
        if (item.view === 'dashboard') return currentView === 'dashboard';
        if (item.view === 'form') {
            if (item.mode === 'Natal') return currentView === 'form' && (mode === 'Natal' || mode === 'Parashara');
            return currentView === 'form' && mode === item.mode;
        }
        if (item.view === 'numerologyForm') return currentView === 'numerologyForm' || currentView === 'numerologyReport';
        if (item.view === 'bnn') return currentView === 'bnn';
        if (item.view === 'matchMakingForm') return currentView === 'matchMakingForm' || currentView === 'matchMakingResult';
        return false;
    };

    const handleNavigate = (view: string, targetMode?: string) => {
        if (onNavigate) {
            onNavigate(view, targetMode);
        }
        setShowMenu(false);
    };

    return (
        <div className="app-shell" data-title={title} style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'var(--bg)',
            position: 'relative'
        }}>
            <style>{`
                .layout-header-links {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .layout-nav-link {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    padding: 8px 14px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                .layout-nav-link:hover {
                    color: var(--primary);
                    background: rgba(124, 92, 183, 0.04);
                }
                .layout-nav-link.active {
                    color: var(--primary);
                    background: #E9E4F5;
                }
                @media (max-width: 900px) {
                    .layout-header-links {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Premium Light Header Bar */}
            <header style={{
                background: 'rgba(253, 251, 249, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '1.25rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--secondary)',
                borderBottom: '1px solid rgba(124, 92, 183, 0.08)',
                zIndex: 1000,
                position: 'relative'
            }}>
                {/* Brand Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => handleNavigate('dashboard')}>
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

                {/* Desktop Center Links */}
                <nav className="layout-header-links">
                    {navItems.map((item) => (
                        <span
                            key={item.label}
                            onClick={() => handleNavigate(item.view, item.mode)}
                            className={`layout-nav-link ${isItemActive(item) ? 'active' : ''}`}
                        >
                            {item.label}
                        </span>
                    ))}
                </nav>

                {/* Right Side Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Back Button (Only when not on Dashboard) */}
                    {currentView !== 'dashboard' && (
                        <button
                            onClick={onBack}
                            style={{
                                background: 'rgba(124, 92, 183, 0.05)',
                                border: '1px solid rgba(124, 92, 183, 0.1)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--secondary)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124, 92, 183, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(124, 92, 183, 0.05)'}
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}
                    {/* Hamburger Menu Toggle (Desktop & Mobile) */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {showMenu ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Dropdown Menu Drawer */}
                {showMenu && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: '2rem',
                        width: '220px',
                        background: 'white',
                        boxShadow: '0 8px 24px rgba(32, 22, 58, 0.1)',
                        padding: '1rem',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(124, 92, 183, 0.08)'
                    }} className="layout-dropdown-menu">
                        <style>{`
                            @media (max-width: 900px) {
                                .layout-dropdown-menu {
                                    left: 0 !important;
                                    right: 0 !important;
                                    width: 100% !important;
                                    border-radius: 0 !important;
                                }
                                .layout-dropdown-mobile-links {
                                    display: flex !important;
                                    flex-direction: column !important;
                                }
                            }
                        `}</style>
                        <div className="layout-dropdown-mobile-links" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem' }}>
                            {navItems.map((item) => (
                                <div
                                    key={item.label}
                                    onClick={() => handleNavigate(item.view, item.mode)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.05em',
                                        cursor: 'pointer',
                                        background: isItemActive(item) ? '#E9E4F5' : 'transparent',
                                        color: isItemActive(item) ? 'var(--primary)' : 'var(--text-muted)'
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                            <div style={{ height: '1px', background: 'rgba(124, 92, 183, 0.08)', margin: '4px 0' }} />
                        </div>
                        {isAdmin && onAdminToggle && (
                            <div
                                onClick={() => {
                                    onAdminToggle();
                                    setShowMenu(false);
                                }}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    color: 'var(--secondary)',
                                    cursor: 'pointer'
                                }}
                            >
                                ADMIN DASHBOARD
                            </div>
                        )}
                        <div
                            onClick={() => {
                                onLogout();
                                setShowMenu(false);
                            }}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#ef4444',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <LogOut size={16} /> LOGOUT
                        </div>
                    </div>
                )}
            </header>

            {/* Subscription reminder badge */}
            {!isAdmin && days !== null && days <= 30 && (
                <div style={{
                    background: (days <= 5) ? '#fef2f2' : '#eff6ff',
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                    color: (days <= 5) ? '#b91c1c' : '#1e40af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <Clock size={16} />
                    <div style={{ textAlign: 'center' }}>
                        {days <= 0 ? (
                            <span>Your subscription has expired. Please contact admin.</span>
                        ) : (
                            <span>Subscription: {days} days left <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({new Date(expiryDate!).toLocaleDateString()})</span></span>
                        )}
                    </div>
                </div>
            )}

            {/* Active Result Sub-Tabs */}
            {showTabs && (
                <nav className="tabs" style={{
                    display: 'flex',
                    overflowX: 'auto',
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    <style>{`
                        .tabs::-webkit-scrollbar { display: none; }
                        .tab-item {
                            padding: 1rem 1.25rem;
                            color: #64748b;
                            font-weight: 600;
                            border: 1px solid #e2e8f0;
                            border-bottom: 3px solid #e2e8f0;
                            cursor: pointer;
                            transition: all 0.2s;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            flex-shrink: 0;
                            font-size: 0.85rem;
                            text-transform: uppercase;
                        }
                        .tab-item.active {
                            color: var(--primary);
                            border-bottom-color: var(--primary);
                            background: rgba(124, 92, 183, 0.08);
                        }
                    `}</style>
                    {mode === 'Parashara' ? (
                        <>
                            {['d1', 'd2', 'd4', 'd5', 'd6', 'd7', 'd8', 'd10', 'd11', 'd12'].map(id => {
                                const labels: Record<string, string> = {
                                    d1: 'Lagna (D1)', d2: 'D2 Wealth', d4: 'D4 Property',
                                    d5: 'D5 Spiritual', d6: 'D6 Disease', d7: 'D7 Child Birth',
                                    d8: 'D8 Longevity', d10: 'D10 Career', d11: 'D11 Inflow', d12: 'D12 Parents'
                                };
                                return (
                                    <div key={id} className={`tab-item ${activeTab === id ? 'active' : ''}`}
                                        onClick={() => onTabChange(id)}
                                        style={{ fontWeight: 'bold', color: activeTab === id ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        {labels[id]}
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            <div className={`tab-item ${activeTab === 'planets' ? 'active' : ''}`}
                                onClick={() => onTabChange('planets')}
                                style={{ fontWeight: 'bold', color: activeTab === 'planets' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                Chart
                            </div>
                            <div className={`tab-item ${activeTab === 'dasha' ? 'active' : ''}`}
                                onClick={() => onTabChange('dasha')}
                                style={{ fontWeight: 'bold', color: activeTab === 'dasha' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                Dasha
                            </div>
                            <div className={`tab-item ${activeTab === 'ruling_planets' ? 'active' : ''}`}
                                onClick={() => onTabChange('ruling_planets')}
                                style={{ fontWeight: 'bold', color: activeTab === 'ruling_planets' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                Ruling Planets
                            </div>
                            {chartMode === 'Rashi' && (
                                <div className={`tab-item ${activeTab === 'phala' ? 'active' : ''}`}
                                    onClick={() => onTabChange('phala')}
                                    style={{ fontWeight: 'bold', color: activeTab === 'phala' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                    PHALA/RESULT
                                </div>
                            )}
                            {chartMode !== 'Rashi' && (
                                <>
                                    <div className={`tab-item ${activeTab === 'predictions' ? 'active' : ''}`}
                                        onClick={() => onTabChange('predictions')}
                                        style={{ fontWeight: 'bold', color: activeTab === 'predictions' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        Predictions
                                    </div>
                                    <div className={`tab-item ${activeTab === 'combination' ? 'active' : ''}`}
                                        onClick={() => onTabChange('combination')}
                                        style={{ fontWeight: 'bold', color: activeTab === 'combination' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        Combination
                                    </div>
                                    <div className={`tab-item ${activeTab === 'houses' ? 'active' : ''}`}
                                        onClick={() => onTabChange('houses')}
                                        style={{ fontWeight: 'bold', color: activeTab === 'houses' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        House Signification
                                    </div>
                                    {hasPowerPositionAccess && (
                                        <div className={`tab-item ${activeTab === 'power_position' ? 'active' : ''}`}
                                            onClick={() => onTabChange('power_position')}
                                            style={{ fontWeight: 'bold', color: activeTab === 'power_position' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                            Remedies
                                        </div>
                                    )}
                                    <div className={`tab-item ${activeTab === 'nadi' ? 'active' : ''}`}
                                        onClick={() => onTabChange('nadi')}
                                        style={{ fontWeight: 'bold', color: activeTab === 'nadi' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        KP Combination
                                    </div>
                                    <div className={`tab-item ${activeTab === 'yearly' ? 'active' : ''}`}
                                        onClick={() => onTabChange('yearly')}
                                        style={{ fontWeight: 'bold', color: activeTab === 'yearly' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        Yearly
                                    </div>
                                    {(mode === 'Natal' || mode === 'Prashna') && (
                                        <div className={`tab-item ${activeTab === 'birth_time' ? 'active' : ''}`}
                                            onClick={() => onTabChange('birth_time')}
                                            style={{ fontWeight: 'bold', color: activeTab === 'birth_time' ? 'var(--primary)' : '#c2410c' }}>
                                            Cusp Rectification
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </nav>
            )}

            {/* Content Shell */}
            <main style={{ flex: 1, padding: 0 }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
