export type FeaturedActivity = {
  badgeLabel: string;
  title: string;
  highlightedText?: string;
  description: string;
  tags: string[];
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  image?: unknown;
  imageAlt: string;
};

export type GalleryPageData = {
  featuredBadgeLabel: string;
  featuredTitle: string;
  featuredDescription: string;
  featuredActivities: FeaturedActivity[];
  activitiesTitle: string;
  activitiesSubtitle: string;
  filterAllLabel: string;
  filterExtracurricularLabel: string;
  filterArtsLabel: string;
  filterLearningLabel: string;
  filterAnnouncementsLabel: string;
};

export const GALLERY_PAGE_QUERY = `*[_type == "galleryPage"][0]`;

const DEFAULTS: GalleryPageData = {
  featuredBadgeLabel: "Kegiatan SDN Klagen 1",
  featuredTitle: "Rangkaian Kegiatan Siswa SDN Klagen 1",
  featuredDescription:
    "Geser untuk melihat kegiatan siswa-siswi SDN Klagen 1 yang membangun kebaikan, kreativitas, dan kerja sama di sekolah.",
  featuredActivities: [
    {
      badgeLabel: "Kegiatan Minggu Ini",
      title: "Pekan Aktif",
      highlightedText: "Siswa SDN Klagen 1",
      description:
        "Minggu ini siswa mengikuti kegiatan Pramuka, kelas seni, dan kerja bakti. Setiap kegiatan dirancang untuk melatih disiplin, kreativitas, dan kebersamaan.",
      tags: ["Pramuka", "Seni", "Kerja Bakti"],
      primaryButtonLabel: "Lihat Kegiatan",
      secondaryButtonLabel: "Lihat Jadwal",
      image: undefined,
      imageAlt: "Siswa mengikuti kegiatan sekolah bersama",
    },
    {
      badgeLabel: "Kelas Seni",
      title: "Workshop",
      highlightedText: "Seni Kolaboratif",
      description:
        "Siswa berlatih teknik menggambar, membuat poster kelas, dan memamerkan karya bersama sebagai bagian dari program kreativitas sekolah.",
      tags: ["Melukis", "Seni Rupa", "Pameran Karya"],
      primaryButtonLabel: "Lihat Kegiatan",
      secondaryButtonLabel: "Lihat Jadwal",
      image: undefined,
      imageAlt: "Siswa menampilkan hasil kegiatan kelas seni",
    },
    {
      badgeLabel: "Klub Robotik",
      title: "Latihan",
      highlightedText: "Ekstrakurikuler Robotik",
      description:
        "Siswa mempraktikkan logika, perakitan dasar, dan kerja tim dalam sesi robotik mingguan untuk menyiapkan proyek inovasi sekolah.",
      tags: ["Teknologi", "Ekskul", "Proyek Tim"],
      primaryButtonLabel: "Lihat Kegiatan",
      secondaryButtonLabel: "Lihat Jadwal",
      image: undefined,
      imageAlt: "Siswa mempresentasikan kegiatan klub robotik",
    },
  ],
  activitiesTitle: "Kegiatan & Aktivitas SDN Klagen 1",
  activitiesSubtitle: "Lihat kegiatan pembelajaran, ekstrakurikuler, dan program sekolah minggu ini.",
  filterAllLabel: "Semua",
  filterExtracurricularLabel: "Ekstrakurikuler",
  filterArtsLabel: "Seni",
  filterLearningLabel: "Pembelajaran",
  filterAnnouncementsLabel: "Pengumuman",
};

export function normalizeGalleryPage(input: Partial<GalleryPageData> | null | undefined): GalleryPageData {
  return { ...DEFAULTS, ...(input ?? {}) };
}

export async function fetchGalleryPage(client: { fetch: (query: string) => Promise<GalleryPageData | null> }) {
  const data = await client.fetch(GALLERY_PAGE_QUERY);
  return normalizeGalleryPage(data);
}
