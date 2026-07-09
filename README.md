# 🏦 White Bank

White Bank is a modern digital banking platform built with a secure, scalable architecture.

> **Status:** 🚧 Under Development

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Infrastructure
- Docker
- Turborepo
- pnpm

---

## Project Structure

```
white-bank/
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── ui/
│   ├── types/
│   └── utils/
├── services/
│   └── api/
├── infrastructure/
├── docs/
└── scripts/
```

---

## Features (Planned)

- User authentication
- Customer dashboard
- Account management
- Money transfers
- Transaction history
- Virtual and physical cards
- Savings
- Loans
- Bill payments
- Notifications
- Admin dashboard
- KYC verification
- Fraud monitoring

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL
- Docker (optional)

### Install

```bash
pnpm install
```

### Run Development

```bash
pnpm dev
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development |
| `pnpm build` | Build all applications |
| `pnpm lint` | Run linting |
| `pnpm test` | Run tests |
| `pnpm typecheck` | Run TypeScript checks |

---

## License

MIT License

---

## services/api — Local development & Prisma

This repository includes a minimal services/api (TypeScript + Express) and a Prisma schema located at `prisma/schema.prisma`.

Quick start (using Docker):

1. Copy environment file:

   cp .env.example .env

2. Start Postgres + API (builds the API image which runs Prisma generate and builds the app):

   docker-compose up --build

3. The API will be available at http://localhost:4000. Health check: http://localhost:4000/health

Quick start (local Node.js development):

1. Install Node.js 18+ and npm.

2. Copy environment file and ensure Postgres is running (e.g., via Docker):

   cp .env.example .env
   docker run --name whitebank-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=whitebank -e POSTGRES_DB=whitebank -p 5432:5432 -d postgres:15-alpine

3. From the repository root, install and prepare the API:

   cd services/api
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev

Prisma notes:

- For local development we use `npm run prisma:migrate` which runs `prisma migrate dev --name init` (creates and applies a migration).
- To generate the Prisma client manually: `npx prisma generate` or `npm run prisma:generate`.

Running migrations in CI/CD:

- Applying migrations in production should be done carefully. Consider using `prisma migrate deploy` in your deploy pipeline, not `migrate dev`.

Troubleshooting:

- If the API cannot connect to the database, confirm DATABASE_URL in .env points at a reachable Postgres instance.
- For container builds: if Prisma fails during image build, ensure the schema file is copied and the build has network access to download dependencies.

Contact:

- Repo owner: tprjwrckst-art
