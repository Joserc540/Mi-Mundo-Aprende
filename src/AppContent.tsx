import React, { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight, BarChart3, BookOpen, Check, ChevronLeft, CircleHelp, Clock3,
  Flame, Gift, Gem, LockKeyhole, LogOut, Menu, Play, Plus, Rocket, Settings2,
  ShieldCheck, Sparkles, Star, Target, Trophy, UserRound, X, Zap, RotateCcw
} from 'lucide-react';
import './styles.css';
import { calculateAdaptiveProgress } from './services/adaptiveEngine';
import { trackEvent } from './services/analyticsService';
import LayeredAvatar from './components/avatar/LayeredAvatar';
import MiniShopDrawer from './components/shop/MiniShopDrawer';
import { SHOP_ITEMS } from './data/shopItems';
import ComboMeter from './components/practice/ComboMeter';
import HintModal from './components/practice/HintModal';
import QuestionCard from './components/practice/QuestionCard';
import LevelUpModal from './components/practice/LevelUpModal';
import ParentReportDashboard from './components/parent/ParentReportDashboard';
import FakeSubscriptionModal from './components/parent/FakeSubscriptionModal';

import type { ChildProfile, Question, ShopItem, Universe } from './types/domain';

const universes: Record<string, Universe> = {
  space: {
    name: 'Cosmos',
    tagline: 'Explora. Resuelve. Despega.',
    icon: '🚀',
    accent: '#6c63ff',
    accentSoft: '#eeedff',
    background: 'linear-gradient(135deg, #171535 0%, #27245a 54%, #514bb1 100%)',
    character: '🧑🏽‍🚀',
    stars: '✦  ·  ✧  ·  ⋆  ·  ✦'
  },
  football: {
    name: 'Cancha',
    tagline: 'Entrena tu mente, juega en grande.',
    icon: '⚽',
    accent: '#159c76',
    accentSoft: '#dff7ee',
    background: 'linear-gradient(135deg, #073b32 0%, #08755b 58%, #26b183 100%)',
    character: '🧒🏽',
    stars: '╱  ╲  ╱  ╲  ╱  ╲'
  },
  jungle: {
    name: 'Selva',
    tagline: 'Cada pregunta es un nuevo camino.',
    icon: '🌿',
    accent: '#cf6d2d',
    accentSoft: '#fff0e2',
    background: 'linear-gradient(135deg, #263d2b 0%, #4d7337 55%, #c2853f 100%)',
    character: '🧒🏻',
    stars: '✿  ·  ❋  ·  ✿  ·  ❋'
  },
  ki: {
    id: 'ki_warriors',
    name: 'Guardianes Ki',
    tagline: 'Entrena tu mente. Desbloquea tu poder.',
    icon: '⚡',
    accent: '#f05b45',
    accentSoft: '#fff0e8',
    background: 'linear-gradient(135deg, #35165d 0%, #7531a8 52%, #ee754b 100%)',
    character: '🦸🏽',
    stars: '✦  ·  ◈  ·  ✦  ·  ◈'
  }
};
universes.space.id = 'space';
universes.football.id = 'super_league';
universes.jungle.id = 'block_builders';

const shopItems = SHOP_ITEMS;
const PROFILE_DATA_VERSION = 2;

