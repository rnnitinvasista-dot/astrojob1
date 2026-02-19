import os
import json
from ai_service import AIService

def test_ai():
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ Missing OPENROUTER_API_KEY")
        return
    
    ai = AIService(api_key)
    # Sample data
    test_data = {
        "csl6": {"planet": "Mars", "pl": [6], "nl": [9], "sl": [11]},
        "csl10": {"planet": "Mercury", "pl": [1], "nl": [4], "sl": [10]}
    }
    
    print("🚀 Testing AI Job Analysis...")
    result = ai.generate_job_analysis(test_data)
    print("✅ Result:")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_ai()
