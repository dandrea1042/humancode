# DESIGN.md — HumanCode
## Sistema de diseño y arquitectura UX/UI

---

# 1. Filosofía de diseño

HumanCode debe sentirse:
- intuitivo,
- humano,
- visual,
- amigable,
- moderno,
- educativo,
- y poco intimidante.

La interfaz NO debe parecer una plataforma técnica tradicional.

El usuario debe sentir que:
- está aprendiendo un idioma,
- entiende patrones,
- y puede experimentar sin miedo.

---

# 2. Principios UX

## 2.1 Human-first

La lógica humana aparece antes que el código.

Mala experiencia:
```python
for i in range(10):

Buena experiencia:

“Repite esto 10 veces.”

↓

Código.

2.2 Aprendizaje progresivo

Mostrar:

idea,
patrón,
visual,
lógica,
código.

Nunca mostrar demasiada complejidad al mismo tiempo.

2.3 Recompensa inmediata

El usuario debe:

interactuar rápido,
recibir feedback visual,
y ver resultados instantáneamente.
2.4 Diseño basado en patrones

Cada concepto debe tener:

color,
icono,
animación,
metáfora visual.

Ejemplos:

Concepto	Visual	Color
Loop	🔄	Azul
Condición	🚪	Naranja
Función	⚡	Morado
Error	⚠️	Rojo
Variable	📦	Verde
3. Arquitectura UX
3.1 Flujo principal del usuario
Home

↓

Seleccionar patrón

↓

Ver explicación humana

↓

Ver representación visual

↓

Entender lógica

↓

Ver código real

↓

Resolver ejercicio

↓

Feedback

↓

Desbloquear siguiente patrón
4. Mapa de pantallas
4.1 Landing Page

Objetivo:

explicar el concepto rápidamente.

Secciones:

Hero section
Cómo funciona
Ejemplos visuales
Demo interactiva
CTA
Testimonios
FAQ
4.2 Dashboard

Elementos:

progreso,
patrones aprendidos,
streak,
ejercicios,
módulos.
4.3 Vista de aprendizaje

Dividida en 4 paneles:

Panel humano

Ejemplo cotidiano.

Panel visual

Animación/patrón.

Panel lógico

Explicación computacional.

Panel código

Código editable.

4.4 Playground

Editor interactivo donde:

el usuario escribe frases humanas,
el sistema genera lógica,
y luego código.
4.5 Biblioteca de patrones

Categorías:

Condicionales
Loops
Variables
Funciones
Arrays
Objetos
Algoritmos básicos
5. Sistema visual
5.1 Tipografía
Principal

Inter

Secundaria

Poppins

Razones:

modernas,
legibles,
amigables para educación.
5.2 Paleta de colores
Fondo

#0F172A

Superficies

#1E293B

Primario

#3B82F6

Secundario

#8B5CF6

Acento

#F59E0B

Error

#EF4444

Success

#10B981

5.3 Estilo visual

Características:

glassmorphism ligero,
tarjetas redondeadas,
sombras suaves,
mucho espacio visual,
microanimaciones,
ilustraciones minimalistas.
6. Componentes principales
6.1 PatternCard

Muestra:

icono,
nombre,
explicación corta,
dificultad.
6.2 LogicTranslator

Convierte:
Lenguaje humano → lógica → código.

6.3 VisualPattern

Componente animado para representar patrones.

Ejemplo:

loop girando,
condición bifurcándose,
función activándose.
6.4 CodePanel

Editor interactivo con:

syntax highlighting,
autocompletado,
preview,
feedback visual.
6.5 ExerciseCard

Incluye:

reto,
pista,
validación,
explicación.
7. Experiencia emocional

El diseño debe reducir:

ansiedad,
miedo al código,
frustración.

Debe aumentar:

curiosidad,
exploración,
sensación de progreso.
8. Gamificación

Elementos:

XP,
badges,
niveles,
streaks,
logros,
desbloqueos.
9. Responsive Design

Prioridad:

Desktop
Tablet
Mobile

Mobile debe funcionar para:

ejercicios rápidos,
repaso,
microlearning.
10. Accesibilidad

Implementar:

contraste AA,
navegación teclado,
subtítulos,
lectores de pantalla,
tamaños escalables.
11. Animaciones

Usar:

Framer Motion

Reglas:

suaves,
rápidas,
no invasivas.
12. Diseño del sistema de aprendizaje

Cada lección debe incluir:

Introducción humana

↓

Patrón visual

↓

Explicación lógica

↓

Código

↓

Interacción

↓

Ejercicio

↓

Validación

↓

Resumen
13. Diseño de IA futura

La IA debe:

explicar errores como humano,
detectar confusión,
adaptar dificultad,
generar analogías,
recomendar ejercicios.
14. Identidad de marca

La marca debe transmitir:

inteligencia accesible,
creatividad,
lógica humana,
tecnología amigable.
15. Resultado esperado

El usuario debe sentir:

“Ahora entiendo por qué funciona el código.”

No solo:

“Memoricé sintaxis.”