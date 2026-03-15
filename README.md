# Armatrix Team Page

A **Team Page** for [Armatrix](https://armatrix.in) — a company building snake-like robotic arms for confined and hazardous spaces.

**Frontend**: [armatrix-team-page-weld.vercel.app](https://armatrix-team-page-weld.vercel.app/)
**Backend API**: [armatrix-team-page-932b.onrender.com](https://armatrix-team-page-932b.onrender.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Framer Motion, Tailwind CSS v4 |
| Backend | Python, FastAPI, Pydantic |
| Database | MongoDB Atlas (Motor async driver) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
armatrix-team-page/
├── backend/
│   ├── main.py          # FastAPI app — CORS, CRUD routes, MongoDB connection
│   ├── database.py      # Motor async client setup
│   ├── models.py        # Pydantic schemas (TeamMember)
│   ├── routes.py        # API route handlers
│   ├── seed.py          # DB seed script
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── globals.css        # Tailwind v4 imports + base reset
│       │   └── team/page.tsx      # Team page route
│       ├── components/
│       │   ├── Navbar.js          # Responsive navigation bar
│       │   ├── Footer.js          # Site footer
│       │   ├── CustomCursor.js    # Magnetic trailing cursor effect
│       │   ├── AdminPanel.js      # Admin CRUD panel (add/edit/delete/reorder)
│       │   └── team/
│       │       ├── TeamHero.tsx        # Hero section with animated scroll waves
│       │       ├── TeamMemberCard.tsx  # Glassmorphism member card
│       │       ├── TeamMemberModal.tsx # Detailed member modal
│       │       ├── TeamBackground3D.tsx# Animated background
│       │       ├── TeamIntroOverlay.tsx# Page intro animation
│       │       └── TeamSkeleton.tsx   # Loading skeleton
│       └── lib/api.js     # Backend API helpers
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Backend

```bash
cd backend

# Create and activate virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment — create a .env file with:
#   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# Seed the database (optional, populates sample members)
python seed.py

# Start the server
uvicorn main:app --reload --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit: [http://localhost:3000/team](http://localhost:3000/team)

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/team/` | List all members (sorted by `order`) |
| `GET` | `/api/team/{id}` | Get a single member |
| `POST` | `/api/team/` | Create a new member |
| `PUT` | `/api/team/{id}` | Update an existing member |
| `DELETE` | `/api/team/{id}` | Delete a member |
| `PUT` | `/api/team/reorder` | Bulk update member ordering |

---

## Design Decisions

### Visual Design

- **Dark theme**: Pure black backgrounds with glassmorphism cards, matching the Armatrix website's futuristic aesthetic.
- **Department color coding**: Each department gets a distinct accent — Leadership (Gold), Engineering (Cyan), Design (Magenta), Operations (Green), Marketing (Purple).
- **Atmospheric glows**: Subtle radial gradient blobs create depth, inspired by armatrix.in's hero section.
- **Typography**: Space Grotesk for headings (geometric, engineered feel) + Inter for body text (clean readability).
- **Custom cursor**: A magnetic trailing dot cursor that grows when hovering over interactive elements, matching the feel of armatrix.in.

### Scroll-Animated Sine Waves

The hero section features dashed sine-wave "tentacles" flanking the SCROLL indicator. These waves grow outward from the Armatrix logo boxes as the user scrolls down, and shrink back when scrolling up. Built with Framer Motion's `useScroll` + `useSpring` for smooth, GPU-composited animations. Hidden on mobile for a clean experience.

### Drag-and-Drop Reordering

Team member cards can be reordered via drag-and-drop in the admin panel. This was a deliberate choice over manual "move up/down" buttons because:

- **Intuitive**: Dragging cards mirrors how you'd physically rearrange items — no extra UI to learn.
- **Efficient**: Reordering multiple members is fast — just drag them where you want, rather than clicking arrows repeatedly.
- **Persistent**: The new order is saved to MongoDB via the `/api/team/reorder` endpoint, so the public-facing page reflects the admin's arrangement immediately.
- **Optimistic updates**: The UI updates instantly on drag without waiting for the API response, keeping the experience smooth. The admin panel stays open throughout — no jarring reloads.

### Technical Decisions

- **Tailwind v4 with `@layer base` reset**: The global CSS reset (`* { margin: 0; padding: 0 }`) is wrapped in `@layer base` to prevent it from overriding Tailwind's layered utility classes — a critical fix for Tailwind v4's CSS layer architecture.
- **MongoDB over in-memory storage**: Data persists across server restarts. The backend connects to Atlas via Motor (async driver) for non-blocking operations.
- **Dual photo input**: The admin panel supports both URL paste and local file upload (converted to base64 data URIs), so members can use any image source.
- **Pydantic `str` over `HttpUrl`**: Photo, LinkedIn, and GitHub fields use plain `str` to accept both regular URLs and base64 data URIs.

---

## Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com) — set `NEXT_PUBLIC_API_URL` env var to the backend URL (`https://armatrix-team-page-932b.onrender.com`).
- **Backend**: Deployed on [Render](https://render.com) — set `MONGODB_URI` env var to your Atlas connection string.
- **Database**: MongoDB Atlas (free M0 tier) — set Network Access to `0.0.0.0/0` (allow all) so Render can connect.
