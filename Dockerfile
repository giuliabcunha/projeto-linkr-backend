FROM node:22

WORKDIR /usr/src

COPY . .

EXPOSE 3000

RUN npm install

RUN npx prisma generate

RUN npm run build

CMD npx prisma migrate deploy && npm start