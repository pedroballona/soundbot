FROM node:16
RUN apt-get update
RUN apt install ffmpeg -y
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]