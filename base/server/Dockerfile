FROM node:8

# Create app directory
WORKDIR /app/

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN chmod +x wait-for-it.sh

EXPOSE 3003
EXPOSE 5001
CMD [ "npm", "start" ]
