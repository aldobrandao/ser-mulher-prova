import { dataPath, sitePath } from "./runtime.js?v=488b7e8";

const universalList = document.querySelector("#universal-placeholder-list");
const specificList = document.querySelector("#specific-placeholder-list");
const comparison = document.querySelector("#woman-comparison");
const pairGallery = document.querySelector("#galeria-imagens");
const detail = document.querySelector("#woman-detail");
const auditStatus = document.querySelector("#library-audit-status");
const coverAnchorPair = document.querySelector("#cover-anchor-pair");
const formatReviewSummary = document.querySelector("#format-review-summary");
const formatHypothesisGrid = document.querySelector("#format-hypothesis-grid");
const closureFormatGrid = document.querySelector("#closure-format-grid");
const visualControlChapter = document.querySelector("#controle");
const visualControlIntro = document.querySelector("#visual-control-intro");
const visualControlGate = document.querySelector("#visual-control-gate");
const visualControlMatrix = document.querySelector("#visual-control-matrix");
const visualControlInternalsGrid = document.querySelector("#visual-control-internals-grid");
const visualControlGrid = document.querySelector("#visual-control-grid");
const volumeButtons = [...document.querySelectorAll("[data-volume]")];
const womanSearch = document.querySelector("#woman-search");
const womanJump = document.querySelector("#woman-jump");

const slotLabels = {
  structure_only: "somente estrutura",
  material_echo: "eco de matéria",
  object_echo: "eco de objeto",
  transition_gesture: "gesto de transição",
  functional_diagram: "diagrama funcional",
  exercise_scene_black_only: "cena de exercício · preto",
  closure_color: "resposta · cor",
};

const componentLabels = {
  opening: "chegada",
  reading: "leitura",
  "deeper-note": "aprofundamento",
  silence: "silêncio",
  reflection: "reflexão e escrita",
  christ: "encontro com Cristo",
  prayer: "oração",
  keepsake: "memória",
  heart: "memória do coração",
  truth: "verdade",
  song: "canção",
};

const phaseLabels = {
  reconhecer_e_inventariar: "reconhecer e inventariar",
  localizar_e_expor: "localizar e expor",
  nomear_o_padrão: "nomear o padrão",
  atravessar_a_decisão: "atravessar a decisão",
  perceber_a_virada: "perceber a virada",
  integrar_e_praticar: "integrar e praticar",
  sintetizar_e_chegar: "sintetizar e chegar",
};

const fieldLabels = {
  running_context: "contexto corrente",
  day_header_gesture: "gesto do cabeçalho",
  scripture_threshold: "limiar da Escritura",
  reading_flow: "fluxo de leitura",
  deeper_note: "aprofundamento",
  pull_quote: "citação de síntese",
  silence_pause: "pausa de silêncio",
  reflection_writing: "reflexão e escrita",
  prayer_gesture: "gesto de oração",
  keepsake_field: "campo de memória",
  truth_cadence: "cadência da verdade",
  song_cue: "chamada de canção",
  opening_color: "abertura colorida",
  week_timeline: "timeline do percurso",
  timeline_day_entries: "sete entradas do percurso",
  material_echo: "eco de matéria",
  object_echo: "eco de objeto",
  functional_diagram: "diagrama funcional",
  exercise_scene_black_only: "cena de exercício em preto",
  closure_color: "resposta colorida",
};

const densityLabels = { light: "leve", standard: "regular", dense: "denso" };
const writingLineCounts = { compact: 3, standard: 5, deep: 8 };
const keepsakeLineCounts = { compact: 3, standard: 4, deep: 6 };

const mediumLabels = {
  typography: "tipografia",
  came_or_typography: "came ou tipografia",
  typography_and_short_came: "tipografia e came curto",
  typography_and_white_space: "tipografia e espaço em branco",
  white_space_and_came_gesture: "branco e gesto de came",
  prompt_and_writing_lines: "pergunta e linhas de escrita",
  vertical_came: "came vertical",
  writing_area: "área de escrita",
  typography_with_title_credit_context_and_brief_excerpt: "título, crédito, contexto e trecho breve",
  full_color_illustration: "ilustração em cor",
  black_only_line_art: "arte linear em uma tinta",
  came_derived_geometry: "geometria derivada do came",
  black_only_alpha_cutout: "recorte com alfa em uma tinta",
  css_or_vector_line: "CSS ou linha vetorial",
  black_only_illustration: "ilustração em uma tinta",
  full_color_composition: "composição em cor",
};

const formatHypothesisLabels = {
  integrated_full_bleed_threshold: "Limiar full bleed integrado",
};

const formatHypothesisDescriptions = {
  integrated_full_bleed_threshold: "A cena alcança as bordas uma única vez e integra nome e tema no campo opalino limpo da própria imagem, conduzindo diretamente ao percurso.",
};

let boardData;
let activeVolume = "all";
let activeWeek = 1;
let activeSearch = "";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sentence(value) {
  return String(value ?? "")
    .replaceAll("_", " ")
    .replace(/\bcancao\b/giu, "canção")
    .replace(/\bcss\b/giu, "CSS")
    .replace(/\balfa\b/giu, "alfa")
    .replace(/\bcanvas\b/giu, "arquivo")
    .replace(/\bcrop\b/giu, "corte")
    .replace(/\bgutter\b/giu, "dobra central")
    .replace(/\bteal\b/giu, "azul-petróleo")
    .replace(/\bhero\b/giu, "de impacto");
}

