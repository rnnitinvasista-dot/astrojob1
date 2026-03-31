import React from 'react';
import BirthDetailsForm from '../BirthDetailsForm';
import BNNCrossChart from '../charts/BNNCrossChart';
import type { BNNGroupedPlanets } from '../charts/BNNCrossChart';
import BNNPredictions from './BNNPredictions';
import { getApiUrl } from '../../services/api';
import axios from 'axios';
import type { Planet } from '../../types/astrology';

interface BNNPageProps {
    isAdmin?: boolean;
    isExpired?: boolean;
    view: 'form' | 'result';
    setView: (v: 'form' | 'result') => void;
}

const BNNPage: React.FC<BNNPageProps> = ({ isAdmin, isExpired, view, setView }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [groupedPlanets, setGroupedPlanets] = React.useState<BNNGroupedPlanets | null>(null);
    const [gender, setGender] = React.useState<'Male' | 'Female' | 'Others'>('Male');

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
        setError(null);
        setGender(data.gender || 'Male');

        try {
            const apiUrl = getApiUrl();
            const response = await axios.post(`${apiUrl}/kundli`, {
                birth_details: {
                    date_of_birth: data.date_of_birth,
                    time_of_birth: data.time_of_birth,
                    timezone: "Asia/Kolkata",
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                    place: data.place
                },
                calculation_settings: {
                    ayanamsa: data.ayanamsa || "KP",
                    house_system: "Placidus",
                    node_type: "Mean"
                }
            });

            if (response.data.status === 'success') {
                const planets: Planet[] = response.data.planets;
                
                const grouped: BNNGroupedPlanets = {
                    NORTH: [],
                    EAST: [],
                    SOUTH: [],
                    WEST: []
                };

                const signList = [
                    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
                ];

                planets.forEach(p => {
                    const idx = signList.indexOf(p.sign) + 1;
                    let primaryDir: keyof BNNGroupedPlanets | null = null;
                    let secondaryDir: keyof BNNGroupedPlanets | null = null;

                    if ([1, 5, 9].includes(idx)) {
                        primaryDir = 'EAST';
                        secondaryDir = 'NORTH';
                    } else if ([2, 6, 10].includes(idx)) {
                        primaryDir = 'SOUTH';
                        secondaryDir = 'EAST';
                    } else if ([3, 7, 11].includes(idx)) {
                        primaryDir = 'WEST';
                        secondaryDir = 'SOUTH';
                    } else if ([4, 8, 12].includes(idx)) {
                        primaryDir = 'NORTH';
                        secondaryDir = 'WEST';
                    }

                    if (primaryDir) grouped[primaryDir].push(p);
                    
                    // If retrograde, planet also acts in the previous direction
                    // Rahu and Ketu are always retrograde, so exclude them from this logic
                    const isRahuKetu = p.planet.toUpperCase().startsWith('RA') || p.planet.toUpperCase().startsWith('KE');
                    if (p.is_retrograde && secondaryDir && !isRahuKetu) {
                        grouped[secondaryDir].push(p);
                    }
                });

                setGroupedPlanets(grouped);
                setView('result');
            } else {
                setError(response.data.message || 'Engine failed');
            }
        } catch (err: any) {
            setError(err.message || 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            {view === 'form' && (
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <BirthDetailsForm
                        onSubmit={handleFormSubmit}
                        isLoading={loading}
                        mode={"BNN"}
                        isExpired={isExpired}
                        isAdmin={isAdmin}
                    />
                    
                    {error && (
                        <div style={{ margin: '1rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#b91c1c', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                </div>
            )}

            {view === 'result' && groupedPlanets && (
                <div style={{ animation: 'slideUp 0.5s ease-out', paddingBottom: '2rem' }}>
                    <BNNCrossChart groupedPlanets={groupedPlanets} />
                    <BNNPredictions groupedPlanets={groupedPlanets} gender={gender} />
                </div>
            )}
        </div>
    );
};

export default BNNPage;
