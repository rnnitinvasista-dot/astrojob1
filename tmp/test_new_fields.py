
import sys
import os
import json

# Add current directory to path
sys.path.insert(0, os.getcwd())

from nadi_core import NadiEngine

engine = NadiEngine()
# 2007-05-04 10:30 Bengaluru
res = engine.calculate_kundli('2007-05-04 10:30:00', 'Asia/Kolkata', 12.9666, 77.5833)

print("Planetary Status Sample:")
print(json.dumps(res['planetary_status'][:3], indent=2))

print("\nMahadasha Prediction:")
print(res['mahadasha_prediction'])