const narrativeValueLabels = {
  authorial_metaphor_in_historical_world: "metáfora autoral situada no mundo histórico",
  plausible_historical_synthesis: "síntese histórica plausível",
  documented_biblical_event: "acontecimento bíblico documentado",
  documented_biblical_role_synthesis: "síntese de papel bíblico documentado",
  exterior_journey: "jornada ao ar livre",
  domestic_coastal_interior: "interior doméstico litorâneo",
  domestic_cooking_interior: "interior doméstico de cozinha",
  domestic_storage_threshold: "limiar doméstico de armazenamento",
  public_crowded_passage: "passagem pública cheia",
  exterior_judgment_under_palm: "julgamento ao ar livre sob a palmeira",
  exterior_rupture_and_smoke: "ruptura ao ar livre entre fumaça",
  exterior_mountain_encounter: "encontro ao ar livre na montanha",
  riverside_assembly: "reunião à margem do rio",
  shoreline_celebration: "celebração junto à margem",
  domestic_devotion_interior: "interior doméstico de devoção",
  cultivated_exterior: "área cultivada ao ar livre",
  well_and_route: "fonte e caminho",
  sacred_threshold: "limiar sagrado",
  community_interior: "interior comunitário",
  foreign_household: "casa estrangeira",
  desert_and_well: "deserto e poço",
  harvest_field: "campo de colheita",
  palace_threshold: "limiar do palácio",
  mobile_workshop: "oficina móvel",
  walking: "caminhando",
  seated: "sentada",
  kneeling: "ajoelhada",
  standing: "em pé",
  low_reaching: "baixa, estendendo a mão",
  walking_turn: "caminhando e virando-se",
  mixed_kneeling_standing: "ajoelhada diante de outra figura em pé",
  standing_group: "grupo em pé",
  standing_active: "em pé, em ação",
  mixed_low_rising: "baixa, começando a se erguer",
  standing_pair: "dupla em pé",
  solo: "sozinha",
  crowd: "multidão",
  small_group: "pequeno grupo",
  pair: "dupla",
  group: "grupo",
  diagonal_counterbalanced: "diagonal equilibrada por contraponto",
  organic_framing: "enquadramento orgânico",
  axial: "composição axial",
  relational_triangle: "triângulo de relações",
  middle: "médio",
  obscured: "encoberto",
  none: "sem horizonte",
  low: "baixo",
  high: "alto",
};

function narrativeSentence(value) {
  return narrativeValueLabels[value] ?? sentence(value);
}

function previewAsset(record) {
  const asset = record?.asset;
  if (!asset) return null;
  if (asset.endsWith(".webp")) return asset;
  if (record.status !== "production_master") return asset;
  return asset.replace("/master/", "/approved/").replace("-master.png", ".png");
}

function editorialStatus(record) {
  if (record.editorial_status === "canonical_reference") return "referência aprovada";
  if (record.editorial_status === "approved_for_layout") return "pronta para diagramação";
  if (record.editorial_status === "rethink_and_rework") return "direção em desenvolvimento";
  return "formato em definição";
}

function controlStatus(value) {
  const status = typeof value === "object" ? value?.status : value;
  const labels = {
    approved_for_layout: "oficial para diagramação",
    canonical_reference: "referência canônica",
    intentionally_absent: "ausente intencional",
    absent_intentionally: "ausente intencional",
    missing: "ausente — precisa ser criado",
    in_development: "em desenvolvimento",
    control_specimen: "specimen de controle",
  };
  return labels[status] ?? (status ? sentence(status) : "estado não registrado");
}

function controlAsset(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  return [value];
}

function controlAtlasPreview(week, label) {
  const segments = Array.from({ length: 7 }, (_, index) => `<i style="--segment:${index + 1}"><b>${String(index + 1).padStart(2, "0")}</b><span></span></i>`).join("");
  return `<div class="visual-control-atlas visual-control-atlas--${week}" role="img" aria-label="${escapeHtml(label)} · estudo tipográfico linear de sete estados">${segments}</div>`;
}

function controlTimelinePreview(label) {
  const entries = Array.from({ length: 7 }, (_, index) => `<i><b>${String(index + 1).padStart(2, "0")}</b><span></span></i>`).join("");
  return `<div class="visual-control-timeline" role="img" aria-label="${escapeHtml(label)} · timeline tipográfica de sete dias">${entries}</div>`;
}

function controlAssetCard(value, label, week = null, featured = false) {
  const record = typeof value === "string" ? { status: value } : value ?? {};
  const asset = previewAsset(record);
  const status = controlStatus(record);
  const note = record.note ?? record.notes ?? record.artistic_note ?? record.direction ?? "";
  const atlas = record.specimen === "css_atlas" && week;
  const timeline = record.specimen === "typographic_timeline";
  const image = asset
    ? `<img src="${escapeHtml(sitePath(asset))}" alt="${escapeHtml(label)} · candidato visual">`
    : timeline
      ? controlTimelinePreview(label)
    : atlas
      ? controlAtlasPreview(week, label)
      : `<div class="visual-control-absence" role="img" aria-label="${escapeHtml(label)} sem imagem registrada"><span>Sem imagem</span></div>`;
  return `<figure class="visual-control-asset ${asset ? "has-image" : timeline ? "has-timeline" : atlas ? "has-atlas" : "is-absent"}${featured ? " is-featured" : ""}">${image}<figcaption><b>${escapeHtml(label)}</b><span>${escapeHtml(status)}</span>${note ? `<small>${escapeHtml(note)}</small>` : ""}</figcaption></figure>`;
}

function controlRoleRecord(item, role) {
  const week = Number(item.week);
  const source = findWeek(week);
  const name = item.woman ?? source.woman?.name ?? source.week?.woman ?? `Semana ${week}`;
  const assets = item.assets ?? item.candidates ?? item;
  const value = role === "opening"
    ? assets.opening ?? assets.opening_color
    : assets.closure ?? assets.closure_color ?? assets.response;
  const record = typeof value === "string" ? { status: value } : value ?? {};
  return { week, name, record, asset: previewAsset(record) };
}

