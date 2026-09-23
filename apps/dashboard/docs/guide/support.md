# Support

Get help with the Shadcn Dashboard template.

## Quick Help

### Documentation
- **[Installation Guide](/guide/installation)** - Setup instructions
- **[Components](/components/)** - Component library
- **[Theme System](/guide/theme-system)** - Customization options
- **[Project Structure](/guide/project-structure)** - Code organization

### Common Issues

**Build Errors**
- Check Node.js version (18+ required)
- Clear `node_modules` and reinstall: `rm -rf node_modules bun.lock && bun install`
- Verify TypeScript configuration

**Theme Not Working**
- Ensure CSS variables are properly imported
- Check component `"use client"` directives
- Verify theme provider wrapper

**Component Issues**
- Update to latest shadcn/ui version
- Check import paths and aliases
- Ensure proper TypeScript types

## Community Support

### GitHub
- **[Issues](https://github.com/D1ZZY4/getlib/issues)** - Bug reports
- **[Discussions](https://github.com/D1ZZY4/getlib/discussions)** - Questions
- **[Wiki](https://github.com/D1ZZY4/getlib/wiki)** - Guides

### Community Channels
- **[GitHub Issues](https://github.com/D1ZZY4/getlib/issues)** - Bug reports
- **[GitHub Discussions](https://github.com/D1ZZY4/getlib/discussions)** - Questions and ideas

## Commercial Support

This project currently has no commercial support channel. For bugs and feature requests, please use GitHub issues.
- **Priority Bug Fixes** - Fast-track issue resolution
- **Training & Consultation** - Team onboarding

## Bug Reports

When reporting bugs, include:
1. **Description** of the issue
2. **Steps to reproduce** the problem
3. **Expected** vs **actual** behavior
4. **Environment** details (OS, browser, versions)
5. **Screenshots** or error messages

## Feature Requests

Suggest new features via:
- [GitHub Discussions](https://github.com/D1ZZY4/getlib/discussions)
- Community voting on priorities
- Detailed use case descriptions

---

We're here to help you succeed with the template!
Suggest improvements and new features:
- Check existing discussions first
- Explain the use case and benefits
- Consider implementation complexity
- Provide mockups or examples if helpful

## Frequently Asked Questions

### Installation & Setup

**Q: Which version should I choose - Vite or Next.js?**
A: Choose based on your project needs:
- **Vite**: Fast SPA development, client-side routing, simpler deployment
- **Next.js**: SEO optimization, server-side rendering, full-stack capabilities

**Q: Can I use both versions in the same project?**
A: No, choose one version. Both provide identical UI components and features but different architectures.

**Q: What Node.js version is required?**
A: Bun 1.4+ is required — the repo uses Bun workspaces with `bun.lock` and all scripts run with Bun. If you run the tooling with Node.js instead, Node.js 20.19+ is required (Vite 8 / ESLint 10).

### Development

**Q: How do I add a new page?**
A: 
1. Create a new directory in `src/app/`
2. Add a `page.tsx` file with your component
3. Update navigation in `app-sidebar.tsx`
4. For Vite: Add route to `App.tsx`

**Q: How do I customize the theme?**
A: Use the built-in theme customizer:
1. Click the theme customizer button
2. Adjust colors and layout options
3. Export your theme configuration
4. Apply to your production build

**Q: Can I remove the theme customizer?**
A: Yes, see [Removing Customizer](/theme-customizer/removing-customizer) guide for instructions.

### Components & Styling

**Q: How do I add new shadcn/ui components?**
A: Use the shadcn/ui CLI:
```bash
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add card
```

**Q: How do I customize component styles?**
A: Modify the component files in `src/components/ui/` or create custom variants using class-variance-authority.

**Q: How do I handle responsive design?**
A: Use Tailwind CSS responsive prefixes:
```tsx
<div className="px-4 md:px-6 lg:px-8">
  Content
</div>
```

### Deployment

**Q: How do I deploy the Vite version?**
A: 
1. Run `bun run build`
2. Deploy the `dist/` folder to any static hosting
3. Recommended: Netlify, Vercel, or AWS S3

**Q: How do I deploy the Next.js version?**
A:
1. Run `bun run build`
2. Deploy to Vercel (recommended) or any Node.js hosting
3. Set environment variables as needed

**Q: Can I deploy to GitHub Pages?**
A: Yes, for the Vite version. Configure the base path in `vite.config.ts` for GitHub Pages deployment.

### Troubleshooting

**Q: I'm getting TypeScript errors**
A: 
1. Check Node.js version (18+)
2. Run `bun install` to ensure dependencies
3. Restart TypeScript server in your editor
4. Check for missing type definitions

**Q: Styles aren't loading correctly**
A:
1. Ensure Tailwind CSS is configured properly
2. Check if `globals.css` is imported
3. Verify CSS variables are defined
4. Clear browser cache

**Q: Theme customizer isn't working**
A:
1. Check if `ThemeCustomizer` component is included
2. Verify tweakcn dependencies are installed
3. Ensure CSS variables are properly configured
4. Check browser console for errors

## Professional Support

There is currently no premium support or consulting offering for GetLib. For enterprise needs, please open a GitHub discussion describing your requirements.

## Learning Resources

### Guides in This Site

- Setup and installation: [Installation](/guide/installation)
- Component customization: [Components](/components/)
- Advanced theming: [Theme Customizer](/theme-customizer/)
- Real-world surfaces: [Features](/guide/features)

### Example Surfaces

Explore the implemented surfaces in the dashboard:
- Knowledge libraries and search with provenance
- Indexing pipeline and system logs
- Analytics and settings

## Contributing to Support

### Help the Community

**Share Knowledge**
- Contribute to GitHub discussions
- Write tutorials and guides
- Share your implementations

**Improve Documentation**
- Fix typos and errors
- Add missing information
- Create new guides
- Translate documentation

### Become a Community Moderator

Help us maintain a helpful and welcoming community:
- Review and answer questions
- Help newcomers get started
- Organize community events

Open a GitHub discussion if interested.

## Contact Information

### Direct Contact

For all inquiries, including security issues, please use GitHub:

- **[GitHub Issues](https://github.com/D1ZZY4/getlib/issues)** - Bugs and security reports
- **[GitHub Discussions](https://github.com/D1ZZY4/getlib/discussions)** - Questions and ideas
- **GitHub**: [D1ZZY4](https://github.com/D1ZZY4)

### Response Times

**Community Support**
- GitHub: 1-3 business days

## Feedback

### Help Us Improve

**Documentation Feedback**
Found something unclear or missing? Let us know:
- Create GitHub issues for documentation problems
- Suggest improvements in discussions

**Product Feedback**
Help us make the dashboard better:
- Star the repo on GitHub
- Share success stories
- Suggest new features
- Report usability issues

**Community Feedback**
How can we improve the community experience?
- Suggest new Discord channels
- Propose community events
- Share ideas for tutorials
- Recommend guest speakers

## Success Stories

### Community Showcase

**Built with Shadcn Dashboard**
See what others have created:
- SaaS applications
- E-commerce platforms
- Internal tools
- Portfolio websites

Share your project in Discord or tag us on social media!

### Customer Testimonials

*"The Shadcn Dashboard template saved us months of development time. The code quality is excellent and the documentation is comprehensive."*
- **Jane Smith**, Lead Developer at TechCorp

*"Outstanding template with great community support. The theme customizer is a game-changer for our client projects."*
- **Mike Johnson**, Freelance Developer

---

**Need help?** Don't hesitate to reach out. Our community and team are here to help you succeed with the GetLib dashboard!
