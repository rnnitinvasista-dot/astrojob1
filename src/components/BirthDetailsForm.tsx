import React, { useState, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Search, MapPin, X, History as HistoryIcon, Shield, Info, User, Moon, Star } from 'lucide-react';
import type { BirthDetails } from '../types/astrology';

interface BirthDetailsFormProps {
    onSubmit: (details: BirthDetails) => void;
    isLoading: boolean;
    mode: 'Natal' | 'Prashna' | 'Parashara' | 'BNN' | 'Yearly' | 'Numerology' | 'MatchMaking';
    onBack?: () => void;
    isExpired?: boolean;
    days?: number | null;
    isAdmin?: boolean;
    initialData?: BirthDetails;
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

const BirthDetailsForm: React.FC<BirthDetailsFormProps> = ({ onSubmit, isLoading, mode, isExpired, initialData, onBack }) => {
    const isPrashna = mode === 'Prashna';
    const isNatalOrParashara = mode === 'Natal' || mode === 'Parashara' || mode === 'BNN' || mode === 'Yearly';
    
    const [activeTab, setActiveTab] = useState<'NEW' | 'RECENTS'>('NEW');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationInput, setLocationInput] = useState('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Defaults
    const [birthDay, setBirthDay] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthHour, setBirthHour] = useState('');
    const [birthMin, setBirthMin] = useState('');
    const [birthSec, setBirthSec] = useState('00');

    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);
    const minRef = useRef<HTMLInputElement>(null);
    const secRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<BirthDetails>({
        name: '',
        gender: 'Male',
        date_of_birth: '',
        time_of_birth: '',
        timezone: 'Asia/Kolkata',
        latitude: 12.9666,
        longitude: 77.5833,
        place: '',
        ayanamsa: 'KP'
    });

    const [selectedCountry, setSelectedCountry] = useState('in'); // Default to India

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.date_of_birth) {
                const [y, m, d] = initialData.date_of_birth.split('-');
                setBirthYear(y); setBirthMonth(m); setBirthDay(d);
            }
            if (initialData.time_of_birth) {
                const [h, min, s] = initialData.time_of_birth.split(':');
                setBirthHour(h); setBirthMin(min); setBirthSec(s || '00');
            }
            return;
        }

        if (mode === 'Prashna') {
            const now = new Date();
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = String(now.getFullYear());
            const h = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');

            setBirthDay(d);
            setBirthMonth(m);
            setBirthYear(y);
            setBirthHour(h);
            setBirthMin(min);
            setBirthSec(s);

            setFormData(prev => ({
                ...prev,
                date_of_birth: `${y}-${m}-${d}`,
                time_of_birth: `${h}:${min}:${s}`,
                name: 'Prashna Query',
                place: 'Detecting Location...'
            }));

            // Geolocation auto detect
            const detectLocation = async () => {
                try {
                    const position = await Geolocation.getCurrentPosition();
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({ ...prev, latitude, longitude }));

                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    if (data.address) {
                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || "";
                        const state = data.address.state || "";

                        let resultName = "";
                        if (city && state) resultName = `${city}, ${state}`;
                        else if (city) resultName = city;
                        else if (state) resultName = state;
                        else {
                            const parts = data.display_name.split(',');
                            resultName = parts.slice(Math.max(0, parts.length - 3), parts.length - 1).join(', ').trim();
                        }
                        setFormData(prev => ({ ...prev, place: resultName }));
                    } else if (data.display_name) {
                        const parts = data.display_name.split(',');
                        const resultName = parts.slice(Math.max(0, parts.length - 3), parts.length - 1).join(', ').trim();
                        setFormData(prev => ({ ...prev, place: resultName }));
                    } else {
                        setFormData(prev => ({ ...prev, place: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    }
                } catch (err) {
                    console.error("Geolocation error:", err);
                    setFormData(prev => ({ ...prev, place: "Bengaluru, Karnataka, India" }));
                }
            };
            detectLocation();
        } else {
            setFormData(prev => ({
                ...prev,
                name: '',
                date_of_birth: '',
                time_of_birth: '',
                place: '',
                latitude: 12.9666,
                longitude: 77.5833
            }));
            setBirthDay(''); setBirthMonth(''); setBirthYear('');
            setBirthHour(''); setBirthMin(''); setBirthSec('00');
        }
    }, [mode, isPrashna, initialData]);

    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);

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

    const handleSelectLocation = (s: LocationSuggestion) => {
        setFormData(prev => ({
            ...prev,
            latitude: parseFloat(s.lat),
            longitude: parseFloat(s.lon),
            place: s.display_name
        }));
        setShowLocationModal(false);
    };

    const handleInputChange = (
        value: string, 
        setter: (val: string) => void, 
        maxLength: number, 
        nextRef?: React.RefObject<HTMLInputElement | null>
    ) => {
        const cleaned = value.replace(/[^0-9]/g, '');
        setter(cleaned);
        if (cleaned.length === maxLength && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    const handleClearAll = () => {
        setFormData(prev => ({
            ...prev,
            name: '',
            date_of_birth: '',
            time_of_birth: '',
            place: '',
            latitude: 12.9666,
            longitude: 77.5833
        }));
        setBirthDay('');
        setBirthMonth('');
        setBirthYear('');
        setBirthHour('');
        setBirthMin('');
        setBirthSec('00');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const d = birthDay.padStart(2, '0');
        const m = birthMonth.padStart(2, '0');
        const y = birthYear;
        const h = birthHour.padStart(2, '0');
        const min = birthMin.padStart(2, '0');
        const s = birthSec.padStart(2, '0');

        const finalData = {
            ...formData,
            date_of_birth: `${y}-${m}-${d}`,
            time_of_birth: `${h}:${min}:${s}`
        };
        onSubmit(finalData);
    };

    const getBreadcrumbLabel = () => {
        switch (mode) {
            case 'Natal': return 'Birth Chart';
            case 'Prashna': return 'Prashana Kundali';
            case 'BNN': return 'Bhrigu Nandi Nadi';
            case 'Yearly': return 'Yearly Prediction';
            case 'Numerology': return 'Numerology';
            case 'MatchMaking': return 'Match Making';
            case 'Parashara': return 'Parashara Kundli';
            default: return 'Astrology Tool';
        }
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
                            <span style={{ cursor: 'pointer' }} onClick={onBack}>{getBreadcrumbLabel()}</span>
                            <span>&gt;</span>
                            <span style={{ color: 'var(--primary)' }}>Birth Details</span>
                        </div>
                        {/* Title */}
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--secondary)', margin: '0 0 0.5rem' }}>
                            Let's Start with Your Birth Details
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, fontWeight: 400 }}>
                            Accurate birth details help us generate your precise birth chart and personalized insights.
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

                {/* Form recents switcher (only for non-prashna) */}
                {isNatalOrParashara && (
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
                )}

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
                        {activeTab === 'RECENTS' && isNatalOrParashara ? (
                            <div style={{ minHeight: '320px' }}>
                                {JSON.parse(localStorage.getItem('astro_recents') || '[]').filter((r: any) => String(r.mode) !== 'Prashna').length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
                                        <HistoryIcon size={48} style={{ marginBottom: '1rem', opacity: 0.3, color: 'var(--primary)' }} />
                                        <p style={{ fontSize: '0.9rem', margin: 0 }}>No recent history found</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {JSON.parse(localStorage.getItem('astro_recents') || '[]')
                                            .filter((r: any) => String(r.mode) !== 'Prashna')
                                            .map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => {
                                                        setFormData(item);
                                                        const [y, m, d] = item.date_of_birth.split('-');
                                                        setBirthYear(y); setBirthMonth(m); setBirthDay(d);
                                                        const [h, min, s] = item.time_of_birth.split(':');
                                                        setBirthHour(h); setBirthMin(min); setBirthSec(s);
                                                        setActiveTab('NEW');
                                                    }}
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
                                                            {item.date_of_birth} | {item.time_of_birth}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 600 }}>{item.place}</div>
                                                    </div>
                                                    <Search size={18} style={{ color: 'var(--primary)' }} />
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
                                    {isNatalOrParashara && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>FULL NAME</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                    )}

                                    {/* Date input (using segments DD MM YYYY but looking clean and rounded) */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>DATE OF BIRTH</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input 
                                                ref={dayRef}
                                                type="text" 
                                                placeholder="DD" 
                                                maxLength={2} 
                                                value={birthDay} 
                                                onChange={(e) => handleInputChange(e.target.value, setBirthDay, 2, monthRef)} 
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
                                                value={birthMonth} 
                                                onChange={(e) => handleInputChange(e.target.value, setBirthMonth, 2, yearRef)} 
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
                                                value={birthYear} 
                                                onChange={(e) => handleInputChange(e.target.value, setBirthYear, 4, hourRef)} 
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

                                    {/* Time of birth HH:MM:SS */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>TIME OF BIRTH</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input 
                                                ref={hourRef}
                                                type="text" 
                                                placeholder="HH" 
                                                maxLength={2} 
                                                value={birthHour} 
                                                onChange={(e) => handleInputChange(e.target.value, setBirthHour, 2, minRef)} 
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
                                            <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>:</span>
                                            <input 
                                                ref={minRef}
                                                type="text" 
                                                placeholder="MM" 
                                                maxLength={2} 
                                                value={birthMin} 
                                                onChange={(e) => handleInputChange(e.target.value, setBirthMin, 2, secRef)} 
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
                                            <span style={{ color: 'rgba(124, 92, 183, 0.3)', fontWeight: 700 }}>:</span>
                                            <input 
                                                ref={secRef}
                                                type="text" 
                                                placeholder="SS" 
                                                maxLength={2} 
                                                value={birthSec} 
                                                onChange={(e) => handleInputChange(e.target.value, setBirthSec, 2)} 
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
                                        </div>
                                    </div>

                                    {/* Place Input */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer' }} onClick={() => setShowLocationModal(true)}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>BIRTH PLACE</label>
                                        <div style={{
                                            border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                            borderRadius: '8px',
                                            padding: '0.7rem 0.9rem',
                                            background: 'white',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.9rem',
                                            color: formData.place ? 'var(--text)' : '#94a3b8'
                                        }}>
                                            <span>{formData.place || 'Select Place'}</span>
                                            <MapPin size={18} style={{ color: 'var(--primary)' }} />
                                        </div>
                                    </div>

                                    {/* Gender Input */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>GENDER</label>
                                        <div style={{ display: 'flex', gap: '1.5rem', height: '42px', alignItems: 'center' }}>
                                            {['Male', 'Female', 'Others'].map((g) => (
                                                <label key={g} style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="radio" name="gender" value={g}
                                                        checked={formData.gender === g}
                                                        onChange={() => setFormData({ ...formData, gender: g as any })}
                                                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                                    />
                                                    {g}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Prashna or Ayanamsa Option block */}
                                    {isPrashna ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>HORARY NUMBER (1-249)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={249}
                                                placeholder="1 - 249"
                                                value={formData.horary_number || ''}
                                                onChange={(e) => setFormData({ ...formData, horary_number: parseInt(e.target.value) })}
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
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>AYANAMSA</label>
                                            <select
                                                value={formData.ayanamsa || 'KP'}
                                                onChange={(e) => setFormData({ ...formData, ayanamsa: e.target.value })}
                                                style={{
                                                    padding: '0.7rem 0.9rem',
                                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                                    borderRadius: '8px',
                                                    background: 'white',
                                                    color: 'var(--text)',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="KP">KP New (Krishnamurti)</option>
                                                <option value="Newcomb">Newcomb Ayanamsa</option>
                                                <option value="Lahiri">Lahiri Ayanamsa</option>
                                            </select>
                                        </div>
                                    )}

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
                                        disabled={isLoading || isExpired}
                                        style={{
                                            background: isExpired ? '#e2e8f0' : 'var(--primary)',
                                            color: isExpired ? '#94a3b8' : 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '0.9rem 2.2rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            fontSize: '0.85rem',
                                            cursor: isExpired ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: isExpired ? 'none' : '0 4px 10px rgba(124, 92, 183, 0.15)',
                                            textTransform: 'uppercase'
                                        }}
                                        onMouseEnter={(e) => { if (!isLoading && !isExpired) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                                    >
                                        {isLoading ? 'WAIT...' : (isExpired ? 'SUBSCRIPTION EXPIRED' : (isPrashna ? 'GENERATE PRASHNA KUNDLI' : 'GENERATE CHART'))}
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
                            Your birth chart is a map of the sky at the moment you were born.
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

            {/* Location Search Modal */}
            {showLocationModal && (
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
                        padding: '1.5rem',
                        borderRadius: '16px',
                        maxWidth: '450px',
                        width: '100%',
                        position: 'relative',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid rgba(124, 92, 183, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                            <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--secondary)', fontSize: '1.1rem' }}>Select Location</h3>
                            <button onClick={() => setShowLocationModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '6px' }}>SELECT COUNTRY</label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                    background: '#f8fafc',
                                    padding: '0.6rem',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    fontFamily: 'inherit'
                                }}
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

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '6px' }}>SEARCH CITY NAME</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search city name..."
                                    value={locationInput}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setLocationInput(val);
                                        
                                        if (searchTimeout.current) {
                                            clearTimeout(searchTimeout.current);
                                        }
                                        
                                        if (val.length >= 3) {
                                            searchTimeout.current = setTimeout(() => {
                                                searchLocations(val);
                                            }, 600);
                                        } else {
                                            setSuggestions([]);
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        border: '1.5px solid rgba(124, 92, 183, 0.15)',
                                        padding: '0.6rem 2rem 0.6rem 0.8rem',
                                        outline: 'none',
                                        fontSize: '0.9rem',
                                        fontFamily: 'inherit'
                                    }}
                                />
                                <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            </div>
                        </div>

                        <ul style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            padding: 0,
                            margin: 0,
                            listStyle: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        }}>
                            {isSearching && <li style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Searching...</li>}
                            {suggestions.map((s, i) => (
                                <li
                                    key={i}
                                    onClick={() => handleSelectLocation(s)}
                                    style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        alignItems: 'center',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: '#f8fafc',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                                >
                                    <MapPin size={18} style={{ color: 'var(--primary)' }} />
                                    <div>
                                        <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.85rem' }}>{s.display_name.split(',')[0]}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.display_name.split(',').slice(1).join(',')}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BirthDetailsForm;
