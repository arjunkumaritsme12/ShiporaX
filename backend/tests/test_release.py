from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_graphql_endpoint():
    query = """
    query {
      stepLabels
    }
    """
    response = client.post("/graphql", json={"query": query})
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "stepLabels" in data["data"]
    assert len(data["data"]["stepLabels"]) == 8

def test_create_release():
    mutation = """
    mutation {
      createRelease(name: "Test Release", date: "2026-09-27T09:00:00Z") {
        name
        status
      }
    }
    """
    response = client.post("/graphql", json={"query": mutation})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["createRelease"]["name"] == "Test Release"
    assert data["data"]["createRelease"]["status"] == "PLANNED"
