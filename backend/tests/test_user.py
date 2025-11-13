from fastapi.testclient import TestClient


def test_user_me_endpoint(client: TestClient, normal_user_token: str) -> None:
    response = client.get("/api/v1/users/me", headers={"Authorization": normal_user_token})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user@example.com"


def test_user_listing_requires_superuser(client: TestClient, normal_user_token: str, superuser_token: str) -> None:
    forbidden = client.get("/api/v1/users/", headers={"Authorization": normal_user_token})
    assert forbidden.status_code == 403

    allowed = client.get("/api/v1/users/", headers={"Authorization": superuser_token})
    assert allowed.status_code == 200
    users = allowed.json()
    assert any(user["email"] == "admin@example.com" for user in users)
