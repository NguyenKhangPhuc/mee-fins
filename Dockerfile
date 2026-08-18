# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable Corepack and use stable pnpm v9 for headless CI build compatibility
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package manifests and pnpm lockfile
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code, generate Prisma client, and build NestJS production bundle
COPY . .
RUN npx prisma generate
RUN pnpm run build

# Stage 2: Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Security: Create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built application assets and node_modules from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]
