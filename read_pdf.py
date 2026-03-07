import sys
import subprocess

try:
    import PyPDF2
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    import PyPDF2

try:
    reader = PyPDF2.PdfReader('d:\\love story\\astro\\Dasha bukti.pdf')
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print("--- PDF CONTENT ---")
    print(text)
except Exception as e:
    print(f"Error reading PDF: {e}")
