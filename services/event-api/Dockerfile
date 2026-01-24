FROM node:18-alpine AS builder

WORKDIR /app

# Copy shared packages needed for build
COPY shared/logger ./shared/logger

# Copy service package files
COPY services/event-api/package*.json ./services/event-api/

WORKDIR /app/services/event-api

# Install dependencies - we use install here because ci can be finicky with local file deps in Docker
RUN npm install

# Copy service source code
COPY services/event-api/ ./

# Build the service
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy shared packages needed for runtime
COPY shared/logger ./shared/logger

# Copy built artifacts and production dependencies
COPY services/event-api/package*.json ./services/event-api/
WORKDIR /app/services/event-api

RUN npm install --only=production

COPY --from=builder /app/services/event-api/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
