
import sys
import PyPDF2

def extract_text(pdf_path):
    print(f"\n--- EXTRACTING: {pdf_path} ---")
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for i in range(min(len(reader.pages), 10)): # Limit to first 10 pages for speed/context
            text += f"\n--- Page {i+1} ---\n"
            text += reader.pages[i].extract_text() + "\n"
        print(text)
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")

pdfs = [
    r"d:\love story\astro\DEGREE CALCULATION-2.pdf",
    r"d:\love story\astro\332431095-KP-Sub-Lord-Table.pdf",
    r"d:\love story\astro\376778146-KP-TABLE-for-1-to-249-Horary-Numbers - Copy.pdf"
]

for pdf in pdfs:
    extract_text(pdf)
