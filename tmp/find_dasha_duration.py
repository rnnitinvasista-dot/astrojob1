
import datetime
import pytz

def add_yrs(dt, yrs, days_per_yr):
    total_days = yrs * days_per_yr
    return dt + datetime.timedelta(days=total_days)

# Birth: 2007-05-04 10:30 IST
birth = datetime.datetime(2007, 5, 4, 10, 30, tzinfo=pytz.timezone('Asia/Kolkata'))

# Moon at 219°15'48" -> Saturn MD (19y)
# Balance = 10.54975 years (based on image Moon)
bal = 10.54975

targets = [365, 365.2425, 365.25, 360]
for d in targets:
    md1_end = add_yrs(birth, bal, d)
    # Mercury MD starts after Saturn. Mercury MD is 17 years.
    mercury_md_end = add_yrs(md1_end, 17, d)
    print(f"Days: {d:<10} | Mercury MD End: {mercury_md_end.strftime('%Y-%m-%d')}")
