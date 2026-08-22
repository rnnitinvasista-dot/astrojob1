import re
import json

def extract_all_data():
    with open(r"d:\love story\backup astrology\adv astro\astro\full_pdf_text.txt", "r", encoding='utf-16le', errors='ignore') as f:
        content = f.read()

    data = {
        "mahurthams": {
            "land_worship": {},
            "vehicle_purchase": {},
            "house_warming": {},
            "marriage_dates": {}
        },
        "mobile_rules": {
            "start_end_conflicts": {
                "9": [7, 2],
                "8": [4],
                "7": [3]
            },
            "conflict_groups": ["78", "87", "97", "79", "84", "48", "29", "92", "63", "36", "784", "487", "874"],
            "never_end_with": [0],
            "max_zeros": 2
        }
    }

    # Helper to parse sections
    def parse_section(title, start_pattern, stop_pattern=None):
        section_content = ""
        start_match = re.search(start_pattern, content, re.IGNORECASE)
        if start_match:
            start_idx = start_match.end()
            if stop_pattern:
                stop_match = re.search(stop_pattern, content[start_idx:], re.IGNORECASE)
                if stop_match:
                    section_content = content[start_idx:start_idx + stop_match.start()]
                else:
                    section_content = content[start_idx:start_idx + 2000]
            else:
                section_content = content[start_idx:start_idx + 2000]
        
        results = {}
        # Pattern for birth dates and lucky dates
        matches = re.finditer(r'born on\s*([0-9,\s]+):\s*([0-9,\s]+)\s*dates', section_content, re.IGNORECASE)
        for m in matches:
            births = [int(x.strip()) for x in m.group(1).split(',')]
            dates = [int(x.strip()) for x in m.group(2).split(',')]
            for b in births:
                results[b] = dates
        return results

    data["mahurthams"]["land_worship"] = parse_section("Land Worship", r"Mahurthams for Land Worship", r"Mahurthams for Vehicle Purchase")
    data["mahurthams"]["vehicle_purchase"] = parse_section("Vehicle Purchase", r"Mahurthams for Vehicle Purchase", r"Mahuthams for House-Warming")
    data["mahurthams"]["house_warming"] = parse_section("House Warming", r"Mahuthams for House-Warming", r"House-Warming for Rented House")
    data["mahurthams"]["marriage_dates"] = parse_section("Marriage Dates", r"Marriage Dates", r"Exploring Personal Years")
    
    return data

if __name__ == "__main__":
    results = extract_all_data()
    with open(r"d:\love story\backup astrology\adv astro\astro\numerology_expanded_data.json", "w") as f:
        json.dump(results, f, indent=2)
    print("Extracted to numerology_expanded_data.json")
