import requests
import json

url = "https://astrojob.onrender.com/api/v1/kp/kundli"
payload = {
    "birth_details": {
        "date_of_birth": "1993-08-08",
        "time_of_birth": "10:37:00",
        "latitude": 15.8498,
        "longitude": 74.4977,
        "timezone": "Asia/Kolkata"
    },
    "calculation_settings": {
        "ayanamsa_id": 39,
        "house_system": "P"
    }
}
try:
    res = requests.post(url, json=payload, timeout=30)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")
    data = res.json()
    if "dasha" in data:
        print("Live API MD Sequence:")
        for md in data["dasha"]["mahadasha_sequence"]:
            print(f"{md['planet']}: {md['start_date']} to {md['end_date']}")
    else:
        print("No dasha key in response.")
except Exception as e:
    print(f"Error: {e}")
