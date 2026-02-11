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
