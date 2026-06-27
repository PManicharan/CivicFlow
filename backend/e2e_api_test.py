import requests
import json
import os
import sys

BASE_URL = "http://127.0.0.1:8000/api"

# Use the pothole artifact
IMAGE_PATH = r"C:\Users\penda\.gemini\antigravity-ide\brain\522f16e8-c4c0-463f-bd63-a842df4d14c2\test_pothole_1782562824822.png"

def test_api():
    if not os.path.exists(IMAGE_PATH):
        print(f"Error: image not found at {IMAGE_PATH}")
        sys.exit(1)

    print("Uploading signal...")
    with open(IMAGE_PATH, "rb") as f:
        files = {"image": ("pothole.png", f, "image/png")}
        data = {
            "title": "Severe Pothole on Main St",
            "description": "Massive pothole, caused damage to a car.",
            "location": "Main St & 4th Ave"
        }
        
        response = requests.post(f"{BASE_URL}/signals", data=data, files=files)
        
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        json_resp = response.json()
        print("Response JSON:")
        print(json.dumps(json_resp, indent=2))
        
        # Verify schema
        required_fields = ["caseId", "title", "description", "location", "imageUrl", "createdAt", "status", "category", "urgency", "confidence", "confidenceScore", "aiSafetyChecks", "communityImpact", "priorityReasons", "recommendedAction"]
        missing = [f for f in required_fields if f not in json_resp]
        if missing:
            print(f"FAIL: Missing fields in response: {missing}")
            sys.exit(1)
            
        print("\nSUCCESS: All expected fields present. Gemini is working!")
    else:
        print(response.text)
        sys.exit(1)

if __name__ == "__main__":
    test_api()
