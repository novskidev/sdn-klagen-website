import { createClient } from "@sanity/client";

export type SanityEnv = {
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
};

export function buildSanityConfig(env: SanityEnv) {
  const projectId = env.SANITY_PROJECT_ID;
  const dataset = env.SANITY_DATASET;
  const apiVersion = env.SANITY_API_VERSION ?? "2024-06-01";

  if (!projectId || !dataset) {
    throw new Error("Missing Sanity env");
  }

  return {
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  };
}

export function getSanityClient() {
  return createClient(buildSanityConfig(import.meta.env));
}
