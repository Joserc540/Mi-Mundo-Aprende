# Especificación Técnica de Implementación: Capa de Gamificación e Inmersión (MVP v1.1)

**Proyecto:** Mi Mundo Aprende  
**Objetivo:** Maximizar la métrica de H1 ($+30\%$ en tiempo de práctica y sesiones) para niños de 4.° de primaria (9-10 años) sin infringir derechos de autor (IP limpia) y manteniendo el rendimiento ($< 3\text{ s}$ de carga).  
**Estado Base:** Los requerimientos RF-01 a RF-18 ya están implementados y funcionales. Este documento describe únicamente los deltas (cambios incrementales) en Base de Datos, Backend, Frontend y Scripts Offline.

---

## 1. Reglas de Arquitectura y Experimento A/B

1. **Aislamiento del Grupo de Control (A/B Testing):**
   * El modelo de perfil del niño (`ChildProfile`) debe incluir o respetar el atributo `ab_group: 'A' | 'B'`.
   * **Grupo A (Experimental):** Ve los universos temáticos (*Guerreros del Cosmos*, *Súper Liga*, *Constructores Bloque*), enunciados contextualizados, sistema de racha/combo, monedas, tienda de avatares por capas y feedback narrativo.
   * **Grupo B (Control - Interfaz Neutra):** Mantiene la interfaz estándar actual, enunciados matemáticos neutros, sin monedas, sin tienda ni transformaciones visuales.
2. **Propiedad Intelectual (Copyright-Safe):**
   * Prohibido usar nombres, logos o assets con copyright (*Dragon Ball, Saiyajin, Goku, Kamehameha, Roblox, Minecraft, FIFA*).
   * Se utilizarán los 3 universos propios del MVP:
     1. `ki_warriors` (**Guerreros del Cosmos** - Inspiración anime/artes marciales y energía).
     2. `super_league` (**Súper Liga** - Inspiración fútbol/torneo mundial).
     3. `block_builders` (**Constructores Bloque** - Inspiración mundo voxel/bloques geométricos).

---

## 2. Cambios en Base de Datos (PostgreSQL)

Generar una migración incremental que agregue las siguientes columnas y tablas sin romper los registros actuales:

### 2.1. Modificaciones a tablas existentes

```sql
-- 1. En el perfil del niño (Child / Student Profile)
ALTER TABLE child_profiles
ADD COLUMN IF NOT EXISTS ab_group VARCHAR(10) DEFAULT 'A', -- 'A' (Gamificado) o 'B' (Neutro)
ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS equipped_items JSONB DEFAULT '{"aura": null, "hair": "default", "outfit": "default", "accessory": null, "pet": null}'::jsonb;

-- 2. En el banco de preguntas (Questions - RF-08)
-- Permite tener el enunciado neutro y las variantes narrativas por universo sin duplicar la pregunta ni alterar métricas.
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS narrative_variants JSONB DEFAULT '{}'::jsonb;
-- Ejemplo de estructura esperada en narrative_variants:
-- {
--   "neutral": "En una caja hay 24 manzanas y se reparten entre 6 amigos. ¿Cuántas recibe cada uno?",
--   "ki_warriors": "El Maestro tiene 24 Semillas de Energía para repartir en partes iguales entre sus 6 guerreros antes del torneo. ¿Cuántas recibe cada guerrero?",
--   "super_league": "El entrenador compró 24 balones oficiales para repartir en partes iguales entre 6 equipos del campeonato. ¿Cuántos balones recibe cada equipo?",
--   "block_builders": "En un cofre encontraste 24 diamantes y quieres repartirlos en partes iguales en 6 mesas de trabajo. ¿Cuántos diamantes van en cada mesa?"
-- }

-- 3. En las pistas/explicaciones (RF-11)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS narrative_hints JSONB DEFAULT '{}'::jsonb;
```

### 2.2. Nuevas tablas para Economía y Tienda (RF-07 mejorado)