function controlMatrixCell(item, role) {
  const { week, name, record, asset } = controlRoleRecord(item, role);
  const note = record.note ?? record.notes ?? record.artistic_note ?? record.direction ?? "";
  const label = role === "opening" ? "Abertura" : "Encerramento";
  const target = role === "opening"
    ? `/dev/?view=book&scope=woman-${week}`
    : `/dev/?view=book&scope=woman-${week}&day=8`;
  const image = asset
    ? `<img src="${escapeHtml(sitePath(asset))}" alt="${escapeHtml(`${label} de ${name}`)}">`
    : `<div class="visual-control-matrix-absence" role="img" aria-label="${escapeHtml(`${label} de ${name} sem imagem`)}"><span>Sem imagem</span></div>`;
  return `<figure class="visual-control-matrix-cell" data-week="${week}" data-role="${role}"><a class="visual-control-matrix-book" href="${escapeHtml(sitePath(target))}" target="_top" aria-label="Abrir ${escapeHtml(label.toLowerCase())} de ${escapeHtml(name)} no livro paginado">${image}</a><figcaption><b>${escapeHtml(name)}</b><span>${escapeHtml(controlStatus(record))}</span>${note ? `<small>${escapeHtml(note)}</small>` : ""}<a href="${escapeHtml(sitePath(target))}" target="_top">Livro paginado ↗</a></figcaption></figure>`;
}

function renderControlMatrix(control) {
  const weeks = control.weeks;
  const headers = weeks.map((item) => `<div class="visual-control-matrix-name"><span>Semana ${String(item.week).padStart(2, "0")}</span><strong>${escapeHtml(item.woman ?? `Semana ${item.week}`)}</strong></div>`).join("");
  const rows = [
    ["opening", "Abertura", "testemunha, gesto e mundo histórico"],
    ["closure", "Encerramento", "resposta, transformação e distância da abertura"],
  ].map(([role, label, focus]) => `<div class="visual-control-matrix-axis"><strong>${label}</strong><span>${focus}</span></div>${weeks.map((item) => controlMatrixCell(item, role)).join("")}`).join("");
  visualControlMatrix.innerHTML = `<header><div><span>Conjunto oficial de controle</span><h3 id="visual-control-matrix-title">Seis imagens. Uma linguagem editorial.</h3></div><p>Use escala, foco narrativo, matéria, luz, agência e espaço negativo como referência para as próximas jornadas.</p></header><div class="visual-control-matrix-scroll"><div class="visual-control-matrix-grid"><div class="visual-control-matrix-corner">Função</div>${headers}${rows}</div></div>`;
}

function renderControlInternalSpecimens(control) {
  const columns = control.weeks.map((item) => {
    const week = Number(item.week);
    const source = findWeek(week);
    const name = item.woman ?? source.woman?.name ?? source.week?.woman ?? `Semana ${week}`;
    const days = (source.week?.days ?? []).filter((day) => day.specimen_asset);
    return { week, name, days };
  });
  const headers = columns.map((column) => `<header class="internal-specimen-column"><span>Semana ${String(column.week).padStart(2, "0")}</span><strong>${escapeHtml(column.name)}</strong></header>`).join("");
  const rows = Array.from({ length: 3 }, (_entry, index) => columns.map((column) => {
    const day = column.days[index];
    if (!day?.specimen_asset) return '<div class="internal-specimen-missing">Placeholder registrado · arte raster ainda não refeita</div>';
    const asset = sitePath(day.specimen_asset.path);
    const role = day.specimen_asset.role === "object_echo" ? "Objeto narrativo" : "Matéria narrativa";
    const href = sitePath(`/dev/?view=book&scope=woman-${column.week}&day=${day.day}`);
    return `<figure class="internal-specimen-card" data-week="${column.week}" data-day="${day.day}" data-role="${escapeHtml(day.specimen_asset.role)}">
      <a href="${escapeHtml(href)}" target="_top" aria-label="Abrir ${escapeHtml(day.specimen_asset.label)} no Dia ${String(day.day).padStart(2, "0")} de ${escapeHtml(column.name)}">
        <div class="internal-specimen-stage">
          <div class="internal-specimen-detail"><img src="${escapeHtml(asset)}" alt="${escapeHtml(day.specimen_asset.label)} ampliado para comparação"></div>
          <div class="internal-specimen-page" aria-hidden="true"><i></i><img src="${escapeHtml(asset)}" alt=""></div>
        </div>
      </a>
      <figcaption><span>Dia ${String(day.day).padStart(2, "0")} · ${escapeHtml(role)}</span><b>${escapeHtml(day.specimen_asset.label)}</b><small>${escapeHtml(sentence(day.cue))} · posicionamento narrativo na página ↗</small></figcaption>
    </figure>`;
  }).join("")).join("");
  visualControlInternalsGrid.innerHTML = `${headers}${rows}`;
}

