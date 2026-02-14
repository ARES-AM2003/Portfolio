# Docker Deployment Guide

## Prerequisites
- Docker installed
- Docker Compose installed (optional but recommended)

## Option 1: Using Docker Compose (Recommended)

### 1. Build and Run with Docker Compose
```bash
# Start all services (database + app)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

The app will be available at `http://localhost:3000`

### 2. Run Migrations (if needed separately)
```bash
docker-compose exec app npx prisma migrate deploy
```

### 3. Seed Initial Admin User (optional)
```bash
docker-compose exec app npx prisma db seed
```

---

## Option 2: Manual Docker Commands

### 1. Setup PostgreSQL Database
```bash
# Run PostgreSQL container
docker run -d \
  --name portfolio-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine
```

### 2. Build the Application Image
```bash
docker build -t portfolio-app .
```

### 3. Run Database Migrations
```bash
# Option A: Run migrations in a temporary container
docker run --rm \
  --network host \
  -e DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public" \
  portfolio-app \
  npx prisma migrate deploy

# Option B: Run migrations after container is running (see step 4)
```

### 4. Run the Application Container
```bash
docker run -d \
  --name portfolio-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-super-secret-key-change-this" \
  --network host \
  portfolio-app
```

### 5. Run Migrations (if not done in step 3)
```bash
docker exec portfolio-app npx prisma migrate deploy
```

### 6. View Logs
```bash
docker logs -f portfolio-app
```

---

## Essential Docker Commands

### Database Migrations
```bash
# Deploy migrations
docker exec portfolio-app npx prisma migrate deploy

# Generate Prisma Client
docker exec portfolio-app npx prisma generate

# Open Prisma Studio (in container)
docker exec -it portfolio-app npx prisma studio
```

### Container Management
```bash
# Stop container
docker stop portfolio-app

# Start container
docker start portfolio-app

# Restart container
docker restart portfolio-app

# Remove container
docker rm -f portfolio-app

# View container logs
docker logs -f portfolio-app

# Execute command in container
docker exec -it portfolio-app sh
```

### Database Management
```bash
# Access PostgreSQL CLI
docker exec -it portfolio-db psql -U postgres -d portfolio

# Backup database
docker exec portfolio-db pg_dump -U postgres portfolio > backup.sql

# Restore database
docker exec -i portfolio-db psql -U postgres portfolio < backup.sql
```

---

## Production Deployment

### Environment Variables
Create a `.env.production` file with:

```env
DATABASE_URL="postgresql://user:password@db-host:5432/portfolio?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
EMAIL_SERVER_HOST="smtp.youremail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_TO="admin@yourdomain.com"
```

### Build for Production
```bash
docker build -t portfolio-app:production .
```

### Run with Environment File
```bash
docker run -d \
  --name portfolio-app \
  -p 3000:3000 \
  --env-file .env.production \
  portfolio-app:production
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs portfolio-app

# Check container status
docker ps -a
```

### Database connection issues
```bash
# Test database connection
docker exec portfolio-db pg_isready -U postgres

# Check if database exists
docker exec -it portfolio-db psql -U postgres -c '\l'
```

### Clear and rebuild
```bash
# Remove everything and start fresh
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

### Migrations fail
```bash
# Reset database (WARNING: deletes all data)
docker exec portfolio-app npx prisma migrate reset

# Or push schema without migration
docker exec portfolio-app npx prisma db push
```

---

## Performance Tips

1. **Use multi-stage builds** (already configured in Dockerfile)
2. **Enable BuildKit** for faster builds:
   ```bash
   export DOCKER_BUILDKIT=1
   docker build -t portfolio-app .
   ```

3. **Use .dockerignore** (already configured)

4. **Prune unused images/containers**:
   ```bash
   docker system prune -a --volumes
   ```

---

## Security Checklist

- [ ] Change default database credentials
- [ ] Generate secure NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Use environment variables for all secrets
- [ ] Don't commit `.env` files to git
- [ ] Use HTTPS in production
- [ ] Enable database SSL in production
- [ ] Limit exposed ports
- [ ] Regular security updates: `docker pull node:20-alpine`

---

## Quick Reference

```bash
# Full rebuild
docker-compose down -v && docker-compose up -d --build

# Run migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app

# Access app shell
docker-compose exec app sh

# Access database
docker-compose exec db psql -U postgres -d portfolio
```
