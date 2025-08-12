FROM node:20

WORKDIR /offarat-ui

COPY package.json .

RUN ls -l /bin/sh
RUN /bin/sh -c "echo shell exists"

RUN npm install -f

COPY . .

RUN npm run build

EXPOSE 2135

CMD ["npm", "run", "dev"]
