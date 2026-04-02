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
          첫 결과는 무료입니다. 결과를 확인한 뒤 더 깊은 해석이 필요하면 황금 에그로 이어집니다.
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
        {phase === 'idle' ? '가볍게 누르면 에그가 흔들리며 열립니다.' : null}
        {phase === 'shaking' ? '에그가 흔들리고 있어요..' : null}
        {phase === 'cracking' ? '금이 가고 있어요. 조금만 기다려 주세요.' : null}
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
