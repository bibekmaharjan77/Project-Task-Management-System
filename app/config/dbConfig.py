from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv(override=True)
connection_uri = os.getenv("CONNECTION_URI")

def DB_Config():
    try:
        print(connection_uri, "connection uri")
        client = MongoClient(connection_uri, tls=True, tlsAllowInvalidCertificates=True)
        print("Connected to MongoDB")
        return client["ProjectB"]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

    