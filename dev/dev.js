import { dataPath, reviewMode, reviewVersion, sitePath } from "./runtime.js?v=488b7e8";

const elements = {
  state: document.querySelector("#build-state"),
  stateLabel: document.querySelector("#state-label"),
  rebuild: document.querySelector("#rebuild"),
  viewer: document.querySelector("#audit-viewer"),
  message: document.querySelector("#viewer-message"),
  workspace: document.querySelector("#workspace"),
  viewLibrary: document.querySelector("#view-library"),
  viewSystem: document.querySelector("#view-system"),
  viewBook: document.querySelector("#view-book"),
  viewManagement: document.querySelector("#view-management"),
  contextKicker: document.querySelector("#context-kicker"),
  contextTitle: document.querySelector("#context-title"),
  contextCopy: document.querySelector("#context-copy"),
  auditSteps: document.querySelector("#audit-steps"),
  scopeNote: document.querySelector("#scope-note"),
  projectName: document.querySelector("#project-name"),
  womenCount: document.querySelector("#women-count"),
  daysCount: document.querySelector("#days-count"),
  universalCount: document.querySelector("#universal-count"),
  exceptionCount: document.querySelector("#exception-count"),
  reviewToggle: document.querySelector("#review-toggle"),
  reviewTray: document.querySelector("#review-tray"),
  metricLabel1: document.querySelector("#metric-label-1"),
  metricLabel2: document.querySelector("#metric-label-2"),
  metricLabel3: document.querySelector("#metric-label-3"),
  metricLabel4: document.querySelector("#metric-label-4"),
  glossary: document.querySelector("#desk-glossary-list"),
  bookFocusEntry: document.querySelector("#book-focus-entry"),
  bookFocusExit: document.querySelector("#book-focus-exit"),
};

const views = {
  library: {
    route: sitePath("/dev/concept.html?embed=1#biblioteca"),
    label: "Jornadas das 20 mulheres",
    shortLabel: "Jornadas",
    kicker: "01 · jornadas e conteúdo",
    title: "Explore as vinte jornadas.",
    copy: "Escolha uma mulher para acompanhar sua semana, seus sete dias e as imagens que dão forma ao percurso.",
    scope: "Cada jornada reúne narrativa, direção visual e aplicação no livro em um único percurso de análise.",
    steps: [
      "Escolha uma mulher e confirme testemunho, percurso e resposta.",
      "Percorra os sete dias comparando núcleo textual, ação da leitora e resposta de design.",
      "Cheque historicidade, agência e contraste com as semanas vizinhas.",
      "Abra a auditoria textual do dia para rever todos os componentes preservados.",
    ],
  },
  system: {
    route: sitePath("/dev/system.html?embed=1#foundations"),
    label: "Regras do livro",
    shortLabel: "Regras",
    kicker: "02 · linguagem do livro",
    title: "Conheça as regras do livro.",
    copy: "Veja como tipografia, imagens, componentes, páginas e produção criam unidade e conforto de leitura.",
    scope: "A linguagem compartilhada orienta toda a coleção; cada jornada desenvolve essa base a partir de sua própria narrativa.",
    steps: [
      "Confirme as fundações de conforto, hierarquia e respiro.",
      "Revise as doze funções recorrentes e seus ritmos.",
      "Cheque como arte, came e alfa podem entrar sem invadir a coluna.",
      "Separe as regras compartilhadas das decisões narrativas de cada mulher.",
    ],
  },
  book: {
    route: sitePath("/dev/book.html?embed=1"),
    label: "Livro completo",
    shortLabel: "Livro",
    kicker: "03 · livro em tempo real",
    title: "Leia o estado atual em páginas.",
    copy: "Escolha a coleção, um volume ou uma mulher e percorra o livro recomposto a partir do repositório.",
    scope: "Esta visão permite revisar leitura e paginação em tempo real. O fechamento de produção acontece após a conferência física.",
    steps: [
      "Confira leitura contínua, margem interna e área real de escrita.",
      "Observe quebras produzidas pela densidade, sem perseguir um número fixo de páginas.",
      "Compare a aplicação com a necessidade declarada nas 20 jornadas.",
      "Volte às regras do livro quando um problema se repetir entre mulheres.",
    ],
  },
  management: {
    route: sitePath("/dev/management.html?embed=1"),
    label: "Gestão do projeto",
    shortLabel: "Gestão",
    kicker: "04 · acompanhamento da entrega",
    title: "Acompanhe o projeto inteiro.",
    copy: "Veja progresso, tarefas, decisões abertas e dependências recompostos diretamente do repositório.",
    scope: "Esta área transforma ROADMAP.md e PROJECT.md em uma visão operacional única, sem duplicar o estado do projeto.",
    steps: [
      "Comece pelo progresso geral e identifique a primeira fase em aberto.",
      "Filtre o checklist por pendências, concluídas ou um termo específico.",
      "Separe tarefas internas de decisões e insumos que dependem de terceiros.",
      "Atualize as fontes canônicas no repositório; a mesa recompõe o painel.",
    ],
  },
};

