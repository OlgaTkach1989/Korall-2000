# Korall 2000 - Verpackungs-Shop (React + Django)

![React](https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge&logo=react&logoColor=0b1b33)
![Django](https://img.shields.io/badge/Backend-Django-092e20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/DevOps-Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white)

## Live Demo / Website
[![Website](https://img.shields.io/badge/Website-Open-00b0b9?style=for-the-badge)](http://141.95.86.164:5173/)


Ein praxisnahes Abschlussprojekt: ein Onlineshop fuer Verpackungstueten mit
React (Vite) im Frontend und Django + Django REST Framework im Backend.

## Tech Stack
- Frontend: React, Vite, React Router, Context API
- Backend: Django, Django REST Framework
- Datenbank: PostgreSQL (Docker) oder SQLite (lokal)
- Deployment/Infra: Docker Compose

## Features (MVP)
- Seiten: Home, Produkte (Liste + Detail), Warenkorb, Checkout, Success, Admin
- Produktdaten aus der API (mit sinnvollem Fallback bei API-Fehlern)
- Warenkorb mit Mengen, Versandkosten und Gesamtsumme
- Checkout mit Lieferung oder Abholung (Pickup reduziert Pflichtfelder)
- Admin-Bereich mit Bestellstatus, Logistik-Sicht und Produktpflege

## Projektstruktur
```text
.
|- backend/              # Django-Projekt "server"
|  |- server/            # settings.py, urls.py, wsgi.py
|  |- shop/              # Modelle, Serializers, ViewSets, Admin, Commands
|  |- manage.py
|  |- entrypoint.sh
|- frontend/             # React + Vite App
|  |- src/
|     |- components/
|     |- pages/
|     |- api/
|     |- context/
|     |- i18n/
|- docker-compose.yml
|- requirements.txt
|- README.md
```

## Schnellstart (Docker Compose) - empfohlen
Voraussetzung: Docker Desktop / Docker Engine laeuft.

```bash
docker compose up --build -d
```

Danach:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/products/
- Django Admin: http://localhost:8000/admin/

Optional: Static Files fuer die Admin-Oberflaeche sammeln:
```bash
docker compose exec backend python manage.py collectstatic --noinput
```

## Lokaler Start ohne Docker

### 1) Backend (Django)
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

cd backend
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

Standardmaessig wird SQLite genutzt. Fuer PostgreSQL setze (Windows-Beispiel):
```bash
set USE_SQLITE=0
set POSTGRES_DB=packshop
set POSTGRES_USER=packshop
set POSTGRES_PASSWORD=deinpasswort
set POSTGRES_HOST=localhost
set POSTGRES_PORT=5432
```

### 2) Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

API-URL ueber eine Datei `frontend/.env` setzen:
```env
VITE_API_URL=http://localhost:8000/api/
```

## Nuetzliche Befehle
- Django Checks: `python manage.py check`
- Superuser erstellen: `python manage.py createsuperuser`
- Demo-Daten laden: `python manage.py seed_demo_data`
- Frontend Build: `npm run build`

## Deployment-Notizen
- Fuer den Produktivbetrieb wird Docker Compose verwendet.
- Ohne Nginx werden Static Files ueber WhiteNoise ausgeliefert.
- Wenn das Frontend keine API-Daten zeigt, ist meist `VITE_API_URL` falsch.

## Roadmap / Ausblick
- Admin-Login weiter absichern (Rollen/Permissions, API-Schutz)
- Medien/Uploads fuer Produkte (statt nur image_url)
- E-Mail-Workflows (z. B. SES) stabilisieren und beobachten
- HTTPS + Reverse Proxy (Nginx) fuer Produktion

## Screenshots
![Homepage](./frontend/screenshots/Screenshot%202026-01-19%20191854.png)
![Homepage](./frontend/screenshots/Screenshot%202026-01-18%20135052.png)
