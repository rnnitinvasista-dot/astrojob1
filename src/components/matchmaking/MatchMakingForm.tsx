import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, History, User, Search, Shield, Info } from 'lucide-react';
import type { BirthDetails } from '../../types/astrology';

interface MatchMakingFormProps {
    onSubmit: (boy: BirthDetails, girl: BirthDetails) => void;
    isLoading: boolean;
    onBack: () => void;
    isExpired?: boolean;
}

interface LocationSuggestion {
    display_name: string;
    lat: string;
    lon: string;
}

const STANDARD_CITIES: Record<string, { lat: number, lon: number, name: string }> = {
    'bangalore': { lat: 12.9666, lon: 77.5833, name: 'Bangalore, Karnataka, India' },
    'bengaluru': { lat: 12.9666, lon: 77.5833, name: 'Bengaluru, Karnataka, India' },
    'delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi, India' },
    'new delhi': { lat: 28.6139, lon: 77.2090, name: 'New Delhi, India' },
    'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai, Maharashtra, India' },
    'chennai': { lat: 13.0827, lon: 80.2707, name: 'Chennai, Tamil Nadu, India' },
    'hyderabad': { lat: 17.3850, lon: 78.4867, name: 'Hyderabad, Telangana, India' },
    'kolkata': { lat: 22.5726, lon: 88.3639, name: 'Kolkata, West Bengal, India' },
    'pune': { lat: 18.5204, lon: 73.8567, name: 'Pune, Maharashtra, India' },
    'ahmedabad': { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad, Gujarat, India' }
};

