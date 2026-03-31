import { useState, useEffect } from 'react';
import Layout from './components/ui/Layout';
import BirthDetailsForm from './components/BirthDetailsForm';
import Dashboard from './components/Dashboard';
import HouseTable from './components/tables/HouseTable';
import axios from 'axios';
import PremiumSouthIndianChart from './components/charts/PremiumSouthIndianChart';
import YearlyPrediction from './components/predictions/YearlyPrediction';
import PlanetTable from './components/tables/PlanetTable';
import DashaTable from './components/tables/DashaTable';
import NakshatraNadiTable from './components/tables/NakshatraNadiTable';
import JobPredictionTable from './components/tables/JobPredictionTable';
import AdvV1PredictionTable from './components/tables/AdvV1PredictionTable';
import AdvancePredictionTable from './components/tables/AdvancePredictionTable';
import PowerPositionTable from './components/tables/PowerPositionTable';
import { getApiUrl, fetchMixedPrashna } from './services/api';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import { AlertCircle, Lock, X } from 'lucide-react';
import PhaladeepikaTable from './components/tables/PhaladeepikaTable';
import AIBotContent from './components/AIBotContent';
import AdminPortal from './components/admin/AdminPortal';
import BNNPage from './components/bnn/BNNPage';
import DChartResultTable from './components/tables/DChartResultTable';
import { App as CapApp } from '@capacitor/app';
import { Geolocation } from '@capacitor/geolocation';

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

const isPlanetMatch = (p1: string, p2: string) => {
  const s1 = (p1 || '').toUpperCase();
  const s2 = (p2 || '').toUpperCase();
  return s1 === s2 || s1.startsWith(s2) || s2.startsWith(s1);
};

