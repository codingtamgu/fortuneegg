import { categoryProfiles } from '../data/fortunePool';
import type { FortuneInput, FortuneResult } from '../types';

export function createFortune(input: FortuneInput): FortuneResult {
  const category = categoryProfiles[input.category];
  const seed = createSeed(`${input.wish}|${input.category}`);

  return {
    category: input.category,
    categoryLabel: category.label,
    keyword: pick(category.keywords, seed),
    message: pick(category.messages, seed + 1),
    interpretation: pick(category.interpretations, seed + 2),
    actionHint: pick(category.actions, seed + 3),
    caution: pick(category.cautions, seed + 4),
    goldenMessage: pick(category.goldenMessages, seed + 5),
    goldenTiming: pick(category.goldenTimings, seed + 6),
  };
}

function createSeed(value: string) {
  return Array.from(value).reduce((acc, char, index) => {
    return acc + char.charCodeAt(0) * (index + 1);
  }, 0);
}

function pick<T>(items: T[], seed: number) {
  return items[seed % items.length];
}