const MatchMakingForm: React.FC<MatchMakingFormProps> = ({ onSubmit, isLoading, onBack, isExpired }) => {
    const [boyData, setBoyData] = useState<BirthDetails>({
        name: '', gender: 'Male', date_of_birth: '', time_of_birth: '', timezone: 'Asia/Kolkata',
        latitude: 12.9666, longitude: 77.5833, place: '', ayanamsa: 'KP'
    });
    const [girlData, setGirlData] = useState<BirthDetails>({
        name: '', gender: 'Female', date_of_birth: '', time_of_birth: '', timezone: 'Asia/Kolkata',
        latitude: 12.9666, longitude: 77.5833, place: '', ayanamsa: 'KP'
    });

    const [boyTab, setBoyTab] = useState<'NEW' | 'RECENTS'>('NEW');
    const [girlTab, setGirlTab] = useState<'NEW' | 'RECENTS'>('NEW');

    // Segmented Inputs
    const [bDay, setBDay] = useState(''); const [bMonth, setBMonth] = useState(''); const [bYear, setBYear] = useState('');
    const [bHour, setBHour] = useState(''); const [bMin, setBMin] = useState(''); const [bSec, setBSec] = useState('00');
    
    const [gDay, setGDay] = useState(''); const [gMonth, setGMonth] = useState(''); const [gYear, setGYear] = useState('');
    const [gHour, setGHour] = useState(''); const [gMin, setGMin] = useState(''); const [gSec, setGSec] = useState('00');

    // Refs for auto-focus
    const bDRef = useRef<HTMLInputElement>(null); const bMRef = useRef<HTMLInputElement>(null); const bYRef = useRef<HTMLInputElement>(null);
    const bHRef = useRef<HTMLInputElement>(null); const bMiRef = useRef<HTMLInputElement>(null); const bSRef = useRef<HTMLInputElement>(null);
    const gDRef = useRef<HTMLInputElement>(null); const gMRef = useRef<HTMLInputElement>(null); const gYRef = useRef<HTMLInputElement>(null);
    const gHRef = useRef<HTMLInputElement>(null); const gMiRef = useRef<HTMLInputElement>(null); const gSRef = useRef<HTMLInputElement>(null);

    const [showLocModal, setShowLocModal] = useState<{ active: 'boy' | 'girl' | null }>({ active: null });
    const [locInput, setLocInput] = useState('');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('in');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [recents, setRecents] = useState<any[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('astro_recents') || '[]');
        setRecents(stored);
    }, []);

    const boyRecents = recents.filter(r => r.gender?.toLowerCase() === 'male');
    const girlRecents = recents.filter(r => r.gender?.toLowerCase() !== 'male');

    const handleInputChange = (value: string, setter: (val: string) => void, max: number, next?: React.RefObject<HTMLInputElement | null>) => {
        const cleaned = value.replace(/[^0-9]/g, '');
        setter(cleaned);
        if (cleaned.length === max && next?.current) next.current.focus();
    };

    const handleSelectRecent = (type: 'boy' | 'girl', item: any) => {
        const details = { ...item };
        const [y, m, d] = details.date_of_birth.split('-');
        const [h, min, s] = details.time_of_birth.split(':');

        if (type === 'boy') {
            setBoyData(details);
            setBDay(d); setBMonth(m); setBYear(y);
            setBHour(h); setBMin(min); setBSec(s || '00');
            setBoyTab('NEW');
        } else {
            setGirlData(details);
            setGDay(d); setGMonth(m); setGYear(y);
            setGHour(h); setGMin(min); setGSec(s || '00');
            setGirlTab('NEW');
        }
    };

    const searchLocations = async (query: string) => {
        if (query.length < 3) return;
        setIsSearching(true);
        try {
            const lowerQuery = query.toLowerCase().trim();
            const standardMatch = STANDARD_CITIES[lowerQuery];

            if (standardMatch) {
                setSuggestions([{
                    display_name: standardMatch.name,
                    lat: standardMatch.lat.toString(),
                    lon: standardMatch.lon.toString()
                }]);
                setIsSearching(false);
                return;
            }

            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=15&language=en&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                setSuggestions([]);
                return;
            }

            const countryResults = data.results.filter((r: any) =>
                r.country_code?.toLowerCase() === selectedCountry.toLowerCase()
            );

            const pool = countryResults.length > 0 ? countryResults : data.results;
            const seenCities = new Set<string>();
            const uniqueData: LocationSuggestion[] = [];

            for (const item of pool) {
                const primaryWord = item.name.split(' ')[0].toLowerCase().trim();
                if (!seenCities.has(primaryWord)) {
                    seenCities.add(primaryWord);
                    const parts = [item.name, item.admin1, item.country].filter(Boolean);
                    const displayName = parts.join(', ');
                    uniqueData.push({
                        display_name: displayName,
                        lat: item.latitude.toString(),
                        lon: item.longitude.toString()
                    });
                }
            }

            setSuggestions(uniqueData.slice(0, 6));
        } catch (error) {
            console.error('Location search failed');
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocationSelect = (s: LocationSuggestion) => {
        if (showLocModal.active === 'boy') {
            setBoyData({ ...boyData, place: s.display_name, latitude: parseFloat(s.lat), longitude: parseFloat(s.lon) });
        } else {
            setGirlData({ ...girlData, place: s.display_name, latitude: parseFloat(s.lat), longitude: parseFloat(s.lon) });
        }
        setShowLocModal({ active: null });
        setLocInput('');
        setSuggestions([]);
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bDOB = `${bYear}-${bMonth.padStart(2, '0')}-${bDay.padStart(2, '0')}`;
        const bTOB = `${bHour.padStart(2, '0')}:${bMin.padStart(2, '0')}:${bSec.padStart(2, '0')}`;
        const gDOB = `${gYear}-${gMonth.padStart(2, '0')}-${gDay.padStart(2, '0')}`;
        const gTOB = `${gHour.padStart(2, '0')}:${gMin.padStart(2, '0')}:${gSec.padStart(2, '0')}`;

        onSubmit(
            { ...boyData, date_of_birth: bDOB, time_of_birth: bTOB },
            { ...girlData, date_of_birth: gDOB, time_of_birth: gTOB }
        );
    };

    const handleClearAll = () => {
        setBoyData({
            name: '', gender: 'Male', date_of_birth: '', time_of_birth: '', timezone: 'Asia/Kolkata',
            latitude: 12.9666, longitude: 77.5833, place: '', ayanamsa: 'KP'
        });
        setGirlData({
            name: '', gender: 'Female', date_of_birth: '', time_of_birth: '', timezone: 'Asia/Kolkata',
            latitude: 12.9666, longitude: 77.5833, place: '', ayanamsa: 'KP'
        });
        setBDay(''); setBMonth(''); setBYear(''); setBHour(''); setBMin(''); setBSec('00');
        setGDay(''); setGMonth(''); setGYear(''); setGHour(''); setGMin(''); setGSec('00');
    };

    const renderFormSection = (type: 'boy' | 'girl') => {
        const isBoy = type === 'boy';
        const data = isBoy ? boyData : girlData;
        const setData = isBoy ? setBoyData : setGirlData;
        const currentTab = isBoy ? boyTab : girlTab;
        const setCurrentTab = isBoy ? setBoyTab : setGirlTab;
        const items = isBoy ? boyRecents : girlRecents;

        const day = isBoy ? bDay : gDay; const setDay = isBoy ? setBDay : setGDay;
        const month = isBoy ? bMonth : gMonth; const setMonth = isBoy ? setBMonth : setGMonth;
        const year = isBoy ? bYear : gYear; const setYear = isBoy ? setBYear : setGYear;
        const hour = isBoy ? bHour : gHour; const setHour = isBoy ? setBHour : setGHour;
        const min = isBoy ? bMin : gMin; const setMin = isBoy ? setBMin : setGMin;
        const sec = isBoy ? bSec : gSec; const setSec = isBoy ? setBSec : setGSec;

        const dRef = isBoy ? bDRef : gDRef; const mRef = isBoy ? bMRef : gMRef; const yRef = isBoy ? bYRef : gYRef;
        const hRef = isBoy ? bHRef : gHRef; const miRef = isBoy ? bMiRef : gMiRef; const sRef = isBoy ? bSRef : gSRef;

        return (
            <div style={{ 
                background: 'white', 
                border: '1px solid rgba(124, 92, 183, 0.08)',
                borderRadius: '16px', 
                padding: '1.5rem', 
                boxShadow: 'var(--shadow)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            background: isBoy ? '#eff6ff' : '#fdf2f8', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: isBoy ? '#2563eb' : '#db2777'
                        }}>
                            <User size={16} />
                        </div>
                        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)', margin: 0 }}>
                            {isBoy ? "Boy's Birth Details" : "Girl's Birth Details"}
                        </h3>
                    </div>

                    {/* Switcher tabs */}
                    <div style={{
                        display: 'inline-flex',
                        background: '#F4F1FA',
                        borderRadius: '6px',
                        padding: '2px'
                    }}>
                        <button
                            type="button"
                            onClick={() => setCurrentTab('NEW')}
                            style={{
                                border: 'none',
                                background: currentTab === 'NEW' ? 'white' : 'transparent',
                                color: currentTab === 'NEW' ? 'var(--primary)' : 'var(--text-muted)',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            NEW
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentTab('RECENTS')}
                            style={{
                                border: 'none',
                                background: currentTab === 'RECENTS' ? 'white' : 'transparent',
                                color: currentTab === 'RECENTS' ? 'var(--primary)' : 'var(--text-muted)',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            RECENTS
                        </button>
                    </div>
                </div>

                {currentTab === 'NEW' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Name Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>FULL NAME</label>
                            <input
                                type="text" 
                                placeholder="Enter Name"
                                value={data.name} 
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                required
                                style={{
                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                    borderRadius: '8px',
                                    padding: '0.65rem 0.85rem',
                                    width: '100%',
                                    background: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: 'var(--text)',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Date Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>DATE OF BIRTH</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <input ref={dRef} type="text" placeholder="DD" maxLength={2} value={day} onChange={(e) => handleInputChange(e.target.value, setDay, 2, mRef)} required 
                                    style={{
                                        border: '1.5px solid rgba(124, 92, 183, 0.15)', borderRadius: '8px', padding: '0.65rem', width: '48px', textAlign: 'center', outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                                <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>/</span>
                                <input ref={mRef} type="text" placeholder="MM" maxLength={2} value={month} onChange={(e) => handleInputChange(e.target.value, setMonth, 2, yRef)} required 
                                    style={{
                                        border: '1.5px solid rgba(124, 92, 183, 0.15)', borderRadius: '8px', padding: '0.65rem', width: '48px', textAlign: 'center', outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                                <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>/</span>
                                <input ref={yRef} type="text" placeholder="YYYY" maxLength={4} value={year} onChange={(e) => handleInputChange(e.target.value, setYear, 4, hRef)} required 
                                    style={{
                                        border: '1.5px solid rgba(124, 92, 183, 0.15)', borderRadius: '8px', padding: '0.65rem', width: '70px', textAlign: 'center', outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Time Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>TIME OF BIRTH</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <input ref={hRef} type="text" placeholder="HH" maxLength={2} value={hour} onChange={(e) => handleInputChange(e.target.value, setHour, 2, miRef)} required 
                                    style={{
                                        border: '1.5px solid rgba(124, 92, 183, 0.15)', borderRadius: '8px', padding: '0.65rem', width: '48px', textAlign: 'center', outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                                <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>:</span>
                                <input ref={miRef} type="text" placeholder="MM" maxLength={2} value={min} onChange={(e) => handleInputChange(e.target.value, setMin, 2, sRef)} required 
                                    style={{
                                        border: '1.5px solid rgba(124, 92, 183, 0.15)', borderRadius: '8px', padding: '0.65rem', width: '48px', textAlign: 'center', outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                                <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>:</span>
                                <input ref={sRef} type="text" placeholder="SS" maxLength={2} value={sec} onChange={(e) => handleInputChange(e.target.value, setSec, 2)} 
                                    style={{
                                        border: '1.5px solid rgba(124, 92, 183, 0.15)', borderRadius: '8px', padding: '0.65rem', width: '48px', textAlign: 'center', outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Place of Birth Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>PLACE OF BIRTH</label>
                            <div 
                                onClick={() => setShowLocModal({ active: type })} 
                                style={{ 
                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                    borderRadius: '8px',
                                    padding: '0.7rem 0.9rem',
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', color: data.place ? 'var(--text)' : 'var(--text-muted)' }}>
                                    {data.place || "Search Birth Place..."}
                                </span>
                                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '320px', maxHeight: '350px', overflowY: 'auto' }}>
                        {items.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
                                <History size={40} style={{ marginBottom: '1rem', opacity: 0.3, margin: '0 auto', color: 'var(--primary)' }} />
                                <p style={{ fontSize: '0.8rem', margin: 0 }}>No recent profiles found</p>
                            </div>
                        ) : (
                            items.map((item, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => handleSelectRecent(type, item)} 
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
                                        <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.9rem' }}>{item.name || 'Unnamed'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            {item.date_of_birth} | {item.time_of_birth}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px' }}>{item.place}</div>
                                    </div>
                                    <Search size={18} style={{ color: 'var(--primary)' }} />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: 'calc(env(safe-area-inset-top, 20px) + 2rem) 1.5rem 3rem' }}>
            <style>{`
                .matchmaking-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                @media (max-width: 900px) {
                    .matchmaking-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                }
            `}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                
                {/* Header breadcrumbs and titles */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div>
                        {/* Breadcrumbs */}
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                            <span style={{ cursor: 'pointer' }} onClick={onBack}>Dashboard</span>
                            <span>&gt;</span>
                            <span style={{ cursor: 'pointer' }} onClick={onBack}>Match Making</span>
                            <span>&gt;</span>
                            <span style={{ color: 'var(--primary)' }}>Birth Details</span>
                        </div>
                        {/* Title */}
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--secondary)', margin: '0 0 0.5rem' }}>
                            Let's Start with Your Match Making Details
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, fontWeight: 400 }}>
                            Accurate birth details help us generate your compatibility analysis and personalized insights.
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

                <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.0rem' }}>
                    
                    {/* Columns Grid */}
                    <div className="matchmaking-grid">
                        {renderFormSection('boy')}
                        {renderFormSection('girl')}
                    </div>

                    {/* Accurate details alert info box */}
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        background: 'rgba(124, 92, 183, 0.03)',
                        border: '1px solid rgba(124, 92, 183, 0.08)',
                        borderRadius: '12px',
                        padding: '1rem',
                        alignItems: 'flex-start'
                    }}>
                        <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h4 style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>Why accurate details matter?</h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                                Even a difference of a few minutes can alter the rising signs, KP Cusps, or matching Gunas.
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <button 
                            type="submit" 
                            disabled={isLoading || isExpired}
                            style={{ 
                                background: isExpired ? '#cbd5e1' : 'var(--primary)',
                                color: isExpired ? '#64748b' : 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '1rem 2.5rem',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                fontSize: '0.85rem',
                                cursor: isExpired ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 10px rgba(124, 92, 183, 0.15)',
                                textTransform: 'uppercase'
                            }}
                            onMouseEnter={(e) => { if (!isExpired) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { if (!isExpired) e.currentTarget.style.transform = 'none'; }}
                        >
                            {isLoading ? "Analyzing..." : (isExpired ? "Subscription Expired" : "CHECK COMPATIBILITY")}
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
            </div>

            {/* Location Search Modal - Identical to BirthDetailsForm */}
            {showLocModal.active && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(32, 22, 58, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 9999 }}>
                    <div style={{ background: '#fff', border: '1px solid rgba(124, 92, 183, 0.15)', borderRadius: '16px', width: '95%', maxWidth: '440px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--secondary)' }}>Select Location</h3>
                            <button onClick={() => { setShowLocModal({ active: null }); setLocInput(''); setSuggestions([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>COUNTRY</label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    style={{ borderRadius: '8px', border: '1.5px solid rgba(124, 92, 183, 0.15)', outline: 'none', background: '#fcfbfe', width: '100%', padding: '10px', fontSize: '0.9rem', color: 'var(--secondary)' }}
                                >
                                    <option value="in">India 🇮🇳</option>
                                    <option value="us">USA 🇺🇸</option>
                                    <option value="gb">UK 🇬🇧</option>
                                    <option value="ca">Canada 🇨🇦</option>
                                    <option value="au">Australia 🇦🇺</option>
                                    <option value="ae">UAE 🇦🇪</option>
                                    <option value="sg">Singapore 🇸🇬</option>
                                    <option value="my">Malaysia 🇲🇾</option>
                                    <option value="np">Nepal 🇳🇵</option>
                                    <option value="lk">Sri Lanka 🇱🇰</option>
                                </select>
                            </div>
                            
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>SEARCH CITY</label>
                            <input 
                                type="text" 
                                value={locInput} 
                                onChange={e => {
                                    const val = e.target.value;
                                    setLocInput(val);
                                    if (searchTimeout.current) clearTimeout(searchTimeout.current);
                                    if (val.length >= 3) {
                                        searchTimeout.current = setTimeout(() => {
                                            searchLocations(val);
                                        }, 600);
                                    } else {
                                        setSuggestions([]);
                                    }
                                }}
                                placeholder="Search city name..."
                                style={{ width: '100%', padding: '12px', border: '1.5px solid rgba(124, 92, 183, 0.15)', borderRadius: '8px', outline: 'none', background: '#fcfbfe', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text)' }}
                                autoFocus
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                                {isSearching && <div style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Searching...</div>}
                                {suggestions.map((s, i) => (
                                    <button 
                                        type="button"
                                        key={i} 
                                        onClick={() => handleLocationSelect(s)} 
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '8px', background: '#fff', textAlign: 'left', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}
                                    >
                                        <MapPin size={16} style={{ color: 'var(--primary)' }} />
                                        <div>
                                            <div style={{ fontWeight: 800, color: 'var(--secondary)' }}>{s.display_name.split(',')[0]}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.display_name.split(',').slice(1).join(',')}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchMakingForm;
