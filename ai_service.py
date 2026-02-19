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
            "model": "google/gemini-2.0-flash-001", # High performance, stable
            "messages": [
                {"role": "system", "content": "You are an expert Nadi Astrologer. Analyze the astrological data based strictly on the provided Nadi rules."},
                {"role": "user", "content": prompt}
            ],
            "response_format": { "type": "json_object" }
        }

        try:
            response = requests.post(self.base_url, headers=self.headers, data=json.dumps(payload))
            response.raise_for_status()
            result = response.json()
            content = result['choices'][0]['message']['content']
            return json.loads(content)
        except Exception as e:
            return {"error": str(e), "raw_response": response.text if 'response' in locals() else None}

    def _build_job_prompt(self, data):
        return f"""
Analyze the Job/Business potential for a native based on the 6th and 10th House Cuspal Sublords (CSL).

Astrological Data:
Cuspal Sublords:
- 6th CSL: {data['csl6']['planet']} (PL: {data['csl6']['pl']}, NL: {data['csl6']['nl']}, SL: {data['csl6']['sl']})
- 10th CSL: {data['csl10']['planet']} (PL: {data['csl10']['pl']}, NL: {data['csl10']['nl']}, SL: {data['csl10']['sl']})

Nadi Rules for Analysis:
1. Weightage:
   - Planet Level (PL): 20%
   - Nakshatra Level (NL): 30%
   - Sublord Level (SL): 50%
   - Total Success = (PL_Score * 0.2) + (NL_Score * 0.3) + (SL_Score * 0.5)

2. Hit Theory (Power Position):
   - Good Houses: 2, 6, 7, 10, 11 (Main: 2, 6, 7, 10, 11 are very good; 3, 4, 9 are good with conditions)
   - Bad Houses: 5, 8, 12 (Main: 5, 8, 12 are bad; 6, 7, 12 can be bad if associated with 5, 8, 12)
   - Success Rate Calculation: Use the Hit Theory Success Rate logic (Excellent: E, High: H, Medium: M, Low: L, Bad: B*, Very Bad: VB*).

3. Area of Job:
   - Determine the professional field based primarily on NL and SL Hit Theory houses.
   - 1: Self-effort, Army, Military, Yoga.
   - 2: Bank, Finance, Gems, Jewelry, Hotel.
   - 3: CA, Accountancy, Media, Journalism, Software.
   - 4: Agriculture, Real Estate, Teaching, Construction.
   - 5: Arts, Cinema, Advertising, Shares, IT.
   - 6: Service Industry, Medicine, Law, Civil Services, Engineering.
   - 7: Business, Trade, Logistics, Public Relations.
   - 8: Technology, Research, Astrology, Petroleum, Surgery.
   - 9: Professor, Tourism, NGO, Foreign Travel.
   - 10: Government Job, Authoritative Position, MD/CEO.
   - 11: Government/Private Job, Business, Gains.
   - 12: Research, Abroad Job, Hospital, MNC.

4. Good vs Bad Bifurcation:
   - Scenario 1: Both 11 & 12 present -> Income and Investment.
   - Scenario 2: 11 present, 12 absent -> Gain through service/police.
   - Scenario 3: 11 absent, 12 present -> Loss/Foreign/Don.
   - Scenario 4: 11 absent, 12 absent -> Average.

Please provide the result in JSON format with the following keys:
"prediction": {{
    "csl6_analysis": "string",
    "csl10_analysis": "string",
    "overall_combination": "list of good and bad houses",
    "income_expenses": "Very High/High/Medium/Low",
    "success_rate": "Excellent/High/Medium/Low/Bad/Very Bad",
    "area_of_job": "list of possible professions",
    "remedies": "list of suggested remedies if bad"
}}

Strictly follow these rules for the analysis.
"""
