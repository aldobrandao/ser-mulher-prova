import { dataPath, reviewMode, sitePath } from "./runtime.js?v=488b7e8";

const elements = {
  scope: document.querySelector("#book-scope"),
  day: document.querySelector("#book-day"),
  pages: document.querySelector("#metric-pages"),
  women: document.querySelector("#metric-women"),
  days: document.querySelector("#metric-days"),
  volumes: document.querySelector("#metric-volumes"),
  pageStatus: document.querySelector("#book-page-status"),
  guideInputs: [...document.querySelectorAll("[data-book-guide]")],
  guideStatus: document.querySelector("#book-guides-status"),
  loading: document.querySelector("#book-loading"),
  viewer: document.querySelector("#book-viewer"),
};

let catalog;
let currentScope = "collection";
let currentDay = Number(new URL(location.href).searchParams.get("day")) || 0;
const COMPONENT_TARGETS = new Set(["opening", "reading", "pull-quote-1", "pull-quote-2", "pull-quote-3", "deeper-note", "silence", "reflection", "christ", "prayer", "heart", "truth", "song"]);
const requestedComponent = new URL(location.href).searchParams.get("component") ?? "";
let currentComponent = COMPONENT_TARGETS.has(requestedComponent) ? requestedComponent : "";
const GUIDE_KEYS = ["trim", "bleed", "safe", "binding"];
const requestedGuides = new URL(location.href).searchParams.get("guides")?.split(",") ?? [];
const activeGuides = new Set(requestedGuides.filter((key) => GUIDE_KEYS.includes(key)));
let pagePoll;
let lastPages = 0;
let candidatePages = 0;
let candidatePasses = 0;
let pendingTarget = "";
let navigationAttempts = 0;
const PAGINATION_STABLE_PASSES = 3;

function scopeEntries() {
  return [catalog.collection, ...catalog.volumes, ...catalog.women];
}

function currentSummary() {
  return scopeEntries().find((entry) => entry.id === currentScope) ?? catalog.collection;
}

function sendMetrics(pages = lastPages) {
  const summary = currentSummary();
  window.parent.postMessage({
    type: "jsm-book-metrics",
    scope: summary.id,
    day: currentDay || null,
    component: currentComponent || null,
    label: summary.label,
    pages,
    women: summary.women,
    days: summary.days,
    volumes: summary.volumes,
    closure: summary.hasClosure ? "scene_page" : null,
  }, location.origin);
}

function setPaginationPending() {
  lastPages = 0;
  candidatePages = 0;
  candidatePasses = 0;
  if (!currentSummary().week) {
    const measuredPages = Number(currentSummary().measuredPages);
    lastPages = Number.isFinite(measuredPages) && measuredPages > 0 ? measuredPages : -1;
    elements.pages.textContent = lastPages > 0 ? new Intl.NumberFormat("pt-BR").format(lastPages) : "—";
    elements.pages.dataset.state = "scoped";
    elements.pageStatus.textContent = lastPages > 0
      ? `${new Intl.NumberFormat("pt-BR").format(lastPages)} páginas na última medição integral; a prévia abre páginas sob demanda.`
      : "Selecione uma mulher para obter a contagem exata do recorte paginado.";
    elements.loading.hidden = true;
    sendMetrics(lastPages);
    return;
  }
  elements.pages.textContent = "Contando…";
  elements.pages.dataset.state = "loading";
  elements.pageStatus.textContent = "Montando a página fixa de 160 × 230 mm; a diagramação não muda com a largura da tela.";
  elements.loading.hidden = false;
  elements.loading.textContent = "Montando a prévia do impresso…";
  sendMetrics(0);
}

function setFinalPageCount(pages) {
  clearInterval(pagePoll);
  pagePoll = undefined;
  if (lastPages === pages && elements.pages.dataset.state === "ready") return;
  lastPages = pages;
  elements.pages.textContent = new Intl.NumberFormat("pt-BR").format(pages);
  elements.pages.dataset.state = "ready";
  elements.pageStatus.textContent = `${new Intl.NumberFormat("pt-BR").format(pages)} páginas neste recorte.`;
  elements.loading.hidden = true;
  sendMetrics(pages);
}

