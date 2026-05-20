# EMS-Fullstack (Flask + React)

This archive contains a full-stack Employee Management System sample:
- backend/: Flask REST API with JWT auth and CRUD
- frontend/: React app (simple) with login/register/dashboard

See backend/README.md and frontend/README.md for running instructions.
"# EmployeeDB" 
"# EmployeeDB" 
"# EmployeeDB" 
"# Employee-Database" 
# 🏢 Secure Full-Stack Employee Database & Management System (EMS)
[![React](https://img.shields.io/badge/React-v18.2.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3.x-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Flask](https://img.shields.io/badge/Flask-v2.3.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F28?style=for-the-badge&logo=python&logoColor=white)](https://www.sqlalchemy.org/)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL-00E699?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
A high-performance, enterprise-grade Employee Management System (EMS) combining a secure **Flask REST API** with a modern **React v18 Dashboard**. Features secure **JWT-based Authentication**, live name-based search, multi-format data export utilities (Excel, PDF, CSV), and a production-optimized connection pool engineered specifically for serverless cloud databases (Neon PostgreSQL).
---
## 🌟 Key Features
### 💻 Rich React v18 Dashboard Frontend
*   **Modern Interactive UI:** Formed with **Bootstrap 5.3** and enhanced with fluid animations using **Framer Motion**.
*   **Secure Auth Pages:** Full-featured Registration and Login panels managing JWT credentials securely.
*   **Dual Data Export Engine:**
    *   **Client-Side PDF Generation:** Exports tabular summaries directly to highly formatted PDFs using `jspdf` and `jspdf-autotable`.
    *   **Excel Export (`.xlsx`):** Integrates client-side spreadsheet generation using `xlsx` and server-side binary generation using `pandas`.
*   **Reactive CRUD & Filtering:** Live dynamic search filtering by employee name with clean inline form operations.
### 🛡️ Secure & Optimized Flask API
*   **Blueprint Modularity:** Separates clean routing contexts into `/api/auth` and `/api/employees`.
*   **JWT Security Guards:** Protects operational endpoints with high-security `Flask-JWT-Extended` tokens.
*   **Neon Cloud DB Resilience:** Configured with SQLAlchemy engine parameters (`pool_pre_ping=True` and `pool_recycle=280`) specifically tuned to resolve connection drops on serverless architectures.
*   **Integrated Single-Page Webserver:** Serves React production static assets (`frontend/build`) directly from Flask, eliminating complex proxy/CORS setup in staging.
---
## 📂 Repository Structure
```
Employee-Database/
│
├── backend/                  # Flask REST API
│   ├── app.py                # App Initialization & Single-Page Router configuration
│   ├── config.py             # Database URI & JWT key variables
│   ├── models.py             # SQLAlchemy schemas (User, Employee)
│   ├── routes_auth.py        # Authentication blueprint (Login / Register)
│   ├── routes_employee.py    # Employee CRUD blueprint & server-side Excel exporter
│   ├── requirements.txt      # Python libraries
│   ├── .env.example          # Sample environment configurations
│   └── .env                  # Live environment secrets (gitignored)
│
├── frontend/                 # React Frontend
│   ├── package.json          # npm dependencies
│   ├── src/                  # Components, utilities, and assets
│   │   ├── components/       # Forms, tables, and auth screens
│   │   └── App.js            # Main application controller
│   └── public/               # Static icons & HTML page template
│
└── README.md                 # Project root documentation
```
---
## 🚀 Getting Started
### 📋 Prerequisites
*   Python 3.8+ installed
*   Node.js (LTS version) & npm installed
---
### ⚙️ Backend (Flask) Setup
1.  **Navigate to backend and create a virtual environment:**
    ```bash
    cd backend
    python -m venv venv
    
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure Environment Secrets:**
    Copy `.env.example` to `.env` and fill in your keys:
    ```bash
    # Windows
    copy .env.example .env
    
    # macOS/Linux
    cp .env.example .env
    ```
    Configure the active variables inside `.env`:
    ```env
    FLASK_APP=app.py
    FLASK_ENV=development
    JWT_SECRET_KEY=your_jwt_secret_token
    DATABASE_URL=postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require
    ```
4.  **Launch the Backend Server:**
    ```bash
    python app.py
    ```
    The REST API will launch on **`http://localhost:5000`**.
---
### 💻 Frontend (React) Setup
1.  **Navigate to the frontend folder:**
    ```bash
    cd ../frontend
    ```
2.  **Install npm packages:**
    ```bash
    npm install
    ```
3.  **Launch React App in Development Mode:**
    ```bash
    npm start
    ```
    Your browser will open automatically at **`http://localhost:3000`**.
---
## 📡 API Reference Endpoints
All employee operations require the header: `Authorization: Bearer <your_jwt_token>`
### 🔑 Authentication (`/api/auth`)
*   `POST /register` - Register a new administrative account. (Body: `username`, `password`)
*   `POST /login` - Log in and retrieve the authorization token. (Body: `username`, `password`)
### 👥 Employees (`/api/employees`)
*   `GET /` - Retrieve all employees. Supports search query parameter (e.g., `?search=john`).
*   `POST /` - Register a new employee card. (Body: `name`, `email`, `position`, `department`, `salary`, `date_joined`)
*   `PUT /<id>` - Modify existing employee details.
*   `DELETE /<id>` - Delete an employee card from the database.
*   `GET /export/excel` - Download complete employee table in Excel (`.xlsx`) format.
---
## 🔒 Cloud Database Connection Pool Optimizations
Flask-SQLAlchemy is configured to interact seamlessly with Neon serverless endpoints using automated ping checks to ensure a connection is active before executing queries:
```python
# app.py
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "pool_pre_ping": True,  # Checks connection before running operations
    "pool_recycle": 280     # Recycles connection within 280 seconds (pre-empting Render timeout)
}
```
---
## 🌐 Production Deployment (Render)
This monorepo is fully optimized to compile the frontend and serve it directly from the Flask app in production.
1.  **Build the React Frontend:**
    Inside `frontend/`, run:
    ```bash
    npm run build
    ```
    Move the generated `build` folder inside the `backend` folder structure, or configure Flask's static paths to match.
2.  **Create a Render Web Service:**
    *   **Runtime:** `Python`
    *   **Build Command:** `pip install -r requirements.txt` (inside the backend context)
    *   **Start Command:** `gunicorn app:app`
    *   **Environment Variables:** Add `DATABASE_URL` (Neon Postgres String) and `JWT_SECRET_KEY`.
---
## 🤝 Contributing
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
---
## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
---
<p align="center">
  Made with ❤️ by <a href="https://github.com/Madhavan20906">Madhavan</a>
</p>
