import { defineArrayMember, defineField, defineType } from "sanity";

export const galleryPage = defineType({
  name: "galleryPage",
  title: "Gallery Page",
  type: "document",
  fields: [
    defineField({ name: "featuredBadgeLabel", title: "Featured Badge Label", type: "string" }),
    defineField({ name: "featuredTitle", title: "Featured Title", type: "string" }),
    defineField({ name: "featuredDescription", title: "Featured Description", type: "text" }),
    defineField({
      name: "featuredActivities",
      title: "Featured Activities",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "badgeLabel", title: "Badge Label", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "highlightedText", title: "Highlighted Text", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "tags", title: "Tags", type: "array", of: [defineArrayMember({ type: "string" })] }),
            defineField({ name: "primaryButtonLabel", title: "Primary Button Label", type: "string" }),
            defineField({ name: "secondaryButtonLabel", title: "Secondary Button Label", type: "string" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "imageAlt", title: "Image Alt", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({ name: "activitiesTitle", title: "Activities Title", type: "string" }),
    defineField({ name: "activitiesSubtitle", title: "Activities Subtitle", type: "text" }),
    defineField({ name: "filterAllLabel", title: "Filter All Label", type: "string" }),
    defineField({ name: "filterExtracurricularLabel", title: "Filter Extracurricular Label", type: "string" }),
    defineField({ name: "filterArtsLabel", title: "Filter Arts Label", type: "string" }),
    defineField({ name: "filterLearningLabel", title: "Filter Learning Label", type: "string" }),
    defineField({ name: "filterAnnouncementsLabel", title: "Filter Announcements Label", type: "string" }),
    defineField({
      name: "galleryItems",
      title: "Gallery Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Ekstrakurikuler", value: "ekstrakurikuler" },
                  { title: "Seni", value: "seni" },
                  { title: "Pembelajaran", value: "pembelajaran" },
                  { title: "Pengumuman", value: "pengumuman" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "imageAlt", title: "Image Alt", type: "string" }),
            defineField({ name: "metaLabel", title: "Meta Label", type: "string" }),
            defineField({
              name: "icon",
              title: "Material Icon Name",
              type: "string",
              description: "Contoh: sports_soccer, palette, science, campaign",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "category",
              media: "image",
            },
          },
        }),
      ],
    }),
  ],
});