function renderVisualControl(data) {
  const control = data.artDirection?.official_control_set;
  if (!control || !Array.isArray(control.weeks) || !control.weeks.length) {
    visualControlChapter.hidden = true;
    return;
  }
  visualControlChapter.hidden = false;
  visualControlIntro.textContent = control.objective ?? control.description ?? "Amostra de abertura, percurso, matéria e encerramento antes da implementação em massa.";
  const approvalChecks = Array.isArray(control.approval_checks) ? control.approval_checks : [];
  const approvalList = approvalChecks.map((check) => `<li data-status="${escapeHtml(check.status)}"><i aria-hidden="true"></i><div><b>${escapeHtml(check.label)}</b><small>${escapeHtml(check.evidence)}</small><em>${check.timing === "review_now" ? "para aprovar nesta rodada" : "depois da seleção visual"}</em></div></li>`).join("");
  visualControlGate.innerHTML = `<div><span>Base oficial de layout</span><p>${escapeHtml(control.gate ?? "Aplicar a direção aprovada e reservar a prova física antes de escalar.")}</p></div>${approvalList ? `<ol class="visual-control-gate-list">${approvalList}</ol>` : ""}<small>Os estados derivam do registro canônico. A aprovação de layout não antecipa a prova física nem promove automaticamente arquivos futuros.</small>`;
  renderControlMatrix(control);
  renderControlInternalSpecimens(control);
  visualControlGrid.innerHTML = control.weeks.map((item) => {
    const week = Number(item.week);
    const source = findWeek(week);
    const name = item.woman ?? source.woman?.name ?? source.week?.woman ?? `Semana ${week}`;
    const assets = item.assets ?? item.candidates ?? item;
    const internalSpecimens = (source.week?.days ?? [])
      .filter((day) => day.specimen_asset)
      .map((day) => ({
        status: day.asset_status,
        asset: day.specimen_asset.path,
        label: `Dia ${String(day.day).padStart(2, "0")} · ${day.specimen_asset.label}`,
        note: `${day.specimen_asset.role === "object_echo" ? "Objeto narrativo" : "Matéria narrativa"} · ${sentence(day.cue)}`,
      }));
    const cards = [
      controlAssetCard(assets.opening ?? assets.opening_color, "Abertura", null, true),
      controlAssetCard(assets.closure ?? assets.closure_color ?? assets.response, "Encerramento", null, true),
      controlAssetCard(assets.atlas, "Percurso / timeline", week),
      ...internalSpecimens.map((specimen) => controlAssetCard(specimen, specimen.label)),
    ].join("");
    const notes = item.artistic_notes ?? item.notes ?? item.direction ?? "";
    const bookBase = `/dev/?view=book&scope=woman-${week}`;
    return `<article class="visual-control-card"><header><div><span>Semana ${String(week).padStart(2, "0")}</span><h3>${escapeHtml(name)}</h3></div><nav class="visual-control-links" aria-label="Abrir ${escapeHtml(name)} no livro"><a href="${escapeHtml(sitePath(bookBase))}" target="_top">Abertura</a><a href="${escapeHtml(sitePath(`${bookBase}&day=-1`))}" target="_top">Percurso</a><a href="${escapeHtml(sitePath(`${bookBase}&day=7`))}" target="_top">Dia 7</a><a href="${escapeHtml(sitePath(`${bookBase}&day=8`))}" target="_top">Encerramento ↗</a></nav></header>${notes ? `<p class="visual-control-notes">${escapeHtml(notes)}</p>` : ""}<div class="visual-control-assets">${cards}</div></article>`;
  }).join("");
}

function technicalStatus(status) {
  if (status === "production_master") return "mestre técnico preservado";
  if (status === "approved_reference_not_production_master") return "fonte aprovada";
  return "direção registrada";
}

function assetStatus(status) {
  if (status === "response_asset_under_review") return "resposta em desenvolvimento artístico";
  return sentence(status);
}

function occurrence(value) {
  if (value === "every_day") return "todos os dias";
  if (value === "when_present") return "quando existe no texto";
  if (value === "content_driven") return "quando o conteúdo exige";
  return sentence(value);
}

