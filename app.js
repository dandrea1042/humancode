/* ===== HumanCode — app.js ===== */

// ── Navbar scroll effect ──────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger menu ────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(
  '.step-card, .pattern-card, .testimonial-card, .faq-item, .section-header'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    openItem.querySelector('.faq-answer').classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
    answer.classList.add('open');
  }
}

// ── Playground examples ───────────────────────────────────────────────────────
function setExample(text) {
  document.getElementById('humanInput').value = text;
  document.getElementById('humanInput').focus();
}

// ── Playground translator ─────────────────────────────────────────────────────
// SVG icon helper (Lucide inline)
function svg(name, cls = 'icon-inline') {
  return `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="${name}"></svg>`;
}

const patterns = {
  loop: {
    keywords: ['repite', 'repetir', 'mientras', 'ciclo', 'veces', 'sigue', 'continúa', 'energía', 'recorre', 'recorrer'],
    iconSvg: 'arrows-clockwise',
    name: 'Loop',
    color: '#3B82F6',
    logic: 'Repetición — ejecutar un bloque de código múltiples veces.',
    codeTemplate: (input) => {
      if (/(\d+)\s*veces/i.test(input)) {
        const n = input.match(/(\d+)\s*veces/i)[1];
        return `<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">${n}</span>):\n    <span class="fn">ejecutar_accion</span>()`;
      }
      if (/mientras/i.test(input)) {
        return `<span class="kw">while</span> condicion <span class="op">==</span> <span class="kw">True</span>:\n    <span class="fn">ejecutar_accion</span>()`;
      }
      return `<span class="kw">for</span> elemento <span class="kw">in</span> lista:\n    <span class="fn">procesar</span>(elemento)`;
    }
  },
  condition: {
    keywords: ['si', 'llueve', 'calor', 'frío', 'mayor', 'menor', 'igual', 'entonces', 'sino', 'cuando', 'temperatura', 'sombrilla', 'ventilador'],
    iconSvg: 'git-branch',
    name: 'Condicional',
    color: '#F59E0B',
    logic: 'Decisión — ejecutar código solo si se cumple una condición.',
    codeTemplate: (input) => {
      if (/llueve/i.test(input)) {
        return `<span class="kw">if</span> lluvia <span class="op">==</span> <span class="kw">True</span>:\n    <span class="fn">usar_sombrilla</span>()`;
      }
      if (/calor|temperatura/i.test(input)) {
        return `<span class="kw">if</span> temperatura <span class="op">&gt;</span> <span class="num">30</span>:\n    <span class="fn">usar_ventilador</span>()`;
      }
      return `<span class="kw">if</span> condicion:\n    <span class="fn">hacer_algo</span>()\n<span class="kw">else</span>:\n    <span class="fn">hacer_otra_cosa</span>()`;
    }
  },
  variable: {
    keywords: ['guarda', 'guardar', 'almacena', 'almacenar', 'recuerda', 'nombre', 'valor', 'dato', 'caja', 'contiene'],
    iconSvg: 'package',
    name: 'Variable',
    color: '#10B981',
    logic: 'Almacenamiento — guardar un valor en memoria para usarlo después.',
    codeTemplate: (input) => {
      if (/nombre/i.test(input)) {
        return `nombre_usuario <span class="op">=</span> <span class="str">"Juan"</span>\n<span class="fn">print</span>(nombre_usuario)`;
      }
      return `mi_variable <span class="op">=</span> <span class="num">42</span>\n<span class="fn">print</span>(mi_variable)`;
    }
  },
  function: {
    keywords: ['acción', 'accion', 'ejecuta', 'reutiliza', 'llama', 'define', 'crea', 'hace', 'tarea', 'proceso'],
    iconSvg: 'lightning',
    name: 'Función',
    color: '#8B5CF6',
    logic: 'Reutilización — agrupar instrucciones para ejecutarlas cuando quieras.',
    codeTemplate: () => {
      return `<span class="kw">def</span> <span class="fn">mi_accion</span>():\n    <span class="fn">print</span>(<span class="str">"Ejecutando acción"</span>)\n\n<span class="fn">mi_accion</span>()  <span style="color:#64748B"># llamar la función</span>`;
    }
  },
  error: {
    keywords: ['error', 'falla', 'fallo', 'intenta', 'intentar', 'problema', 'sale mal', 'captura', 'recupera'],
    iconSvg: 'warning-octagon',
    name: 'Manejo de errores',
    color: '#EF4444',
    logic: 'Resiliencia — anticipar y manejar situaciones inesperadas.',
    codeTemplate: () => {
      return `<span class="kw">try</span>:\n    <span class="fn">hacer_algo_riesgoso</span>()\n<span class="kw">except</span> Exception <span class="kw">as</span> e:\n    <span class="fn">print</span>(<span class="str">f"Error: {e}"</span>)`;
    }
  }
};

