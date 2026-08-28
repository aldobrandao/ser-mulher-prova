import { dataPath, reviewMode } from "./runtime.js?v=488b7e8";

const elements = {
  orbit: document.querySelector("#progress-orbit"),
  percent: document.querySelector("#progress-percent"),
  bar: document.querySelector("#progress-bar"),
  completed: document.querySelector("#completed-count"),
  total: document.querySelector("#total-count"),
  pending: document.querySelector("#pending-count"),
  phases: document.querySelector("#phase-count"),
  currentPhase: document.querySelector("#current-phase-label"),
  decisions: document.querySelector("#decision-count"),
  dependencies: document.querySelector("#dependency-count"),
  decisionBadge: document.querySelector("#decision-badge"),
  dependencyBadge: document.querySelector("#dependency-badge"),
  decisionList: document.querySelector("#decision-list"),
  dependencyList: document.querySelector("#dependency-list"),
  cancelledList: document.querySelector("#cancelled-list"),
  currentState: document.querySelector("#current-state"),
  phaseList: document.querySelector("#phase-list"),
  search: document.querySelector("#task-search"),
  filters: [...document.querySelectorAll("[data-filter]")],
  resultStatus: document.querySelector("#result-status"),
  syncTime: document.querySelector("#sync-time"),
  syncCommit: document.querySelector("#sync-commit"),
  branch: document.querySelector("#repo-branch"),
  repoState: document.querySelector("#repo-state"),
  empty: document.querySelector("#empty-template"),
  nextAction: document.querySelector("#next-action-title"),
  printMeasuredAt: document.querySelector("#print-measured-at"),
  printVolumeGrid: document.querySelector("#print-volume-grid"),
  printColorRule: document.querySelector("#print-color-rule"),
  printArtworkStatus: document.querySelector("#print-artwork-status"),
  printQuotationStatus: document.querySelector("#print-quotation-status"),
};

let management;
let activeFilter = "all";

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLowerCase();
}

function phaseStateLabel(phase) {
  if (phase.state === "complete") return "concluída";
  if (phase.state === "current") return "primeira frente em aberto";
  return "em sequência";
}

function fuzzyIncludes(value, query) {
  const text = normalize(value);
  return !query || text.includes(query) || (query.length >= 8 && text.includes(query.slice(0, -2)));
}

function taskMatches(task, query) {
  const statusMatches = activeFilter === "all" || (activeFilter === "completed" ? task.completed : !task.completed);
  return statusMatches && fuzzyIncludes(task.text, query);
}

function renderPhases() {
  const query = normalize(elements.search.value.trim());
  let visibleTasks = 0;
  const phases = management.phases.map((phase) => {
    const phaseMatches = fuzzyIncludes(phase.title, query);
    const tasks = phase.tasks.filter((task) => taskMatches(task, phaseMatches ? "" : query));
    if (!tasks.length) return "";
    visibleTasks += tasks.length;
    const open = phase.state === "current" || Boolean(query) || activeFilter !== "all";
    return `<details class="phase-card" data-state="${escapeHtml(phase.state)}" ${open ? "open" : ""}>
      <summary>
        <span class="phase-number">${String(phase.number).padStart(2, "0")}</span>
        <div class="phase-title"><small>${escapeHtml(phaseStateLabel(phase))}</small><h3>${escapeHtml(phase.title)}</h3></div>
        <div class="phase-progress"><strong>${phase.progress}%</strong><span>${phase.completed}/${phase.tasks.length}</span></div>
        <i class="phase-chevron" aria-hidden="true"></i>
      </summary>
      <div class="phase-body">
        <div class="phase-meter" aria-label="${phase.progress}% da fase concluído"><i style="width:${phase.progress}%"></i></div>
        <ul class="task-list">${tasks.map((task) => `<li data-completed="${task.completed}"><i aria-hidden="true"></i><span>${escapeHtml(task.text)}</span><small>${task.completed ? "feito" : "a fazer"}</small></li>`).join("")}</ul>
        ${phase.criterion ? `<p class="acceptance"><b>Critério de aceite</b><span>${escapeHtml(phase.criterion)}</span></p>` : ""}
      </div>
    </details>`;
  }).join("");
  elements.phaseList.innerHTML = phases;
  if (!visibleTasks) elements.phaseList.append(elements.empty.content.cloneNode(true));
  elements.resultStatus.textContent = `${visibleTasks} ${visibleTasks === 1 ? "tarefa exibida" : "tarefas exibidas"} de ${management.summary.total}.`;
}

