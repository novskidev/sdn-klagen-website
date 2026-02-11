# Tentang Kami Page (Sanity) Design

## Goal
Make the Tentang Kami page editable in Sanity while keeping Astro SSG performance and safe fallbacks.

## Constraints
- Frontend: Astro in `frontend/`
- CMS: Sanity Studio in `studio-sdn-klagen-website/`
- Content should render at build time (SSG)
- Must handle missing data safely

## Content Model (Singleton)
Create one document type: `aboutPage`.

### Hero
- `heroBadge` (string)
- `heroTitle` (string)
- `heroSubtitle` (text)
- `heroImage` (image)
- `heroImageTitle` (string)
- `heroImageSubtitle` (string)
- `heroImageAlt` (string)

### Highlight Card
- `highlightTitle` (string)
- `highlightBody` (text)

### Timeline
- `timelineTitle` (string)
- `timelineItems` (array of objects):
  - `title` (string)
  - `description` (text)

### Pahlawan Sekolah (Guru/Staf)
- `heroesTitle` (string)
- `heroesSubtitle` (text, optional)
- `heroes` (array of objects):
  - `name` (string)
  - `role` (string)
  - `photo` (image)

## Data Flow
- `frontend/src/lib/about-page.ts`:
  - Query `*[_type == "aboutPage"][0]`
  - Normalize with fallback defaults
- `frontend/src/pages/tentang-kami.astro`:
  - Fetch `aboutPage` via `getSanityClient()`
  - Render all sections from Sanity data
  - Use `getImageUrl()` for images

## Error Handling
- Fallback defaults for all key text
- Empty arrays handled safely
- If `heroes` empty, hide section
- If image missing, fallback to existing static image

## Testing
- Add unit tests for `normalizeAboutPage()`
- Run `bun run test` in `frontend/`
- Verify `astro build` succeeds

## Rollout
1. Add schema `aboutPage` to Sanity
2. Implement `about-page.ts` helper
3. Wire `tentang-kami.astro`
4. Create `aboutPage` document and publish
