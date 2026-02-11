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
    useCdn: !import.meta.env.DEV,
  };
}

export function getSanityClient() {
  return createClient(buildSanityConfig(import.meta.env));
}

type SanityImageSource = {
  asset?: {
    _ref?: string;
  };
};

export function getImageUrl(source: SanityImageSource | null | undefined, env: SanityEnv = import.meta.env) {
  if (!source?.asset?._ref) {
    return undefined;
  }

  const config = buildSanityConfig(env);
  const match = source.asset._ref.match(/^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-(\w+)$/);

  if (!match) {
    return undefined;
  }

  const [, id, width, height, format] = match;
  return `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${id}-${width}x${height}.${format}`;
}
