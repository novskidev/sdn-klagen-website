import type { APIRoute } from "astro";

export const prerender = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function normalizeInput(rawValue: unknown, maxLength: number) {
  return String(rawValue ?? "")
    .trim()
    .slice(0, maxLength);
}

export const POST: APIRoute = async ({ request }) => {
  const projectId = import.meta.env.SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
  const dataset = import.meta.env.SANITY_DATASET ?? process.env.SANITY_DATASET;
  const apiVersion = import.meta.env.SANITY_API_VERSION ?? process.env.SANITY_API_VERSION ?? "2024-06-01";
  const token = import.meta.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    return jsonResponse(500, {
      ok: false,
      message: "Sanity env belum lengkap (cek SANITY_WRITE_TOKEN, PROJECT_ID, DATASET).",
    });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse(400, { ok: false, message: "Payload tidak valid" });
  }

  if (normalizeInput(payload.website, 200)) {
    return jsonResponse(200, { ok: true });
  }

  const name = normalizeInput(payload.name, 80);
  const email = normalizeInput(payload.email, 120).toLowerCase();
  const message = normalizeInput(payload.message, 2000);

  if (name.length < 2) {
    return jsonResponse(400, { ok: false, message: "Nama minimal 2 karakter" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse(400, { ok: false, message: "Email tidak valid" });
  }

  if (message.length < 10) {
    return jsonResponse(400, { ok: false, message: "Pesan minimal 10 karakter" });
  }

  const sanityUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const mutationPayload = {
    mutations: [
      {
        create: {
          _type: "contactMessage",
          submittedAt: new Date().toISOString(),
          name,
          email,
          message,
          status: "new",
        },
      },
    ],
  };

  const sanityResponse = await fetch(sanityUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mutationPayload),
  });

  if (!sanityResponse.ok) {
    const errorText = await sanityResponse.text();
    return jsonResponse(502, {
      ok: false,
      message: "Gagal menyimpan pesan ke Sanity",
      detail: errorText.slice(0, 400),
    });
  }

  return jsonResponse(200, {
    ok: true,
    message: "Pesan berhasil dikirim",
  });
};

export const ALL: APIRoute = async () => {
  return jsonResponse(405, { ok: false, message: "Method not allowed" });
};