const buttons = {
  library: elements.viewLibrary,
  system: elements.viewSystem,
  book: elements.viewBook,
  management: elements.viewManagement,
};

let currentView = "library";
let workspaceMetrics;
let managementMetrics;
let clientNavigation = {};
let selectedWoman = Number(new URL(location.href).searchParams.get("woman")) || null;
let selectedBookScope = new URL(location.href).searchParams.get("scope") || "collection";
let selectedBookDay = Number(new URL(location.href).searchParams.get("day")) || 0;
const BOOK_COMPONENT_TARGETS = new Set(["opening", "reading", "pull-quote-1", "pull-quote-2", "pull-quote-3", "deeper-note", "silence", "reflection", "christ", "prayer", "heart", "truth", "song"]);
const requestedBookComponent = new URL(location.href).searchParams.get("component") || "";
let selectedBookComponent = BOOK_COMPONENT_TARGETS.has(requestedBookComponent) ? requestedBookComponent : "";
let guardInitialContext = true;
let bookFocusActive = false;

function keepInitialContextVisible() {
  if (guardInitialContext && window.innerWidth <= 900) window.scrollTo({ top: 0 });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function viewConfig(view) {
  const fallback = views[view] ?? views.library;
  const canonical = clientNavigation[view] ?? {};
  return {
    ...fallback,
    kicker: canonical.eyebrow ?? fallback.kicker,
    title: canonical.title ?? fallback.title,
    copy: canonical.summary ?? fallback.copy,
    scope: canonical.scope ?? fallback.scope,
    steps: canonical.steps ?? fallback.steps,
  };
}

function viewRoute(view) {
  const route = new URL(views[view].route, location.origin);
  if (view === "library") route.hash = selectedWoman ? `mulher-${selectedWoman}` : "biblioteca";
  if (view === "book" && selectedBookScope !== "collection") route.searchParams.set("scope", selectedBookScope);
  if (view === "book" && selectedBookDay) route.searchParams.set("day", String(selectedBookDay));
  if (view === "book" && selectedBookDay >= 1 && selectedBookDay <= 7 && selectedBookComponent) route.searchParams.set("component", selectedBookComponent);
  return `${route.pathname}${route.search}${route.hash}`;
}

function setState(state, label) {
  elements.state.dataset.state = state;
  elements.stateLabel.textContent = label;
  if (state !== "error") {
    elements.message.textContent = "";
    elements.message.hidden = true;
  }
}

function showError(message) {
  setState("error", "A mesa precisa de atenção");
  elements.message.textContent = message;
  elements.message.hidden = false;
}

function setReviewTray(open) {
  elements.reviewTray.hidden = !open;
  elements.reviewToggle.setAttribute("aria-expanded", String(open));
  elements.reviewToggle.querySelector("span").textContent = open ? "Fechar guia" : "Guia de análise";
}

function syncBookFocusToFrame() {
  try {
    elements.viewer.contentDocument?.body?.classList.toggle("is-focus-mode", bookFocusActive);
  } catch {
    // O modo é reaplicado quando a visualização interna terminar de carregar.
  }
}

function setBookFocusState(active) {
  bookFocusActive = active && currentView === "book";
  document.body.classList.toggle("is-book-focus", bookFocusActive);
  elements.bookFocusEntry.setAttribute("aria-pressed", String(bookFocusActive));
  elements.bookFocusExit.hidden = !bookFocusActive;
  syncBookFocusToFrame();
}

async function enterBookFocus() {
  if (currentView !== "book") return;
  setReviewTray(false);
  setBookFocusState(true);
  if (window.matchMedia("(max-width: 900px)").matches || document.fullscreenElement || !elements.workspace.requestFullscreen) return;
  try {
    await elements.workspace.requestFullscreen({ navigationUI: "hide" });
  } catch {
    // O layout de tela inteira continua ativo mesmo sem a API nativa do navegador.
  }
}

async function leaveBookFocus() {
  setBookFocusState(false);
  if (document.fullscreenElement === elements.workspace && document.exitFullscreen) {
    try {
      await document.exitFullscreen();
    } catch {
      // A classe visual já foi removida; não há outro estado a recuperar.
    }
  }
}

function renderViewMetrics() {
  if (!workspaceMetrics) return;
  if (currentView === "management" && managementMetrics) {
    elements.metricLabel1.textContent = "Progresso";
    elements.metricLabel2.textContent = "Concluídas";
    elements.metricLabel3.textContent = "Em aberto";
    elements.metricLabel4.textContent = "Fases";
    elements.womenCount.textContent = `${managementMetrics.progress}%`;
    elements.daysCount.textContent = String(managementMetrics.completed);
    elements.universalCount.textContent = String(managementMetrics.pending);
    elements.exceptionCount.textContent = String(managementMetrics.phases);
    return;
  }
  if (currentView === "system") {
    elements.metricLabel1.textContent = "Funções diárias";
    elements.metricLabel2.textContent = "Dias auditados";
    elements.metricLabel3.textContent = "Formato";
    elements.metricLabel4.textContent = "Estado";
    elements.womenCount.textContent = String(workspaceMetrics.universal);
    elements.daysCount.textContent = String(workspaceMetrics.days);
    elements.universalCount.textContent = workspaceMetrics.trim;
    elements.exceptionCount.textContent = "em desenvolvimento";
    return;
  }
  elements.metricLabel1.textContent = "Mulheres";
  elements.metricLabel2.textContent = "Dias";
  elements.metricLabel3.textContent = "Volumes";
  elements.metricLabel4.textContent = "Recursos especiais";
  elements.womenCount.textContent = String(workspaceMetrics.women);
  elements.daysCount.textContent = String(workspaceMetrics.days);
  elements.universalCount.textContent = String(workspaceMetrics.volumes);
  elements.exceptionCount.textContent = String(workspaceMetrics.exceptions);
}

function renderBookMetrics(metrics = { pages: 0, women: 20, days: 140, volumes: 2 }) {
  elements.metricLabel1.textContent = "Páginas";
  elements.metricLabel2.textContent = "Mulheres";
  elements.metricLabel3.textContent = "Dias";
  elements.metricLabel4.textContent = "Volumes";
  elements.womenCount.textContent = metrics.pages > 0
    ? new Intl.NumberFormat("pt-BR").format(metrics.pages)
    : metrics.pages === -1 ? "—" : "contando…";
  elements.daysCount.textContent = String(metrics.women);
  elements.universalCount.textContent = String(metrics.days);
  elements.exceptionCount.textContent = String(metrics.volumes);
}

function selectView(view, updateUrl = true) {
  currentView = views[view] ? view : "library";
  if (currentView !== "book" && bookFocusActive) void leaveBookFocus();
  const config = viewConfig(currentView);
  const route = viewRoute(currentView);
  document.body.dataset.view = currentView;
  elements.bookFocusEntry.hidden = currentView !== "book";
  if (elements.viewer.src !== new URL(route, location.origin).href) elements.viewer.src = route;
  elements.viewer.title = config.label;
  elements.workspace.setAttribute("aria-label", config.label);
  elements.contextKicker.textContent = config.kicker;
  elements.contextTitle.textContent = config.title;
  elements.contextCopy.textContent = config.copy;
  elements.scopeNote.textContent = config.scope;
  elements.auditSteps.innerHTML = config.steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${step}</p></li>`).join("");
  Object.entries(buttons).forEach(([key, button]) => {
    const active = key === currentView;
    button.setAttribute("aria-pressed", String(active));
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (currentView === "book") renderBookMetrics();
  else renderViewMetrics();
  if (updateUrl) {
    const url = new URL(location.href);
    if (currentView === "library") url.searchParams.delete("view");
    else url.searchParams.set("view", currentView);
    if (currentView === "library" && selectedWoman) url.searchParams.set("woman", String(selectedWoman));
    else url.searchParams.delete("woman");
    if (currentView === "book" && selectedBookScope !== "collection") url.searchParams.set("scope", selectedBookScope);
    else url.searchParams.delete("scope");
    history.replaceState(null, "", url);
  }
}

async function loadWorkspaceData() {
  const [statusResponse, systemResponse, managementResponse] = await Promise.all([
    fetch(dataPath("status"), { cache: "no-store" }),
    fetch(dataPath("design-system"), { cache: "no-store" }),
    fetch(dataPath("project-management"), { cache: "no-store" }),
  ]);
  if (!statusResponse.ok || !systemResponse.ok || !managementResponse.ok) throw new Error("Não foi possível ler o estado canônico da mesa editorial.");
  const [status, system, management] = await Promise.all([statusResponse.json(), systemResponse.json(), managementResponse.json()]);
  if (reviewMode && reviewVersion && status.commit && reviewVersion !== status.commit) {
    const freshUrl = new URL(location.href);
    freshUrl.searchParams.set("v", status.commit);
    location.replace(freshUrl);
    return;
  }
  const labels = system.inventory.projection_contract?.client_labels;
  clientNavigation = system.inventory.projection_contract?.client_navigation ?? {};
  const glossary = system.inventory.projection_contract?.client_glossary ?? {};
  const decisionStates = system.inventory.projection_contract?.decision_states;
  const weeks = system.artDirection.narrative_library.weeks;
  const days = system.narrativeContent.reduce((sum, week) => sum + week.days.length, 0);
  const exceptions = weeks.reduce((sum, week) => sum + week.days.reduce((daySum, day) =>
    daySum + day.slots.filter((slot) => slot === "functional_diagram" || slot === "exercise_scene_black_only").length, 0), 0);
  workspaceMetrics = {
    women: weeks.length,
    days,
    volumes: Object.keys(system.publication.volumes).length,
    universal: Object.keys(system.inventory.placeholder_library.universal).length,
    exceptions,
    trim: `${system.tokens.page.trim_mm.join(" × ")} mm`,
  };
  managementMetrics = management.summary;
  elements.projectName.textContent = status.publicationName;
  elements.glossary.innerHTML = Object.entries(glossary).map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join("");
  if (labels) {
    elements.viewLibrary.querySelector("[data-view-label]").textContent = labels.narrative_board_short;
    elements.viewSystem.querySelector("[data-view-label]").textContent = labels.ecosystem_board;
    elements.viewBook.querySelector("[data-view-label]").textContent = labels.live_book;
    elements.viewManagement.querySelector("[data-view-label]").textContent = labels.project_management;
  }
  Object.entries(buttons).forEach(([key, button]) => {
    const hint = clientNavigation[key]?.navigation_hint;
    if (hint) button.querySelector("[data-view-hint]").textContent = hint;
  });
  if (decisionStates) {
    document.querySelectorAll("[data-decision-state]").forEach((element) => {
      element.textContent = decisionStates[element.dataset.decisionState];
    });
  }
  document.title = `${status.publicationName} · Mesa editorial`;
  setState("ready", reviewMode ? `Mesa publicada · ${status.builtAt}` : "Conteúdo íntegro · mesa ativa");
  selectView(currentView, false);
}

const requestedView = new URL(location.href).searchParams.get("view");
selectView(["system", "book", "management"].includes(requestedView) ? requestedView : "library", false);

if (!reviewMode) {
  const events = new EventSource(sitePath("/__events"));
  events.addEventListener("build-start", () => setState("building", "Recompondo…"));
  events.addEventListener("reload", () => location.reload());
  events.addEventListener("build-error", (event) => showError(JSON.parse(event.data).message));
  events.onopen = () => {
    if (elements.stateLabel.textContent === "Servidor desconectado") {
      setState("ready", "Conteúdo íntegro · mesa ativa");
    }
  };
  events.onerror = () => setState("error", "Servidor desconectado");
} else {
  elements.rebuild.hidden = true;
}

elements.rebuild.addEventListener("click", async () => {
  setState("building", "Recompondo…");
  const response = await fetch(sitePath("/__rebuild"), { method: "POST" });
  if (!response.ok) showError(await response.text());
});
elements.viewLibrary.addEventListener("click", () => selectView("library"));
elements.viewSystem.addEventListener("click", () => selectView("system"));
elements.viewBook.addEventListener("click", () => selectView("book"));
elements.viewManagement.addEventListener("click", () => selectView("management"));
elements.reviewToggle.addEventListener("click", () => setReviewTray(elements.reviewToggle.getAttribute("aria-expanded") !== "true"));
elements.bookFocusEntry.addEventListener("click", enterBookFocus);
elements.bookFocusExit.addEventListener("click", leaveBookFocus);
elements.viewer.addEventListener("load", () => {
  requestAnimationFrame(keepInitialContextVisible);
  syncBookFocusToFrame();
});
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement === elements.workspace) setBookFocusState(true);
  else if (bookFocusActive) setBookFocusState(false);
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bookFocusActive && !document.fullscreenElement) void leaveBookFocus();
});
["pointerdown", "touchstart", "wheel", "keydown"].forEach((eventName) => window.addEventListener(eventName, () => { guardInitialContext = false; }, { once: true, passive: true }));
setTimeout(() => {
  keepInitialContextVisible();
  guardInitialContext = false;
}, 2500);

window.addEventListener("message", (event) => {
  if (event.origin !== location.origin) return;
  if (currentView === "book" && event.data?.type === "jsm-book-metrics") {
    selectedBookScope = event.data.scope ?? "collection";
    selectedBookDay = Number(event.data.day) || 0;
    selectedBookComponent = BOOK_COMPONENT_TARGETS.has(event.data.component) ? event.data.component : "";
    renderBookMetrics(event.data);
    const url = new URL(location.href);
    if (selectedBookScope === "collection") url.searchParams.delete("scope");
    else url.searchParams.set("scope", selectedBookScope);
    if (selectedBookDay) url.searchParams.set("day", String(selectedBookDay));
    else url.searchParams.delete("day");
    if (selectedBookComponent) url.searchParams.set("component", selectedBookComponent);
    else url.searchParams.delete("component");
    url.searchParams.delete("closure");
    history.replaceState(null, "", url);
  }
  if (currentView === "library" && event.data?.type === "jsm-library-selection") {
    selectedWoman = Number(event.data.week) || null;
    const url = new URL(location.href);
    if (selectedWoman) url.searchParams.set("woman", String(selectedWoman));
    else url.searchParams.delete("woman");
    history.replaceState(null, "", url);
  }
});

window.addEventListener("popstate", () => {
  const url = new URL(location.href);
  selectedWoman = Number(url.searchParams.get("woman")) || null;
  selectedBookScope = url.searchParams.get("scope") || "collection";
  selectedBookDay = Number(url.searchParams.get("day")) || 0;
  selectedBookComponent = BOOK_COMPONENT_TARGETS.has(url.searchParams.get("component")) ? url.searchParams.get("component") : "";
  const view = url.searchParams.get("view");
  selectView(["system", "book", "management"].includes(view) ? view : "library", false);
});

loadWorkspaceData().catch((error) => showError(error.message));
