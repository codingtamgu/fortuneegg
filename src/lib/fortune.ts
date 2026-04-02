import { topicFortunes } from '../data/fortunePool';
import type { FortuneResult, FortuneTopic } from '../types';

const topicMatchers: Array<{ topic: FortuneTopic; words: string[] }> = [
  { topic: 'love', words: ['연애', '썸', '사랑', '고백', '답장', '재회', '관계'] },
  { topic: 'money', words: ['돈', '재물', '지출', '월급', '부자', '수입', '절약'] },
  { topic: 'work', words: ['이직', '면접', '회사', '일', '승진', '프로젝트', '업무'] },
  { topic: 'study', words: ['합격', '시험', '공부', '성적', '수능', '자격증', '면접준비'] },
  { topic: 'health', words: ['건강', '운동', '회복', '수면', '몸', '다이어트', '컨디션'] },
];

export function inferTopic(wish: string): FortuneTopic {
  const normalized = wish.replace(/\s+/g, '').toLowerCase();

  for (const matcher of topicMatchers) {
    if (matcher.words.some((word) => normalized.includes(word))) {
      return matcher.topic;
    }
  }

  return 'wish';
}

export function createFortune(wish: string): FortuneResult {
  const topic = inferTopic(wish);
  const pool = topicFortunes[topic];
  const seed = createSeed(wish);

  return {
    topic,
    keyword: pick(pool.keywords, seed),
    message: pick(pool.messages, seed + 1),
    actionHint: pick(pool.actions, seed + 2),
    caution: pick(pool.cautions, seed + 3),
    goldenMessage: pick(pool.goldenMessages, seed + 4),
    goldenTiming: pick(pool.goldenTimings, seed + 5),
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
