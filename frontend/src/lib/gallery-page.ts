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

export type GalleryCategory = "ekstrakurikuler" | "seni" | "pembelajaran" | "pengumuman";

export type GalleryItem = {
  title: string;
  description: string;
  category: GalleryCategory;
  image?: unknown;
  imageAlt: string;
  metaLabel?: string;
  icon?: string;
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
  galleryItems: GalleryItem[];
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
  galleryItems: [
    {
      title: "Kelas 3A Menang Bola",
      description: "Tim kelas 3A meraih juara pada pertandingan persahabatan antar kelas.",
      category: "ekstrakurikuler",
      image: undefined,
      imageAlt: "Siswa bermain sepak bola di lapangan",
      metaLabel: "12 Okt 2023",
      icon: "sports_soccer",
    },
    {
      title: "Roket Saya",
      description: "Karya eksperimen sederhana siswa kelas 2 pada proyek sains minggu ini.",
      category: "pembelajaran",
      image: undefined,
      imageAlt: "Gambar roket karya siswa",
      metaLabel: "Oleh Ani (Kelas 2)",
      icon: "rocket_launch",
    },
    {
      title: "Pemenang Sains",
      description: "Kelompok 4 meraih nilai tertinggi pada presentasi eksperimen kelas.",
      category: "pembelajaran",
      image: undefined,
      imageAlt: "Penghargaan kegiatan sains siswa",
      metaLabel: "Kelompok 4",
      icon: "science",
    },
    {
      title: "Apel Pagi",
      description: "Siswa mengikuti apel pagi bersama guru sebelum kegiatan belajar dimulai.",
      category: "ekstrakurikuler",
      image: undefined,
      imageAlt: "Siswa mengikuti apel pagi",
      metaLabel: "Kegiatan rutin",
      icon: "groups",
    },
    {
      title: "Jangan Lupa",
      description: "Jumat depan adalah Hari Piyama. Pakai piyama ternyamanmu ke sekolah.",
      category: "pengumuman",
      image: undefined,
      imageAlt: "Pengumuman kegiatan sekolah",
      metaLabel: "Info Sekolah",
      icon: "campaign",
    },
    {
      title: "Kebunku",
      description: "Karya seni siswa kelas 4 pada tema lingkungan dan kreativitas.",
      category: "seni",
      image: undefined,
      imageAlt: "Lukisan taman karya siswa",
      metaLabel: "Oleh Sarah",
      icon: "palette",
    },
    {
      title: "Pelari Tercepat",
      description: "Penghargaan untuk siswa dengan catatan waktu terbaik Hari Olahraga.",
      category: "ekstrakurikuler",
      image: undefined,
      imageAlt: "Penghargaan kegiatan olahraga",
      metaLabel: "Hari Olahraga 2023",
      icon: "directions_run",
    },
  ],
};

export function normalizeGalleryPage(input: Partial<GalleryPageData> | null | undefined): GalleryPageData {
  return { ...DEFAULTS, ...(input ?? {}) };
}

export async function fetchGalleryPage(client: { fetch: (query: string) => Promise<GalleryPageData | null> }) {
  const data = await client.fetch(GALLERY_PAGE_QUERY);
  return normalizeGalleryPage(data);
}
