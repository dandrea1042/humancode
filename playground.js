/* ===== HumanCode — playground.js (Groq AI) ===== */

// Modelos gratuitos disponibles en Groq (free tier):
//   llama-3.3-70b-versatile  → mejor calidad, recomendado
//   llama3-70b-8192          → alternativa estable
//   llama3-8b-8192           → más rápido, menor calidad
//   gemma2-9b-it             → Google Gemma, muy rápido
//
// ── API Key ───────────────────────────────────────────────────────────────────
const GROQ_API_KEY = (typeof GROQ_CONFIG !== 'undefined' && GROQ_CONFIG.apiKey)
  ? GROQ_CONFIG.apiKey
  : '';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

// ── Colores y metadatos por patrón ────────────────────────────────────────────
const PATTERN_META = {
  loop:      { icon: 'ph-arrows-clockwise', color: '#3B82F6', name: 'Repetición',        level: 2 },
  condition: { icon: 'ph-git-branch',       color: '#F59E0B', name: 'Decisión',           level: 1 },
  variable:  { icon: 'ph-package',          color: '#10B981', name: 'Guardar datos',      level: 3 },
  function:  { icon: 'ph-lightning',        color: '#8B5CF6', name: 'Acción guardada',    level: 4 },
  error:     { icon: 'ph-warning-octagon',  color: '#EF4444', name: 'Manejo de errores',  level: 5 },
  array:     { icon: 'ph-list-bullets',     color: '#22D3EE', name: 'Lista de cosas',     level: 3 },
  object:    { icon: 'ph-cube',             color: '#EC4899', name: 'Objeto',             level: 4 },
  other:     { icon: 'ph-code',             color: '#94A3B8', name: 'Código general',     level: 1 },
  invalid:   { icon: 'ph-warning',          color: '#F59E0B', name: 'Sin lógica aún',     level: 0 },
};

// ── Sistema de niveles ────────────────────────────────────────────────────────
const LEVELS = [
  { id: 1, name: 'Decisiones',    icon: 'ph-git-branch',       color: '#F59E0B', desc: 'Si esto, entonces aquello',     patterns: ['condition'] },
  { id: 2, name: 'Repeticiones',  icon: 'ph-arrows-clockwise', color: '#3B82F6', desc: 'Hacer algo varias veces',       patterns: ['loop'] },
  { id: 3, name: 'Memoria',       icon: 'ph-package',          color: '#10B981', desc: 'Guardar y recordar datos',      patterns: ['variable', 'array'] },
  { id: 4, name: 'Acciones',      icon: 'ph-lightning',        color: '#8B5CF6', desc: 'Crear instrucciones reutilizables', patterns: ['function', 'object'] },
  { id: 5, name: 'Protección',    icon: 'ph-shield',           color: '#EF4444', desc: 'Qué hacer cuando algo falla',   patterns: ['error'] },
];

// XP por traducción exitosa
let userXP = parseInt(localStorage.getItem('hc_xp') || '0');
let userStreak = parseInt(localStorage.getItem('hc_streak') || '0');
let lastDate = localStorage.getItem('hc_last_date') || '';

function addXP(amount) {
  userXP += amount;
  localStorage.setItem('hc_xp', userXP);
  // Streak
  const today = new Date().toDateString();
  if (lastDate !== today) {
    userStreak++;
    localStorage.setItem('hc_streak', userStreak);
    localStorage.setItem('hc_last_date', today);
  }
  renderXPBar();
}

function renderXPBar() {
  const el = document.getElementById('pgXPBar');
  if (!el) return;
  const level = Math.floor(userXP / 100) + 1;
  const progress = userXP % 100;
  el.innerHTML = `
    <span class="pg-xp-badge">
      <i class="ph-fill ph-star" style="font-size:11px;color:#F59E0B"></i>
      ${userXP} XP
    </span>
    <div class="pg-xp-track">
      <div class="pg-xp-fill" style="width:${progress}%"></div>
    </div>
    <span class="pg-xp-level">Nv. ${level}</span>
    ${userStreak > 1 ? `<span class="pg-streak"><i class="ph-fill ph-fire" style="font-size:11px;color:#F59E0B"></i> ${userStreak}</span>` : ''}
  `;
}

// ── Prompt del sistema ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres HumanCode, un profesor paciente y entusiasta que enseña programacion a personas que nunca han visto codigo en su vida.

TU MISION PRINCIPAL:
Ensenar PENSAMIENTO COMPUTACIONAL, no solo generar codigo.
Tu objetivo es que el usuario ENTIENDA la logica, no que reciba codigo magico.

TU PERSONALIDAD:
- Eres calido, alentador y nunca juzgas
- Celebras cada avance: "Genial!", "Eso es exactamente!", "Ya lo estas entendiendo!"
- Si algo es dificil, lo normalizas: "Es normal que esto confunda al principio"
- Hablas como un amigo, no como un manual tecnico
- Nunca das por sentado que el otro sabe algo

ANALOGIAS QUE USAS:
- variable = cajita con nombre donde guardas cosas (como tu mochila con tu nombre)
- loop = repetir automaticamente (como Spotify en repeat)
- if/else = tomar una decision (como decidir si llevas paraguas segun el clima)
- funcion = receta guardada para usar cuando quieras
- error = el programa te avisa que algo salio mal (como "game over" en un videojuego)
- lista = lista de reproduccion en Spotify: varios elementos en orden

REGLA CRITICA DE VALIDACION PEDAGOGICA:
Antes de generar codigo, evalua si la frase contiene alguna estructura logica computacional real:
- Condicion: palabras como "si", "cuando", "en caso de", "dependiendo", "si no"
- Repeticion: palabras como "repite", "mientras", "cada vez", "varias veces", "para cada"
- Almacenamiento: palabras como "guarda", "recuerda", "almacena", "el valor de", "la variable"
- Accion reutilizable: palabras como "crea una accion", "define", "cada vez que llames"
- Manejo de error: palabras como "si falla", "intenta", "en caso de error", "si no funciona"

SI LA FRASE NO CONTIENE NINGUNA ESTRUCTURA LOGICA (ej: "ser feliz", "estudiar ingles", "ir al gimnasio", "quiero aprender"):
- Devuelve pattern: "invalid"
- NO generes codigo
- Explica amablemente por que no tiene logica computacional
- Da 3 sugerencias concretas de como mejorar la frase

