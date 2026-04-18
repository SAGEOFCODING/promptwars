# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
# Install dependencies with legacy-peer-deps to handle Vite 8 conflicts
RUN npm install --legacy-peer-deps
# Copy source code
COPY . .
# Build the Vite/React application
RUN npm run build

# Production serve stage
FROM nginx:alpine
# Copy the custom nginx config to listen on 8080 (Cloud Run default)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
