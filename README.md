# Docker Compose Multi-Container Demo

A multi-container DevOps demo application running locally with Docker Compose.

The stack includes an NGINX reverse proxy, a Node.js/Express backend API, PostgreSQL, and a standalone Grafana instance.

This project demonstrates container orchestration, service-to-service networking, reverse proxy routing, and persistent storage.

## Architecture

Application request flow:

```text
Browser
  |
  | http://localhost:80
  v
NGINX Reverse Proxy
  |
  | backend:3000
  v
Node.js / Express Backend
  |
  | postgres:5432
  v
PostgreSQL Database
  |
  v
postgres_data volume
```

Separate Grafana access:

```text
Browser
  |
  | http://localhost:3001
  v
Standalone Grafana Instance
  |
  v
grafana_data volume
```

All four services share the Docker bridge network `app-network`.

Grafana is included to demonstrate container deployment, web UI access, and persistent storage. Data sources, dashboards, and application monitoring are outside the scope of this project.

## Tech Stack

- Docker Compose
- NGINX
- Node.js
- Express
- PostgreSQL
- `pg` Node.js PostgreSQL client
- Grafana

## Services

| Service | Purpose | Local Access | Container Port |
|---|---|---|---|
| NGINX | Reverse proxy for the backend API | `http://localhost` | `80` |
| Node.js backend | Express API that queries PostgreSQL and returns JSON | `http://localhost:3000` | `3000` |
| PostgreSQL | Database service for the backend | `localhost:5432` | `5432` |
| Grafana | Standalone instance for deployment and UI access demonstration | `http://localhost:3001` | `3000` |

NGINX forwards application requests to `backend:3000`. The backend connects to PostgreSQL using the service hostname `postgres` and port `5432`.

The backend and PostgreSQL ports are also published on the host for direct local access.

## Prerequisites

- Docker Engine with the Docker Compose plugin, or Docker Desktop.
- Docker must be running before starting the stack.
- Host ports `80`, `3000`, `3001`, and `5432` must be available.

## Local Run

Clone the repository, open a terminal in its root directory, and run:

```bash
docker compose up --build
```

To run the stack in the background:

```bash
docker compose up -d --build
```

The Compose configuration defines:

- A backend image built from `./backend`.
- An NGINX reverse proxy using the local `nginx.conf` file.
- A PostgreSQL database used by the backend.
- A standalone Grafana instance.
- A shared Docker bridge network named `app-network`.
- Named volumes for PostgreSQL and Grafana data.

Check container status:

```bash
docker compose ps
```

View service logs:

```bash
docker compose logs -f
```

## Test the Application

Open the API through NGINX:

```text
http://localhost
```

Example response:

```json
{
  "time": "2026-08-18T15:54:33.782Z",
  "message": "Hello from Backend!"
}
```

The timestamp comes from the PostgreSQL query and changes with each request.

You can also access the backend directly:

```text
http://localhost:3000
```

A successful response confirms that the backend can query PostgreSQL. When accessed through NGINX, it also demonstrates reverse proxy routing.

## Grafana Deployment

Open the Grafana web interface:

```text
http://localhost:3001
```

Initial credentials configured in `docker-compose.yml`:

```text
Username: admin
Password: admin123
```

If the password was changed in an existing Grafana instance, use the updated password.

Grafana stores its data in the `grafana_data` named volume.

This project demonstrates:

- Starting Grafana as a Docker Compose service.
- Publishing its web interface on host port `3001`.
- Attaching Grafana to the shared Docker network.
- Providing persistent storage for Grafana data.

No data sources or dashboards are provisioned by this repository. Running the Grafana container alone does not establish monitoring of the other services.

## Persistent Storage

| Named Volume | Container Path | Purpose |
|---|---|---|
| `postgres_data` | `/var/lib/postgresql/data` | PostgreSQL database storage |
| `grafana_data` | `/var/lib/grafana` | Grafana data and saved configuration |

The NGINX configuration is mounted separately as a read-only bind mount:

```text
./nginx.conf → /etc/nginx/nginx.conf
```

## Docker Compose Concepts Demonstrated

- Multi-container application orchestration.
- Custom Docker bridge networking.
- Service-to-service communication using Compose service names.
- NGINX reverse proxy routing.
- Node.js backend image builds.
- PostgreSQL integration using the `pg` client.
- Host-to-container port mappings.
- Persistent named volumes.
- Read-only configuration bind mounts.
- Standalone Grafana deployment and web UI access.
- Service status checks and log inspection.

## Scope and Limitations

This is a local demonstration project, not a production-ready deployment.

- Credentials are configured directly in the Compose file for demonstration purposes.
- Published ports provide direct local access to the services.
- TLS, production secret management, and high availability are not implemented.
- Grafana data sources, dashboards, alerting, and application monitoring are not configured.

Do not reuse the demonstration credentials in a production environment.

## Stop the Stack

To stop and remove the project containers and Compose network:

```bash
docker compose down
```

Named volumes are preserved by default.

To also remove the PostgreSQL and Grafana named volumes:

```bash
docker compose down -v
```

> Warning: `docker compose down -v` permanently deletes the named volumes, including the stored PostgreSQL data and any saved Grafana configuration.
