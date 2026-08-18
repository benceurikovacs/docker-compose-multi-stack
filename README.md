# Docker Compose Multi-Container Demo

A multi-container DevOps demo application running locally with Docker Compose.

The stack includes an NGINX reverse proxy, a Node.js/Express backend API, PostgreSQL, and Grafana monitoring.

## Architecture

```text
Browser
  |
  | http://localhost
  v
NGINX Reverse Proxy
  |
  v
Node.js / Express Backend
  |
  v
PostgreSQL Database

Grafana Monitoring
  |
  v
http://localhost:3001
```

## Tech Stack

- Docker Compose
- NGINX
- Node.js
- Express
- PostgreSQL
- `pg` Node.js PostgreSQL client
- Grafana

## Services

| Service | Purpose | Local URL / Port |
|---|---|---|
| NGINX | Reverse proxy for the backend API | `http://localhost` |
| Node.js backend | Express API that returns a JSON response | `http://localhost:3000` |
| PostgreSQL | Database service for the backend | Internal port `5432` |
| Grafana | Monitoring and visualization UI | `http://localhost:3001` |

## Local Run

Clone the repository and run:

```bash
docker compose up --build
```

Docker Compose will:

1. Build the Node.js backend image.
2. Start the PostgreSQL database.
3. Start the Grafana monitoring service.
4. Start the Node.js backend.
5. Start NGINX as a reverse proxy.
6. Create the required Docker network and persistent volumes.

## Test the Application

Open the API through NGINX:

```text
http://localhost
```

Expected response:

```json
{
  "time": "2026-08-18T15:54:33.782Z",
  "message": "Hello from Backend!"
}
```

You can also access the backend directly:

```text
http://localhost:3000
```

Open Grafana:

```text
http://localhost:3001
```

Default Grafana credentials:

```text
Username: admin
Password: admin
```

## Docker Compose Concepts Demonstrated

- Multi-container application orchestration.
- Custom Docker network for service-to-service communication.
- NGINX reverse proxy routing.
- Node.js backend containerization.
- PostgreSQL database container.
- Persistent Docker volumes for PostgreSQL and Grafana data.
- Local monitoring interface with Grafana.
- Service logs and basic runtime troubleshooting.

## Stop the Stack

To stop the running containers:

```bash
docker compose down
```

This removes containers and the Compose network, but keeps named volumes by default.

To also remove PostgreSQL and Grafana stored data:

```bash
docker compose down -v
```

> Warning: `docker compose down -v` permanently deletes the named volumes and their stored data.
