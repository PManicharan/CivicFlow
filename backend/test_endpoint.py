import requests

# Create a dummy image file
with open("test_image.jpg", "wb") as f:
    f.write(b"dummy image content")

url = "http://127.0.0.0:8000/api/signals"
url = "http://127.0.0.1:8000/api/signals"
files = {'image': ('test_image.jpg', open('test_image.jpg', 'rb'), 'image/jpeg')}
data = {
    'title': 'Test Signal',
    'description': 'This is a test description.',
    'location': 'Test Location, City'
}

response = requests.post(url, files=files, data=data)
print(response.status_code)
print(response.json())
