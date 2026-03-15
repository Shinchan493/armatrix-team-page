from typing import Dict, List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl


class TeamMemberBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    role: str = Field(..., min_length=2, max_length=100)
    bio: str = Field(..., min_length=20, max_length=700)
    photo_url: HttpUrl
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(TeamMemberBase):
    pass


class TeamMember(TeamMemberBase):
    id: str


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


def _seed_members() -> Dict[str, TeamMember]:
    sample = [
        {
            "name": "Aarav Menon",
            "role": "Founder & Systems Architect",
            "bio": "Aarav leads Armatrix's long-horizon robotics roadmap and translates deep research into deployable systems for hazardous, high-consequence environments.",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
            "linkedin_url": "https://linkedin.com/in/aarav-menon",
            "github_url": "https://github.com/aarav-menon",
        },
        {
            "name": "Ishita Rao",
            "role": "Head of Product Design",
            "bio": "Ishita crafts immersive control interfaces where complex robotic behavior feels intuitive, cinematic, and precise even for first-time operators.",
            "photo_url": "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=900&q=80",
            "linkedin_url": "https://linkedin.com/in/ishita-rao",
            "github_url": "https://github.com/ishita-rao",
        },
        {
            "name": "Kabir Vyas",
            "role": "Senior Robotics Engineer",
            "bio": "Kabir builds the kinematics and motion-planning stack powering Armatrix manipulators, obsessing over smooth pathing in ultra-constrained spaces.",
            "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
            "linkedin_url": "https://linkedin.com/in/kabir-vyas",
            "github_url": "https://github.com/kabir-vyas",
        },
        {
            "name": "Megha Sethi",
            "role": "Computer Vision Lead",
            "bio": "Megha develops perception pipelines that let robotic arms understand noisy industrial scenes in real time, enabling safer and smarter autonomous actions.",
            "photo_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
            "linkedin_url": "https://linkedin.com/in/megha-sethi",
            "github_url": "https://github.com/megha-sethi",
        },
        {
            "name": "Rudra Khanna",
            "role": "Full-Stack Platform Engineer",
            "bio": "Rudra connects firmware telemetry, cloud orchestration, and operator dashboards into one seamless platform with low-latency observability built in.",
            "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
            "linkedin_url": "https://linkedin.com/in/rudra-khanna",
            "github_url": "https://github.com/rudra-khanna",
        },
        {
            "name": "Naina Kulkarni",
            "role": "Growth & Partnerships",
            "bio": "Naina drives strategic pilots with energy and infrastructure partners, turning experimental prototypes into trusted field deployments at scale.",
            "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
            "linkedin_url": "https://linkedin.com/in/naina-kulkarni",
            "github_url": "https://github.com/naina-kulkarni",
        },
    ]

    seeded: Dict[str, TeamMember] = {}
    for entry in sample:
        member_id = str(uuid4())
        seeded[member_id] = TeamMember(id=member_id, **entry)
    return seeded


TEAM_MEMBERS: Dict[str, TeamMember] = _seed_members()


@app.get("/")
async def root():
    return {
        "message": "Armatrix Team API running",
        "endpoints": ["GET /api/team", "POST /api/team", "PUT /api/team/{id}", "DELETE /api/team/{id}"],
        "count": len(TEAM_MEMBERS),
    }


@app.get("/api/team", response_model=List[TeamMember])
async def get_all_members():
    return list(TEAM_MEMBERS.values())


@app.get("/api/team/{member_id}", response_model=TeamMember)
async def get_member(member_id: str):
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member


@app.post("/api/team", response_model=TeamMember, status_code=201)
async def create_member(payload: TeamMemberCreate):
    member_id = str(uuid4())
    member = TeamMember(id=member_id, **payload.model_dump())
    TEAM_MEMBERS[member_id] = member
    return member


@app.put("/api/team/{member_id}", response_model=TeamMember)
async def update_member(member_id: str, payload: TeamMemberUpdate):
    if member_id not in TEAM_MEMBERS:
        raise HTTPException(status_code=404, detail="Team member not found")

    updated = TeamMember(id=member_id, **payload.model_dump())
    TEAM_MEMBERS[member_id] = updated
    return updated


@app.delete("/api/team/{member_id}")
async def delete_member(member_id: str):
    if member_id not in TEAM_MEMBERS:
        raise HTTPException(status_code=404, detail="Team member not found")

    del TEAM_MEMBERS[member_id]
    return {"message": "Team member deleted"}
