import { describe, expect, it } from "vitest";
import { fetchGalleryPage, GALLERY_PAGE_QUERY, normalizeGalleryPage } from "./gallery-page";

describe("normalizeGalleryPage", () => {
  it("fills defaults when data is null", () => {
    const data = normalizeGalleryPage(null);

    expect(data.featuredBadgeLabel).toBe("Kegiatan SDN Klagen 1");
    expect(data.featuredActivities.length).toBeGreaterThan(0);
    expect(data.activitiesTitle).toBe("Kegiatan & Aktivitas SDN Klagen 1");
    expect(data.galleryItems.length).toBeGreaterThan(0);
    expect(data.galleryItems[0]?.category).toBe("ekstrakurikuler");
  });

  it("overrides defaults with provided fields", () => {
    const data = normalizeGalleryPage({
      featuredTitle: "Agenda Sekolah",
      featuredActivities: [
        {
          badgeLabel: "Kegiatan Khusus",
          title: "Kegiatan 1",
          highlightedText: "Siswa SDN Klagen 1",
          description: "Deskripsi",
          tags: ["Tag"],
          primaryButtonLabel: "Detail",
          secondaryButtonLabel: "Jadwal",
          image: undefined,
          imageAlt: "Alt",
        },
      ],
      galleryItems: [
        {
          title: "Kegiatan Baru",
          description: "Deskripsi kegiatan",
          category: "seni",
          image: undefined,
          imageAlt: "Alt",
          metaLabel: "Meta",
          icon: "palette",
        },
      ],
    });

    expect(data.featuredTitle).toBe("Agenda Sekolah");
    expect(data.featuredActivities[0]?.badgeLabel).toBe("Kegiatan Khusus");
    expect(data.activitiesTitle).toBe("Kegiatan & Aktivitas SDN Klagen 1");
    expect(data.galleryItems[0]?.title).toBe("Kegiatan Baru");
    expect(data.galleryItems[0]?.category).toBe("seni");
  });
});

describe("fetchGalleryPage", () => {
  it("queries sanity and returns normalized data", async () => {
    const queries: string[] = [];
    const client = {
      fetch: async (query: string) => {
        queries.push(query);
        return null;
      },
    };

    const result = await fetchGalleryPage(client);

    expect(queries[0]).toBe(GALLERY_PAGE_QUERY);
    expect(result.featuredBadgeLabel).toBe("Kegiatan SDN Klagen 1");
  });
});
