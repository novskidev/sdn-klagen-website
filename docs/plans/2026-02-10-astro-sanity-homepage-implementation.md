# Astro + Sanity Homepage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Astro homepage pull content from Sanity at build time with safe fallbacks and Netlify rebuilds on publish.

**Architecture:** Astro SSG fetches a singleton `homepage` document from Sanity via `@sanity/client`. Data is normalized with defaults in a small helper module. Netlify rebuilds are triggered by Sanity webhooks after publish.

**Tech Stack:** Astro, TypeScript, Sanity Studio, GROQ, Netlify

---

### Task 0: Confirm TDD Exceptions For Config/Schema

**Files:**
- Modify: `docs/plans/2026-02-10-astro-sanity-homepage-implementation.md`

**Step 1: Ask for exception approval**
- Confirm with user that Sanity schema files, Astro template wiring, and `.env` are treated as configuration exceptions to TDD (tests still required for new helper logic).

**Step 2: Record approval**
- Add a short note to this plan confirming approval.

**Approval note (2026-02-11):** User approved TDD exceptions for Sanity schema files, Astro template wiring, and `.env` configuration. Tests are still required for helper logic. Also approved plan adjustment to avoid eager `sanityClient` creation at module import time; use a lazy `getSanityClient()` instead.

**Step 3: Commit**
```bash
git add docs/plans/2026-02-10-astro-sanity-homepage-implementation.md
git commit -m "chore: record TDD exceptions for config/schema"
```

---

### Task 1: Add Frontend Test Runner (Config Exception)

**Files:**
- Modify: `frontend/package.json`

**Step 1: Install test dependency**
```bash
cd frontend
bun add -D vitest
```

**Step 2: Add test script**
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test": "vitest run"
}
```

**Step 3: Commit**
```bash
git add frontend/package.json frontend/bun.lock
git commit -m "chore(frontend): add vitest"
```

---

### Task 2: Write Failing Tests For Homepage Normalization

**Files:**
- Create: `frontend/src/lib/homepage.test.ts`

**Step 1: Write failing tests**
```ts
import { describe, expect, it } from "vitest";
import { fetchHomepage, HOMEPAGE_QUERY, normalizeHomepage } from "./homepage";

const defaults = normalizeHomepage(null);

describe("normalizeHomepage", () => {
  it("fills defaults when data is null", () => {
    expect(defaults.heroTitle).toBe("Selamat Datang di SDN Klagen 1");
    expect(defaults.funFactTags).toEqual(["Sains", "Alam"]);
    expect(defaults.announcementEnabled).toBe(true);
  });

  it("overrides defaults with provided fields", () => {
    const result = normalizeHomepage({
      heroTitle: "Judul Baru",
      funFactTags: ["IPA"],
    });

    expect(result.heroTitle).toBe("Judul Baru");
    expect(result.funFactTags).toEqual(["IPA"]);
    // unchanged defaults remain
    expect(result.announcementEnabled).toBe(true);
  });
});

