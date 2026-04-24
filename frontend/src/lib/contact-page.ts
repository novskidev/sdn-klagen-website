export type ContactPageData = {
  schoolName: string;
  schoolTagline: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  mascotImage?: unknown;
  mascotImageAlt: string;
  mascotQuote: string;
  phoneLabel: string;
  phoneNumber: string;
  openingHoursLabel: string;
  openingHours: string;
  formTitle: string;
  formSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  locationTitle: string;
  locationAddress: string;
  mapImage?: unknown;
  mapImageAlt: string;
  footerCopyright: string;
};

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]`;

const currentYear = new Date().getFullYear();

const DEFAULTS: ContactPageData = {
  schoolName: "SDN Klagen 1",
  schoolTagline: "Sekolah Dasar Negeri",
  heroTitle: "Kirim Surat ke",
  heroTitleHighlight: "Sekolah!",
  heroSubtitle:
    "Punya pertanyaan atau cerita seru? Tulis di kertas ajaib di samping ini, Pak Pos akan segera mengantarkannya!",
  mascotImage: undefined,
  mascotImageAlt: "Ilustrasi burung hantu pembawa surat",
  mascotQuote: '"Pak Pos Burung Hantu siap antar suratmu!"',
  phoneLabel: "Telepon",
  phoneNumber: "(021) 123-4567",
  openingHoursLabel: "Buka",
  openingHours: "07.00 - 13.00",
  formTitle: "Halo Semuanya!",
  formSubtitle: "Isi formulir ini ya...",
  nameLabel: "Siapa Namamu?",
  namePlaceholder: "Tulis namamu di sini...",
  emailLabel: "Email (Punya Orang Tua)",
  emailPlaceholder: "contoh@email.com",
  messageLabel: "Pesan Untuk Sekolah",
  messagePlaceholder: "Tulis ceritamu di baris ini...",
  submitLabel: "Kirim Surat",
  locationTitle: "Lokasi Kami",
  locationAddress: "Jalan Pendidikan No. 1, Klagen, Indonesia",
  mapImage: undefined,
  mapImageAlt: "Peta lokasi sekolah di Klagen",
  footerCopyright: `© ${currentYear} SDN Klagen 1. Dibuat dengan ❤️ untuk murid-murid hebat.`,
};

export function normalizeContactPage(input: Partial<ContactPageData> | null | undefined): ContactPageData {
  return { ...DEFAULTS, ...(input ?? {}) };
}

export async function fetchContactPage(client: { fetch: (query: string) => Promise<ContactPageData | null> }) {
  const data = await client.fetch(CONTACT_PAGE_QUERY);
  return normalizeContactPage(data);
}
