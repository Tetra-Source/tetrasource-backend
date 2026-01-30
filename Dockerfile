FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Conditional .npmrc copy (won't fail if file doesn't exist)
# Remove if you don't have .npmrc, or keep if you need it
COPY .npmrc ./ 2>/dev/null || echo "No .npmrc file found, continuing..."

# Install only production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application if you have a build script
# Comment out if you don't have npm run build
# RUN npm run build

# Expose port (Railway dynamically assigns PORT)
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Health check compatible with Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
