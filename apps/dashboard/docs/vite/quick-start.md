# Vite Quick Start

Get up and running with the GetLib dashboard in minutes.

## Prerequisites

Before getting started, ensure you have:

- **Bun** v1.4+ (required — this repo uses Bun workspaces with `bun.lock`)
- **Node.js** v20.19+ (optional — only needed if you run the tooling with Node.js)
- **Git** for cloning the repository

## Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/D1ZZY4/getlib.git
cd getlib
```

### Step 2: Install Dependencies

```bash
# Install dependencies (Bun workspaces, from the repo root)
bun install
```

### Step 3: Start Development Server

### Step 4: Start Development Server

```bash
# Start development server
bun run dev

# Server will be available at http://localhost:5173
```

## Verification

After starting the development server, you should see:

1. **Dashboard Interface** - GetLib overview with sidebar navigation
2. **Knowledge Surfaces** - Libraries, search, indexing, and logs
3. **Theme Customizer** - Real-time theme editing panel
4. **Hot Module Replacement** - Instant updates when you modify files

## Project Structure

```text
apps/dashboard/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles
│   ├── app/                   # Feature pages by domain
│   ├── components/            # UI components
│   ├── hooks/                 # Custom hooks
│   └── lib/                   # Utilities
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
└── package.json               # Dependencies
```

## Available Scripts

```bash
# Development (from the repo root)
bun run --cwd apps/dashboard dev          # Start development server
bun run --cwd apps/dashboard build        # Build for production
bun run --cwd apps/dashboard preview      # Preview production build
bun run --cwd apps/dashboard lint         # Biome check
bun run --cwd apps/dashboard typecheck    # TypeScript type checking
```

## First Steps

### 1. Explore the Dashboard

Navigate to `http://localhost:5173` (redirects to `/overview`) to see:
- Libraries, search, indexing, and logs surfaces
- Data tables with sorting/filtering
- Sidebar navigation
- Appearance settings with theme presets

### 2. Check the Knowledge Surfaces

Visit the sidebar routes to see the GetLib surfaces:
- `/libraries` - Registered libraries with indexing state
- `/search` - Version-aware search with provenance
- `/indexing` - Job board and table
- `/logs` - System log stream

### 3. Try Theme Customization

Open `/settings/appearance` to:
- Change mode, presets, and radius
- Adjust layout variant and sidebar position
- Import custom CSS themes
- Persist the snapshot to localStorage

### 3. Try Theme Customization

Click the customizer icon (bottom-right) to:
- Change colors in real-time
- Adjust layout spacing
- Customize typography
- Export your theme

### 4. Explore Page Templates

Check out various pages:
- `http://localhost:5173/tasks` - Task management
- `http://localhost:5173/users` - Users table
- `http://localhost:5173/analytics` - Analytics
- `http://localhost:5173/settings/appearance` - Appearance settings

## Common Issues

### Port Already in Use

If port 5173 is occupied:

```bash
bun run dev --port 3001
```

### Missing Dependencies

If you encounter missing dependencies:

```bash
rm -rf node_modules bun.lock
bun install
```

### TypeScript Errors

For TypeScript issues:

```bash
bun run type-check
# Fix any reported errors
```

## Next Steps

- **[Development Guide](/vite/development)** - Learn the development workflow
- **[Build & Deploy](/vite/build-deploy)** - Deploy your application
- **[Components](/components/)** - Explore the component library
- **[Theme Customizer](/theme-customizer/)** - Customize your theme

## Need Help?

- Check **[Troubleshooting](/vite/troubleshooting)** for common issues
- Review the **[Vite Documentation](/vite/)** for detailed guides
- Explore **[Components](/components/)** for UI component usage
