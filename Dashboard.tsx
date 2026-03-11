import React, { useState } from 'react';
import { TreeDeciduous, HelpCircle, Scroll, X } from 'lucide-react';

interface DashboardProps {
    onSelect: (mode: 'Natal' | 'Prashna' | 'Parashara') => void;
    hasKPAccess?: boolean;
    isAdmin?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect, hasKPAccess, isAdmin }) => {
    const [showPopup, setShowPopup] = useState(false);

    const menuItems = [
        {
            id: 'parashara',
            label: 'Parashara Kundli',
            icon: <Scroll size={32} color="#fff" />,
            color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            mode: 'Parashara',
            requiresKP: false
        },
        {
            id: 'gns',
            label: 'KP Prediction',
            icon: <TreeDeciduous size={32} color="#fff" />,
            color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            mode: 'Natal',
            requiresKP: true
        },
        {
            id: 'prashna',
            label: 'KP Prashna Kundli',
            icon: <HelpCircle size={32} color="#fff" />,
            color: 'linear-gradient(135deg, #1e40af 0%, #172554 100%)',
            mode: 'Prashna',
            requiresKP: true
        }
    ];

    const handleItemClick = (item: typeof menuItems[0]) => {
        if (item.requiresKP && !isAdmin && !hasKPAccess) {
            setShowPopup(true);
            return;
        }
        onSelect(item.mode as any);
    };

    return (
        <div style={{
            flex: 1,
            padding: '2rem 1.5rem',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            animation: 'fadeIn 0.5s ease-out',
            position: 'relative'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '400px'
            }}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '75px',
                            height: '75px',
                            borderRadius: '50%',
                            background: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            border: '4px solid white',
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)'
                        }}>
                            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 28 })}
                        </div>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#1e3a8a',
                            textAlign: 'center'
                        }}>{item.label}</span>
                    </div>
                ))}
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
                        borderRadius: '20px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        position: 'relative',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        border: '3px solid #ef4444'
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
