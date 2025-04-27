FROM node:18-alpine

WORKDIR /app

COPY .env package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]