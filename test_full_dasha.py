import requests
import json

def test_full_dasha():
    url = "https://astrojob.onrender.com/api/v1/kp/kundli"
    payload = {
        "birth_details": {
            "date_of_birth": "2007-05-04",
            "time_of_birth": "10:30:00",
            "timezone": "Asia/Kolkata",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "place": "Bengaluru"
        },
        "calculation_settings": {
            "ayanamsa": "Lahiri",
            "house_system": "Placidus",
            "node_type": "Mean"
        }
    }
    
    print("Requesting Full Dasha Sequence (Lahiri)...")
    try:
        res = requests.post(url, json=payload, timeout=30).json()
        if res["status"] != "success":
            print(f"Error: {res.get('message')}")
            return
            
        print(f"Server Version: {res.get('version', 'Unknown')}")
        print(f"Balance at Birth: {res['dasha'].get('balance_at_birth')}")
        print("\nMahadasha Sequence:")
        for md in res["dasha"]["mahadasha_sequence"]:
            print(f"{md['planet']:10} | {md['start_date']} to {md['end_date']}")
    except Exception as e:
        print(f"Request failed: {e}")

test_full_dasha()
