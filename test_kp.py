import requests
import json

url = "http://localhost:8000/api/v1/kp/kundli"
payload = {
    "birth_details": {
        "date_of_birth": "1990-01-01",
        "time_of_birth": "12:00",
        "timezone": "Asia/Kolkata",
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    "calculation_settings": {
        "ayanamsa": "Lahiri",
        "house_system": "Placidus",
        "node_type": "Mean"
    }
}
headers = {
  'Content-Type': 'application/json'
}

try:
    response = requests.post(url, headers=headers, json=payload)
    print(response.text)
except Exception as e:
    print(e)
