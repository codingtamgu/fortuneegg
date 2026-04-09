export type FortuneCategory =
  | 'wish'
  | 'love'
  | 'reconnect'
  | 'relationship'
  | 'money'
  | 'work'
  | 'study'
  | 'health';

export type FortuneOption<T extends string> = {
  value: T;
  label: string;
  description: string;
};

export type FortuneInput = {
  wish: string;
  category: FortuneCategory;
};

export type FortuneResult = {
  category: FortuneCategory;
  categoryLabel: string;
  keyword: string;
  message: string;
  interpretation: string;
  actionHint: string;
  caution: string;
  goldenMessage: string;
  goldenTiming: string;
};
