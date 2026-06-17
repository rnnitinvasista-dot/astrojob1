import sys
import re
try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        print("Required PDF libraries not found.")
        sys.exit(1)

def extract_text(pdf_path):
    reader = PdfReader(pdf_path)
    combined_data = {}
    
    # Process each page
    for page_num, page in enumerate(reader.pages):
        text = page.extract_text()
        if not text: continue
        
        lines = text.split('\n')
        for line in lines:
            # More relaxed pattern to catch variation
            match = re.search(r'(\d)\s*-+\s*(\d)', line)
            if match:
                print(f"PAGE {page_num}: {line}")
    
    return combined_data


if __name__ == "__main__":
    pdf_path = r"d:\love story\backup astrology\adv astro\astro\functions\Nemorology Book (25-50) English.pdf"
    data = extract_text(pdf_path)
    import json
    with open(r"d:\love story\backup astrology\adv astro\astro\numerology_combinations.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Data extracted to numerology_combinations.json")