function installViewerSkin(viewerDocument) {
  if (!viewerDocument.querySelector("#jsm-viewer-skin")) {
    const stylesheet = viewerDocument.createElement("link");
    stylesheet.id = "jsm-viewer-skin";
    stylesheet.rel = "stylesheet";
    stylesheet.href = sitePath("/dev/viewer.css");
    viewerDocument.head.append(stylesheet);
  }
  viewerDocument.documentElement.dataset.jsmEmbeddedViewer = "true";
  installProductionGuides(viewerDocument);
  const translations = [
    ["First Page", "Primeira página"],
    ["Previous Page", "Página anterior"],
    ["Next Page", "Próxima página"],
    ["Last Page", "Última página"],
    ["Text: Smaller", "Diminuir texto"],
    ["Text: Larger", "Aumentar texto"],
    ["Text: Default Size", "Texto em tamanho padrão"],
    ["Zoom: Out", "Diminuir zoom"],
    ["Zoom: In", "Aumentar zoom"],
    ["Zoom: Actual Size", "Tamanho real"],
    ["Zoom: Fit to Screen", "Ajustar à tela"],
  ];
  viewerDocument.querySelectorAll("[title]").forEach((control) => {
    const match = translations.find(([source]) => control.title.startsWith(source));
    if (!match) return;
    control.title = match[1];
    control.setAttribute("aria-label", match[1]);
    if (match[0] === "Next Page") control.dataset.jsmAction = "next";
  });
  const pageNumber = viewerDocument.querySelector("#vivliostyle-page-number");
  if (pageNumber) pageNumber.setAttribute("aria-label", "Ir para a página");
  const totalPages = viewerDocument.querySelector("#vivliostyle-total-pages");
  if (totalPages) totalPages.setAttribute("aria-label", "Total de páginas");
}

function installProductionGuides(viewerDocument) {
  viewerDocument.documentElement.dataset.jsmProductionGuides = GUIDE_KEYS
    .filter((key) => activeGuides.has(key)).join(" ");
  viewerDocument.querySelectorAll("[data-vivliostyle-page-container]").forEach((container) => {
    const bleedBox = container.querySelector("[data-vivliostyle-bleed-box]");
    if (!bleedBox || bleedBox.querySelector(":scope > .jsm-production-guides")) return;
    const layer = viewerDocument.createElement("div");
    layer.className = "jsm-production-guides";
    layer.setAttribute("aria-hidden", "true");
    for (const guide of GUIDE_KEYS) {
      const marker = viewerDocument.createElement("i");
      marker.className = `jsm-production-guide jsm-production-guide--${guide}`;
      layer.append(marker);
    }
    bleedBox.append(layer);
  });
}

function applyProductionGuides(updateUrl = false) {
  elements.guideInputs.forEach((input) => {
    input.checked = activeGuides.has(input.dataset.bookGuide);
  });
  const enabled = GUIDE_KEYS.filter((key) => activeGuides.has(key));
  elements.guideStatus.textContent = enabled.length
    ? `${enabled.length} ${enabled.length === 1 ? "guia ativa" : "guias ativas"}. A reserva interna de 22 mm acompanha a paridade e ainda não representa o gabarito de furação.`
    : "Guias desligadas. A reserva interna de 22 mm acompanha o lado de encadernação e permanece provisória até o gabarito da gráfica.";
  try {
    const viewerDocument = elements.viewer.contentDocument;
    if (viewerDocument) installProductionGuides(viewerDocument);
  } catch {
    // As guias são reaplicadas quando o visualizador terminar de carregar.
  }
  if (!updateUrl) return;
  const url = new URL(location.href);
  if (enabled.length) url.searchParams.set("guides", enabled.join(","));
  else url.searchParams.delete("guides");
  history.replaceState(null, "", url);
}

