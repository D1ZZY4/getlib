# GetLib Dashboard Documentation

This directory contains the documentation for the GetLib knowledge platform dashboard, built with VitePress.

GetLib is a self-hosted, version-aware developer knowledge platform. The dashboard lets developers explore libraries, documents, indexing jobs, and retrieval health with full provenance. The default data path is schema-conformant fixtures; the live Phase 3 Hono API is an opt-in switch.

## 📚 Documentation Structure

The documentation is organized into sections:

### 🏁 Getting Started
- **[Overview](./index.md)** - Project introduction and features
- **[Installation Guide](./guide/installation.md)** - Complete setup instructions

### 🔧 Framework-Specific Guides
- **[Vite Version](./vite/)** - React + Vite + React Router DOM

### 🎨 Component System
- **[Component Library](./components/)** - shadcn/ui integration
- **[Theme Customizer](./theme-customizer/)** - Real-time theme editing

### 🚀 Advanced Topics
- **[Build & Deploy](./vite/build-deploy.md)** - Production deployment guides
- **[Theme System](./guide/theme-system.md)** - Styling and customization

## 🛠️ Development

### Prerequisites
- Bun 1.4+ (required — this repo uses Bun workspaces with `bun.lock`)
- Node.js 20.19+ (optional — only needed if you run the tooling with Node.js)

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev
# or use the convenience script
./dev.sh

# Documentation will be available at http://localhost:5173
```

### Build Documentation

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## 📖 Documentation Philosophy

This documentation follows these principles:

### Framework-Specific Organization
Rather than mixing Vite and Next.js instructions, each framework has dedicated sections to avoid confusion and provide targeted guidance.

### User-Journey Focused
Documentation is organized by user goals rather than technical implementation details:
- Quick setup for immediate results
- Deep customization for advanced users
- Migration paths for framework switching

### Comprehensive Examples
Every concept includes working code examples that can be copied and used immediately.

### Performance Oriented
VitePress provides:
- Fast site generation
- Excellent search capabilities
- Mobile-optimized experience
- Dark/light mode support

## 🔍 Search and Navigation

The documentation includes:
- **Full-text search** across all content
- **Sidebar navigation** with collapsible sections
- **Cross-references** between related topics
- **Mobile-responsive** design

## 🤝 Contributing to Documentation

To improve the documentation:

1. **Edit Markdown files** in the appropriate directories
2. **Test locally** with `bun run dev`
3. **Follow the style guide** for consistency
4. **Update navigation** in `.vitepress/config.ts` if needed

### Style Guidelines

- Use clear, descriptive headings
- Include code examples for all concepts
- Add framework-specific notes where relevant
- Keep explanations concise but complete
- Use proper Markdown formatting

### File Organization

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress configuration
│   └── theme/             # Custom theme components
├── guide/                 # Getting started guides
├── vite/                  # Vite-specific documentation
├── components/            # Component library docs
└── theme-customizer/      # Theme customization guides
```

## 🚀 Deployment

The documentation can be deployed to any static hosting provider:

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel

# or link to a Git repository for automatic deployments
```

### Netlify
```bash
# Build command: bun run build
# Publish directory: .vitepress/dist
```

### GitHub Pages
```bash
# Use GitHub Actions with VitePress deployment action
```

## 📝 Content Updates

### Adding New Pages

1. Create Markdown files in the appropriate directory
2. Update sidebar navigation in `.vitepress/config.ts`
3. Add cross-references from related pages
4. Test the build process

### Updating Existing Content

1. Edit the relevant Markdown files
2. Maintain consistency with existing style
3. Update any affected cross-references
4. Verify all code examples still work

## 🔧 VitePress Configuration

The documentation uses these VitePress features:

- **Theme Configuration** - Custom sidebar and navigation
- **Search Integration** - Local search with full-text indexing
- **Code Highlighting** - Syntax highlighting for multiple languages
- **Custom Components** - Vue components for enhanced content
- **SEO Optimization** - Meta tags and social media cards

## 📊 Performance

The documentation is optimized for:
- **Fast Loading** - Minimal JavaScript, optimized assets
- **Search Performance** - Efficient search indexing
- **Mobile Experience** - Responsive design and touch-friendly navigation
- **Accessibility** - WCAG compliant structure and navigation

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**
- Check for broken internal links
- Verify all imported files exist
- Ensure proper Markdown syntax

**Search Not Working:**
- Rebuild the documentation
- Check for JavaScript errors
- Verify search index generation

**Navigation Issues:**
- Check `.vitepress/config.ts` sidebar configuration
- Ensure file paths match navigation links
- Verify proper heading structure

## 📄 License

The documentation is released under the same MIT License as the main project.

---

For questions about the documentation, please open an issue in the main repository or contribute improvements via pull request.
