# -------- Base Image --------
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# -------- Install Dependencies --------
FROM base AS deps

# Copy only package files first (better caching)
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# -------- Build Stage (if needed) --------
FROM base AS build

COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the app (skip if not needed)
RUN npm run build

# -------- Final Production Image --------
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built app (or source if no build step)
COPY --from=build /app/dist ./dist
# If you don't use build step, replace with:
# COPY . .

# Set ownership
RUN chown -R nodeuser:nodejs /app

USER nodeuser

# Expose port (change if needed)
EXPOSE 3000

# Start app
CMD ["node", "dist/index.js"]