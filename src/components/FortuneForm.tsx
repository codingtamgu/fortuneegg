type FortuneFormProps = {
  value: string;
  presets: string[];
  onChange: (value: string) => void;
  onPresetClick: (value: string) => void;
  onSubmit: () => void;
};

export function FortuneForm({
  value,
  presets,
  onChange,
  onPresetClick,
  onSubmit,
}: FortuneFormProps) {
  return (
    <section className="panel form-panel">
      <div className="panel-copy">
        <p className="eyebrow">WISH INPUT</p>
        <h2>오늘 바라는 한 가지를 적어보세요</h2>
        <p className="body-copy">
          무거운 개인정보 없이, 지금 마음속에 가장 크게 떠오르는 소원만 적으면 됩니다.
        </p>
      </div>

      <div className="preset-list" aria-label="추천 희망사항">
        {presets.map((preset) => (
          <button
            key={preset}
            className="preset-chip"
            type="button"
            onClick={() => onPresetClick(preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      <label className="text-field">
        <span className="text-field-label">희망사항</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="예: 이번 달 안에 좋은 소식이 왔으면 좋겠어"
          rows={4}
          maxLength={80}
        />
        <span className="text-field-help">
          광고를 먼저 보여주지 않습니다. 먼저 무료 포춘을 확인한 뒤, 추가 해석만 선택할 수 있어요.
        </span>
      </label>

      <button className="primary-button" type="button" onClick={onSubmit}>
        에그 깨러 가기
      </button>
    </section>
  );
}