function detectPattern(input) {
  const lower = input.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const [key, pattern] of Object.entries(patterns)) {
    const score = pattern.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }
  return best;
}

function translateCode() {
  const input = document.getElementById('humanInput').value.trim();
  const output = document.getElementById('playgroundOutput');
  const btnText = document.getElementById('translateBtnText');

  if (!input) {
    output.innerHTML = `
      <div class="output-placeholder">
        <i class="ph-duotone ph-chat-teardrop-text icon-placeholder"></i>
        <p>Escribe una frase primero</p>
      </div>`;
    return;
  }

  // Loading state
  btnText.textContent = 'Traduciendo...';
  output.innerHTML = `
    <div class="output-placeholder">
      <i class="ph-duotone ph-spinner-gap icon-placeholder" style="animation:spin 1s linear infinite"></i>
      <p>Analizando tu frase...</p>
    </div>`;

  setTimeout(() => {
    btnText.textContent = 'Traducir a código →';
    const patternKey = detectPattern(input);

    if (!patternKey) {
      output.innerHTML = `
        <div class="output-placeholder">
          <i class="ph-duotone ph-question icon-placeholder"></i>
          <p>No reconocí un patrón claro. Prueba con frases como:<br>
          <em>"Si llueve, usa sombrilla"</em> o <em>"Repite esto 5 veces"</em></p>
        </div>`;
      return;
    }

    const p = patterns[patternKey];
    const code = p.codeTemplate(input);
    const iconSvg = `<i class="ph-duotone ph-${p.iconSvg} icon-inline-sm" style="vertical-align:middle;margin-right:4px"></i>`;

    output.innerHTML = `
      <div class="output-block">
        <div class="output-block-label" style="color:${p.color}">
          <i class="ph-duotone ph-chat-circle-dots" style="font-size:13px;vertical-align:middle;margin-right:4px;color:${p.color}"></i>
          Tu frase
        </div>
        <div class="output-block-content" style="color:var(--text)">"${escapeHtml(input)}"</div>
      </div>

      <div class="output-block">
        <div class="output-block-label" style="color:${p.color}">
          <i class="ph-duotone ph-magnifying-glass" style="font-size:13px;vertical-align:middle;margin-right:4px;color:${p.color}"></i>
          Patrón detectado
        </div>
        <div>
          <span class="output-pattern-badge" style="background:${p.color}20; color:${p.color}; border:1px solid ${p.color}40">
            ${iconSvg} ${p.name}
          </span>
        </div>
      </div>

      <div class="output-block">
        <div class="output-block-label" style="color:${p.color}">
          <i class="ph-duotone ph-brain" style="font-size:13px;vertical-align:middle;margin-right:4px;color:${p.color}"></i>
          Lógica
        </div>
        <div class="output-block-content" style="color:var(--text-muted)">${p.logic}</div>
      </div>

      <div class="output-block">
        <div class="output-block-label" style="color:${p.color}">
          <i class="ph-duotone ph-code" style="font-size:13px;vertical-align:middle;margin-right:4px;color:${p.color}"></i>
          Código Python
        </div>
        <div class="output-code">${code}</div>
      </div>
    `;
    // Re-render any lucide icons injected
    if (window.lucide) lucide.createIcons();

    // Animate in
    output.querySelectorAll('.output-block').forEach((block, i) => {
      block.style.opacity = '0';
      block.style.transform = 'translateY(12px)';
      block.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        block.style.opacity = '1';
        block.style.transform = 'translateY(0)';
      }, i * 100);
    });
  }, 700);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Enter key in textarea