describe("fetchHomepage", () => {
  it("queries sanity and returns normalized data", async () => {
    const queries: string[] = [];
    const client = {
      fetch: async (query: string) => {
        queries.push(query);
        return null;
      },
    };

    const result = await fetchHomepage(client);

    expect(queries[0]).toBe(HOMEPAGE_QUERY);
    expect(result.heroTitle).toBe("Selamat Datang di SDN Klagen 1");
  });
});
```

**Step 2: Run test to verify it fails**
```bash
cd frontend
bun run test
```
Expected: FAIL because `./homepage` does not exist yet.

**Step 3: Commit**
```bash
git add frontend/src/lib/homepage.test.ts
git commit -m "test(frontend): add homepage normalization tests"
```

---

### Task 3: Implement Homepage Normalization (Green)

**Files:**
- Create: `frontend/src/lib/homepage.ts`

**Step 1: Minimal implementation**
```ts
export type HomepageData = {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryUrl: string;
  heroCtaSecondaryLabel: string;
  heroCtaSecondaryUrl: string;
  heroImage?: unknown;
  funFactText: string;
  funFactTags: string[];
  announcementTitle: string;
  announcementText: string;
  announcementCtaLabel: string;
  announcementCtaUrl?: string;
  announcementEnabled: boolean;
};

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]`;

const DEFAULTS: HomepageData = {
  heroTitle: "Selamat Datang di SDN Klagen 1",
  heroSubtitle:
    "Bergabunglah dengan sekolah kami yang penuh warna di mana setiap hari membawa penemuan baru. Kami menumbuhkan rasa ingin tahu, kebaikan, dan kreativitas.",
  heroCtaPrimaryLabel: "Hubungi kami",
  heroCtaPrimaryUrl: "/kontak",
  heroCtaSecondaryLabel: "Tentang Kami",
  heroCtaSecondaryUrl: "/tentang-kami",
  heroImage: undefined,
  funFactText:
    "\"Tahukah kamu bahwa gurita memiliki tiga jantung? Dua memompa darah ke insang, sementara satu yang lebih besar mengalirkan darah ke seluruh tubuh.\"",
  funFactTags: ["Sains", "Alam"],
  announcementTitle: "Pengumuman",
  announcementText: "SPMB SDN Klagen 1 telah dibukaa! Jangan lupa untuk mendaftar.",
  announcementCtaLabel: "Baca Selengkapnya",
  announcementCtaUrl: undefined,
  announcementEnabled: true,
};

export function normalizeHomepage(input: Partial<HomepageData> | null | undefined): HomepageData {
  return { ...DEFAULTS, ...(input ?? {}) };
}

export async function fetchHomepage(client: { fetch: (query: string) => Promise<HomepageData | null> }) {
  const data = await client.fetch(HOMEPAGE_QUERY);
  return normalizeHomepage(data);
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
git add frontend/src/lib/homepage.ts
git commit -m "feat(frontend): add homepage data normalization"
```

---

### Task 4: Write Failing Tests For Sanity Config

**Files:**
- Create: `frontend/src/lib/sanity.test.ts`

**Step 1: Write failing tests**
```ts
import { describe, expect, it } from "vitest";
import { buildSanityConfig } from "./sanity";

const envOk = {
  SANITY_PROJECT_ID: "demo",
  SANITY_DATASET: "production",
  SANITY_API_VERSION: "2024-06-01",
};

describe("buildSanityConfig", () => {
  it("builds config from env", () => {
    const config = buildSanityConfig(envOk);
    expect(config.projectId).toBe("demo");
    expect(config.dataset).toBe("production");
    expect(config.apiVersion).toBe("2024-06-01");
  });

  it("throws when required env missing", () => {
    expect(() => buildSanityConfig({})).toThrow("Missing Sanity env");
  });
});
```

**Step 2: Run test to verify it fails**
```bash
cd frontend
bun run test
```
Expected: FAIL because `./sanity` does not exist yet.

**Step 3: Commit**
```bash
git add frontend/src/lib/sanity.test.ts
git commit -m "test(frontend): add sanity config tests"
```

---

### Task 5: Implement Sanity Client (Green)

**Files:**
- Create: `frontend/src/lib/sanity.ts`
- Modify: `frontend/package.json`

**Step 1: Install dependency**
```bash
cd frontend
bun add @sanity/client
```

**Step 2: Minimal implementation**
```ts
import { createClient } from "@sanity/client";

export type SanityEnv = {
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
};

export function buildSanityConfig(env: SanityEnv) {
  const projectId = env.SANITY_PROJECT_ID;
  const dataset = env.SANITY_DATASET;
  const apiVersion = env.SANITY_API_VERSION ?? "2024-06-01";

  if (!projectId || !dataset) {
    throw new Error("Missing Sanity env");
  }

  return {
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  };
}

export function getSanityClient() {
  return createClient(buildSanityConfig(import.meta.env));
}
```

