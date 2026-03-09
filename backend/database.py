"""
MongoDB connection setup using Motor (async driver).

Motor is the official async Python driver for MongoDB.
It lets FastAPI talk to MongoDB without blocking — important
because FastAPI is an async framework.
"""

import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "armatrix")

# Create the Motor client — this doesn't connect immediately,
# it connects lazily when you first use it.
# We pass certifi's CA bundle so SSL works correctly with MongoDB Atlas.
client = AsyncIOMotorClient(MONGODB_URI, tlsCAFile=certifi.where())

# Get the database
db = client[DATABASE_NAME]

# Get the team_members collection — like a "table" in SQL
team_collection = db["team_members"]


async def ping_db():
    """Test the database connection. Raises an exception if it fails."""
    await client.admin.command("ping")
    print("✅ Connected to MongoDB Atlas!")
