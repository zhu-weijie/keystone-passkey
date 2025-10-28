# Use an official Node.js runtime as a parent image.
# The 'alpine' variant is a lightweight version, which is great for production.
FROM node:18-alpine

# Set the working directory inside the container. This is where our app code will live.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first.
# This leverages Docker's build cache. The 'npm install' step will only be re-run
# if these files change, speeding up subsequent builds.
COPY package*.json ./

# Install application dependencies inside the container.
RUN npm install

# Copy the rest of the application source code into the working directory.
COPY . .

# Expose port 3000. This makes the port available to be mapped by Docker Compose.
EXPOSE 3000
