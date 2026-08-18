# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install native build tools for Alpine (required for bcrypt and native modules)
RUN apk add --no-cache python3 make g++

# Enable Corepack and use stable pnpm v9 for headless CI build compatibility
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package manifests and pnpm lockfile
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Set environment variables for build phase
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder_db"

# Generate Prisma client files and compile NestJS production bundle
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Security: Create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built application assets, generated client, node_modules from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]
