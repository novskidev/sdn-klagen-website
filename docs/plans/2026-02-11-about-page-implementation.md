# Tentang Kami Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Tentang Kami page editable in Sanity with safe fallbacks and image rendering.

**Architecture:** Add a singleton `aboutPage` schema in Sanity. In Astro, fetch `aboutPage` at build time, normalize with defaults, and render hero, highlight, timeline, and heroes (staff) sections. Images use the existing `getImageUrl()` helper with fallbacks.

**Tech Stack:** Astro, TypeScript, Sanity Studio, GROQ

---

### Task 0: Confirm TDD Exceptions For Config/Wiring

**Files:**
- Modify: `docs/plans/2026-02-11-about-page-implementation.md`

**Step 1: Ask for exception approval**
- Confirm with user that Sanity schema files and Astro template wiring are treated as configuration exceptions to TDD (tests still required for helper logic).

**Step 2: Record approval**
- Add a short note to this plan confirming approval.

**Approval note (2026-02-11):** User approved TDD exceptions for Sanity schema files and Astro template wiring. Tests remain required for helper logic.

**Step 3: Commit**
```bash
git add docs/plans/2026-02-11-about-page-implementation.md
git commit -m "chore: record TDD exceptions for about page"
```

---

### Task 1: Write Failing Tests For About Page Normalization

**Files:**
- Create: `frontend/src/lib/about-page.test.ts`

**Step 1: Write failing tests**
```ts
import { describe, expect, it } from "vitest";
import { normalizeAboutPage, ABOUT_PAGE_QUERY, fetchAboutPage } from "./about-page";

const defaults = normalizeAboutPage(null);

describe("normalizeAboutPage", () => {
  it("fills defaults when data is null", () => {
    expect(defaults.heroTitle).toBe("Petualangan Sekolah Kami");
    expect(defaults.timelineItems.length).toBeGreaterThan(0);
    expect(defaults.heroes.length).toBeGreaterThan(0);
  });

  it("overrides defaults with provided fields", () => {
    const result = normalizeAboutPage({
      heroTitle: "Judul Baru",
      timelineItems: [{ title: "Awal", description: "Mulai" }],
      heroes: [{ name: "A", role: "Kepala Sekolah" }],
    });

    expect(result.heroTitle).toBe("Judul Baru");
    expect(result.timelineItems[0]?.title).toBe("Awal");
    expect(result.heroes[0]?.name).toBe("A");
  });
});

describe("fetchAboutPage", () => {
  it("queries sanity and returns normalized data", async () => {
    const queries: string[] = [];
    const client = {
      fetch: async (query: string) => {
        queries.push(query);
        return null;
      },
    };

    const result = await fetchAboutPage(client);

    expect(queries[0]).toBe(ABOUT_PAGE_QUERY);
    expect(result.heroTitle).toBe("Petualangan Sekolah Kami");
  });
});
```

**Step 2: Run test to verify it fails**
```bash
cd frontend
bun run test
```
Expected: FAIL because `./about-page` does not exist yet.

**Step 3: Commit**
```bash
git add frontend/src/lib/about-page.test.ts
git commit -m "test(frontend): add about page normalization tests"
```

---

### Task 2: Implement About Page Normalization (Green)

**Files:**
- Create: `frontend/src/lib/about-page.ts`

**Step 1: Minimal implementation**
```ts
export type AboutTimelineItem = {
  title: string;
  description: string;
};

export type AboutHero = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: unknown;
  heroImageTitle: string;
  heroImageSubtitle: string;
  heroImageAlt: string;
};

export type AboutHeroPerson = {
  name: string;
  role: string;
  photo?: unknown;
};

export type AboutPageData = AboutHero & {
  highlightTitle: string;
  highlightBody: string;
  timelineTitle: string;
  timelineItems: AboutTimelineItem[];
  heroesTitle: string;
  heroesSubtitle?: string;
  heroes: AboutHeroPerson[];
};

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]`;

const DEFAULTS: AboutPageData = {
  heroBadge: "Mulai Petualangan",
  heroTitle: "Petualangan Sekolah Kami",
  heroSubtitle:
    "Selamat datang di dunia ajaib SDN Klagen 1! Ambil tas ransel dan petamu, kita akan berpetualang untuk menemukan tempat di mana belajar menjadi hidup.",
  heroImage: undefined,
  heroImageTitle: "Kerajaan Ajaib",
  heroImageSubtitle: "Di mana setiap hari adalah cerita baru.",
  heroImageAlt:
    "A vibrant cartoon-style illustration of a happy primary school building surrounded by green trees and blue sky",
  highlightTitle: "Tempat untuk Tumbuh & Bersinar",
  highlightBody:
    "Di SDN Klagen 1, kami percaya setiap anak adalah pahlawan super dalam pelatihan. Misi kami adalah menyediakan lingkungan yang aman, menyenangkan, dan menginspirasi di mana rasa ingin tahu mekar menjadi pengetahuan.",
  timelineTitle: "Ikuti Jejak Kami",
  timelineItems: [
    {
      title: "1995: Awal Mula",
      description:
        "Petualangan kami dimulai hanya dengan dua ruang kelas dan mimpi besar. Seperti benih kecil, kami mulai dari yang kecil tapi dengan potensi yang luar biasa!",
    },
    {
      title: "2010: Perpustakaan Berkembang",
      description:
        "Kami membuka perpustakaan ajaib kami! Rak-rak penuh dengan cerita naga, antariksa, dan sains. Renovasi besar memberi kami ruang untuk terbang.",
    },
    {
      title: "Masa Kini: Kami Sedang Mekar!",
      description:
        "Kini menjadi sekolah unggulan dengan taman bagi pikiran-pikiran muda yang cerdas. Kami digital, kreatif, dan siap menyambut masa depan!",
    },
  ],
  heroesTitle: "Pahlawan Sekolah Kami",
  heroesSubtitle: "Mereka yang menginspirasi dan membimbing setiap hari.",
  heroes: [
    { name: "Ibu Sari", role: "Kepala Sekolah" },
    { name: "Pak Budi", role: "Guru Kelas" },
    { name: "Bu Rani", role: "Guru Bahasa" },
  ],
};

