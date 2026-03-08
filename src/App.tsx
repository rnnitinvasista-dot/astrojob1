import { useState } from 'react';
import Layout from './components/ui/Layout';
import BirthDetailsForm from './components/BirthDetailsForm';
import Dashboard from './components/Dashboard';
import HouseTable from './components/tables/HouseTable';
import axios from 'axios';
import SouthIndianChart from './components/SouthIndianChart';
import PlanetTable from './components/tables/PlanetTable';
import DashaTable from './components/tables/DashaTable';
import NakshatraNadiTable from './components/tables/NakshatraNadiTable';
import JobPredictionTable from './components/tables/JobPredictionTable';
import { getApiUrl, fetchMixedPrashna } from './services/api';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import { AlertCircle } from 'lucide-react';

// Types
interface KundliResponse {
  ascendant: any;
  houses: any[];
  planets: any[];
  aspects: any[];
  nakshatra_nadi: any[];
  dasha: {
    balance_at_birth: string;
    current_dasha: string;
    current_bukthi: string;
    current_antara: string;
    current_pratyantar?: string;
    current_sookshma?: string;
    mahadasha_sequence: any[];
  };
  metadata: {
    ayanamsa: string;
    ayanamsa_value: string;
    janma_nakshatra: string;
    pada: number;
    horary_number?: number;
  };
}


