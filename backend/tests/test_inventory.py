from fastapi.testclient import TestClient


def test_inventory_lifecycle(client: TestClient, superuser_token: str, normal_user_token: str) -> None:
    clinic_resp = client.post(
        "/api/v1/clinics/",
        json={"name": "Uptown Clinic", "address": "456 Elm", "phone_number": "555-6789"},
        headers={"Authorization": superuser_token},
    )
    clinic_id = clinic_resp.json()["id"]

    create_resp = client.post(
        "/api/v1/inventory/",
        json={
            "name": "Stethoscope",
            "description": "Cardiology",
            "quantity": 5,
            "unit_price": 49.99,
            "clinic_id": clinic_id,
        },
        headers={"Authorization": superuser_token},
    )
    assert create_resp.status_code == 201, create_resp.text
    item = create_resp.json()
    assert item["name"] == "Stethoscope"

    list_resp = client.get("/api/v1/inventory/", headers={"Authorization": normal_user_token})
    assert list_resp.status_code == 200
    items = list_resp.json()
    assert len(items) == 1
    assert items[0]["clinic_id"] == clinic_id

    update_resp = client.put(
        f"/api/v1/inventory/{item['id']}",
        json={"quantity": 10},
        headers={"Authorization": superuser_token},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["quantity"] == 10
