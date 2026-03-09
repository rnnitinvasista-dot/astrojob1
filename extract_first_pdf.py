
import sys
import PyPDF2

def extract_text(pdf_path):
    print(f"\n--- EXTRACTING: {pdf_path} ---")
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for i in range(len(reader.pages)):
            text += f"\n--- Page {i+1} ---\n"
            text += reader.pages[i].extract_text() + "\n"
        print(text)
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")

pdf = r"d:\love story\astro\DEGREE CALCULATION-2.pdf"
extract_text(pdf)