const App = () => {
  const [view, setView] = useState<'dashboard' | 'form' | 'result'>('dashboard');
  const [mode, setMode] = useState<'Natal' | 'Prashna'>('Natal');
  const [kundliData, setKundliData] = useState<KundliResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('planets');
  const [showPlanetTable, setShowPlanetTable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [birthDetails, setBirthDetails] = useState<any>(null);
  const [chartMode, setChartMode] = useState<'Rashi' | 'Bhava'>('Bhava');
  const [selectedArea, setSelectedArea] = useState('Job');

  const { currentUser, userData, isExpired, logout } = useAuth();

  // Wakeup Ping for Render
  useState(() => {
    const wakeup = async () => {
      try {
        await axios.get(`${getApiUrl()}/health`);
        console.log("🚀 Server wakeup ping sent!");
      } catch (e) {
        console.warn("Server wakeup ping failed (probably still starting up)");
      }
    };
    wakeup();
  });

  const handleModeSelect = (selectedMode: 'Natal' | 'Prashna') => {
    setMode(selectedMode);
    setView('form');
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setBirthDetails(data);

    // Save to recents
    const recents = JSON.parse(localStorage.getItem('astro_recents') || '[]');
    const newRecent = { ...data, id: Date.now(), mode };
    localStorage.setItem('astro_recents', JSON.stringify([newRecent, ...recents.slice(0, 9)]));

    try {
      let responseData: any;
      if (mode === 'Prashna') {
        const prashnaRequest = {
          birth_details: {
            date_of_birth: data.date_of_birth,
            time_of_birth: data.time_of_birth,
            timezone: "Asia/Kolkata",
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            place: data.place
          },
          horary_number: data.horary_number
        };
        responseData = await fetchMixedPrashna(prashnaRequest);
      } else {
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
        responseData = response.data;
      }

      if (responseData.status === 'success') {
        setKundliData(responseData);
        setActiveTab('planets');
        setShowPlanetTable(false);
        setView('result');
      } else {
        setError(responseData.message || 'Engine failed');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!kundliData) return null;

    switch (activeTab) {
      case 'planets':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Chart Mode Toggle */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '12px',
              gap: '4px',
              width: 'fit-content',
              margin: '0 auto'
            }}>
              <button
                onClick={() => setChartMode('Rashi')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: chartMode === 'Rashi' ? '#3b82f6' : 'transparent',
                  color: chartMode === 'Rashi' ? 'white' : '#64748b',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Rashi Chart
              </button>
              <button
                onClick={() => setChartMode('Bhava')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: chartMode === 'Bhava' ? '#3b82f6' : 'transparent',
                  color: chartMode === 'Bhava' ? 'white' : '#64748b',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                KP Bhava Chart
              </button>
            </div>

            <SouthIndianChart
              planets={kundliData.planets}
              ascendant={kundliData.ascendant}
              houses={kundliData.houses}
              birthDetails={birthDetails}
              chartType={chartMode}
              meta={{
                balance: kundliData.dasha.balance_at_birth,
                nakshatra: kundliData.metadata?.janma_nakshatra,
                pada: kundliData.metadata?.pada,
                moonSign: kundliData.planets.find(p => p.planet === 'Moon')?.sign
              }}
            />

            <button
              onClick={() => setShowPlanetTable(!showPlanetTable)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#eff6ff',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                color: '#1e3a8a',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {showPlanetTable ? 'Hide KP Planets Table' : 'Show KP Planets Table'}
            </button>

            {showPlanetTable && <PlanetTable planets={kundliData.planets} />}
          </div>
        );
      case 'houses':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <HouseTable houses={kundliData.houses} planets={kundliData.planets} />
          </div>
        );
      case 'nadi':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <NakshatraNadiTable data={kundliData.nakshatra_nadi} />
          </div>
        );
      case 'predictions':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ padding: '8px', margin: '1rem 0', background: '#eff6ff', borderRadius: '12px', border: '1px solid #3b82f6' }}>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3b82f6', background: 'white', fontWeight: 'bold', color: '#1e3a8a' }}
              >
                <option>Job</option>
                <option>Business</option>
                <option>Education</option>
                <option>Marriage</option>
                <option>Child Birth</option>
                <option>Health</option>
              </select>
            </div>

            {kundliData.planets.map((p: any) => {
              const planetName = p.planet;
              const activeTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
              if (planetName === kundliData.dasha.current_dasha) activeTypes.push('Dasha');
              if (planetName === kundliData.dasha.current_bukthi) activeTypes.push('Bhukti');
              if (planetName === kundliData.dasha.current_antara) activeTypes.push('Antara');

              return (
                <JobPredictionTable
                  key={planetName}
                  data={kundliData.nakshatra_nadi}
                  planets={kundliData.planets}
                  types={activeTypes}
                  planetName={planetName}
                  selectedArea={selectedArea}
                />
              );
            })}
          </div>
        );
      case 'significations':
        return null; // Hidden as requested
      case 'dasha':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <DashaTable dasha={kundliData.dasha} />
          </div>
        );
      default:
        return null;
    }
  };


  if (!currentUser) {
    return <LoginPage />;
  }

  const pulseStyle = `
            @keyframes pulse {
              0 % { transform: scale(1); opacity: 1; }
      50% {transform: scale(1.02); opacity: 0.8; }
            100% {transform: scale(1); opacity: 1; }
    }
            `;

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showTabs={view === 'result'}
      isAdmin={userData?.role === 'admin'}
      expiryDate={userData?.expiryDate}
      onLogout={logout}
      currentView={view}
      onBack={() => {
        if (view === 'result') {
          setView('form');
        } else if (view === 'form') {
          setView('dashboard');
        } else {
          setView('dashboard');
        }
      }}
    >
      <style>{pulseStyle}</style>
      <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden', padding: 0 }}>
        {isExpired && (
          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            padding: '1.5rem',
            margin: '0.5rem',
            textAlign: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b', margin: '0 0 0.5rem' }}>Subscription Over!</h2>
            <p style={{ color: '#b91c1c', fontWeight: 500, margin: 0 }}>
              Your membership has expired. Please contact Ankit (Admin) to renew your access immediately.
            </p>
            <div style={{ marginTop: '1rem', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '0.8rem', color: '#991b1b' }}>
              User ID: {currentUser.uid}
            </div>
          </div>
        )}

        <>
          {view === 'dashboard' && (
            <Dashboard onSelect={handleModeSelect} />
          )}

          {view === 'form' && (
            <div style={{ animation: 'slideUp 0.5s ease-out' }}>
              <BirthDetailsForm
                onSubmit={handleFormSubmit}
                isLoading={loading}
                mode={mode}
                isExpired={isExpired}
                onBack={() => setView('dashboard')}
                days={userData?.expiryDate ? Math.ceil((new Date(userData.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null}
                isAdmin={userData?.role === 'admin'}
              />
              {error && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#b91c1c', textAlign: 'center' }}>
                  {error}
                </div>
              )}
            </div>
          )}


          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#1d4ed8', fontWeight: 600 }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }}></div>
              Generating Precision Kundli...
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {view === 'result' && kundliData && !loading && (
            <div className="results-view">
              {renderTabContent()}
            </div>
          )}
        </>

        <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem', fontWeight: 500 }}>
            KP Astrology Precision
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default App;