IMPORTANTE: Responde UNICAMENTE con un objeto JSON valido. Sin markdown, sin texto extra.

El JSON debe tener exactamente estas claves:

PARA FRASES VALIDAS (con logica computacional):
- pattern: loop | condition | variable | function | error | array | object | other
- patternName: nombre amigable (ej: "Decision", "Repeticion", "Cajita de datos")
- humanExplanation: max 2 oraciones calidasy alentadoras con analogias cotidianas
- logicExplanation: 1 oracion simple sin tecnicismos
- logicMap: objeto con la estructura visual de la logica. Formato: { "type": "condition|loop|variable|function|error", "parts": [ { "label": "CONDICION", "value": "texto de la condicion" }, { "label": "SI ES VERDAD", "value": "que pasa" }, { "label": "SI ES FALSO", "value": "que pasa o null" } ] }
- code: codigo Python 3 valido (usa \\n para saltos de linea)
- codeExplanation: historia corta y entretenida, max 3 oraciones
- analogy: analogia concreta para adolescente (Spotify, TikTok, videojuegos, escuela)
- exercisePrompt: ejercicio divertido con contexto real
- exerciseHint: pista alentadora
- exerciseSolution: solucion Python (usa \\n para saltos)
- tip1: consejo util que empiece con "Recuerda que..." o "Un truco es..."
- tip2: otro consejo con ejemplo cotidiano
- breakdownSummary: max 2 oraciones explicando el codigo con paciencia
- breakdownLines: array de { "line": "codigo", "explanation": "que hace en lenguaje simple" } — entre 3 y 8
- breakdownKeywords: array de { "keyword": "nombre", "type": "keyword|funcion|operador|tipo|metodo", "description": "que hace con analogia" } — entre 2 y 6
- classes: array de clases (o [] si no hay)
- xpEarned: numero entre 10 y 50 segun complejidad

PARA FRASES INVALIDAS (sin logica computacional):
- pattern: "invalid"
- invalidReason: explicacion amable de por que no tiene logica computacional (1-2 oraciones)
- invalidHint: que palabra o estructura agregar para que funcione
- invalidSuggestions: array de exactamente 3 versiones mejoradas de la frase que SI tengan logica
- xpEarned: 0

Reglas del codigo:
- Python 3 valido y funcional
- Variables en espanol y descriptivas
- Comentarios en espanol, breves y amigables
- USA \\n para saltos de linea, NUNCA saltos reales
- Usa comillas simples en el codigo Python`;

// ── Llamada a Groq API ────────────────────────────────────────────────────────
async function callGroq(userInput) {
  const model = document.getElementById('modelSelect')?.value || GROQ_MODEL;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 1400,
      response_format: { type: 'json_object' },   // ← fuerza JSON válido siempre
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: `Frase: "${userInput.replace(/"/g, "'")}"` }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error HTTP ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content.trim();

  // Parsear — con response_format json_object debería ser siempre válido,
  // pero por si acaso intentamos extraer el JSON si viene con texto extra
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('La IA no devolvió JSON válido');
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      // Último recurso: limpiar caracteres problemáticos
      const cleaned = match[0]
        .replace(/[\u0000-\u001F\u007F]/g, ' ')  // control chars
        .replace(/,\s*([}\]])/g, '$1');            // trailing commas
      parsed = JSON.parse(cleaned);
    }
  }

  // Normalizar estructura plana → estructura que espera renderResult
  return {
    pattern:          parsed.pattern          || 'other',
    patternName:      parsed.patternName      || parsed.pattern || 'Código',
    humanExplanation: parsed.humanExplanation || '',
    logicExplanation: parsed.logicExplanation || '',
    logicMap:         parsed.logicMap         || null,
    code:             (parsed.code            || '').replace(/\\n/g, '\n'),
    codeExplanation:  parsed.codeExplanation  || '',
    analogy:          parsed.analogy          || '',
    tips:             [parsed.tip1, parsed.tip2].filter(Boolean),
    breakdownSummary: parsed.breakdownSummary || '',
    breakdownLines:   Array.isArray(parsed.breakdownLines)    ? parsed.breakdownLines    : [],
    breakdownKeywords:Array.isArray(parsed.breakdownKeywords) ? parsed.breakdownKeywords : [],
    classes:          Array.isArray(parsed.classes)           ? parsed.classes           : [],
    xpEarned:         parsed.xpEarned         || 0,
    // Campos para frases inválidas
    invalidReason:      parsed.invalidReason      || '',
    invalidHint:        parsed.invalidHint        || '',
    invalidSuggestions: Array.isArray(parsed.invalidSuggestions) ? parsed.invalidSuggestions : [],
    exercise: {
      prompt:   parsed.exercisePrompt   || parsed.exercise?.prompt   || '',
      hint:     parsed.exerciseHint     || parsed.exercise?.hint     || '',
      solution: (parsed.exerciseSolution || parsed.exercise?.solution || '').replace(/\\n/g, '\n'),
    }
  };
}

