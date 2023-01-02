FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN yarn install --pure-lockfile
COPY ./ ./

# RUN chown -R node:node /app
RUN chmod +x /app/backend-entrypoint.sh

EXPOSE 3000
ENTRYPOINT [ "./backend-entrypoint.sh" ]
CMD [ "yarn" "start" ]