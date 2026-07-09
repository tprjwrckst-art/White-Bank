# Build stage
FROM node:20-alpine AS builder

# Install build deps
WORKDIR /app/services/api
COPY services/api/package.json services/api/tsconfig.json ./
COPY prisma/schema.prisma /app/prisma/schema.prisma

# Install dependencies (including dev) for build/generate
RUN npm install

# Copy source
COPY services/api ./

# Generate Prisma client and build
RUN npx prisma generate --schema=/app/prisma/schema.prisma
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app/services/api

# Copy built files and node_modules
COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/services/api/node_modules ./node_modules
COPY --from=builder /app/services/api/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
