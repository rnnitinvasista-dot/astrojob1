
import requests
import json

def check_live_api():
    url = "https://astrojob.onrender.com/api/v1/kp/kundli"
    payload = {
        "date": "2007-08-16",
        "time": "04:20:00",
        "latitude": 13.2172,
        "longitude": 79.1003,
        "timezone": "Asia/Kolkata"
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        print(f"Testing API at: {url}")
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        if data['status'] == 'success':
            first_planet = data['planets'][0]
            print(f"Success! Backend response received.")
            print(f"Sample Planet Lord (should be short code): {first_planet.get('sign_lord')}")
            print(f"Sample House Degree (should be absolute): {data['houses'][0].get('cusp_degree_dms')}")
            
            # If sign_lord is 2 chars, it's the new backend
            if first_planet.get('sign_lord') and len(first_planet.get('sign_lord')) <= 2:
                print(">>> VERIFIED: Backend is updated with new logic.")
            else:
                print(">>> WARNING: Backend seems to have OLD logic.")
        else:
            print(f"API Error: {data.get('message')}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    check_live_api()
