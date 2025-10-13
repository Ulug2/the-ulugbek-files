# Blog Website (Retro Style)

Simple React (Vite) + Express app with a 90s–2000s aesthetic. Frontend supports Admin Mode for client-side CRUD. Backend exposes REST endpoints and is ready to migrate to PostgreSQL.

## Stack

- Client: React + Vite
- Server: Express (CORS + JSON)
- DB: PostgreSQL via `pg`

## Local Development

### Backend

```bash
cd server
npm i
npm run dev
# http://localhost:3000
```

### Frontend

```bash
cd client
npm i
# optional: echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```

- The client tries `GET /api/posts`; if unreachable, it falls back to localStorage seed data.
- Admin Mode password: `letmein` (temporary).

## Environment Variables

Client `.env` (in `client/`):

```
VITE_API_URL=http://localhost:3000
```

Server `.env` (in `server/`):

```
PORT=3000
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB
DATABASE_SSL=1
```

## API Endpoints

- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id