// ── Syntax highlighting básico para Python ───────────────────────────────────
function highlightPython(code) {
  const keywords = ['def','return','if','elif','else','for','while','in','not','and','or',
                    'True','False','None','import','from','class','try','except','finally',
                    'with','as','pass','break','continue','lambda','yield','raise','del',
                    'global','nonlocal','assert','is','print','range','len','type','int',
                    'str','float','list','dict','tuple','set','bool','input','open'];
  let escaped = code
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');

  // Strings (comillas simples y dobles, f-strings)
  escaped = escaped.replace(/(f?["'`])((?:\\.|(?!\1)[^\\])*)\1/g,
    '<span class="str">$1$2$1</span>');

  // Comentarios
  escaped = escaped.replace(/(#[^\n]*)/g, '<span class="cm">$1</span>');

  // Números
  escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>');

  // Keywords
  keywords.forEach(kw => {
    escaped = escaped.replace(
      new RegExp(`\\b(${kw})\\b`, 'g'),
      '<span class="kw">$1</span>'
    );
  });

  // Nombres de funciones (word seguido de paréntesis)
  escaped = escaped.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="fn">$1</span>');

  return escaped;
}

// ── Helpers UI ────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function setStatus(type, text) {
  const el = document.getElementById('pgStatus');
  const colors = { idle:'var(--success)', loading:'var(--accent)', error:'var(--error)' };
  el.innerHTML = `<i class="ph-fill ph-circle" style="font-size:8px;color:${colors[type]||colors.idle}"></i> ${text}`;
}

function resetResult() {
  document.getElementById('pgEmpty').style.display = 'flex';
  document.getElementById('pgResultBlocks').style.display = 'none';
  document.getElementById('resultActions').style.display = 'none';
  document.getElementById('learnEmpty').style.display = 'flex';
  document.getElementById('learnContent').style.display = 'none';
  document.getElementById('rb-breakdown').style.display = 'none';
  document.getElementById('rb-chat').style.display = 'none';
  document.getElementById('rb-code').style.display = 'block';
  window._chatHistory = [];
  window._chatCode = '';
  document.getElementById('pgEmpty').innerHTML = `
    <div class="pg-empty-icon">
      <i class="ph-duotone ph-brain" style="font-size:56px;color:var(--primary-light);opacity:0.4"></i>
    </div>
    <p class="pg-empty-title">Describe una situación con "si", "cuando" o "mientras"</p>
    <p class="pg-empty-sub">Ej: "Si llueve, usa sombrilla" · "Repite esto 5 veces"</p>`;
}

function showToast(msg, type = 'success') {
  let toast = document.getElementById('pgToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pgToast';
    toast.className = 'pg-toast';
    document.body.appendChild(toast);
  }
  const icon = type === 'error' ? 'ph-x-circle' : 'ph-check-circle';
  const color = type === 'error' ? 'var(--error)' : 'var(--success)';
  toast.innerHTML = `<i class="ph-fill ${icon}" style="font-size:16px;color:${color}"></i> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Render desglose del código ────────────────────────────────────────────────
function renderBreakdown(ai, color) {
  const block = document.getElementById('rb-breakdown');
  const content = document.getElementById('rb-breakdown-content');

  const hasContent = ai.breakdownSummary || ai.breakdownLines?.length
    || ai.breakdownKeywords?.length || ai.classes?.length;

  if (!hasContent) { block.style.display = 'none'; return; }

  block.style.display = 'block';
  block.querySelector('.pg-rb-label').style.color = color;

  // ── Badge de tipo de keyword ──
  const typeBadge = (type) => {
    const map = {
      keyword:   { label: 'Palabra clave', bg: 'rgba(99,102,241,0.12)',  c: '#818CF8' },
      funcion:   { label: 'Función',       bg: 'rgba(236,72,153,0.12)',  c: '#EC4899' },
      función:   { label: 'Función',       bg: 'rgba(236,72,153,0.12)',  c: '#EC4899' },
      operador:  { label: 'Operador',      bg: 'rgba(245,158,11,0.12)',  c: '#F59E0B' },
      tipo:      { label: 'Tipo',          bg: 'rgba(16,185,129,0.12)',  c: '#10B981' },
      metodo:    { label: 'Método',        bg: 'rgba(34,211,238,0.12)',  c: '#22D3EE' },
      método:    { label: 'Método',        bg: 'rgba(34,211,238,0.12)',  c: '#22D3EE' },
    };
    const t = map[(type||'').toLowerCase()] || { label: type||'Concepto', bg:'rgba(148,163,184,0.1)', c:'#94A3B8' };
    return `<span class="pg-bd-type-badge" style="background:${t.bg};color:${t.c}">${t.label}</span>`;
  };

  // ── Líneas ──
  const linesHtml = (ai.breakdownLines || []).map((item, i) => `
    <div class="pg-bd-line">
      <div class="pg-bd-line-num">${i + 1}</div>
      <div class="pg-bd-line-body">
        <code class="pg-bd-code">${escapeHtml(item.line || '')}</code>
        <p class="pg-bd-explanation">${escapeHtml(item.explanation || '')}</p>
      </div>
    </div>`).join('');

  // ── Keywords ──
  const kwHtml = (ai.breakdownKeywords || []).map(kw => `
    <div class="pg-bd-kw">
      <div class="pg-bd-kw-header">
        <code class="pg-bd-kw-name">${escapeHtml(kw.keyword || '')}</code>
        ${typeBadge(kw.type)}
      </div>
      <p class="pg-bd-kw-desc">${escapeHtml(kw.description || '')}</p>
    </div>`).join('');

  // ── Clases ──
  const classesHtml = (ai.classes || []).map(cls => {
    const attrsHtml = (cls.attributes || []).map(a => `
      <div class="pg-bd-attr">
        <i class="ph-duotone ph-cube" style="font-size:12px;color:#10B981;flex-shrink:0;margin-top:2px"></i>
        <div>
          <code class="pg-bd-attr-name">self.${escapeHtml(a.name || '')}</code>
          <span class="pg-bd-attr-desc">${escapeHtml(a.description || '')}</span>
        </div>
      </div>`).join('');

    const methodsHtml = (cls.methods || []).map(m => {
      const isInit = m.name === '__init__';
      const iconColor = isInit ? '#F59E0B' : '#8B5CF6';
      const iconName  = isInit ? 'ph-star' : 'ph-lightning';
      const returnsHtml = m.returns && m.returns !== 'null'
        ? `<span class="pg-bd-method-returns"><i class="ph-bold ph-arrow-bend-down-right" style="font-size:10px"></i> devuelve: <code>${escapeHtml(m.returns)}</code></span>`
        : '';
      return `
        <div class="pg-bd-method">
          <div class="pg-bd-method-header">
            <i class="ph-duotone ${iconName}" style="font-size:13px;color:${iconColor};flex-shrink:0"></i>
            <code class="pg-bd-method-sig">${escapeHtml(m.name || '')}(${escapeHtml(m.params || '')})</code>
            ${isInit ? '<span class="pg-bd-init-badge">Constructor</span>' : ''}
          </div>
          <p class="pg-bd-method-desc">${escapeHtml(m.description || '')}</p>
          ${returnsHtml}
        </div>`;
    }).join('');

    const inheritsBadge = cls.inherits && cls.inherits !== 'null'
      ? `<span class="pg-bd-inherits"><i class="ph-duotone ph-arrow-up" style="font-size:11px"></i> hereda de <code>${escapeHtml(cls.inherits)}</code></span>`
      : '';

    return `
      <div class="pg-bd-class">
        <div class="pg-bd-class-header">
          <div class="pg-bd-class-title">
            <span class="pg-bd-class-keyword">class</span>
            <code class="pg-bd-class-name">${escapeHtml(cls.name || '')}</code>
            ${inheritsBadge}
          </div>
          <p class="pg-bd-class-desc">${escapeHtml(cls.description || '')}</p>
        </div>
        ${attrsHtml ? `
          <div class="pg-bd-class-section">
            <div class="pg-bd-class-section-label">
              <i class="ph-duotone ph-database" style="font-size:12px;color:#10B981"></i>
              Atributos
            </div>
            <div class="pg-bd-attrs">${attrsHtml}</div>
          </div>` : ''}
        ${methodsHtml ? `
          <div class="pg-bd-class-section">
            <div class="pg-bd-class-section-label">
              <i class="ph-duotone ph-function" style="font-size:12px;color:#8B5CF6"></i>
              Métodos
            </div>
            <div class="pg-bd-methods">${methodsHtml}</div>
          </div>` : ''}
      </div>`;
  }).join('');

  content.innerHTML = `
    ${ai.breakdownSummary ? `
      <div class="pg-bd-summary">
        <i class="ph-duotone ph-info" style="font-size:16px;color:${color};flex-shrink:0;margin-top:2px"></i>
        <p>${escapeHtml(ai.breakdownSummary)}</p>
      </div>` : ''}

    ${classesHtml ? `
      <div class="pg-bd-section">
        <div class="pg-bd-section-title">
          <i class="ph-duotone ph-blueprint" style="font-size:13px;color:${color}"></i>
          Clases definidas
        </div>
        ${classesHtml}
      </div>` : ''}

    ${linesHtml ? `
      <div class="pg-bd-section">
        <div class="pg-bd-section-title">
          <i class="ph-duotone ph-list-numbers" style="font-size:13px;color:${color}"></i>
          Línea por línea
        </div>
        <div class="pg-bd-lines">${linesHtml}</div>
      </div>` : ''}

    ${kwHtml ? `
      <div class="pg-bd-section">
        <div class="pg-bd-section-title">
          <i class="ph-duotone ph-tag" style="font-size:13px;color:${color}"></i>
          Conceptos usados
        </div>
        <div class="pg-bd-keywords">${kwHtml}</div>
      </div>` : ''}
  `;
}

// ── Render mapa lógico visual ─────────────────────────────────────────────────
function renderLogicMap(logicMap, color) {
  if (!logicMap || !logicMap.parts) return '';
  const typeLabels = {
    condition: { icon: 'ph-git-branch',       label: 'Decisión' },
    loop:      { icon: 'ph-arrows-clockwise', label: 'Repetición' },
    variable:  { icon: 'ph-package',          label: 'Guardar dato' },
    function:  { icon: 'ph-lightning',        label: 'Acción' },
    error:     { icon: 'ph-warning-octagon',  label: 'Protección' },
  };
  const t = typeLabels[logicMap.type] || { icon: 'ph-code', label: 'Lógica' };
  const partsHtml = logicMap.parts.map(p => `
    <div class="pg-lm-part">
      <span class="pg-lm-label" style="color:${color}">${p.label}</span>
      <span class="pg-lm-value">${escapeHtml(p.value || '')}</span>
    </div>`).join('<div class="pg-lm-arrow"><i class="ph-bold ph-arrow-down" style="font-size:12px;color:var(--text-muted)"></i></div>');
  return `
    <div class="pg-logic-map">
      <div class="pg-lm-header">
        <i class="ph-duotone ${t.icon}" style="font-size:14px;color:${color}"></i>
        <span style="color:${color};font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">${t.label} detectada</span>
      </div>
      <div class="pg-lm-parts">${partsHtml}</div>
      <div class="pg-lm-footer">
        <i class="ph-bold ph-arrow-down" style="font-size:14px;color:var(--text-muted)"></i>
        <span style="font-size:0.75rem;color:var(--text-muted)">Se convierte en Python</span>
      </div>
    </div>`;
}

// ── Render resultado ──────────────────────────────────────────────────────────
function renderResult(input, ai) {
  // Manejar frase inválida pedagógicamente
  if (ai.pattern === 'invalid') {
    renderInvalidFeedback(input, ai);
    return;
  }

  const meta = PATTERN_META[ai.pattern] || PATTERN_META.other;
  const color = meta.color;

  // Mostrar bloques
  document.getElementById('pgEmpty').style.display = 'none';
  document.getElementById('pgResultBlocks').style.display = 'flex';
  document.getElementById('resultActions').style.display = 'flex';

  // Frase
  document.getElementById('rb-phrase-content').innerHTML =
    `<span style="color:var(--text);font-style:italic">"${escapeHtml(input)}"</span>`;
  document.getElementById('rb-phrase').querySelector('.pg-rb-label').style.color = color;

  // Patrón + mapa lógico
  document.getElementById('rb-pattern-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:${ai.logicMap ? '12px' : '0'}">
      <span class="pg-pattern-badge" style="background:${color}20;color:${color};border:1px solid ${color}40">
        <i class="ph-duotone ${meta.icon}" style="font-size:18px"></i>
        ${ai.patternName || meta.name}
      </span>
      <span style="font-size:0.82rem;color:var(--text-muted)">${ai.analogy || ''}</span>
    </div>
    ${renderLogicMap(ai.logicMap, color)}`;
  document.getElementById('rb-pattern').querySelector('.pg-rb-label').style.color = color;

  // Explicación humana
  document.getElementById('rb-logic-content').innerHTML = `
    <p style="color:var(--text);margin-bottom:8px">${escapeHtml(ai.humanExplanation || '')}</p>
    <p style="color:var(--text-muted);font-size:0.88rem">${escapeHtml(ai.logicExplanation || '')}</p>`;
  document.getElementById('rb-logic').querySelector('.pg-rb-label').style.color = color;

  // Código con highlighting
  const highlighted = highlightPython(ai.code || '');
  document.getElementById('rb-code-content').innerHTML = highlighted;
  document.getElementById('rb-code').querySelector('.pg-rb-label').style.color = color;

  // Guardar código limpio para copiar
  window._lastCode = ai.code || '';

  // Desglose del código
  renderBreakdown(ai, color);

  // Chat
  initChat(ai);

  // Panel de aprendizaje
  renderLearnPanel(ai, meta);

  // XP
  if (ai.xpEarned > 0) {
    addXP(ai.xpEarned);
    showToast(`+${ai.xpEarned} XP — ¡Bien hecho!`);
  }

  const modelUsed = document.getElementById('modelSelect')?.value || GROQ_MODEL;
  setStatus('idle', `${ai.patternName || meta.name} · ${modelUsed}`);
}

// ── Feedback pedagógico para frases inválidas ─────────────────────────────────
function renderInvalidFeedback(input, ai) {
  document.getElementById('pgEmpty').style.display = 'none';
  document.getElementById('pgResultBlocks').style.display = 'flex';
  document.getElementById('resultActions').style.display = 'none';
  document.getElementById('rb-breakdown').style.display = 'none';
  document.getElementById('rb-chat').style.display = 'none';

  const suggestionsHtml = (ai.invalidSuggestions || []).map(s => `
    <button class="pg-suggestion-chip" onclick="setExample('${s.replace(/'/g, "\\'")}')">
      <i class="ph-duotone ph-arrow-bend-right-down" style="font-size:13px;color:var(--primary-light)"></i>
      ${escapeHtml(s)}
    </button>`).join('');

  document.getElementById('rb-phrase-content').innerHTML =
    `<span style="color:var(--text);font-style:italic">"${escapeHtml(input)}"</span>`;
  document.getElementById('rb-phrase').querySelector('.pg-rb-label').style.color = '#F59E0B';

  document.getElementById('rb-pattern-content').innerHTML = `
    <div class="pg-invalid-block">
      <div class="pg-invalid-icon">
        <i class="ph-duotone ph-lightbulb" style="font-size:32px;color:#F59E0B"></i>
      </div>
      <p class="pg-invalid-reason">${escapeHtml(ai.invalidReason || '')}</p>
      <div class="pg-invalid-hint">
        <i class="ph-fill ph-arrow-right" style="font-size:12px;color:var(--primary-light)"></i>
        ${escapeHtml(ai.invalidHint || '')}
      </div>
    </div>`;
  document.getElementById('rb-pattern').querySelector('.pg-rb-label').style.color = '#F59E0B';
  document.getElementById('rb-pattern').querySelector('.pg-rb-label').innerHTML = `
    <i class="ph-duotone ph-lightbulb" style="font-size:14px"></i>
    Todavía no tiene lógica computacional`;

  document.getElementById('rb-logic-content').innerHTML = `
    <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:12px">
      Prueba con alguna de estas versiones mejoradas — solo haz clic para usarla:
    </p>
    <div class="pg-suggestions-list">${suggestionsHtml}</div>`;
  document.getElementById('rb-logic').querySelector('.pg-rb-label').style.color = '#6366F1';
  document.getElementById('rb-logic').querySelector('.pg-rb-label').innerHTML = `
    <i class="ph-duotone ph-magic-wand" style="font-size:14px"></i>
    Sugerencias para mejorar tu frase`;

  document.getElementById('rb-code').style.display = 'none';
  setStatus('idle', 'Agrega una condición o acción a tu frase');
}

// ── Panel de aprendizaje ──────────────────────────────────────────────────────
function renderLearnPanel(ai, meta) {
  const color = meta.color;
  document.getElementById('learnEmpty').style.display = 'none';
  const lc = document.getElementById('learnContent');
  lc.style.display = 'flex';

  const tipsHtml = (ai.tips || []).map(t =>
    `<li style="margin-bottom:5px;color:var(--text-muted);font-size:0.82rem">
      <i class="ph-fill ph-check-circle" style="font-size:12px;color:${color};margin-right:4px"></i>${escapeHtml(t)}
    </li>`
  ).join('');

  const solutionHtml = ai.exercise?.solution
    ? `<div style="margin-top:10px">
        <button class="pg-show-solution-btn" onclick="toggleSolution(this)">
          <i class="ph-duotone ph-eye" style="font-size:13px"></i> Ver solución
        </button>
        <div class="pg-solution" style="display:none">
          <div class="pg-learn-code" style="margin-top:8px">${highlightPython(ai.exercise.solution)}</div>
        </div>
      </div>`
    : '';

  lc.innerHTML = `
    <div class="pg-learn-block">
      <div class="pg-learn-block-label" style="color:${color}">
        <i class="ph-duotone ph-chat-circle-dots" style="font-size:13px"></i>
        Explicación del código
      </div>
      <div class="pg-learn-block-body">${escapeHtml(ai.codeExplanation || '')}</div>
    </div>

    ${tipsHtml ? `
    <div class="pg-learn-block">
      <div class="pg-learn-block-label" style="color:${color}">
        <i class="ph-duotone ph-lightbulb" style="font-size:13px"></i>
        Tips clave
      </div>
      <div class="pg-learn-block-body">
        <ul style="list-style:none;padding:0">${tipsHtml}</ul>
      </div>
    </div>` : ''}

    <div class="pg-exercise-block">
      <h4>
        <i class="ph-duotone ph-game-controller" style="font-size:14px"></i>
        Ejercicio
      </h4>
      <p>${escapeHtml(ai.exercise?.prompt || '')}</p>
      <p class="pg-exercise-hint">${escapeHtml(ai.exercise?.hint || '')}</p>
      ${solutionHtml}
    </div>
  `;
}

// ── Toggle solución ───────────────────────────────────────────────────────────
function toggleSolution(btn) {
  const sol = btn.nextElementSibling;
  const visible = sol.style.display !== 'none';
  sol.style.display = visible ? 'none' : 'block';
  btn.innerHTML = visible
    ? '<i class="ph-duotone ph-eye" style="font-size:13px"></i> Ver solución'
    : '<i class="ph-duotone ph-eye-slash" style="font-size:13px"></i> Ocultar solución';
}

// ── Traducción principal ──────────────────────────────────────────────────────
async function translateCode() {
  const input = document.getElementById('humanInput').value.trim();
  const btn = document.getElementById('translateBtn');
  const btnText = document.getElementById('translateBtnText');

  if (!input) {
    setStatus('error', 'Escribe algo primero');
    document.getElementById('humanInput').focus();
    return;
  }

  // Estado de carga
  btn.classList.add('loading');
  btn.disabled = true;
  btnText.textContent = 'Pensando...';
  setStatus('loading', 'Consultando IA...');

  // Animación de carga en el panel resultado
  document.getElementById('pgEmpty').style.display = 'flex';
  document.getElementById('pgEmpty').innerHTML = `
    <div class="pg-empty-icon">
      <i class="ph-duotone ph-spinner-gap" style="font-size:52px;color:var(--primary-light);animation:spin 1s linear infinite"></i>
    </div>
    <p class="pg-empty-title">La IA está analizando tu frase...</p>
    <p class="pg-empty-sub">Groq llama3-70b · Esto tarda unos segundos</p>`;
  document.getElementById('pgResultBlocks').style.display = 'none';

  try {
    const ai = await callGroq(input);
    renderResult(input, ai);
  } catch (err) {
    console.error('Groq error:', err);
    setStatus('error', 'Error de conexión');
    document.getElementById('pgEmpty').innerHTML = `
      <div class="pg-empty-icon">
        <i class="ph-duotone ph-wifi-slash" style="font-size:52px;color:var(--error);opacity:0.6"></i>
      </div>
      <p class="pg-empty-title">No se pudo conectar con la IA</p>
      <p class="pg-empty-sub" style="color:var(--error);opacity:0.8">${escapeHtml(err.message)}</p>`;
    showToast('Error: ' + err.message, 'error');
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
    btnText.textContent = 'Traducir a código';
  }
}

// ── Ejemplos rápidos ──────────────────────────────────────────────────────────
function setExample(text) {
  const ta = document.getElementById('humanInput');
  ta.value = text;
  ta.focus();
  // Highlight the textarea briefly
  ta.style.borderColor = 'var(--primary)';
  setTimeout(() => ta.style.borderColor = '', 800);
}

// ── Init al cargar ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderXPBar();
  renderLevelNav();

  // Clear button
  document.getElementById('clearBtn')?.addEventListener('click', () => {
    document.getElementById('humanInput').value = '';
    document.getElementById('humanInput').focus();
    resetResult();
  });

  // Ctrl+Enter
  document.getElementById('humanInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.ctrlKey) translateCode();
  });

  // URL param ?pattern=loop
  const params = new URLSearchParams(window.location.search);
  const p = params.get('pattern');
  if (p && QUICK_LESSONS[p]) quickLesson(p);
});

