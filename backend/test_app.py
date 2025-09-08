from app import create_app
import threading
import time
import requests

app = create_app()


def run_app():
    print("Starting Phonebook app on port 5002...")
    app.run(host="127.0.0.1", port=5002, debug=False, use_reloader=False)


# Start the app in a separate thread
thread = threading.Thread(target=run_app, daemon=True)
thread.start()

# Give it time to start
time.sleep(3)

try:
    response = requests.get("http://127.0.0.1:5002")
    print(f"Response status: {response.status_code}")
    print(f'Content type: {response.headers.get("content-type")}')
    print(f"Response length: {len(response.text)}")
    if "html" in response.headers.get("content-type", ""):
        print("HTML content received (likely React app)")
        print("First 200 chars:", response.text[:200])
    else:
        print(f"Response text: {response.text[:200]}...")
except Exception as e:
    print(f"Request failed: {e}")

time.sleep(1)
