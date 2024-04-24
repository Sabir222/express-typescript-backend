#node base image version 
FROM node:20-alpine


#
COPY package*.json /app/
COPY src /app/

#
WORKDIR /app

# install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

#
CMD ["node","server.ts"]