document.getElementById('humanInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) translateCode();
});

// ── Lesson Modal ──────────────────────────────────────────────────────────────
const lessons = {
  loop: {
    tag: 'Loop', tagColor: '#3B82F6', iconSvg: 'refresh-cw',
    title: 'Repetición (Loop)',
    subtitle: 'Hacer algo varias veces sin escribirlo varias veces.',
    panels: [
      { label: 'Lenguaje humano',  labelColor: '#F59E0B', labelIcon: 'message-circle',
        content: '"Mientras tenga energía, sigue corriendo."<br><br>"Repite el saludo 5 veces."', type: 'text' },
      { label: 'Visual',           labelColor: '#3B82F6', labelIcon: 'eye',
        content: 'refresh-cw', type: 'visual' },
      { label: 'Lógica',           labelColor: '#8B5CF6', labelIcon: 'brain',
        content: 'Un loop repite un bloque de instrucciones. Puede repetirse un número fijo de veces (<strong>for</strong>) o mientras una condición sea verdadera (<strong>while</strong>).', type: 'text' },
      { label: 'Código',           labelColor: '#10B981', labelIcon: 'code-2',
        content: `<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):\n    <span class="fn">print</span>(<span class="str">"Hola"</span>)\n\n<span class="kw">while</span> energia <span class="op">&gt;</span> <span class="num">0</span>:\n    correr()\n    energia <span class="op">-=</span> <span class="num">10</span>`, type: 'code' }
    ],
    exercise: { title: 'Ejercicio', prompt: 'Escribe un loop que imprima los números del 1 al 10.', hint: 'Pista: usa for i in range(1, 11)' }
  },
  condition: {
    tag: 'Condicional', tagColor: '#F59E0B', iconSvg: 'git-branch',
    title: 'Decisión (Condicional)',
    subtitle: 'Elegir qué hacer según si algo es verdadero o falso.',
    panels: [
      { label: 'Lenguaje humano',  labelColor: '#F59E0B', labelIcon: 'message-circle',
        content: '"Si llueve, usa sombrilla."<br><br>"Si hace calor, prende el ventilador; si no, apágalo."', type: 'text' },
      { label: 'Visual',           labelColor: '#F59E0B', labelIcon: 'eye',
        content: 'git-branch', type: 'visual' },
      { label: 'Lógica',           labelColor: '#8B5CF6', labelIcon: 'brain',
        content: 'Un condicional evalúa si algo es <strong>verdadero</strong> o <strong>falso</strong> y ejecuta código diferente según el resultado. Es como una bifurcación en el camino.', type: 'text' },
      { label: 'Código',           labelColor: '#10B981', labelIcon: 'code-2',
        content: `<span class="kw">if</span> lluvia <span class="op">==</span> <span class="kw">True</span>:\n    <span class="fn">usar_sombrilla</span>()\n<span class="kw">elif</span> temperatura <span class="op">&gt;</span> <span class="num">30</span>:\n    <span class="fn">usar_ventilador</span>()\n<span class="kw">else</span>:\n    <span class="fn">salir_normal</span>()`, type: 'code' }
    ],
    exercise: { title: 'Ejercicio', prompt: 'Escribe un condicional que diga "mayor de edad" si la edad es >= 18, y "menor de edad" si no.', hint: 'Pista: if edad >= 18: ...' }
  },
  variable: {
    tag: 'Variable', tagColor: '#10B981', iconSvg: 'box',
    title: 'Variable (Contenedor)',
    subtitle: 'Una caja donde guardas información para usarla después.',
    panels: [
      { label: 'Lenguaje humano',  labelColor: '#F59E0B', labelIcon: 'message-circle',
        content: '"Guarda el nombre del usuario."<br><br>"Recuerda cuántos puntos tiene el jugador."', type: 'text' },
      { label: 'Visual',           labelColor: '#10B981', labelIcon: 'eye',
        content: 'box', type: 'visual' },
      { label: 'Lógica',           labelColor: '#8B5CF6', labelIcon: 'brain',
        content: 'Una variable es como una caja con etiqueta. Le pones un nombre, guardas algo adentro, y puedes abrirla cuando quieras para ver o cambiar lo que tiene.', type: 'text' },
      { label: 'Código',           labelColor: '#10B981', labelIcon: 'code-2',
        content: `nombre <span class="op">=</span> <span class="str">"María"</span>\npuntos <span class="op">=</span> <span class="num">0</span>\n\npuntos <span class="op">+=</span> <span class="num">10</span>  <span style="color:#64748B"># sumar 10 puntos</span>\n<span class="fn">print</span>(<span class="str">f"Hola {nombre}, tienes {puntos} puntos"</span>)`, type: 'code' }
    ],
    exercise: { title: 'Ejercicio', prompt: 'Crea una variable llamada "ciudad" con el valor "Buenos Aires" e imprímela.', hint: 'Pista: ciudad = "Buenos Aires"' }
  },
  function: {
    tag: 'Función', tagColor: '#8B5CF6', iconSvg: 'zap',
    title: 'Función (Acción reutilizable)',
    subtitle: 'Un bloque de instrucciones que puedes usar cuando quieras.',
    panels: [
      { label: 'Lenguaje humano',  labelColor: '#F59E0B', labelIcon: 'message-circle',
        content: '"Cada vez que alguien llegue, salúdalo."<br><br>"Tengo una receta para hacer café. La uso cuando quiero."', type: 'text' },
      { label: 'Visual',           labelColor: '#8B5CF6', labelIcon: 'eye',
        content: 'zap', type: 'visual' },
      { label: 'Lógica',           labelColor: '#8B5CF6', labelIcon: 'brain',
        content: 'Una función agrupa instrucciones bajo un nombre. En lugar de repetir el mismo código, lo defines una vez y lo <strong>llamas</strong> cuando lo necesitas. Puede recibir datos (parámetros) y devolver resultados.', type: 'text' },
      { label: 'Código',           labelColor: '#10B981', labelIcon: 'code-2',
        content: `<span class="kw">def</span> <span class="fn">saludar</span>(nombre):\n    <span class="fn">print</span>(<span class="str">f"Hola, {nombre}!"</span>)\n\n<span class="fn">saludar</span>(<span class="str">"Ana"</span>)\n<span class="fn">saludar</span>(<span class="str">"Carlos"</span>)`, type: 'code' }
    ],
    exercise: { title: 'Ejercicio', prompt: 'Crea una función llamada "sumar" que reciba dos números y devuelva su suma.', hint: 'Pista: def sumar(a, b): return a + b' }
  },
  error: {
    tag: 'Error', tagColor: '#EF4444', iconSvg: 'shield-alert',
    title: 'Manejo de errores',
    subtitle: 'Anticipar qué puede salir mal y tener un plan.',
    panels: [
      { label: 'Lenguaje humano',  labelColor: '#F59E0B', labelIcon: 'message-circle',
        content: '"Intenta abrir la puerta; si está cerrada, usa la llave."<br><br>"Si el archivo no existe, avísame."', type: 'text' },
      { label: 'Visual',           labelColor: '#EF4444', labelIcon: 'eye',
        content: 'shield-alert', type: 'visual' },
      { label: 'Lógica',           labelColor: '#8B5CF6', labelIcon: 'brain',
        content: 'Los errores son inevitables. El manejo de errores (<strong>try/except</strong>) permite que tu programa siga funcionando aunque algo falle, en lugar de romperse completamente.', type: 'text' },
      { label: 'Código',           labelColor: '#10B981', labelIcon: 'code-2',
        content: `<span class="kw">try</span>:\n    archivo <span class="op">=</span> <span class="fn">open</span>(<span class="str">"datos.txt"</span>)\n    contenido <span class="op">=</span> archivo.<span class="fn">read</span>()\n<span class="kw">except</span> FileNotFoundError:\n    <span class="fn">print</span>(<span class="str">"El archivo no existe"</span>)\n<span class="kw">finally</span>:\n    <span class="fn">print</span>(<span class="str">"Proceso terminado"</span>)`, type: 'code' }
    ],
    exercise: { title: 'Ejercicio', prompt: 'Escribe un try/except que intente convertir "abc" a número entero y capture el error.', hint: 'Pista: int("abc") lanza ValueError' }
  }
};

