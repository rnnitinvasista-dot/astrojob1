import zipfile
import os

zip_path = r"d:\love story\astro\pfd\swisseph-master.zip"

try:
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        print(f"Listing contents of {zip_path} (First 20 items):")
        names = zip_ref.namelist()
        for name in names[:20]:
            print(name)
        print(f"\nTotal files: {len(names)}")
        
        # Check for ephemeris files
        se1_files = [n for n in names if n.endswith('.se1')]
        if se1_files:
            print(f"\nFound .se1 files: {len(se1_files)}")
            print(se1_files[:5])
        else:
            print("\nNo .se1 files found in zip.")
            
except Exception as e:
    print(f"Error reading zip: {e}")
