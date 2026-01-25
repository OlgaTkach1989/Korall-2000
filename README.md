## Korall 2000 — Verpackungs-Shop (React + Django)

Dieses Projekt habe ich (Olga) als Übungs‑Onlineshop für Verpackungstüten gebaut. Frontend: React (Vite). Backend: Django REST Framework. Standard-DB ist SQLite, PostgreSQL ist vorbereitet.

### Struktur
```
.
├── backend/           # Django-Projekt `server`
│   ├── shop/          # Modelle für Produkte/Bestellungen, REST-API, Admin
│   ├── manage.py
│   └── requirements.txt (verweist auf root)
├── frontend/          # React + Vite App
│   └── src/           # components, pages, api, context, data
└── README.md
```

### Umgesetzte Features
- Seiten: Auth, Home, Produkte (Liste + Detail), Warenkorb, Checkout, Success, Admin.
- Warenkorb mit Summen und Versand; Bestellung wird an das Django-API gesendet.
- Admin: Bestellstatus umstellen, Produkte bearbeiten, Reiter „Logistik“ zeigt Lieferung/Abholung.
- Fallback-Daten `sampleProducts`, falls das API nicht verfügbar ist.

### Backend starten (Django)
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```
Standard ist SQLite. Für PostgreSQL:
```
set USE_SQLITE=0
set POSTGRES_DB=packshop
set POSTGRES_USER=packshop
set POSTGRES_PASSWORD=deinpasswort
set POSTGRES_HOST=localhost
set POSTGRES_PORT=5432
```

### Frontend starten (React)
```bash
cd frontend
npm install
npm run dev
```
API-URL per `.env` setzen:
```
VITE_API_URL=http://localhost:8000/api/
```

### Nützliche Befehle
- Django-Check: `python manage.py check`
- Frontend-Build: `npm run build`
- Superuser für /admin (Django): `python manage.py createsuperuser`

### Ideen für später
- Echte Authentifizierung im SPA (JWT/Sessions) und API absichern.
- Zahlung, E-Mail-Benachrichtigungen, Mediendateien für Produkte.
- PostgreSQL als Standard im Deployment nutzen.
- Über AWS den Betrieb hosten (z.B. EC2/Elastic Beanstalk) und Bestellungen per E-Mail an den Manager zustellen.

## 📸 Screenshots
![Homepage](./frontend/screenshots/Screenshot%202026-01-19%20191854.png)

