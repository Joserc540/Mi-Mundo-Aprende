import { Lightbulb, X } from 'lucide-react';

interface HintModalProps {
  hint: string;
  universeId?: string;
  onClose: () => void;
}

const introductions: Record<string, string> = {
  ki_warriors: '¡El rival bloqueó tu técnica! Usa este pergamino del Maestro:',
  super_league: '¡Pegó en el travesaño! Escucha el consejo del DT:',
  block_builders: '¡Ese bloque era muy duro! Usa esta herramienta especial:',
};

export default function HintModal({ hint, universeId, onClose }: HintModalProps) {
  const introduction = introductions[universeId || ''] || 'Cada intento te ayuda a aprender. Prueba con esta pista:';

  return (
    <div className="hint-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="hint-modal" role="dialog" aria-modal="true" aria-labelledby="hint-title" onClick={(event) => event.stopPropagation()}>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar pista"><X size={20} /></button>
        <div className="hint-modal-icon"><Lightbulb size={26} /></div>
        <p className="eyebrow">Pista de tu aventura</p>
        <h2 id="hint-title">{introduction}</h2>
        <p>{hint}</p>
        <button className="primary-btn full-btn" onClick={onClose}>¡Lo intentaré!</button>
      </section>
    </div>
  );
}
