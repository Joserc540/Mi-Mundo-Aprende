import { ArrowRight, Check, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { trackEvent } from '../../services/analyticsService';

interface FakeSubscriptionModalProps {
  onBack: () => void;
}

export default function FakeSubscriptionModal({ onBack }: FakeSubscriptionModalProps) {
  const [clicked, setClicked] = useState(false);
  const onSubscribe = () => {
    trackEvent('SUBSCRIPTION_CLICKED', null, { plan: 'monthly', price: 10 });
    setClicked(true);
  };
  return (
    <main className="subscription-page">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> Volver al reporte</button>
      <div className="subscription-card">
        <div className="subscription-orb">✦</div>
        <p className="eyebrow">Tu prueba gratuita termina pronto</p>
        <h1>Que el mundo<br />siga creciendo.</h1>
        <p>Continúa acompañando el aprendizaje con mundos, misiones y reportes semanales.</p>
        <div className="price"><strong>S/ 10</strong><span> / mes</span></div>
        <ul><li><Check size={16} /> Acceso a los 3 universos</li><li><Check size={16} /> Reportes semanales para tu familia</li><li><Check size={16} /> Nuevas misiones cada semana</li></ul>
        {clicked ? <div className="intent-confirmation"><Check size={18} /> ¡Gracias! Registramos tu interés.</div> : <button className="primary-btn full-btn" onClick={onSubscribe}>Continuar por S/ 10/mes <ArrowRight size={17} /></button>}
        <small className="no-charge"><ShieldCheck size={13} /> Esto es una simulación. No se realizará ningún cobro.</small>
      </div>
    </main>
  );
}
