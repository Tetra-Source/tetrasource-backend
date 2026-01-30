FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

# Use node directly instead of npm start for better signal handling
CMD ["node", "server.js"]
