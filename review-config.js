(function () {
  const basePath = new URL(".", document.currentScript.src).pathname.replace(/\/$/u, "");
  globalThis.JSM_REVIEW_CONFIG = { mode: "review", basePath, commit: "488b7e8" };
})();
