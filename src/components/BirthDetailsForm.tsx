import React, { useState, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Search, MapPin, X, History as HistoryIcon } from 'lucide-react';
import type { BirthDetails } from '../types/astrology';

interface BirthDetailsFormProps {
    onSubmit: (details: BirthDetails) => void;
    isLoading: boolean;
    mode: 'Natal' | 'Prashna' | 'Parashara';
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

const BirthDetailsForm: React.FC<BirthDetailsFormProps> = ({ onSubmit, isLoading, mode, isExpired, initialData }) => {
    const isPrashna = mode === 'Prashna';
    const isNatalOrParashara = mode === 'Natal' || mode === 'Parashara';
    
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
    const [birthSec, setBirthSec] = useState('');

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

        // Only auto-fill for Prashna mode
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

            // Auto-detect location AND Reverse Geocode
            const detectLocation = async () => {
                try {
                    const position = await Geolocation.getCurrentPosition();
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        latitude,
                        longitude
                    }));

                    // Reverse Geocoding
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
            // Restore Natal Defaults - Empty for user entry
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
            setBirthHour(''); setBirthMin(''); setBirthSec('');
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

            // If we have a standard match, use ONLY that and stop
            if (standardMatch) {
                setSuggestions([{
                    display_name: standardMatch.name,
                    lat: standardMatch.lat.toString(),
                    lon: standardMatch.lon.toString()
                }]);
                setIsSearching(false);
                return;
            }

