# vejas-backend-v2

A production-ready NestJS application

## Quick Start

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run start:dev
```

Health check: `GET /health`

## Add Auth

```bash
zimt auth
```

## Generate Endpoints

```bash
# From a name
zimt generate products

# From SQL
zimt generate create "CREATE TABLE orders (id SERIAL PRIMARY KEY, total DECIMAL NOT NULL)"
```

## Docker

```bash
npm run docker:build
```
