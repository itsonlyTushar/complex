FROM node:22

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]