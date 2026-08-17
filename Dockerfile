# Stage 1: Build stage
FROM node:20.18-alpine AS builder

WORKDIR /app

# Install dependencies needed for native modules / Prisma
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy source code, generate Prisma client, and build NestJS production bundle
COPY . .
RUN npx prisma generate
RUN npm run build

# Prune devDependencies to keep production node_modules minimal
RUN npm prune --production

# Stage 2: Runtime stage
FROM node:20.18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Security: Create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built application assets and node_modules from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]
