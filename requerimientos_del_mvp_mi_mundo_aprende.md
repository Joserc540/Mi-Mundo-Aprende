# Requerimientos del MVP - Mi Mundo Aprende

**Fecha:** Oct 26, 2026  
**Autor:** @Patrick Ricardo

---

## 1. Hipótesis que el MVP debe probar

El MVP no es una versión pequeña de todo el producto: es lo mínimo necesario para comprobar la hipótesis más peligrosa. Esta sostiene toda la curva de valor (factores "Aumentar" y "Crear").

* **H1:** Los niños de 3.° a 5.° practican más tiempo y con más frecuencia cuando pueden personalizar su entorno y aprender dentro de un universo temático, que en una interfaz estándar.
* **H2:** Los padres que ven el avance de su hijo en un reporte están dispuestos a pagar S/ 10 al mes después de la prueba gratuita.

Si H1 es falsa, la diferenciación frente a Khan Academy y Perú Educa desaparece.

---

## 2. Alcance del MVP

* **Incluye:** un solo grado (4.°, por estar al medio del rango), una sola área (Matemática, la más fácil de medir con aciertos y errores), 2 o 3 universos temáticos (por ejemplo fútbol y espacio), personalización visual básica, dificultad adaptativa y un reporte simple para padres.
* **No incluye todavía:** las otras tres áreas, los tres grados, app móvil nativa, pasarela de pago real (Yape/Plin/Culqi), programa de referidos, plan familiar ni licencias a colegios. Todo eso depende de que H1 se confirme primero.

---

## 3. Requerimientos funcionales

**Prioridad:** $M =$ imprescindible, $S =$ deseable si hay tiempo.

| ID | Módulo | Requerimiento | Prioridad |
| :--- | :--- | :--- | :---: |
| **RF-01** | Cuentas y acceso | El padre crea una cuenta (correo o Google) y registra a uno o más hijos con nombre/apodo, grado y avatar | M |
| **RF-02** | Cuentas y acceso | El niño entra con un perfil seleccionable (avatar + PIN de 4 dígitos o imagen), sin correo propio | M |
| **RF-03** | Cuentas y acceso | El padre acepta un consentimiento explícito para el tratamiento de datos del menor | M |
| **RF-04** | Personalización | El niño elige un universo temático que cambia fondos, personajes e íconos de toda la experiencia | M |
| **RF-05** | Personalización | El niño elige paleta de colores y avatar, y los cambios se guardan en su perfil | M |
| **RF-06** | Personalización | Animaciones de celebración al acertar o completar una misión, propias de cada universo | S |
| **RF-07** | Personalización | Recompensas (stickers, accesorios del avatar) que se desbloquean al avanzar | S |
| **RF-08** | Contenido y práctica | Banco de preguntas de Matemática de 4.° organizado por competencia/capacidad del CNEB y etiquetado por dificultad (1 a 3) | M |
| **RF-09** | Contenido y práctica | El contenido es validado por un docente antes de publicarse | M |
| **RF-10** | Contenido y práctica | Tipos de pregunta: opción múltiple y completar con número (M); arrastrar/ordenar (S) | M/S |
| **RF-11** | Contenido y práctica | Retroalimentación inmediata con una pista o explicación breve al fallar | M |
| **RF-12** | Contenido y práctica | Diagnóstico inicial corto (8-10 preguntas) para ubicar el nivel de partida | M |
| **RF-13** | Dificultad adaptativa | El sistema estima el nivel del niño por habilidad y elige la siguiente pregunta según ese nivel | M |
| **RF-14** | Dificultad adaptativa | Regla base: sube de nivel tras 3 aciertos seguidos, baja tras 2 errores seguidos en la misma habilidad | M |
| **RF-15** | Dificultad adaptativa | Registro de cada respuesta (pregunta, nivel, acierto, tiempo, intentos) para entrenar después un modelo | M |
| **RF-16** | Reporte para padres | Panel con tiempo de práctica, temas trabajados y habilidades fuertes y débiles | M |
| **RF-17** | Reporte para padres | Resumen semanal por correo o WhatsApp | S |
| **RF-18** | Reporte para padres | Pantalla simulada de suscripción ("Continuar por S/ 10/mes") que registra clics sin cobrar, para medir intención de pago (H2) | M |

---

## 4. Uso de la IA en el MVP

La primera versión no debe depender de un modelo de IA complejo. Al inicio no hay datos para entrenarlo; la regla de RF-14 (o un modelo tipo Elo, igual de simple) funciona desde el primer día y es fácil de explicar. Además, con niños no conviene que un modelo genere preguntas o respuestas en vivo sin revisión.

Donde sí se puede usar IA desde ya, con poco riesgo:
* Generar variantes de preguntas fuera de línea, que luego un docente aprueba (acelera RF-08).
* Redactar el resumen del reporte para padres a partir de los datos.

Los datos de RF-15 son los que después permitirán pasar a un modelo adaptativo real.

---

## 5. Requerimientos no funcionales

| ID | Tipo | Requerimiento |
| :--- | :--- | :--- |
| **RNF-01** | Plataforma | Web responsiva que funcione bien en celular y tablet de gama media |
| **RNF-02** | Rendimiento | Carga en menos de 3 segundos con conexiones lentas (imágenes optimizadas) |
| **RNF-03** | Usabilidad infantil | Botones grandes, poco texto, audio opcional, sin publicidad ni enlaces externos |
| **RNF-04** | Privacidad | Mínimo de datos del menor; cumplir la Ley 29733, con consentimiento de los padres para menores de 14 años |
| **RNF-05** | Medición | Todas las acciones clave quedan registradas como eventos para medir el experimento |

---

## 6. Diseño del experimento y métricas

H1 se prueba con un A/B de 20-30 niños durante dos semanas: la mitad usa la versión con universos y personalización, la otra mitad la misma práctica con interfaz neutra.

| Hipótesis | Indicador | Criterio de éxito |
| :---: | :--- | :--- |
| **H1** | Minutos de práctica por sesión, sesiones en dos semanas y preguntas completadas | El grupo personalizado practica al menos 30% más de tiempo |
| **H2** | Tasa de clic en la pantalla de suscripción entre padres que vieron el reporte | Umbral por definir por el equipo |

---

## 7. Stack sugerido

Como AWS ya figura en el Business Model Canvas, se propone:

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React o Next.js |
| **Backend** | API en Node o Python (FastAPI) |
| **Base de datos** | PostgreSQL para usuarios, preguntas y respuestas |
| **Archivos** | S3 para las imágenes de los universos |
| **Analítica** | Tabla de eventos de respuesta lista para exportar a análisis |