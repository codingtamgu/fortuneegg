import type { FortuneResult } from '../types';

type FortuneResultProps = {
  result: FortuneResult;
  wish: string;
  goldenUnlocked: boolean;
  shareLabel: string;
  onShare: () => void;
  onShareAndUnlockGolden: () => void;
  onTryAnotherWish: () => void;
};

export function FortuneResultCard({
  result,
  wish,
  goldenUnlocked,
  shareLabel,
  onShare,
  onShareAndUnlockGolden,
  onTryAnotherWish,
}: FortuneResultProps) {
  return (
    <section className="panel result-panel">
      <div className="result-stack">
        <div className="result-header result-stack-item">
          <div>
            <p className="eyebrow">YOUR FORTUNE</p>
            <h2>{result.message}</h2>
          </div>
          <span className="result-keyword">{result.keyword}</span>
        </div>

        <div className="wish-card result-stack-item">
          <span className="wish-label">이번에 적은 소원</span>
          <p>{wish}</p>
          <div className="wish-meta">
            <span className="meta-pill">{result.categoryLabel}</span>
          </div>
        </div>

        <article className="fortune-card analysis-card result-stack-item">
          <span>흐름 해석</span>
          <strong>{result.interpretation}</strong>
        </article>

        <article className="fortune-card result-stack-item">
          <span>오늘의 행동</span>
          <strong>{result.actionHint}</strong>
        </article>

        <article className="fortune-card caution-card result-stack-item">
          <span>피하면 좋은 것</span>
          <strong>{result.caution}</strong>
        </article>

        {goldenUnlocked ? (
          <article className="golden-card result-stack-item">
            <span className="golden-badge">황금 에그 해석</span>
            <strong>{result.goldenMessage}</strong>
            <p>{result.goldenTiming}</p>
          </article>
        ) : null}

        <div className="result-actions result-stack-item">
          {goldenUnlocked ? (
            <button className="secondary-button" type="button" onClick={onShare}>
              {shareLabel}
            </button>
          ) : (
            <button
              className="primary-button result-action-button"
              type="button"
              onClick={onShareAndUnlockGolden}
            >
              친구에게 공유하고 황금 에그 열기
            </button>
          )}

          <button className="ghost-button" type="button" onClick={onTryAnotherWish}>
            광고보고 다른 소원 다시보기
          </button>
        </div>
      </div>
    </section>
  );
}
