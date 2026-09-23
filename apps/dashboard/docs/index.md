---
layout: home
hero:
  name: "GetLib Dashboard"
  tagline: "Version-aware developer knowledge platform: libraries, search with provenance, indexing jobs, and retrieval health."
  image:
    src: /hero.png
    alt: Dashboard Preview
    width: 800px
    height: auto
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View Components
      link: /components/

features:
  - icon: 📚
    title: Knowledge Libraries
    details: Registered libraries with versions, sources, freshness, and indexing state
  - icon: 🔍
    title: Search with Provenance
    details: Every result carries library, version, source, and freshness
  - icon: ⚙️
    title: Indexing Pipeline
    details: Job queue with retries, progress, board and table views
  - icon: 📊
    title: Analytics & Logs
    details: Search volume, source distribution, and system log stream
  - icon: 📱
    title: Responsive Design
    details: Mobile-first design with container queries across all devices
  - icon: 🚀
    title: Production Ready
    details: Clean TypeScript code with shadcn/ui, Tailwind CSS v4, and modern tooling
---

## 🌟 Live Demos

<div class="demo-links">
  <div class="demo-card">
    <div class="demo-icon">📚</div>
    <h3>Libraries</h3>
    <p>Registered libraries with versions, indexing state, and freshness</p>
    <a href="/guide/" class="demo-button">Explore Guide</a>
  </div>

  <div class="demo-card">
    <div class="demo-icon">🔍</div>
    <h3>Search</h3>
    <p>Version-aware knowledge search where every result carries provenance</p>
    <a href="/components/data-tables" class="demo-button">View Tables</a>
  </div>
</div>

<style>
.demo-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0 3rem 0;
}

.demo-card {
  padding: 2rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.demo-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.demo-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-card p {
  margin: 0 0 1.5rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.demo-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white !important;
  text-decoration: none !important;
  border-radius: 6px;
  font-weight: 500;
}

/* Features customization for better icon-title alignment */
.VPFeature .icon {
  margin-bottom: 1rem;
}

.VPFeatures .VPFeature h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
</style>
