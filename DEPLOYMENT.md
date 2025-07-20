# 🚀 FeeShay Deployment Guide

This guide covers various deployment strategies for the FeeShay freelance marketplace platform.

## 📋 Table of Contents

-   [Quick Start](#quick-start)
-   [Backend Deployment](#backend-deployment)
-   [Frontend Deployment](#frontend-deployment)
-   [Database Setup](#database-setup)
-   [Environment Configuration](#environment-configuration)
-   [Production Checklist](#production-checklist)
-   [Monitoring & Maintenance](#monitoring--maintenance)

## ⚡ Quick Start

### Local Development Setup

1. **Clone and Install**

    ```bash
    git clone https://github.com/yourusername/feeshay.git
    cd feeshay

    # Backend setup
    cd FeeShay/Backend
    npm install

    # Frontend setup
    cd ../Frontend
    npm install
    ```

2. **Environment Configuration**

    ```bash
    # Backend
    cd FeeShay/Backend
    cp .env.example .env
    # Edit .env with your values

    # Frontend
    cd ../Frontend
    echo "EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env
    ```

3. **Start Services**

    ```bash
    # Terminal 1: Start MongoDB
    mongod

    # Terminal 2: Start Backend
    cd FeeShay/Backend
    npm run setup  # Initialize database
    npm start

    # Terminal 3: Start Frontend
    cd FeeShay/Frontend
    npm start
    ```

## 🗄️ Backend Deployment

### Option 1: Heroku (Easy)

1. **Install Heroku CLI**

    ```bash
    # macOS
    brew tap heroku/brew && brew install heroku

    # Windows
    # Download from https://cli.heroku.com/

    # Ubuntu/Debian
    curl https://cli-assets.heroku.com/install.sh | sh
    ```

2. **Create Heroku App**

    ```bash
    cd FeeShay/Backend
    heroku create feeshay-backend
    ```

3. **Set Environment Variables**

    ```bash
    # Required variables
    heroku config:set NODE_ENV=production
    heroku config:set JWT_SECRET=$(openssl rand -hex 32)
    heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feeshay
    heroku config:set CORS_ORIGIN=https://your-frontend-url.com

    # Optional variables
    heroku config:set MAX_FILE_SIZE=5242880
    heroku config:set UPLOAD_PATH=uploads
    ```

4. **Deploy**

    ```bash
    # Create Procfile
    echo "web: npm start" > Procfile

    # Deploy
    git add .
    git commit -m "Deploy to Heroku"
    git push heroku main
    ```

### Option 2: DigitalOcean Droplet

1. **Create Droplet**

    - Ubuntu 20.04 LTS
    - At least 1GB RAM, 1 vCPU
    - Add SSH key

2. **Setup Server**

    ```bash
    # Connect to droplet
    ssh root@your-droplet-ip

    # Update system
    apt update && apt upgrade -y

    # Install Node.js 18
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs

    # Install MongoDB
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    apt-get update
    apt-get install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod

    # Install PM2
    npm install -g pm2

    # Install Nginx
    apt install -y nginx
    ```

3. **Deploy Application**

    ```bash
    # Clone repository
    cd /var/www
    git clone https://github.com/yourusername/feeshay.git
    cd feeshay/FeeShay/Backend

    # Install dependencies
    npm ci --production

    # Build application
    npm run build

    # Create environment file
    nano .env
    # Add your production environment variables

    # Start with PM2
    pm2 start dist/server.js --name "feeshay-backend"
    pm2 save
    pm2 startup
    ```

4. **Configure Nginx**

    ```bash
    # Create Nginx config
    nano /etc/nginx/sites-available/feeshay
    ```

    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

    ```bash
    # Enable site
    ln -s /etc/nginx/sites-available/feeshay /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
    ```

5. **Setup SSL with Let's Encrypt**

    ```bash
    # Install Certbot
    snap install core; snap refresh core
    snap install --classic certbot

    # Get certificate
    certbot --nginx -d your-domain.com
    ```

### Option 3: Docker Deployment

1. **Create Dockerfile**

    ```dockerfile
    # FeeShay/Backend/Dockerfile
    FROM node:18-alpine

    WORKDIR /app

    # Copy package files
    COPY package*.json ./

    # Install dependencies
    RUN npm ci --only=production && npm cache clean --force

    # Copy source code
    COPY . .

    # Build application
    RUN npm run build

    # Create uploads directory
    RUN mkdir -p uploads

    # Expose port
    EXPOSE 3000

    # Health check
    HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
      CMD curl -f http://localhost:3000/health || exit 1

    # Start application
    CMD ["npm", "start"]
    ```

2. **Create Docker Compose**

    ```yaml
    # docker-compose.yml
    version: "3.8"

    services:
        mongodb:
            image: mongo:6.0
            container_name: feeshay-mongo
            restart: always
            environment:
                MONGO_INITDB_ROOT_USERNAME: root
                MONGO_INITDB_ROOT_PASSWORD: password123
                MONGO_INITDB_DATABASE: feeshay
            ports:
                - "27017:27017"
            volumes:
                - mongodb_data:/data/db
                - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

        backend:
            build: ./FeeShay/Backend
            container_name: feeshay-backend
            restart: always
            environment:
                NODE_ENV: production
                MONGODB_URI: mongodb://root:password123@mongodb:27017/feeshay?authSource=admin
                JWT_SECRET: your-jwt-secret-here
                PORT: 3000
                CORS_ORIGIN: https://your-frontend-url.com
            ports:
                - "3000:3000"
            depends_on:
                - mongodb
            volumes:
                - ./uploads:/app/uploads

        nginx:
            image: nginx:alpine
            container_name: feeshay-nginx
            restart: always
            ports:
                - "80:80"
                - "443:443"
            volumes:
                - ./nginx.conf:/etc/nginx/nginx.conf:ro
                - ./ssl:/etc/nginx/ssl:ro
            depends_on:
                - backend

    volumes:
        mongodb_data:
    ```

3. **Deploy with Docker**

    ```bash
    # Build and start
    docker-compose up -d

    # View logs
    docker-compose logs -f

    # Update application
    docker-compose pull
    docker-compose up -d --build
    ```

## 📱 Frontend Deployment

### Option 1: Expo Application Services (EAS)

1. **Install EAS CLI**

    ```bash
    npm install -g @expo/eas-cli
    ```

2. **Configure EAS**

    ```bash
    cd FeeShay/Frontend
    eas build:configure
    ```

3. **Build for App Stores**

    ```bash
    # Build for both platforms
    eas build --platform all

    # Build for specific platform
    eas build --platform ios
    eas build --platform android
    ```

4. **Submit to App Stores**

    ```bash
    # Submit to both stores
    eas submit --platform all

    # Submit to specific store
    eas submit --platform ios
    eas submit --platform android
    ```

### Option 2: Manual Build

1. **iOS Build**

    ```bash
    cd FeeShay/Frontend

    # Create iOS build
    expo build:ios

    # Download and submit to App Store Connect
    ```

2. **Android Build**

    ```bash
    cd FeeShay/Frontend

    # Create Android build
    expo build:android

    # Download and submit to Google Play Console
    ```

### Option 3: Web Deployment

1. **Build for Web**

    ```bash
    cd FeeShay/Frontend
    npx expo export:web
    ```

2. **Deploy to Netlify**

    ```bash
    # Install Netlify CLI
    npm install -g netlify-cli

    # Deploy
    netlify deploy --prod --dir=dist
    ```

3. **Deploy to Vercel**

    ```bash
    # Install Vercel CLI
    npm install -g vercel

    # Deploy
    vercel --prod
    ```

## 🗃️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**

    - Sign up at [MongoDB Atlas](https://cloud.mongodb.com/)
    - Create new project

2. **Create Cluster**

    - Choose cloud provider and region
    - Select cluster tier (M0 for free tier)
    - Configure cluster settings

3. **Configure Access**

    ```bash
    # Database Access
    # Create database user with read/write permissions

    # Network Access
    # Add IP addresses (0.0.0.0/0 for all IPs in development)
    ```

4. **Get Connection String**
    ```
    mongodb+srv://username:password@cluster.mongodb.net/feeshay?retryWrites=true&w=majority
    ```

### Self-Hosted MongoDB

1. **Install MongoDB**

    ```bash
    # Ubuntu/Debian
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org

    # Start service
    sudo systemctl start mongod
    sudo systemctl enable mongod
    ```

2. **Secure MongoDB**

    ```bash
    # Connect to MongoDB
    mongo

    # Create admin user
    use admin
    db.createUser({
      user: "admin",
      pwd: "strongpassword",
      roles: ["root"]
    })

    # Enable authentication
    # Edit /etc/mongod.conf
    security:
      authorization: enabled

    # Restart MongoDB
    sudo systemctl restart mongod
    ```

## 🔧 Environment Configuration

### Backend Environment Variables

```bash
# Required
NODE_ENV=production
JWT_SECRET=your-32-character-secret-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/feeshay
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com

# Optional
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Frontend Environment Variables

```bash
# Required
EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api/v1

# Optional
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## ✅ Production Checklist

### Security

-   [ ] Strong JWT secret (32+ characters)
-   [ ] HTTPS enabled with valid SSL certificate
-   [ ] CORS properly configured
-   [ ] Rate limiting implemented
-   [ ] Input validation on all endpoints
-   [ ] SQL injection protection (MongoDB injection)
-   [ ] XSS protection headers
-   [ ] Secure file upload validation

### Performance

-   [ ] Database indexes created
-   [ ] Image optimization enabled
-   [ ] Gzip compression enabled
-   [ ] CDN configured for static assets
-   [ ] Connection pooling configured
-   [ ] Response caching implemented

### Monitoring

-   [ ] Error tracking (Sentry)
-   [ ] Application monitoring (New Relic, DataDog)
-   [ ] Uptime monitoring
-   [ ] Log aggregation
-   [ ] Performance monitoring
-   [ ] Database monitoring

### Backup & Recovery

-   [ ] Automated database backups
-   [ ] Backup testing and restoration procedures
-   [ ] File upload backups
-   [ ] Disaster recovery plan
-   [ ] Data retention policies

### Documentation

-   [ ] API documentation updated
-   [ ] Deployment procedures documented
-   [ ] Environment variables documented
-   [ ] Troubleshooting guide created
-   [ ] Team onboarding guide

## 📊 Monitoring & Maintenance

### Application Monitoring

1. **Setup Sentry**

    ```bash
    # Backend
    npm install @sentry/node @sentry/profiling-node

    # Frontend
    npm install @sentry/react-native
    ```

2. **Health Check Endpoint**
    ```javascript
    // Backend: src/routes/health.ts
    app.get("/health", (req, res) => {
        res.json({
            status: "OK",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
        });
    });
    ```

### Database Monitoring

1. **MongoDB Monitoring**

    ```bash
    # Monitor database performance
    mongostat --host localhost:27017

    # Monitor database operations
    mongotop --host localhost:27017
    ```

2. **Backup Script**

    ```bash
    #!/bin/bash
    # backup-db.sh
    DATE=$(date +%Y-%m-%d_%H-%M-%S)
    BACKUP_DIR="/backups/mongodb"
    DB_NAME="feeshay"

    mkdir -p $BACKUP_DIR
    mongodump --host localhost --db $DB_NAME --out $BACKUP_DIR/$DATE

    # Keep only last 30 days of backups
    find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} +
    ```

### Log Management

1. **Structured Logging**

    ```javascript
    // Backend: Use winston for logging
    const winston = require("winston");

    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || "info",
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [new winston.transports.File({ filename: "logs/error.log", level: "error" }), new winston.transports.File({ filename: "logs/combined.log" })],
    });
    ```

2. **Log Rotation**
    ```bash
    # /etc/logrotate.d/feeshay
    /var/www/feeshay/logs/*.log {
      daily
      rotate 30
      compress
      delaycompress
      missingok
      notifempty
      copytruncate
    }
    ```

### Performance Optimization

1. **Database Optimization**

    ```javascript
    // Create indexes for frequently queried fields
    db.users.createIndex({ email: 1 });
    db.jobs.createIndex({ category: 1, status: 1 });
    db.proposals.createIndex({ job: 1, freelancer: 1 });
    db.messages.createIndex({ chat: 1, sent_at: -1 });
    ```

2. **Redis Caching**

    ```bash
    # Install Redis
    sudo apt install redis-server

    # Configure Redis for session storage and caching
    ```

### Update Procedures

1. **Backend Updates**

    ```bash
    # Backup database
    ./backup-db.sh

    # Pull latest changes
    git pull origin main

    # Install dependencies
    npm ci --production

    # Build application
    npm run build

    # Restart with PM2
    pm2 restart feeshay-backend
    ```

2. **Frontend Updates**

    ```bash
    # Build new version
    eas build --platform all

    # Submit to app stores
    eas submit --platform all
    ```

This deployment guide covers the most common deployment scenarios. Choose the option that best fits your infrastructure and requirements.
