"""
Main FastAPI Application for Armatrix Team Page Backend.

This is the entry point — it:
1. Creates the FastAPI app
2. Configures CORS (so the frontend can talk to us)
3. Connects to MongoDB on startup
4. Includes the team member routes
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import ping_db
from routes import router as team_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler — runs code on startup and shutdown.
    We attempt to verify the MongoDB connection, but don't crash if it fails
    (Motor will retry connections automatically on each request).
    """
    try:
        await ping_db()
    except Exception as e:
        print(f"⚠️  Could not connect to MongoDB on startup: {e}")
        print("   The server will still start — Motor retries connections automatically.")
    yield


app = FastAPI(
    title="Armatrix Team API",
    description="REST API for managing Armatrix team members",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware — allows the frontend (on a different port/domain) to call our API.
# Without this, the browser would block requests from localhost:3000 to localhost:8000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the team member routes
app.include_router(team_router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Armatrix Team API is running 🚀", "docs": "/docs"}
