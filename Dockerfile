FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the frontend assets using Vite
RUN npm run build

# Expose port 7860 as required by Hugging Face Spaces
EXPOSE 7860

# Define environment variables
ENV PORT=7860
ENV NODE_ENV=production

# Run the Express server
CMD ["node", "server.js"]
