const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

function normalizeInput(rawValue, maxLength) {
  return String(rawValue ?? "")
    .trim()
    .slice(0, maxLength);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, message: "Method not allowed" });
  }

  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION || "2024-06-01";
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    return jsonResponse(500, {
      ok: false,
      message: "Sanity env is not configured on server",
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { ok: false, message: "Payload tidak valid" });
  }

  // Honeypot: bots biasanya akan mengisi field ini.
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

  const sanityUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

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
      message: "Gagal menyimpan pesan",
      detail: errorText.slice(0, 500),
    });
  }

  return jsonResponse(200, {
    ok: true,
    message: "Pesan berhasil dikirim",
  });
};
