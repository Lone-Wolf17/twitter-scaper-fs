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

This will handle creating creating the backend container, frontend container and postgres database for the backend. 
