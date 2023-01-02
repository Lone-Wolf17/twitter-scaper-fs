FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN yarn install --pure-lockfile
COPY ./ ./

# Install `serve` to run the application.
RUN npm install -g serve

# RUN chown -R node:node /app
RUN chmod +x /app/frontend-entrypoint.sh

EXPOSE 3000
# ENTRYPOINT [ "./frontend-entrypoint.sh" ]
# RUN yarn build 
CMD yarn start