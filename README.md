Twitter Scapper FS Test.

Here is the repo for the Twitter Scraper FS Test.

Backend: Node
Frontend: React.

Requirements to run repo

- Docker
- Node
- npx
- yarn

To run, clone the repo.
ensure to create a .env file in the root folder with the following variables

- DATABASE_URL
- TWITTER_API_KEY
- TWITTER_API_SECRET
- TWITTER_API_TOKEN
- TWITTER_API_TOKEN_SECRET
- TWITTER_API_APP
- TWITTER_API_BEARER
- DB_USERNAME
- DB_PASSWORD
- BACKEND_PORT
- NODE_ENV

The variables above are required by Docker to build and run the backend.

Once that is setup, open a terminal and run

```
docker compose up
```

This will handle creating postgres db container, building the backend, connecting the backend to the database and run all migrations.

Once you see the message "Listening on PORT=8080
Successfully started worker for tweet scraper every 15 seconds"

the backend is ready.

cd into the frontend directory on your terminal

```
cd frontend
```

and start the frontend using

```
npm start
```
