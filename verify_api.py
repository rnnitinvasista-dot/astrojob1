
import requests
import json

url = "http://localhost:8000/api/v1/kp/kundli"
payload = {
    "birth_details": {
        "date_of_birth": "2007-05-04",
        "time_of_birth": "10:30:00",
        "timezone": "Asia/Kolkata",
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    "calculation_settings": {
        "ayanamsa": "KP",
        "house_system": "Placidus",
        "node_type": "True"
    }
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print("Success! Ascendant:", data['ascendant']['degree_dms'])
        print("First Planet:", data['planets'][0]['planet'], data['planets'][0]['degree_dms'])
    else:
        print("Error Payload:", response.text)
except Exception as e:
    print("Connection failed:", e)