function paginationIsComplete(viewerDocument) {
  if (!viewerDocument.body) return false;
  const viewport = viewerDocument.querySelector('[data-vivliostyle-viewer-status]');
  if (viewport?.dataset.vivliostyleViewerStatus !== "complete") return false;
  if (viewerDocument.fonts?.status && viewerDocument.fonts.status !== "loaded") return false;
  return Array.from(viewerDocument.images).every((image) => image.complete);
}

function startPagePolling() {
  clearInterval(pagePoll);
  pagePoll = setInterval(readViewerPageCount, 700);
}

function installPageProgress(viewerDocument) {
  const weekPages = new Map();
  viewerDocument.querySelectorAll("[data-vivliostyle-page-container]").forEach((page) => {
    const day = page.querySelector(".devotional-day[data-week][data-day]");
    if (!day) return;
    const week = Number(day.dataset.week);
    const dayNumber = Number(day.dataset.day);
    const pageIndex = Number(page.dataset.vivliostylePageIndex);
    if (![week, dayNumber, pageIndex].every(Number.isFinite)) return;
    const key = String(week);
    const pages = weekPages.get(key) ?? [];
    pages.push({ page, pageIndex, week, dayNumber });
    weekPages.set(key, pages);
  });

  weekPages.forEach((pages) => {
    pages.sort((left, right) => left.pageIndex - right.pageIndex);
    const journeyTotal = pages.length;
    const dayTotals = new Map();
    pages.forEach(({ dayNumber }) => dayTotals.set(dayNumber, (dayTotals.get(dayNumber) ?? 0) + 1));
    const dayOrdinals = new Map();

    pages.forEach(({ page, dayNumber }, index) => {
      const journeyOrdinal = index + 1;
      const journeyPercent = Math.round((journeyOrdinal / journeyTotal) * 10000) / 100;
      const dayOrdinal = (dayOrdinals.get(dayNumber) ?? 0) + 1;
      dayOrdinals.set(dayNumber, dayOrdinal);
      const dayTotal = dayTotals.get(dayNumber) ?? 1;
      const dayFill = Math.round((dayOrdinal / dayTotal) * 10000) / 100;
      page.querySelectorAll(".day-page-progress").forEach((tracker) => {
        tracker.dataset.progressPage = String(journeyOrdinal);
        tracker.dataset.progressPages = String(journeyTotal);
        tracker.dataset.progressDayPage = String(dayOrdinal);
        tracker.dataset.progressDayPages = String(dayTotal);
        tracker.dataset.progressPercent = String(Math.round(journeyPercent));
        tracker.setAttribute("aria-label", `Seu percurso: dia ${dayNumber}, página ${dayOrdinal} de ${dayTotal}`);
        tracker.querySelectorAll("[data-progress-day]").forEach((dot) => {
          const dotDay = Number(dot.dataset.progressDay);
          const fill = dotDay < dayNumber ? 100 : dotDay === dayNumber ? dayFill : 0;
          dot.style.setProperty("--progress-fill", `${fill}%`);
          dot.style.backgroundImage = `linear-gradient(90deg, currentColor 0 ${fill}%, transparent ${fill}% 100%)`;
          dot.dataset.progressFill = String(fill);
        });
      });
    });
  });
}

const PAGE_FILLER = {
  pageWidthMm: 166,
  trimTopMm: 3,
  trimHeightMm: 230,
  safeBottomMm: 19,
  expressionHeightMm: 42,
  expressionGapMm: 16,
  specimenMaxWidthMm: 104,
  specimenMaxHeightMm: 58,
  specimenMinHeightMm: 30,
  specimenGapMm: 14,
};

