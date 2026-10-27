import { ArrowRight, Check } from 'lucide-react';
import type { Question } from '../../types/domain';

interface QuestionCardProps {
  question: Question;
  universeId?: string;
  abGroup: 'A' | 'B';
  selected: string | null;
  result: 'correct' | 'wrong' | null;
  onAnswer: (option: string) => void;
  onNext: () => void;
  isLast: boolean;
}

function FractionVisual() {
  return <div className="fraction-visual" aria-label="Un círculo dividido en dos partes iguales, con una parte pintada"><span /></div>;
}

export default function QuestionCard({
  question, universeId, abGroup, selected, result, onAnswer, onNext, isLast,
}: QuestionCardProps) {
  const variants = question.narrative_variants || {};
  const narrative = (abGroup === 'A' ? variants[universeId as keyof typeof variants] : variants.neutral)
    || question.prompt;

  return (
    <>
      <div className="question-meta">
        <span className="skill-tag">{question.skill}</span>
        <span>Dificultad {question.difficulty}/3</span>
      </div>
      <h1>{narrative}</h1>
      {question.visual === 'half' && <FractionVisual />}
      {question.visual && question.visual !== 'half' && <div className="question-visual">{question.visual}</div>}
      <div className="answer-grid">
        {question.options.map((option) => (
          <button
            className={`answer-option ${selected === option ? (result === 'correct' ? 'correct' : 'wrong') : ''} ${selected && option === question.answer ? 'reveal-correct' : ''}`}
            key={option}
            onClick={() => onAnswer(option)}
          >
            {option}
            {selected === option && result === 'correct' && <Check size={18} />}
          </button>
        ))}
      </div>
      <button className="primary-btn next-btn" disabled={!result} onClick={onNext}>
        {isLast ? 'Ver mi avance' : 'Siguiente desafío'} <ArrowRight size={17} />
      </button>
    </>
  );
}
