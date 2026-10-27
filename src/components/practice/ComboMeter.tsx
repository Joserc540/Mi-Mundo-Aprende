import { Zap } from 'lucide-react';

interface ComboMeterProps {
  streak: number;
  lastReward: string;
}

export default function ComboMeter({ streak, lastReward }: ComboMeterProps) {
  const charge = streak % 3;
  const message = charge === 0
    ? 'Carga tu energía'
    : charge === 1
      ? '¡Buen golpe! +15 monedas'
      : charge === 2
        ? '¡A uno de la transformación!'
        : lastReward;

  return (
    <div className={`combo-meter combo-${charge}`}>
      <div className="combo-copy">
        <span><Zap size={15} fill="currentColor" /> Combo de energía</span>
        <strong>{charge}/3</strong>
      </div>
      <div className="combo-slots">
        {[1, 2, 3].map((slot) => <i className={slot <= charge ? 'filled' : ''} key={slot} />)}
      </div>
      <p>{message}</p>
    </div>
  );
}
