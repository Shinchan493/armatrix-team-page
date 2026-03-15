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
    department: Optional[Department] = Field(None, description="Department")
    bio: str = Field(..., min_length=1, max_length=700, description="Short bio")
    photo_url: str = Field(..., description="URL or base64 data URI for profile photo")
    linkedin_url: Optional[str] = Field(None, description="LinkedIn profile URL")
    github_url: Optional[str] = Field(None, description="GitHub profile URL")
    order: Optional[int] = Field(0, description="Display order (lower = first)")


class TeamMemberResponse(BaseModel):
    """
    Schema for returning a team member from the API.
    """
    id: str = Field(..., description="Unique identifier")
    name: str
    role: str
    department: Optional[Department] = None
    bio: str
    photo_url: str
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    order: Optional[int] = 0
