import asyncio
from app.database import AsyncSessionLocal
from app.models.user import User

async def seed_data():
    async with AsyncSessionLocal() as session:
        users = [
            User(username="alice_dev", email="alice@company.com", full_name="Alice Smith", is_active=True),
            User(username="bob_cloud", email="bob@company.com", full_name="Bob Jones", is_active=True),
            User(username="carol_qa", email="carol@company.com", full_name="Carol White", is_active=True),
            User(username="dave_devops", email="dave@company.com", full_name="Dave Miller", is_active=True),
            User(username="eve_security", email="eve@company.com", full_name="Eve Johnson", is_active=False),
        ]
        session.add_all(users)
        await session.commit()
        print("FastAPI user seed data inserted successfully.")

if __name__ == "__main__":
    asyncio.run(seed_data())