const sortPlanetsWithDasha = <T,>(planets: T[], getName: (p: T) => string, dasha: any): T[] => {
  const activeDasha = dasha?.current_dasha;
  const activeBukthi = dasha?.current_bukthi;
  const activeAntara = dasha?.current_antara;

  return [...planets].sort((a, b) => {
    const nameA = getName(a);
    const nameB = getName(b);

    const getPriority = (name: string) => {
      if (isPlanetMatch(name, activeDasha)) return 1;
      if (isPlanetMatch(name, activeBukthi)) return 2;
      if (isPlanetMatch(name, activeAntara)) return 3;
      return 10;
    };

    const prioA = getPriority(nameA);
    const prioB = getPriority(nameB);

    if (prioA !== prioB) return prioA - prioB;

    const idxA = NADI_PLANET_ORDER.findIndex(p => isPlanetMatch(nameA, p));
    const idxB = NADI_PLANET_ORDER.findIndex(p => isPlanetMatch(nameB, p));
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
};

const sortPlanetsByNadi = <T,>(planets: T[], getName: (p: T) => string): T[] => {
  return [...planets].sort((a, b) => {
    const idxA = NADI_PLANET_ORDER.indexOf(getName(a));
    const idxB = NADI_PLANET_ORDER.indexOf(getName(b));
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
};

const HOUSE_OPTIONS = [
  "1️⃣ Self/Body/Personality/Appearance",
  "2️⃣ Wealth/Family/Speech/Savings",
  "3️⃣ Efforts/Communication/Siblings/Courage",
  "4️⃣ Home/Property/Vehicle/BasicEducation",
  "5️⃣ Love/Intelligence/Children/Creativity",
  "6️⃣ Service/Job/Health/CompetitiveExams",
  "7️⃣ Marriage/Partner/Business/Agreement",
  "8️⃣ Obstacles/Longevity/Secrets/Transformation",
  "9️⃣ Luck/Religion/HigherEducation/Travel",
  "🔟 Career/Profession/NameFame/Authority",
  "1️⃣1️⃣ Gains/Profit/Fulfillment/Desires",
  "1️⃣2️⃣ Loss/Expenses/Foreign/ForeignTravel"
];



const App = () => {
  const [view, setView] = useState<'dashboard' | 'form' | 'result' | 'admin' | 'bnn'>('dashboard');
  const [mode, setMode] = useState<'Natal' | 'Prashna' | 'Parashara' | 'BNN' | 'Yearly'>('Natal');
  const [kundliData, setKundliData] = useState<KundliResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'planets' | 'dasha' | 'houses' | 'predictions' | 'adv_v1' | 'advance_predictions' | 'nadi' | 'phala' | 'power_position' | 'analysis' | 'yearly' | 'd2' | 'd4' | 'd6' | 'd7' | 'd8' | 'd10' | 'd11' | 'd12'>('planets');
  const [showPlanetTable, setShowPlanetTable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [birthDetails, setBirthDetails] = useState<any>(null);
  const [chartMode, setChartMode] = useState<'Rashi' | 'Bhava'>('Bhava');
  const [selectedArea, setSelectedArea] = useState('Job');
  const [selectedHouse, setSelectedHouse] = useState('None');
  const [showAccessPopup, setShowAccessPopup] = useState(false);
  const [chartStyle, setChartStyle] = useState<'South Indian' | 'North Indian'>('South Indian');
  const [isTransitMode, setIsTransitMode] = useState(false);
  const [transitData, setTransitData] = useState<KundliResponse | null>(null);
  const [loadingTransit, setLoadingTransit] = useState(false);
  const [bnnSubView, setBnnSubView] = useState<'form' | 'result'>('form');

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

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
          if (activeTab !== 'planets') {
            setActiveTab('planets');
          } else {
            setView('form');
          }
        } else if (view === 'bnn') {
          if (bnnSubView === 'result') {
            setBnnSubView('form');
          } else {
            setView('dashboard');
          }
        } else if (view !== 'dashboard') {
          setView('dashboard');
        } else {
          CapApp.exitApp();
        }
      });
    };

    setupBackListener();

    return () => {
      if (backListener) backListener.remove();
    };
  }, [view, activeTab]);

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

  const handleModeSelect = (selectedMode: 'Natal' | 'Prashna' | 'Parashara' | 'BNN' | 'Yearly') => {
    setMode(selectedMode);
    setBirthDetails(null);
    if (selectedMode === 'BNN') {
      setBnnSubView('form');
      setView('bnn');
    } else {
      setView('form');
    }
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
        const isParashara = mode === 'Parashara' || mode.includes('Parashara');
        setActiveTab(mode === 'Yearly' ? 'yearly' : (isParashara ? 'd2' : 'planets'));
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

  const handleTransitToggle = async (active: boolean) => {
    setIsTransitMode(active);
    if (active) {
      setTransitData(null); // Clear old data to show loading/natal fallback correctly
      setLoadingTransit(true);
      try {
        let lat = 12.9716; // Default Bangalore
        let lon = 77.5946;
        
        try {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 5000
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch (geoErr) {
          console.warn("Geolocation failed, using default (Bangalore):", geoErr);
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Use YYYY-MM-DD HH:mm:ss which is widely supported
        const dateStr = `${year}-${month}-${day}`;
        const timeStr = `${hours}:${minutes}:${seconds}`;

        const request = {
          birth_details: {
            date_of_birth: dateStr,
            time_of_birth: timeStr,
            timezone: "Asia/Kolkata",
            latitude: lat,
            longitude: lon,
            place: "Current Location"
          },
          calculation_settings: {
            ayanamsa: birthDetails?.ayanamsa || "KP",
            house_system: "Placidus",
            node_type: "Mean"
          }
        };

        const response = await axios.post(`${getApiUrl()}/kundli`, request);
        if (response.data.status === 'success') {
          setTransitData(response.data);
        } else {
          console.error("API returned error for transit:", response.data);
        }
      } catch (err) {
        console.error("Transit fetch failed:", err);
      } finally {
        setLoadingTransit(false);
      }
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

            {showPlanetTable && (
              <PlanetTable 
                planets={sortPlanetsByNadi(kundliData.planets, p => p.planet)} 
                ascendant={kundliData.ascendant} 
                dasha={kundliData.dasha} 
              />
            )}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                <select
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '0', border: '2px solid #000000', background: 'white', fontWeight: 'bold', color: 'var(--text)' }}
                >
                  <option>None</option>
                  {HOUSE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {(() => {
              if (selectedHouse === 'None') {
                const displayPlanets = sortPlanetsWithDasha(kundliData.planets, p => p.planet, kundliData.dasha);
                return displayPlanets.map((p: any) => {
                  const planetName = p.planet;
                  const dashaTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
                  if (planetName === kundliData.dasha.current_dasha) dashaTypes.push('Dasha');
                  if (planetName === kundliData.dasha.current_bukthi) dashaTypes.push('Bhukti');
                  if (planetName === kundliData.dasha.current_antara) dashaTypes.push('Antara');

                  return (
                    <JobPredictionTable
                      key={`${planetName}-default-${selectedArea}`}
                      data={isTransitMode && transitData ? transitData.nakshatra_nadi : kundliData.nakshatra_nadi}
                      planets={isTransitMode && transitData ? transitData.planets : kundliData.planets}
                      types={dashaTypes}
                      planetName={planetName}
                      selectedArea={selectedArea}
                      isTransitMode={isTransitMode}
                      loadingTransit={loadingTransit}
                      onTransitToggle={handleTransitToggle}
                    />
                  );
                });
              } else {
                let predHouseNum = 0;
                let predCuspSubLord = '';
                const houseMatch = selectedHouse.match(/^(\d+)/) || selectedHouse.match(/^(🔟|1️⃣1️⃣|1️⃣2️⃣)/);
                if (houseMatch) {
                  const houseNumStr = houseMatch[0].replace(/[^\d]/g, '');
                  predHouseNum = parseInt(houseNumStr);
                  if (selectedHouse.includes('🔟')) predHouseNum = 10;
                  if (selectedHouse.includes('1️⃣1️⃣')) predHouseNum = 11;
                  if (selectedHouse.includes('1️⃣2️⃣')) predHouseNum = 12;

                  const cuspSubMatch = kundliData.houses.find(h => h.house_number === predHouseNum)?.sub_lord || '';
                  predCuspSubLord = kundliData.planets.find(p => isPlanetMatch(p.planet, cuspSubMatch))?.planet || cuspSubMatch;
                }
                
                if (predCuspSubLord) {
                  return (
                    <JobPredictionTable
                      key={`${predCuspSubLord}-cusp-${selectedArea}`}
                      data={isTransitMode && transitData ? transitData.nakshatra_nadi : kundliData.nakshatra_nadi}
                      planets={isTransitMode && transitData ? transitData.planets : kundliData.planets}
                      types={['Cusp']}
                      planetName={predCuspSubLord}
                      selectedArea={selectedArea}
                      customLabel={`${getOrdinal(predHouseNum)} House Cusp`}
                      isTransitMode={isTransitMode}
                      loadingTransit={loadingTransit}
                      onTransitToggle={handleTransitToggle}
                    />
                  );
                }
                return null;
              }
            })()}
          </div>
        );
      case 'adv_v1':
        if (!(userData?.role === 'admin' || userData?.hasAdvV1Access)) {
          return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              <Lock size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontWeight: 800 }}>ACCESS DENIED</h3>
              <p>You need specific permission to view Adv V1.</p>
            </div>
          );
        }
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease', padding: '10px' }}>
            <div style={{ marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Prediction Area
                  </label>
                  <select 
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', background: '#f8fafc' }}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    House Significance
                  </label>
                  <select 
                    value={selectedHouse}
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', background: '#f8fafc' }}
                  >
                    <option>None</option>
                    {HOUSE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {(() => {
              if (selectedHouse === 'None') {
                const displayPlanets = sortPlanetsWithDasha(kundliData.planets, p => p.planet, kundliData.dasha);
                return displayPlanets.map((p: any) => {
                  const planetName = p.planet;
                  const dashaTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
                  if (planetName === kundliData.dasha.current_dasha) dashaTypes.push('Dasha');
                  if (planetName === kundliData.dasha.current_bukthi) dashaTypes.push('Bhukti');
                  if (planetName === kundliData.dasha.current_antara) dashaTypes.push('Antara');

                  return (
                    <AdvV1PredictionTable
                      key={`${planetName}-default-v1-${selectedArea}`}
                      data={isTransitMode && transitData ? transitData.nakshatra_nadi : kundliData.nakshatra_nadi}
                      planets={isTransitMode && transitData ? transitData.planets : kundliData.planets}
                      types={dashaTypes}
                      planetName={planetName}
                      selectedArea={selectedArea}
                      isTransitMode={isTransitMode}
                      loadingTransit={loadingTransit}
                      onTransitToggle={handleTransitToggle}
                    />
                  );
                });
              } else {
                let v1TargetHouseNum = 0;
                let v1CuspSubLord = '';
                const houseMatch = selectedHouse.match(/^(\d+)/) || selectedHouse.match(/^(🔟|1️⃣1️⃣|1️⃣2️⃣)/);
                if (houseMatch) {
                  const houseNumStr = houseMatch[0].replace(/[^\d]/g, '');
                  v1TargetHouseNum = parseInt(houseNumStr);
                  if (selectedHouse.includes('🔟')) v1TargetHouseNum = 10;
                  if (selectedHouse.includes('1️⃣1️⃣')) v1TargetHouseNum = 11;
                  if (selectedHouse.includes('1️⃣2️⃣')) v1TargetHouseNum = 12;

                  const cuspSubMatch = kundliData.houses.find(h => h.house_number === v1TargetHouseNum)?.sub_lord || '';
                  v1CuspSubLord = kundliData.planets.find(p => isPlanetMatch(p.planet, cuspSubMatch))?.planet || cuspSubMatch;
                }
                
                if (v1CuspSubLord) {
                  return (
                    <AdvV1PredictionTable
                      key={`${v1CuspSubLord}-cusp-${selectedArea}`}
                      data={isTransitMode && transitData ? transitData.nakshatra_nadi : kundliData.nakshatra_nadi}
                      planets={isTransitMode && transitData ? transitData.planets : kundliData.planets}
                      types={['Cusp']}
                      planetName={v1CuspSubLord}
                      selectedArea={selectedArea}
                      customLabel={`${getOrdinal(v1TargetHouseNum)} House Cusp`}
                      isTransitMode={isTransitMode}
                      loadingTransit={loadingTransit}
                      onTransitToggle={handleTransitToggle}
                    />
                  );
                }
                return null;
              }
            })()}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                <select
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '0', border: '2px solid #000000', background: 'white', fontWeight: 'bold', color: 'var(--text)' }}
                >
                  <option>None</option>
                  {HOUSE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {(() => {
              if (selectedHouse === 'None') {
                const displayPlanets = sortPlanetsWithDasha(kundliData.planets, p => p.planet, kundliData.dasha);
                return displayPlanets.map((p: any) => {
                  const planetName = p.planet;
                  const dashaTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
                  if (planetName === kundliData.dasha.current_dasha) dashaTypes.push('Dasha');
                  if (planetName === kundliData.dasha.current_bukthi) dashaTypes.push('Bhukti');
                  if (planetName === kundliData.dasha.current_antara) dashaTypes.push('Antara');

                  return (
                    <AdvancePredictionTable
                      key={`${planetName}-default-${selectedArea}`}
                      data={isTransitMode && transitData ? transitData.nakshatra_nadi : kundliData.nakshatra_nadi}
                      planets={isTransitMode && transitData ? transitData.planets : kundliData.planets}
                      types={dashaTypes}
                      planetName={planetName}
                      selectedArea={selectedArea}
                      isTransitMode={isTransitMode}
                      loadingTransit={loadingTransit}
                      onTransitToggle={handleTransitToggle}
                    />
                  );
                });
              } else {
                let advTargetHouseNum = 0;
                let advCuspSubLord = '';
                const houseMatch = selectedHouse.match(/^(\d+)/) || selectedHouse.match(/^(🔟|1️⃣1️⃣|1️⃣2️⃣)/);
                if (houseMatch) {
                  const houseNumStr = houseMatch[0].replace(/[^\d]/g, '');
                  advTargetHouseNum = parseInt(houseNumStr);
                  if (selectedHouse.includes('🔟')) advTargetHouseNum = 10;
                  if (selectedHouse.includes('1️⃣1️⃣')) advTargetHouseNum = 11;
                  if (selectedHouse.includes('1️⃣2️⃣')) advTargetHouseNum = 12;

                  const cuspSubMatch = kundliData.houses.find(h => h.house_number === advTargetHouseNum)?.sub_lord || '';
                  advCuspSubLord = kundliData.planets.find(p => isPlanetMatch(p.planet, cuspSubMatch))?.planet || cuspSubMatch;
                }
                
                if (advCuspSubLord) {
                  return (
                    <AdvancePredictionTable
                      key={`${advCuspSubLord}-cusp-${selectedArea}`}
                      data={isTransitMode && transitData ? transitData.nakshatra_nadi : kundliData.nakshatra_nadi}
                      planets={isTransitMode && transitData ? transitData.planets : kundliData.planets}
                      types={['Cusp']}
                      planetName={advCuspSubLord}
                      selectedArea={selectedArea}
                      customLabel={`${getOrdinal(advTargetHouseNum)} House Cusp`}
                      isTransitMode={isTransitMode}
                      loadingTransit={loadingTransit}
                      onTransitToggle={handleTransitToggle}
                    />
                  );
                }
                return null;
              }
            })()}
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
      case 'yearly':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <YearlyPrediction kundliData={kundliData} birthDetails={birthDetails} />
          </div>
        );
      case 'd2':
      case 'd4':
      case 'd6':
      case 'd7':
      case 'd8':
      case 'd10':
      case 'd11':
      case 'd12':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <DChartResultTable 
              vargaName={activeTab.toUpperCase()} 
              kundliData={kundliData} 
              birthDetails={birthDetails} 
            />
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
    if (view === 'bnn') {
      return bnnSubView === 'form' ? 'Bhrighu Nandi Nadi' : 'BNN Chart & Predictions';
    }
    if (view === 'form') {
      return mode === 'Prashna' ? 'KP Prashna' : 
             mode === 'Parashara' ? 'Parashara Kundli' : 
             mode === 'Yearly' ? 'NN Yearly Prediction' : 'KP Prediction';
    }
    if (view === 'result') {
      return mode === 'Prashna' ? 'KP Prashna Kundli' : 
             mode === 'Parashara' ? `Parashara ${chartMode}` : 
             mode === 'Yearly' ? 'NN Yearly Prediction' :
             `KP ${chartMode} Prediction`;
    }
    return '';
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as any)}
      showTabs={view === 'result' && mode !== 'Yearly'}
      onBack={() => {
        if (view === 'bnn') {
          if (bnnSubView === 'result') setBnnSubView('form');
          else setView('dashboard');
        } else if (view === 'result') {
          setView('form');
        } else {
          setView('dashboard');
        }
      }}
      isAdmin={userData?.role === 'admin'}
      expiryDate={userData?.expiryDate}
      onLogout={logout}
      currentView={view}
      chartMode={chartMode}
      chartStyle={chartStyle}
      onChartStyleChange={setChartStyle}
      title={getPageTitle()}
      onAdminToggle={() => setView(view === 'admin' ? 'dashboard' : 'admin')}
      mode={mode}
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

          {view === 'admin' && (
            <AdminPortal onBack={() => setView('dashboard')} />
          )}

          {view === 'bnn' && (
            <BNNPage 
              isAdmin={userData?.role === 'admin'} 
              isExpired={isExpired} 
              view={bnnSubView}
              setView={setBnnSubView}
            />
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
