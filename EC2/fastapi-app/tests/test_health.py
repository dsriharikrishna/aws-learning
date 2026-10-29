import pytest

@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/api/fastapi/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "fastapi-app"

@pytest.mark.asyncio
async def test_readiness_check(client):
    response = await client.get("/api/fastapi/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"

