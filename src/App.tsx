import { useState, useEffect } from 'react';
import Layout from './components/ui/Layout';
import BirthDetailsForm from './components/BirthDetailsForm';
import Dashboard from './components/Dashboard';
import HouseTable from './components/tables/HouseTable';
import axios from 'axios';
import PremiumSouthIndianChart from './components/charts/PremiumSouthIndianChart';
import YearlyPrediction from './components/predictions/YearlyPrediction';
import PlanetTable from './components/tables/PlanetTable';
import BirthTimeRectification from './components/tables/BirthTimeRectification';
import DashaTable from './components/tables/DashaTable';
import NakshatraNadiTable from './components/tables/NakshatraNadiTable';
import JobPredictionTable from './components/tables/JobPredictionTable';
import CombinationTab from './components/tables/CombinationTab';
import AdvV1PredictionTable from './components/tables/AdvV1PredictionTable';
import AdvancePredictionTable from './components/tables/AdvancePredictionTable';
import PowerPositionTable from './components/tables/PowerPositionTable';
import { getApiUrl, fetchMixedPrashna } from './services/api';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import LandingPage from './components/auth/LandingPage';
import { AlertCircle, Lock, X, Compass, Clock, Crown, Eye, Layers, Home, Droplet, Settings, Globe, Calendar, Target, BookOpen, Moon, Sun, Star } from 'lucide-react';
import PhaladeepikaTable from './components/tables/PhaladeepikaTable';
import AIBotContent from './components/AIBotContent';
import AdminPortal from './components/admin/AdminPortal';
import BNNPage from './components/bnn/BNNPage';
import DChartResultTable from './components/tables/DChartResultTable';
import NumerologyForm from './components/numerology/NumerologyForm';
import NumerologyReport from './components/numerology/NumerologyReport';
import MatchMakingForm from './components/matchmaking/MatchMakingForm';
import MatchMakingResult from './components/matchmaking/MatchMakingResult';
import { App as CapApp } from '@capacitor/app';
import { Geolocation } from '@capacitor/geolocation';
import SimpleRulingPlanets from './components/tables/SimpleRulingPlanets';
import NPTable from './components/tables/NPTable';
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
  const [view, setView] = useState<'dashboard' | 'form' | 'result' | 'admin' | 'bnn' | 'numerologyForm' | 'numerologyReport' | 'matchMakingForm' | 'matchMakingResult'>('dashboard');
  const [mode, setMode] = useState<'Natal' | 'Prashna' | 'Parashara' | 'BNN' | 'Yearly' | 'Numerology' | 'MatchMaking'>('Natal');
  const [kundliData, setKundliData] = useState<KundliResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'planet_positions' | 'planets' | 'dasha' | 'houses' | 'predictions' | 'combination' | 'adv_v1' | 'advance_predictions' | 'nadi' | 'phala' | 'power_position' | 'analysis' | 'yearly' | 'd1' | 'd2' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8' | 'd10' | 'd11' | 'd12' | 'ruling_planets' | 'birth_time' | 'np_technique'>('planets');
  const [error, setError] = useState<string | null>(null);
  const [birthDetails, setBirthDetails] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [chartMode, setChartMode] = useState<'Rashi' | 'Bhava'>('Bhava');
  const [selectedArea, setSelectedArea] = useState('Dasha');
  const [selectedHouse, setSelectedHouse] = useState('None');
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState('None');
  const [showAccessPopup, setShowAccessPopup] = useState(false);
  const [chartStyle, setChartStyle] = useState<'South Indian' | 'North Indian'>('South Indian');
  const [isTransitMode, setIsTransitMode] = useState(false);
  const [transitData, setTransitData] = useState<KundliResponse | null>(null);
  const [loadingTransit, setLoadingTransit] = useState(false);
  const [bnnSubView, setBnnSubView] = useState<'form' | 'result'>('form');
  const [numerologyFormDetails, setNumerologyFormDetails] = useState<{ name: string; dob: string; phone: string; vehicleNumber: string } | null>(null);
  const [matchMakingData, setMatchMakingData] = useState<{ 
    boyDetails: any, 
    girlDetails: any, 
    boyRes: any, 
    girlRes: any, 
    result: any 
  } | null>(null);

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
        } else if (view === 'numerologyForm') {
          setView('dashboard');
        } else if (view === 'numerologyReport') {
          setView('numerologyForm');
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

  const handleModeSelect = (selectedMode: 'Natal' | 'Prashna' | 'Parashara' | 'BNN' | 'Yearly' | 'Numerology' | 'MatchMaking') => {
    setMode(selectedMode);
    setBirthDetails(null);
    if (selectedMode === 'BNN') {
      setBnnSubView('form');
      setView('bnn');
    } else if (selectedMode === 'Numerology') {
      setView('numerologyForm');
    } else if (selectedMode === 'MatchMaking') {
      setView('matchMakingForm');
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
        if (mode === 'Parashara') {
          setChartMode('Bhava');
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

  const handleRectificationUpdate = (date: string, time: string) => {
    if (!birthDetails) return;
    const updatedData = {
      ...birthDetails,
      date_of_birth: date,
      time_of_birth: time
    };
    handleFormSubmit(updatedData);
  };

  const handleMatchMakingSubmit = async (boy: any, girl: any) => {
    setLoading(true);
    setError(null);
    try {
      const fetchOne = async (data: any) => {
        const response = await axios.post(`${getApiUrl()}/kundli`, {
          birth_details: {
            date_of_birth: data.date_of_birth,
            time_of_birth: data.time_of_birth,
            timezone: "Asia/Kolkata",
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            place: data.place
          },
          calculation_settings: {
            ayanamsa: "KP",
            house_system: "Placidus",
            node_type: "Mean"
          }
        });
        return response.data;
      };

      const boyRes = await fetchOne(boy);
      const girlRes = await fetchOne(girl);

      if (boyRes.status === 'success' && girlRes.status === 'success') {
        // Save both to recents
        const recents = JSON.parse(localStorage.getItem('astro_recents') || '[]');
        const bRecent = { ...boy, id: Date.now(), mode };
        const gRecent = { ...girl, id: Date.now() + 1, mode }; // Offset ID slightly
        localStorage.setItem('astro_recents', JSON.stringify([bRecent, gRecent, ...recents].slice(0, 20)));

        const { calculateMatch } = await import('./utils/matchMakingUtils');
        const matchResult = calculateMatch(boyRes, girlRes);
        setMatchMakingData({ 
          boyDetails: boy, 
          girlDetails: girl, 
          boyRes: boyRes, 
          girlRes: girlRes, 
          result: matchResult 
        });
        setView('matchMakingResult');
      } else {
        setError("Engine calculation failed for Boy or Girl");
      }
    } catch (err: any) {
      setError(err.message || "Connection failed");
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


  const handleNumerologySubmit = (data: { name: string; dob: string; phone: string; vehicleNumber: string }) => {
    setNumerologyFormDetails(data);
    setView('numerologyReport');
  };


  const renderTabContent = () => {
    if (!kundliData) return null;

    switch (activeTab) {
      case 'planets':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

          </div>
        );
      case 'combination':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <CombinationTab data={kundliData.nakshatra_nadi} planets={kundliData.planets} dasha={kundliData.dasha} houses={kundliData.houses} />
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
      case 'np_technique':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <NPTable planets={kundliData.planets} houses={kundliData.houses} dasha={kundliData.dasha} />
          </div>
        );
      case 'planet_positions':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <PlanetTable 
              planets={sortPlanetsByNadi(kundliData.planets, p => p.planet)} 
              ascendant={kundliData.ascendant} 
              dasha={kundliData.dasha} 
            />
          </div>
        );
      case 'ruling_planets':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <SimpleRulingPlanets 
              planets={kundliData.planets} 
              ascendant={kundliData.ascendant} 
            />
          </div>
        );
      case 'birth_time':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <BirthTimeRectification 
              houses={kundliData.houses}
              planets={kundliData.planets}
              ascendant={kundliData.ascendant}
              birthDetails={birthDetails}
              ayanamsa={birthDetails?.ayanamsa}
              onUpdateDetails={handleRectificationUpdate}
              metadata={kundliData.metadata}
            />
          </div>
        );
      case 'predictions':
        return (
          <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ padding: '12px', margin: '1rem 0', background: 'rgba(124, 92, 183, 0.04)', borderRadius: '12px', border: '1px solid rgba(124, 92, 183, 0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px' }}>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(124, 92, 183, 0.2)', background: 'white', fontWeight: 'bold', color: 'var(--text)', outline: 'none' }}
                >
                  <option>Dasha</option>
                  <option>Bhukti</option>
                  <option>Antara</option>
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
                  value={selectedPlanetFilter}
                  onChange={(e) => setSelectedPlanetFilter(e.target.value)}
                  style={{ width: 'auto', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(124, 92, 183, 0.2)', background: 'white', fontWeight: 'bold', color: 'var(--text)', textAlign: 'center', outline: 'none' }}
                >
                  <option>None</option>
                  <option>Ketu</option>
                  <option>Venus</option>
                  <option>Sun</option>
                  <option>Moon</option>
                  <option>Mars</option>
                  <option>Rahu</option>
                  <option>Jupiter</option>
                  <option>Saturn</option>
                  <option>Mercury</option>
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
                const PLANET_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
                let displayPlanets = [...kundliData.planets].sort((a, b) => PLANET_ORDER.indexOf(a.planet) - PLANET_ORDER.indexOf(b.planet));
                if (selectedPlanetFilter !== 'None') displayPlanets = displayPlanets.filter((p: any) => p.planet === selectedPlanetFilter);
                else if (selectedArea === 'Dasha') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_dasha);
                else if (selectedArea === 'Bhukti') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_bukthi);
                else if (selectedArea === 'Antara') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_antara);
                
                return displayPlanets.map((p: any) => {
                  const planetName = p.planet;
                  const dashaTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
                  if (selectedArea === 'Dasha' && planetName === kundliData.dasha.current_dasha) dashaTypes.push('Dasha');
                  if (selectedArea === 'Bhukti' && planetName === kundliData.dasha.current_bukthi) dashaTypes.push('Bhukti');
                  if (selectedArea === 'Antara' && planetName === kundliData.dasha.current_antara) dashaTypes.push('Antara');

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
                      
                    
                    
                    isPrashnaMode={mode === 'Prashna'}
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
                  let targetPlanet = predCuspSubLord;
                  const dashaTypes: ('Dasha' | 'Bhukti' | 'Antara' | 'Cusp')[] = ['Cusp'];
                  
                  if (selectedPlanetFilter !== 'None') {
                    targetPlanet = selectedPlanetFilter;
                  } else if (selectedArea === 'Dasha') {
                    targetPlanet = kundliData.dasha.current_dasha;
                    dashaTypes.push('Dasha');
                  } else if (selectedArea === 'Bhukti') {
                    targetPlanet = kundliData.dasha.current_bukthi;
                    dashaTypes.push('Bhukti');
                  } else if (selectedArea === 'Antara') {
                    targetPlanet = kundliData.dasha.current_antara;
                    dashaTypes.push('Antara');
                  }

                  return (
                    <JobPredictionTable
                      key={`${targetPlanet}-cusp-${selectedArea}`}
                      data={isTransitMode && transitData ? transitData.nakshatra_nadi : kundliData.nakshatra_nadi}
                      planets={isTransitMode && transitData ? transitData.planets : kundliData.planets}
                      types={dashaTypes}
                      planetName={targetPlanet}
                      selectedArea={selectedArea}
                      customLabel={`${getOrdinal(predHouseNum)} House Cusp`}
                      selectedHouseNum={predHouseNum}
                      isTransitMode={isTransitMode}
                      loadingTransit={loadingTransit}
                      onTransitToggle={handleTransitToggle}
                      
                    
                    
                    isPrashnaMode={mode === 'Prashna'}
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
                    <option>Dasha</option>
                    <option>Bhukti</option>
                    <option>Antara</option>
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
                const PLANET_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
                let displayPlanets = [...kundliData.planets].sort((a, b) => PLANET_ORDER.indexOf(a.planet) - PLANET_ORDER.indexOf(b.planet));
                if (selectedArea === 'Dasha') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_dasha);
                else if (selectedArea === 'Bhukti') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_bukthi);
                else if (selectedArea === 'Antara') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_antara);
                
                return displayPlanets.map((p: any) => {
                  const planetName = p.planet;
                  const dashaTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
                  if (selectedArea === 'Dasha' && planetName === kundliData.dasha.current_dasha) dashaTypes.push('Dasha');
                  if (selectedArea === 'Bhukti' && planetName === kundliData.dasha.current_bukthi) dashaTypes.push('Bhukti');
                  if (selectedArea === 'Antara' && planetName === kundliData.dasha.current_antara) dashaTypes.push('Antara');

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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px' }}>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '0', border: '2px solid #000000', background: 'white', fontWeight: 'bold', color: 'var(--text)' }}
                >
                  <option>Dasha</option>
                  <option>Bhukti</option>
                  <option>Antara</option>
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
                  value={selectedPlanetFilter}
                  onChange={(e) => setSelectedPlanetFilter(e.target.value)}
                  style={{ width: 'auto', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(124, 92, 183, 0.2)', background: 'white', fontWeight: 'bold', color: 'var(--text)', textAlign: 'center', outline: 'none' }}
                >
                  <option>None</option>
                  <option>Ketu</option>
                  <option>Venus</option>
                  <option>Sun</option>
                  <option>Moon</option>
                  <option>Mars</option>
                  <option>Rahu</option>
                  <option>Jupiter</option>
                  <option>Saturn</option>
                  <option>Mercury</option>
                </select>
                <select
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(124, 92, 183, 0.2)', background: 'white', fontWeight: 'bold', color: 'var(--text)', outline: 'none' }}
                >
                  <option>None</option>
                  {HOUSE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {(() => {
              if (selectedHouse === 'None') {
                const PLANET_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
                let displayPlanets = [...kundliData.planets].sort((a, b) => PLANET_ORDER.indexOf(a.planet) - PLANET_ORDER.indexOf(b.planet));
                if (selectedArea === 'Dasha') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_dasha);
                else if (selectedArea === 'Bhukti') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_bukthi);
                else if (selectedArea === 'Antara') displayPlanets = displayPlanets.filter((p: any) => p.planet === kundliData.dasha.current_antara);
                
                return displayPlanets.map((p: any) => {
                  const planetName = p.planet;
                  const dashaTypes: ('Dasha' | 'Bhukti' | 'Antara')[] = [];
                  if (selectedArea === 'Dasha' && planetName === kundliData.dasha.current_dasha) dashaTypes.push('Dasha');
                  if (selectedArea === 'Bhukti' && planetName === kundliData.dasha.current_bukthi) dashaTypes.push('Bhukti');
                  if (selectedArea === 'Antara' && planetName === kundliData.dasha.current_antara) dashaTypes.push('Antara');

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
      case 'd1':
      case 'd2':
      case 'd4':
      case 'd5':
      case 'd6':
      case 'd7':
      case 'd8':
      case 'd10':
      case 'd11':
      case 'd12':
        {
          const vargaKey = activeTab.toUpperCase();
          const vargaData = kundliData.varga_charts[vargaKey];
          return (
            <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <PremiumSouthIndianChart
                planets={vargaData.planets}
                ascendant={vargaData.ascendant}
                birthDetails={birthDetails}
                vargaCharts={kundliData.varga_charts}
                chartMode="Rashi"
                chartStyle={chartStyle}
                janmaNakshatra={kundliData.metadata.janma_nakshatra}
                pada={kundliData.metadata.pada}
                rashi={kundliData.planets.find(p => p.planet === 'Moon')?.sign}
                forceVarga={vargaKey}
                onVargaChange={(v) => setActiveTab(v.toLowerCase() as any)}
              />
              <DChartResultTable 
                vargaName={vargaKey} 
                kundliData={kundliData} 
              />
            </div>
          );
        }
      default:
        return null;
    }
  };

  const renderResultsLayout = () => {
    if (!kundliData) return null;

    let displayTitle = 'Birth Chart';
    let displaySubtitle = 'Explore the cosmic blueprint of your life.';
    if (mode === 'Prashna') {
      displayTitle = 'Prashana Kundali';
      displaySubtitle = 'Horary chart analysis for question-based predictions.';
    } else if (mode === 'Yearly') {
      displayTitle = 'Yearly Prediction';
      displaySubtitle = 'Detailed Varshaphala astrological forecast for the year.';
    } else if (mode === 'BNN') {
      displayTitle = 'Bhrighu Nandi Nadi';
      displaySubtitle = 'Nadi astrology analysis and transit planetary guidelines.';
    }

    const subTabs = [
      { id: 'planets', label: 'CHART', icon: Compass },
      { id: 'dasha', label: 'DASHA', icon: Clock },
      { id: 'np_technique', label: 'NP TECHNIQUE', icon: Layers },
      { id: 'ruling_planets', label: 'RULING PLANETS', icon: Crown },
      { id: 'predictions', label: 'PREDICTIONS', icon: Eye },
      { id: 'combination', label: 'COMBINATION', icon: Layers },
      { id: 'houses', label: 'HOUSE SIGNIFICATION', icon: Home },
      { id: 'power_position', label: 'REMEDIES', icon: Droplet },
      { id: 'nadi', label: 'KP COMBINATION', icon: Settings },
      { id: 'planet_positions', label: 'KP PLANETS', icon: Globe },
      { id: 'yearly', label: 'YEARLY', icon: Calendar },
      ...(mode === 'Natal' || mode === 'Prashna' ? [{ id: 'birth_time', label: 'CUSP RECTIFICATION', icon: Target }] : [])
    ];

    return (
      <div style={{ padding: '2rem 1.5rem', background: 'var(--bg)', minHeight: '100vh' }}>
        <style>{`
          .results-grid {
            display: grid;
            grid-template-columns: ${activeTab === 'planets' ? '1fr 300px' : '1fr'};
            gap: 1.5rem;
            align-items: start;
          }
          .subtabs-list {
            display: flex;
            gap: 0.5rem;
            overflow-x: auto;
            margin-bottom: 2rem;
            padding-bottom: 0.5rem;
            scrollbar-width: none;
          }
          .subtabs-list::-webkit-scrollbar {
            display: none;
          }
          .subtab-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            padding: 0.6rem 0.8rem;
            border-radius: 8px;
            border: 1px solid rgba(124, 92, 183, 0.08);
            background: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            min-width: 100px;
            text-align: center;
            transition: all 0.2s;
            flex-shrink: 0;
          }
          .subtab-card:hover {
            background: rgba(124, 92, 183, 0.04);
            border-color: rgba(124, 92, 183, 0.15);
          }
          .subtab-card.active {
            background: #ffffff;
            border-bottom: 3px solid var(--primary);
            box-shadow: var(--shadow-sm);
          }
          .subtab-card.active .subtab-text {
            color: var(--primary) !important;
          }
          .subtab-card.active .subtab-icon {
            color: var(--primary) !important;
          }
          @media (max-width: 1024px) {
            .results-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Top Title & Action Button Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.0rem' }}>
            <div>
              {/* Breadcrumbs */}
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => { setKundliData(null); setView('dashboard'); }}>Dashboard</span>
                <span>&gt;</span>
                <span style={{ color: 'var(--primary)' }}>{displayTitle}</span>
              </div>
              {/* Title */}
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--secondary)', margin: '0 0 0.5rem' }}>
                {displayTitle}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, fontWeight: 400 }}>
                {displaySubtitle}
              </p>
            </div>

            {/* + NEW BIRTH CHART button */}
            <button
              onClick={() => {
                setKundliData(null);
                setView('form');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(124, 92, 183, 0.2)',
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              <span>+</span> NEW BIRTH CHART
            </button>
          </div>

          {/* Sub-tabs List */}
          <div className="subtabs-list">
            {subTabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`subtab-card ${isActive ? 'active' : ''}`}
                >
                  <IconComp className="subtab-icon" size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s' }} />
                  <span className="subtab-text" style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.03em', color: isActive ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Grid Layout */}
          <div className="results-grid">
            
            {/* Left/Main Column: Active Tab Pane */}
            <div style={{
              minHeight: '400px',
              minWidth: 0,
              width: '100%'
            }}>
              {renderTabContent()}
            </div>

            {/* Right Column: Chart Overview Card */}
            {activeTab === 'planets' && (
              <div style={{
                background: 'white',
                border: '1px solid rgba(124, 92, 183, 0.08)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow)',
                alignSelf: 'start'
              }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 800, color: 'var(--secondary)', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', paddingBottom: '0.75rem' }}>
                  Chart Overview
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Ascendant', value: kundliData.ascendant.sign, icon: BookOpen },
                    { label: 'Nakshatra', value: kundliData.metadata.janma_nakshatra || 'Anuradha', icon: Star },
                    { label: 'Moon Sign', value: kundliData.planets.find(p => p.planet === 'Moon')?.sign || 'Scorpio', icon: Moon },
                    { label: 'Sun Sign', value: kundliData.planets.find(p => p.planet === 'Sun')?.sign || 'Cancer', icon: Sun }
                  ].map((item, idx) => {
                    const OverviewIcon = item.icon;
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(124, 92, 183, 0.04)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                        }}>
                          <OverviewIcon size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 700, marginTop: '1px' }}>{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    );
  };




  if (!currentUser) {
    if (showExample && kundliData) {
      return (
        <Layout
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
          showTabs={false}
          onBack={() => {
            setShowExample(false);
            setKundliData(null);
          }}
          isAdmin={false}
          onLogout={() => {}}
          currentView={view}
          chartMode={chartMode}
          chartStyle={chartStyle}
          onChartStyleChange={setChartStyle}
          title="Example Prediction"
          mode={mode}
        >
          <div style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            borderBottom: '1px solid rgba(124, 92, 183, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            ✨ This is a Sample KP/Jyotish Prediction.
            <button
              onClick={() => {
                setShowExample(false);
                setKundliData(null);
                setShowLogin(true);
              }}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                marginLeft: '8px'
              }}
            >
              Login to calculate yours
            </button>
          </div>
          {renderResultsLayout()}
        </Layout>
      );
    }

    if (showLogin) {
      return (
        <LoginPage onBack={() => setShowLogin(false)} />
      );
    }

    return (
      <LandingPage
        onExploreSign={() => setShowLogin(true)}
      />
    );
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
    if (view === 'numerologyForm') return 'Numerology Input';
    if (view === 'numerologyReport') return 'Numerology Insights';
    if (view === 'matchMakingForm') return 'Match Making Details';
    if (view === 'matchMakingResult') return 'Compatibility Result';
    return '';
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as any)}
      showTabs={false}
      onBack={() => {
        if (view === 'bnn') {
          if (bnnSubView === 'result') setBnnSubView('form');
          else setView('dashboard');
        } else if (view === 'result') {
          setView('form');
        } else if (view === 'matchMakingResult') {
          setView('matchMakingForm');
        } else if (view === 'numerologyReport') {
          setView('numerologyForm');
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
      onNavigate={(targetView, targetMode) => {
        setView(targetView as any);
        if (targetMode) setMode(targetMode as any);
        if (targetView === 'bnn') setBnnSubView('form');
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
              onSelect={(mode) => handleModeSelect(mode as any)}
              hasKPAccess={userData?.hasKPAccess}
              hasBNNAccess={userData?.hasBNNAccess}
              hasYearlyAccess={userData?.hasYearlyAccess}
              hasNumerologyAccess={userData?.hasNumerologyAccess}
              hasMatchmakingAccess={userData?.hasMatchmakingAccess}
              isAdmin={userData?.role === 'admin'}
              username={currentUser?.email ? currentUser.email.split('@')[0] : 'Star Seeker'}
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

          {view === 'numerologyForm' && (
            <NumerologyForm 
              onBack={() => setView('dashboard')}
              onSubmit={handleNumerologySubmit}
            />
          )}

          {view === 'matchMakingForm' && (
            <MatchMakingForm 
              onBack={() => setView('dashboard')}
              onSubmit={handleMatchMakingSubmit}
              isLoading={loading}
              isExpired={isExpired}
            />
          )}

          {view === 'matchMakingResult' && matchMakingData && (
            <MatchMakingResult 
              boyDetails={matchMakingData.boyDetails}
              girlDetails={matchMakingData.girlDetails}
              boyRes={matchMakingData.boyRes}
              girlRes={matchMakingData.girlRes}
              result={matchMakingData.result}
            />
          )}

          {view === 'numerologyReport' && numerologyFormDetails && (
            <NumerologyReport 
              data={numerologyFormDetails}
              onBack={() => setView('dashboard')}
            />
          )}

          {view === 'result' && kundliData && !loading && renderResultsLayout()}
        </>


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
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
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
