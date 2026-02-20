
import requests
import json

def check_backend():
    url = "https://astrojob.onrender.com/health"
    print(f"Pinging {url}...")
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Body: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    check_backend()
