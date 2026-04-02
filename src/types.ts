export type FortuneTopic =
  | 'love'
  | 'money'
  | 'work'
  | 'study'
  | 'health'
  | 'wish';

export type FortuneResult = {
  topic: FortuneTopic;
  keyword: string;
  message: string;
  actionHint: string;
  caution: string;
  goldenMessage: string;
  goldenTiming: string;
};
