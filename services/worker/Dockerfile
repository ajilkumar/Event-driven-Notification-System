FROM node:18-alpine AS builder

WORKDIR /app

# Copy shared packages needed for build
COPY shared/logger ./shared/logger

# Copy service package files
COPY services/worker/package*.json ./services/worker/

WORKDIR /app/services/worker

# Install dependencies
RUN npm install

# Copy service source code
COPY services/worker/ ./

# Build the service
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy shared packages needed for runtime
COPY shared/logger ./shared/logger

# Copy built artifacts and production dependencies
COPY services/worker/package*.json ./services/worker/
WORKDIR /app/services/worker

RUN npm install --only=production

COPY --from=builder /app/services/worker/dist ./dist

CMD ["node", "dist/index.js"]