// ── Template guiado ───────────────────────────────────────────────────────────
function setTemplate(template, example) {
  const ta = document.getElementById('humanInput');
  ta.value = example;
  ta.focus();
  ta.style.borderColor = 'var(--primary)';
  ta.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)';
  setTimeout(() => {
    ta.style.borderColor = '';
    ta.style.boxShadow = '';
  }, 1200);
  // Scroll suave al textarea
  ta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  // Seleccionar el texto para que el usuario lo vea
  ta.select();
}
  const code = window._lastCode || '';
  if (!code) return;
  navigator.clipboard.writeText(code)
    .then(() => showToast('Código copiado al portapapeles'))
    .catch(() => showToast('No se pudo copiar', 'error'));
}

// ── Panel de lección rápida (sin traducir) ────────────────────────────────────
const QUICK_LESSONS = {
  loop: {
    patternName: 'Loop (Repetición)',
    humanExplanation: 'Hacer algo varias veces sin escribirlo varias veces. Como decir "repite esto 10 veces" en lugar de escribirlo 10 veces.',
    logicExplanation: 'Ejecuta un bloque de código repetidamente mientras se cumpla una condición.',
    code: '# Imprimir números del 1 al 5\nfor i in range(1, 6):\n    print(f"Número: {i}")\n\n# Mientras haya energía\nenergia = 100\nwhile energia > 0:\n    print(f"Corriendo... energía: {energia}")\n    energia -= 20',
    codeExplanation: 'range(1, 6) genera los números 1, 2, 3, 4, 5. El for recorre cada uno. El while repite mientras la condición sea verdadera.',
    analogy: 'Como poner una canción en repeat: suena una y otra vez hasta que la paras.',
    tips: ['for se usa cuando sabés cuántas veces repetir', 'while se usa cuando no sabés cuántas veces'],
    exercise: {
      prompt: 'Escribe un loop que imprima los números pares del 2 al 10.',
      hint: 'Pista: usa range(2, 11, 2) — el tercer número es el paso',
      solution: 'for numero in range(2, 11, 2):\n    print(numero)'
    }
  },
  condition: {
    patternName: 'Condicional (Decisión)',
    humanExplanation: 'Tomar una decisión según si algo es verdadero o falso. Como decidir qué ropa ponerte según el clima.',
    logicExplanation: 'Evalúa una condición y ejecuta código diferente según el resultado.',
    code: '# Verificar si es mayor de edad\nedad = 17\n\nif edad >= 18:\n    print("Eres mayor de edad")\nelif edad >= 13:\n    print("Eres adolescente")\nelse:\n    print("Eres menor de edad")',
    codeExplanation: 'if evalúa la primera condición. elif evalúa si la primera fue falsa. else se ejecuta si ninguna fue verdadera.',
    analogy: 'Como un semáforo: verde = avanzar, amarillo = precaución, rojo = parar.',
    tips: ['Podés tener múltiples elif', 'else es opcional', 'Usá == para comparar, no ='],
    exercise: {
      prompt: 'Crea un condicional que diga si un número es positivo, negativo o cero.',
      hint: 'Pista: necesitás if, elif y else',
      solution: 'numero = -5\nif numero > 0:\n    print("Positivo")\nelif numero < 0:\n    print("Negativo")\nelse:\n    print("Es cero")'
    }
  },
  variable: {
    patternName: 'Variable (Contenedor)',
    humanExplanation: 'Una caja con etiqueta donde guardás información para usarla después. Podés cambiar lo que hay adentro cuando quieras.',
    logicExplanation: 'Reserva un espacio en memoria con un nombre para almacenar y recuperar valores.',
    code: '# Guardar información\nnombre = "Ana"\nedad = 16\npuntos = 0\n\n# Usar las variables\nprint(f"Hola {nombre}, tenés {edad} años")\n\n# Modificar\npuntos += 50\nprint(f"Puntos: {puntos}")',
    codeExplanation: '= asigna un valor a la variable. f"..." permite insertar variables dentro de un texto. += suma al valor actual.',
    analogy: 'Como una caja de zapatos con tu nombre: guardás cosas adentro y las encontrás cuando las necesitás.',
    tips: ['Los nombres de variables no pueden tener espacios', 'Usá snake_case: mi_variable', 'Python detecta el tipo automáticamente'],
    exercise: {
      prompt: 'Crea variables para nombre, edad y ciudad, luego imprímelas en una sola oración.',
      hint: 'Pista: usa f-strings: f"Mi nombre es {nombre}..."',
      solution: 'nombre = "Carlos"\nedad = 19\nciudad = "Buenos Aires"\nprint(f"Me llamo {nombre}, tengo {edad} años y vivo en {ciudad}")'
    }
  },
  function: {
    patternName: 'Función (Acción reutilizable)',
    humanExplanation: 'Una receta que podés usar cuando quieras. La escribís una vez y la llamás todas las veces que necesites.',
    logicExplanation: 'Agrupa instrucciones bajo un nombre. Puede recibir datos (parámetros) y devolver resultados.',
    code: '# Definir la función\ndef saludar(nombre, hora="mañana"):\n    """Saluda a alguien según la hora del día"""\n    return f"¡Buenos {hora}, {nombre}!"\n\n# Llamar la función\nprint(saludar("Ana"))\nprint(saludar("Carlos", "tardes"))\n\n# Función con cálculo\ndef calcular_promedio(numeros):\n    return sum(numeros) / len(numeros)\n\nnotas = [8, 9, 7, 10]\nprint(f"Promedio: {calcular_promedio(notas)}")',
    codeExplanation: 'def define la función. Los parámetros van entre paréntesis. return devuelve el resultado. Podés tener valores por defecto.',
    analogy: 'Como una máquina expendedora: le metés monedas (parámetros) y te da un producto (return).',
    tips: ['Nombrá las funciones con verbos: calcular_, obtener_, crear_', 'return termina la función y devuelve el valor', 'Una función debería hacer UNA sola cosa'],
    exercise: {
      prompt: 'Crea una función llamada "es_par" que reciba un número y devuelva True si es par, False si no.',
      hint: 'Pista: un número es par si numero % 2 == 0',
      solution: 'def es_par(numero):\n    return numero % 2 == 0\n\nprint(es_par(4))   # True\nprint(es_par(7))   # False'
    }
  },
  error: {
    patternName: 'Manejo de errores (try/except)',
    humanExplanation: 'Anticipar que algo puede salir mal y tener un plan B. Como llevar paraguas por si llueve.',
    logicExplanation: 'try ejecuta código que puede fallar. except captura el error y ejecuta código alternativo.',
    code: '# Manejo básico de errores\ntry:\n    numero = int(input("Ingresá un número: "))\n    resultado = 100 / numero\n    print(f"100 / {numero} = {resultado}")\nexcept ValueError:\n    print("Error: eso no es un número")\nexcept ZeroDivisionError:\n    print("Error: no se puede dividir por cero")\nfinally:\n    print("Proceso terminado")',
    codeExplanation: 'try intenta ejecutar el código. except captura errores específicos. finally siempre se ejecuta, haya error o no.',
    analogy: 'Como un cinturón de seguridad: no esperás chocar, pero lo usás por si acaso.',
    tips: ['Capturá errores específicos, no todos con except:', 'finally es ideal para cerrar archivos o conexiones', 'Podés tener múltiples except para distintos errores'],
    exercise: {
      prompt: 'Escribe un try/except que intente abrir un archivo "datos.txt" y maneje el error si no existe.',
      hint: 'Pista: el error es FileNotFoundError',
      solution: 'try:\n    with open("datos.txt", "r") as archivo:\n        contenido = archivo.read()\n        print(contenido)\nexcept FileNotFoundError:\n    print("El archivo no existe")'
    }
  }
};

