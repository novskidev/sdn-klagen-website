import { describe, expect, it } from "vitest";
import { buildSanityConfig } from "./sanity";

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
