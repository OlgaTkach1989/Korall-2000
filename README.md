## Korall 2000 – Verpackungs-Shop

Vollständiges Beispiel eines Online-Shops für Verpackungstüten auf Basis von **React (Vite)** im Frontend und **Django + Django REST Framework** im Backend. Der Shop bildet alle geforderten Seiten nach den gelieferten Screenshots ab (Login/Registrierung, Home, Produkte & Detail, Warenkorb/Checkout, Danke-Seite, Admin-Dashboard).

### Projektstruktur

```
.
├── backend/                # Django-Projekt `server`
│   ├── shop/               # Produkte, Orders, Auth-API, Admin usw.
│   ├── manage.py
│   └── requirements.txt    # siehe root requirements.txt
├── frontend/               # React + Vite Anwendung
│   ├── src/
│   │   ├── api/            # Axios-Client & Shop-Endpunkte
│   │   ├── components/     # Seitenbausteine (Hero, Karten, Dashboard …)
│   │   ├── context/        # CartContext (globaler Warenkorb)
│   │   ├── data/           # Fallback-Daten bei Offline-API
│   │   └── pages/          # 5 Hauptseiten + Checkout/Success
└── README.md
```

### Voraussetzungen

- Python 3.11+
- Node.js 18+
- (Optional) PostgreSQL 14+

### Backend starten

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py seed_demo_data  # legt Produkte + Beispielbestellung an
python manage.py runserver
```

Standardmäßig nutzt das Projekt SQLite (`USE_SQLITE=1`). Für PostgreSQL folgende Variablen setzen und `USE_SQLITE=0` setzen:

```bash
set USE_SQLITE=0
set POSTGRES_DB=packshop
set POSTGRES_USER=packshop
set POSTGRES_PASSWORD=geheim
set POSTGRES_HOST=localhost
set POSTGRES_PORT=5432
```

### Frontend starten

```bash
cd frontend
npm install
npm run dev
```

Die App erwartet die API unter `http://localhost:8000/api/`. Abweichende URL per `.env` setzen:

```bash
VITE_API_URL=http://127.0.0.1:8000/api/
```

### Funktionsumfang

- **Authentifizierung**: Seite `/auth` mit Tabs für Login & Registrierung gegen die Django-User.
- **Home**: Hero-Bereich, Feature-Karten und Produkt-Kacheln (mit CTA zu `/products`).
- **Produkte**: Grid, Detailansicht mit Mengenwahl, „In den Warenkorb“.
- **Warenkorb & Checkout**: Seiten `/cart`, `/checkout`, `/order-success` bilden Screens 4–6 nach inkl. Summen, Versandoptionen und Adressformular.
- **Admin**: Seite `/admin` mit Login-Card (Screen 7) und anschließendem Dashboard (Screen 8) inkl. Statuswechsel und Produktverwaltung.

Alle API-Aufrufe haben Offline-Fallbacks mit `sampleProducts`, sodass das Frontend auch ohne laufenden Server demonstrierbar bleibt.

### Tests & Qualität

- `python manage.py check` – stellt sicher, dass Django-Konfiguration gültig ist.
- `npm run build` – prüft, dass die React-App ohne Fehler kompiliert.

Weiterführende Arbeiten (z. B. echte Authentifizierungstokens, Payment, E-Mail-Benachrichtigungen) können auf Basis dieser Struktur ergänzt werden.
