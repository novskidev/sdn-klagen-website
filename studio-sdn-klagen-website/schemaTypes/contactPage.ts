import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "schoolName", title: "School Name", type: "string" }),
    defineField({ name: "schoolTagline", title: "School Tagline", type: "string" }),

    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroTitleHighlight", title: "Hero Title Highlight", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text" }),
    defineField({ name: "mascotImage", title: "Mascot Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "mascotImageAlt", title: "Mascot Image Alt", type: "string" }),
    defineField({ name: "mascotQuote", title: "Mascot Quote", type: "string" }),

    defineField({ name: "phoneLabel", title: "Phone Label", type: "string" }),
    defineField({ name: "phoneNumber", title: "Phone Number", type: "string" }),
    defineField({ name: "openingHoursLabel", title: "Opening Hours Label", type: "string" }),
    defineField({ name: "openingHours", title: "Opening Hours", type: "string" }),

    defineField({ name: "formTitle", title: "Form Title", type: "string" }),
    defineField({ name: "formSubtitle", title: "Form Subtitle", type: "string" }),
    defineField({ name: "nameLabel", title: "Name Label", type: "string" }),
    defineField({ name: "namePlaceholder", title: "Name Placeholder", type: "string" }),
    defineField({ name: "emailLabel", title: "Email Label", type: "string" }),
    defineField({ name: "emailPlaceholder", title: "Email Placeholder", type: "string" }),
    defineField({ name: "messageLabel", title: "Message Label", type: "string" }),
    defineField({ name: "messagePlaceholder", title: "Message Placeholder", type: "string" }),
    defineField({ name: "submitLabel", title: "Submit Label", type: "string" }),

    defineField({ name: "locationTitle", title: "Location Title", type: "string" }),
    defineField({ name: "locationAddress", title: "Location Address", type: "string" }),
    defineField({ name: "mapImage", title: "Map Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "mapImageAlt", title: "Map Image Alt", type: "string" }),
    defineField({ name: "footerCopyright", title: "Footer Copyright", type: "string" }),
  ],
});
