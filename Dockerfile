# Use Node.js 20 LTS with latest Alpine for security patches
FROM node:20-alpine

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S expo -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Change ownership to non-root user
RUN chown -R expo:nodejs /app

# Switch to non-root user
USER expo

# Install global dependencies for Expo
RUN npm install -g @expo/cli@latest

# Copy package files first for better Docker layer caching
COPY --chown=expo:nodejs package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY --chown=expo:nodejs . .

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
ENV NODE_ENV=development

# Security: Disable npm update check and set secure defaults
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8081/status || exit 1

# Default command - start Expo development server
CMD ["npm", "start", "--", "--host", "tunnel"]