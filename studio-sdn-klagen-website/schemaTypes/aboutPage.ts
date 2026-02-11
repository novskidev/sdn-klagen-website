import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "heroBadge", title: "Hero Badge", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroImageTitle", title: "Hero Image Title", type: "string" }),
    defineField({ name: "heroImageSubtitle", title: "Hero Image Subtitle", type: "string" }),
    defineField({ name: "heroImageAlt", title: "Hero Image Alt", type: "string" }),

    defineField({ name: "highlightTitle", title: "Highlight Title", type: "string" }),
    defineField({ name: "highlightBody", title: "Highlight Body", type: "text" }),

    defineField({ name: "timelineTitle", title: "Timeline Title", type: "string" }),
    defineField({
      name: "timelineItems",
      title: "Timeline Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
        },
      ],
    }),

    defineField({ name: "heroesTitle", title: "Heroes Title", type: "string" }),
    defineField({ name: "heroesSubtitle", title: "Heroes Subtitle", type: "text" }),
    defineField({
      name: "heroes",
      title: "Heroes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
          ],
        },
      ],
    }),
  ],
});
