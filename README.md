# Release Checklist Tool

A single-page application to track software releases and their deployment steps.

## Local Development

### With Docker Compose
The easiest way to run the stack locally is using Docker Compose:
```bash
docker-compose up --build
```
This starts:
- PostgreSQL on port 5432
- FastAPI Backend on port 8000
- Vite Frontend on port 5173

### Without Docker
**Backend:**
1. cd `backend`
2. `pip install -r requirements.txt`
3. Set `DATABASE_URL` in `.env`
4. `uvicorn main:app --reload`

**Frontend:**
1. cd `frontend`
2. `npm install`
3. `npm run dev`

## Deployment

### Backend (Render / Railway)
Deploy the `/backend` folder.
**Environment Variables Required:**
- `DATABASE_URL`: Connection string from your Postgres provider (use exactly as given, e.g. Neon with `sslmode=require`).
- `PORT`: Binding port (Render sets this automatically).
- `FRONTEND_URL`: URL of the deployed frontend (e.g. `https://my-frontend.vercel.app`) to configure CORS.

### Frontend (Vercel / Netlify)
Deploy the `/frontend` folder.
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Environment Variables Required:**
- `VITE_GRAPHQL_URL`: URL of the deployed backend (e.g. `https://my-backend.onrender.com/graphql`).

## GraphQL API Reference
Example create payload:
```graphql
mutation {
  createRelease(name: "v1.0", date: "2026-09-27T09:00:00Z") {
    id
    status
  }
}
```

## Database Schema
`Release`
- id: Integer (PK)
- name: String
- date: DateTime (Stored as String ISO 8601)
- additional_info: Text
- steps: JSON (Array of 8 booleans)

## Key Design Decisions
- `ReleaseStatus` is dynamically computed on read to ensure single source of truth.
- Frontend directly uses the backend `stepLabels` query to avoid hardcoding labels in React.
- Used Apollo Client for automatic cache updates and normalized state.
