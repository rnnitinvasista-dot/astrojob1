from nadi_core import NadiEngine
engine = NadiEngine()
table = engine.HORARY_TABLE
with open("horary_table_debug.txt", "w") as f:
    for num in sorted(table.keys()):
        h = table[num]
        f.write(f"{num:3}: {engine.decimal_to_dms(h['lon'], True)} | {h['sign']} | {h['sl']}-{h['nl']}-{h['sub']}\n")
print("Table written to horary_table_debug.txt")
