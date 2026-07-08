FROM node:22-alpine AS base
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/package.json

RUN npm install --workspace=apps/frontend

COPY tsconfig.base.json ./
COPY apps/frontend apps/frontend

RUN npm run build --workspace=apps/frontend

WORKDIR /repo/apps/frontend
EXPOSE 3000
CMD ["npm", "run", "start"]