// ── Render navegación de niveles ─────────────────────────────────────────────
function renderLevelNav() {
  const el = document.getElementById('pgLevelNav');
  if (!el) return;
  const currentLevel = Math.floor(userXP / 100) + 1;
  el.innerHTML = LEVELS.map(lv => {
    const unlocked = currentLevel >= lv.id;
    return `
      <div class="pg-level-item ${unlocked ? 'unlocked' : 'locked'}" title="${lv.desc}">
        <div class="pg-level-icon" style="${unlocked ? `background:${lv.color}20;border-color:${lv.color}40;color:${lv.color}` : ''}">
          <i class="ph-duotone ${lv.icon}" style="font-size:16px"></i>
        </div>
        <span class="pg-level-name">${lv.name}</span>
        ${!unlocked ? '<i class="ph-fill ph-lock-simple" style="font-size:10px;color:var(--text-muted);opacity:0.5"></i>' : ''}
      </div>`;
  }).join('');
}

function quickLesson(key) {
  const lesson = QUICK_LESSONS[key];
  if (!lesson) return;
  const meta = PATTERN_META[key] || PATTERN_META.other;
  renderLearnPanel({ ...lesson, pattern: key }, meta);
  document.getElementById('learnEmpty').style.display = 'none';
  document.getElementById('learnContent').style.display = 'flex';
}

