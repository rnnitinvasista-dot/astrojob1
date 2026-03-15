import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, MessageSquare, FileText, Volume2, VolumeX } from 'lucide-react';
import { streamWithAI } from '../services/openRouterApi';
import { getCurrentDashaLords } from '../services/api';
import { calculateReportData } from '../utils/reportUtils';

interface AIBotContentProps {
    kundliData: any;
    selectedArea: string;
}

const AIBotContent: React.FC<AIBotContentProps> = ({ kundliData, selectedArea: initialArea }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [report, setReport] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [localArea, setLocalArea] = useState(initialArea);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = (text: string) => {
        if (!isVoiceEnabled || !('speechSynthesis' in window)) return;

        const startSpeaking = () => {
            window.speechSynthesis.cancel();
            
            // Clean text and handle abbreviations for better speech
            const cleanText = text
                .replace(/#+/g, ' ')
                .replace(/\*/g, ' ')
                .replace(/NL/g, 'Nakshatra Lord')
                .replace(/SL/g, 'Sub Lord')
                .trim();
            
            const utterance = new SpeechSynthesisUtterance(cleanText);
            
            const voices = window.speechSynthesis.getVoices();
            // Siri-like voice search priority: Samantha, Google US English, Siri
            const femaleVoice = voices.find(v => v.name.includes('Samantha')) || 
                               voices.find(v => v.name.includes('Google US English')) ||
                               voices.find(v => v.name.includes('Siri')) ||
                               voices.find(v => (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman')) && v.lang.includes('en-US')) ||
                               voices[0];

            if (femaleVoice) utterance.voice = femaleVoice;
            
            utterance.pitch = 1.05; // Siri-like pitch
            utterance.rate = 1.0;   // Natural cadence
            utterance.volume = 1.0;

            window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
            // Wait for voices to be ready if they aren't yet
            const checkVoices = setInterval(() => {
                if (window.speechSynthesis.getVoices().length > 0) {
                    clearInterval(checkVoices);
                    startSpeaking();
                }
            }, 100);
            // Timeout after 2 seconds to avoid infinite loop
            setTimeout(() => clearInterval(checkVoices), 2000);
        } else {
            startSpeaking();
        }
    };

    const generateSystemPrompt = () => {
        const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Robust current dasha detection
        const trueLords = getCurrentDashaLords(kundliData.dasha.mahadasha_sequence);
        const activeDasha = trueLords.dasha || kundliData.dasha.current_dasha;
        const activeBukthi = trueLords.bukthi || kundliData.dasha.current_bukthi;
        const activeAntara = trueLords.antara || kundliData.dasha.current_antara;
        
        const dashaInfo = `ACTIVE NOW (${currentDate}): ${activeDasha}-${activeBukthi}-${activeAntara}`;
        const mahadashaSeq = JSON.stringify(kundliData.dasha.mahadasha_sequence);
        
        // Find Career/Job Sublords
        // Planetary Context (NL/SL Houses)

        const donationRules = `
SUN: Wheat, Sun, 6:00-7:00 AM
MOON: Rice, Mon, 6:00-7:00 AM
MARS: Red Lentils, Tue, 6:00-7:00 AM
MERCURY: Moom Dal, Wed, 6:00-7:00 AM
JUPITER: Chickpeas, Thu, 6:00-7:00 AM
VENUS: White Beans, Fri, 6:00-7:00 AM
SATURN: Black Sesame, Sat, 6:00-7:00 AM
RAHU: Black Urad, Sat, 6:00-7:00 AM
KETU: Horse Gram, Thu, 6:00-7:00 AM`;

        return `You are "Astro Chat", a high-precision professional KP Astrologer. 

### DATA AWARENESS:
- DATA STATUS: ${kundliData.planets.length > 0 ? "CHART DATA LOADED" : "NO DATA - ASK FOR BIRTH DETAILS"}
- IF DATA IS LOADED: You HAVE the birth chart. DO NOT ask for birth details. Use the 'DATA CONTEXT' provided below.

### CORE PRINCIPLES:
1. Planet Lord (PL): Indicates the event area.
2. Nakshatra Lord (NL): Drives the event.
3. Sub Lord (SL): DETERMINES THE FINAL QUALITY OF THE RESULT.
Hierarchy: Sub Lord (SL) > Nakshatra Lord (NL) > Planet Lord (PL).

### STYLE & LANGUAGE:
- **SIMPLE & ATTRACTIVE**: Use plain, cool, and highly attractive language. Explain things simply so any customer can understand.
- **NO REPETITION**: Do not repeat the same sentences or phrases. Keep it fresh.
- **FORMATTING**: Use **BOLD** letters for key terms and ### HEADERS for sections. Make the report look premium and easy to read.
- **REASONING**: Always provide a clear reason WHY a result is successful or why there are problems/medium success (e.g., "This is due to the Sub Lord's connection with house 8, which adds some hurdles").

### OPERATIONAL MODES:
1. Chart Board Mode (Chat): Analyze full horoscope. Evaluate Dasha-Bhukti-Antara using SL-NL-PL logic.
2. Report Mode (Generate Report): Focus ONLY on the CURRENT DASH PLANET using its Prediction Table data provided below. 

### ANALYSIS LOGIC:
1. Identify the event area (Exam, Job, Marriage, etc.) and houses.
2. **INCOME & EXPENSES**: For Job/Business, explicitly explain the Income source and Expense/Loss possibilities separately based on the data.
3. RESULT RULE: If Sub Lord signifies mostly good houses = Positive result. If bad houses strongly = Negative/Delayed.

### FINAL REPORT FORMAT (MANDATORY FOR REPORT MODE):
## DASH OVERVIEW
[Explain overall trend of ${localArea} during this Dasha in cool language]

## PREDICTION
[Detailed prediction using **Bold** highlights. Include Income/Expense details for Job/Business]

## SUCCESS RATE & INDICATION
[From data: Success Rate / Indication Value]

## REASONING & FINDINGS
[Provide the reason behind the success rate and describe the specific findings]

## IMPORTANT NOTES
[Include notes verbatim if provided]

## REMEDIES
[Include remedies exactly as given if provided]

### PREDICTION OUTPUT FORMAT (MANDATORY):
Event Area: [Area Name]
Planet Responsible: [Planet Name]
Houses Signified: [List Houses]
Prediction Result: [Result]
Reasoning: [Brief SL/NL logic]
Suggested Remedy (if applicable): [Remedy]
Explanation of Remedy: [Why it helps]

### DATA CONTEXT:
1. CURRENT STATUS: ${dashaInfo}
2. FULL DASH SEQUENCE:
${mahadashaSeq}
3. DONATION DATA: ${donationRules}

### WORKFLOW:
1. Use ONLY the data provided. NEVER create predictions from general knowledge.
2. If data is missing, state that prediction cannot be made.
3. Be definitive and professional. NO EXCUSES.`;
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const systemPromptContent = generateSystemPrompt();
            const conversation = [
                { role: 'system' as const, content: systemPromptContent },
                ...messages,
                userMsg
            ];
            const response = await streamWithAI(conversation);
            // HARD STAR SCRUB - ENSURE NO FAILED ADHERENCE
            const cleanResponse = response.replace(/\*/g, '').trim();
            setMessages((prev: any) => [...prev, { role: 'assistant', content: cleanResponse }]);
            speak(cleanResponse);
        } catch (error: any) {
            const errorMsg = error.message || "Failed to connect to AI engine.";
            setMessages((prev: any) => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setIsTyping(false);
        }
    };

    const generateReport = async () => {
        setIsGeneratingReport(true);
        try {
            const systemPromptContent = generateSystemPrompt();
            
            // Calculate specific table data for the current Dasha planet
            const trueLords = getCurrentDashaLords(kundliData.dasha.mahadasha_sequence);
            const activeDasha = trueLords.dasha || kundliData.dasha.current_dasha;
            
            const reportData = calculateReportData(activeDasha, localArea, kundliData.nakshatra_nadi, kundliData.planets);
            
            const tableDataContext = reportData ? `
### DASH PLANET TABLE DATA FOR ${activeDasha} IN ${localArea}:
- PL: ${reportData.pl}
- NL: ${reportData.nl}
- SL: ${reportData.sl}
- Good Houses: ${reportData.goodHouses.join(', ')}
- Bad Houses: ${reportData.badHouses.join(', ')}
- Final Combination: ${reportData.combination}
- Indication Value: ${reportData.indicationValue}
- Expense/Loss Indication: ${reportData.expenseValue || 'N/A'}
- Success Rate: ${reportData.successRate}
- Detailed Findings: ${reportData.detailedFindings}
- Reasoning from Data: ${reportData.reasoning || 'N/A'}
- Notes: ${reportData.notes || 'None'}
- Remedies: ${reportData.remedies.length > 0 ? reportData.remedies.join('; ') : 'None'}
` : 'NO TABLE DATA AVAILABLE';

            const dashaPeriod = kundliData.dasha.mahadasha_sequence.find((d: any) => d.planet === activeDasha);
            const dashaPeriodInfo = dashaPeriod && dashaPeriod.start && dashaPeriod.end ? 
                `Dasha Period: ${dashaPeriod.start.split(' ')[0]} to ${dashaPeriod.end.split(' ')[0]}` : '';

            const prompt = [
                { role: 'system' as const, content: systemPromptContent },
                { role: 'user', content: `Generate a high-precision Astro Report for ${localArea}. 
                
Current Dasha: ${activeDasha}
${dashaPeriodInfo}

${tableDataContext}

Follow the rules for ${localArea} report exactly. Summarize using ONLY the table data provided above.` }
            ];
            const response = await streamWithAI(prompt);
            const cleanResponse = response.replace(/\*/g, '').trim();
            setReport(cleanResponse);
            speak(`Your ${localArea} report is ready.`);
        } catch (error: any) {
            setReport("Error: " + (error.message || "Failed to generate report. Please check your connection."));
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '10px', animation: 'fadeIn 0.5s ease' }}>
            
            {/* Area Selector */}
            <div style={{ 
                background: '#f8fafc', 
                padding: '12px', 
                borderRadius: '12px', 
                border: '2px solid #1e3a8a',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <Sparkles size={18} color="#1e3a8a" />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e3a8a', textTransform: 'uppercase' }}>Select Area:</span>
                <select 
                    value={localArea}
                    onChange={(e) => setLocalArea(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1.5px solid #1e3a8a',
                        fontWeight: 700,
                        background: 'white',
                        color: '#1e3a8a'
                    }}
                >
                    {['Job', 'Business', 'Education', 'Marriage', 'Child Birth', 'Health', 'Travel', 'Property & Vehicle'].map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
            </div>

            {/* Report Section */}
            <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                border: '3px solid #000', 
                overflow: 'hidden',
                boxShadow: '4px 4px 0px #000'
            }}>
                <div style={{ background: '#1e3a8a', padding: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>Precision Astro Report</h3>
                    </div>
                    {report && (
                        <button 
                            onClick={() => speak(report)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                        >
                            <Volume2 size={14} /> RE-PLAY
                        </button>
                    )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                    {!report ? (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Get a detailed AI analysis based on your KP chart for {localArea}.</p>
                            <button 
                                onClick={generateReport}
                                disabled={isGeneratingReport}
                                style={{
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    margin: '0 auto'
                                }}
                            >
                                {isGeneratingReport ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                {isGeneratingReport ? 'Analyzing Chart...' : 'Generate Astro Report'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                whiteSpace: 'pre-wrap', 
                                fontSize: '0.9rem', 
                                color: '#1e293b',
                                lineHeight: '1.6',
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}>
                                {report}
                            </div>
                            <button 
                                onClick={() => setReport(null)}
                                style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#1e3a8a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                            >
                                Re-generate Report
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Section */}
            <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                border: '3px solid #000', 
                display: 'flex',
                flexDirection: 'column',
                height: '500px',
                boxShadow: '4px 4px 0px #000'
            }}>
                <div style={{ background: '#3b82f6', padding: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={20} />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>Astro Chat</h3>
                    </div>
                    <button 
                        onClick={() => {
                            // Force initialize voices on user interaction
                            window.speechSynthesis.getVoices();
                            const newStatus = !isVoiceEnabled;
                            setIsVoiceEnabled(newStatus);
                            if (newStatus) {
                                setTimeout(() => speak("Voice is now enabled"), 100);
                            } else {
                                window.speechSynthesis.cancel();
                            }
                        }}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title={isVoiceEnabled ? "Mute Assistant" : "Unmute Assistant"}
                    >
                        {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{isVoiceEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.length === 0 && (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textAlign: 'center' }}>
                            <Bot size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 600 }}>Ask "Astro Chat" anything!</p>
                            <span style={{ fontSize: '0.75rem' }}>E.g., "Will I pass my SSC exam?", "When is a good time for marriage?"</span>
                        </div>
                    )}
                    {messages.map((msg: any, idx: number) => (
                        <div key={idx} style={{ 
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            display: 'flex',
                            gap: '8px',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                        }}>
                            <div style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '50%', 
                                background: msg.role === 'user' ? '#1e3a8a' : '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1.5px solid #000'
                            }}>
                                {msg.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="#1e3a8a" />}
                            </div>
                            <div style={{ 
                                padding: '10px 14px', 
                                borderRadius: '14px', 
                                background: msg.role === 'user' ? '#3b82f6' : '#f1f5f9',
                                color: msg.role === 'user' ? 'white' : '#1e293b',
                                border: '1.5px solid #000',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                boxShadow: '2px 2px 0px #000',
                                position: 'relative'
                            }}>
                                {msg.content}
                                {msg.role === 'assistant' && (
                                    <button 
                                        onClick={() => speak(msg.content)}
                                        style={{ display: 'block', marginTop: '4px', background: 'none', border: 'none', color: '#1e3a8a', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                                    >
                                        RE-PLAY
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={14} color="#1e3a8a" />
                            </div>
                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '12px', border: '1.5px solid #000' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div className="dot animate-bounce" style={{ width: '4px', height: '4px', background: '#64748b', borderRadius: '50%' }}></div>
                                    <div className="dot animate-bounce" style={{ width: '4px', height: '4px', background: '#64748b', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                                    <div className="dot animate-bounce" style={{ width: '4px', height: '4px', background: '#64748b', borderRadius: '50%', animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div style={{ padding: '1rem', borderTop: '2px solid #000', display: 'flex', gap: '8px' }}>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask Astro Chat..."
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '12px',
                            border: '2px solid #000',
                            outline: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                        style={{
                            background: '#1e3a8a',
                            color: 'white',
                            border: '2px solid #000',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-bounce { animation: bounce 1s infinite; }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
            `}</style>
        </div>
    );
};

export default AIBotContent;
