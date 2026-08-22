import re
import json

def extract_mahurthams():
    with open(r"d:\love story\backup astrology\adv astro\astro\full_pdf_text.txt", "r", encoding='utf-16le', errors='ignore') as f:
        content = f.read()

    data = {
        "land_worship": {},
        "vehicle_purchase": {},
        "house_warming": {},
        "marriage_dates": {}
    }

    # Land Worship Pattern: "To those who was born on 1, 10, 19, 28: Land worship should be made on 1, 3, 4, 10, 12, 13, 19, 21, 22, 28, 30, 31 dates"
    land_matches = re.finditer(r'born on\s*([0-9,\s]+):\s*Land worship should be made on\s*([0-9,\s]+)\s*dates', content, re.IGNORECASE)
    for m in land_matches:
        births = [int(x.strip()) for x in m.group(1).split(',')]
        dates = [int(x.strip()) for x in m.group(2).split(',')]
        for b in births:
            data["land_worship"][b] = dates

    # Vehicle Purchase Pattern: "Vehicle Purchase To those who was born on 1, 10, 19, 28: 1, 3, 4, 10, 12, 13, 19, 21, 22, 28, 30, 31 dates"
    # Actually, find the "Vehicle Purchase" section and then the birth dates within it.
    vehicle_section = re.split(r'Mahurthams for Vehicle Purchase', content, flags=re.IGNORECASE)
    if len(vehicle_section) > 1:
        v_sub = vehicle_section[1]
        v_matches = re.finditer(r'born on\s*([0-9,\s]+):\s*([0-9,\s]+)\s*dates', v_sub, re.IGNORECASE)
        for m in v_matches:
            births = [int(x.strip()) for x in m.group(1).split(',')]
            dates = [int(x.strip()) for x in m.group(2).split(',')]
            for b in births:
                data["vehicle_purchase"][b] = dates

    # House-Warming
    house_section = re.split(r'Mahuthams for House-Warming', content, flags=re.IGNORECASE)
    if len(house_section) > 1:
        h_sub = house_section[1]
        h_matches = re.finditer(r'born on\s*([0-9,\s]+):\s*([0-9,\s]+)\s*dates', h_sub, re.IGNORECASE)
        for m in h_matches:
            births = [int(x.strip()) for x in m.group(1).split(',')]
            dates = [int(x.strip()) for x in m.group(2).split(',')]
            for b in births:
                data["house_warming"][b] = dates

    # Marriage Dates
    marriage_section = re.split(r'Marriage Dates', content, flags=re.IGNORECASE)
    if len(marriage_section) > 1:
        m_sub = marriage_section[1]
        m_matches = re.finditer(r'born on\s*([0-9,\s]+):\s*([0-9,\s]+)\s*dates', m_sub, re.IGNORECASE)
        for m in m_matches:
            births = [int(x.strip()) for x in m.group(1).split(',')]
            dates = [int(x.strip()) for x in m.group(2).split(',')]
            for b in births:
                data["marriage_dates"][b] = dates

    return data

if __name__ == "__main__":
    results = extract_mahurthams()
    with open(r"d:\love story\backup astrology\adv astro\astro\mahurthams_data.json", "w") as f:
        json.dump(results, f, indent=2)
    print("Extracted to mahurthams_data.json")
