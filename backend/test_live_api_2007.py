import requests
import json

url = "https://astrojob.onrender.com/api/v1/kp/kundli"
payload = {
    "birth_details": {
        "date_of_birth": "2007-05-04",
        "time_of_birth": "10:30:00",
        "latitude": 12.9717,
        "longitude": 77.5946,
        "timezone": "Asia/Kolkata"
    },
    "calculation_settings": {
        "ayanamsa_id": 39,
        "house_system": "P"
    }
}
try:
    res = requests.post(url, json=payload, timeout=30)
    data = res.json()
    print("Live API MD Sequence (2007 Chart):")
    if "dasha" in data:
        for md in data["dasha"]["mahadasha_sequence"][:4]:
            print(f"{md['planet']}: {md['start_date']} to {md['end_date']}")
    else:
        print(f"Error: {data}")
except Exception as e:
    print(f"Error: {e}")
