# HumanCode

Plataforma educativa que enseña programación traduciendo código a lenguaje humano simple, usando IA.

## ¿Qué es?

HumanCode convierte frases cotidianas en código Python real. En lugar de memorizar sintaxis, primero entendés la idea, después el código.

## Características

- **Playground con IA** — escribe una frase en español, recibe código Python explicado
- **Chat contextual** — preguntale a la IA sobre el código generado
- **Desglose línea por línea** — cada línea explicada en lenguaje simple
- **Patrones visuales** — loops, condicionales, funciones, variables, errores
- **Lecciones rápidas** — aprende cada patrón con analogías de la vida real

## Tecnologías

- HTML, CSS, JavaScript (vanilla)
- [Groq API](https://groq.com) — llama-3.3-70b-versatile (free tier)
- [Phosphor Icons](https://phosphoricons.com)
- Google Fonts (Inter + Poppins + Fira Code)

## Archivos

```
index.html          → Landing page
index.js            → JS de la landing
playground.html     → App del playground
playground.js       → Lógica del playground + IA
playground.css      → Estilos del playground
styles.css          → Estilos globales
config.example.js   → Plantilla de configuración (pública)
config.js           → Tu API key local (NO está en el repo)
```

## Uso local

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/humancode.git
   cd humancode
   ```

2. Copiá el archivo de configuración:
   ```bash
   cp config.example.js config.js
   ```
   En Windows (CMD):
   ```cmd
   copy config.example.js config.js
   ```

3. Editá `config.js` y pegá tu API key de Groq:
   ```js
   const GROQ_CONFIG = {
     apiKey: 'TU_API_KEY_DE_GROQ_ACÁ',
   };
   ```
   Obtenés una key gratis en [console.groq.com](https://console.groq.com).

4. Abrí `index.html` directamente en el navegador. No necesita servidor.

> ⚠️ `config.js` está en `.gitignore` y nunca se sube al repositorio.
