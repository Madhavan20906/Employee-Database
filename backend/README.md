# Backend (Flask)

1. Create virtualenv: `python -m venv venv && source venv/bin/activate`
2. Install: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and edit if needed.
4. Initialize DB:
   - `export FLASK_APP=app.py`
   - `flask db init`
   - `flask db migrate -m "init"`
   - `flask db upgrade`
   (alternatively the app will create a sqlite file on first run)
5. Run: `python app.py`
