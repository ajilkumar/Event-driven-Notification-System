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
WORKDIR /app/services/event-api
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts and production dependencies
# In a workspace setup, it's easier to copy the whole node_modules or re-install
COPY package*.json ./
COPY shared/logger/package*.json ./shared/logger/
COPY services/event-api/package*.json ./services/event-api/

# Install only production dependencies for the workspace
RUN npm install --only=production

COPY --from=builder /app/services/event-api/dist ./services/event-api/dist
COPY --from=builder /app/shared/logger/ ./shared/logger/

EXPOSE 3000

WORKDIR /app/services/event-api
CMD ["node", "dist/server.js"]
