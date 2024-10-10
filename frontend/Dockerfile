# Use official Node.js image as base for frontend
FROM node:18-alpine AS frontend

# Set working directory for frontend
WORKDIR /frontend

# Copy frontend application files
COPY ./package*.json ./

# Install frontend dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Build frontend
RUN npm run build

# Use Nginx image as base for serving frontend
FROM nginx:1.21-alpine

# Copy built frontend files to Nginx
COPY --from=frontend /frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
