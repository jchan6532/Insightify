import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("app/firebase/service_account.json")

firebase_admin.initialize_app(cred)

