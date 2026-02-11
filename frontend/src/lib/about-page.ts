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