export function normalizeAboutPage(input: Partial<AboutPageData> | null | undefined): AboutPageData {
  return { ...DEFAULTS, ...(input ?? {}) };
}

export async function fetchAboutPage(client: { fetch: (query: string) => Promise<AboutPageData | null> }) {
  const data = await client.fetch(ABOUT_PAGE_QUERY);
  return normalizeAboutPage(data);
}
```

**Step 2: Run test to verify it passes**
```bash
cd frontend
bun run test
```
Expected: PASS.

**Step 3: Commit**
```bash
git add frontend/src/lib/about-page.ts
git commit -m "feat(frontend): add about page data normalization"
```

---

### Task 3: Wire Tentang Kami Page To Sanity

**Files:**
- Modify: `frontend/src/pages/tentang-kami.astro`

**Step 1: Update imports and fetch**
```astro
---
import Layout from '../layouts/Layout.astro';
import { getImageUrl, getSanityClient } from '../lib/sanity';
import { fetchAboutPage } from '../lib/about-page';

const pathname = Astro.url.pathname.replace(/\/$/, '') || '/';
const aboutPage = await fetchAboutPage(getSanityClient());
const heroImageUrl =
  getImageUrl(aboutPage.heroImage) ??
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSCzbCM3PPrcioYR-QBMvhRtZxHCIKsmBl5_pT2JyjWicl9LyyaNhwBYqUtKR3FFvUahp5Q-TXpX8UvJBB5hOwy_7I7wsC88dptXcALPOkDAuIjkRNspS9BDm-Q3oniffJKiqk73K_VeEl_5-9iRZwSE2rQIAMgZiHl7WvA3_nKIddOVdno4ovCDPHLwL-zHh3ILwv63JR2zudY5LNxMHkEDGO8s7oeRP79XezW9lE-vZm0Pryv22jJ8tX-wavPAHWarYYMPw9foU";
---
```

**Step 2: Replace static text with `aboutPage` fields**
- Hero badge/title/subtitle
- Hero overlay title/subtitle + `heroImageAlt`
- Highlight card title/body
- Timeline title + map `aboutPage.timelineItems`
- Add “Pahlawan Sekolah Kami” section with `aboutPage.heroes` (name/role/photo)

**Step 3: Manual verification**
```bash
cd frontend
bun run build
```
Expected: Build succeeds.

**Step 4: Commit**
```bash
git add frontend/src/pages/tentang-kami.astro
git commit -m "feat(frontend): render about page from sanity"
```

---

### Task 4: Add Sanity About Page Schema (Config Exception)

**Files:**
- Create: `studio-sdn-klagen-website/schemaTypes/aboutPage.ts`
- Modify: `studio-sdn-klagen-website/schemaTypes/index.ts`

**Step 1: Add schema**
```ts
import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "heroBadge", title: "Hero Badge", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroImageTitle", title: "Hero Image Title", type: "string" }),
    defineField({ name: "heroImageSubtitle", title: "Hero Image Subtitle", type: "string" }),
    defineField({ name: "heroImageAlt", title: "Hero Image Alt", type: "string" }),

    defineField({ name: "highlightTitle", title: "Highlight Title", type: "string" }),
    defineField({ name: "highlightBody", title: "Highlight Body", type: "text" }),

    defineField({ name: "timelineTitle", title: "Timeline Title", type: "string" }),
    defineField({
      name: "timelineItems",
      title: "Timeline Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
        },
      ],
    }),

    defineField({ name: "heroesTitle", title: "Heroes Title", type: "string" }),
    defineField({ name: "heroesSubtitle", title: "Heroes Subtitle", type: "text" }),
    defineField({
      name: "heroes",
      title: "Heroes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
          ],
        },
      ],
    }),
  ],
});
```

**Step 2: Register schema**
```ts
import { homepage } from "./homepage";
import { aboutPage } from "./aboutPage";

export const schemaTypes = [homepage, aboutPage];
```

**Step 3: Commit**
```bash
git add studio-sdn-klagen-website/schemaTypes/aboutPage.ts studio-sdn-klagen-website/schemaTypes/index.ts
git commit -m "feat(sanity): add about page schema"
```

---

### Task 5: Manual CMS Setup (No Code)

**Step 1: Create content**
- Create one `aboutPage` document in Sanity Studio and fill fields.

**Step 2: Publish and verify**
- Publish then check `/tentang-kami`.
