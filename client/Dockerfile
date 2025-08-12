# Pull the Node image from Docker Hub
FROM node:20 

# Setting Working Directory
WORKDIR /offarat-ui

# Copying only package.json
COPY package.json .

# Install Dependencies
RUN npm install -f

# Copy rest of the code to container
COPY . .

RUN npm run build

EXPOSE 2135

CMD ["npm", "run", "dev"]