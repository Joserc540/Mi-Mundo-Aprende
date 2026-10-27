import { ArrowRight, Sparkles } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  onContinue: () => void;
}

export default function LevelUpModal({ level, onContinue }: LevelUpModalProps) {
  return (
    <div className="level-up-backdrop" role="presentation">
      <section className="level-up-card" role="dialog" aria-modal="true" aria-labelledby="level-up-title">
        <div className="level-up-icon"><Sparkles size={32} /></div>
        <p className="eyebrow">¡Tu poder creció!</p>
        <h2 id="level-up-title">Subiste al nivel {level}</h2>
        <p>Seguiste practicando y ahora puedes enfrentarte a desafíos más grandes.</p>
        <button className="primary-btn full-btn" onClick={onContinue}>Continuar <ArrowRight size={17} /></button>
      </section>
    </div>
  );
}
