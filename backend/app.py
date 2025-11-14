from flask import Flask, jsonify
from config import Config
from models import db
from flask_migrate import Migrate
from flask_cors import CORS
from routes_auth import auth_bp
from routes_employee import emp_bp
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()  # <-- ADD THIS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    Migrate(app, db)
    jwt = JWTManager(app)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(emp_bp, url_prefix="/api/employees")

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app
app = create_app()
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
