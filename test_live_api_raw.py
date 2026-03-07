import requests
import json

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
    print(f"Status Code: {res.status_code}")
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