function ensurePageFillerFonts(viewerDocument) {
  const root = viewerDocument.documentElement;
  if (root.dataset.jsmFillerFonts === "ready") return true;
  if (root.dataset.jsmFillerFonts === "loading") return false;
  root.dataset.jsmFillerFonts = "loading";
  Promise.all([
    viewerDocument.fonts.load('400 25pt "JSM Glendora Filler"', "Se Expresse Livremente"),
    viewerDocument.fonts.load('500 7.5pt "JSM Poppins Filler"', "ESTE ESPAÇO É SEU."),
  ]).then(([glendora, poppins]) => {
    if (glendora.length === 0 || poppins.length === 0) throw new Error("Fontes dos preenchimentos não carregadas.");
    root.dataset.jsmFillerFonts = "ready";
    delete root.dataset.jsmFillersInstalled;
  }).catch(() => {
    delete root.dataset.jsmFillerFonts;
  });
  return false;
}

function measureHiddenPage(page, callback) {
  const originalStyle = page.getAttribute("style") ?? "";
  const wasHidden = getComputedStyle(page).display === "none";
  if (wasHidden) {
    page.style.display = "block";
    page.style.position = "absolute";
    page.style.left = "-100000px";
    page.style.top = "0";
  }
  try {
    return callback();
  } finally {
    if (wasHidden) page.setAttribute("style", originalStyle);
  }
}

