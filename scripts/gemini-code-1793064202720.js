// scripts/generate-svg-assets.js (Versión ES Modules)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'avatar');

const assets = {
  // 0. CUERPO BASE (Necesario para que las capas calcen sobre el personaje)
  'base_body.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFDFC4"/>
      <stop offset="100%" stop-color="#F0C09A"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <g filter="url(#softShadow)">
    <!-- Sombra de piso -->
    <ellipse cx="256" cy="472" rx="75" ry="14" fill="#000000" fill-opacity="0.15"/>
    <!-- Piernas -->
    <rect x="200" y="365" width="36" height="90" rx="18" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <rect x="276" y="365" width="36" height="90" rx="18" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <!-- Brazos -->
    <rect x="144" y="252" width="40" height="105" rx="20" transform="rotate(10 144 252)" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <rect x="328" y="258" width="40" height="105" rx="20" transform="rotate(-10 328 258)" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <!-- Torso neutro (Camiseta interior gris/blanca) -->
    <path d="M188 248 C188 240 324 240 324 248 L316 382 C316 390 196 390 196 382 Z" fill="#E2E8F0" stroke="#475569" stroke-width="5"/>
    <!-- Cuello -->
    <rect x="236" y="222" width="40" height="35" rx="10" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <!-- Orejas -->
    <circle cx="182" cy="175" r="16" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <circle cx="330" cy="175" r="16" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <!-- Cabeza -->
    <rect x="184" y="102" width="144" height="136" rx="64" fill="url(#skinGrad)" stroke="#5C3A21" stroke-width="5"/>
    <!-- Ojos expresivos estilo anime/juego -->
    <ellipse cx="226" cy="170" rx="11" ry="14" fill="#1E293B"/>
    <ellipse cx="286" cy="170" rx="11" ry="14" fill="#1E293B"/>
    <circle cx="222" cy="164" r="4" fill="#FFFFFF"/>
    <circle cx="282" cy="164" r="4" fill="#FFFFFF"/>
    <!-- Cejas -->
    <path d="M210 148 Q226 142 238 148" stroke="#5C3A21" stroke-width="5" stroke-linecap="round"/>
    <path d="M274 148 Q286 142 302 148" stroke="#5C3A21" stroke-width="5" stroke-linecap="round"/>
    <!-- Sonrisa confiada -->
    <path d="M240 202 Q256 214 272 202" stroke="#5C3A21" stroke-width="5" stroke-linecap="round" fill="none"/>
  </g>
</svg>`,

  // ==========================================
  // UNIVERSO 1: GUERREROS DEL COSMOS (ki_warriors)
  // ==========================================

  'ki_hair_gold.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <linearGradient id="goldHair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF380"/>
      <stop offset="55%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#FACC15" flood-opacity="0.75"/>
    </filter>
  </defs>
  <g filter="url(#goldGlow)">
    <!-- Puntas traseras y superiores -->
    <path d="M175 160 L125 115 L180 120 L145 55 L215 95 L256 22 L297 95 L367 55 L332 120 L387 115 L337 160 C315 110 197 110 175 160 Z" 
          fill="url(#goldHair)" stroke="#92400E" stroke-width="5" stroke-linejoin="round"/>
    <!-- Mechones frontales sobre la frente -->
    <path d="M185 135 L210 175 L230 130 L256 178 L282 130 L302 175 L327 135" 
          fill="url(#goldHair)" stroke="#92400E" stroke-width="5" stroke-linejoin="round"/>
    <!-- Brillos internos -->
    <path d="M256 42 L245 95 M165 72 L205 105 M347 72 L307 105" stroke="#FEF08A" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>`,

  'ki_aura_blue.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <radialGradient id="blueAuraGrad" cx="50%" cy="55%" r="50%">
      <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.65"/>
      <stop offset="85%" stop-color="#0284C7" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0369A1" stop-opacity="0"/>
    </radialGradient>
    <filter id="auraBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>
  <!-- Resplandor base -->
  <ellipse cx="256" cy="270" rx="175" ry="215" fill="url(#blueAuraGrad)"/>
  <!-- Llamas de energía exteriores -->
  <path d="M120 455 L95 360 L130 375 L105 260 L145 280 L135 155 L185 190 L205 75 L256 125 L307 75 L327 190 L377 155 L367 280 L407 260 L382 375 L417 360 L392 455 Z" 
        fill="#38BDF8" fill-opacity="0.35" stroke="#7DD3FC" stroke-width="4" filter="url(#auraBlur)"/>
  <!-- Arco eléctrico / destellos -->
  <path d="M140 310 L165 285 L150 265 L180 235" stroke="#BAE6FD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M370 330 L345 300 L365 280 L335 245" stroke="#BAE6FD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="160" cy="140" r="6" fill="#E0F2FE"/>
  <circle cx="355" cy="130" r="8" fill="#E0F2FE"/>
  <circle cx="125" cy="390" r="7" fill="#E0F2FE"/>
</svg>`,

  'ki_scouter_red.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Orejera tecnológica izquierda -->
  <rect x="166" y="152" width="22" height="42" rx="6" fill="#E2E8F0" stroke="#334155" stroke-width="4"/>
  <rect x="170" y="162" width="10" height="22" rx="3" fill="#475569"/>
  <!-- Brazo metálico conector -->
  <path d="M188 165 H202" stroke="#334155" stroke-width="6"/>
  <!-- Lente holográfico rojo sobre el ojo izquierdo (cx=226, cy=170) -->
  <rect x="196" y="148" width="58" height="42" rx="10" fill="#EF4444" fill-opacity="0.68" stroke="#991B1B" stroke-width="4"/>
  <!-- Mira y datos geométricos sin texto -->
  <circle cx="225" cy="169" r="11" stroke="#FEF08A" stroke-width="2.5" stroke-dasharray="6 3"/>
  <line x1="204" y1="160" x2="214" y2="160" stroke="#FEF08A" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="204" y1="166" x2="210" y2="166" stroke="#FEF08A" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="204" y1="178" x2="216" y2="178" stroke="#FEF08A" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,

  'ki_gi_master.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <linearGradient id="giOrange" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
  </defs>
  <!-- Pantalones holgados de artes marciales -->
  <path d="M194 360 H318 L324 438 H268 L256 392 L244 438 H188 Z" fill="url(#giOrange)" stroke="#7C2D12" stroke-width="5" stroke-linejoin="round"/>
  <!-- Camiseta interior azul visible en el cuello -->
  <path d="M222 246 L256 290 L290 246 Z" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="4"/>
  <!-- Túnica superior cruzada (Gi) -->
  <path d="M180 244 L225 244 L256 292 L287 244 L332 244 L318 375 H194 Z" fill="url(#giOrange)" stroke="#7C2D12" stroke-width="5" stroke-linejoin="round"/>
  <!-- Pliegues del Gi -->
  <path d="M215 246 L268 345" stroke="#7C2D12" stroke-width="4" stroke-linecap="round"/>
  <path d="M297 246 L245 310" stroke="#7C2D12" stroke-width="4" stroke-linecap="round"/>
  <!-- Cinturón azul (Obi) y lazos -->
  <rect x="190" y="342" width="132" height="22" rx="6" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="4"/>
  <path d="M248 352 L228 405 M264 352 L284 405" stroke="#1D4ED8" stroke-width="10" stroke-linecap="round"/>
  <!-- Muñequeras azules -->
  <rect x="136" y="318" width="42" height="22" rx="6" transform="rotate(10 136 318)" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="4"/>
  <rect x="334" y="324" width="42" height="22" rx="6" transform="rotate(-10 334 324)" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="4"/>
</svg>`,

  // ==========================================
  // UNIVERSO 2: SÚPER LIGA (super_league)
  // ==========================================

  'sl_jersey_bicolor.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <clipPath id="shirtClip">
      <path d="M162 256 L192 242 H320 L350 256 L362 302 L322 312 L316 376 H196 L190 312 L150 302 Z"/>
    </clipPath>
  </defs>
  <!-- Shorts deportivos rojos -->
  <path d="M196 368 H316 L320 422 H264 L256 392 L248 422 H192 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="5" stroke-linejoin="round"/>
  <!-- Base camiseta blanca con franja roja diagonal -->
  <g clip-path="url(#shirtClip)">
    <rect x="145" y="235" width="225" height="150" fill="#FFFFFF"/>
    <path d="M195 235 L245 235 L325 385 L275 385 Z" fill="#DC2626"/>
  </g>
  <!-- Contorno de la camiseta -->
  <path d="M162 256 L192 242 H320 L350 256 L362 302 L322 312 L316 376 H196 L190 312 L150 302 Z" fill="none" stroke="#334155" stroke-width="5" stroke-linejoin="round"/>
  <!-- Cuello V rojo y bordes de manga dorados -->
  <path d="M226 242 L256 268 L286 242" stroke="#DC2626" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="288" cy="282" r="10" fill="#FACC15" stroke="#B45309" stroke-width="3"/>
</svg>`,

  'sl_boots_fire.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <linearGradient id="fireGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#DC2626"/>
      <stop offset="60%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#FACC15"/>
    </linearGradient>
  </defs>
  <!-- Estelas de fuego detrás de los chimpunes -->
  <path d="M180 455 Q160 420 190 395 Q195 420 210 410 Q200 440 225 455 Z" fill="url(#fireGrad)"/>
  <path d="M332 455 Q352 420 322 395 Q317 420 302 410 Q312 440 287 455 Z" fill="url(#fireGrad)"/>
  <!-- Chimpún Izquierdo -->
  <path d="M192 435 H236 L242 465 C242 472 180 472 180 462 C180 450 192 448 192 435 Z" fill="url(#fireGrad)" stroke="#7C2D12" stroke-width="4"/>
  <!-- Tacos izquierdos -->
  <rect x="186" y="470" width="8" height="6" rx="2" fill="#E2E8F0"/>
  <rect x="206" y="470" width="8" height="6" rx="2" fill="#E2E8F0"/>
  <rect x="226" y="470" width="8" height="6" rx="2" fill="#E2E8F0"/>
  <!-- Chimpún Derecho -->
  <path d="M276 435 H320 C320 448 332 450 332 462 C332 472 270 472 270 465 Z" fill="url(#fireGrad)" stroke="#7C2D12" stroke-width="4"/>
  <!-- Tacos derechos -->
  <rect x="278" y="470" width="8" height="6" rx="2" fill="#E2E8F0"/>
  <rect x="298" y="470" width="8" height="6" rx="2" fill="#E2E8F0"/>
  <rect x="318" y="470" width="8" height="6" rx="2" fill="#E2E8F0"/>
</svg>`,

  'sl_hair_lightning.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Cabello deportivo degradado con cresta dinámica -->
  <path d="M184 152 C180 110 215 78 265 72 L255 92 L295 78 L282 98 C318 98 334 122 328 152 C310 118 202 118 184 152 Z" 
        fill="#1E293B" stroke="#0F172A" stroke-width="5" stroke-linejoin="round"/>
  <!-- Diseño de rayo dorado rapado en el lateral -->
  <path d="M192 128 L222 116 L212 132 L242 122" stroke="#FACC15" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Vincha deportiva roja y blanca -->
  <rect x="182" y="128" width="148" height="18" rx="8" fill="#DC2626" stroke="#7F1D1D" stroke-width="4"/>
  <line x1="186" y1="137" x2="326" y2="137" stroke="#FFFFFF" stroke-width="4"/>
</svg>`,

  'sl_ball_galaxy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <radialGradient id="galaxyBall" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="55%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </radialGradient>
  </defs>
  <!-- Anillo orbital cósmico alrededor del balón (Posición mascota: 400, 390) -->
  <ellipse cx="400" cy="390" rx="68" ry="22" transform="rotate(-20 400 390)" stroke="#38BDF8" stroke-width="5" stroke-dasharray="12 6" fill="none"/>
  <!-- Esfera del balón -->
  <circle cx="400" cy="390" r="42" fill="url(#galaxyBall)" stroke="#E0E7FF" stroke-width="4"/>
  <!-- Pentágono central y líneas de paneles brillantes -->
  <polygon points="400,372 417,384 410,404 390,404 383,384" fill="#38BDF8" fill-opacity="0.85" stroke="#BAE6FD" stroke-width="2.5"/>
  <line x1="400" y1="372" x2="400" y2="348" stroke="#BAE6FD" stroke-width="3"/>
  <line x1="417" y1="384" x2="440" y2="376" stroke="#BAE6FD" stroke-width="3"/>
  <line x1="410" y1="404" x2="426" y2="424" stroke="#BAE6FD" stroke-width="3"/>
  <line x1="390" y1="404" x2="374" y2="424" stroke="#BAE6FD" stroke-width="3"/>
  <line x1="383" y1="384" x2="360" y2="376" stroke="#BAE6FD" stroke-width="3"/>
  <!-- Estrellas flotantes -->
  <circle cx="345" cy="345" r="4" fill="#FEF08A"/>
  <circle cx="455" cy="425" r="5" fill="#FEF08A"/>
</svg>`,

  // ==========================================
  // UNIVERSO 3: CONSTRUCTORES BLOQUE (block_builders)
  // ==========================================

  'bb_armor_diamond.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <linearGradient id="crystalGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A5F3FC"/>
      <stop offset="50%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#0891B2"/>
    </linearGradient>
  </defs>
  <!-- Hombreras escalonadas estilo bloque/voxel -->
  <polygon points="140,242 195,242 195,288 155,288 155,270 140,270" fill="url(#crystalGrad)" stroke="#164E63" stroke-width="5" stroke-linejoin="round"/>
  <polygon points="372,242 317,242 317,288 357,288 357,270 372,270" fill="url(#crystalGrad)" stroke="#164E63" stroke-width="5" stroke-linejoin="round"/>
  <!-- Pechera de cristal geométrica -->
  <polygon points="186,242 326,242 326,356 296,356 296,380 216,380 216,356 186,356" fill="url(#crystalGrad)" stroke="#164E63" stroke-width="5" stroke-linejoin="round"/>
  <!-- Detalles pixelados de brillo en el pecho -->
  <rect x="206" y="262" width="22" height="22" fill="#ECFEFF" fill-opacity="0.75"/>
  <rect x="228" y="284" width="22" height="22" fill="#ECFEFF" fill-opacity="0.75"/>
  <rect x="262" y="262" width="42" height="22" fill="#0E7490" fill-opacity="0.45"/>
  <!-- Grebas / Rodilleras de cristal -->
  <rect x="196" y="384" width="44" height="54" fill="url(#crystalGrad)" stroke="#164E63" stroke-width="5"/>
  <rect x="272" y="384" width="44" height="54" fill="url(#crystalGrad)" stroke="#164E63" stroke-width="5"/>
</svg>`,

  'bb_pickaxe_laser.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#D946EF" flood-opacity="0.85"/>
    </filter>
  </defs>
  <!-- Posicionado en la mano derecha del avatar (X:350, Y:280) -->
  <g transform="rotate(15 375 285)">
    <!-- Mango metálico tecno-voxel -->
    <rect x="368" y="200" width="16" height="145" rx="4" fill="#334155" stroke="#0F172A" stroke-width="4"/>
    <rect x="371" y="230" width="10" height="80" fill="#64748B"/>
    <!-- Cabezal de pico de plasma escalonado -->
    <g filter="url(#laserGlow)">
      <polygon points="315,215 345,185 407,185 437,215 422,230 397,205 355,205 330,230" 
               fill="#F0ABFC" stroke="#A21CAF" stroke-width="4" stroke-linejoin="round"/>
      <!-- Núcleo de energía central -->
      <rect x="364" y="178" width="24" height="24" rx="4" fill="#38BDF8" stroke="#0284C7" stroke-width="4"/>
    </g>
  </g>
</svg>`,

  'bb_pet_slime.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Sombra de mascota -->
  <ellipse cx="400" cy="456" rx="46" ry="10" fill="#000000" fill-opacity="0.2"/>
  <!-- Cubo exterior gelatinoso translúcido (Posición mascota: 352 a 448) -->
  <rect x="352" y="360" width="96" height="90" rx="14" fill="#4ADE80" fill-opacity="0.78" stroke="#15803D" stroke-width="5"/>
  <!-- Brillo superior izquierdo en bloque -->
  <rect x="364" y="372" width="24" height="12" rx="4" fill="#DCFCE7" fill-opacity="0.9"/>
  <!-- Núcleo interno gelatinoso -->
  <rect x="372" y="382" width="56" height="50" rx="8" fill="#16A34A" fill-opacity="0.65"/>
  <!-- Ojos cuadrados kawaii -->
  <rect x="378" y="396" width="12" height="14" rx="2" fill="#052E16"/>
  <rect x="410" y="396" width="12" height="14" rx="2" fill="#052E16"/>
  <rect x="380" y="398" width="5" height="5" fill="#FFFFFF"/>
  <rect x="412" y="398" width="5" height="5" fill="#FFFFFF"/>
  <!-- Boca feliz pixelada -->
  <path d="M394 416 H406 V422 H394 Z" fill="#052E16"/>
</svg>`,

  'bb_aura_pixels.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Marco de energía digital suave detrás del avatar -->
  <rect x="116" y="86" width="280" height="360" rx="32" fill="#10B981" fill-opacity="0.1" stroke="#34D399" stroke-width="3" stroke-dasharray="16 12"/>
  <!-- Partículas de bloques/voxels ascendentes alrededor del personaje -->
  <!-- Izquierda -->
  <rect x="96" y="360" width="24" height="24" rx="4" fill="#22D3EE" stroke="#0891B2" stroke-width="3"/>
  <rect x="122" y="260" width="18" height="18" rx="3" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>
  <rect x="88" y="170" width="28" height="28" rx="4" fill="#A855F7" stroke="#7E22CE" stroke-width="3"/>
  <rect x="138" y="95" width="16" height="16" rx="3" fill="#4ADE80" stroke="#16A34A" stroke-width="3"/>
  <!-- Derecha -->
  <rect x="392" y="350" width="26" height="26" rx="4" fill="#4ADE80" stroke="#16A34A" stroke-width="3"/>
  <rect x="374" y="245" width="20" height="20" rx="3" fill="#22D3EE" stroke="#0891B2" stroke-width="3"/>
  <rect x="400" y="155" width="24" height="24" rx="4" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>
  <rect x="355" y="88" width="18" height="18" rx="3" fill="#F43F5E" stroke="#BE123C" stroke-width="3"/>
  <!-- Destellos plus (+) -->
  <path d="M110 125 V141 M102 133 H118" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
  <path d="M408 295 V311 M400 303 H416" stroke="#FACC15" stroke-width="4" stroke-linecap="round"/>
</svg>`
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

Object.entries(assets).forEach(([filename, content]) => {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`✅ Generado: public/assets/avatar/${filename}`);
});

console.log('\n🎉 ¡Los 13 assets SVG (512x512, transparentes y alineados por capas) están listos!');