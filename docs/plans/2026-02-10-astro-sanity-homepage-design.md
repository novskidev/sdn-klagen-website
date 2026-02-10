# Astro + Sanity Homepage Integration Design

## Goal
Make the Astro homepage content editable in Sanity while keeping the best UX on Netlify: fast static pages with automatic rebuilds after publish.

## Constraints
- Frontend is Astro in `frontend/`.
- Backend content is Sanity Studio in `studio-sdn-klagen-website/`.
- Deploy target is Netlify.
- Keep initial setup simple and low maintenance.

## Architecture
- Use Astro SSG (build-time fetch) for best performance and SEO.
- Fetch Sanity content during build with `@sanity/client`.
- Trigger Netlify rebuilds using a Sanity webhook on publish.

## Sanity Content Model
Create a singleton document `homepage` with fields:
- `heroTitle` (string)
- `heroSubtitle` (text)
- `heroCtaPrimaryLabel` (string)
- `heroCtaPrimaryUrl` (url)
- `heroCtaSecondaryLabel` (string)
- `heroCtaSecondaryUrl` (url)
- `heroImage` (image, optional)
- `funFactText` (text)
- `funFactTags` (array of string)
- `announcementTitle` (string)
- `announcementText` (text)
- `announcementCtaLabel` (string)
- `announcementCtaUrl` (url)
- `announcementEnabled` (boolean)

## Astro Data Flow
- Add `frontend/src/lib/sanity.ts` with `@sanity/client`.
- Configure env vars: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`.
- In `frontend/src/pages/index.astro`, fetch:
  `*[_type == "homepage"][0]`.
- Replace static text with Sanity fields.
- Provide safe fallbacks when fields are missing.

## Rebuild Automation
- Create a Netlify Build Hook.
- Add Sanity webhook: on publish -> call build hook URL.
- Result: content updates after publish without manual deploy.

## Error Handling
- If no homepage document exists, render fallback text.
- Hide CTA buttons when label or URL is empty.
- Skip tags list when empty.

## Testing Plan
- Local: `astro dev` then create/update homepage in Sanity.
- Build: `astro build` to verify build-time fetch.
- Webhook: publish in Sanity and confirm Netlify rebuild.

## Rollout
- Create schema and content in Sanity Studio.
- Add Astro client and data mapping.
- Configure Netlify env vars and webhook.
- Publish and verify rebuild.
