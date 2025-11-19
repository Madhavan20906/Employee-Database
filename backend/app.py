import os
from flask import Flask, jsonify, send_from_directory
from config import Config
from models import db
from flask_migrate import Migrate
from flask_cors import CORS
from routes_auth import auth_bp
from routes_employee import emp_bp
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__, static_folder="frontend/dist", static_url_path="/")
    app.config.from_object(Config)

    # 🔥 FIX FOR RENDER DB DISCONNECTION
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "pool_pre_ping": True,
        "pool_recycle": 280
    }

    CORS(app)

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(emp_bp, url_prefix="/api/employees")

    # CREATE TABLES IF NOT EXISTS
    with app.app_context():
        db.create_all()
        print("🔥 DATABASE TABLES CREATED (IF NOT EXISTS)")

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # -----------------------------
    # 🚀 FIX FOR REACT ROUTES
    # -----------------------------
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        if path != "" and os.path.exists(os.path.join("frontend/dist", path)):
            return send_from_directory("frontend/dist", path)
        return send_from_directory("frontend/dist", "index.html")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