function installPageFillers(viewerDocument) {
  const root = viewerDocument.documentElement;
  const pages = Array.from(viewerDocument.querySelectorAll("[data-vivliostyle-page-container]"));
  const installedPages = Number(root.dataset.jsmFillersInstalledPages);
  if (root.dataset.jsmFillersInstalled === "true" && installedPages === pages.length) return;
  viewerDocument.querySelectorAll(".jsm-page-filler").forEach((filler) => filler.remove());
  const pageRecords = [];

  pages.forEach((page) => measureHiddenPage(page, () => {
    const day = page.querySelector(".devotional-day[data-week][data-day]");
    const bleedBox = page.querySelector("[data-vivliostyle-bleed-box]");
    if (!day || !bleedBox) return;
    const week = Number(day.dataset.week);
    const dayNumber = Number(day.dataset.day);
    if (![week, dayNumber].every(Number.isFinite)) return;
    const pageRect = page.getBoundingClientRect();
    const pageCssWidth = Number.parseFloat(page.style.width);
    const viewportZoom = pageCssWidth > 0 ? pageRect.width / pageCssWidth : 1;
    const scale = pageCssWidth / PAGE_FILLER.pageWidthMm;
    if (![scale, viewportZoom].every(Number.isFinite) || scale <= 0 || viewportZoom <= 0) return;
    const safeBottom = (PAGE_FILLER.trimTopMm + PAGE_FILLER.trimHeightMm - PAGE_FILLER.safeBottomMm) * scale;
    const components = Array.from(page.querySelectorAll(".day-component"));
    const visibleComponents = components.filter((component) => {
      const rect = component.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    const bottom = visibleComponents.reduce((maximum, component) => {
      const rect = component.getBoundingClientRect();
      return Math.max(maximum, (rect.bottom - pageRect.top) / viewportZoom);
    }, 0);
    pageRecords.push({
      page,
      bleedBox,
      day,
      week,
      dayNumber,
      scale,
      safeBottom,
      bottom,
      components: visibleComponents,
      truth: page.querySelector(".component-truth"),
    });
  }));

  const componentKind = (component) => Array.from(component?.classList ?? [])
    .find((className) => className.startsWith("component-")) ?? "";
  pageRecords.forEach((record, index) => {
    const nextRecord = pageRecords[index + 1];
    const lastKind = componentKind(record.components.at(-1));
    const nextKind = componentKind(nextRecord?.components[0]);
    record.continuesOnNext = Boolean(
      nextRecord
      && nextRecord.week === record.week
      && nextRecord.dayNumber === record.dayNumber
      && lastKind
      && lastKind === nextKind,
    );
  });

  const specimenDays = new Map();
  pageRecords.forEach((record) => {
    const asset = record.day.dataset.specimenAsset;
    if (!asset || record.dayNumber >= 7 || record.continuesOnNext) return;
    const available = record.safeBottom - record.bottom - PAGE_FILLER.specimenGapMm * record.scale;
    const availableMm = available / record.scale;
    if (availableMm < PAGE_FILLER.specimenMinHeightMm) return;
    const key = `${record.week}-${record.dayNumber}`;
    const truthIsAlone = record.truth && record.components.length === 1 && record.components[0] === record.truth;
    const priority = availableMm + (truthIsAlone ? 1000 : 0);
    const current = specimenDays.get(key);
    if (!current || priority > current.priority) specimenDays.set(key, { ...record, asset, availableMm, priority });
  });

  const representedWeeks = new Set(Array.from(specimenDays.values(), (record) => record.week));
  const emblemWeeks = new Map();
  pageRecords.forEach((record) => {
    const asset = record.day.dataset.fillerEmblem;
    if (!asset || record.dayNumber >= 7 || representedWeeks.has(record.week) || record.continuesOnNext) return;
    const available = record.safeBottom - record.bottom - PAGE_FILLER.specimenGapMm * record.scale;
    const availableMm = available / record.scale;
    if (availableMm < PAGE_FILLER.specimenMinHeightMm) return;
    const truthIsAlone = record.truth && record.components.length === 1 && record.components[0] === record.truth;
    const priority = availableMm + (truthIsAlone ? 1000 : 0);
    const current = emblemWeeks.get(record.week);
    if (!current || priority > current.priority) {
      const woman = record.day.querySelector(".running-woman")?.textContent?.trim() ?? `semana ${record.week}`;
      emblemWeeks.set(record.week, { ...record, asset, availableMm, priority, fallbackLabel: `emblema de ${woman}` });
    }
  });
  emblemWeeks.forEach((record) => specimenDays.set(`${record.week}-${record.dayNumber}`, record));

  specimenDays.forEach((record) => measureHiddenPage(record.page, () => {
    const heightMm = Math.min(PAGE_FILLER.specimenMaxHeightMm, record.availableMm);
    const overlay = viewerDocument.createElement("figure");
    overlay.className = "day-narrative-specimen jsm-page-filler jsm-page-filler--specimen";
    overlay.dataset.specimenRole = record.day.dataset.specimenRole ?? "object_echo";
    overlay.dataset.specimenLabel = record.fallbackLabel ?? record.day.dataset.specimenLabel ?? "Ilustração narrativa";
    overlay.style.top = `${record.bottom + PAGE_FILLER.specimenGapMm * record.scale}px`;
    overlay.style.width = `${PAGE_FILLER.specimenMaxWidthMm * record.scale}px`;
    overlay.style.height = `${heightMm * record.scale}px`;
    const image = viewerDocument.createElement("img");
    image.src = sitePath(`/${record.asset}`);
    image.alt = "";
    image.decoding = "async";
    overlay.append(image);
    record.bleedBox.append(overlay);
  }));

  const expressionCandidates = new Map();
  pageRecords.forEach((record) => {
    const key = `${record.week}-${record.dayNumber}`;
    const truthIsAlone = record.truth && record.components.length === 1 && record.components[0] === record.truth;
    const specimenRecord = specimenDays.get(key);
    if (
      record.dayNumber >= 7
      || record.day.dataset.expressionEligible !== "true"
      || record.continuesOnNext
    ) return;
    // A ilustração continua tendo prioridade no respiro em que foi encaixada,
    // mas não elimina o convite quando a Verdade para Guardar ocupa sozinha
    // outra página. Fora desse caso, evitamos duplicar os dois preenchimentos
    // no mesmo dia.
    if (specimenRecord?.page === record.page) return;
    if (specimenRecord && !truthIsAlone) return;
    const available = record.safeBottom - record.bottom;
    const required = (PAGE_FILLER.expressionGapMm + PAGE_FILLER.expressionHeightMm) * record.scale;
    if (available < required) return;
    const availableMm = available / record.scale;
    const current = expressionCandidates.get(key);
    const priority = availableMm + (truthIsAlone ? 1000 : 0);
    if (!current || priority > current.priority) {
      expressionCandidates.set(key, { ...record, availableMm, priority });
    }
  });

  const expressionDays = new Set();
  expressionCandidates.forEach((record, key) => measureHiddenPage(record.page, () => {
    const overlay = viewerDocument.createElement("section");
    overlay.className = "reader-expression-space jsm-page-filler jsm-page-filler--expression";
    overlay.setAttribute("aria-label", "Espaço de expressão");
    overlay.innerHTML = `<div class="reader-expression-lockup"><div class="jsm-expression-heading"><img src="${sitePath("/assets/ilustracoes/specimens/oficial/semana-01-sara/raster/sara-editorial-expression-flower-preserved-pack-review-v001.webp")}" alt=""><h2>Se Expresse Livremente</h2></div><p>Este espaço é seu.</p></div>`;
    overlay.style.top = `${record.bottom + PAGE_FILLER.expressionGapMm * record.scale}px`;
    overlay.style.height = `${PAGE_FILLER.expressionHeightMm * record.scale}px`;
    record.bleedBox.append(overlay);
    expressionDays.add(key);
  }));

  root.dataset.jsmFillersInstalled = "true";
  root.dataset.jsmFillersInstalledPages = String(pages.length);
  root.dataset.jsmExpressionFillers = String(expressionDays.size);
  root.dataset.jsmSpecimenFillers = String(specimenDays.size);
}

function navigateViewerToTarget(viewerDocument) {
  if (!pendingTarget) return;
  const target = viewerDocument.getElementById(pendingTarget);
  if (target) {
    const page = target.closest('[data-vivliostyle-page-container]');
    const pageIndex = Number(page?.dataset.vivliostylePageIndex);
    const slider = viewerDocument.querySelector("#vivliostyle-page-slider");
    if (slider && Number.isInteger(pageIndex) && pageIndex >= 0 && Number(slider.value) !== pageIndex + 1) {
      slider.value = String(pageIndex + 1);
      slider.dispatchEvent(new Event("input", { bubbles: true }));
    }
    elements.viewer.dataset.navigationState = "ready";
    pendingTarget = "";
    navigationAttempts = 0;
    return;
  }
  const totalPages = Number(viewerDocument.querySelector("#vivliostyle-total-pages")?.textContent?.trim());
  const nextPage = viewerDocument.querySelector('[data-jsm-action="next"]');
  if (!Number.isFinite(totalPages) || totalPages <= 0) {
    elements.viewer.dataset.navigationState = "waiting-pages";
    return;
  }
  if (!nextPage) {
    elements.viewer.dataset.navigationState = "waiting-control";
    return;
  }
  if (nextPage.hasAttribute("disabled")) {
    elements.viewer.dataset.navigationState = "waiting-page";
    return;
  }
  if (navigationAttempts >= Math.max(totalPages + 8, 64)) {
    elements.viewer.dataset.navigationState = "not-found";
    pendingTarget = "";
    navigationAttempts = 0;
    return;
  }
  navigationAttempts += 1;
  elements.viewer.dataset.navigationAttempt = String(navigationAttempts);
  nextPage.click();
}

function readViewerPageCount() {
  try {
    const viewerDocument = elements.viewer.contentDocument;
    if (!viewerDocument) return;
    installViewerSkin(viewerDocument);
    const counter = viewerDocument.querySelector("#vivliostyle-total-pages");
    const pages = Number(counter?.textContent?.trim());
    if (!Number.isFinite(pages) || pages <= 0) return;
    if (!paginationIsComplete(viewerDocument)) return;
    if (!currentSummary().week) {
      installPageProgress(viewerDocument);
      if (ensurePageFillerFonts(viewerDocument)) installPageFillers(viewerDocument);
      return;
    }
    navigateViewerToTarget(viewerDocument);
    if (pages !== candidatePages) {
      candidatePages = pages;
      candidatePasses = 1;
      if (lastPages > 0 && pages !== lastPages) {
        lastPages = 0;
        elements.pages.textContent = "Confirmando…";
        elements.pages.dataset.state = "loading";
        elements.pageStatus.textContent = "Confirmando a paginação depois de carregar fontes e imagens…";
        sendMetrics(0);
      }
      return;
    }
    candidatePasses += 1;
    if (candidatePasses < PAGINATION_STABLE_PASSES) return;
    installPageProgress(viewerDocument);
    if (!ensurePageFillerFonts(viewerDocument)) return;
    installPageFillers(viewerDocument);
    setFinalPageCount(pages);
  } catch {
    // O contador reaparece quando o visualizador conclui a recomposição.
  }
}

function viewerUrl(scope) {
  const source = reviewMode ? sitePath(`/book/${scope}/index.html`) : sitePath(`/book/index.html?scope=${scope}`);
  const sourceUrl = new URL(source, location.origin);
  const viewerSource = sourceUrl.href.replace(/%(?![0-9A-Fa-f]{2})/gu, "%25").replace(/&/gu, "%26");
  const viewerParameters = [
    `src=${viewerSource}`,
    "bookMode=false",
    "renderAllPages=true",
    "spread=auto",
    "restoreView=false",
    "lng=pt-BR",
  ].filter(Boolean).join("&");
  return `${sitePath("/viewer/")}#${viewerParameters}`;
}

function currentTarget() {
  const week = currentSummary().week;
  if (!week) return "";
  if (currentDay === -1) return `week-${week}-atlas`;
  if (currentDay >= 1 && currentDay <= 7) {
    return currentComponent
      ? currentComponent.startsWith("pull-quote-")
        ? `week-${week}-day-${currentDay}-${currentComponent}`
        : `week-${week}-day-${currentDay}-component-${currentComponent}`
      : `week-${week}-day-${currentDay}`;
  }
  if (currentDay === 8) return `week-${week}-closure`;
  if (currentDay === 9) return `week-${week}-breathing-page`;
  return `week-${week}-opening`;
}

function loadViewer() {
  pendingTarget = currentTarget();
  navigationAttempts = 0;
  elements.viewer.dataset.navigationTarget = pendingTarget;
  elements.viewer.dataset.navigationState = pendingTarget ? "seeking" : "ready";
  elements.viewer.dataset.navigationAttempt = "0";
  elements.viewer.src = viewerUrl(currentScope);
  startPagePolling();
}

function seekCurrentTarget() {
  pendingTarget = currentTarget();
  navigationAttempts = 0;
  elements.viewer.dataset.navigationTarget = pendingTarget;
  elements.viewer.dataset.navigationState = pendingTarget ? "seeking" : "ready";
  elements.viewer.dataset.navigationAttempt = "0";
  readViewerPageCount();
  if (pendingTarget) startPagePolling();
}

function populateDayControl() {
  const summary = currentSummary();
  if (!summary.week) {
    currentDay = 0;
    currentComponent = "";
    elements.day.innerHTML = '<option value="0">Escolha uma mulher para navegar por dia</option>';
    elements.day.disabled = true;
    return;
  }
  const hasClosure = Boolean(summary.hasClosure);
  const hasTransition = summary.week % 10 !== 0;
  const maxDay = hasTransition ? 9 : hasClosure ? 8 : 7;
  if (currentDay < -1 || currentDay > maxDay) currentDay = 0;
  if (currentDay < 1 || currentDay > 7) currentComponent = "";
  elements.day.innerHTML = `<option value="0">Abertura da jornada</option>
    <option value="-1">Percurso da semana</option>
    ${Array.from({ length: 7 }, (_entry, index) => `<option value="${index + 1}">Dia ${String(index + 1).padStart(2, "0")}</option>`).join("")}
    ${hasClosure ? '<option value="8">Encerramento da jornada</option>' : ""}
    ${hasTransition ? '<option value="9">Transição para a próxima jornada</option>' : ""}`;
  elements.day.value = String(currentDay);
  elements.day.disabled = false;
}

function selectScope(scope, updateUrl = true) {
  const previousScope = currentScope;
  const valid = scopeEntries().some((entry) => entry.id === scope);
  currentScope = valid ? scope : "collection";
  if (updateUrl && previousScope !== currentScope) {
    currentDay = 0;
    currentComponent = "";
  }
  const summary = currentSummary();
  elements.scope.value = currentScope;
  populateDayControl();
  elements.women.textContent = String(summary.women);
  elements.days.textContent = String(summary.days);
  elements.volumes.textContent = String(summary.volumes);
  setPaginationPending();
  loadViewer();
  if (updateUrl) {
    const url = new URL(location.href);
    if (currentScope === "collection") url.searchParams.delete("scope");
    else url.searchParams.set("scope", currentScope);
    if (currentDay) url.searchParams.set("day", String(currentDay));
    else url.searchParams.delete("day");
    if (currentComponent) url.searchParams.set("component", currentComponent);
    else url.searchParams.delete("component");
    history.replaceState(null, "", url);
  }
  if (reviewMode) {
    const selectedScope = currentScope;
    setTimeout(() => {
      if (currentScope !== selectedScope || lastPages > 0) return;
      elements.loading.hidden = true;
      elements.pageStatus.textContent = "A contagem continua em segundo plano. A leitura já está disponível.";
    }, 3500);
  }
}

function selectDay(day, updateUrl = true) {
  const value = Number(day);
  const summary = currentSummary();
  const maxDay = summary.week && summary.week % 10 !== 0 ? 9 : summary.hasClosure ? 8 : 7;
  currentDay = value === -1 || (Number.isInteger(value) && value >= 1 && value <= maxDay) ? value : 0;
  currentComponent = "";
  populateDayControl();
  seekCurrentTarget();
  sendMetrics(lastPages);
  if (updateUrl) {
    const url = new URL(location.href);
    if (currentDay) url.searchParams.set("day", String(currentDay));
    else url.searchParams.delete("day");
    url.searchParams.delete("component");
    url.searchParams.delete("closure");
    history.replaceState(null, "", url);
  }
}

function populateScopeControl() {
  const pageLabel = (entry) => entry.measuredPages ? ` · última medição: ${entry.measuredPages} páginas` : "";
  const womanOptions = (volume) => catalog.women.filter((entry) => entry.volume === volume)
    .map((entry) => `<option value="${entry.id}">${entry.label}${pageLabel(entry)}</option>`).join("");
  elements.scope.innerHTML = `
    <option value="collection">Coleção completa · 2 volumes${pageLabel(catalog.collection)}</option>
    <optgroup label="Volumes">
      ${catalog.volumes.map((entry) => `<option value="${entry.id}">${entry.label} · ${entry.days} dias${pageLabel(entry)}</option>`).join("")}
    </optgroup>
    <optgroup label="Mulheres · Volume I">${womanOptions(1)}</optgroup>
    <optgroup label="Mulheres · Volume II">${womanOptions(2)}</optgroup>`;
  elements.scope.disabled = false;
}

elements.scope.addEventListener("change", () => selectScope(elements.scope.value));
elements.day.addEventListener("change", () => selectDay(elements.day.value));
elements.viewer.addEventListener("load", () => {
  startPagePolling();
  readViewerPageCount();
});
elements.guideInputs.forEach((input) => input.addEventListener("change", () => {
  const key = input.dataset.bookGuide;
  if (input.checked) activeGuides.add(key);
  else activeGuides.delete(key);
  applyProductionGuides(true);
}));
applyProductionGuides();

fetch(dataPath("book-catalog"), { cache: "no-store" })
  .then(async (response) => {
    if (!response.ok) throw new Error("Não foi possível carregar a coleção canônica.");
    catalog = await response.json();
    populateScopeControl();
    const requested = new URL(location.href).searchParams.get("scope") ?? "collection";
    selectScope(requested, false);
  })
  .catch((error) => {
    elements.loading.textContent = error.message;
  });
