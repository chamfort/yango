# Base image for building
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and generate prisma client
COPY . .
RUN npx prisma generate

# Build the app
RUN npm run build

# Stage for production
FROM node:18-slim

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create the data directory for SQLite if it doesn't exist
RUN mkdir -p /app/data

# Environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/dev.db"

# Expose the API port
EXPOSE 3000

# Start command
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
