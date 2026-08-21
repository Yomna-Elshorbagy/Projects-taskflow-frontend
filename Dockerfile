# Stage 1: Build the frontend assets
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the project (Vite produces output in 'dist')
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine AS runner

# Remove default Nginx config and static assets
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage to Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
