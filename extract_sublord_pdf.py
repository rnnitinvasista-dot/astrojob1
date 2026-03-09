
import sys
import PyPDF2

def extract_text(pdf_path):
    print(f"\n--- EXTRACTING: {pdf_path} ---")
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        # Read first 30 pages to find any rule text
        for i in range(min(len(reader.pages), 30)):
            text += f"\n--- Page {i+1} ---\n"
            text += reader.pages[i].extract_text() + "\n"
        print(text)
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")

pdf = r"d:\love story\astro\332431095-KP-Sub-Lord-Table.pdf"
extract_text(pdf)
