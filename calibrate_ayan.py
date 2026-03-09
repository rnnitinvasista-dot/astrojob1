
import swisseph as swe

# Current Time
jd = swe.julday(2026, 3, 9, 21.75) # Approx now

def get_ayan(mode):
    swe.set_sid_mode(mode, 0, 0)
    return swe.get_ayanamsa_ut(jd)

ayan_5 = get_ayan(5) # Krishnamurti
ayan_0 = get_ayan(0) # Lahiri
ayan_kh = ayan_0 - (6.0 / 60.0) # KP Khullar/Hariharan (approx -6 min from Lahiri)

print(f"SIDM_KRISHNAMURTI (5): {ayan_5:.6f}")
print(f"SIDM_LAHIRI (0):       {ayan_0:.6f}")
print(f"KP Khullar (-6m):     {ayan_kh:.6f}")
print(f"Difference (5 vs KH): {(ayan_5 - ayan_kh)*60:.2f} mins")