            // Use Open-Meteo Geocoding API — free, no key, CORS-friendly, no rate limits
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=15&language=en&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                setSuggestions([]);
                return;
            }

            // Filter by selected country code
            const countryResults = data.results.filter((r: any) =>
                r.country_code?.toLowerCase() === selectedCountry.toLowerCase()
            );

            // Use country-filtered results, or fallback to all if none match
            const pool = countryResults.length > 0 ? countryResults : data.results;

            const seenCities = new Set<string>();
            const uniqueData: LocationSuggestion[] = [];

            for (const item of pool) {
                const primaryWord = item.name.split(' ')[0].toLowerCase().trim();
                if (!seenCities.has(primaryWord)) {
                    seenCities.add(primaryWord);
                    // Build a readable display name: City, State, Country
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

    return (
        <div className="safe-padding-top" style={{ background: '#ffffff', minHeight: '100vh', padding: '0 1rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', margin: '1rem 0 0', fontWeight: 800, color: '#1e3a8a' }}>
                    {isPrashna ? 'KP Prashna Kundli' : (mode === 'Parashara' ? 'Parashara Kundli' : 'KP Prediction')}
                </h2>
                <div style={{ height: '3px', background: '#3b82f6', width: '60px', margin: '0.75rem auto', borderRadius: '2px' }}></div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isNatalOrParashara && (
                    <div className="parchment-card" style={{ padding: '0', display: 'flex', marginBottom: '1.5rem', overflow: 'hidden' }}>
                        <button
                            onClick={() => setActiveTab('RECENTS')}
                            style={{
                                flex: 1, padding: '1rem', border: 'none',
                                background: activeTab === 'RECENTS' ? 'white' : '#f1f5f9',
                                color: activeTab === 'RECENTS' ? '#3b82f6' : '#64748b',
                                fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            RECENTS
                        </button>
                        <button
                            onClick={() => setActiveTab('NEW')}
                            style={{
                                flex: 1, padding: '1rem', border: 'none',
                                background: activeTab === 'NEW' ? '#3b82f6' : '#f1f5f9',
                                color: activeTab === 'NEW' ? 'white' : '#64748b',
                                fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            NEW
                        </button>
                    </div>
                )}

                {activeTab === 'RECENTS' && isNatalOrParashara ? (
                    <div style={{ minHeight: '300px' }}>
                        {JSON.parse(localStorage.getItem('astro_recents') || '[]').filter((r: any) => String(r.mode) !== 'Prashna').length === 0 ? (
                            <div className="parchment-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                                <HistoryIcon size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                <p>No recent history found</p>
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
                                            className="parchment-card"
                                            style={{
                                                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 800, color: '#1e3a8a' }}>{item.name || 'Unnamed'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                    {item.date_of_birth} | {item.time_of_birth}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '4px' }}>{item.place}</div>
                                            </div>
                                            <Search size={18} color="#cbd5e1" />
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {isNatalOrParashara && (
                            <div className="parchment-card">
                                <label style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Name: *</label>
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.6rem', width: '100%', background: 'white', fontSize: '0.9rem' }}
                                />
                            </div>
                        )}

                        <div className="parchment-card">
                            <label style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Date: * (DD/MM/YYYY)</label>
                            <div className="input-segmented">
                                <input className="segmented-field" style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.5rem' }} type="text" placeholder="DD" maxLength={2} value={birthDay} onChange={(e) => setBirthDay(e.target.value)} />
                                <span style={{ color: 'black', fontWeight: 800 }}>/</span>
                                <input className="segmented-field" style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.5rem' }} type="text" placeholder="MM" maxLength={2} value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} />
                                <span style={{ color: 'black', fontWeight: 800 }}>/</span>
                                <input className="segmented-field" style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.5rem' }} type="text" placeholder="YYYY" maxLength={4} value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
                            </div>
                        </div>

                        <div className="parchment-card">
                            <label style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Time: * (00:00:00 - 24 hrs)</label>
                            <div className="input-segmented">
                                <input className="segmented-field" style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.5rem' }} type="text" placeholder="HH" maxLength={2} value={birthHour} onChange={(e) => setBirthHour(e.target.value)} />
                                <span style={{ color: 'black', fontWeight: 800 }}>:</span>
                                <input className="segmented-field" style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.5rem' }} type="text" placeholder="MM" maxLength={2} value={birthMin} onChange={(e) => setBirthMin(e.target.value)} />
                                <span style={{ color: 'black', fontWeight: 800 }}>:</span>
                                <input className="segmented-field" style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.5rem' }} type="text" placeholder="SS" maxLength={2} value={birthSec} onChange={(e) => setBirthSec(e.target.value)} />
                            </div>
                        </div>

                        <div className="parchment-card" onClick={() => setShowLocationModal(true)} style={{ cursor: 'pointer' }}>
                            <label style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Place: *</label>
                            <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{formData.place}</span>
                                <MapPin size={18} color="black" />
                            </div>
                        </div>


                        <div className="parchment-card">
                            <label style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Gender</label>
                            <div className="radio-group">
                                {['Male', 'Female', 'Others'].map((g) => (
                                    <label key={g} className="radio-item" style={{ fontSize: '0.9rem', color: '#1e3a8a' }}>
                                        <input
                                            type="radio" name="gender" value={g}
                                            checked={formData.gender === g}
                                            onChange={() => setFormData({ ...formData, gender: g as any })}
                                            style={{ accentColor: 'black', width: '20px', height: '20px' }}
                                        />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {isPrashna ? (
                            <div className="parchment-card">
                                <label style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Enter number from 1 to 249 *</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={249}
                                    placeholder="1 - 249"
                                    value={formData.horary_number || ''}
                                    onChange={(e) => setFormData({ ...formData, horary_number: parseInt(e.target.value) })}
                                    style={{ border: '1.5px solid #cbd5e1', borderRadius: '0', padding: '0.6rem', width: '100%', background: 'white', fontSize: '0.9rem' }}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="parchment-card">
                                <label style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>Ayanamsa:</label>
                                <div style={{ padding: '0.6rem', border: '1.5px solid #cbd5e1', background: '#f8fafc', color: '#1e3a8a', fontWeight: 600, fontSize: '0.9rem' }}>
                                    KP New (Krishnamurti)
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="scroll-button"
                            disabled={isLoading || isExpired}
                            style={{
                                color: isExpired ? '#94a3b8' : '#1e3a8a',
                                borderColor: isExpired ? '#e2e8f0' : '#3b82f6',
                                cursor: isExpired ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Wait...' : (isExpired ? 'Subscription Expired' : (isPrashna ? 'Generate Prashna Kundli' : 'Generate Prediction'))}
                        </button>
                    </form>
                )}
            </div>

            {/* Location Search Modal */}
            {showLocationModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 800, color: '#1e3a8a' }}>Select Location</h3>
                            <button onClick={() => setShowLocationModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="#64748b" />
                            </button>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Select Country</label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    style={{ borderRadius: '0', border: '1.5px solid #cbd5e1', marginBottom: '1rem', background: '#f8fafc' }}
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
                                style={{ borderRadius: '0', border: '1.5px solid #cbd5e1' }}
                            />
                            <ul className="results-list" style={{ marginTop: '1rem' }}>
                                {isSearching && <li style={{ padding: '1rem', color: '#64748b' }}>Searching...</li>}
                                {suggestions.map((s, i) => (
                                    <li key={i} className="result-item" onClick={() => handleSelectLocation(s)}>
                                        <MapPin size={18} color="#3b82f6" />
                                        <div>
                                            <div style={{ fontWeight: 800, color: '#1e3a8a' }}>{s.display_name.split(',')[0]}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.display_name.split(',').slice(1).join(',')}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BirthDetailsForm;
