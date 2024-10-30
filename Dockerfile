###
### Phase 1: builder
###

# Base image
FROM node:20.18-bookworm-slim AS builder

# Install app dependencies
COPY . .
RUN npm install

# Create application build
RUN npm run build

###
### Phase 2: runner
###

FROM node:20.18-bookworm-slim AS runner

# Optimize Node.js tooling for production
ENV NODE_ENV production

EXPOSE 3000

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY --from=builder /dist ./dist/
COPY --from=builder global-bundle.pem ./

# Install production dependencies
COPY --from=builder /package*.json ./
RUN npm ci --omit=dev

# Prevent user from run system commands
USER node

# Start the server
CMD ["node", "dist/main.js" ]
