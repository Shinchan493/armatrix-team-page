"""
CRUD Routes for Team Members.

Each route handler:
1. Receives the HTTP request
2. Talks to MongoDB via the Motor driver
3. Returns a response using our Pydantic models
"""

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from typing import List
from pydantic import BaseModel

from models import TeamMemberCreate, TeamMemberResponse
from database import team_collection

# Create a router — this groups related endpoints together
router = APIRouter(prefix="/api/team", tags=["Team Members"], redirect_slashes=False)


def member_to_response(member: dict) -> TeamMemberResponse:
    """
    Convert a MongoDB document to our response model.
    MongoDB uses '_id' (ObjectId), but our API returns 'id' (string).
    """
    return TeamMemberResponse(
        id=str(member["_id"]),
        name=member["name"],
        role=member["role"],
        department=member.get("department"),
        bio=member["bio"],
        photo_url=member["photo_url"],
        linkedin_url=member.get("linkedin_url") or member.get("linkedin"),
        github_url=member.get("github_url") or member.get("twitter"),
        order=member.get("order", 0),
    )


class ReorderPayload(BaseModel):
    ordered_ids: List[str]


@router.get("", response_model=List[TeamMemberResponse])
@router.get("/", response_model=List[TeamMemberResponse])
async def get_all_members():
    """
    GET /api/team/
    Returns all team members, sorted by 'order' field (leadership first).
    """
    members = []
    cursor = team_collection.find().sort("order", 1)
    async for member in cursor:
        members.append(member_to_response(member))
    return members


@router.put("/reorder", response_model=List[TeamMemberResponse])
async def reorder_members(payload: ReorderPayload):
    """
    PUT /api/team/reorder
    Accepts a list of member IDs in desired order and updates the order field.
    """
    for idx, member_id in enumerate(payload.ordered_ids):
        if ObjectId.is_valid(member_id):
            await team_collection.update_one(
                {"_id": ObjectId(member_id)},
                {"$set": {"order": idx}},
            )
    members = []
    cursor = team_collection.find().sort("order", 1)
    async for member in cursor:
        members.append(member_to_response(member))
    return members


@router.get("/{member_id}", response_model=TeamMemberResponse)
async def get_member(member_id: str):
    """
    GET /api/team/{member_id}
    Returns a single team member by their ID.
    """
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    member = await team_collection.find_one({"_id": ObjectId(member_id)})
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    return member_to_response(member)


@router.post("", response_model=TeamMemberResponse, status_code=201)
@router.post("/", response_model=TeamMemberResponse, status_code=201)
async def create_member(member: TeamMemberCreate):
    """
    POST /api/team/
    Creates a new team member. Returns the created member with its ID.
    """
    member_dict = member.model_dump()
    # Auto-assign order to end of list if not specified
    if not member_dict.get("order"):
        last = await team_collection.find_one(sort=[("order", -1)])
        member_dict["order"] = (last.get("order", 0) + 1) if last else 0
    result = await team_collection.insert_one(member_dict)

    # Fetch the created document to return it
    created = await team_collection.find_one({"_id": result.inserted_id})
    return member_to_response(created)


@router.put("/{member_id}", response_model=TeamMemberResponse)
async def update_member(member_id: str, member: TeamMemberCreate):
    """
    PUT /api/team/{member_id}
    Updates all fields of an existing team member.
    """
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    member_dict = member.model_dump()
    result = await team_collection.update_one(
        {"_id": ObjectId(member_id)},
        {"$set": member_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")

    updated = await team_collection.find_one({"_id": ObjectId(member_id)})
    return member_to_response(updated)


@router.delete("/{member_id}")
async def delete_member(member_id: str):
    """
    DELETE /api/team/{member_id}
    Deletes a team member. Returns a confirmation message.
    """
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await team_collection.delete_one({"_id": ObjectId(member_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")

    return {"message": "Team member deleted successfully"}
