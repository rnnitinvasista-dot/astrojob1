import axios from 'axios';
import type { KundliRequest, KundliResponse } from '../types/astrology';

// Stay on Render for now
const RENDER_API_URL = 'https://astrojob.onrender.com/api/v1/kp';
// const HUGGINGFACE_API_URL = 'https://nitin324444-astro.hf.space/api/v1/kp';

const DEFAULT_API_URL = RENDER_API_URL;

export const getApiUrl = () => {
    return localStorage.getItem('custom_api_url') || DEFAULT_API_URL;
};

export const setApiUrl = (url: string) => {
    if (!url) {
        localStorage.removeItem('custom_api_url');
    } else {
        // Ensure no trailing slash
        const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
        localStorage.setItem('custom_api_url', cleanUrl);
    }
    window.location.reload(); // Force reload to apply changes
};

export const fetchKundli = async (request: KundliRequest): Promise<KundliResponse> => {
    const baseUrl = getApiUrl();
    try {
        const response = await axios.post<KundliResponse>(`${baseUrl}/kundli`, request, {
            timeout: 120000 // 120 seconds (Render cold start)
        });
        return response.data;
    } catch (error) {
        let errorMsg = 'Network error occurred';
        if (axios.isAxiosError(error)) {
            errorMsg = `Connection failed at ${baseUrl}. ${error.message}`;
        }
        return {
            status: 'error',
            message: errorMsg,
        } as KundliResponse;
    }
};

export const fetchJobAnalysis = async (request: KundliRequest): Promise<any> => {
    const baseUrl = getApiUrl();
    try {
        const response = await axios.post(`${baseUrl}/job-analysis`, request, {
            timeout: 120000 // 120 seconds
        });
        return response.data;
    } catch (error) {
        let errorMsg = 'Network error occurred';
        if (axios.isAxiosError(error)) {
            errorMsg = `Analysis failed at ${baseUrl}. ${error.message}`;
        }
        return {
            status: 'error',
            message: errorMsg,
        };
    }
};
export const fetchMixedPrashna = async (request: any): Promise<KundliResponse> => {
    // The endpoint is at /api/v1/kp/mixed-prashna

    try {
        const response = await axios.post<KundliResponse>(`${getApiUrl()}/mixed-prashna`, {
            prashna_number: request.horary_number,
            date: request.birth_details.date_of_birth,
            time: request.birth_details.time_of_birth,
            latitude: parseFloat(request.birth_details.latitude),
            longitude: parseFloat(request.birth_details.longitude),
            timezone: request.birth_details.timezone
        }, {
            timeout: 120000 // 120 seconds
        });
        return response.data;
    } catch (error) {
        let errorMsg = 'Prashna calculation failed';
        if (axios.isAxiosError(error)) {
            errorMsg = `Connection failed at ${getApiUrl()}. ${error.message}`;
        }
        return {
            status: 'error',
            message: errorMsg,
        } as KundliResponse;
    }
};

export const pingBackend = async () => {
    try {
        await axios.get(`${getApiUrl()}/health`, { timeout: 10000 });
    } catch (e) {
        // Ignore background ping errors
    }
};

export const fetchAnalysisReport = async (area: string, nadiData: any[], dashaData: any): Promise<any> => {
    const baseUrl = getApiUrl();
    try {
        const response = await axios.post(`${baseUrl}/analysis-report`, {
            area,
            nadi_data: nadiData,
            dasha_data: dashaData
        }, {
            timeout: 120000
        });
        return response.data;
    } catch (error) {
        return { 
            status: 'error', 
            message: axios.isAxiosError(error) ? error.message : 'Failed to connect to AI' 
        };
    }
};

export const chatWithAI = async (query: string, nadiData: any[], dashaData: any, chatHistory: any[]): Promise<any> => {
    const baseUrl = getApiUrl();
    try {
        const response = await axios.post(`${baseUrl}/chat-with-ai`, {
            query,
            nadi_data: nadiData,
            dasha_data: dashaData,
            chat_history: chatHistory
        }, {
            timeout: 120000
        });
        return response.data;
    } catch (error) {
        return { 
            status: 'error', 
            message: axios.isAxiosError(error) ? error.message : 'Failed to connect to AI' 
        };
    }
};

/**
 * Robust utility to find the CURRENT active dasha lords from the full sequence.
 * This ensures accuracy even if the initial API response 'current' markers are stale.
 */
export const getCurrentDashaLords = (mahadashaSequence: any[]) => {
    const now = new Date();
    
    // Default to the provided markers if we can't find better ones
    let lords = {
        dasha: '',
        bukthi: '',
        antara: '',
        pratyantar: '',
        sookshma: ''
    };

    if (!mahadashaSequence) return lords;

    // Find active Mahadasha (D)
    const activeMD = mahadashaSequence.find(md => new Date(md.end_date) >= now);
    if (!activeMD) return lords;
    lords.dasha = activeMD.planet;

    // Find active Bhukti (B)
    if (activeMD.bukthis) {
        const activeAD = activeMD.bukthis.find((ad: any) => new Date(ad.end_date) >= now);
        if (activeAD) {
            lords.bukthi = activeAD.planet;
            
            // Find active Antara (A)
            if (activeAD.antaras) {
                const activePD = activeAD.antaras.find((pd: any) => new Date(pd.end_date) >= now);
                if (activePD) {
                    lords.antara = activePD.planet;
                    
                    // Find active Pratyantar (P)
                    if (activePD.pratyantars) {
                        const activeSD = activePD.pratyantars.find((sd: any) => new Date(sd.end_date) >= now);
                        if (activeSD) {
                            lords.pratyantar = activeSD.planet;
                            
                            // Find active Sookshma (PR)
                            if (activeSD.sookshmas) {
                                const activePR = activeSD.sookshmas.find((pr: any) => new Date(pr.end_date) >= now);
                                if (activePR) {
                                    lords.sookshma = activePR.planet;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return lords;
};
