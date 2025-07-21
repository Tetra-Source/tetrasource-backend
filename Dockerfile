FROM docker.io/library/node:18-slim

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Update npm first
RUN npm install -g npm@11.4.2

COPY --chown=node package*.json ./

# Use legacy peer deps to force installation
RUN npm install --legacy-peer-deps

# Rest of your Dockerfile...
COPY --chown=node . .
EXPOSE 3000
CMD ["npm", "start"]
