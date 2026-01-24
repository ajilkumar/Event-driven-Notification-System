FROM node:18-alpine AS builder

WORKDIR /app

# Copy root and ALL package files for workspace installation
COPY package*.json ./
COPY shared/logger/package*.json ./shared/logger/
COPY services/event-api/package*.json ./services/event-api/
COPY services/worker/package*.json ./services/worker/

# Install dependencies using workspaces (from root)
RUN npm install

# Copy all source code
COPY . .

# Build the specific service
WORKDIR /app/services/worker
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts and production dependencies
COPY package*.json ./
COPY shared/logger/package*.json ./shared/logger/
COPY services/worker/package*.json ./services/worker/

# Install only production dependencies for the workspace
RUN npm install --only=production

COPY --from=builder /app/services/worker/dist ./services/worker/dist
COPY --from=builder /app/shared/logger/ ./shared/logger/

WORKDIR /app/services/worker
CMD ["node", "dist/index.js"]
