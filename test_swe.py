import swisseph as swe
try:
    c, a = swe.houses_armc(100.0, 12.0, 23.4, b'P')
    print(f"Success with b'P': {c[0]}")
except Exception as e:
    print(f"Failed with b'P': {e}")
