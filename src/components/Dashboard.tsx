import React from 'react';
import { TreeDeciduous, HelpCircle } from 'lucide-react';

interface DashboardProps {
    onSelect: (mode: 'Natal' | 'Prashna') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
    const menuItems = [
        {
            id: 'gns',
            label: 'KP Prediction',
            icon: <TreeDeciduous size={32} color="#fff" />,
            color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            mode: 'Natal'
        },
        {
            id: 'prashna',
            label: 'KP Prashna Kundli',
            icon: <HelpCircle size={32} color="#fff" />,
            color: 'linear-gradient(135deg, #1e40af 0%, #172554 100%)',
            mode: 'Prashna'
        },
    ];

    return (
        <div style={{
            flex: 1,
            padding: '2rem 1.5rem',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3rem',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2.5rem',
                width: '100%',
                maxWidth: '360px'
            }}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item.mode as any)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '100px', // Smaller
                            height: '100px', // Smaller
                            borderRadius: '50%',
                            background: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 20px rgba(29, 78, 216, 0.2)',
                            border: '8px solid white', // Thicker border
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)'
                        }}>
                            {item.icon}
                        </div>
                        <span style={{
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            color: '#1e3a8a',
                            textAlign: 'center'
                        }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
