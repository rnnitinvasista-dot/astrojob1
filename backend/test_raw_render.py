import requests
import json

def test_raw_render():
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
    
    print("Capturing Raw Response from Render...")
    try:
        r = requests.post(url, json=payload, timeout=30)
        print(f"Status: {r.status_code}")
        print("Body Content:")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Failed: {e}")

test_raw_render()
