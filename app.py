import os
from app import app
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()

PORT = os.getenv('PORT') or 8080
isProduction = os.getenv("APPLICATION_MODE") == "PRODUCTION"

CORS(app, resources={r"/*": {"origins": "*"}})

# client = dbConfig.DB_Config()

app.secret_key = "secret_key"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(PORT), debug=not isProduction)
