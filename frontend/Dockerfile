# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first (for caching)
COPY package.json package-lock.json ./

RUN npm install

# Copy all files and build
COPY . .
RUN npm run build

# Step 2: Serve stage (use a lightweight server)
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port nginx will serve
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]