function quantity(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatControlSpecimen(item, formatId) {
  const { week, name, record, asset } = controlRoleRecord(item, "opening");
  const label = formatHypothesisLabels[formatId] ?? sentence(formatId);
  const image = asset
    ? `<img src="${escapeHtml(sitePath(asset))}" alt="${escapeHtml(`Abertura de ${name} aplicada à hipótese ${label}`)}">`
    : '<div class="format-control-absence" aria-hidden="true"></div>';
  return `<figure class="format-control-specimen" data-week="${week}"><div class="format-control-page"><span class="format-control-copy"><b>${escapeHtml(name)}</b><i>abertura da jornada</i></span>${image}</div><figcaption>${escapeHtml(name)} · ${escapeHtml(controlStatus(record))}</figcaption></figure>`;
}

function formatHypothesisCard(item, control) {
  const strengths = item.strengths.map((value) => `<li>${escapeHtml(sentence(value))}</li>`).join("");
  const risks = item.risks.map((value) => `<li>${escapeHtml(sentence(value))}</li>`).join("");
  const specimens = control.weeks.map((week) => formatControlSpecimen(week, item.id)).join("");
  return `<article class="format-hypothesis format-hypothesis--${escapeHtml(item.id)}">
    <div class="format-control-specimens">${specimens}</div>
    <span>${escapeHtml(sentence(item.placement))}</span>
    <h3>${escapeHtml(formatHypothesisLabels[item.id] ?? sentence(item.id))}</h3>
    <p>${escapeHtml(formatHypothesisDescriptions[item.id] ?? sentence(item.description))}</p>
    <div><section><b>Potência</b><ul>${strengths}</ul></section><section><b>Ponto de atenção</b><ul>${risks}</ul></section></div>
  </article>`;
}

function closureControlSpecimen(item, hypothesis) {
  const { week, name, record, asset } = controlRoleRecord(item, "closure");
  const image = asset
    ? `<img src="${escapeHtml(sitePath(asset))}" alt="${escapeHtml(`Encerramento de ${name} aplicado ao tratamento ${hypothesis.label}`)}">`
    : "";
  const bookUrl = sitePath(`/dev/?view=book&scope=woman-${week}&day=8`);
  return `<figure class="closure-control-specimen" data-week="${week}"><a class="closure-control-book" href="${escapeHtml(bookUrl)}" target="_top" aria-label="Abrir ${escapeHtml(name)} com ${escapeHtml(hypothesis.label)} no livro paginado"><div class="closure-control-page"><span class="closure-control-copy"><b>${escapeHtml(name)}</b><i>resposta da jornada</i></span>${image}</div></a><figcaption>${escapeHtml(name)} · ${controlStatus(record)}<span>Livro paginado ↗</span></figcaption></figure>`;
}

function closureFormatCard(item, control) {
  const strengths = item.strengths.map((value) => `<li>${escapeHtml(sentence(value))}</li>`).join("");
  const risks = item.risks.map((value) => `<li>${escapeHtml(sentence(value))}</li>`).join("");
  const specimens = control.weeks.map((week) => closureControlSpecimen(week, item)).join("");
  return `<article class="closure-format-card closure-format-card--${escapeHtml(item.id)}">
    <div class="closure-control-specimens">${specimens}</div>
    <span>${escapeHtml(sentence(item.placement))}</span>
    <h4>${escapeHtml(item.label)}</h4>
    <p>${escapeHtml(item.description)}</p>
    <div class="closure-format-evidence"><section><b>Potência</b><ul>${strengths}</ul></section><section><b>Ponto de atenção</b><ul>${risks}</ul></section></div>
  </article>`;
}

function placeholderCard([key, spec], specific = false) {
  const frequency = spec.occurrence
    ? occurrence(spec.occurrence)
    : spec.occurrence_per_week_max
      ? `até ${spec.occurrence_per_week_max} por mulher`
      : spec.occurrence_per_week
        ? `${spec.occurrence_per_week} por mulher`
        : "conforme o conteúdo";
  return `<article class="placeholder-card">
    <span>${escapeHtml(frequency)}</span>
    <h4>${escapeHtml(fieldLabels[key] ?? sentence(key))}</h4>
    <p>${escapeHtml(sentence(spec.role))}</p>
    <small>${specific ? "específico da narrativa" : spec.woman_specific ? "estrutura universal · gesto da mulher" : "estrutura universal"} · ${escapeHtml(mediumLabels[spec.medium] ?? sentence(spec.medium))}</small>
  </article>`;
}

function findWeek(weekNumber) {
  const week = boardData.artDirection.narrative_library.weeks.find((item) => item.week === weekNumber);
  const choreography = boardData.artDirection.collection_choreography.weeks.find((item) => item.week === weekNumber);
  const content = boardData.narrativeContent.find((item) => item.week === weekNumber);
  const woman = boardData.women.find((item) => item.week === weekNumber);
  return { week, choreography, content, woman };
}

function countSpecials(week) {
  return week.days.reduce((totals, day) => {
    day.slots.forEach((slot) => { totals[slot] = (totals[slot] ?? 0) + 1; });
    return totals;
  }, {});
}

function comparisonRow(week) {
  const { woman } = findWeek(week.week);
  const selected = week.week === activeWeek;
  const opening = previewAsset(woman.illustration);
  return `<button class="woman-index-row${selected ? " is-selected" : ""}" type="button" data-week="${week.week}" aria-pressed="${selected}" aria-label="Abrir jornada de ${escapeHtml(week.woman)}"${selected ? ' aria-current="true"' : ""}>
    <span class="woman-index-name">${opening ? `<img src="${escapeHtml(sitePath(opening))}" alt="" loading="lazy" decoding="async">` : ""}<i>${String(week.week).padStart(2, "0")}</i><b>${escapeHtml(week.woman)}</b><small>Volume ${woman.volume === "volume_1" ? "I" : "II"}</small></span>
    <span><small>Percurso</small>${escapeHtml(sentence(week.atlas_model))}</span>
    <span><small>Resposta da leitora</small>${escapeHtml(sentence(week.exercise_focus))}</span>
    <span class="woman-index-state"><small>Estado visual</small>${escapeHtml(editorialStatus(woman.illustration))}<br>${escapeHtml(editorialStatus(woman.response_illustration))}</span>
    <span class="woman-index-action"><strong>Ver jornada</strong><small>7 dias →</small></span>
  </button>`;
}

function visibleWeeks() {
  return boardData.artDirection.narrative_library.weeks.filter((week) => {
    const volumeMatches = activeVolume === "control"
      ? Boolean(boardData.artDirection.official_control_set?.weeks?.some((item) => item.week === week.week))
      : activeVolume === "all" || findWeek(week.week).woman.volume === `volume_${activeVolume}`;
    const haystack = `${week.woman} ${sentence(week.atlas_model)} ${sentence(week.exercise_focus)}`.toLocaleLowerCase("pt-BR");
    return volumeMatches && (!activeSearch || haystack.includes(activeSearch));
  });
}

function pairGalleryCard(week) {
  const { woman } = findWeek(week.week);
  const opening = previewAsset(woman.illustration);
  const closure = previewAsset(woman.response_illustration);
  const image = (asset, label) => asset
    ? `<figure><img src="${escapeHtml(sitePath(asset))}" alt="${escapeHtml(`${label} de ${week.woman}`)}" loading="eager" decoding="async"><figcaption>${escapeHtml(label)}</figcaption></figure>`
    : `<figure class="is-missing"><span>Imagem indisponível</span><figcaption>${escapeHtml(label)}</figcaption></figure>`;
  return `<button class="woman-pair-card" type="button" data-pair-week="${week.week}" aria-label="Abrir jornada de ${escapeHtml(week.woman)}">
    <header><span>${String(week.week).padStart(2, "0")}</span><h3>${escapeHtml(week.woman)}</h3><small>Volume ${woman.volume === "volume_1" ? "I" : "II"}</small></header>
    <div>${image(opening, "Abertura · mulher bíblica")}${image(closure, "Encerramento · Leitora")}</div>
  </button>`;
}

function scrollInsideBoard(element, behavior = "auto") {
  if (!element) return;
  const navigationOffset = document.querySelector(".studio-nav")?.getBoundingClientRect().height ?? 0;
  window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + window.scrollY - navigationOffset - 12), behavior });
}

function selectWeek(weekNumber, { scroll = true, updateHash = true } = {}) {
  activeWeek = weekNumber;
  womanJump.value = String(activeWeek);
  if (updateHash) history.replaceState(null, "", `#mulher-${activeWeek}`);
  renderComparison();
  renderDetail();
  window.parent.postMessage({ type: "jsm-library-selection", week: activeWeek }, location.origin);
  if (scroll) scrollInsideBoard(detail, "smooth");
}

function renderComparison() {
  const weeks = visibleWeeks();
  if (!weeks.length) {
    comparison.innerHTML = '<p class="woman-empty-state">Nenhuma jornada corresponde a esta busca. Tente outro nome ou tema.</p>';
    auditStatus.textContent = "Nenhuma jornada encontrada";
    return;
  }
  if (!weeks.some((week) => week.week === activeWeek)) activeWeek = weeks[0].week;
  comparison.innerHTML = `<div class="woman-comparison-heading" aria-hidden="true"><span>Mulher</span><span>Percurso</span><span>Resposta da leitora</span><span>Estado visual</span><span>Abrir</span></div>${weeks.map(comparisonRow).join("")}`;
  pairGallery.innerHTML = `<header><div><span>Comparação visual</span><h3>Aberturas e encerramentos lado a lado</h3></div><p>${weeks.length} ${weeks.length === 1 ? "mulher visível" : "mulheres visíveis"} · ${weeks.length * 2} ilustrações ativas no livro</p></header><div class="woman-pair-gallery-grid">${weeks.map(pairGalleryCard).join("")}</div>`;
  auditStatus.textContent = `${weeks.length} ${weeks.length === 1 ? "jornada visível" : "jornadas visíveis"}`;
  comparison.querySelectorAll("[data-week]").forEach((button) => button.addEventListener("click", () => selectWeek(Number(button.dataset.week))));
  pairGallery.querySelectorAll("[data-pair-week]").forEach((button) => button.addEventListener("click", () => selectWeek(Number(button.dataset.pairWeek))));
}

