# Docker Setup for Memory Storage App

This document explains how to run the Memory Storage Expo/React Native project using Docker.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd MemmoryStorage

# Build and start the development environment
docker-compose up --build
```

### 2. Access the Application

After starting, you can access:

- **Expo DevTools**: http://localhost:19000
- **Web Version**: http://localhost:19002 (when using web profile)
- **Metro Bundler**: http://localhost:8081

## Available Commands

### Development Environment

```bash
# Start the full development environment
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the environment
docker-compose down
```

### Web-Only Development

```bash
# Start only the web development server
docker-compose --profile web-only up web

# Or build and start
docker-compose --profile web-only up --build web
```

### Rebuilding

```bash
# Rebuild containers when dependencies change
docker-compose up --build

# Force rebuild without cache
docker-compose build --no-cache
```

## Mobile Development

### Connecting Mobile Devices

1. **Start the container**:

   ```bash
   docker-compose up
   ```

2. **Get the tunnel URL**:

   - Check the container logs for the Expo tunnel URL
   - Usually displayed as: `exp://xx-xxx.your-username.exp.direct:80`

3. **Connect your device**:
   - Install Expo Go app on your mobile device
   - Scan the QR code from the DevTools or enter the tunnel URL manually

### Android/iOS Development

For native development, you'll need to:

1. Install Android Studio (for Android) or Xcode (for iOS) on your host machine
2. Run the container with additional port mappings for ADB or iOS simulators
3. Use `expo run:android` or `expo run:ios` commands

## Useful Docker Commands

### Container Management

```bash
# List running containers
docker ps

# Enter the running container
docker exec -it memmorystorage-dev sh

# View container logs
docker logs memmorystorage-dev

# Restart container
docker restart memmorystorage-dev
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi memmorystorage_memmorystorage

# Clean up unused images/containers
docker system prune
```

## Adding Memory Images

To add new memory images to the gallery:

1. **Copy images to the container**:

   ```bash
   # The assets/images/memmory folder is mounted as a volume
   # Simply add images to your local assets/images/memmory folder
   cp your-new-image.jpg assets/images/memmory/
   ```

2. **Regenerate image imports**:

   ```bash
   # Enter the container and run the generation script
   docker exec -it memmorystorage-dev npm run generate-images
   ```

3. **Restart if needed**:
   ```bash
   docker-compose restart
   ```

## Environment Variables

You can customize the Docker environment by creating a `.env` file:

```env
# .env file
NODE_ENV=development
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
CHOKIDAR_USEPOLLING=true
```

## Troubleshooting

### Port Conflicts

If ports are already in use, modify the `docker-compose.yml` ports mapping:

```yaml
ports:
  - "8082:8081" # Change first port number
  - "19003:19000"
  - "19004:19001"
  - "19005:19002"
```

### Container Won't Start

1. **Check logs**:

   ```bash
   docker-compose logs memmorystorage
   ```

2. **Rebuild completely**:

   ```bash
   docker-compose down
   docker-compose up --build --force-recreate
   ```

3. **Clear Docker cache**:
   ```bash
   docker system prune -a
   ```

### Hot Reloading Issues

If file changes aren't being detected:

1. **Enable polling** (already enabled in docker-compose.yml):

   ```yaml
   environment:
     - CHOKIDAR_USEPOLLING=true
   ```

2. **Check file permissions**:
   ```bash
   # Make sure files are readable
   chmod -R 755 .
   ```

### Metro Bundler Issues

1. **Clear Metro cache**:

   ```bash
   docker exec -it memmorystorage-dev npx expo start --clear
   ```

2. **Reset Expo cache**:
   ```bash
   docker exec -it memmorystorage-dev npx expo start -c
   ```

## Performance Tips

1. **Use .dockerignore**: Already configured to exclude unnecessary files
2. **Volume mounting**: Source code is mounted for live reloading
3. **Multi-stage builds**: Consider using multi-stage builds for production
4. **Resource limits**: Add resource limits if needed:

```yaml
services:
  memmorystorage:
    # ... other config
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "2"
```

## Production Considerations

For production deployment, you would need:

1. **Separate production Dockerfile**
2. **Static build for web**:
   ```bash
   npm run web:build
   ```
3. **Nginx for serving static files**
4. **Environment-specific configurations**

This Docker setup is optimized for development. For production deployments, consider using Expo EAS Build or similar services.