```sql
-- Catálogo de ítems desbloqueables por capas (S3)
CREATE TABLE IF NOT EXISTS shop_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    universe_id VARCHAR(50) NOT NULL, -- 'ki_warriors', 'super_league', 'block_builders'
    category VARCHAR(30) NOT NULL,    -- 'aura', 'hair', 'outfit', 'accessory', 'pet'
    price INTEGER NOT NULL DEFAULT 50,
    asset_url TEXT NOT NULL,          -- Ruta al SVG/PNG transparente en S3
    z_index INTEGER NOT NULL DEFAULT 10, -- Orden de apilado en el avatar
    min_level_required INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventario de ítems comprados/desbloqueados por el niño
CREATE TABLE IF NOT EXISTS child_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_id, item_id)
);
```

---

## 3. Cambios en el Backend (API Endpoints & Lógica)

### 3.1. Actualización del Endpoint de Obtener Siguiente Pregunta (`GET /api/practice/next-question`)
* **Lógica actual (RF-13):** Selecciona una pregunta según el nivel estimado de la habilidad.
* **Cambio requerido:**
  * Verificar el `ab_group` y el `universe_id` del niño.
  * Si `ab_group == 'B'` (Control), devolver el texto original de la pregunta (o `narrative_variants.neutral`).
  * Si `ab_group == 'A'` (Experimental), reemplazar en el DTO de respuesta el campo `question_text` por `narrative_variants[child.universe_id]` (con fallback al texto original si no existe la llave) y `hint_text` por `narrative_hints[child.universe_id]`.

### 3.2. Actualización del Endpoint de Envío de Respuesta (`POST /api/practice/submit-answer`)
* **Lógica actual (RF-14 y RF-15):** Registra intento, evalúa si sube tras $3$ aciertos o baja tras $2$ errores.
* **Cambio requerido (Solo aplica recompensas visuales si `ab_group == 'A'`):**
  * **Cálculo de Racha (`current_streak`):**
    * Si `is_correct == true`: `current_streak += 1`. Actualizar `max_streak` si corresponde.
    * Si `is_correct == false`: `current_streak = 0`.
  * **Cálculo de Monedas (`coins_earned`):**
    * Acierto en el 1.er intento (`attempt_number == 1`): $+15\text{ monedas}$.
    * Acierto en el 2.do o más intentos: $+5\text{ monedas}$.
    * Bono de Combo (cuando $\text{current\_streak} \pmod 3 = 0$, coincidiendo con la subida de nivel de RF-14): $+20\text{ monedas extra}$ y flag `trigger_transformation = true`.
  * **Respuesta del Endpoint (JSON extendido):**
    ```json
    {
      "is_correct": true,
      "new_difficulty_level": 2,
      "level_up": true,
      "gamification": {
        "coins_earned": 35,
        "total_coins": 185,
        "current_streak": 3,
        "combo_milestone": true,
        "animation_trigger": "SUPER_PHASE_UP", 
        "feedback_title": "¡ATAQUE CRÍTICO! ¡Subiste tu poder al Nivel 2!"
      }
    }
    ```

### 3.3. Nuevos Endpoints de Tienda y Equipamiento
1. `GET /api/shop/items`: Lista los ítems de `shop_items` filtrados por el `universe_id` actual del niño, indicando cuáles ya están en `child_inventory`.
2. `POST /api/shop/buy`:
   * **Body:** `{ "child_id": "uuid", "item_id": "uuid" }`
   * Valida que `child.coins >= item.price` y que no lo posea ya.
   * Descuenta monedas en transacción atómica, inserta en `child_inventory` y registra el evento en la tabla de analítica (**RNF-05**): `event_type = 'ITEM_PURCHASED'`.
3. `PATCH /api/profile/equip`:
   * **Body:** `{ "child_id": "uuid", "category": "hair", "item_code": "ki_hair_gold" }`
   * Actualiza el JSONB `equipped_items` del niño y registra evento `ITEM_EQUIPPED`.

---

## 4. Cambios en el Frontend (React / Next.js)

