
import swisseph as swe
from nadi_core import NadiEngine

def verify_249():
    engine = NadiEngine()
    table = engine.HORARY_TABLE
    
    # Numbers to test
    test_nums = [1, 24, 78, 125, 249]
    
    print("-" * 60)
    print(f"{'No.':<4} {'Sign':<12} {'Longitude':<18} {'SignL':<8} {'StarL':<8} {'SubL':<8}")
    print("-" * 60)
    
    for num in test_nums:
        if num in table:
            entry = table[num]
            lon = entry['lon']
            # Manual formatting for clarity
            deg = int(lon % 30)
            mnt = int((lon % 30 - deg) * 60)
            sec = (lon % 30 - deg - mnt/60) * 3600
            
            lon_str = f"{deg}°{mnt}'{sec:05.2f}\""
            
            print(f"{num:<4} {entry['sign']:<12} {lon_str:<18} {entry['sl']:<8} {entry['nl']:<8} {entry['sub']:<8}")
    print("-" * 60)

if __name__ == "__main__":
    verify_249()
