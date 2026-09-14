FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]