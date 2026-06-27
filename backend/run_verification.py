import requests
import json

url = "http://127.0.0.1:8000/api/signals"
image_path = r"C:\Users\penda\.gemini\antigravity-ide\brain\522f16e8-c4c0-463f-bd63-a842df4d14c2\test_pothole_1782562824822.png"

files = {'image': ('test_image.png', open(image_path, 'rb'), 'image/png')}
data = {
    'title': 'Test Signal for Verification',
    'description': 'A large pothole on a city street.',
    'location': 'Downtown, Main St'
}

response = requests.post(url, files=files, data=data)
print(f"Status Code: {response.status_code}")
try:
    resp_json = response.json()
    print(json.dumps(resp_json, indent=2))
except Exception as e:
    print(f"Failed to parse JSON: {e}")
    print(response.text)
