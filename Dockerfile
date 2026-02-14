# Multi-stage Dockerfile for Next.js 14 with Prisma
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files and prisma schema (needed for postinstall)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install sharp for image optimization (must be after copying standalone)
RUN npm install sharp@0.33.5

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy complete Prisma installation from builder (includes all binaries)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Install prisma CLI for running migrations
RUN npm install prisma@5.22.0

# Create data directory for SQLite and set permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Copy entrypoint script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