function metric(label, value) {
  return `<span><b>${escapeHtml(value)}</b>${escapeHtml(label)}</span>`;
}

function writingLineTotal(dayPlan, contentDay) {
  const writing = dayPlan.writing_space;
  if (!writing) return contentDay.reflectionPrompts.length * 4 + 2;
  const reflection = writing.reflection.reduce((total, variant) => total + (writingLineCounts[variant] ?? 0), 0);
  return reflection + (keepsakeLineCounts[writing.keepsake] ?? 0);
}

function editorialRequirements(dayPlan, contentDay, writingLines) {
  const requirements = [];
  if (contentDay.density === "dense") requirements.push("Priorizar corpo, entrelinha e largura de coluna para manter a leitura confortável.");
  else requirements.push("Manter fluxo de leitura contínuo e usar o branco como parte da condução.");
  requirements.push(`Reservar espaço de escrita para ${quantity(contentDay.reflectionPrompts.length, "resposta", "respostas")} com cada pergunta completa.`);
  if (contentDay.characters > 4200 && writingLines >= 20) requirements.push("Validar paginação: texto denso e área de escrita extensa coincidem neste dia.");
  if (contentDay.hasDeeperNote) requirements.push("Distinguir o aprofundamento por contraste tipográfico e espaço.");
  if (contentDay.hasSong) requirements.push("Encerrar com uma chamada tipográfica de escuta.");
  for (const slot of dayPlan.slots) {
    if (slot === "structure_only") requirements.push("Conduzir a página com texto, espaço e gesto de came.");
    if (slot === "material_echo") requirements.push("Eco material fora da coluna, em uma tinta e com alfa verdadeiro.");
    if (slot === "object_echo") requirements.push("Objeto narrativo único, reconhecível e subordinado à leitura.");
    if (slot === "transition_gesture") requirements.push("Marcar a transição por ritmo, espaço e came.");
    if (slot === "functional_diagram") requirements.push("O diagrama deve tornar uma escolha, comparação ou sequência executável.");
    if (slot === "exercise_scene_black_only") requirements.push("Usar uma cena narrativa em uma tinta para acompanhar a ação da leitora.");
    if (slot === "closure_color") requirements.push("Retomar a cor como resposta da leitora e resolução do Dia 7.");
  }
  return [...new Set(requirements)];
}

function blockAudit(block) {
  return `<article><header><span>${escapeHtml(componentLabels[block.kind] ?? sentence(block.kind))}</span><small>${new Intl.NumberFormat("pt-BR").format(block.characters)} caracteres</small></header><p>${escapeHtml(block.excerpt)}</p></article>`;
}

function illustrationFigure(record, womanName, label) {
  const preview = previewAsset(record);
  if (preview) {
    return `<figure class="woman-detail-image"><img src="${escapeHtml(sitePath(preview))}" alt="${escapeHtml(label)} de ${escapeHtml(womanName)}" loading="lazy" decoding="async"><figcaption><b>${escapeHtml(label)}</b><span>${escapeHtml(editorialStatus(record))} · ${escapeHtml(technicalStatus(record.status))}</span></figcaption></figure>`;
  }
  return `<div class="woman-detail-absence"><span>${escapeHtml(label)} · direção registrada</span><p>A imagem será desenvolvida a partir da narrativa desta jornada.</p></div>`;
}

function womanVisualNeeds(week, woman) {
  const daysFor = (slot) => week.days
    .filter((day) => day.slots.includes(slot))
    .map((day) => `Dia ${String(day.day).padStart(2, "0")} · ${sentence(day.cue)}`);
  const card = (label, medium, items, state, tone = "ink") => `<article class="woman-visual-need is-${tone}">
    <header><span>${escapeHtml(label)}</span><small>${escapeHtml(medium)}</small></header>
    <strong>${escapeHtml(state)}</strong>
    ${items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>Sem ocorrência nesta jornada.</p>"}
  </article>`;
  const imageState = (record) => previewAsset(record) ? `${editorialStatus(record)} · ${technicalStatus(record.status)}` : "placeholder canônico · imagem ausente";
  const objectDays = daysFor("object_echo");
  const materialDays = daysFor("material_echo");
  const diagramDays = [...daysFor("functional_diagram"), ...daysFor("exercise_scene_black_only")];
  return `<section class="woman-visual-plan" aria-label="Plano visual de ${escapeHtml(week.woman)}">
    <header><span>Plano visual sincronizado</span><h4>O que esta jornada precisa produzir e integrar.</h4><p>Estes placeholders vêm da mesma direção que monta a prancha e o livro; não formam uma lista paralela.</p></header>
    <div class="woman-visual-needs">
      ${card("Abertura", "cor · 1 limiar", [sentence(week.opening_state)], imageState(woman.illustration), "color")}
      ${card("Percurso", "preto · 1 estrutura", [sentence(week.atlas_model)], "direção definida · execução em specimen")}
      ${card("Objeto narrativo", `preto · ${objectDays.length} ocorrência(s)`, objectDays, objectDays.length ? "placeholders localizados por dia" : "ausência intencional")}
      ${card("Matéria e ornamento", `preto · ${materialDays.length} ocorrência(s)`, materialDays, materialDays.length ? "placeholders localizados por dia" : "ausência intencional")}
      ${card("Diagrama ou cena", `preto · ${diagramDays.length} ocorrência(s)`, diagramDays, diagramDays.length ? "necessidade funcional localizada" : "ausência intencional")}
      ${card("Resposta da Leitora", "cor · 1 chegada", [sentence(week.closure_state), sentence(week.exercise_focus)], imageState(woman.response_illustration), "color")}
    </div>
  </section>`;
}

