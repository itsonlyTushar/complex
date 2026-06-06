FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

# Run production server
CMD ["npm", "run", "start"]