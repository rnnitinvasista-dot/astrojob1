import PyPDF2

pdf_path = 'd:\\love story\\astro\\Mantreswaras_Phaladeeplka.pdf'
reader = PyPDF2.PdfReader(pdf_path)

for i, p in enumerate(reader.pages):
    text = p.extract_text()
    if 'EIGHTH' in text.upper() and 'CHAPTER' in text.upper():
        print(f'Found "EIGHTH CHAPTER" at page {i}')
    if 'PLANETS' in text.upper() and 'HOUSES' in text.upper() and 'RESULT' in text.upper():
        print(f'Found "PLANETS HOUSES RESULTS" at page {i}')
