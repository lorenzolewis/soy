# soy

Lorenzo's personal site: one whiteboard, built with Vite, React, TypeScript and [React Flow](https://reactflow.dev/).

```bash
pnpm install
pnpm dev
```

Content lives in `src/content/content.ts`. The look follows the `whiteboard-design` skill in `.claude/skills/`.

## Tests

Playwright tests drive the built site:

```bash
pnpm exec playwright install chromium   # once
pnpm build
pnpm test
```
