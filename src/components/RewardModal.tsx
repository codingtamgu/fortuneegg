type RewardModalProps = {
  open: boolean;
  mode: 'ready' | 'loading' | 'showing' | 'simulating';
  countdown: number;
  description: string;
  startLabel: string;
  startDisabled: boolean;
  onClose: () => void;
  onStart: () => void;
};

export function RewardModal({
  open,
  mode,
  countdown,
  description,
  startLabel,
  startDisabled,
  onClose,
  onStart,
}: RewardModalProps) {
  if (!open) {
    return null;
  }

  const isBusy = mode === 'loading' || mode === 'showing' || mode === 'simulating';

  return (
    <div className="reward-overlay" role="presentation">
      <div
        className="reward-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-modal-title"
      >
        <div className="reward-modal-head">
          <div>
            <p className="eyebrow">ANOTHER WISH</p>
            <h3 id="reward-modal-title">다른 소원을 다시 열기 전에 확인해 주세요.</h3>
          </div>
          {!isBusy ? (
            <button className="close-button" type="button" onClick={onClose} aria-label="닫기">
              닫기
            </button>
          ) : null}
        </div>

        <p className="body-copy">{description}</p>

        {mode === 'simulating' ? (
          <div className="ad-simulator">
            <div className="ad-box">
              <span className="ad-label">다시보기 진행 중</span>
              <strong>{countdown}초 후에 다른 소원을 다시 적을 수 있어요.</strong>
              <p>현재 환경에 맞는 흐름으로 다시보기 페이지로 이어집니다.</p>
            </div>
          </div>
        ) : null}

        {mode === 'loading' || mode === 'showing' ? (
          <div className="ad-simulator">
            <div className="ad-box">
              <span className="ad-label">전면광고</span>
              <strong>
                {mode === 'loading' ? '전면광고를 준비하고 있어요.' : '전면광고를 여는 중이에요.'}
              </strong>
              <p>광고가 끝나면 바로 다른 소원을 다시 열 수 있어요.</p>
            </div>
          </div>
        ) : null}

        {mode === 'ready' ? (
          <div className="reward-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              지금 포춘 더 보기
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={onStart}
              disabled={startDisabled}
            >
              {startLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
