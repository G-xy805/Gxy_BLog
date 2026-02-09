# AGENTS.md

This file contains guidelines and conventions for agentic coding agents working in this repository.

## Project Overview

This is **Gxy' Blog**, a modern static blog built with Astro 5.0+, featuring:
- Astro 5.16.3 with TypeScript
- Tailwind CSS 3.4.17 for styling  
- Svelte 5.45.2 for interactive components
- Biome for linting and formatting
- pnpm as package manager

## Build & Development Commands

### Core Commands
```bash
# Development
pnpm dev                  # Start dev server (localhost:4321)
pnpm start                # Alias for pnpm dev

# Building & Production
pnpm build                # Build for production + pagefind indexing
pnpm preview              # Preview production build

# Code Quality
pnpm check                # Run Astro type checking
pnpm type-check          # TypeScript type checking (tsc --noEmit)
pnpm lint                 # Run Biome linter with auto-fix
pnpm format              # Format code with Biome

# Utilities
pnpm new-post            # Create new blog post
pnpm astro [command]      # Run Astro CLI commands
pnpm index:meili         # Index content to Meilisearch
```

### Single Test/Build Commands
- **Type checking**: `pnpm type-check` (preferred over `pnpm check` for pure TypeScript issues)
- **Linting**: `pnpm lint` (includes auto-fix)
- **Formatting**: `pnpm format` (writes formatted files)

## Code Style Guidelines

### Import/Export Patterns
- Use absolute imports with path aliases defined in `tsconfig.json`:
  ```typescript
  import { siteConfig } from "@/config/siteConfig";
  import type { CollectionEntry } from "astro:content";
  import { formatDateToYYYYMMDD } from "@/utils/date-utils";
  import Icon from "@iconify/svelte";
  ```
- Type imports use `import type` for pure types
- Component imports: Astro components use `.astro` extension, Svelte components use `.svelte`

