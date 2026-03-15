from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import ping_db, team_collection
from routes import router

app = FastAPI(
    title="Armatrix Team API",
    description="REST API for managing Armatrix team members",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def startup():
    await ping_db()


@app.get("/")
async def root():
    count = await team_collection.count_documents({})
    return {
        "message": "Armatrix Team API running",
        "endpoints": [
            "GET /api/team",
            "POST /api/team",
            "PUT /api/team/{id}",
            "DELETE /api/team/{id}",
            "PUT /api/team/reorder",
        ],
        "count": count,
    }
