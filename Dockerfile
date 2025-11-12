FROM node:18-alpine

WORKDIR /app

# Copy package files (ONLY copy what exists)
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
