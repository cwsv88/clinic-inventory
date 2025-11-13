from fastapi.testclient import TestClient


def test_create_and_read_clinic(client: TestClient, superuser_token: str, normal_user_token: str) -> None:
    create_response = client.post(
        "/api/v1/clinics/",
        json={"name": "Downtown Clinic", "address": "123 Main", "phone_number": "555-1234"},
        headers={"Authorization": superuser_token},
    )
    assert create_response.status_code == 201, create_response.text
    created = create_response.json()
    assert created["name"] == "Downtown Clinic"

    list_response = client.get("/api/v1/clinics/", headers={"Authorization": normal_user_token})
    assert list_response.status_code == 200
    clinics = list_response.json()
    assert len(clinics) == 1
    assert clinics[0]["name"] == "Downtown Clinic"

    detail_response = client.get(f"/api/v1/clinics/{created['id']}", headers={"Authorization": normal_user_token})
    assert detail_response.status_code == 200
    detail = detail_response.json()
    assert detail["id"] == created["id"]
