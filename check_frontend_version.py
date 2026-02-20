
import requests

def check_frontend():
    url = "https://astrojob-f0918.web.app"
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        # Search for version string
        if "v1.59-STABLE" in response.text:
            print("Frontend found: v1.59-STABLE (OK)")
        elif "v1.58" in response.text:
            print("Frontend found: v1.58 (OLD)")
        elif "v1.55" in response.text:
            print("Frontend found: v1.55 (OLD)")
        else:
            print("Version not found in HTML or unknown.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    check_frontend()
