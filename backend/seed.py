"""
Seed Script — Populates MongoDB with fictional Armatrix team members.

Run this once to fill the database with starter data:
    python3.11 seed.py

It clears existing data and inserts fresh members.
"""

import asyncio
from database import team_collection, ping_db

SEED_DATA = [
    {
        "name": "Arjun Mehta",
        "role": "Co-Founder & CEO",
        "department": "Leadership",
        "bio": "Arjun leads Armatrix's vision to revolutionize industrial inspection with snake-like robotic arms. Previously at ISRO's robotics division.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=arjun&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/arjunmehta",
        "github_url": "@arjun_armatrix",
        "order": 1,
    },
    {
        "name": "Priya Sharma",
        "role": "Co-Founder & CTO",
        "department": "Leadership",
        "bio": "Priya architects the control systems behind Armatrix's hyper-redundant robotic arms. PhD in Robotics from IIT Bombay.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=priya&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/priyasharma",
        "github_url": "@priya_robotics",
        "order": 2,
    },
    {
        "name": "Vikram Rao",
        "role": "Lead Robotics Engineer",
        "department": "Engineering",
        "bio": "Vikram designs the mechanical systems for Armatrix's 3-meter MVP arm. Specializes in compliant mechanisms and kinematics.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=vikram&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/vikramrao",
        "order": 3,
    },
    {
        "name": "Sneha Iyer",
        "role": "Firmware Engineer",
        "department": "Engineering",
        "bio": "Sneha writes the embedded code that makes the robotic arm move with precision. Expert in real-time control systems and motor drivers.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=sneha&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/snehaiyer",
        "order": 4,
    },
    {
        "name": "Rohan Kapoor",
        "role": "ML Engineer",
        "department": "Engineering",
        "bio": "Rohan builds the AI-powered navigation that lets Armatrix arms adapt in real time to complex, confined workspaces.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=rohan&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/rohankapoor",
        "github_url": "@rohan_ml",
        "order": 5,
    },
    {
        "name": "Ananya Desai",
        "role": "Product Designer",
        "department": "Design",
        "bio": "Ananya crafts the interfaces and visualizations that make controlling complex robotic systems feel intuitive.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=ananya&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/ananyadesai",
        "order": 6,
    },
    {
        "name": "Karthik Nair",
        "role": "Head of Operations",
        "department": "Operations",
        "bio": "Karthik handles manufacturing partnerships, supply chain, and ensures Armatrix delivers prototypes on time.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=karthik&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/karthiknair",
        "order": 7,
    },
    {
        "name": "Meera Joshi",
        "role": "Growth Lead",
        "department": "Marketing",
        "bio": "Meera tells the Armatrix story to the world — from Shell E4 demos to IAC presentations. Background in deep-tech marketing.",
        "photo_url": "https://api.dicebear.com/7.x/notionists/svg?seed=meera&backgroundColor=transparent",
        "linkedin_url": "https://linkedin.com/in/meerajoshi",
        "github_url": "@meera_armatrix",
        "order": 8,
    },
]


async def seed():
    """Clear existing data and insert seed members."""
    await ping_db()

    # Clear existing team members
    deleted = await team_collection.delete_many({})
    print(f"🗑️  Cleared {deleted.deleted_count} existing members")

    # Insert seed data
    result = await team_collection.insert_many(SEED_DATA)
    print(f"🌱 Seeded {len(result.inserted_ids)} team members!")

    # Print them out
    async for member in team_collection.find().sort("order", 1):
        print(f"   {member['order']}. {member['name']} — {member['role']}")


if __name__ == "__main__":
    asyncio.run(seed())
