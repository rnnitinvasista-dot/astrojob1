import React, { useState, useRef, useEffect } from 'react';
import { fetchAnalysisReport, chatWithAI } from '../services/api';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface AnalysisTabProps {
    nadiData: any[];
    dashaData: any;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ nadiData, dashaData }) => {
    const [selectedArea, setSelectedArea] = useState('Job');
    const [report, setReport] = useState<string | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);
    
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
    const [loadingChat, setLoadingChat] = useState(false);
    
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleGenerateReport = async () => {
        setLoadingReport(true);
        setReport(null);
        try {
            const data = await fetchAnalysisReport(selectedArea, nadiData, dashaData);
            if (data.status === 'success') {
                setReport(data.report);
            } else {
                setReport("Error: " + (data.message || "Failed to generate report."));
            }
        } catch (e) {
            setReport("Connection error.");
        } finally {
            setLoadingReport(false);
        }
    };

    const handleSendChat = async () => {
        if (!query.trim()) return;
        
        const userMsg = { role: 'user', content: query };
        setChatHistory(prev => [...prev, userMsg]);
        setQuery('');
        setLoadingChat(true);
        
        try {
            const data = await chatWithAI(query, nadiData, dashaData, chatHistory);
            if (data.status === 'success') {
                setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setChatHistory(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Plase try again." }]);
            }
        } catch (e) {
             setChatHistory(prev => [...prev, { role: 'assistant', content: "Network error." }]);
        } finally {
            setLoadingChat(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', background: '#f8fafc', minHeight: '100%' }}>
            {/* Header / Selection */}
            <div className="card" style={{ border: '3px solid #000000', borderRadius: '0', background: 'white' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={24} color="#35a4f4" /> AI ANALYSIS REPORT
                </h2>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '0', border: '2px solid #1e3a8a', background: 'white', fontWeight: 'bold' }}
                    >
                        <option>Job</option>
                        <option>Business</option>
                        <option>Education</option>
                        <option>Marriage</option>
                        <option>Child Birth</option>
                        <option>Health</option>
                    </select>
                    
                    <button
                        onClick={handleGenerateReport}
                        disabled={loadingReport}
                        style={{
                            padding: '12px 24px',
                            background: '#1e3a8a',
                            color: 'white',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {loadingReport ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                        {loadingReport ? 'GENERATING...' : 'GENERATE'}
                    </button>
                </div>
                
                {report && (
                    <div style={{ 
                        background: '#ffffff', 
                        padding: '1rem', 
                        border: '2px solid #e2e8f0', 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6', 
                        whiteSpace: 'pre-wrap', 
                        color: '#334155',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        {report}
                    </div>
                )}
            </div>

            {/* Chatbot Interface */}
            <div className="card" style={{ border: '3px solid #000000', borderRadius: '0', background: 'white', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803d', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={24} color="#15803d" /> ASTRO CHATBOT
                </h2>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {chatHistory.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', fontSize: '0.9rem' }}>
                            Ask me anything about your life situations using Nadi principles.
                            <br/>(e.g., "Will I pass my CA exam?")
                        </div>
                    )}
                    {chatHistory.map((msg, i) => (
                        <div key={i} style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{ 
                                width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'user' ? '#1e3a8a' : '#15803d',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0
                            }}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div style={{ 
                                padding: '10px 14px', 
                                borderRadius: '12px', 
                                background: msg.role === 'user' ? '#dbeafe' : 'white', 
                                border: '1px solid #e2e8f0',
                                color: '#1e293b',
                                fontSize: '0.9rem',
                                maxWidth: '80%',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loadingChat && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Bot size={18} />
                            </div>
                            <div style={{ padding: '10px', color: '#64748b' }}>
                                <Loader2 className="animate-spin" size={20} />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="Type your question..."
                        style={{ flex: 1, padding: '12px', border: '2px solid #000000', borderRadius: '0', fontWeight: 'bold' }}
                    />
                    <button
                        onClick={handleSendChat}
                        disabled={loadingChat || !query.trim()}
                        style={{ 
                            padding: '12px', 
                            background: '#000000', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisTab;
