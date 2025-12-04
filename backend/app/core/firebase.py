import firebase_admin
from firebase_admin import credentials
import json

from app.core.config import get_settings

settings = get_settings()

if not settings.FIREBASE_SERVICE_ACCOUNT_JSON:
    raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_JSON is empty. Check Railway variables.")

print(settings.FIREBASE_SERVICE_ACCOUNT_JSON)

service_account_json = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
cred = credentials.Certificate(service_account_json)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

