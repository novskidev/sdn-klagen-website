import { describe, expect, it } from "vitest";
import { buildSanityConfig, getImageUrl } from "./sanity";

const envOk = {
  SANITY_PROJECT_ID: "demo",
  SANITY_DATASET: "production",
  SANITY_API_VERSION: "2024-06-01",
};

describe("buildSanityConfig", () => {
  it("builds config from env", () => {
    const config = buildSanityConfig(envOk);
    expect(config.projectId).toBe("demo");
    expect(config.dataset).toBe("production");
    expect(config.apiVersion).toBe("2024-06-01");
  });

  it("throws when required env missing", () => {
    expect(() => buildSanityConfig({})).toThrow("Missing Sanity env");
  });
});

describe("getImageUrl", () => {
  it("returns undefined when image is missing", () => {
    expect(getImageUrl(null, envOk)).toBeUndefined();
  });

  it("builds a sanity image url", () => {
    const url = getImageUrl(
      {
        asset: {
          _ref: "image-abc123-800x600-png",
        },
      },
      envOk,
    );

    expect(url).toContain("https://cdn.sanity.io/images/demo/production/");
    expect(url).toContain("abc123-800x600.png");
  });
});