### File Naming Conventions
- **Components**: PascalCase (e.g., `PostCard.astro`, `LightDarkSwitch.svelte`)
- **Utilities**: kebab-case (e.g., `date-utils.ts`, `url-utils.ts`)
- **Config files**: camelCase with Config suffix (e.g., `siteConfig.ts`, `profileConfig.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `constants.ts` with `DARK_MODE`, `LIGHT_MODE`)

### TypeScript Patterns
- **Strict mode enabled**: All TypeScript files use strict null checks
- **Function declarations**: Use function declarations for utilities, arrow functions for components
- **Type definitions**: Centralized in `src/types/`
- **Interface over type**: Prefer `interface` for object shapes, `type` for unions/primitives

### Astro Component Patterns
```astro
---
import type { CollectionEntry } from "astro:content";
import { formatDateToYYYYMMDD } from "@/utils/date-utils";

interface Props {
  class?: string;
  entry: CollectionEntry<"posts">;
  title: string;
  // ... other props
}
const { entry, title, class: className } = Astro.props;

// Processing logic here
const hasCover = image !== undefined && image !== null && image !== "";
const { remarkPluginFrontmatter } = await render(entry);
---

<!-- HTML content with Tailwind classes -->
<div class:list={[
  "card-base post-card flex flex-col w-full",
  className,
]}>
```

### Svelte Component Patterns
```svelte
<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { theme } from "@/stores/settingsStore";

// Reactive statements
$: formattedDate = formatDateI18n(date);

// Lifecycle
onMount(() => {
  // initialization
});

onDestroy(() => {
  // cleanup
});
</script>

<!-- HTML with event handlers -->
<button on:click={handleClick} class="btn-primary">
  {#if condition}
    <Icon icon="ri:sun-line" />
  {/if}
</button>
```

### Error Handling
- **Astro components**: Use `try/catch` for async operations, display error boundaries gracefully
- **Svelte components**: Handle errors in reactive statements, provide fallback UI
- **Utils functions**: Return proper types, throw meaningful errors for invalid inputs
- **No error suppression**: Never use empty catch blocks or type assertions to bypass errors

### CSS & Styling
- **Utility-first**: Use Tailwind CSS classes extensively
- **Component variants**: Use `class:list` directive for conditional classes
- **Dark mode**: Use `[data-theme='dark']` selector for theme-specific styles
- **Custom CSS variables**: Define in Tailwind config as color aliases
- **Responsive design**: Mobile-first approach with `md:`, `lg:` breakpoints

### Content Structure
- **Blog posts**: Located in `src/content/posts/` with frontmatter
- **Frontmatter format**:
  ```yaml
  ---
  title: Article Title
  description: Article description
  published: 2026-01-30
  category: Technology
  tags:
    - tag1
    - tag2
  cover: /assets/images/posts/cover.webp  # optional
  ---
  ```
- **Content collections**: Use Astro content collections for type safety

## Development Workflow

### Before Making Changes
1. Run `pnpm type-check` to ensure type safety
2. Run `pnpm lint` to check code quality
3. Check existing patterns in similar components

### Component Organization
Components are organized by function:
- `layout/` - Page layouts and structure
- `content/` - Content display components  
- `interactive/` - User interaction components
- `common/` - Reusable UI components
- `widget/` - Sidebar and widget components
- `misc/` - Utility and helper components

### Configuration Management
- **Site settings**: `src/config/siteConfig.ts` (main configuration)
- **Feature configs**: Separate files in `src/config/` for different features
- **Environment variables**: Use `import.meta.env` for runtime config

### Path Aliases (from tsconfig.json)
- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@config/*` → `src/config/*`
- `@constants/*` → `src/constants/*`
- `@layouts/*` → `src/layouts/*`
- `@/*` → `src/*`

## Code Quality Standards

### Biome Configuration
- **Formatter**: Uses tab indentation, double quotes for JavaScript
- **Linter**: Strict rules with style enforcement
- **Overrides**: Relaxed rules for `.svelte`, `.astro`, `.vue` files (no unused variables/imports)
- **Auto-imports**: Organizes imports automatically

### Git Hooks & CI/CD
- **Build check**: Runs on Node.js 22 & 23 in CI
- **Code quality**: Biome CI check in GitHub Actions
- **Type safety**: Astro check before deployment
- **Build verification**: Must pass production build

### Performance Considerations
- **Image optimization**: Use `OptimizedImage` component with lazy loading
- **Code splitting**: Astro automatically splits routes
- **CSS purging**: Tailwind CSS purges unused styles in production
- **Bundle analysis**: Monitor build output for bundle size

## Testing & Deployment

### Pre-deployment Checklist
1. `pnpm type-check` passes without errors
2. `pnpm lint` passes without errors  
3. `pnpm build` completes successfully
4. Manual testing of key functionality

### Deployment Config
- **Platform**: Vercel (configured in `vercel.json`)
- **Build command**: `pnpm build`
- **Output directory**: `dist`
- **Headers**: Security headers and cache policies configured
- **Clean URLs**: Enabled

## Tools & Integrations

### Key Dependencies
- **Astro ecosystem**: `@astrojs/*` packages for integrations
- **Markdown enhancements**: KaTeX for math, Expressive Code for syntax highlighting
- **Icons**: Astro Icon + Iconify for comprehensive icon sets
- **Styling**: Tailwind CSS with custom theme colors
- **Interactivity**: Svelte for client-side components, Swup for page transitions

### Development Tools
- **Package manager**: pnpm (enforced via preinstall hook)
- **Linting/Formatting**: Biome (configured in `biome.json`)
- **Type checking**: TypeScript with Astro plugin
- **Build system**: Vite (via Astro)

### Content Features
- **Math support**: KaTeX integration with rehype-katex
- **Code highlighting**: Expressive Code with custom themes and plugins
- **Diagrams**: Mermaid support via custom remark/rehype plugins
- **Search**: Pagefind for static site search
- **Comments**: Multiple comment systems supported (Waline, Twikoo, Giscus, etc.)

## Common Patterns to Follow

### Component Props
- Use TypeScript interfaces for prop definitions
- Provide optional props where reasonable
- Destructure props at component top level
- Use `class?: string` for additional CSS classes

### State Management
- **Svelte stores**: Use for global state (`settingsStore.ts`)
- **Local component state**: Use Svelte reactive declarations
- **Props drilling**: Prefer props over complex state when possible

### Utility Functions
- **Pure functions**: Prefer pure utility functions in `src/utils/`
- **Date handling**: Use provided date utilities for consistency
- **URL generation**: Use URL utilities for internal links
- **Error boundaries**: Implement error boundaries where appropriate

### Accessibility
- Use semantic HTML elements
- Provide ARIA labels for interactive elements
- Ensure keyboard navigation support
- Use appropriate color contrast ratios

This guide should help maintain consistency and quality across all contributions to this codebase.