FROM node:18

# Create app directory
WORKDIR /usr/src/logs/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8082
CMD [ "node", "server.js" ]

#docker build -t api-logs . 
#docker run --name api-logs -p 8082:8082 -d api-logs