import { useState, useEffect } from 'react';
import Layout from './components/ui/Layout';
import BirthDetailsForm from './components/BirthDetailsForm';
import Dashboard from './components/Dashboard';
import HouseTable from './components/tables/HouseTable';
import axios from 'axios';
import PremiumSouthIndianChart from './components/charts/PremiumSouthIndianChart';
import PlanetTable from './components/tables/PlanetTable';
import DashaTable from './components/tables/DashaTable';
import NakshatraNadiTable from './components/tables/NakshatraNadiTable';
import JobPredictionTable from './components/tables/JobPredictionTable';
import AdvancePredictionTable from './components/tables/AdvancePredictionTable';
import PowerPositionTable from './components/tables/PowerPositionTable';
import { getApiUrl, fetchMixedPrashna } from './services/api';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import { AlertCircle, Lock, X } from 'lucide-react';
import PhaladeepikaTable from './components/tables/PhaladeepikaTable';
import AIBotContent from './components/AIBotContent';
import { App as CapApp } from '@capacitor/app';

// Types
interface KundliResponse {
  ascendant: any;
  houses: any[];
  planets: any[];
  aspects: any[];
  nakshatra_nadi: any[];
  significations: any[];
  varga_charts?: any;
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


const NADI_PLANET_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

const sortPlanetsByNadi = <T,>(planets: T[], getName: (p: T) => string): T[] => {
  return [...planets].sort((a, b) => {
    const idxA = NADI_PLANET_ORDER.indexOf(getName(a));
    const idxB = NADI_PLANET_ORDER.indexOf(getName(b));
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
};

const App = () => {
  const [view, setView] = useState<'dashboard' | 'form' | 'result'>('dashboard');
  const [mode, setMode] = useState<'Natal' | 'Prashna' | 'Parashara'>('Natal');
  const [kundliData, setKundliData] = useState<KundliResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'planets' | 'dasha' | 'houses' | 'predictions' | 'advance_predictions' | 'nadi' | 'phala' | 'power_position' | 'analysis'>('planets');
  const [showPlanetTable, setShowPlanetTable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [birthDetails, setBirthDetails] = useState<any>(null);
  const [chartMode, setChartMode] = useState<'Rashi' | 'Bhava'>('Bhava');
  const [selectedArea, setSelectedArea] = useState('Job');
  const [showAccessPopup, setShowAccessPopup] = useState(false);
  const [chartStyle, setChartStyle] = useState<'South Indian' | 'North Indian'>('South Indian');

  const { currentUser, userData, isExpired, logout } = useAuth();

  useEffect(() => {
    // Keep backend awake every 10 minutes while app is open
    const interval = setInterval(() => {
      import('./services/api').then(m => m.pingBackend());
    }, 600000); 
    
    // Immediate ping on load
    import('./services/api').then(m => m.pingBackend());
    
    return () => clearInterval(interval);
  }, []);

  // Handle Capacitor Back Button
  useEffect(() => {
    let backListener: any;
    
    const setupBackListener = async () => {
      backListener = await CapApp.addListener('backButton', () => {
        if (view === 'result') {
          setView('form');
        } else if (view === 'form') {
          setView('dashboard');
        } else if (view === 'dashboard') {
          CapApp.exitApp();
        }
      });
    };

    setupBackListener();

    return () => {
      if (backListener) backListener.remove();
    };
  }, [view]);

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

  const handleModeSelect = (selectedMode: 'Natal' | 'Prashna' | 'Parashara') => {
    setMode(selectedMode);
    setBirthDetails(null);
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
        if (mode === 'Parashara') {
          setChartMode('Rashi');
        }
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
              background: 'var(--primary-light)',
              padding: '4px',
              borderRadius: '12px',
              gap: '4px',
              width: 'fit-content',
              margin: '0 auto',
              border: '2px solid #000000'
            }}>
              <button
                onClick={() => {
                  setChartMode('Rashi');
                  if ((activeTab as string) === 'predictions' || (activeTab as string) === 'houses' || (activeTab as string) === 'nadi' || (activeTab as string) === 'phala') {
                    setActiveTab('planets');
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '0',
                  border: 'none',
                  background: chartMode === 'Rashi' ? 'var(--primary)' : 'transparent',
                  color: chartMode === 'Rashi' ? '#000000' : 'var(--text-muted)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Rashi Chart
              </button>
               <button
                onClick={() => {
                  const hasAccess = userData?.role === 'admin' || userData?.hasKPAccess;
                  if (!hasAccess) {
                    setShowAccessPopup(true);
                  } else {
                    setChartMode('Bhava');
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '0',
                  border: 'none',
                  background: chartMode === 'Bhava' ? 'var(--primary)' : 'transparent',
                  color: chartMode === 'Bhava' ? '#000000' : 'var(--text-muted)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                KP Bhava Chart
                {!(userData?.role === 'admin' || userData?.hasKPAccess) && <Lock size={14} style={{ opacity: 0.7 }} />}
              </button>
            </div>

            <PremiumSouthIndianChart
              planets={kundliData.planets}
              ascendant={kundliData.ascendant}
              birthDetails={birthDetails}
              vargaCharts={kundliData.varga_charts}
              chartMode={chartMode === 'Rashi' ? 'Rashi' : 'Bhava'}
              chartStyle={chartStyle}
              janmaNakshatra={kundliData.metadata.janma_nakshatra}
              pada={kundliData.metadata.pada}
              rashi={kundliData.planets.find(p => p.planet === 'Moon')?.sign}
            />

            <button
              onClick={() => setShowPlanetTable(!showPlanetTable)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--primary)',
                border: '3px solid #000000',
                borderRadius: '0',
                color: '#000000',
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

            {showPlanetTable && <PlanetTable planets={kundliData.planets} ascendant={kundliData.ascendant} dasha={kundliData.dasha} />}
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
            <div style={{ padding: '8px', margin: '1rem 0', background: 'var(--primary-light)', borderRadius: '0', border: 'none' }}>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '0', border: '2px solid #000000', background: 'white', fontWeight: 'bold', color: 'var(--text)' }}
              >
                <option>Job</option>
                <option>Business</option>
                <option>Education</option>
                <option>Marriage</option>
                <option>Child Birth</option>
                <option>Health</option>
                <option>Travel</option>
                <option>Property &amp; Vehicle</option>
              </select>
            </div>

            {sortPlanetsByNadi(kundliData.planets, p => p.planet).map((p: any) => {
              const planetName = p.planet;
              const activeTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
              if (planetName === kundliData.dasha.current_dasha) activeTypes.push('Dasha');
              if (planetName === kundliData.dasha.current_bukthi) activeTypes.push('Bhukti');
              if (planetName === kundliData.dasha.current_antara) activeTypes.push('Antara');

              return (
                <JobPredictionTable
                  key={`${planetName}-${selectedArea}`}
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
      case 'advance_predictions':
        if (!(userData?.role === 'admin' || userData?.hasAdvancePredictionsAccess)) {
          return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              <Lock size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontWeight: 800 }}>ACCESS DENIED</h3>
              <p>You need specific permission to view Advance Predictions.</p>
            </div>
          );
        }
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ padding: '8px', margin: '1rem 0', background: 'var(--primary-light)', borderRadius: '0', border: 'none' }}>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '0', border: '2px solid #000000', background: 'white', fontWeight: 'bold', color: 'var(--text)' }}
              >
                <option>Job</option>
                <option>Business</option>
                <option>Education</option>
                <option>Marriage</option>
                <option>Child Birth</option>
                <option>Health</option>
              </select>
            </div>

            {sortPlanetsByNadi(kundliData.planets, p => p.planet).map((p: any) => {
              const planetName = p.planet;
              const activeTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
              if (planetName === kundliData.dasha.current_dasha) activeTypes.push('Dasha');
              if (planetName === kundliData.dasha.current_bukthi) activeTypes.push('Bhukti');
              if (planetName === kundliData.dasha.current_antara) activeTypes.push('Antara');

              return (
                <AdvancePredictionTable
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
      case 'power_position':
        if (!(userData?.role === 'admin' || userData?.hasPowerPositionAccess)) {
          return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              <Lock size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontWeight: 800 }}>ACCESS DENIED</h3>
              <p>You need specific permission to view Remedies.</p>
            </div>
          );
        }
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <PowerPositionTable 
              data={sortPlanetsByNadi(kundliData.nakshatra_nadi, (item: any) => item.planet)}
              planets={kundliData.planets}
              dasha={kundliData.dasha}
            />
          </div>
        );
      case 'phala':
        const signList = [
          "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
          "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ];
        const rulerMap: Record<string, string> = {
          "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
          "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
          "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        };
        
        const ascSignIdx = signList.indexOf(kundliData.ascendant.sign);
        
        // Calculate House Lords (Lords of 1st to 12th)
        const houseLords: Record<number, string> = {};
        for (let i = 1; i <= 12; i++) {
          const houseSignIdx = (ascSignIdx + i - 1) % 12;
          const houseSign = signList[houseSignIdx];
          houseLords[i] = rulerMap[houseSign];
        }

        const planetsForPhala = kundliData.planets.map((p: any) => {
          const currentSign = p.sign?.trim();
          const currentSignIdx = signList.findIndex(s => s.toLowerCase() === currentSign?.toLowerCase());
          const houseNum = currentSignIdx !== -1 ? ((currentSignIdx - ascSignIdx + 12) % 12 + 1) : 1;
          return {
            planet: p.planet,
            house: houseNum,
            sign: p.sign
          };
        });

        const sun = planetsForPhala.find(p => p.planet === 'Sun');
        const isDayBirth = sun ? (sun.house >= 7 && sun.house <= 12) : true;

        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <PhaladeepikaTable 
              planets={planetsForPhala} 
              houseLords={houseLords}
              isDayBirth={isDayBirth}
              gender={birthDetails?.gender}
            />
          </div>
        );
      case 'analysis':
        if (!(userData?.role === 'admin' || userData?.hasAnalysisAccess)) {
          return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              <Lock size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontWeight: 800 }}>ACCESS DENIED</h3>
              <p>You need specific permission to view AI Analysis.</p>
            </div>
          );
        }
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <AIBotContent kundliData={kundliData} selectedArea={selectedArea} />
          </div>
        );
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

  const getPageTitle = () => {
    if (view === 'dashboard') return '';
    if (view === 'form') {
      return mode === 'Prashna' ? 'KP Prashna' : 
             mode === 'Parashara' ? 'Parashara Kundli' : 'KP Prediction';
    }
    if (view === 'result') {
      return mode === 'Prashna' ? 'KP Prashna Kundli' : 
             mode === 'Parashara' ? `Parashara ${chartMode}` : 
             `KP ${chartMode} Prediction`;
    }
    return '';
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab as (tab: string) => void}
      showTabs={view === 'result'}
      isAdmin={userData?.role === 'admin'}
      expiryDate={userData?.expiryDate}
      onLogout={logout}
      currentView={view}
      chartMode={chartMode}
      chartStyle={chartStyle}
      onChartStyleChange={setChartStyle}
      title={getPageTitle()}
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
              Your membership has expired. Please contact Ankita (Admin) to renew your access immediately.
            </p>
            <div style={{ marginTop: '0.8rem', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '0.9rem', color: '#991b1b', fontWeight: 700 }}>
              Email: ankitarn17@gmail.com | Ph: 9741689125
            </div>
          </div>
        )}

        <>
          {view === 'dashboard' && (
            <Dashboard 
              onSelect={handleModeSelect} 
              hasKPAccess={userData?.hasKPAccess}
              isAdmin={userData?.role === 'admin'}
            />
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
                 initialData={birthDetails}
               />
              {error && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#b91c1c', textAlign: 'center' }}>
                  {error}
                </div>
              )}
            </div>
          )}


          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }}></div>
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

      {showAccessPopup && (
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
            background: 'var(--secondary-light)',
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
              onClick={() => setShowAccessPopup(false)}
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
              onClick={() => setShowAccessPopup(false)}
              style={{
                marginTop: '1.5rem',
                padding: '10px 24px',
                background: 'var(--primary)',
                color: '#000000',
                border: '2px solid #000000',
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
    </Layout>
  );
};

export default App;
