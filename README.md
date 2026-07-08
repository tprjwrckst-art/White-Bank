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