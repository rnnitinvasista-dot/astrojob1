
try:
    import swisseph
    print("Successfully imported swisseph")
    print("Version:", swisseph.VERSION if hasattr(swisseph, 'VERSION') else "Unknown")
except ImportError as e:
    print("Failed to import swisseph:", e)

try:
    import pyswisseph
    print("Successfully imported pyswisseph")
except ImportError as e:
    print("Failed to import pyswisseph:", e)
