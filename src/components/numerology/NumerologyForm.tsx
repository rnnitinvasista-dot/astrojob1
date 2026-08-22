import React, { useState, useEffect, useRef } from 'react';
import { Phone, History as HistoryIcon, Truck, Shield, Info, User, Moon, Star } from 'lucide-react';

interface NumerologyFormProps {
    onSubmit: (data: { name: string; dob: string; phone: string; vehicleNumber: string }) => void;
    onBack: () => void;
}

const NumerologyForm: React.FC<NumerologyFormProps> = ({ onSubmit, onBack }) => {
    const [activeTab, setActiveTab] = useState<'NEW' | 'RECENTS'>('NEW');
    const [name, setName] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [recents, setRecents] = useState<any[]>([]);

    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const vehicleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('numerology_recents');
        if (saved) {
            try {
                setRecents(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing recents', e);
            }
        }
    }, []);

    const saveRecent = (data: any) => {
        const newRecent = { ...data, id: Date.now() };
        const updated = [newRecent, ...recents.filter(r => r.name !== data.name || r.dob !== data.dob)].slice(0, 5);
        setRecents(updated);
        localStorage.setItem('numerology_recents', JSON.stringify(updated));
    };

    const handleInputChange = (
        value: string, 
        setter: (val: string) => void, 
        maxLength: number, 
        nextRef?: React.RefObject<HTMLInputElement | null>,
        isNumeric: boolean = true
    ) => {
        const cleaned = isNumeric ? value.replace(/[^0-9]/g, '') : value;
        setter(cleaned);
        if (cleaned.length === maxLength && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    const handleClearAll = () => {
        setName('');
        setDay('');
        setMonth('');
        setYear('');
        setPhone('');
        setVehicleNumber('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const data = { name, dob: formattedDate, phone, vehicleNumber };
        saveRecent(data);
        onSubmit(data);
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: 'calc(env(safe-area-inset-top, 20px) + 2rem) 1.5rem 3rem' }}>
            <style>{`
                .form-split-grid {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr;
                    gap: 2rem;
                }
                .form-inputs-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                @media (max-width: 900px) {
                    .form-split-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                    .form-right-illustration {
                        display: none !important;
                    }
                    .form-inputs-layout {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                }
            `}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                
                {/* Header breadcrumb & info row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div>
                        {/* Breadcrumbs */}
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                            <span style={{ cursor: 'pointer' }} onClick={onBack}>Dashboard</span>
                            <span>&gt;</span>
                            <span style={{ cursor: 'pointer' }} onClick={onBack}>Numerology</span>
                            <span>&gt;</span>
                            <span style={{ color: 'var(--primary)' }}>Birth Details</span>
                        </div>
                        {/* Title */}
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--secondary)', margin: '0 0 0.5rem' }}>
                            Let's Start with Your Birth Details
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, fontWeight: 400 }}>
                            Accurate details help us generate your personalized numerology analysis.
                        </p>
                    </div>

                    {/* Privacy badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'rgba(124, 92, 183, 0.03)',
                        border: '1px solid rgba(124, 92, 183, 0.08)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '12px',
                        maxWidth: '280px'
                    }}>
                        <Shield size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <div style={{ fontSize: '0.75rem', lineHeight: 1.4, color: 'var(--text-muted)' }}>
                            <strong style={{ color: 'var(--secondary)', display: 'block' }}>Your data is safe and private.</strong>
                            We never share your information.
                        </div>
                    </div>
                </div>

                {/* Form recents switcher */}
                <div style={{
                    display: 'inline-flex',
                    background: '#F4F1FA',
                    borderRadius: '8px',
                    padding: '4px',
                    marginBottom: '1.5rem'
                }}>
                    <button
                        onClick={() => setActiveTab('NEW')}
                        style={{
                            border: 'none',
                            background: activeTab === 'NEW' ? 'white' : 'transparent',
                            color: activeTab === 'NEW' ? 'var(--primary)' : 'var(--text-muted)',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        NEW DETAILS
                    </button>
                    <button
                        onClick={() => setActiveTab('RECENTS')}
                        style={{
                            border: 'none',
                            background: activeTab === 'RECENTS' ? 'white' : 'transparent',
                            color: activeTab === 'RECENTS' ? 'var(--primary)' : 'var(--text-muted)',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        RECENTS
                    </button>
                </div>

                {/* Split main grid layout */}
                <div className="form-split-grid">
                    
                    {/* Left: Input fields panel */}
                    <div style={{
                        background: 'white',
                        border: '1px solid rgba(124, 92, 183, 0.08)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        {activeTab === 'RECENTS' ? (
                            <div style={{ minHeight: '320px' }}>
                                {recents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
                                        <HistoryIcon size={48} style={{ marginBottom: '1rem', opacity: 0.3, color: 'var(--primary)' }} />
                                        <p style={{ fontSize: '0.9rem', margin: 0 }}>No recent history found</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {recents.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => onSubmit(item)}
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    background: 'var(--bg)',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(124, 92, 183, 0.08)'}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.95rem' }}>{item.name || 'Unnamed'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                        {item.dob} | {item.phone}
                                                    </div>
                                                </div>
                                                <Phone size={18} style={{ color: 'var(--primary)' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                
                                {/* Info icon header inside card */}
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', paddingBottom: '1rem' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                                    }}>
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', margin: 0 }}>Basic Information</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Please enter your birth details as accurately as possible.</p>
                                    </div>
                                </div>

                                <div className="form-inputs-layout">
                                    
                                    {/* Name Input */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>FULL NAME</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            style={{
                                                border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                                borderRadius: '8px',
                                                padding: '0.7rem 0.9rem',
                                                width: '100%',
                                                background: 'white',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                color: 'var(--text)',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    </div>

                                    {/* Date input (using segments DD MM YYYY) */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>DATE OF BIRTH</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input 
                                                ref={dayRef}
                                                type="text" 
                                                placeholder="DD" 
                                                maxLength={2} 
                                                value={day} 
                                                onChange={(e) => handleInputChange(e.target.value, setDay, 2, monthRef)} 
                                                required
                                                style={{
                                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                                    borderRadius: '8px',
                                                    padding: '0.7rem',
                                                    width: '50px',
                                                    textAlign: 'center',
                                                    outline: 'none',
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text)'
                                                }}
                                            />
                                            <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>/</span>
                                            <input 
                                                ref={monthRef}
                                                type="text" 
                                                placeholder="MM" 
                                                maxLength={2} 
                                                value={month} 
                                                onChange={(e) => handleInputChange(e.target.value, setMonth, 2, yearRef)} 
                                                required
                                                style={{
                                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                                    borderRadius: '8px',
                                                    padding: '0.7rem',
                                                    width: '50px',
                                                    textAlign: 'center',
                                                    outline: 'none',
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text)'
                                                }}
                                            />
                                            <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>/</span>
                                            <input 
                                                ref={yearRef}
                                                type="text" 
                                                placeholder="YYYY" 
                                                maxLength={4} 
                                                value={year} 
                                                onChange={(e) => handleInputChange(e.target.value, setYear, 4, phoneRef)} 
                                                required
                                                style={{
                                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                                    borderRadius: '8px',
                                                    padding: '0.7rem',
                                                    width: '75px',
                                                    textAlign: 'center',
                                                    outline: 'none',
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text)'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number Input */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>PHONE NUMBER</label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                            <input
                                                ref={phoneRef}
                                                type="text"
                                                placeholder="Mobile Number"
                                                maxLength={10}
                                                value={phone}
                                                onChange={(e) => handleInputChange(e.target.value, setPhone, 10, vehicleRef)}
                                                style={{
                                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                                    borderRadius: '8px',
                                                    padding: '0.7rem 0.9rem 0.7rem 2.2rem',
                                                    width: '100%',
                                                    background: 'white',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    color: 'var(--text)',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Vehicle Number Input */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>VEHICLE NUMBER (LAST 4 DIGITS)</label>
                                        <div style={{ position: 'relative' }}>
                                            <Truck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                            <input
                                                ref={vehicleRef}
                                                type="text"
                                                placeholder="e.g. 5678"
                                                maxLength={4}
                                                value={vehicleNumber}
                                                onChange={(e) => handleInputChange(e.target.value, setVehicleNumber, 4)}
                                                style={{
                                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                                    borderRadius: '8px',
                                                    padding: '0.7rem 0.9rem 0.7rem 2.2rem',
                                                    width: '100%',
                                                    background: 'white',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    color: 'var(--text)',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Why details matter Info Box */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    background: 'rgba(124, 92, 183, 0.03)',
                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    alignItems: 'flex-start',
                                    marginTop: '0.5rem'
                                }}>
                                    <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <h4 style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>Why accurate details matter?</h4>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                                            Even a difference of a few minutes can change your rising sign and planetary positions.
                                        </p>
                                    </div>
                                </div>

                                {/* Action button row */}
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '0.9rem 2.2rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 4px 10px rgba(124, 92, 183, 0.15)',
                                            textTransform: 'uppercase'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                                    >
                                        GENERATE ANALYSIS
                                    </button>

                                    <span
                                        onClick={handleClearAll}
                                        style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            padding: '8px 12px',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    >
                                        CLEAR ALL
                                    </span>
                                </div>

                            </form>
                        )}
                    </div>

                    {/* Right: Premium cosmic blueprint panel (Desktop only) */}
                    <div className="form-right-illustration" style={{
                        background: 'linear-gradient(180deg, #FDFBFA 0%, #F5F1FA 100%)',
                        border: '1px solid rgba(124, 92, 183, 0.08)',
                        borderRadius: '16px',
                        padding: '2.5rem 2rem',
                        boxShadow: 'var(--shadow)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        
                        {/* Circular animated rings moon */}
                        <div style={{
                            position: 'relative',
                            width: '180px',
                            height: '180px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <style>{`
                                @keyframes form-orbit {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                            `}</style>
                            <div style={{
                                position: 'absolute',
                                width: '170px',
                                height: '170px',
                                border: '1px dashed rgba(124, 92, 183, 0.15)',
                                borderRadius: '50%',
                                animation: 'form-orbit 30s linear infinite'
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '130px',
                                height: '130px',
                                border: '1.5px solid rgba(124, 92, 183, 0.1)',
                                borderRadius: '50%'
                            }} />
                            <div style={{
                                width: '90px',
                                height: '90px',
                                border: '1.5px solid rgba(124, 92, 183, 0.2)',
                                borderRadius: '50%',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(124,92,183,0.06)'
                            }}>
                                <Moon size={28} style={{ color: 'var(--primary)', transform: 'rotate(-20deg)' }} />
                            </div>
                        </div>

                        {/* Title descriptions */}
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            color: 'var(--secondary)',
                            margin: '0 0 0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            Your Cosmic Blueprint Awaits
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 2rem', maxWidth: '280px' }}>
                            Your birth details connect you with the numbers of your destiny.
                        </p>

                        {/* List bullets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '260px', textAlign: 'left' }}>
                            {[
                                'Understand your personality',
                                'Discover your life purpose',
                                'Navigate your path with clarity'
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(124, 92, 183, 0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                                    }}>
                                        <Star size={12} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)' }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default NumerologyForm;
