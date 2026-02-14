# Production Deployment Guide (No Port Exposure)

This guide shows how to deploy the portfolio app using Docker with Nginx as a reverse proxy, keeping the app internal without exposing ports directly.

## Prerequisites
- Docker installed
- Nginx installed
- Domain name (optional, can use IP)

---

## Step 1: Pull Docker Image

```bash
docker pull ares2003/portfolio-app:v1
```

---

## Step 2: Create Environment File

Create a `.env` file in your deployment directory (e.g., `/opt/portfolio/`):

```bash
mkdir -p /opt/portfolio
cd /opt/portfolio
nano .env
```

Add the following content:

```env
# Database (SQLite - will be created in /app/data)
DATABASE_URL="file:/app/data/portfolio.db"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"

# Gmail Configuration (Optional - for contact form notifications)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# Production
NODE_ENV=production
```

**Important:** Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## Step 3: Run Docker Container (No Port Exposure)

```bash
docker run -d \
  --name portfolio-app \
  --restart unless-stopped \
  --network bridge \
  --env-file /opt/portfolio/.env \
  -v portfolio-sqlite-data:/app/data \
  ares2003/portfolio-app:v1
```

### Explanation:
- `--name portfolio-app` - Container name
- `--restart unless-stopped` - Auto-restart on failure/reboot
- `--network bridge` - Use default bridge network (no external ports)
- `--env-file` - Load environment variables
- `-v portfolio-sqlite-data:/app/data` - Persistent SQLite database
- **NO `-p` flag** - Ports are NOT exposed to the host

---

## Step 4: Configure Nginx Reverse Proxy

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add the following configuration:

```nginx
upstream portfolio_backend {
    server portfolio-app:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (add after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Client upload size (for admin panel uploads)
    client_max_body_size 10M;

    # Proxy settings
    location / {
        proxy_pass http://portfolio_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://portfolio_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 5: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will automatically update the Nginx config for HTTPS.

---

## Step 6: Connect Nginx to Docker Container

Since the container doesn't expose ports, we need to connect Nginx to the Docker network:

### Option A: Use Docker Network (Recommended)

1. Create a custom Docker network:
```bash
docker network create portfolio-network
```

2. Recreate the container on this network:
```bash
docker rm -f portfolio-app

docker run -d \
  --name portfolio-app \
  --restart unless-stopped \
  --network portfolio-network \
  --env-file /opt/portfolio/.env \
  -v portfolio-sqlite-data:/app/data \
  ares2003/portfolio-app:latest
```

3. Update Nginx to use the container's internal IP:
```bash
# Get container IP
docker inspect portfolio-app | grep IPAddress

# Update nginx config upstream to:
upstream portfolio_backend {
    server 172.18.0.2:3000;  # Use the actual IP from above
}
```

### Option B: Use Host Network Mode

```bash
docker rm -f portfolio-app

docker run -d \
  --name portfolio-app \
  --restart unless-stopped \
  --network host \
  --env-file /opt/portfolio/.env \
  -v portfolio-sqlite-data:/app/data \
  ares2003/portfolio-app:latest
```

Update Nginx config:
```nginx
upstream portfolio_backend {
    server 127.0.0.1:3000;
}
```

---

## Management Commands

### View Logs
```bash
docker logs -f portfolio-app
```

### Restart Container
```bash
docker restart portfolio-app
```

### Stop Container
```bash
docker stop portfolio-app
```

### Update to New Version
```bash
docker pull ares2003/portfolio-app:latest
docker stop portfolio-app
docker rm portfolio-app

# Run the docker run command again (from Step 3)
```

### Backup Database
```bash
docker cp portfolio-app:/app/data/portfolio.db /opt/portfolio/backup-$(date +%Y%m%d).db
```

### Access Database Shell
```bash
docker exec -it portfolio-app sh
cd /app/data
# Install sqlite3 if needed: apk add sqlite
sqlite3 portfolio.db
```

---

## Initialize Database

✅ **Migrations run automatically on container startup!**

The container automatically runs `prisma db push` when it starts, so your database schema will be created/updated automatically. No manual migration needed!

To verify migrations ran successfully:
```bash
docker logs portfolio-app | grep "Database migrations"
```

---

## Security Checklist

- ✅ No ports exposed directly to the internet
- ✅ Nginx handles SSL/TLS termination
- ✅ Strong NEXTAUTH_SECRET generated
- ✅ Changed default admin password
- ✅ SQLite database persisted in volume
- ✅ Container auto-restarts on failure
- ✅ Nginx gzip compression enabled
- ✅ Static files cached properly

---

## Troubleshooting

### Container won't start
```bash
docker logs portfolio-app
```

### Database errors
```bash
# Reset database (WARNING: deletes all data)
docker volume rm portfolio-sqlite-data
docker restart portfolio-app
docker exec -it portfolio-app npx prisma db push
```

### Nginx can't reach container
```bash
# Check container is running
docker ps | grep portfolio-app

# Check container IP
docker inspect portfolio-app | grep IPAddress

# Test from host
curl http://localhost:3000  # if using host network
```

### 502 Bad Gateway
- Check container is running: `docker ps`
- Check Nginx config: `sudo nginx -t`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify upstream IP in Nginx config matches container IP

---

## Production Optimization

### Enable Nginx Rate Limiting
Add to nginx config:
```nginx
limit_req_zone $binary_remote_addr zone=portfolio_limit:10m rate=10r/s;

server {
    location /api/contact {
        limit_req zone=portfolio_limit burst=5;
        # ... rest of proxy config
    }
}
```

### Monitor Container Resources
```bash
docker stats portfolio-app
```

### Auto-cleanup old containers
```bash
docker system prune -af --volumes --filter "until=24h"
```
