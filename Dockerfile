# Use the latest Node.js image
FROM node:23

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Set environment variables
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application using the compiled JavaScript
CMD ["node", "dist/index.js"]
