# Armatrix Team Page

A **Team Page** for [Armatrix](https://armatrix.in) — a company building snake-like robotic arms for confined and hazardous spaces.

**Backend**: Python + FastAPI + MongoDB Atlas  
**Frontend**: React + Next.js  
**Design**: Dark theme inspired by [armatrix.in](https://armatrix.in) — glassmorphism, atmospheric glows, Space Grotesk typography

---

## 🏗️ Architecture

```
armatrix-team-page/
├── backend/          # FastAPI REST API
│   ├── main.py       # App entry point, CORS, lifespan
│   ├── models.py     # Pydantic schemas
│   ├── database.py   # MongoDB connection (Motor async driver)
│   ├── routes.py     # CRUD endpoints
│   └── seed.py       # Seed script for initial data
├── frontend/         # Next.js React app
│   └── src/
│       ├── app/team/ # Team page route
│       ├── components/ # Navbar, HeroSection, TeamCard, TeamGrid, TeamModal, AdminPanel, Footer
│       └── lib/api.js  # Backend API helpers
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account (free tier)

### Backend

```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string

# Seed the database
python seed.py

# Start the server
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit: `http://localhost:3000/team`

---

## 🎨 Design Decisions

1. **Brand-aligned dark theme**: Pure black (`#000`) backgrounds with glassmorphism cards, matching the Armatrix website's futuristic aesthetic
2. **Department color coding**: Each department has a distinct accent color (Leadership=Gold, Engineering=Cyan, Design=Magenta, Operations=Green, Marketing=Purple)
3. **Atmospheric glows**: Subtle radial gradient blobs create depth, inspired by armatrix.in's hero section
4. **Typography**: Space Grotesk for headings (geometric, engineered feel) + Inter for body (clean readability)
5. **MongoDB over in-memory**: Data persists across server restarts, more realistic for production
6. **Motor async driver**: Non-blocking MongoDB operations since FastAPI is async
7. **DiceBear avatars**: Auto-generated profile illustrations — no placeholder images needed

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/team/` | List all members (sorted by order) |
| `GET` | `/api/team/{id}` | Get one member |
| `POST` | `/api/team/` | Create a member |
| `PUT` | `/api/team/{id}` | Update a member |
| `DELETE` | `/api/team/{id}` | Delete a member |

---

## 🌐 Deployment

- **Backend**: Deploy to [Render](https://render.com) (free web service) — set `MONGODB_URI` env var
- **Frontend**: Deploy to [Vercel](https://vercel.com) — set `NEXT_PUBLIC_API_URL` to your Render backend URL
