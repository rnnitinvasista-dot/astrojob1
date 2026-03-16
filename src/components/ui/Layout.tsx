import React from 'react';
import { Clock, ArrowLeft, ExternalLink, Menu, LogOut } from 'lucide-react';
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
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, showTabs, onBack, isAdmin, expiryDate, onLogout, currentView, chartMode, chartStyle: _chartStyle, onChartStyleChange: _onChartStyleChange, title }) => {
    const { currentUser, userData } = useAuth();
    const [showMenu, setShowMenu] = React.useState(false);

    // Access flags
    const hasPowerPositionAccess = isAdmin || userData?.hasPowerPositionAccess;
    const hasAnalysisAccess = isAdmin || userData?.hasAnalysisAccess;
    const hasAdvancePredictionsAccess = isAdmin || userData?.hasAdvancePredictionsAccess;

    const getDaysRemaining = () => {
        if (!expiryDate) return null;
        const diff = new Date(expiryDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const days = getDaysRemaining();

    return (
        <div className="app-shell" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'var(--bg)',
            position: 'relative'
        }}>
            {/* New Header Bar */}
            <header style={{
                background: 'var(--header-bg)',
                padding: 'calc(env(safe-area-inset-top, 20px) + 3.5rem) 1.5rem 1rem', // Little more down
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 1000,
                position: 'relative',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Left side: Hamburger Menu */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px', display: 'flex' }}
                        >
                            <Menu size={32} />
                        </button>

                        {showMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                background: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                padding: '8px',
                                minWidth: '180px',
                                marginTop: '12px',
                                zIndex: 1001
                            }}>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setShowMenu(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        cursor: 'pointer',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Dashboard-only Greeting */}
                    {currentView === 'dashboard' && (
                        <>
                            {/* Avatar */}
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid white',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                background: 'white',
                                marginLeft: '4px'
                            }}>
                                <img src="/app_logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>

                            {/* Middle: Text */}
                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '4px' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.2, opacity: 0.9 }}>
                                    Hello
                                </div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.2 }}>
                                    {currentUser?.email ? currentUser.email.split('@')[0] : 'User'}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Central Title */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    width: '60%',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        lineHeight: 1.2
                    }}>
                        {title}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {currentView !== 'dashboard' && onBack && (
                        <button
                            onClick={onBack}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ArrowLeft size={24} color="white" />
                        </button>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => window.open('https://astrojob-admin-f0918.web.app', '_blank')}
                            style={{
                                background: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#35a4f4',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ExternalLink size={14} /> Admin
                        </button>
                    )}
                </div>
            </header>


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

            {
                showTabs && (
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
                            color: #d4af37;
                            border-bottom-color: #d4af37;
                            background: rgba(212, 175, 55, 0.1);
                        }
                    `}</style>
                        <div className={`tab-item ${activeTab === 'planets' ? 'active' : ''}`}
                            onClick={() => onTabChange('planets')}
                            style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                            Chart
                        </div>
                        <div className={`tab-item ${activeTab === 'dasha' ? 'active' : ''}`}
                            onClick={() => onTabChange('dasha')}
                            style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                            Dasha
                        </div>
                        {chartMode === 'Rashi' && (
                            <div className={`tab-item ${activeTab === 'phala' ? 'active' : ''}`}
                                onClick={() => onTabChange('phala')}
                                style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                PHALA/RESULT
                            </div>
                        )}
                        {chartMode !== 'Rashi' && (
                            <>
                                <div className={`tab-item ${activeTab === 'houses' ? 'active' : ''}`}
                                    onClick={() => onTabChange('houses')}
                                    style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                    House Signification
                                </div>
                                {hasPowerPositionAccess && (
                                    <div className={`tab-item ${activeTab === 'power_position' ? 'active' : ''}`}
                                        onClick={() => onTabChange('power_position')}
                                        style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                        Remedies
                                    </div>
                                )}
                                <div className={`tab-item ${activeTab === 'predictions' ? 'active' : ''}`}
                                    onClick={() => onTabChange('predictions')}
                                    style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                    Predictions
                                </div>
                                {hasAnalysisAccess && (
                                    <div className={`tab-item ${activeTab === 'analysis' ? 'active' : ''}`}
                                        onClick={() => onTabChange('analysis')}
                                        style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                        Analysis
                                    </div>
                                )}
                                {hasAdvancePredictionsAccess && (
                                    <div className={`tab-item ${activeTab === 'advance_predictions' ? 'active' : ''}`}
                                        onClick={() => onTabChange('advance_predictions')}
                                        style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                        Advance Predictions
                                    </div>
                                )}
                                <div className={`tab-item ${activeTab === 'nadi' ? 'active' : ''}`}
                                    onClick={() => onTabChange('nadi')}
                                    style={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                    House Occupation
                                </div>
                            </>
                        )}
                    </nav>
                )
            }

            <main style={{ flex: 1, padding: 0, paddingBottom: '3rem' }}>
                {children}
            </main>
        </div >
    );
};

export default Layout;