const questions: Question[] = [
  { id: 1, skill: 'Multiplicación', difficulty: 1, prompt: '¿Cuánto es 6 × 4?', narrative_variants: { neutral: '¿Cuánto es 6 × 4?', ki_warriors: 'El Maestro pregunta: ¿cuánto es 6 × 4?', super_league: 'El entrenador pregunta: ¿cuánto es 6 × 4?', block_builders: 'Tu bloque necesita resolver: ¿cuánto es 6 × 4?' }, options: ['18', '24', '28', '32'], answer: '24', hint: 'Piensa en 6 grupos de 4.' },
  { id: 2, skill: 'Fracciones', difficulty: 1, prompt: '¿Qué fracción representa la parte pintada?', narrative_variants: { neutral: '¿Qué fracción representa la parte pintada?', ki_warriors: 'Descubre qué fracción de energía está pintada.', super_league: 'Mira la cancha: ¿qué fracción está pintada?', block_builders: 'Identifica qué fracción del bloque está pintada.' }, visual: 'half', options: ['1/2', '1/3', '2/3', '3/4'], answer: '1/2', hint: 'El círculo está dividido en dos partes iguales y una está pintada.' },
  { id: 3, skill: 'Geometría', difficulty: 2, prompt: 'Un cuadrado tiene lados de 5 cm. ¿Cuál es su perímetro?', options: ['10 cm', '15 cm', '20 cm', '25 cm'], answer: '20 cm', hint: 'Suma sus cuatro lados iguales.' },
  { id: 4, skill: 'División', difficulty: 2, prompt: 'Completa: 72 ÷ 8 =', options: ['7', '8', '9', '10'], answer: '9', hint: '¿Qué número multiplicado por 8 da 72?' },
  { id: 5, skill: 'Patrones', difficulty: 3, prompt: '¿Qué número sigue? 4, 8, 16, 32, …', options: ['36', '48', '56', '64'], answer: '64', hint: 'Cada número es el doble del anterior.' },
  { id: 6, skill: 'Problemas', difficulty: 2, prompt: 'Lía tiene 3 bolsas con 7 canicas cada una. ¿Cuántas tiene en total?', options: ['10', '18', '21', '24'], answer: '21', hint: 'Multiplica el número de bolsas por las canicas de cada una.' }
  ,{ id: 7, skill: 'Multiplicación', difficulty: 1, prompt: '¿Cuánto es 7 × 3?', options: ['18', '21', '24', '28'], answer: '21', hint: 'Suma 7 tres veces.' }
  ,{ id: 8, skill: 'División', difficulty: 1, prompt: '¿Cuánto es 45 ÷ 5?', options: ['7', '8', '9', '10'], answer: '9', hint: 'Busca qué número multiplicado por 5 da 45.' }
  ,{ id: 9, skill: 'Fracciones', difficulty: 2, prompt: '¿Cuál es mayor?', options: ['1/4', '1/2', '1/8', '1/10'], answer: '1/2', hint: 'Compara el tamaño de las partes.' }
  ,{ id: 10, skill: 'Geometría', difficulty: 1, prompt: '¿Cuántos lados tiene un hexágono?', options: ['4', '5', '6', '8'], answer: '6', hint: 'Cuenta cada segmento del borde.' }
  ,{ id: 11, skill: 'Patrones', difficulty: 2, prompt: '¿Qué número sigue? 3, 6, 12, 24, …', options: ['30', '36', '48', '52'], answer: '48', hint: 'Cada número se multiplica por 2.' }
  ,{ id: 12, skill: 'Problemas', difficulty: 2, prompt: 'Hay 4 cajas con 6 lápices cada una. ¿Cuántos lápices hay?', options: ['10', '20', '24', '28'], answer: '24', hint: 'Multiplica cajas por lápices.' }
  ,{ id: 13, skill: 'Multiplicación', difficulty: 2, prompt: '¿Cuánto es 12 × 4?', options: ['36', '40', '48', '52'], answer: '48', hint: 'Calcula 10 × 4 y suma 2 × 4.' }
  ,{ id: 14, skill: 'División', difficulty: 2, prompt: 'Completa: 56 ÷ 7 =', options: ['6', '7', '8', '9'], answer: '8', hint: '¿Qué número por 7 da 56?' }
  ,{ id: 15, skill: 'Geometría', difficulty: 3, prompt: 'Un rectángulo mide 6 cm por 3 cm. ¿Cuál es su área?', options: ['9 cm²', '18 cm²', '24 cm²', '36 cm²'], answer: '18 cm²', hint: 'Multiplica largo por ancho.' }
];
const SESSION_QUESTION_COUNT = questions.length;

