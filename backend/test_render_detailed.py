import requests
import json

def test_render_detailed():
    url = "https://astrojob.onrender.com/api/v1/kp/kundli"
    
    def check_ayan(ayan_name):
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
                "ayanamsa": ayan_name,
                "house_system": "Placidus",
                "node_type": "Mean"
            }
        }
        res = requests.post(url, json=payload, timeout=30).json()
        moon = next(p for p in res["planets"] if p["planet"] == "Moon")
        return moon["lon"], res["dasha"]["mahadasha_sequence"][1]["start_date"]

    print("Testing KP vs Lahiri on Live Render:")
    kp_lon, kp_date = check_ayan("KP")
    lah_lon, lah_date = check_ayan("Lahiri")
    
    print(f"KP Moon: {kp_lon:.4f}  | Mercury Start: {kp_date}")
    print(f"Lahiri Moon: {lah_lon:.4f} | Mercury Start: {lah_date}")
    
    if kp_lon == lah_lon:
        print("!!! ERROR: Ayanamsa selection is being IGNORED by the server !!!")
    else:
        print("Success: Ayanamsa shift is detected.")

test_render_detailed()
