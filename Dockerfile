# Base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Create application build
RUN npm run build

# Port number
EXPOSE 3000

# Start the server
CMD ["node", "dist/main.js" ]
