import pytest
import sys

sys.path.insert(0, "backend")

from app import app
from flask_jwt_extended import create_access_token


@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()


def test_invalid_login(client):
    response = client.post(
        "/api/login",
        json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401


def test_create_bug_without_title(client, monkeypatch):
    monkeypatch.setattr(
        "app.require_role",
        lambda roles: (True, None, None)
    )

    with app.app_context():
        token = create_access_token(identity="test@example.com")

    response = client.post(
        "/api/bugs",
        json={
            "description": "This is a test bug",
            "priority": "High",
            "severity": "High",
            "project_id": 1
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 400


def test_dashboard_without_token(client):
    response = client.get("/api/dashboard")

    assert response.status_code == 401
def test_users_access_denied_for_tester(client, monkeypatch):
    monkeypatch.setattr(
        "app.require_role",
        lambda roles: (
            False,
            {"message": "Access denied. Required role: Manager"},
            403
        )
    )

    with app.app_context():
        token = create_access_token(identity="test@example.com")

    response = client.get(
        "/api/users",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 403
def test_invalid_status_transition(client, monkeypatch):
    monkeypatch.setattr(
        "app.require_role",
        lambda roles: (True, None, None)
    )

    with app.app_context():
        token = create_access_token(identity="test@example.com")

    response = client.put(
        "/api/bugs/99999",
        json={
            "status": "Resolved"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 404
def test_update_nonexistent_bug(client, monkeypatch):
    monkeypatch.setattr(
        "app.require_role",
        lambda roles: (True, None, None)
    )

    with app.app_context():
        token = create_access_token(identity="test@example.com")

    response = client.put(
        "/api/bugs/99999",
        json={
            "status": "In Progress"
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 404