// ── Keyboard shortcut ─────────────────────────────────────────────────────────
document.getElementById('humanInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) translateCode();
});

// ── Clear button ──────────────────────────────────────────────────────────────
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('humanInput').value = '';
  document.getElementById('humanInput').focus();
  resetResult();
  setStatus('idle', 'Listo');
});

// ── Init: leer URL param ?pattern= ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pattern = params.get('pattern');
  if (pattern && QUICK_LESSONS[pattern]) {
    quickLesson(pattern);
  }
});

// ── Chat de IA contextual ─────────────────────────────────────────────────────

// Historial de mensajes del chat (se resetea con cada nueva traducción)
window._chatHistory = [];
window._chatCode    = '';
window._chatContext = '';

function initChat(ai) {
  // Guardar contexto del código actual
  window._chatCode    = ai.code || '';
  window._chatContext = `Patron: ${ai.patternName}. Explicacion: ${ai.humanExplanation}. Logica: ${ai.logicExplanation}.`;
  window._chatHistory = [];

  // Mostrar bloque
  const chatBlock = document.getElementById('rb-chat');
  chatBlock.style.display = 'block';

  // Resetear mensajes al estado inicial
  document.getElementById('chatMessages').innerHTML = `
    <div class="pg-chat-welcome">
      <i class="ph-duotone ph-robot" style="font-size:28px;color:var(--primary-light);opacity:0.6"></i>
      <p>Tengo el código acá. Preguntame lo que quieras, sin miedo 👇</p>
      <div class="pg-chat-suggestions" id="chatSuggestions">
        <button class="pg-chat-suggestion" onclick="askSuggestion(this)">¿Qué hace este código?</button>
        <button class="pg-chat-suggestion" onclick="askSuggestion(this)">Explicame como si tuviera 10 años</button>
        <button class="pg-chat-suggestion" onclick="askSuggestion(this)">¿Qué pasa si cambio los números?</button>
        <button class="pg-chat-suggestion" onclick="askSuggestion(this)">¿Por qué se usa esto y no otra cosa?</button>
      </div>
    </div>`;
  document.getElementById('chatInput').value = '';

  // Pregunta de comprensión inicial, aparece después del welcome
  setTimeout(() => {
    appendMessage('ai', '¡Listo! Ya tengo el código acá. Antes de que me preguntes algo... ¿me podés explicar con tus propias palabras qué creés que hace este código? 😊');
  }, 800);
}

