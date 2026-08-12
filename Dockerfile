# Use a lightweight native Node.js Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy project files into container
COPY index.html index.css app.js server.js ./

# Set environment variable for Production
ENV NODE_ENV=production

# Expose standard port (Cloud Run defaults to 8080, but server.js dynamically listens on process.env.PORT)
EXPOSE 8080

# Start the Node.js static file server
CMD ["node", "server.js"]
