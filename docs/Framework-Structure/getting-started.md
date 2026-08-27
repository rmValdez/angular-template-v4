# Getting Started with Angular 19 Master Template

## Prerequisites
- Node.js 18+ or 20+
- pnpm 9.x (`npm install -g pnpm@9`)

---

## 1. Quick Start

```bash
# Navigate and install dependencies
cd angular-template-v4
pnpm install

# Start Angular dev server
pnpm dev
```
Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## 2. Seed Accounts (via Nuxt 3 Backend)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` | Full access (Users, Posts, Dashboard, Settings) |
| **Member** | `user@example.com` | `password123` | Content creation & dashboard view |

---

## 3. Production Build

```bash
pnpm build
```
Optimized static bundles will be compiled to `dist/angular-template-v4/browser/`.
