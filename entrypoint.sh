#!/bin/sh

npx prisma generate
npx prisma migrate dev
yarn build
yarn start