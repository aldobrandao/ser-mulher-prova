const config = globalThis.JSM_REVIEW_CONFIG ?? {};

export const reviewMode = config.mode === "review";
export const reviewVersion = String(config.commit ?? "");

function versionedReviewPath(value) {
  if (!reviewMode || !reviewVersion) return value;
  const url = new URL(value, location.origin);
  url.searchParams.set("v", reviewVersion);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function sitePath(value) {
  const path = value.startsWith("/") ? value : `/${value}`;
  return versionedReviewPath(`${config.basePath ?? ""}${path}`);
}

export function dataPath(name) {
  return reviewMode ? sitePath(`/data/${name}.json`) : sitePath(`/__${name}`);
}