### 4.1. Componente `<LayeredAvatar />` (Ligero y Modular)
En lugar de cargar imágenes pre-renderizadas pesadas, construir un componente basado en capas apiladas para cumplir con **RNF-02** ($< 3\text{ segundos}$):
* Contenedor relativo (`relative w-32 h-32 md:w-40 md:h-40`).
* Renderiza etiquetas `<img loading="eager" />` o SVGs con `position: absolute; inset: 0;` ordenadas por `z-index`:
  1. `z-10`: `aura` (Efecto de energía detrás del personaje; si `current_streak >= 3`, aplicar clase CSS `animate-pulse` o filtro `drop-shadow`).
  2. `z-20`: `body_base` (Silueta base del avatar).
  3. `z-30`: `outfit` (Traje marcial, camiseta de fútbol o armadura de bloques).
  4. `z-40`: `hair` (Cabello erizado dorado/azul, vincha deportiva o casco).
  5. `z-50`: `accessory` (Visor de poder, balón de fuego, pico de diamante).
  6. `z-60`: `pet` (Pequeño compañero flotando en la esquina inferior).

### 4.2. Componente `<ComboMeter />` y "Juicy Feedback" en la Pantalla de Práctica
* **Barra de Energía / Racha:** En la parte superior de la pregunta, mostrar 3 casillas o una barra de carga de $0/3$ a $3/3$ vinculada a la regla **RF-14**.
* **Estados Visuales de la Barra:**
  * `streak == 0`: Barra vacía ("Carga tu energía").
  * `streak == 1`: $1/3$ ("¡Buen golpe! $+15$ monedas").
  * `streak == 2`: $2/3$ con borde brillante ("¡A uno de la transformación!").
  * `streak == 3` (`combo_milestone == true`): Dispara overlay de celebración de $2.5\text{ segundos}$ (usando `canvas-confetti` o un archivo Lottie ligero $< 25\text{ KB}$), muestra cambio temporal de fase en el `<LayeredAvatar />` y sonido corto de victoria (opcional/muteable según **RNF-03**).
* **Feedback de Error Narrativo (RF-11):**
  * Si el niño falla, NO mostrar ícono rojo de error punitivo.
  * Mostrar un modal amigable con el avatar en pose defensiva:
    * `ki_warriors`: *"¡El rival bloqueó tu técnica! Usa este pergamino del Maestro para romper su defensa:"* + `[Pista]`.
    * `super_league`: *"¡Pegó en el travesaño! Escucha el consejo del DT para meter el gol en el rebote:"* + `[Pista]`.
    * `block_builders`: *"¡Ese bloque era muy duro! Usa esta herramienta especial para picarlo:"* + `[Pista]`.

### 4.3. Componente `<MiniShopDrawer />` (La Palanca de Retención)
* Accesible desde el header de la vista de práctica mediante un botón con el contador de monedas (`🪙 185`).
* Muestra los 8-10 ítems del universo actual.
* **Micro-interacción clave para H1:** Si un ítem cuesta $200$ monedas y el niño tiene $170$, el botón del ítem no dice simplemente "Bloqueado", sino: **"¡Te faltan $30$ monedas ($2$ problemas más)!"**. Esto incentiva al niño a volver a la práctica inmediatamente para completar la compra.

---

## 5. Script Offline de Generación de Variantes con IA (Sección 4 del MVP)

Crear un script utilitario en el backend (`scripts/generate_narrative_variants.py` o `.ts`) para poblar la columna `narrative_variants` de las preguntas existentes (**RF-08**) sin intervención en tiempo real:

