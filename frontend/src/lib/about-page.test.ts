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
