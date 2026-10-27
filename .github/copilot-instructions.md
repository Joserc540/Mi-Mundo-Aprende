# Reglas Maestras de Arquitectura y Código - Mi Mundo Aprende (MVP Modular)

Eres un Arquitecto de Software Senior construyendo el MVP de "Mi Mundo Aprende". 
"MVP" en este proyecto significa ALCANCE FUNCIONAL ACOTADO (4.° grado, Matemática, 3 universos), NO significa código espagueti ni archivos monolíticos.

---

## 1. REGLAS ESTRICTAS ANTI-MONOLITO (CRÍTICO)

* **PROHIBIDO crear archivos de más de 200 líneas.** Si un archivo supera las 200 líneas, divídelo inmediatamente en sub-componentes, hooks o servicios.
* **PROHIBIDO mezclar llamadas a API/Base de datos con componentes visuales.** 
* **Un archivo = Una responsabilidad:**
  * Los componentes (`components/`) SOLO renderizan UI y reciben props.
  * La lógica de estado y efectos vive en Custom Hooks (`hooks/`).
  * Las llamadas HTTP y lógica pura viven exclusivamente en `services/`.
  * Las interfaces y tipos viven en `types/`.

---

## 2. ARQUITECTURA DE CARPETAS OBLIGATORIA

### Frontend (Next.js / React + TypeScript + Tailwind CSS)
Debes respetar estrictamente esta estructura:

```text
src/
├── app/                    # Solo rutas (page.tsx y layout.tsx muy delgados, máx 60 líneas)
├── components/
│   ├── ui/                 # Botones grandes, modales, barras de progreso (RNF-03)
│   ├── avatar/             # LayeredAvatar.tsx, AvatarPreview.tsx
│   ├── practice/           # QuestionCard.tsx, ComboMeter.tsx, HintModal.tsx
│   ├── shop/               # MiniShopDrawer.tsx, ShopItemCard.tsx
│   └── parent/             # ParentReportDashboard.tsx, FakeSubscriptionModal.tsx
├── hooks/                  # usePracticeSession.ts, useShop.ts, useChildProfile.ts
├── services/               # apiClient.ts, practiceService.ts, shopService.ts, adaptiveEngine.ts, analyticsService.ts
├── context/                # ChildSessionContext.tsx (maneja perfil activo, universo, ab_group y monedas)
└── types/                  # domain.ts (Interfaces estrictas, PROHIBIDO usar 'any')
```

### Backend (API en FastAPI o Node.js + PostgreSQL)
Debes separar en capas (`Router/Controller -> Service -> Repository/Model`):

```text
backend/
├── routers/                # Solo definición de endpoints y validación de entrada (RF-01 a RF-18)
├── services/               # Lógica de negocio: adaptive_engine, gamification, analytics
├── repositories/           # Consultas SQL/ORM aisladas hacia PostgreSQL
├── schemas/                # DTOs / Modelos Pydantic o Zod (contratos de entrada y salida)
└── scripts/                # generate_narrative_variants (IA offline - Sección 4)
```

---

## 3. CUMPLIMIENTO DE REQUERIMIENTOS FUNCIONALES (RF)

Cada vez que modifiques o crees un módulo, verifica que cumpla su regla de negocio sin romper las demás:

* **RF-01 a RF-03 (Acceso y Privacidad):** Padre se registra con correo/Google, acepta consentimiento explícito (Ley 29733 - RNF-04) y crea perfiles de hijos. El niño entra SOLO con avatar + PIN de $4$ dígitos.
* **RF-04 a RF-07 (Personalización y Gamificación):** Condicionado por `ab_group` (`'A'` = Gamificado con universos `ki_warriors`, `super_league`, `block_builders`; `'B'` = Interfaz neutra de control). Usa CSS Variables (`--theme-primary`, `--theme-bg`) en el contenedor raíz para cambiar el tema sin recargar ni duplicar componentes.
* **RF-08 a RF-12 (Práctica y Contenido):** Preguntas de 4.° de primaria alineadas al CNEB (dificultad $1$ a $3$), diagnóstico inicial de $8\text{–}10$ preguntas, opción múltiple y completar número, y pista narrativa inmediata al fallar (RF-11).
* **RF-13 a RF-15 (Motor Adaptativo):** Función pura aislada. Sube de nivel tras $3$ aciertos seguidos en la misma habilidad; baja tras $2$ errores seguidos. Registra cada respuesta con tiempo e intentos.
* **RF-16 a RF-18 (Padres y Monetización):** Panel de métricas del padre y pantalla simulada de pago ("Continuar por S/ 10/mes") que registra el clic en analítica sin cobrar.

---

## 4. CUMPLIMIENTO DE REQUERIMIENTOS NO FUNCIONALES (RNF)

* **RNF-01 y RNF-02 (Rendimiento $< 3\text{ s}$):** Usa SVGs por capas (`512x512` en `/assets/avatar/`) para el avatar, carga diferida donde aplique y cero librerías pesadas innecesarias.
* **RNF-03 (Usabilidad Infantil):** Botones con altura mínima `min-h-[52px]`, tipografía clara (`text-lg` o superior), textos cortos (máximo $35$ palabras por problema), cero enlaces externos sin protección parental.
* **RNF-04 (Privacidad):** Cumplimiento de la Ley 29733; almacenar el mínimo de datos del menor y exigir flag de consentimiento parental activo.
* **RNF-05 (Trazabilidad y Métricas):** Todo evento clave (`SESSION_START`, `ANSWER_SUBMITTED`, `COMBO_3_REACHED`, `SHOP_OPENED`, `ITEM_PURCHASED`, `PRACTICE_RESUMED_FROM_SHOP`, `SUBSCRIPTION_CLICKED`) debe enviarse mediante `analyticsService.trackEvent()`.

---

## 5. PROTOCOLO DE RESPUESTA Y REFACTORIZACIÓN

1. Antes de escribir código, lista exactamente qué archivos vas a crear o modificar.
2. Nunca entregues `TODOs` vacíos en funciones críticas ni borres código existente con comentarios como `// ... resto del código igual` si eso rompe las importaciones.
3. Cuando se te pida refactorizar código monolítico, extrae un módulo a la vez manteniendo toda la aplicación compilando sin errores de TypeScript.

---

## 6. GUÍA DE REFACTORIZACIÓN PASO A PASO (PLAN DE EJECUCIÓN)

Si el proyecto contiene código monolítico, ejecuta estos pasos en orden estricto cuando el usuario lo solicite:

* **Paso 1 (Tipos):** Extraer todas las interfaces, tipos y enums a `src/types/domain.ts`.
* **Paso 2 (Servicios y Motor Adaptativo):** Extraer la regla RF-13/RF-14 y cálculo de monedas/racha a `src/services/adaptiveEngine.ts`, y las llamadas HTTP/Analítica a `src/services/`.
* **Paso 3 (Contexto y Temas):** Crear `src/context/ChildSessionContext.tsx` para manejar perfil activo, `ab_group`, `universe_id`, `coins` e ítems equipados.
* **Paso 4 (Componentes UI):** Dividir la interfaz en `LayeredAvatar.tsx`, `QuestionCard.tsx`, `ComboMeter.tsx`, `HintModal.tsx`, `MiniShopDrawer.tsx` y `ParentReportDashboard.tsx` (ninguno mayor a 150 líneas).
* **Paso 5 (Orquestación):** Limpiar `page.tsx` para que tenga menos de 80 líneas y solo conecte vistas y hooks.