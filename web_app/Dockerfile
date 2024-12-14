FROM node:20-alpine

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

EXPOSE 5173

WORKDIR /app
COPY ./ /app

RUN pnpm install

ENTRYPOINT ["pnpm", "run", "dev"]