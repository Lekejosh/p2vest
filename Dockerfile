# Stage 1: Build Stage
FROM node:alpine AS build-stage

# Set working directory
WORKDIR /app

# Install build dependencies first, reducing the need to rebuild layers if the app code changes
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript files
RUN npm run build


# Stage 2: Production Stage
FROM node:alpine AS production-stage

# Set working directory
WORKDIR /app

# Copy only the production dependencies from the build stage
COPY --from=build-stage /app/package*.json ./
RUN npm ci --only=production

# Copy the built application files and Prisma client from the build stage
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/prisma ./prisma

# Copy the entry script and ensure it is executable
RUN npm install ts-node --only=production
# Start the application using the entry script
CMD ["npm", "run","start"]
