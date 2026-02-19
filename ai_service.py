import requests
import json
import os

class AIService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://astrojob.onrender.com", # Optional, for OpenRouter analytics
            "X-Title": "AstroJob Nadi Engine"
        }

    def generate_job_analysis(self, prompt_data):
        """
        Generates a job analysis using OpenRouter.
        """
        prompt = self._build_job_prompt(prompt_data)
        
        payload = {
            "model": "google/gemini-2.0-flash-001", 
            "messages": [
                {"role": "system", "content": "You are an expert Nadi Astrologer. Analyze the astrological data based strictly on the provided Nadi rules. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ]
        }

        response = None
        try:
            # Add a 30 second timeout
            response = requests.post(self.base_url, headers=self.headers, data=json.dumps(payload), timeout=30)
            response.raise_for_status()
            result = response.json()
            
            if 'choices' not in result or len(result['choices']) == 0:
                return {"error": f"AI provider returned no choices. Status: {response.status_code}"}
                
            content = result['choices'][0]['message']['content']
            
            # Clean content in case of markdown blocks
            content = content.replace('```json', '').replace('```', '').strip()
            
            return json.loads(content)
        except requests.exceptions.Timeout:
            return {"error": "Request to AI service timed out. Please try again."}
        except Exception as e:
            details = response.text if response is not None else "No response from server"
            return {"error": f"AI Error: {str(e)}", "details": details}

    def _build_job_prompt(self, data):
        c6 = data['csl6']
        c10 = data['csl10']
        others = ", ".join(data['others'])

        return f"""
You are a 'Gold Nadi' Professional Consultant. Analyze the native's career potential based on their 6th and 10th Cuspal Sublords (CSL) and supporting planets.

PRIMARY DATA:
- 6th CSL (Service/Effort): {c6['planet']} (Success: {c6['prediction']['success_rate']}, Income: {c6['prediction']['income_expenses']['good']})
- 10th CSL (Authority/Fame): {c10['planet']} (Success: {c10['prediction']['success_rate']}, Income: {c10['prediction']['income_expenses']['good']})

SUPPORTING STRENGTHS:
Strong Supporting Planets: {others}

CONSULTING RULES:
1. Identify if the native is better suited for Job (6, 10, 11) or Business (2, 7, 10, 11).
2. Look for "Hit Houses" in the combination to suggest specific fields (e.g., 2=Finance, 10=Govt, 3=Media).
3. Provide a professional, encouraging yet realistic tone.

RETURN JSON EXACTLY:
{{
"summary": {{
    "executive_view": "One powerful paragraph summarizing overall professional strength.",
    "top_recommendations": ["Concise Field 1", "Concise Field 2"],
    "personal_mastery": ["One actionable master tip"]
}}
}}
"""