function renderList(element, values) {
  element.innerHTML = values.map((value) => `<li>${escapeHtml(value)}</li>`).join("");
}

function renderPrintSnapshot(snapshot) {
  const measuredAt = new Date(`${snapshot.measuredAt}T12:00:00`);
  elements.printMeasuredAt.textContent = `Medição integral em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(measuredAt)} · números ainda mudam com encerramentos e paridade.`;
  elements.printVolumeGrid.innerHTML = snapshot.volumes.map((volume) => `<article class="print-volume-card">
    <header><span>Volume ${volume.volume === 1 ? "I" : "II"}</span><strong>${new Intl.NumberFormat("pt-BR").format(volume.interiorPages)} páginas de miolo</strong><small>${new Intl.NumberFormat("pt-BR").format(volume.previewPages)} na prévia com a capa digital</small></header>
    <ol>${volume.women.map((woman) => `<li><span>${String(woman.week).padStart(2, "0")} · ${escapeHtml(woman.woman)}</span><b>${woman.pages} pág.</b></li>`).join("")}</ol>
  </article>`).join("");
  elements.printColorRule.textContent = snapshot.colorRule.replace(";", ".");
  elements.printArtworkStatus.textContent = `${snapshot.artwork.activeOpenings}/${snapshot.artwork.requiredPerRole} aberturas e ${snapshot.artwork.activeClosures}/${snapshot.artwork.requiredPerRole} encerramentos estão aprovados e vinculados.`;
  elements.printQuotationStatus.textContent = snapshot.quotationStatus === "requote_required"
    ? "Orçamento anterior invalidado: é preciso recotar depois de integrar os encerramentos e receber a imposição da gráfica."
    : "Cenário de orçamento em acompanhamento.";
}

function renderManagement(data) {
  management = data;
  const { summary, workspace } = data;
  const currentPhase = data.phases.find((phase) => phase.state === "current");
  elements.nextAction.textContent = currentPhase?.tasks.find((task) => !task.completed)?.text
    ?? data.externalDependencies[0]
    ?? "Nenhuma ação interna pendente.";
  elements.orbit.style.setProperty("--progress", `${summary.progress * 3.6}deg`);
  elements.percent.textContent = `${summary.progress}%`;
  elements.bar.style.width = `${summary.progress}%`;
  elements.completed.textContent = String(summary.completed);
  elements.total.textContent = String(summary.total);
  elements.pending.textContent = String(summary.pending);
  elements.phases.textContent = String(summary.phases);
  elements.currentPhase.textContent = summary.currentPhase === null ? "todas concluídas" : `fase ${summary.currentPhase} é a primeira em aberto`;
  elements.decisions.textContent = String(data.openDecisions.length);
  elements.dependencies.textContent = String(data.externalDependencies.length);
  elements.decisionBadge.textContent = String(data.openDecisions.length);
  elements.dependencyBadge.textContent = String(data.externalDependencies.length);
  renderList(elements.decisionList, data.openDecisions);
  renderList(elements.dependencyList, data.externalDependencies);
  elements.cancelledList.innerHTML = data.cancelledItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  elements.currentState.innerHTML = data.currentState.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  elements.syncTime.textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(data.generatedAt));
  elements.syncCommit.textContent = `${reviewMode ? "publicação" : "estado local"} · commit ${workspace.commit}`;
  elements.branch.textContent = workspace.branch;
  elements.repoState.textContent = workspace.clean ? "sem alterações locais" : `${workspace.changedFiles} ${workspace.changedFiles === 1 ? "arquivo alterado" : "arquivos alterados"}`;
  elements.repoState.dataset.state = workspace.clean ? "clean" : "changed";
  if (data.printSnapshot) renderPrintSnapshot(data.printSnapshot);
  else {
    elements.printMeasuredAt.textContent = "Atualizando a medição integral da paginação…";
    elements.printArtworkStatus.textContent = "Os dados aparecem assim que a mesa e a fonte canônica estiverem na mesma versão.";
  }
  renderPhases();
}

elements.filters.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  elements.filters.forEach((entry) => entry.setAttribute("aria-pressed", String(entry === button)));
  renderPhases();
}));
elements.search.addEventListener("input", renderPhases);

fetch(dataPath("project-management"), { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Não foi possível ler a gestão canônica do projeto.");
    return response.json();
  })
  .then(renderManagement)
  .catch((error) => {
    elements.phaseList.innerHTML = `<div class="empty-state empty-state--error"><strong>O painel precisa de atenção.</strong><span>${escapeHtml(error.message)}</span></div>`;
  });
