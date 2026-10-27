import { BookOpen, Clock3, Flame, LockKeyhole, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ChildProfile, Universe } from '../../types/domain';

interface ParentReportDashboardProps {
  profiles: ChildProfile[];
  universes: Record<string, Universe>;
  consent: boolean;
  onBack: () => void;
  onSubscription: () => void;
}

function Metric({ icon, value, label, note }: { icon: ReactNode; value: ReactNode; label: string; note: string }) {
  return <div className="metric-card"><span className="metric-icon">{icon}</span><strong>{value}</strong><span>{label}</span><small>{note}</small></div>;
}

export default function ParentReportDashboard({ profiles, universes, consent, onBack, onSubscription }: ParentReportDashboardProps) {
  const [selected, setSelected] = useState(profiles[0]);
  const totalMinutes = profiles.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <main className="parent-page">
      <header className="parent-header"><button className="back-btn" onClick={onBack}>‹ Vista de explorador</button><div className="parent-title"><span className="brand-mark">✦</span><span>Panel de familia</span></div><span className="safe-label">Datos protegidos</span></header>
      <div className="parent-body">
        <div className="parent-intro"><div><p className="eyebrow">Resumen semanal</p><h1>El aprendizaje crece cuando lo ves.</h1><p className="muted">Acompaña el avance sin interrumpir su aventura.</p></div><button className="subscription-cta" onClick={onSubscription}><Sparkles size={17} /> Continuar por S/ 10/mes</button></div>
        <div className="child-tabs">{profiles.map((profile) => <button className={selected.id === profile.id ? 'child-tab active' : 'child-tab'} key={profile.id} onClick={() => setSelected(profile)}><span>{profile.avatar}</span>{profile.name}<span className="tab-dot" style={{ background: profile.color }} /></button>)}</div>
        <section className="report-hero"><div><span className="report-avatar">{selected.avatar}</span><div><h2>{selected.name} está avanzando</h2><p>Esta semana practicó en {universes[selected.universe].name}.</p></div></div><div className="report-streak"><Flame size={20} /><strong>{selected.streak}</strong><span>días seguidos</span></div></section>
        <div className="metrics-grid"><Metric icon={<Clock3 />} value={`${selected.minutes} min`} label="Tiempo de práctica" note="+18% vs. semana anterior" /><Metric icon={<BookOpen />} value={selected.answered} label="Preguntas resueltas" note="A buen ritmo" /><Metric icon={<Target />} value={selected.strengths.length || 2} label="Habilidades fuertes" note="Sigue construyendo" /></div>
        <div className="report-columns"><section className="report-box"><div className="box-heading"><h3>Habilidades</h3><span>Esta semana</span></div>{(selected.strengths.length ? selected.strengths : ['Multiplicación', 'Geometría']).map((item, i) => <div className="skill-row" key={item}><span className="skill-name"><span className="skill-dot strong" />{item}</span><div className="skill-bar"><span style={{ width: `${88 - i * 18}%` }} /></div><strong>{88 - i * 18}%</strong></div>)}{(selected.needs.length ? selected.needs : ['Fracciones']).map((item) => <div className="skill-row" key={item}><span className="skill-name"><span className="skill-dot needs" />{item}</span><div className="skill-bar"><span className="needs-bar" style={{ width: '48%' }} /></div><strong>En práctica</strong></div>)}</section><section className="report-box activity-box"><div className="box-heading"><h3>Actividad reciente</h3><span>Últimos 7 días</span></div><div className="week-bars">{['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => <div className="day-bar" key={day}><span className="bar-track"><i style={{ height: `${[35, 54, 28, 72, 48, 88, 18][i]}%` }} /></span><small>{day}</small></div>)}</div><div className="activity-total"><span>minutos practicados</span><strong>{totalMinutes} min</strong></div></section></div>
        <div className="consent-footer"><LockKeyhole size={15} /> Consentimiento de datos del menor: <strong>{consent ? 'registrado' : 'pendiente'}</strong></div>
      </div>
    </main>
  );
}