function askSuggestion(btn) {
  const text = btn.textContent.trim();
  // Ocultar sugerencias
  const sugg = document.getElementById('chatSuggestions');
  if (sugg) sugg.style.display = 'none';
  document.getElementById('chatInput').value = text;
  sendChat();
}

function appendMessage(role, text, isLoading = false) {
  const container = document.getElementById('chatMessages');

  // Quitar welcome si existe
  const welcome = container.querySelector('.pg-chat-welcome');
  if (welcome) welcome.remove();

  const div = document.createElement('div');
  div.className = `pg-chat-msg pg-chat-msg-${role}`;
  if (isLoading) div.id = 'chatLoadingMsg';

  if (role === 'user') {
    div.innerHTML = `
      <div class="pg-chat-bubble pg-chat-bubble-user">${escapeHtml(text)}</div>`;
  } else if (isLoading) {
    div.innerHTML = `
      <div class="pg-chat-avatar"><i class="ph-duotone ph-robot" style="font-size:16px"></i></div>
      <div class="pg-chat-bubble pg-chat-bubble-ai">
        <span class="pg-chat-typing">
          <span></span><span></span><span></span>
        </span>
      </div>`;
  } else {
    // Formatear respuesta: convertir **texto** en bold, \n en <br>
    const formatted = escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="pg-chat-inline-code">$1</code>')
      .replace(/\n/g, '<br>');
    div.innerHTML = `
      <div class="pg-chat-avatar"><i class="ph-duotone ph-robot" style="font-size:16px"></i></div>
      <div class="pg-chat-bubble pg-chat-bubble-ai">${formatted}</div>`;
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const question = input.value.trim();
  if (!question) return;

  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;

  // Mostrar mensaje del usuario
  appendMessage('user', question);

  // Agregar al historial
  window._chatHistory.push({ role: 'user', content: question });

  // Mostrar typing indicator
  appendMessage('ai', '', true);

  try {
    const model = document.getElementById('modelSelect')?.value || GROQ_MODEL;

    // System prompt del chat — tiene el código en contexto
    const chatSystem = `Sos HumanCode, un amigo calido y paciente que sabe programar y le explica a alguien de 13 años.

Tenes este codigo Python para responder preguntas:

\`\`\`python
${window._chatCode}
\`\`\`

Contexto: ${window._chatContext}

TU FORMA DE HABLAR:
- Calido, alentador y sin apuro. Como si tuvieras todo el tiempo del mundo para explicar
- Si alguien no entiende algo, lo normalizas: "Es re normal que eso confunda, a todos nos pasa al principio"
- Celebras cuando alguien hace una buena pregunta: "Uy, muy buena pregunta esa"
- Sin palabras tecnicas. Si usas una, la explicás con algo cotidiano (Spotify, TikTok, videojuegos, escuela)
- Maximo 3 oraciones. Directo pero con calidez
- Usas algun emoji ocasional para que se sienta mas amigable 😊
- Si te preguntan algo que no tiene que ver con el codigo, deciles con amabilidad que solo podes ayudar con este codigo por ahora

CUANDO EL USUARIO EXPLICA LO QUE ENTENDIO:
- Primero celebra lo que entendio bien, aunque sea poco: "¡Eso es! Captaste la parte mas importante"
- Si entendio algo mal, corregilo con suavidad: "Casi, solo hay un detallito..."
- Termina siempre con algo motivador: "Ya lo estas entendiendo", "Cada vez mas cerca", "Eso es exactamente"
- Despues de evaluar su respuesta, preguntale si quiere profundizar en algun punto especifico`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 300,
        messages: [
          { role: 'system', content: chatSystem },
          ...window._chatHistory
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content.trim();

    // Agregar respuesta al historial
    window._chatHistory.push({ role: 'assistant', content: answer });

    // Reemplazar loading por respuesta real
    const loadingMsg = document.getElementById('chatLoadingMsg');
    if (loadingMsg) loadingMsg.remove();
    appendMessage('ai', answer);

    // Pregunta de comprensión después de cada respuesta
    setTimeout(() => {
      appendMessage('ai', '¿Me podés explicar con tus propias palabras qué entendiste de esto? 😊');
    }, 600);

  } catch (err) {
    const loadingMsg = document.getElementById('chatLoadingMsg');
    if (loadingMsg) loadingMsg.remove();
    appendMessage('ai', 'No pude conectarme. Revisá tu conexión e intentá de nuevo.');
    console.error('Chat error:', err);
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}
