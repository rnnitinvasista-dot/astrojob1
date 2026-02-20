
import requests
import json

def fetch_live_data():
    url = "https://astrojob.onrender.com/api/v1/kp/kundli"
    payload = {
        "birth_details": {
            "date_of_birth": "2007-05-04",
            "time_of_birth": "23:21",
            "timezone": "Asia/Kolkata",
            "latitude": 22.5726,
            "longitude": 88.3639
        },
        "calculation_settings": {
            "ayanamsa": "KP",
            "house_system": "Placidus",
            "node_type": "Mean"
        }
    }
    print(f"Fetching from {url}...")
    try:
        response = requests.post(url, json=payload, timeout=15)
        if response.status_code == 200:
            data = response.json()
            sigs = data.get("significations", [])
            if sigs:
                print("First significator keys:", sigs[0].keys())
                print("Sun Significator:", json.dumps(sigs[0], indent=2))
            else:
                print("No significations found in response.")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Request failed: {str(e)}")

if __name__ == "__main__":
    fetch_live_data()
