type EggStageProps = {
  phase: 'idle' | 'shaking' | 'cracking' | 'opened';
  disabled: boolean;
  onCrack: () => void;
  onBack?: () => void;
};

export function EggStage({ phase, disabled, onCrack, onBack }: EggStageProps) {
  const eggClassName = [
    'egg-button',
    phase === 'shaking' ? 'is-shaking' : '',
    phase === 'cracking' ? 'is-cracking' : '',
    phase === 'opened' ? 'is-opened' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className="panel egg-panel">
      <div className="panel-copy">
        <p className="eyebrow">포츈에그</p>
        <h2>
          오늘의 에그를 깨면
          <br />
          포춘이 열립니다
        </h2>
        <p className="body-copy">
          지금 적은 소원과 선택한 분야를 바탕으로
          <br />
          오늘의 징조와 한 문장 해석이 이어집니다.
        </p>
      </div>

      <button
        className={eggClassName}
        type="button"
        onClick={onCrack}
        disabled={disabled}
        aria-live="polite"
      >
        <span className="egg-halo" />
        <span className="egg-spark egg-spark-left" />
        <span className="egg-spark egg-spark-right" />
        <span className="egg-whole" />
        <span className="egg-shell egg-shell-top" />
        <span className="egg-shell egg-shell-bottom" />
        <span className="egg-shell-join" />
        <svg className="egg-crack-svg" viewBox="0 0 160 56" aria-hidden="true">
          <path
            className="egg-crack-stroke egg-crack-stroke-shadow"
            d="M10 30 L24 22 L40 33 L56 21 L74 34 L92 18 L110 31 L128 20 L144 28 L150 26"
          />
          <path
            className="egg-crack-stroke egg-crack-stroke-main"
            d="M10 30 L24 22 L40 33 L56 21 L74 34 L92 18 L110 31 L128 20 L144 28 L150 26"
          />
        </svg>
      </button>

      <p className="egg-status">
        {phase === 'idle' ? '알을 누르면 오늘의 포춘이 열립니다.' : null}
        {phase === 'shaking' ? '에그가 흔들리고 있어요.' : null}
        {phase === 'cracking' ? '껍질이 갈라지고 있어요. 조금만 기다려 주세요.' : null}
        {phase === 'opened' ? '포춘이 열렸어요. 아래 해석을 확인해 보세요.' : null}
      </p>

      {onBack ? (
        <button className="ghost-button egg-back-button" type="button" onClick={onBack}>
          소원 다시 적기
        </button>
      ) : null}
    </section>
  );
}
