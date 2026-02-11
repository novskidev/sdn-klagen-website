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