function dayCard(dayPlan, contentDay, arc) {
  const writingLines = writingLineTotal(dayPlan, contentDay);
  const paginationRisk = contentDay.characters > 4200 && writingLines >= 20;
  const slots = dayPlan.slots.map((slot) => `<span class="slot slot--${escapeHtml(slot)}">${escapeHtml(slotLabels[slot] ?? sentence(slot))}</span>`).join("");
  const components = contentDay.components.map((component) => componentLabels[component] ?? sentence(component)).join(" · ");
  const promptItems = contentDay.reflectionPrompts.length
    ? contentDay.reflectionPrompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")
    : "<li>A reflexão existe no manuscrito, sem subtítulos de pergunta detectáveis.</li>";
  const firstPrompt = contentDay.reflectionPrompts[0] ?? contentDay.contentAnchors.silence;
  const requirements = editorialRequirements(dayPlan, contentDay, writingLines).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const extra = dayPlan.asset_status ? `<p class="asset-note">Ativo: ${escapeHtml(assetStatus(dayPlan.asset_status))}</p>` : "";
  const paginationAlert = paginationRisk ? '<p class="pagination-risk">Gate de paginação · conferir este dia no specimen antes de aprovar corpos e espaços.</p>' : "";
  return `<article class="day-library-card${contentDay.density === "dense" ? " is-dense" : ""}${paginationRisk ? " is-pagination-risk" : ""}" data-day="${contentDay.day}">
    <header><span>Dia ${String(contentDay.day).padStart(2, "0")}</span><small>${escapeHtml(phaseLabels[arc] ?? sentence(arc))}</small></header>
    <div class="day-audit-main">
      <section class="day-audit-title"><h4>${escapeHtml(contentDay.subtitle)}</h4><p class="day-cue">${escapeHtml(sentence(dayPlan.cue))}</p><div class="day-slots">${slots}</div></section>
      <section class="day-audit-reading"><span>Núcleo do texto</span><p>${escapeHtml(contentDay.contentAnchors.reading || contentDay.contentAnchors.opening)}</p></section>
      <section class="day-audit-action"><span>Ação pedida à leitora</span><p>${escapeHtml(firstPrompt)}</p></section>
      <section class="day-audit-design"><span>O que a página precisa fazer</span><ul>${requirements}</ul></section>
    </div>
    <div class="day-metrics">
      ${metric("densidade", densityLabels[contentDay.density] ?? contentDay.density)}
      ${metric("caracteres", new Intl.NumberFormat("pt-BR").format(contentDay.characters))}
      ${metric("linhas de escrita", String(writingLines))}
      ${metric("perguntas", String(contentDay.reflectionPrompts.length))}
      ${metric("citações", String(contentDay.pullQuotes))}
    </div>
    <p class="day-components"><b>Sequência editorial</b>${escapeHtml(components)}</p>
    ${extra}
    ${paginationAlert}
    <details class="day-content-audit"><summary>Ver todos os trechos deste dia</summary>
      <div class="day-block-audit">${contentDay.blockExcerpts.map(blockAudit).join("")}</div>
      <section class="day-prompt-audit"><span>Perguntas preservadas literalmente</span><ul>${promptItems}</ul></section>
    </details>
  </article>`;
}

function renderDetail() {
  const { week, choreography, content, woman } = findWeek(activeWeek);
  const weeks = visibleWeeks();
  const activeIndex = weeks.findIndex((item) => item.week === activeWeek);
  const previous = weeks[activeIndex - 1];
  const next = weeks[activeIndex + 1];
  const media = `<div class="woman-detail-images">
    ${illustrationFigure(woman.illustration, woman.name, "Abertura · mulher bíblica")}
    ${illustrationFigure(woman.response_illustration, woman.name, "Encerramento · resposta da leitora")}
  </div>`;
  const arc = boardData.artDirection.narrative_library.universal_day_arc;
  const motif = boardData.artDirection.illustration_system.weekly_motifs.find((item) => item.week === activeWeek);
  const emblem = motif?.emblem_asset ? `<img class="woman-detail-emblem" src="${escapeHtml(sitePath(motif.emblem_asset))}" alt="Assinatura visual de ${escapeHtml(week.woman)}">` : "";
  detail.innerHTML = `
    <nav class="woman-detail-nav" aria-label="Navegar entre jornadas">
      <a href="#biblioteca">← Voltar às 20 mulheres</a>
      <span>
        <button type="button" data-previous-week${previous ? ` data-week="${previous.week}"` : " disabled"}>← Anterior</button>
        <button type="button" data-next-week${next ? ` data-week="${next.week}"` : " disabled"}>Próxima →</button>
        <a class="woman-book-link" href="${sitePath(`/dev/?view=book&scope=woman-${week.week}`)}" target="_top">Ver esta mulher no livro ↗</a>
      </span>
    </nav>
    <header class="woman-detail-hero">
      ${media}
      <div class="woman-detail-intro">${emblem}<p class="kicker">Semana ${String(week.week).padStart(2, "0")} · Volume ${woman.volume === "volume_1" ? "I" : "II"}</p><h3>${escapeHtml(week.woman)}</h3><p>${escapeHtml(sentence(week.exercise_focus))}</p></div>
    </header>
    <div class="week-contract">
      <article class="is-color"><span>Abertura · cor</span><p>${escapeHtml(sentence(week.opening_state))}</p></article>
      <article><span>Percurso · uma tinta</span><p>${escapeHtml(sentence(week.atlas_model))}</p></article>
      <article class="is-black"><span>Sete dias · uma tinta</span><p>Came oco, papel e alfa sustentam uma leitura contínua e confortável.</p></article>
      <article class="is-color"><span>Resposta · cor</span><p>${escapeHtml(sentence(week.closure_state))}</p></article>
    </div>
    <div class="choreography-contract">
      <article><span>Camada · mundo</span><p>${escapeHtml(narrativeSentence(choreography.opening_layer))}<br>${escapeHtml(narrativeSentence(choreography.historical_world))}</p></article>
      <article><span>Espaço · corpo</span><p>${escapeHtml(narrativeSentence(choreography.environment))}<br>${escapeHtml(narrativeSentence(choreography.body_level))}</p></article>
      <article><span>Campo · composição</span><p>${escapeHtml(narrativeSentence(choreography.social_field))}<br>${escapeHtml(narrativeSentence(choreography.composition_mode))}</p></article>
      <article><span>Movimento · foco</span><p>${escapeHtml(narrativeSentence(choreography.motion))}<br>${escapeHtml(narrativeSentence(choreography.focal_zone))}</p></article>
      <article><span>Horizonte · cor</span><p>${escapeHtml(narrativeSentence(choreography.horizon))}<br>${escapeHtml(narrativeSentence(choreography.chromatic_bias))}</p></article>
      <article><span>Contraste na coleção</span><p>${escapeHtml(narrativeSentence(choreography.contrast_to_neighbors))}</p></article>
    </div>
    ${womanVisualNeeds(week, woman)}
    <div class="day-library-grid">${week.days.map((dayPlan) => dayCard(dayPlan, content.days.find((day) => day.day === dayPlan.day), arc[dayPlan.day])).join("")}</div>`;
  detail.querySelectorAll("[data-previous-week], [data-next-week]").forEach((button) => button.addEventListener("click", () => selectWeek(Number(button.dataset.week))));
}

