import pytest

@pytest.mark.asyncio
async def test_create_and_get_user(client):
    create_payload = {
        "username": "sarah_connor",
        "email": "sarah@resistance.org",
        "full_name": "Sarah Connor",
        "is_active": True
    }
    create_res = await client.post("/api/fastapi/users", json=create_payload)
    assert create_res.status_code == 201
    user = create_res.json()
    assert user["username"] == "sarah_connor"
    user_id = user["id"]

    get_res = await client.get(f"/api/fastapi/users/{user_id}")
    assert get_res.status_code == 200
    assert get_res.json()["email"] == "sarah@resistance.org"

@pytest.mark.asyncio
async def test_list_users(client):
    list_res = await client.get("/api/fastapi/users?page=1&limit=10")
    assert list_res.status_code == 200
    body = list_res.json()
    assert "data" in body
    assert "total" in body

@pytest.mark.asyncio
async def test_update_user(client):
    create_res = await client.post("/api/fastapi/users", json={
        "username": "john_connor",
        "email": "john@resistance.org",
        "full_name": "John Connor"
    })
    user_id = create_res.json()["id"]

    patch_res = await client.patch(f"/api/fastapi/users/{user_id}", json={
        "full_name": "Leader John Connor"
    })
    assert patch_res.status_code == 200
    assert patch_res.json()["full_name"] == "Leader John Connor"

@pytest.mark.asyncio
async def test_delete_user(client):
    create_res = await client.post("/api/fastapi/users", json={
        "username": "t800",
        "email": "t800@cyberdyne.com",
    })
    user_id = create_res.json()["id"]

    del_res = await client.delete(f"/api/fastapi/users/{user_id}")
    assert del_res.status_code == 204

    get_res = await client.get(f"/api/fastapi/users/{user_id}")
    assert get_res.status_code == 404