1. El script lee todas las preguntas de la tabla `questions` donde `narrative_variants` esté vacío.
2. Por cada pregunta, envía un prompt al LLM con temperatura baja ($0.3$):
   > **System Prompt:** "Eres un pedagogo experto en el Currículo Nacional de Educación Básica (CNEB) de Perú para 4.° de primaria (9-10 años). Tu tarea es reescribir el siguiente problema matemático en 3 universos temáticos ('ki_warriors', 'super_league', 'block_builders') y 1 versión 'neutral'.
   > **REGLAS ESTRICTAS:**
   > 1. NUNCA cambies las cifras numéricas, las operaciones requeridas ni la respuesta correcta.
   > 2. Usa vocabulario emocionante para niños de 9-10 años en Perú, sin usar marcas registradas (no uses nombres como Goku, Saiyajin, Messi, Minecraft, Roblox).
   > 3. Mantén las oraciones cortas y directas (máximo 35 palabras por enunciado) para cumplir con RNF-03.
   > 4. Devuelve exclusivamente un objeto JSON válido con las llaves: `neutral`, `ki_warriors`, `super_league`, `block_builders`."
3. Guarda el resultado con estado `validation_status = 'PENDING_TEACHER_REVIEW'` para cumplir con **RF-09** (validación docente antes de publicar).

---

## 6. Instrumentación de Analítica Adicional (RNF-05)

Asegurar que el logger de eventos (`analytics_events`) registre estos nuevos eventos para explicar por qué se mueve la métrica de **H1**:
* `COMBO_3_REACHED`: Cuando el niño logra $3$ aciertos seguidos y activa la animación.
* `SHOP_OPENED`: Cuando el niño abre la tienda en medio o al final de una sesión.
* `ITEM_PURCHASED`: Cuando gasta monedas en un accesorio.
* `PRACTICE_RESUMED_FROM_SHOP`: Cuando el niño abre la tienda, ve que le faltan monedas para un ítem, cierra la tienda y resuelve al menos $1$ pregunta adicional en los siguientes $60\text{ segundos}$.

---

## 7. Seed Inicial de Ítems por Universo (Data de Prueba para el MVP)

Insertar este seed básico en `shop_items` para que la tienda funcione desde el día 1:

| Universo (`universe_id`) | Categoría (`category`) | Código (`code`) | Nombre Visible | Precio (`coins`) |
| :--- | :--- | :--- | :--- | :---: |
| `ki_warriors` | `hair` | `ki_hair_gold` | Cabello Fase Dorada | $100$ |
| `ki_warriors` | `aura` | `ki_aura_blue` | Aura de Energía Azul | $150$ |
| `ki_warriors` | `accessory` | `ki_scouter_red` | Visor de Nivel de Poder | $80$ |
| `ki_warriors` | `outfit` | `ki_gi_master` | Traje del Gran Torneo | $120$ |
| `super_league` | `outfit` | `sl_jersey_bicolor` | Camiseta Selección Histórica | $100$ |
| `super_league` | `accessory` | `sl_boots_fire` | Chimpunes de Fuego | $150$ |
| `super_league` | `hair` | `sl_hair_lightning` | Corte Rayo Dorado | $80$ |
| `super_league` | `pet` | `sl_ball_galaxy` | Balón Galáctico Flotante | $120$ |
| `block_builders` | `outfit` | `bb_armor_diamond` | Armadura de Cristal | $150$ |
| `block_builders` | `accessory` | `bb_pickaxe_laser` | Pico de Plasma | $100$ |
| `block_builders` | `pet` | `bb_pet_slime` | Cubo Mascota Saltarín | $80$ |
| `block_builders` | `aura` | `bb_aura_pixels` | Lluvia de Píxeles | $120$ |

---

## 8. Orden de Ejecución Sugerido para Copilot / Agente de Código

1. **Paso 1 (Base de Datos):** Ejecutar las migraciones SQL/ORM de la Sección 2 y correr el seed de `shop_items` de la Sección 7.
2. **Paso 2 (Backend):** Actualizar los endpoints de práctica (`/next-question` y `/submit-answer`) e implementar los 3 endpoints de tienda y equipamiento de la Sección 3, respetando el condicional `ab_group`.
3. **Paso 3 (IA Offline):** Crear el script de generación de variantes narrativas de la Sección 5.
4. **Paso 4 (Frontend y Analítica):** Construir `<LayeredAvatar />`, `<ComboMeter />` y `<MiniShopDrawer />` (Sección 4) y conectar los eventos de analítica (Sección 6).