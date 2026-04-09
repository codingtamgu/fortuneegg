import type { FortuneCategory, FortuneOption } from '../types';

type FortuneFormStep = 'category' | 'wish';

type FortuneFormProps = {
  step: FortuneFormStep;
  value: string;
  category: FortuneCategory;
  presets: string[];
  categoryOptions: FortuneOption<FortuneCategory>[];
  onChange: (value: string) => void;
  onPresetClick: (value: string) => void;
  onCategoryChange: (value: FortuneCategory) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
};

export function FortuneForm(props: FortuneFormProps) {
  if (props.step === 'wish') {
    return (
      <section className="panel form-panel">
        <div className="panel-copy">
          <p className="eyebrow">STEP 2</p>
          <h2>마지막으로 지금 바라는 메시지를 적어보세요.</h2>
          <p className="body-copy">
            길게 설명할 필요는 없어요.
            <br />
            지금 가장 바라는 흐름을 한두 문장으로 적으면 충분합니다.
          </p>
        </div>

        <div className="preset-list" aria-label="추천 소원">
          {props.presets.map((preset) => (
            <button
              key={preset}
              className="preset-chip"
              type="button"
              onClick={() => props.onPresetClick(preset)}
            >
              {preset}
            </button>
          ))}
        </div>

        <label className="text-field text-field--grow">
          <span className="text-field-label">희망 메시지</span>
          <textarea
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
            placeholder="예: 이번 주에는 기다리던 답이 조금 더 또렷하게 다가왔으면 좋겠어요."
            rows={6}
            maxLength={90}
          />
          <span className="text-field-help">
            첫 포춘은 무료로 열리고, 더 깊은 해석은 황금 에그에서 이어집니다.
          </span>
        </label>

        <div className="form-actions form-actions--split">
          <button className="ghost-button" type="button" onClick={props.onBack}>
            이전으로
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={props.onSubmit}
            disabled={!props.value.trim()}
          >
            에그 깨러 가기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel form-panel">
      <div className="panel-copy">
        <p className="eyebrow">STEP 1</p>
        <h2>먼저 어떤 운세를 보고 싶은지 골라보세요.</h2>
        <p className="body-copy">
          질문은 하나만 고르면 됩니다.
          <br />
          분야를 정하면 그 결에 맞는 징조와 해석으로 이어집니다.
        </p>
      </div>

      <div className="selector-stack selector-stack--grow">
        <SelectorGroup
          label="오늘 가장 궁금한 흐름"
          options={props.categoryOptions}
          value={props.category}
          onChange={props.onCategoryChange}
        />
      </div>

      <div className="form-actions form-actions--split">
        <button className="ghost-button" type="button" onClick={props.onBack}>
          이전으로
        </button>
        <button className="primary-button" type="button" onClick={props.onNext}>
          다음으로
        </button>
      </div>
    </section>
  );
}

type SelectorGroupProps<T extends string> = {
  label: string;
  options: FortuneOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

function SelectorGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: SelectorGroupProps<T>) {
  return (
    <section className="selector-group">
      <div className="selector-copy">
        <span className="selector-label">{label}</span>
      </div>
      <div className="selector-grid">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`selector-chip ${option.value === value ? 'is-selected' : ''}`}
            onClick={() => onChange(option.value)}
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
