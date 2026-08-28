import { dataPath, sitePath } from "./runtime.js?v=488b7e8";

const root = document.querySelector("#system-root");
const sectionJump = document.querySelector("#section-jump");

sectionJump?.addEventListener("change", () => {
  const target = document.querySelector(`#${CSS.escape(sectionJump.value)}`);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${sectionJump.value}`);
});

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function componentEntries(inventory) {
  return ["atoms", "assets", "molecules", "organisms", "templates"].flatMap((group) =>
    Object.entries(inventory[group] ?? {}).map(([key, value]) => ({ group, key, ...value })));
}

const roleLabels = {
  cover: "capa", title: "rosto", legal: "expediente", dedication: "dedicatória", introduction: "introdução", guide: "guia", author: "autoria", colophon: "colofão",
  color_opening: "abertura em cor", black_only_atlas: "percurso em preto", seven_days: "sete dias", color_closure: "resposta em cor",
  day_header: "cabeçalho", opening: "chegada", scripture_quotation: "Escritura", reading: "leitura", deeper_note: "aprofundamento", silence: "silêncio", reflection: "reflexão", christ: "encontro com Cristo", prayer: "oração", keepsake: "memória", truth: "verdade", song: "canção",
  intentional_blank: "branco intencional", color_verso: "verso de cor", parity: "paridade", binding_safe_area: "margem de encadernação", bleed: "sangria", preflight: "verificação técnica",
};

function sequence(items) {
  return `<ol class="system-sequence">${items.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><b>${escapeHtml(roleLabels[item] ?? item)}</b></li>`).join("")}</ol>`;
}

function swatch(tokens, name, label, purpose) {
  return `<article class="material-role"><i style="background:${escapeHtml(tokens.color[name])}"></i><div><span>${escapeHtml(label)}</span><b>${escapeHtml(purpose)}</b><code>${escapeHtml(tokens.color[name])}</code></div></article>`;
}

function humanize(value) {
  return String(value ?? "").replaceAll("_", " ");
}

function coverFigure(publication, volume) {
  const data = publication.volumes[volume];
  return `<figure class="canonical-cover"><img src="${escapeHtml(sitePath(data.cover_front))}" alt="Capa frontal consolidada do Volume ${escapeHtml(data.numeral)}"><figcaption><b>Volume ${escapeHtml(data.numeral)}</b><span>${escapeHtml(data.tagline)}</span></figcaption></figure>`;
}

const placeholderLabels = {
  running_context: "contexto corrente",
  folio_navigation: "fólio",
  day_header_gesture: "gesto do cabeçalho",
  scripture_threshold: "limiar da Escritura",
  reading_flow: "fluxo de leitura",
  deeper_note: "aprofundamento",
  pull_quote: "citação de síntese",
  silence_pause: "pausa de silêncio",
  reflection_writing: "reflexão e escrita",
  christ_encounter: "encontro com Cristo",
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

const placeholderMediumLabels = {
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

function placeholderFrequency(spec) {
  if (spec.occurrence === "every_day") return "todos os dias";
  if (spec.occurrence === "every_page") return "todas as páginas de leitura";
  if (spec.occurrence === "when_present") return "quando existe";
  if (spec.occurrence === "content_driven") return "conforme conteúdo";
  if (spec.occurrence === "once_per_week_at_first_source_mention") return "1 ficha visual por semana; repetição permanece na fonte";
  if (spec.occurrence_per_week_max) return `até ${spec.occurrence_per_week_max} por mulher`;
  if (spec.occurrence_per_week) return `${spec.occurrence_per_week} por mulher`;
  return humanize(spec.occurrence) || "conforme conteúdo";
}

function placeholderRows(placeholders, scope) {
  return Object.entries(placeholders).map(([key, spec]) => `<article>
    <span>${escapeHtml(placeholderFrequency(spec))}</span>
    <h3>${escapeHtml(placeholderLabels[key] ?? humanize(key))}</h3>
    <p>${escapeHtml(humanize(spec.role))}</p>
    <small>${escapeHtml(scope)} · ${escapeHtml(placeholderMediumLabels[spec.medium] ?? humanize(spec.medium))}</small>
  </article>`).join("");
}

function componentRegister(placeholders) {
  const groups = [
    ["Estrutura compartilhada", "universal", placeholders.universal],
    ["Expressão de cada jornada", "por mulher", placeholders.woman_specific],
  ];
  const sections = groups.map(([title, scope, entries]) => `<section>
    <header><span>${escapeHtml(scope)}</span><h3>${escapeHtml(title)}</h3></header>
    <div>${Object.entries(entries).map(([key, spec]) => `<article>
      <span>${escapeHtml(placeholderFrequency(spec))}</span>
      <h4>${escapeHtml(placeholderLabels[key] ?? humanize(key))}</h4>
      <p>${escapeHtml(placeholderMediumLabels[spec.medium] ?? humanize(spec.medium))}</p>
    </article>`).join("")}</div>
  </section>`).join("");
  return `<div class="component-register" aria-label="Inventário completo de componentes">${sections}</div>`;
}

function openingLockupContract(inventory) {
  const contract = inventory.organisms?.woman_opening?.title_lockup_contract;
  const specimen = contract?.specimen;
  if (!contract || !specimen) return "";
  return `<section class="opening-lockup-contract" aria-labelledby="opening-lockup-contract-title">
    <header><span>Lockup canônico das vinte aberturas</span><h3 id="opening-lockup-contract-title">Uma assinatura, quatro zonas de encaixe.</h3><p>${escapeHtml(contract.repeatability)}</p></header>
    <div class="opening-lockup-specimen">
      <span class="opening-lockup-script">Encontro com</span>
      <b>${escapeHtml(specimen.woman)}</b>
      <small>${escapeHtml(specimen.tagline)}</small>
    </div>
    <dl><div><dt>Glendora</dt><dd>encontro</dd></div><div><dt>Cormorant</dt><dd>nome bordô</dd></div><div><dt>Poppins</dt><dd>tagline romana</dd></div></dl>
  </section>`;
}

function semanticLockupBoard(artDirection) {
  const week = artDirection?.narrative_library?.weeks?.find((entry) => entry.week === 1);
  const assets = week?.shared_assets ?? {};
  const items = [
    ["Texto de Hoje", "scripture_mark", "Livro aberto sem flor, marcador da leitura bíblica."],
    ["Silêncio no Jardim", "silence_petal", "Uma folha de amendoeira em movimento, sem ramos."],
    ["Reflexão e Escrita", "reflection_mark", "Pena e linhas curtas identificam escrita e aprofundamento."],
    ["Cristo na Jornada", "christ_mark", "Dois caminhos se aproximam e preservam uma abertura central."],
    ["Conversa com Deus", "conversation_mark", "Duas mãos distinguem fala e escuta."],
    ["Oração", "prayer_mark", "Mãos unidas, compactas e sem moldura."],
    ["Para o Coração", "heart_mark", "Coração facetado identifica o campo de memória."],
    ["Verdade para Guardar", "truth_mark", "Chama facetada marca a síntese a guardar."],
    ["Canção da Semana", "song_mark", "Lira antiga compacta identifica a música sem nota ou ondas."],
  ];
  return `<section class="semantic-lockup-board" aria-labelledby="semantic-lockup-title">
    <header><span>Vocabulário semântico do miolo</span><h3 id="semantic-lockup-title">Nove sinais, uma linha-base.</h3><p>O ícone trabalha como marcador editorial à esquerda do título recorrente. Glendora, escala e peso de came permanecem constantes.</p></header>
    <div>${items.map(([label, key, description]) => `<article><span>${escapeHtml(label)}</span>${assets[key] ? `<img src="${escapeHtml(sitePath(assets[key]))}" alt="">` : `<i>ativo ausente</i>`}<p>${escapeHtml(description)}</p></article>`).join("")}
      <article class="semantic-lockup-progress"><span>Navegação semanal</span><div><em>7 dias</em><b>Progresso por página</b></div><p>Sete bolinhas mostram dias concluídos e a fração percorrida da leitura atual.</p></article>
      <article class="semantic-lockup-journey"><span>Navegação do volume</span><div><em>Sara</em><b>Sem contador de jornada</b><strong>27</strong></div><p>O fólio físico centralizado orienta sem introduzir o ambíguo “1 de 10”.</p></article>
    </div>
  </section>`;
}

function womanEmblemBoard(artDirection) {
  const motifs = artDirection?.illustration_system?.weekly_motifs ?? [];
  if (!motifs.length) return "";
  return `<section class="woman-emblem-board" aria-labelledby="woman-emblem-title">
    <header><span>Assinaturas das jornadas</span><h3 id="woman-emblem-title">Vinte emblemas, uma família de came.</h3><p>Cada sinal abstrai matéria e movimento da mulher. Entra primeiro no percurso e não duplica o objeto dominante da abertura colorida.</p></header>
    <div>${motifs.map((motif) => `<article><span>${String(motif.week).padStart(2, "0")}</span>${motif.emblem_asset ? `<img src="${escapeHtml(sitePath(motif.emblem_asset))}" alt="">` : `<i>ativo ausente</i>`}<b>${escapeHtml(motif.woman)}</b><p>${escapeHtml(humanize(motif.came_gesture))}</p></article>`).join("")}</div>
  </section>`;
}

function typographySpecimenMatrix(families, page) {
  const specimen = families.reading?.specimen ?? {};
  const sizes = specimen.candidate_sizes_pt ?? [];
  const lineHeights = specimen.candidate_line_heights_pt ?? [];
  const weights = specimen.candidate_weights ?? [];
  const usefulWidth = Number(page.trim_mm?.[0] ?? 160) - Number(page.margin_mm?.inner ?? 18) - Number(page.margin_mm?.outer ?? 15);
  const combinations = sizes.flatMap((size, index) => weights.map((weight) => ({
    size,
    lineHeight: lineHeights[index] ?? lineHeights[0] ?? size,
    weight,
  })));
  const cards = combinations.slice(0, 6).map((combo, index) => `<article class="type-specimen-card" data-specimen-size="${escapeHtml(combo.size)}" data-specimen-line-height="${escapeHtml(combo.lineHeight)}" data-specimen-weight="${escapeHtml(combo.weight)}">
      <header><span>Hipótese ${String(index + 1).padStart(2, "0")}</span><b>${escapeHtml(combo.size)} / ${escapeHtml(combo.lineHeight)} pt · ${escapeHtml(combo.weight)}</b></header>
      <p class="type-specimen__text" style="font-size:${escapeHtml(combo.size)}pt;line-height:${escapeHtml(combo.lineHeight)}pt;font-weight:${escapeHtml(combo.weight)}">Este é um texto de espécime para comparar ritmo, textura e permanência da leitura. A decisão final depende da prova impressa em 100% no papel de trabalho.</p>
      <footer><span class="specimen-measure">calculando caracteres por linha…</span><span>hipótese — requer impressão 100%</span></footer>
    </article>`).join("");
  const role = (family, label, use, className) => `<article class="type-role type-role--${className}"><span>${escapeHtml(label)}</span><strong style="font-family:'${escapeHtml(family.family)}'">${escapeHtml(family.display_label ?? family.family)}</strong><p>${escapeHtml(use)}</p></article>`;
  return `<div class="type-specimen" aria-labelledby="type-specimen-title">
    <header class="type-specimen-heading"><div><span>Espécime de decisão</span><h3 id="type-specimen-title">Seis combinações para o corpo de leitura.</h3></div><p>Coluna útil equivalente: <b>${escapeHtml(usefulWidth.toFixed(1))} mm</b>. As amostras abaixo são hipóteses de trabalho, não escolhas aprovadas.</p></header>
    <div class="type-specimen-grid">${cards}</div>
    <p class="type-specimen-note">A contagem de caracteres é uma estimativa dinâmica do texto exibido na largura da amostra; a confirmação editorial depende de impressão a 100%, hifenização, ganho de ponto e encadernação.</p>
    <div class="type-role-band" aria-label="Papéis tipográficos estratégicos">
      ${role(families.display, "Cormorant · leitura e display", "Títulos, passagens e corpo de leitura mantêm uma voz serifada contínua.", "display")}
      ${role(families.label, "Poppins · rótulo", "Navegação, metadados e instruções breves orientam sem competir com o texto; nunca assume títulos editoriais ou de componentes.", "label")}
      ${role(families.accent, "Glendora · gesto caligráfico", "Encontro, pausa, passagem e síntese em frases muito curtas; nunca blocos longos.", "accent")}
    </div>
  </div>`;
}

function sovereignReferenceCard(reference) {
  return `<figure><img src="${escapeHtml(sitePath(reference.file))}" alt="${escapeHtml(reference.label)}" loading="lazy" decoding="async"><figcaption><b>${escapeHtml(reference.label)}</b><span>referência aprovada</span></figcaption></figure>`;
}

function componentSpecimenExcerpt(day, sample) {
  if (!day) return { type: "missing", text: "Dia canônico não localizado.", characters: 0 };
  if (sample.source === "scripture") {
    const text = day.contentAnchors?.scripture ?? "";
    return { type: "quote", text, characters: text.length };
  }
  if (sample.source === "pull_quote") {
    const text = day.pullQuoteExcerpts?.[0] ?? "";
    return { type: "pull", text, characters: text.length };
  }
  if (sample.source === "reflection") {
    const prompts = day.reflectionPrompts ?? [];
    return { type: "prompts", prompts, text: prompts.join(" "), characters: prompts.join(" ").length };
  }
  if (sample.source === "keepsake") {
    const block = day.blockExcerpts?.find((entry) => entry.kind === "heart");
    return { type: "keepsake", text: block?.title ?? "Campo de memória", characters: block?.characters ?? 0 };
  }
  const kind = sample.source === "deeper-note" ? "deeper-note" : sample.source;
  const block = day.blockExcerpts?.find((entry) => entry.kind === kind);
  const text = block?.excerpt ?? day.contentAnchors?.[sample.source] ?? "";
  return { type: sample.source, text, characters: block?.characters ?? text.length };
}

function componentSpecimenBody(excerpt) {
  if (excerpt.type === "prompts") {
    if (!excerpt.prompts?.length) return '<p class="component-specimen-missing">Componente não presente neste dia.</p>';
    return `<ol class="component-specimen-prompts">${excerpt.prompts.map((prompt) => `<li><p>${escapeHtml(prompt)}</p><i></i><i></i><i></i></li>`).join("")}</ol>`;
  }
  if (!excerpt.text) return '<p class="component-specimen-missing">Componente não presente neste dia.</p>';
  if (excerpt.type === "quote") return `<blockquote>${escapeHtml(excerpt.text)}</blockquote>`;
  if (excerpt.type === "pull") return `<p class="component-specimen-pull">${escapeHtml(excerpt.text)}</p>`;
  if (excerpt.type === "keepsake") return `<div class="component-specimen-keepsake"><p>${escapeHtml(excerpt.text)}</p><i></i><i></i></div>`;
  return `<p>${escapeHtml(excerpt.text)}</p>`;
}

function componentSpecimenMatrix(inventory, narrativeContent) {
  const review = inventory.component_specimen_review;
  if (!review?.samples?.length) return "";
  const cards = review.samples.map((sample) => {
    const journey = narrativeContent.find((entry) => entry.week === sample.week);
    const day = journey?.days.find((entry) => entry.day === sample.day);
    const excerpt = componentSpecimenExcerpt(day, sample);
    const href = sitePath(`/dev/?view=book&scope=woman-${sample.week}&day=${sample.day}&component=${sample.target}`);
    return `<article class="component-specimen-card component-specimen--${escapeHtml(sample.id)}" data-component-specimen="${escapeHtml(sample.id)}" data-density="${escapeHtml(sample.density_label)}">
      <header><span>${escapeHtml(sample.rhythm)} · densidade ${escapeHtml(sample.density_label)}</span><b>${escapeHtml(journey?.woman ?? `Semana ${sample.week}`)} · Dia ${String(sample.day).padStart(2, "0")}</b></header>
      <div class="component-specimen-stage"><span class="component-specimen-label">${escapeHtml(sample.label)}</span>${componentSpecimenBody(excerpt)}</div>
      <footer><span>${new Intl.NumberFormat("pt-BR").format(excerpt.characters)} caracteres no bloco</span><p>${escapeHtml(sample.risk)}</p><a href="${escapeHtml(href)}" target="_top">ver na página real →</a></footer>
    </article>`;
  }).join("");
  return `<section class="component-specimen-review" aria-labelledby="component-specimen-title">
    <header><div><span>Specimen de decisão · conteúdo real</span><h3 id="component-specimen-title">11 specimens comparáveis · 14 funções universais.</h3></div><p>${escapeHtml(review.gate)}</p></header>
    <div class="component-specimen-grid">${cards}</div>
    <p class="component-specimen-note">Sistema oficial de layout, ainda sujeito à prova física. Os trechos vêm do conteúdo canônico; a matriz não reescreve o manuscrito e corresponde ao livro normal.</p>
  </section>`;
}

function renderSystem(data) {
  const { tokens, inventory, typography, publication, tokenCss, sources, references, narrativeContent, artDirection } = data;
  const labels = inventory.projection_contract?.client_labels ?? { ecosystem_board: "Regras do livro" };
  const architecture = inventory.system_architecture;
  const entries = componentEntries(inventory);
  const families = typography.families;
  const page = tokens.page;
  const placeholders = inventory.placeholder_library;
  const sovereignReferenceCards = references.map(sovereignReferenceCard).join("");
  const groupCounts = ["atoms", "assets", "molecules", "organisms", "templates"].map((group) => `<li><span>${escapeHtml(group)}</span><b>${Object.keys(inventory[group] ?? {}).length}</b></li>`).join("");
  const sourceItems = sources.map((source) => `<li><code>${escapeHtml(source)}</code></li>`).join("");

  document.head.append(Object.assign(document.createElement("style"), { textContent: tokenCss }));
  document.title = `${publication.brand.name} · ${labels.ecosystem_board}`;

  root.innerHTML = `
    <section class="system-section system-section--ink" id="foundations">
      <header class="section-heading"><div><p>01 · Fundações</p><h2>Uma linguagem comum para vinte jornadas.</h2></div><span>clareza antes de ornamento</span></header>
      <div class="foundation-thesis">
        <article><span>Estrutura editorial</span><h3>Arquitetura e conforto</h3><p>Ordem, margens, hierarquia, densidade e funções editoriais tornam a coleção reconhecível e confortável.</p></article>
        <article><span>Expressão da jornada</span><h3>Território narrativo</h3><p>Paisagem, matéria, objeto, gesto, ritmo e composição nascem do conteúdo específico de cada mulher.</p></article>
        <article><span>Respiro e foco</span><h3>Espaço com intenção</h3><p>Texto, imagem, came e papel se alternam para orientar a leitura e dar força a cada gesto.</p></article>
      </div>
      <div class="material-ledger">
        ${swatch(tokens, "interior_heading", "K90", "títulos e numerais")}
        ${swatch(tokens, "ink", "K85", "corpo e texto pequeno")}
        ${swatch(tokens, "interior_secondary", "K65", "contexto e navegação")}
        ${swatch(tokens, "interior_rule", "K30", "filetes e linhas de escrita")}
        ${swatch(tokens, "interior_wash", "K10", "superfície quieta, quando necessária")}
      </div>
      <p class="section-note">Todo o miolo é separado em uma única tinta preta. Azul, vinho, dourado e demais cores aparecem somente nas aberturas e encerramentos; o papel creme é o suporte físico, não uma tinta de fundo.</p>
    </section>

    <section class="system-section" id="typography">
      <header class="section-heading"><div><p>02 · Tipografia</p><h2>Uma voz, diferentes intensidades.</h2></div><span>famílias definidas · métricas em ajuste</span></header>
      <div class="type-stage">
        <article class="type-hero"><span>Título e passagem · ${escapeHtml(families.display.family)}</span><strong>Títulos abrem espaço para cada passagem.</strong></article>
        <article class="type-reading"><span>Leitura longa · ${escapeHtml(families.reading.family)}</span><p>Corpo, entrelinha e largura de coluna são escolhidos para que a leitora permaneça no texto com conforto.</p></article>
        <article class="type-accent"><span>Acento breve · ${escapeHtml(families.accent.family)}</span><strong>respire</strong><p>Uma palavra ou assinatura muda a temperatura e marca um instante de pausa.</p></article>
        <article class="type-label"><span>Orientação · ${escapeHtml(families.label.family)}</span><strong>SEMANA 01 · SARA · DIA 03 DE 07</strong><p>Rótulos breves localizam a leitora e completam a hierarquia editorial.</p></article>
      </div>
      <div class="type-contract">
        <p><b>Texto corrido</b><span>${tokens.typography.reading.size_pt} pt / ${tokens.typography.reading.line_height_pt} pt orienta o specimen inicial de conforto.</span></p>
        <p><b>Pesos</b><span>Normal, médio e itálico reais preservam a forma original das famílias.</span></p>
        <p><b>Glendora</b><span>Usada estrategicamente em encontro, pausa, passagem e síntese; sempre curta e nunca no corpo de leitura.</span></p>
        <p><b>Início de texto</b><span>O primeiro parágrafo usa o mesmo corpo e a mesma linha de base da leitura.</span></p>
      </div>
      ${typographySpecimenMatrix(families, page)}
    </section>

    <section class="system-section system-section--sand" id="imagery">
      <header class="section-heading"><div><p>03 · Imagens</p><h2>A arte nasce da jornada e entra com propósito.</h2></div><span>integração · frequência · ritmo</span></header>
      <div class="image-authority">
        <div class="canonical-cover-pair">${coverFigure(publication, 1)}${coverFigure(publication, 2)}</div>
        <div class="image-system-boundary">
          <span>Direção das imagens</span>
          <h3>Uma regra comum, vinte expressões.</h3>
          <p>Recorte, alfa, came, contraste, frequência e posição integram a arte ao livro. Território, objeto e composição são desenvolvidos a partir da narrativa de cada mulher.</p>
          <a href="${sitePath("/dev/?view=library")}" target="_top">Explorar as vinte jornadas →</a>
        </div>
      </div>
      <div class="reference-calibration">
        <header><div><span>Referências visuais</span><h3>Matéria, luz e delicadeza partem destas três imagens aprovadas.</h3></div><p>Elas orientam o comportamento visual da coleção; cada jornada desenvolve essa direção com sua própria narrativa.</p></header>
        <div class="reference-strip">${sovereignReferenceCards}</div>
      </div>
      <div class="ornament-contract">
        <article class="ornament-sample ornament-sample--landscape"><i></i><span>Faixa · conduz a transição</span></article>
        <article class="ornament-sample ornament-sample--cutout"><i></i><span>Recorte · alfa integrado ao papel</span></article>
        <article class="ornament-sample ornament-sample--absence"><i></i><span>Respiro · espaço como composição</span></article>
        <div class="ornament-rules">
          <p><b>Cor</b><span>Marca as páginas de abertura e encerramento.</span></p><p><b>Preto</b><span>Traduz a composição em came oco, com dois contornos e centro aberto.</span></p><p><b>Alfa</b><span>Integra o recorte ao papel com bordas transparentes e limpas.</span></p><p><b>Frequência</b><span>Uma faixa, até dois fragmentos pequenos e um objeto por mulher mantêm o ritmo.</span></p><p><b>Forma</b><span>Came duplo, gesto próprio da mulher e composição integrada à página.</span></p>
        </div>
      </div>
    </section>

    <section class="system-section" id="components">
      <header class="section-heading"><div><p>04 · Componentes</p><h2>${Object.keys(placeholders.universal).length} funções recorrentes e ${Object.keys(placeholders.woman_specific).length} famílias de jornada.</h2></div><span>20 mulheres · 140 dias</span></header>
      <div class="component-rhythms">
        <article class="component-rhythm component-rhythm--orientation"><span>A · Orientação</span><h3>Cabeçalho · percurso · Escritura</h3><p>Lockups integrados e divisores botânicos herdam o gesto de came de cada mulher; nenhum ícone flutua separado do título.</p></article>
        <article class="component-rhythm"><span>B · Leitura</span><h3>Chegada · leitura · aprofundamento · Cristo</h3><p>Fluxo tipográfico contínuo; aprofundamento e citação ganham presença por espaço, contraste e came duplo.</p></article>
        <article class="component-rhythm component-rhythm--pause"><span>C · Pausa e resposta</span><h3>Silêncio · reflexão · oração · memória</h3><p>Mais papel, menos sinal. Glendora marca a respiração; linhas simples ficam reservadas à escrita funcional.</p></article>
        <article class="component-rhythm component-rhythm--closure"><span>D · Fechamento</span><h3>Verdade · canção</h3><p>O came-gesto abre a seção e o objeto narrativo retorna no fechamento semanal.</p></article>
      </div>
      ${openingLockupContract(inventory)}
      ${semanticLockupBoard(artDirection)}
      ${womanEmblemBoard(artDirection)}
      ${componentRegister(placeholders)}
      <div class="frequency-ledger">
        <p><b>140×</b><span>contexto, cabeçalho, Escritura, chegada, leitura, silêncio, reflexão, Cristo, oração, memória e verdade</span></p><p><b>105×</b><span>aprofundamento</span></p><p><b>123 blocos</b><span>na fonte · uma chamada visual de canção por semana</span></p><p><b>20×</b><span>abertura, percurso e resposta próprios para cada mulher</span></p>
      </div>
      ${componentSpecimenMatrix(inventory, narrativeContent)}
    </section>

    <section class="system-section system-section--placeholder" id="placeholders">
      <header class="section-heading"><div><p>05 · Presença e respiro</p><h2>Cada elemento ocupa a página por uma razão.</h2></div><span>função · meio · frequência · ritmo</span></header>
      <p class="placeholder-thesis">A base comum organiza leitura e resposta. Território, matéria, objeto, diagrama e transição entram quando ampliam a experiência de uma jornada.</p>
      <div class="placeholder-system-grid placeholder-system-grid--universal">
        <section><header><span>Universal</span><h3>Funções que sustentam todos os 140 dias.</h3></header><div class="placeholder-system-list">${placeholderRows(placeholders.universal, "estrutura universal")}</div></section>
        <aside class="specific-boundary"><span>Jornadas individuais</span><h3>Vinte narrativas, vinte direções.</h3><p>Abertura, percurso, matéria, objeto, diagrama, cena especial e encerramento são apresentados junto aos sete dias de cada mulher.</p><a href="${sitePath("/dev/?view=library")}" target="_top">Explorar as vinte jornadas →</a></aside>
      </div>
      <div class="placeholder-policy-grid">
        <article><span>Orientação</span><h3>Sinais com função.</h3><p>Tipografia, came, espaço e numeração orientam a leitora de modo direto e consistente.</p></article>
        <article><span>Exercícios</span><h3>A escrita move a jornada.</h3><p>Diagramas e cenas apoiam comparação, sequência, escolha e outros gestos que ganham clareza espacial.</p></article>
        <article><span>Respiro</span><h3>O branco também conduz.</h3><p>Espaço e composição tipográfica criam pausa, foco e passagem entre os momentos da leitura.</p></article>
      </div>
    </section>

    <section class="system-section system-section--ink" id="pages">
      <header class="section-heading"><div><p>06 · Famílias de página</p><h2>Do livro inteiro ao gesto de cada dia.</h2></div><span>ritmo variável · leitura confortável</span></header>
      <div class="page-scales"><article><span>Livro</span>${sequence(architecture.scales.book)}</article><article><span>Mulher</span>${sequence(architecture.scales.woman)}</article><article class="page-scale--wide"><span>Dia</span>${sequence(architecture.scales.day)}</article></div>
      <div class="page-roles">
        <article class="page-mini page-mini--opening"><span>abertura</span><b>imersão</b></article><article class="page-mini page-mini--atlas"><span>percurso</span><b>orientação</b></article><article class="page-mini page-mini--reading"><span>leitura</span><b>continuidade</b></article><article class="page-mini page-mini--pause"><span>silêncio</span><b>respiração</b></article><article class="page-mini page-mini--writing"><span>resposta</span><b>participação</b></article><article class="page-mini page-mini--closing"><span>encerramento</span><b>chegada</b></article>
      </div>
    </section>

    <section class="system-section" id="production">
      <header class="section-heading"><div><p>07 · Produção física</p><h2>A beleza continua no papel, na dobra e na mão.</h2></div><span>parâmetros para a prova física</span></header>
      <div class="production-grid">
        <div class="spread-diagram"><article class="sheet sheet--verso"><span>verso</span><i></i><b>${page.margin_mm.inner} mm</b></article><article class="sheet sheet--recto"><span>recto</span><i></i><b>${page.margin_mm.inner} mm</b></article></div>
        <dl class="production-contract"><div><dt>Corte</dt><dd>${page.trim_mm.join(" × ")} mm</dd></div><div><dt>Sangria</dt><dd>${page.bleed_mm} mm</dd></div><div><dt>Topo / base</dt><dd>${page.margin_mm.top} / ${page.margin_mm.bottom} mm</dd></div><div><dt>Interna / externa</dt><dd>${page.margin_mm.inner} / ${page.margin_mm.outer} mm</dd></div><div><dt>Cor</dt><dd>abertura + encerramento</dd></div><div><dt>Miolo</dt><dd>preto, papel e alfa</dd></div></dl>
        <div class="production-principles">${sequence(architecture.scales.production)}<p>A prova física a 100% confirmará margem de encadernação, ganho de ponto e equivalência de cor com o gabarito da gráfica.</p></div>
      </div>
    </section>

    <section class="system-section system-section--state" id="state">
      <header class="section-heading"><div><p>08 · Estado do projeto</p><h2>O que orienta o livro de hoje.</h2></div><span>${entries.length} registros funcionais</span></header>
      <div class="state-layers">
        <article><span>Referências aprovadas</span><h3>Frentes dos volumes</h3><p>As capas dos Volumes I e II orientam matéria, luz, delicadeza e a presença da coleção.</p></article><article><span>Direção editorial</span><h3>Sistema interno</h3><p>Arquitetura, ritmo, componentes e frequência organizam os testes do livro vivo.</p></article><article><span>Estado atual</span><h3>Livro paginado</h3><p>Leitura e paginação podem ser avaliadas por coleção, volume ou mulher.</p></article><article><span>Próxima confirmação</span><h3>Validação física</h3><p>Tipografia final, métricas, encadernação, ganho de ponto e separação de cor serão conferidos no impresso.</p></article>
      </div>
      <details class="technical-sources"><summary>Ver rastreabilidade técnica</summary><div class="registry-compact">
        <article><p class="panel-label">Inventário funcional</p><ul>${groupCounts}</ul></article><article><p class="panel-label">Fontes do projeto</p><ul class="source-list">${sourceItems}</ul></article><article><p class="panel-label">Organização das decisões</p><p>O repositório reúne o projeto. As regras orientam a linguagem compartilhada; as vinte jornadas desenvolvem a expressão de cada narrativa.</p><a href="${sitePath("/dev/?view=library")}" target="_top">Abrir as 20 jornadas →</a></article>
      </div></details>
    </section>`;

  if (location.hash) setTimeout(() => {
    const target = document.querySelector(location.hash);
    const navigationOffset = document.querySelector(".section-nav")?.getBoundingClientRect().height ?? 0;
    if (target) window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - navigationOffset - 12) });
  }, 0);

  document.querySelectorAll(".type-specimen-card").forEach((card) => {
    const text = card.querySelector(".type-specimen__text");
    const output = card.querySelector(".specimen-measure");
    if (!text || !output) return;
    const measure = () => {
      const width = Math.max(1, text.clientWidth);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = getComputedStyle(text).font;
      const average = context.measureText("a menina ").width / 9 || fontSize * 0.48;
      output.textContent = `coluna útil · ${Math.round(width / average)} caracteres/linha`;
    };
    measure();
    new ResizeObserver(measure).observe(text);
  });
}

fetch(dataPath("design-system"), { cache: "no-store" })
  .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error ?? "Não foi possível ler as regras visuais."); return payload; })
  .then(renderSystem)
  .catch((error) => { root.innerHTML = `<p class="system-error">${escapeHtml(error.message)}</p>`; });
