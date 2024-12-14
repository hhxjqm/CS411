# Dockerfile to host the web app

FROM node:lts-alpine AS build

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY web_app/package*.json /app
COPY web_app/pnpm-lock.yaml /app
RUN pnpm install
COPY web_app/ /app
RUN pnpm build

FROM node:lts-alpine

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

EXPOSE 3000

# Create app directory
WORKDIR /app
COPY server/package*.json /app
COPY server/pnpm-lock.yaml /app
RUN pnpm install

COPY server/ /app
COPY --from=build app/dist /web_app/dist

ENTRYPOINT [ "pnpm", "serve" ]
