# Use Node.js 20 LTS as base image for better compatibility with Expo SDK 53
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install global dependencies for Expo
RUN npm install -g @expo/cli@latest

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p assets/images/memmory

# Generate image imports (if images exist)
RUN npm run generate-images || true

# Expose ports for Expo development server
# 8081 - Metro bundler
# 19000 - Expo dev tools
# 19001 - Expo dev tools (secure)
# 19002 - Expo web
EXPOSE 8081 19000 19001 19002

# Set environment variables
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8081/status || exit 1

# Default command - start Expo development server
CMD ["npm", "start", "--", "--host", "tunnel"]