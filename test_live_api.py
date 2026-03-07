import requests

url = "https://astrojob.onrender.com/api/v1/kp/kundli"
payload = {
    "date_of_birth": "1993-08-08",
    "time_of_birth": "10:37:00",
    "latitude": 15.8497,
    "longitude": 74.4977,
    "timezone": 5.5
}
try:
    res = requests.post(url, json=payload, timeout=30)
    data = res.json()
    print("Live API MD Sequence:")
    for md in data["dasha"]["mahadasha_sequence"]:
        print(f"{md['planet']}: {md['start_date']} to {md['end_date']}")
except Exception as e:
    print(f"Error: {e}")
