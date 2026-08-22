import re
import json

def get_combinations():
    try:
        with open(r"d:\love story\backup astrology\adv astro\astro\full_pdf_text.txt", "r", encoding='utf-16le', errors='ignore') as f:
            content = f.read()
    except FileNotFoundError:
        return {}

    # Simplified search for X---Y -- numbers colors
    results = {}
    for n1 in range(1, 10):
        for n2 in range(1, 10):
            # Look for "X------Y --1, 2, 3 Yellow, Blue"
            # Flexible pattern
            pattern = rf"{n1}\s*-+\s*{n2}\s*-+\s*([0-9,\s]+)([A-Za-z,\s\.]+)"
            match = re.search(pattern, content)
            if match:
                results[f"{n1}-{n2}"] = {
                    "numbers": match.group(1).strip(),
                    "colors": match.group(2).strip().rstrip('.')
                }
            else:
                # Try search nearby context
                context_pattern = rf"{n1}\s*-+\s*{n2}"
                # Find all occurrences and print context for debugging missing ones
                pass
    return results

if __name__ == "__main__":
    results = get_combinations()
    print(json.dumps(results, indent=2))