function shuffleQuestions(items: Question[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

const initialProfiles: ChildProfile[] = [
  { id: 'leo', name: 'Leo', grade: '4.° grado', avatar: '👦🏻', universe: 'ki', color: '#f05b45', pin: '1234', sessions: 0, minutes: 0, answered: 0, strengths: [], needs: [], streak: 0, level: 1, ab_group: 'A', coins: 0, current_streak: 0, max_streak: 0, inventory: [], equipped_items: { aura: null, hair: 'default', outfit: 'default', accessory: null, pet: null } },
  { id: 'mateo', name: 'Mateo', grade: '4.° grado', avatar: '🧒🏻', universe: 'football', color: '#159c76', pin: '2468', sessions: 2, minutes: 17, answered: 18, strengths: ['Geometría'], needs: ['División'], streak: 1, level: 1, ab_group: 'B', coins: 0, current_streak: 0, max_streak: 1, inventory: [], equipped_items: { aura: null, hair: 'default', outfit: 'default', accessory: null, pet: null } }
];

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

function readProfiles() {
  if (localStorage.getItem('mundo-profile-version') !== String(PROFILE_DATA_VERSION)) {
    localStorage.setItem('mundo-profile-version', String(PROFILE_DATA_VERSION));
    localStorage.setItem('mundo-profiles', JSON.stringify(initialProfiles));
    return initialProfiles;
  }
  const storedProfiles = readStorage('mundo-profiles', initialProfiles);
  return storedProfiles.map((profile, index) => index === 0
    ? { ...initialProfiles[0], ...profile, id: 'leo', name: 'Leo', avatar: '👦🏻' }
    : profile);
}

function App() {
  const [profiles, setProfiles] = useState(readProfiles);
  const [consent, setConsent] = useState(() => readStorage('mundo-consent', false));
  const [activeProfile, setActiveProfile] = useState(null);
  const [screen, setScreen] = useState('welcome');
  const [parentMode, setParentMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => localStorage.setItem('mundo-profiles', JSON.stringify(profiles)), [profiles]);
  useEffect(() => localStorage.setItem('mundo-consent', JSON.stringify(consent)), [consent]);

  const universe = activeProfile ? universes[activeProfile.universe] : universes.space;
  const selectProfile = (profile) => {
    const inventory = (profile.inventory || []).filter(code => shopItems.some(item => item.code === code));
    const equipped = { ...initialProfiles[0].equipped_items, ...(profile.equipped_items || {}) };
    Object.keys(equipped).forEach(category => {
      if (equipped[category] !== 'default' && !inventory.includes(equipped[category])) equipped[category] = category === 'hair' || category === 'outfit' ? 'default' : null;
    });
    const normalized = { ...initialProfiles[0], ...profile, equipped_items: equipped, inventory };
    setActiveProfile(normalized);
    trackEvent('SESSION_START', normalized, { ab_group: normalized.ab_group });
    setParentMode(false);
    setScreen('home');
  };
  const updateProfile = (updates) => {
    setProfiles(current => current.map(profile => profile.id === activeProfile.id ? { ...profile, ...updates } : profile));
    setActiveProfile(current => ({ ...current, ...updates }));
  };
  const updateProfileById = (profileId: string, updates: Partial<ChildProfile>) => {
    setProfiles(current => current.map(profile => profile.id === profileId ? { ...profile, ...updates } : profile));
    setActiveProfile(current => current?.id === profileId ? { ...current, ...updates } : current);
  };
  const purchaseItemForProfile = (profile: ChildProfile, item: ShopItem) => {
    updateProfileById(profile.id, {
      coins: profile.coins - item.price,
      inventory: [...(profile.inventory || []), item.code],
      equipped_items: { ...profile.equipped_items, [item.category]: item.code },
    });
    trackEvent('ITEM_PURCHASED', profile, { item_code: item.code, price: item.price });
  };
  const equipItemForProfile = (profile: ChildProfile, item: ShopItem) => {
    updateProfileById(profile.id, {
      equipped_items: { ...profile.equipped_items, [item.category]: item.code },
    });
    trackEvent('ITEM_EQUIPPED', profile, { item_code: item.code, category: item.category });
  };
  const resetDemo = () => {
    const confirmed = window.confirm('¿Reiniciar la demo y borrar el progreso local de prueba?');
    if (!confirmed) return;
    localStorage.setItem('mundo-profiles', JSON.stringify(initialProfiles));
    localStorage.setItem('mundo-profile-version', String(PROFILE_DATA_VERSION));
    localStorage.removeItem('mundo-consent');
    localStorage.removeItem('mundo-events');
    setProfiles([...initialProfiles]);
    setConsent(false);
    setActiveProfile(null);
    setParentMode(false);
    setShowMenu(false);
    setScreen('welcome');
  };

  if (screen === 'welcome') return <Welcome onStart={() => setScreen('profiles')} />;
  if (screen === 'profiles') return <ProfilePicker profiles={profiles} consent={consent} onConsent={() => setConsent(true)} onSelect={selectProfile} onAdd={() => setScreen('new-profile')} onParent={() => { setParentMode(true); setScreen('parent'); }} />;
  if (screen === 'new-profile') return <NewProfile onBack={() => setScreen('profiles')} onCreate={(profile) => { setProfiles([...profiles, profile]); setScreen('profiles'); }} />;
  if (screen === 'parent') return <ParentReportDashboard profiles={profiles} universes={universes} consent={consent} onBack={() => setScreen('profiles')} onSubscription={() => setScreen('subscription')} />;
  if (screen === 'subscription') return <FakeSubscriptionModal onBack={() => setScreen('parent')} />;

  return (
    <div className="app-shell" style={{ '--accent': universe.accent, '--accent-soft': universe.accentSoft } as CSSProperties}>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')} aria-label="Ir al inicio"><span className="brand-mark">✦</span><span>Mi Mundo <strong>Aprende</strong></span></button>
        <div className="topbar-actions">
          {activeProfile.ab_group === 'A' && <div className="streak"><Flame size={17} fill="currentColor" /> {activeProfile.streak} días</div>}
          <button className="profile-chip" onClick={() => setScreen('profiles')}><span>{activeProfile.avatar}</span>{activeProfile.name}<ChevronLeft size={16} className="rotate-270" /></button>
          <button className="icon-btn menu-trigger" onClick={() => setShowMenu(!showMenu)} aria-label="Abrir menú"><Menu size={21} /></button>
        </div>
        {showMenu && <div className="menu-popover"><button onClick={() => { setParentMode(true); setScreen('parent'); setShowMenu(false); }}><BarChart3 size={16} /> Reporte para mi familia</button><button onClick={() => { setScreen('profiles'); setShowMenu(false); }}><LogOut size={16} /> Cambiar de perfil</button><button className="reset-demo-btn" onClick={resetDemo}><RotateCcw size={16} /> Reiniciar demo</button></div>}
      </header>
      {screen === 'home' && <Home profile={activeProfile} universe={universe} onPractice={() => setScreen('practice')} onCustomize={() => setScreen('customize')} onReport={() => { setParentMode(true); setScreen('parent'); }} onPurchaseItem={purchaseItemForProfile} onEquipItem={equipItemForProfile} />}
      {screen === 'customize' && <Customize profile={activeProfile} universe={universe} onBack={() => setScreen('home')} onSave={updateProfile} />}
      {screen === 'practice' && <Practice profile={activeProfile} universe={universe} onBack={() => setScreen('home')} onUpdate={updateProfile} onDone={() => setScreen('home')} />}
    </div>
  );
}

function Welcome({ onStart }) {
  return <main className="welcome">
    <div className="welcome-orbit orbit-one" /><div className="welcome-orbit orbit-two" />
    <div className="welcome-copy"><div className="brand large"><span className="brand-mark">✦</span><span>Mi Mundo <strong>Aprende</strong></span></div><p className="welcome-kicker">Misiones cortas. Poderes enormes.</p><h1>Tu curiosidad<br /><em>sube de nivel.</em></h1><p className="welcome-text">Entrena matemática, desbloquea recompensas y crea un universo que se parece a ti. Aprender también puede ser una aventura.</p><button className="primary-btn welcome-btn" onClick={onStart}>Entrar a mi mundo <ArrowRight size={18} /></button><div className="welcome-note"><ShieldCheck size={16} /> Un espacio seguro, sin publicidad</div></div>
    <div className="welcome-art"><div className="planet planet-large">⚡</div><div className="planet planet-small">✦</div><div className="astronaut">🦸🏽</div><div className="art-label"><Sparkles size={15} /> 4.° grado · Matemática</div></div>
  </main>;
}

function ProfilePicker({ profiles, consent, onConsent, onSelect, onAdd, onParent }) {
  return <main className="profile-page"><div className="profile-header"><div className="brand"><span className="brand-mark">✦</span><span>Mi Mundo <strong>Aprende</strong></span></div><span className="safe-label"><ShieldCheck size={15} /> Espacio seguro</span></div><section className="profile-content"><p className="eyebrow">¿Quién va a aprender hoy?</p><h1>Elige tu perfil</h1><p className="muted">Cada mundo guarda su propio avance.</p><div className="profile-grid">{profiles.map(profile => <button key={profile.id} className="profile-card" onClick={() => onSelect(profile)}><div className="avatar-ring" style={{ '--ring': profile.color } as CSSProperties}><span>{profile.avatar}</span></div><strong>{profile.name}</strong><span>{profile.grade}</span><div className="profile-progress"><span style={{ width: `${Math.min(profile.answered * 1.5, 100)}%`, background: profile.color }} /></div><small>{profile.answered} preguntas respondidas</small></button>)}<button className="profile-card add-card" onClick={onAdd}><span className="add-icon"><Plus /></span><strong>Agregar perfil</strong><span>Otro explorador</span></button></div><div className="profile-bottom"><button className="text-btn" onClick={onParent}><BarChart3 size={17} /> Soy mamá, papá o tutor</button><div className="consent-line">{consent ? <><Check size={15} /> Consentimiento registrado</> : <><CircleHelp size={15} /> Antes de empezar pediremos tu consentimiento</>} {!consent && <button className="link-btn" onClick={onConsent}>Dar consentimiento</button>}</div></div></section></main>;
}

function NewProfile({ onBack, onCreate }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧒🏽');
  const [universe, setUniverse] = useState('ki');
  const avatars = ['🧒🏽', '🧒🏻', '👧🏽', '👦🏾', '🦊', '🐼'];
  return <main className="onboarding"><button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> Volver</button><div className="onboarding-inner"><p className="eyebrow">Nuevo explorador</p><h1>¿Cómo te llamamos?</h1><p className="muted">Puedes usar un apodo. Este es tu espacio.</p><label className="field-label">Nombre o apodo<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Nico" /></label><p className="field-label">Elige tu avatar</p><div className="avatar-options">{avatars.map(item => <button className={avatar === item ? 'avatar-option selected' : 'avatar-option'} key={item} onClick={() => setAvatar(item)}>{item}</button>)}</div><p className="field-label">Tu primer universo</p><div className="universe-mini-grid">{Object.entries(universes).map(([key, item]) => <button key={key} className={universe === key ? 'universe-mini selected' : 'universe-mini'} onClick={() => setUniverse(key)}><span>{item.icon}</span>{item.name}</button>)}</div><button className="primary-btn full-btn" disabled={!name.trim()} onClick={() => onCreate({ id: name.toLowerCase().replace(/\s/g, '-'), name: name.trim(), grade: '4.° grado', avatar, universe, color: universes[universe].accent, pin: '1234', sessions: 0, minutes: 0, answered: 0, strengths: [], needs: [], streak: 0, level: 1, ab_group: 'B', coins: 0, current_streak: 0, max_streak: 0, inventory: [], equipped_items: { aura: null, hair: 'default', outfit: 'default', accessory: null, pet: null } })}>Crear mi perfil <ArrowRight size={18} /></button></div></main>;
}

function Home({ profile, universe, onPractice, onCustomize, onReport, onPurchaseItem, onEquipItem }) {
  const [shopOpen, setShopOpen] = useState(false);
  const xp = (profile.answered * 12) % 100;
  return <main className="home-content"><section className="hero-panel" style={{ background: profile.ab_group === 'A' ? universe.background : 'linear-gradient(135deg, #475569, #64748b)' }}><div className="hero-stars">{profile.ab_group === 'A' ? universe.stars : '•  •  •'}</div><div className="hero-text"><p className="hero-overline">{profile.ab_group === 'A' ? `${universe.icon} Mundo ${universe.name}` : 'Matemática · 4.° grado'}</p><h1>¡Hola, {profile.name}!</h1><p>{profile.ab_group === 'A' ? universe.tagline : 'Practica a tu ritmo y revisa tu avance.'}</p><button className="hero-btn" onClick={onPractice}><Play size={16} fill="currentColor" /> {profile.ab_group === 'A' ? 'Continuar misión' : 'Continuar práctica'}</button></div><div className="hero-character">{profile.ab_group === 'A' ? <LayeredAvatar profile={profile} universe={universe} /> : '📚'}</div><div className="hero-orbit" /></section>{profile.ab_group === 'A' && <section className="power-bar"><div className="power-badge"><Gem size={18} fill="currentColor" /><span><small>Poder de aprendiz</small><strong>Nivel {profile.level}</strong></span></div><div className="xp-track"><div className="xp-label"><span>XP para el siguiente nivel</span><b>{xp}/100</b></div><div className="xp-line"><span style={{ width: `${xp}%` }} /></div></div><div className="reward-chip"><Gift size={18} /><span><b>3</b><small>premios</small></span></div></section>} {profile.ab_group === 'A' && <section className="child-shop-card"><div><span className="child-shop-icon">🛍️</span><div><p className="eyebrow">Colección de {profile.name}</p><h2>Tienda de poderes</h2><p>Usa tus monedas para comparar y equipar los 12 ítems.</p></div></div><strong>🪙 {profile.coins}</strong><button className="primary-btn" onClick={() => setShopOpen(true)}>Ver tienda</button></section>}<div className="home-grid"><section className="practice-card"><div className="section-heading"><div><p className="eyebrow">Misión de hoy</p><h2>{profile.ab_group === 'A' ? 'El entrenamiento de la torre' : 'Práctica matemática'}</h2></div>{profile.ab_group === 'A' && <span className="level-pill"><Zap size={14} fill="currentColor" /> +60 XP</span>}</div><div className="mission-row"><div className="mission-icon"><Target /></div><div className="mission-copy"><strong>{profile.ab_group === 'A' ? 'Supera 5 desafíos' : 'Resuelve 5 preguntas'}</strong><span>{profile.ab_group === 'A' ? 'Gana una insignia al completar la misión' : 'Una mezcla de tus habilidades'}</span><div className="mission-progress"><span style={{ width: `${Math.min((profile.answered % 5) * 20, 80)}%` }} /></div></div><span className="mission-count">{profile.answered % 5}/5</span></div><button className="primary-btn" onClick={onPractice}>{profile.ab_group === 'A' ? 'Entrar a la torre' : 'Empezar práctica'} <ArrowRight size={17} /></button></section><section className="side-stack"><button className="customize-card" onClick={onCustomize}><div className="customize-icon"><Settings2 /></div><div><strong>{profile.ab_group === 'A' ? 'Mi guarida' : 'Personalizar'}</strong><span>{profile.ab_group === 'A' ? 'Cambia tu universo y avatar' : 'Elige tu avatar'}</span></div><ArrowRight size={17} /></button><button className="report-card" onClick={onReport}><div className="report-top"><BarChart3 size={19} /><span>Para tu familia</span></div><strong>Tu avance está creciendo</strong><span>{profile.minutes} minutos esta semana</span></button></section></div>{profile.ab_group === 'A' && <section className="badges-card"><div className="badges-heading"><div><p className="eyebrow">Colección</p><h2>Insignias desbloqueadas</h2></div><button className="text-btn">Ver todas <ArrowRight size={14} /></button></div><div className="badge-list"><div className="badge-item earned"><span>🔥</span><strong>Racha de fuego</strong><small>3 días seguidos</small></div><div className="badge-item earned"><span>⚡</span><strong>Primer poder</strong><small>Completaste una misión</small></div><div className="badge-item locked"><span>🏆</span><strong>Gran campeón</strong><small>Resuelve 50 preguntas</small><LockKeyhole size={13} /></div><div className="badge-item locked"><span>🌟</span><strong>Mente brillante</strong><small>Sube al nivel 3</small><LockKeyhole size={13} /></div></div></section>}<div className="stats-strip"><div><Clock3 size={18} /><span><b>{profile.minutes}</b> min de práctica</span></div><div><BookOpen size={18} /><span><b>{profile.answered}</b> preguntas resueltas</span></div><div><Trophy size={18} /><span><b>{profile.strengths[0] || 'Tu próxima habilidad'}</b></span></div></div>{shopOpen && <MiniShopDrawer profile={profile} universe={universe} showAllItems onClose={() => setShopOpen(false)} onPurchase={(item) => onPurchaseItem(profile, item)} onEquip={(item) => onEquipItem(profile, item)} />}</main>;
}

function Customize({ profile, universe, onBack, onSave }) {
  const [selectedUniverse, setSelectedUniverse] = useState(profile.universe);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const avatars = ['🧒🏽', '🧒🏻', '👧🏽', '👦🏾', '🦊', '🐼'];
  return <main className="customize-page"><button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> Volver a mi mundo</button><div className="customize-layout"><section><p className="eyebrow">Personalización</p><h1>Diseña tu espacio</h1><p className="muted">Tu mundo cambia contigo.</p><div className="custom-section"><h3>Elige un universo</h3><div className="universe-grid">{Object.entries(universes).map(([key, item]) => <button key={key} className={selectedUniverse === key ? 'universe-card selected' : 'universe-card'} onClick={() => setSelectedUniverse(key)}><span className="universe-visual" style={{ background: item.background }}>{item.icon}</span><strong>{item.name}</strong><small>{item.tagline}</small>{selectedUniverse === key && <span className="selected-check"><Check size={13} /></span>}</button>)}</div></div><div className="custom-section"><h3>Elige tu compañero</h3><div className="avatar-options">{avatars.map(item => <button className={selectedAvatar === item ? 'avatar-option selected' : 'avatar-option'} key={item} onClick={() => setSelectedAvatar(item)}>{item}</button>)}</div></div><button className="primary-btn" onClick={() => { onSave({ universe: selectedUniverse, avatar: selectedAvatar, color: universes[selectedUniverse].accent }); onBack(); }}>Guardar cambios <Check size={17} /></button></section><aside className="preview-card"><p className="eyebrow">Vista previa</p><div className="preview-world" style={{ background: universes[selectedUniverse].background }}><span className="preview-stars">{universes[selectedUniverse].stars}</span><span className="preview-avatar">{selectedAvatar}</span><div className="preview-ground">{universes[selectedUniverse].icon} {universes[selectedUniverse].name}</div></div><strong>{profile.name} en {universes[selectedUniverse].name}</strong><span>Así se verá tu aventura.</span></aside></div></main>;
}

function Practice({ profile, universe, onBack, onUpdate, onDone }) {
  const [index, setIndex] = useState(0);
  const sessionQuestions = useMemo(() => shuffleQuestions(questions), []);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopClosedAt, setShopClosedAt] = useState(null);
  const [rewardMessage, setRewardMessage] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [levelUp, setLevelUp] = useState<{ level: number; finish: boolean } | null>(null);
  const [startedAt] = useState(Date.now());
  const question = sessionQuestions[index % sessionQuestions.length];
  const progress = ((index) / SESSION_QUESTION_COUNT) * 100;
  const answer = (option) => {
    if (result === 'correct') return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setSelected(option);
    const isCorrect = option === question.answer;
    setResult(isCorrect ? 'correct' : 'wrong');
    setHintVisible(!isCorrect);
  };
  const next = () => {
    const correct = result === 'correct';
    const skillStreaks = profile.skill_streaks || {};
    const progress = calculateAdaptiveProgress({
      abGroup: profile.ab_group,
      isCorrect: correct,
      attemptNumber: attempts,
      currentStreak: profile.current_streak || 0,
      maxStreak: profile.max_streak || 0,
      skillStreak: skillStreaks[question.skill] || 0,
      level: profile.level,
    });
    const nextProfile = { answered: profile.answered + 1, minutes: profile.minutes + Math.max(1, Math.round((Date.now() - startedAt) / 60000)), strengths: correct && !profile.strengths.includes(question.skill) ? [...profile.strengths, question.skill] : profile.strengths, needs: !correct && !profile.needs.includes(question.skill) ? [...profile.needs, question.skill] : profile.needs, level: progress.level, current_streak: progress.currentStreak, max_streak: progress.maxStreak, coins: (profile.coins || 0) + progress.coinsEarned, skill_streaks: { ...skillStreaks, [question.skill]: progress.skillStreak } };
    onUpdate(nextProfile);
    trackEvent('ANSWER_SUBMITTED', profile, { question_id: question.id, is_correct: correct, attempt_number: attempts, coins_earned: progress.coinsEarned });
    if (progress.comboMilestone) { setRewardMessage(`¡ATAQUE CRÍTICO! +${progress.coinsEarned} monedas y subiste de poder`); trackEvent('COMBO_3_REACHED', profile, { coins_earned: progress.coinsEarned }); }
    if (shopClosedAt && Date.now() - shopClosedAt <= 60000) trackEvent('PRACTICE_RESUMED_FROM_SHOP', profile, { question_id: question.id });
    if (progress.levelUp) setLevelUp({ level: progress.level, finish: index >= SESSION_QUESTION_COUNT - 1 });
    if (index >= SESSION_QUESTION_COUNT - 1 && !progress.levelUp) onDone();
    else if (index < SESSION_QUESTION_COUNT - 1) { setIndex(index + 1); setSelected(null); setResult(null); }
    setAttempts(0);
  };
  const equipItem = item => {
    onUpdate({ equipped_items: { ...profile.equipped_items, [item.category]: item.code } });
    trackEvent('ITEM_EQUIPPED', profile, { item_code: item.code, category: item.category });
  };
  const purchaseItem = item => {
    onUpdate({
      coins: profile.coins - item.price,
      inventory: [...(profile.inventory || []), item.code],
      equipped_items: { ...profile.equipped_items, [item.category]: item.code },
    });
    trackEvent('ITEM_PURCHASED', profile, { item_code: item.code, price: item.price });
  };
  const continueAfterLevelUp = () => {
    const shouldFinish = levelUp?.finish;
    setLevelUp(null);
    if (shouldFinish) onDone();
    else {
      setIndex(index + 1);
      setSelected(null);
      setResult(null);
    }
  };
  return <main className="practice-page"><div className="practice-top"><button className="back-btn" onClick={onBack}><X size={18} /> Salir</button><div className="practice-progress"><span style={{ width: `${progress}%` }} /></div><span className="question-count">{index + 1} de {SESSION_QUESTION_COUNT}</span>{profile.ab_group === 'A' && <button className="coin-button" onClick={() => { setShopOpen(true); trackEvent('SHOP_OPENED', profile); }}>🪙 {profile.coins}</button>}</div><div className="question-wrap">{profile.ab_group === 'A' && <ComboMeter streak={profile.current_streak || 0} lastReward={rewardMessage || '¡Transformación lista!'}/>}<div className="practice-avatar-row">{profile.ab_group === 'A' ? <LayeredAvatar profile={profile} universe={universe} compact /> : <span className="control-avatar">📚</span>}<span>{profile.ab_group === 'A' ? 'Tu guardián te acompaña' : 'Modo práctica'}</span></div><QuestionCard question={question} universeId={universe.id} abGroup={profile.ab_group} selected={selected} result={result} onAnswer={answer} onNext={next} isLast={index >= SESSION_QUESTION_COUNT - 1} />{result === 'wrong' && hintVisible && <HintModal hint={question.narrative_hints?.[universe.id] || question.hint} universeId={universe.id} onClose={() => setHintVisible(false)} />}</div>{shopOpen && profile.ab_group === 'A' && <MiniShopDrawer profile={profile} universe={universe} onClose={() => { setShopOpen(false); setShopClosedAt(Date.now()); }} onPurchase={purchaseItem} onEquip={equipItem} />}{levelUp && <LevelUpModal level={levelUp.level} onContinue={continueAfterLevelUp} />}</main>;
}

export default App;