function activateFilters() {
  volumeButtons.forEach((button) => button.addEventListener("click", () => {
    activeVolume = button.dataset.volume;
    volumeButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
    renderComparison();
    renderDetail();
    window.parent.postMessage({ type: "jsm-library-selection", week: activeWeek }, location.origin);
  }));
  womanSearch.addEventListener("input", () => {
    activeSearch = womanSearch.value.trim().toLocaleLowerCase("pt-BR");
    renderComparison();
    renderDetail();
  });
  womanJump.addEventListener("change", () => {
    activeSearch = "";
    activeVolume = "all";
    womanSearch.value = "";
    volumeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.volume === "all")));
    selectWeek(Number(womanJump.value));
  });
}

function renderBoard(data) {
  boardData = data;
  womanJump.innerHTML = data.women.map((woman) => `<option value="${woman.week}">${String(woman.week).padStart(2, "0")} · ${escapeHtml(woman.name)}</option>`).join("");
  womanJump.value = String(activeWeek);
  renderVisualControl(data);
  const labels = data.inventory.projection_contract?.client_labels ?? {
    narrative_board: "Jornadas das 20 mulheres",
  };
  document.title = `${labels.narrative_board} · ${data.publication.brand.name}`;
  document.querySelector(".studio-hero .kicker").textContent = `${labels.narrative_board} · ${data.publication.brand.name}`;
  coverAnchorPair.innerHTML = [1, 2].map((volume) => {
    const cover = data.publication.volumes[volume];
    return `<figure class="cover-anchor"><img src="${escapeHtml(sitePath(cover.cover_front))}" alt="Frente de capa consolidada do Volume ${escapeHtml(cover.numeral)}"><figcaption><b>Volume ${escapeHtml(cover.numeral)}</b><span>${escapeHtml(cover.tagline)}</span></figcaption></figure>`;
  }).join("");
  const formatReview = data.artDirection.editorial_image_format_review;
  const visualControl = data.artDirection.official_control_set;
  formatReviewSummary.innerHTML = `<span>Direção oficial de abertura</span><p>A matriz aplica o limiar integrado em sangria total às três aberturas do conjunto de controle.</p><small>É a única direção de layout para imagem, texto e respiro; resolução e contraste ainda serão confirmados no specimen físico.</small>`;
  formatHypothesisGrid.innerHTML = formatReview.format_hypotheses.map((item) => formatHypothesisCard(item, visualControl)).join("");
  closureFormatGrid.innerHTML = formatReview.closure_format_hypotheses.map((item) => closureFormatCard(item, visualControl)).join("");
  const placeholderLibrary = data.inventory.placeholder_library;
  universalList.innerHTML = Object.entries(placeholderLibrary.universal).map((entry) => placeholderCard(entry)).join("");
  specificList.innerHTML = Object.entries(placeholderLibrary.woman_specific).map((entry) => placeholderCard(entry, true)).join("");

  const weeks = data.artDirection.narrative_library.weeks;
  const days = data.narrativeContent.reduce((sum, item) => sum + item.days.length, 0);
  const diagrams = weeks.reduce((sum, week) => sum + (countSpecials(week).functional_diagram ?? 0), 0);
  const scenes = weeks.reduce((sum, week) => sum + (countSpecials(week).exercise_scene_black_only ?? 0), 0);
  auditStatus.textContent = `${weeks.length} mulheres · ${days} dias lidos · ${quantity(diagrams, "diagrama", "diagramas")} · ${quantity(scenes, "cena especial", "cenas especiais")}`;

  const hashWeek = Number(location.hash.match(/^#mulher-(\d+)$/u)?.[1]);
  if (hashWeek >= 1 && hashWeek <= 20) activeWeek = hashWeek;
  renderComparison();
  renderDetail();
  activateFilters();
  if (hashWeek) window.parent.postMessage({ type: "jsm-library-selection", week: activeWeek }, location.origin);
  if (location.hash === "#biblioteca") setTimeout(() => scrollInsideBoard(document.querySelector(location.hash)), 0);
  if (hashWeek) setTimeout(() => scrollInsideBoard(detail), 0);
}

fetch(dataPath("design-system"), { cache: "no-store" })
  .then(async (response) => {
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Não foi possível ler a biblioteca narrativa.");
    return payload;
  })
  .then(renderBoard)
  .catch((error) => {
    auditStatus.textContent = "A leitura canônica precisa de atenção.";
    comparison.innerHTML = `<p class="women-production-error">${escapeHtml(error.message)}</p>`;
  });
