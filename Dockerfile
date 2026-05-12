# Stage 1: Build the frontend application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev tools needed for the build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Vite application (outputs to dist/)
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Set the environment variable to production
ENV NODE_ENV=production

# Install all dependencies (needed to run TypeScript server with tsx)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy built frontend assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the server file and any necessary source code (e.g. database schema, data)
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src ./src

# Use the built-in non-root "node" user for security
RUN chown -R node:node /app
USER node

# Expose the application port
EXPOSE 3000

# Start the application using tsx to run the TypeScript server file
CMD ["npx", "tsx", "server.ts"]
