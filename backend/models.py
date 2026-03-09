"""
Pydantic models for Team Member data validation.

These models define the shape of data flowing through the API:
- TeamMemberCreate: what the client sends when adding/updating a member
- TeamMemberResponse: what the API returns (includes the MongoDB id)
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class Department(str, Enum):
    """Departments at Armatrix."""
    LEADERSHIP = "Leadership"
    ENGINEERING = "Engineering"
    DESIGN = "Design"
    OPERATIONS = "Operations"
    MARKETING = "Marketing"


class TeamMemberCreate(BaseModel):
    """
    Schema for creating or updating a team member.
    These are the fields the client must/can provide.
    """
    name: str = Field(..., min_length=1, max_length=100, description="Full name")
    role: str = Field(..., min_length=1, max_length=100, description="Job title")
    department: Department = Field(..., description="Department")
    bio: str = Field(..., min_length=1, max_length=500, description="Short bio")
    photo_url: str = Field(..., description="URL to profile photo")
    linkedin: Optional[str] = Field(None, description="LinkedIn profile URL")
    twitter: Optional[str] = Field(None, description="Twitter/X handle")
    order: Optional[int] = Field(0, description="Display order (lower = first)")


class TeamMemberResponse(TeamMemberCreate):
    """
    Schema for returning a team member from the API.
    Extends the create schema by adding the MongoDB document id.
    """
    id: str = Field(..., description="Unique identifier")
