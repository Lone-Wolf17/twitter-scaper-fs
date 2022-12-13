FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN yarn install --pure-lockfile
COPY . .

RUN chown -R node:node /app
RUN yarn build
USER node

EXPOSE 3000
CMD yarn start