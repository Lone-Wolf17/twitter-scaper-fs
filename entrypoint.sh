#!/bin/sh

cd backend
npx prisma generate
npx prisma migrate dev
yarn build
yarn start