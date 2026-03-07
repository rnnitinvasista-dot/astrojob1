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
            timeout: 30000 // 30 seconds
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
            timeout: 60000 // 60 seconds
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
            timeout: 30000 // 30 seconds
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
