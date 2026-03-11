import { defineField, defineType } from "sanity";

export const contactMessage = defineType({
  name: "contactMessage",
  title: "Contact Messages",
  type: "document",
  fields: [
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 8,
      validation: (Rule) => Rule.required().min(10).max(2000),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Baru", value: "new" },
          { title: "Dibaca", value: "read" },
          { title: "Sudah Dibalas", value: "replied" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare(selection) {
      const { title, subtitle, status, submittedAt } = selection;
      const dateText = submittedAt ? new Date(submittedAt).toLocaleString("id-ID") : "Tanpa waktu";
      return {
        title: `${title ?? "Tanpa nama"} (${status ?? "new"})`,
        subtitle: `${subtitle ?? "-"} • ${dateText}`,
      };
    },
  },
  orderings: [
    {
      title: "Terbaru",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