function openLesson(key) {
  const lesson = lessons[key];
  if (!lesson) return;

  const makeLucideSvg = (name, style = '') =>
    `<svg style="width:14px;height:14px;stroke:currentColor;stroke-width:2;vertical-align:middle;margin-right:5px;${style}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" data-lucide="${name}"></svg>`;

  const panelsHtml = lesson.panels.map(panel => {
    let contentHtml = '';
    if (panel.type === 'code') {
      contentHtml = `<div class="lesson-code-block">${panel.content}</div>`;
    } else if (panel.type === 'visual') {
      const isLoop = panel.content === 'refresh-cw';
      const animStyle = isLoop ? 'animation:spin 2s linear infinite;' : '';
      contentHtml = `<div class="lesson-visual">
        <svg style="width:52px;height:52px;stroke:${panel.labelColor};stroke-width:1.5;${animStyle}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" data-lucide="${panel.content}"></svg>
      </div>`;
    } else {
      contentHtml = `<p>${panel.content}</p>`;
    }
    return `
      <div class="lesson-panel">
        <div class="lesson-panel-label" style="color:${panel.labelColor}">
          ${makeLucideSvg(panel.labelIcon)} ${panel.label}
        </div>
        ${contentHtml}
      </div>`;
  }).join('');

  const targetIcon = makeLucideSvg('target', 'color:var(--primary)');

  document.getElementById('modalBody').innerHTML = `
    <div class="lesson-header">
      <span class="lesson-tag" style="background:${lesson.tagColor}20; color:${lesson.tagColor}; border:1px solid ${lesson.tagColor}40">
        <svg style="width:12px;height:12px;stroke:currentColor;stroke-width:2;vertical-align:middle;margin-right:4px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" data-lucide="${lesson.iconSvg}"></svg>
        ${lesson.tag}
      </span>
      <h2>${lesson.title}</h2>
      <p>${lesson.subtitle}</p>
    </div>
    <div class="lesson-panels">
      ${panelsHtml}
      <div class="lesson-exercise">
        <h4>${targetIcon} ${lesson.exercise.title}</h4>
        <p>${lesson.exercise.prompt}</p>
        <p style="margin-top:8px; font-size:0.82rem; color:var(--primary); opacity:0.8">${lesson.exercise.hint}</p>
      </div>
    </div>
  `;

  document.getElementById('lessonModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Render Lucide icons inside modal
  if (window.lucide) lucide.createIcons();
}

function closeModal(event) {
  if (event.target === document.getElementById('lessonModal')) {
    closeLessonModal();
  }
}

function closeLessonModal() {
  document.getElementById('lessonModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLessonModal();
});

// ── Pattern card hover glow ───────────────────────────────────────────────────
document.querySelectorAll('.pattern-card:not(.pattern-locked)').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const pattern = card.dataset.pattern;
    const colorMap = {
      loop: '59,130,246',
      condition: '245,158,11',
      function: '139,92,246',
      variable: '16,185,129',
      error: '239,68,68'
    };
    const c = colorMap[pattern];
    if (c) card.style.boxShadow = `0 8px 32px rgba(${c},0.2)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ── Smooth scroll for anchor links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
