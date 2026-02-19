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
            "HTTP-Referer": "https://astrojob.onrender.com",
            "X-Title": "AstroJob Nadi Engine"
        }

    def generate_job_analysis(self, prompt_data):
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
            response = requests.post(self.base_url, headers=self.headers, data=json.dumps(payload), timeout=30)
            response.raise_for_status()
            result = response.json()
            
            if 'choices' not in result or len(result['choices']) == 0:
                return {"error": f"AI provider returned no choices. Status: {response.status_code}"}
                
            content = result['choices'][0]['message']['content']
            content = content.replace('```json', '').replace('```', '').strip()
            return json.loads(content)
        except requests.exceptions.Timeout:
            return {"error": "Request to AI service timed out. Please try again."}
        except Exception as e:
            details = response.text if response is not None else "No response from server"
            return {"error": f"AI Error: {str(e)}", "details": details}

    def _build_job_prompt(self, data):
        return f"""
Analyze the Job/Business potential for a native based on the 6th and 10th House Cuspal Sublords (CSL).

Astrological Data:
Cuspal Sublords:
- 6th CSL: {data['csl6']['planet']} (PL: {data['csl6']['pl']}, NL: {data['csl6']['nl']}, SL: {data['csl6']['sl']})
- 10th CSL: {data['csl10']['planet']} (PL: {data['csl10']['pl']}, NL: {data['csl10']['nl']}, SL: {data['csl10']['sl']})

Nadi Rules: (PL 20%, NL 30%, SL 50%). 
Hit Theory Houses for Success Rate: (Good: 2,6,7,10,11. Bad: 5,8,12).

Please provide result in JSON:
"prediction": {{
    "csl6_analysis": "string",
    "csl10_analysis": "string",
    "overall_combination": "list",
    "income_expenses": "Very High/High/Medium/Low",
    "success_rate": "Excellent/High/Medium/Low/Bad/Very Bad",
    "area_of_job": "list",
    "remedies": "list"
}}
"""