**Step 3: Run test to verify it passes**
```bash
cd frontend
bun run test
```
Expected: PASS.

**Step 4: Commit**
```bash
git add frontend/package.json frontend/bun.lock frontend/src/lib/sanity.ts
git commit -m "feat(frontend): add sanity client"
```

---

### Task 6: Wire Astro Homepage To Sanity

**Files:**
- Modify: `frontend/src/pages/index.astro`

**Step 1: Update imports and fetch**
```astro
---
import Layout from '../layouts/Layout.astro';
import { getSanityClient } from '../lib/sanity';
import { fetchHomepage } from '../lib/homepage';

const pathname = Astro.url.pathname.replace(/\/$/, '') || '/';
const homepage = await fetchHomepage(getSanityClient());
---
```

**Step 2: Replace static text with `homepage` fields**
- Hero title, subtitle, CTA labels/URLs.
- Fun fact text + tags.
- Announcement title/text/label; hide CTA if label missing.
- Use `homepage.announcementEnabled` to conditionally render announcement block.

**Step 3: Manual verification**
```bash
cd frontend
bun run build
```
Expected: Build succeeds.

**Step 4: Commit**
```bash
git add frontend/src/pages/index.astro
git commit -m "feat(frontend): render homepage from sanity"
```

---

### Task 7: Add Sanity Homepage Schema (Config Exception)

**Files:**
- Create: `studio-sdn-klagen-website/schemaTypes/homepage.ts`
- Modify: `studio-sdn-klagen-website/schemaTypes/index.ts`

**Step 1: Add schema**
```ts
import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text" }),
    defineField({ name: "heroCtaPrimaryLabel", title: "CTA Primary Label", type: "string" }),
    defineField({ name: "heroCtaPrimaryUrl", title: "CTA Primary URL", type: "url" }),
    defineField({ name: "heroCtaSecondaryLabel", title: "CTA Secondary Label", type: "string" }),
    defineField({ name: "heroCtaSecondaryUrl", title: "CTA Secondary URL", type: "url" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "funFactText", title: "Fun Fact Text", type: "text" }),
    defineField({ name: "funFactTags", title: "Fun Fact Tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "announcementTitle", title: "Announcement Title", type: "string" }),
    defineField({ name: "announcementText", title: "Announcement Text", type: "text" }),
    defineField({ name: "announcementCtaLabel", title: "Announcement CTA Label", type: "string" }),
    defineField({ name: "announcementCtaUrl", title: "Announcement CTA URL", type: "url" }),
    defineField({ name: "announcementEnabled", title: "Announcement Enabled", type: "boolean", initialValue: true }),
  ],
});
```

**Step 2: Register schema**
```ts
import { homepage } from "./homepage";

export const schemaTypes = [homepage];
```

**Step 3: Commit**
```bash
git add studio-sdn-klagen-website/schemaTypes/homepage.ts studio-sdn-klagen-website/schemaTypes/index.ts
git commit -m "feat(sanity): add homepage schema"
```

---

### Task 8: Add Frontend Env Example (Config Exception)

**Files:**
- Create: `frontend/.env.example`

**Step 1: Add env template**
```env
SANITY_PROJECT_ID=5zvfrllt
SANITY_DATASET=production
SANITY_API_VERSION=2024-06-01
```

**Step 2: Commit**
```bash
git add frontend/.env.example
git commit -m "docs(frontend): add sanity env example"
```

---

### Task 9: Manual Platform Setup (No Code)

**Step 1: Sanity content**
- Create one `homepage` document in Studio and fill fields.

**Step 2: Netlify env vars**
- Set `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` in Netlify site settings.

**Step 3: Webhook**
- Create Netlify Build Hook.
- Add Sanity webhook (on publish) to call the build hook URL.

**Step 4: Verify**
- Publish in Sanity → Netlify rebuilds → homepage updates.
