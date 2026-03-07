import requests
import json

def test_render_lahiri():
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
    
    print(f"Testing Lahiri on Render...")
    try:
        response = requests.post(url, json=payload, timeout=30)
        data = response.json()
        
        if data["status"] == "success":
            mds = data["dasha"]["mahadasha_sequence"]
            print("Dasha MD Sequence:")
            for md in mds[:3]:
                print(f"  {md['planet']}: {md['start_date']} to {md['end_date']}")
            
            # Check for current MD/AD/PD
            print(f"Current MD: {data['dasha']['current_dasha']}")
            print(f"Ayanamsa used (metadata): {data.get('metadata', {}).get('ayanamsa')}")
        else:
            print(f"Error: {data.get('message')}")
            
    except Exception as e:
        print(f"Failed: {e}")

test_render_lahiri()
