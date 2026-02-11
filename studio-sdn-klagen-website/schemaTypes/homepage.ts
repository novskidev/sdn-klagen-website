import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text" }),
    defineField({ name: "heroCtaPrimaryLabel", title: "CTA Primary Label", type: "string" }),
    defineField({
      name: "heroCtaPrimaryUrl",
      title: "CTA Primary URL",
      type: "string",
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({ name: "heroCtaSecondaryLabel", title: "CTA Secondary Label", type: "string" }),
    defineField({
      name: "heroCtaSecondaryUrl",
      title: "CTA Secondary URL",
      type: "string",
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "funFactText", title: "Fun Fact Text", type: "text" }),
    defineField({
      name: "funFactTags",
      title: "Fun Fact Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "announcementTitle", title: "Announcement Title", type: "string" }),
    defineField({ name: "announcementText", title: "Announcement Text", type: "text" }),
    defineField({ name: "announcementCtaLabel", title: "Announcement CTA Label", type: "string" }),
    defineField({
      name: "announcementCtaUrl",
      title: "Announcement CTA URL",
      type: "string",
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: "announcementEnabled",
      title: "Announcement Enabled",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
