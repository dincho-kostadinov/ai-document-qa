FROM node:22-alpine AS base
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json

RUN npm install --workspace=apps/backend

COPY tsconfig.base.json ./
COPY apps/backend apps/backend

RUN npm run build --workspace=apps/backend

WORKDIR /repo/apps/backend
EXPOSE 4000
CMD ["node", "dist/index.js"]
