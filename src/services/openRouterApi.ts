import axios from 'axios';

const OPENROUTER_API_KEY = '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';
const MODEL = 'openrouter/free';

export const streamWithAI = async (messages: any[]) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL,
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://astrojob.web.app',
          'X-Title': 'AstroJob',
          'Content-Type': 'application/json',
        },
        timeout: 45000, // Increased timeout to 45s
      }
    );
    
    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      return content;
    }
    
    throw new Error('AI Engine returned an empty response. Please try a different query.');
  } catch (error: any) {
    const detail = error.response?.data?.error?.message || error.message || 'Unknown Network Error';
    console.error('OpenRouter Error:', detail);
    throw new Error(`AI System Error: ${detail}`);
  }
};
