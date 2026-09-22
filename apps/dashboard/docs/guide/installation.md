# Installation

Get the template running in under 2 minutes. Choose between Vite (SPA) or Next.js (SSR/SSG) based on your needs.

## Prerequisites

- Bun 1.4+ (required — Bun workspaces with `bun.lock`; Node.js 20.19+ only if you run the tooling with Node.js)
- Git for cloning

## Quick Setup

### Vite Version (SPA)

```bash
git clone https://github.com/silicondeck/shadcn-dashboard-landing-template.git
cd shadcn-dashboard-landing-template/vite-version
bun install
bun run dev
```

Open `http://localhost:5173`

### Next.js Version (SSR/SSG)

```bash
git clone https://github.com/silicondeck/shadcn-dashboard-landing-template.git
cd shadcn-dashboard-landing-template/nextjs-version
bun install
bun run dev
```

Open `http://localhost:3000`

## Commands

**Development:**
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview build (Vite)
bun run start        # Start production server (Next.js)
```

**Code Quality:**
```bash
bun run lint         # Check for issues
bun run type-check   # TypeScript validation
```

## Troubleshooting

**Common Issues:**

- **Node version**: Node.js 20.19+ is only required if you run the tooling with Node.js; the build and lint scripts run on Bun 1.4+
- **Port in use**: Use `bun run dev --port 5174` (Vite) or `bun run dev -p 3001` (Next.js)
- **TypeScript errors**: Run `bun install` and restart your editor

**Need help?** Check the [support guide](/guide/support) or join our [Discord](https://discord.com/invite/XEQhPc9a6p).

## Next Steps

- **[Choose Framework](/guide/choosing-framework)** - Understand the differences
- **[Explore Features](/guide/features)** - See what's included
- **[Framework Guide](/vite/)** - Dive into the Vite guide
