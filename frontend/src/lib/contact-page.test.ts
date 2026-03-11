import { describe, expect, it } from "vitest";
import { CONTACT_PAGE_QUERY, fetchContactPage, normalizeContactPage } from "./contact-page";

describe("normalizeContactPage", () => {
  it("fills defaults when input is null", () => {
    const data = normalizeContactPage(null);

    expect(data.schoolName).toBe("SDN Klagen 1");
    expect(data.heroTitleHighlight).toBe("Sekolah!");
    expect(data.submitLabel).toBe("Kirim Surat");
  });

  it("overrides defaults with provided values", () => {
    const data = normalizeContactPage({
      heroTitle: "Hubungi",
      heroTitleHighlight: "Kami",
      phoneNumber: "0812-1111-2222",
      submitLabel: "Kirim Pesan",
    });

    expect(data.heroTitle).toBe("Hubungi");
    expect(data.heroTitleHighlight).toBe("Kami");
    expect(data.phoneNumber).toBe("0812-1111-2222");
    expect(data.submitLabel).toBe("Kirim Pesan");
    expect(data.locationTitle).toBe("Lokasi Kami");
  });
});

describe("fetchContactPage", () => {
  it("queries sanity and returns normalized data", async () => {
    const queries: string[] = [];
    const client = {
      fetch: async (query: string) => {
        queries.push(query);
        return null;
      },
    };

    const result = await fetchContactPage(client);

    expect(queries[0]).toBe(CONTACT_PAGE_QUERY);
    expect(result.schoolName).toBe("SDN Klagen 1");
  });
});
