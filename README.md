# 🏠 Realty Catalog

A modern, accessible real estate catalog application built with Nuxt 3, featuring property listings with advanced filtering, sorting, and responsive design.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Quality Assurance](#quality-assurance)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Internationalization](#internationalization)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Realty Catalog is a comprehensive real estate application that allows users to browse, filter, and sort property listings. The application features:

- **Property Listings**: Paginated property cards with detailed information
- **Advanced Filtering**: Room count, price range, and area filters
- **Sorting**: Sort by area, floor, and price with toggle controls
- **Responsive Design**: Mobile-first approach with drawer navigation
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Themes**: Light and dark theme support
- **Internationalization**: Multi-language support (English/Russian)
- **Performance**: Optimized with virtual scrolling and lazy loading

## 🛠 Tech Stack

### Core Framework
- **Nuxt 3** - Vue.js framework with SSR/SSG capabilities
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript

### State Management & Data
- **Pinia** - Intuitive state management for Vue
- **MSW (Mock Service Worker)** - API mocking for development
- **VueUse** - Collection of Vue composition utilities

### Styling & UI
- **Sass/SCSS** - CSS preprocessor with modules
- **CSS Modules** - Scoped styling with BEM methodology
- **Custom Fonts** - PT Root UI font family

### Testing & Quality
- **Vitest** - Fast unit testing framework
- **@vue/test-utils** - Vue component testing utilities
- **Playwright** - End-to-end testing framework
- **ESLint** - JavaScript/TypeScript linting
- **Stylelint** - CSS/SCSS linting
- **html-validate** - HTML validation
- **Storybook** - Component development environment

### Development Tools
- **Bun** - Fast JavaScript runtime and package manager
- **Vite** - Next-generation frontend tooling
- **Husky** - Git hooks for quality gates
- **lint-staged** - Run linters on staged files
- **commitlint** - Commit message linting

### Performance & Monitoring
- **Vue Virtual Scroller** - Virtual scrolling for large lists
- **Web Vitals** - Core Web Vitals monitoring
- **Bundle Analyzer** - Bundle size analysis

## 🏗 Architecture

### Design Patterns
- **Composition API** - Vue 3 composition functions
- **Component Composition** - Reusable, focused components
- **Custom Composables** - Shared business logic
- **Store Modules** - Pinia stores for state management

### Code Organization
- **Feature-based structure** - Components grouped by feature
- **Separation of concerns** - Logic, styling, and markup separated
- **Type safety** - Full TypeScript coverage
- **Test-driven development** - Tests written before implementation

### Performance Optimizations
- **Lazy loading** - Components and routes loaded on demand
- **Virtual scrolling** - Efficient rendering of large lists
- **Bundle splitting** - Optimized code splitting
- **Caching strategies** - Service worker and HTTP caching

## 📁 Project Structure

```
src/
├── assets/                 # Static assets
│   ├── fonts/             # Custom font files
│   └── styles/            # Global styles and design system
│       ├── components/    # Component-specific styles
│       ├── pages/         # Page-specific styles
│       ├── _mixins.scss   # Sass mixins
│       ├── _variables.scss # Design tokens
│       └── main.scss      # Main stylesheet
├── components/            # Vue components
│   ├── ui/               # Reusable UI components
│   └── features/         # Feature-specific components
├── composables/           # Vue composables
├── i18n/                  # Internationalization
│   └── locales/          # Translation files
├── mocks/                 # MSW mock data and handlers
├── pages/                 # Nuxt pages (file-based routing)
├── plugins/               # Nuxt plugins
├── server/                # Nuxt server API
│   └── api/              # Server API routes
├── stores/                # Pinia stores
├── stories/               # Storybook stories
├── tests/                 # Test files
│   ├── components/       # Component tests
│   ├── composables/      # Composable tests
│   └── e2e/              # E2E tests
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/realty-catalog.git
   cd realty-catalog
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 💻 Development

### Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Production build
bun run preview          # Preview production build

# Quality Assurance
bun run quality          # Run all quality checks
bun run quality:fix      # Auto-fix quality issues
bun run lint             # ESLint check
bun run stylelint        # Stylelint check
bun run typecheck        # TypeScript check

# Testing
bun run test             # Unit tests
bun run test:coverage    # Unit tests with coverage
bun run test:e2e         # End-to-end tests
bun run test:ui          # Test UI mode

# Documentation
bun run storybook        # Start Storybook
bun run storybook:build  # Build Storybook

# Analysis
bun run analyze          # Bundle analysis
bun run ci               # Full CI pipeline
```

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write failing tests first** (TDD)
   ```bash
   bun run test -- --run --reporter=verbose
   ```

3. **Implement feature**
   ```bash
   bun run dev
   ```

4. **Run quality checks**
   ```bash
   bun run quality
   ```

5. **Commit with conventional format**
   ```bash
   git commit -m "feat: add property filtering"
   ```

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Component logic, composables, utilities
- **Integration Tests**: Component interactions, API calls
- **E2E Tests**: Critical user journeys, accessibility
- **Visual Tests**: Storybook for component variations

### Test Structure

```
tests/
├── setup.ts              # Global test setup
├── components/           # Component unit tests
├── composables/          # Composable unit tests
├── e2e/                  # End-to-end tests
└── __snapshots__/        # Snapshot files
```

### Running Tests

```bash
# All tests
bun run test

# With coverage
bun run test:coverage

# Watch mode
bun run test -- --watch

# E2E tests
bun run test:e2e

# Test UI
bun run test:ui
```

## ✨ Quality Assurance

### Code Quality Tools

- **ESLint**: JavaScript/TypeScript linting with Vue support
- **Stylelint**: CSS/SCSS linting with BEM validation
- **html-validate**: HTML semantic validation
- **commitlint**: Conventional commit messages
- **Pre-commit hooks**: Automatic quality checks

### Quality Gates

- **Pre-commit**: ESLint, Stylelint, type checking
- **CI/CD**: Full test suite, coverage requirements
- **Code review**: Manual review for complex changes

## ⚡ Performance

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Analysis**: Size and dependency analysis
- **Runtime Performance**: Vue DevTools integration

### Optimizations

- **Virtual Scrolling**: Efficient large list rendering
- **Lazy Loading**: Components and images loaded on demand
- **Bundle Splitting**: Optimized code splitting
- **Caching**: Service worker and HTTP caching

## ♿ Accessibility

### Accessibility Features

- **WCAG 2.1 AA Compliance**: Full accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and announcements
- **Focus Management**: Proper focus indicators and management
- **Semantic HTML**: Proper document structure

### Accessibility Testing

- **Automated**: ESLint accessibility rules
- **Manual**: Screen reader testing, keyboard navigation
- **Integration**: axe-core integration in tests

## 🌍 Internationalization

### i18n Setup

- **@nuxtjs/i18n**: Nuxt i18n module
- **Locale Files**: JSON-based translation files
- **Dynamic Loading**: Lazy-loaded locale files
- **Pluralization**: Number formatting support

### Supported Languages

- **English (en)**: Default language
- **Russian (ru)**: Full translation coverage

### Usage

```vue
<template>
  <h1>{{ $t('welcome.title') }}</h1>
  <p>{{ $t('property.count', { count: items.length }) }}</p>
</template>
```

## 🚀 Deployment

### GitHub Pages Deployment

The application is configured for static site generation and can be deployed to GitHub Pages.

#### Automatic Deployment

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Select "GitHub Actions" as source

2. **Push to main branch** - deployment happens automatically via GitHub Actions

3. **Access your site** at `https://your-username.github.io/repository-name/`

#### Manual Deployment

```bash
# Generate static files
bun run generate

# Preview locally
bun run preview

# Deploy .output/public to any static hosting
```

### Build Process

```bash
# Development
bun run dev

# Production build (SSR)
bun run build

# Static generation (SSG)
bun run generate

# Preview static build
bun run preview
```

### Environment Variables

```env
# Base URL for GitHub Pages (auto-set in CI)
NUXT_PUBLIC_BASE_URL=/

# MSW Configuration
NUXT_PUBLIC_MSW_ENABLED=true

# Analytics (optional)
NUXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID
```

### Deployment Options

- **GitHub Pages**: Automated static site hosting (recommended)
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **Node.js**: Server-side rendering
- **Docker**: Containerized deployment
```

## 🤝 Contributing

### Development Guidelines

1. **Follow TDD**: Write tests before implementation
2. **Use conventional commits**: `feat:`, `fix:`, `docs:`, etc.
3. **Maintain code quality**: Run `bun run quality` before committing
4. **Update documentation**: Keep README and stories current
5. **Accessibility first**: Ensure all features are accessible

### Commit Convention

```bash
feat: add new property filtering feature
fix: resolve mobile layout issue
docs: update API documentation
style: format code with prettier
refactor: simplify component logic
test: add unit tests for property store
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `main`
2. Implement feature with tests
3. Ensure all quality checks pass
4. Update documentation if needed
5. Create pull request with description
6. Wait for review and approval

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nuxt 3](https://nuxt.com/) - The framework powering this application
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [PT Root UI](https://www.paratype.com/fonts/pt/pt-root-ui) - Custom typography
- [Bun](https://bun.sh/) - Fast JavaScript runtime

---

Built with ❤️ using modern web technologies
