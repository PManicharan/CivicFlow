import os
import sys
sys.path.append(os.getcwd())
from app.core.config import settings
import firebase_admin
from firebase_admin import credentials, firestore, storage
cred = credentials.Certificate('service-account.json')
firebase_admin.initialize_app(cred, {'storageBucket': f"{settings.PROJECT_NAME.lower().replace(' ', '-')}.appspot.com"})
db = firestore.client()
bucket = storage.bucket()
try:
    db.collection('health_check').limit(1).get()
    print('Firestore OK')
except Exception as e:
    print('Firestore Error:', e)

try:
    print('Bucket exists:', bucket.exists())
except Exception as e:
    print('Storage Error:', e)
