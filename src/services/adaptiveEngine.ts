import type {
  AdaptiveProgressInput,
  AdaptiveProgressResult,
} from '../types/domain';

const LEVEL_UP_STREAK = 3;
const COINS_FIRST_ATTEMPT = 15;
const COINS_RETRY = 5;
const COMBO_BONUS = 20;

export function calculateAdaptiveProgress(
  input: AdaptiveProgressInput,
): AdaptiveProgressResult {
  const currentStreak = input.isCorrect ? input.currentStreak + 1 : 0;
  const consecutiveSkillAnswers = input.isCorrect
    ? input.skillStreak + 1
    : 0;
  const nextLevel = Math.min(input.level + 1, 3);
  const levelUp =
    input.isCorrect &&
    consecutiveSkillAnswers >= LEVEL_UP_STREAK &&
    nextLevel > input.level;
  const comboMilestone =
    input.abGroup === 'A' &&
    input.isCorrect &&
    currentStreak % LEVEL_UP_STREAK === 0 &&
    levelUp;
  const coinsEarned =
    input.abGroup === 'A' && input.isCorrect
      ? (input.attemptNumber === 1 ? COINS_FIRST_ATTEMPT : COINS_RETRY) +
        (comboMilestone ? COMBO_BONUS : 0)
      : 0;

  return {
    coinsEarned,
    currentStreak,
    maxStreak: Math.max(input.maxStreak, currentStreak),
    skillStreak: levelUp ? 0 : consecutiveSkillAnswers,
    level: levelUp ? nextLevel : input.level,
    levelUp,
    comboMilestone,
    animationTrigger: comboMilestone ? 'SUPER_PHASE_UP' : null,
  };
}
