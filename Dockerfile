FROM node:alpine

WORKDIR /SAAS_VIRGEN_DE_LOURDES

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]