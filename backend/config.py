import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)

# ---- SQLite path (no longer used) ----
DB_PATH = os.path.join(INSTANCE_DIR, "employees.db")

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://neondb_owner:npg_RGfo1pHTaF0M@ep-sparkling-rain-adhbd70v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-secret")
