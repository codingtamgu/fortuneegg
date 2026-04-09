import { useEffect, useMemo, useRef, useState } from 'react';
import { EggStage } from './components/EggStage';
import { FortuneForm } from './components/FortuneForm';
import { FortuneResultCard } from './components/FortuneResult';
import { RewardModal } from './components/RewardModal';
import { categoryOptions } from './data/fortunePool';
import { createFortune } from './lib/fortune';
import type { FortuneCategory, FortuneInput } from './types';
import './App.css';

const CONTACTS_VIRAL_MODULE_ID = '55c1350e-0b58-4810-842a-55a36ad951df';
const RETRY_AD_GROUP_ID = 'ait.v2.live.4f0ba4d8c69b42dd';

const presetMap: Record<FortuneCategory, string[]> = {
  wish: [
    '이번 주에는 기다리던 흐름이 조금 더 또렷해졌으면 좋겠어요.',
    '조금 불안하더라도 결국 좋은 방향으로 이어졌으면 좋겠어요.',
    '내가 기대하는 소식이 부드럽게 닿았으면 좋겠어요.',
    '지금 마음이 흔들리지 않고 편안해졌으면 좋겠어요.',
  ],
  love: [
    '좋아하는 사람과의 흐름이 조금 더 자연스럽게 가까워졌으면 좋겠어요.',
    '애매했던 마음이 따뜻한 신호로 돌아왔으면 좋겠어요.',
    '부담 없이 대화가 다시 이어졌으면 좋겠어요.',
    '오늘은 연애운이 부드럽게 열렸으면 좋겠어요.',
  ],
  reconnect: [
    '멀어진 사람과의 흐름이 천천히 다시 이어졌으면 좋겠어요.',
    '어색했던 분위기가 조금은 풀렸으면 좋겠어요.',
    '다시 연락이 닿아도 부담스럽지 않았으면 좋겠어요.',
    '관계가 예전보다 더 편안하게 회복됐으면 좋겠어요.',
  ],
  relationship: [
    '사람들과의 분위기가 조금 더 편안해졌으면 좋겠어요.',
    '오해가 있다면 부드럽게 풀렸으면 좋겠어요.',
    '내 마음이 잘 전달되는 하루였으면 좋겠어요.',
    '오늘은 관계에서 괜한 긴장이 줄었으면 좋겠어요.',
  ],
  money: [
    '불안한 지출 흐름이 조금 정리됐으면 좋겠어요.',
    '돈 문제에서 숨 돌릴 여유가 생겼으면 좋겠어요.',
    '이번 주에는 금전운이 안정적으로 흘렀으면 좋겠어요.',
    '작은 선택이 좋은 결과로 이어졌으면 좋겠어요.',
  ],
  work: [
    '일에서 막혀 있던 흐름이 조금 더 풀렸으면 좋겠어요.',
    '내가 한 노력이 좋은 평가로 이어졌으면 좋겠어요.',
    '기다리던 답이나 기회가 가까워졌으면 좋겠어요.',
    '오늘은 일에서 방향이 분명해졌으면 좋겠어요.',
  ],
  study: [
    '준비하던 일이 좋은 결과로 이어졌으면 좋겠어요.',
    '집중이 잘되고 마음이 덜 흔들렸으면 좋겠어요.',
    '지금까지 쌓은 노력이 제대로 빛났으면 좋겠어요.',
    '오늘은 공부운이 차분하게 열렸으면 좋겠어요.',
  ],
  health: [
    '몸과 마음이 조금 더 가볍게 회복됐으면 좋겠어요.',
    '지친 컨디션이 천천히 안정됐으면 좋겠어요.',
    '오늘은 건강 흐름이 부드럽게 올라왔으면 좋겠어요.',
    '무리하지 않아도 회복되는 하루였으면 좋겠어요.',
  ],
};

type Page = 'intro' | 'category' | 'wish' | 'egg' | 'result';
type EggPhase = 'idle' | 'shaking' | 'cracking' | 'opened';
type RetryAdMode = 'ready' | 'loading' | 'showing' | 'simulating';

function App() {
  const [wish, setWish] = useState('');
  const [category, setCategory] = useState<FortuneCategory>('wish');
  const [page, setPage] = useState<Page>('intro');
  const [eggPhase, setEggPhase] = useState<EggPhase>('idle');
  const [rewardOpen, setRewardOpen] = useState(false);
  const [rewardCountdown, setRewardCountdown] = useState(5);
  const [goldenUnlocked, setGoldenUnlocked] = useState(false);
  const [shareLabel, setShareLabel] = useState('친구에게 공유하기');
  const [retryAdMode, setRetryAdMode] = useState<RetryAdMode>('ready');
  const [retryAdLoaded, setRetryAdLoaded] = useState(false);
  const [retryAdHint, setRetryAdHint] = useState('광고를 보고 다른 소원을 다시 열어보세요.');

  const animationTimersRef = useRef<number[]>([]);
  const retryAdLoadCleanupRef = useRef<null | (() => void)>(null);
  const retryAdShowCleanupRef = useRef<null | (() => void)>(null);

  const normalizedWish = wish.trim();
  const presets = useMemo(() => presetMap[category], [category]);
  const fortuneInput = useMemo<FortuneInput | null>(() => {
    if (!normalizedWish) {
      return null;
    }

    return {
      wish: normalizedWish,
      category,
    };
  }, [normalizedWish, category]);

  const fortune = useMemo(() => {
    if (!fortuneInput) {
      return null;
    }

    return createFortune(fortuneInput);
  }, [fortuneInput]);

  const clearAnimationTimers = () => {
    for (const timer of animationTimersRef.current) {
      window.clearTimeout(timer);
    }

    animationTimersRef.current = [];
  };

  const cleanupRetryAdListeners = () => {
    retryAdLoadCleanupRef.current?.();
    retryAdShowCleanupRef.current?.();
    retryAdLoadCleanupRef.current = null;
    retryAdShowCleanupRef.current = null;
  };

  const resetToWishPage = () => {
    setWish('');
    setCategory('wish');
    setGoldenUnlocked(false);
    setShareLabel('친구에게 공유하기');
    setEggPhase('idle');
    setPage('category');
  };

  const resetShareLabelLater = (nextLabel = '친구에게 공유하기') => {
    animationTimersRef.current.push(
      window.setTimeout(() => {
        setShareLabel(nextLabel);
      }, 1800),
    );
  };

  useEffect(() => {
    if (retryAdMode !== 'simulating') {
      return;
    }

    const timer = window.setTimeout(() => {
      if (rewardCountdown <= 1) {
        clearAnimationTimers();
        setRetryAdMode('ready');
        setRewardOpen(false);
        setRewardCountdown(5);

        animationTimersRef.current.push(
          window.setTimeout(() => {
            resetToWishPage();
          }, 180),
        );
        return;
      }

      setRewardCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [retryAdMode, rewardCountdown]);

  useEffect(() => {
    return () => {
      clearAnimationTimers();
      cleanupRetryAdListeners();
    };
  }, []);

  useEffect(() => {
    if (!rewardOpen) {
      cleanupRetryAdListeners();
      setRetryAdLoaded(false);
      setRetryAdMode('ready');
      setRetryAdHint('광고를 보고 다른 소원을 다시 열어보세요.');
      return;
    }

    let isCancelled = false;

    const preloadRetryAd = async () => {
      try {
        const { loadFullScreenAd } = await import('@apps-in-toss/web-framework');

        if (!loadFullScreenAd.isSupported()) {
          if (!isCancelled) {
            setRetryAdLoaded(false);
            setRetryAdMode('ready');
            setRetryAdHint('현재 환경에서는 전면광고 대신 기본 다시보기로 이어집니다.');
          }
          return;
        }

        setRetryAdLoaded(false);
        setRetryAdMode('loading');
        setRetryAdHint('전면광고를 준비하고 있어요.');
        cleanupRetryAdListeners();

        retryAdLoadCleanupRef.current = loadFullScreenAd({
          options: { adGroupId: RETRY_AD_GROUP_ID },
          onEvent: (event) => {
            if (isCancelled) {
              return;
            }

            if (event.type === 'loaded') {
              setRetryAdLoaded(true);
              setRetryAdMode('ready');
              setRetryAdHint('전면광고 준비가 끝났어요.');
            }
          },
          onError: (error) => {
            console.error('retry interstitial load error:', error);

            if (isCancelled) {
              return;
            }

            setRetryAdLoaded(false);
            setRetryAdMode('ready');
            setRetryAdHint('광고를 불러오지 못해 기본 다시보기로 전환돼요.');
          },
        });
      } catch (error) {
        console.error('retry interstitial unavailable:', error);

        if (isCancelled) {
          return;
        }

        setRetryAdLoaded(false);
        setRetryAdMode('ready');
        setRetryAdHint('이 환경에서는 기본 다시보기로 진행돼요.');
      }
    };

    void preloadRetryAd();

    return () => {
      isCancelled = true;
    };
  }, [rewardOpen]);

  const handleCrack = () => {
    if (!fortuneInput || eggPhase !== 'idle') {
      return;
    }

    clearAnimationTimers();
    setEggPhase('shaking');

    animationTimersRef.current.push(
      window.setTimeout(() => {
        setEggPhase('cracking');
      }, 420),
    );

    animationTimersRef.current.push(
      window.setTimeout(() => {
        setEggPhase('opened');
        setPage('result');
      }, 1100),
    );
  };

  const handleGoToEgg = () => {
    if (!fortuneInput) {
      return;
    }

    clearAnimationTimers();
    setEggPhase('idle');
    setGoldenUnlocked(false);
    setRewardOpen(false);
    setRewardCountdown(5);
    setShareLabel('친구에게 공유하기');
    setRetryAdMode('ready');
    setRetryAdLoaded(false);
    setRetryAdHint('광고를 보고 다른 소원을 다시 열어보세요.');
    setPage('egg');
  };

  const handleBackToWish = () => {
    clearAnimationTimers();
    setEggPhase('idle');
    setPage('wish');
  };

  const startRetrySimulation = () => {
    setRetryAdMode('simulating');
    setRewardCountdown(5);
    setRetryAdHint('잠시 뒤 다른 소원을 다시 열어드릴게요.');
  };

  const handleRewardStart = async () => {
    if (retryAdMode === 'loading' || retryAdMode === 'showing') {
      return;
    }

    try {
      const { showFullScreenAd } = await import('@apps-in-toss/web-framework');

      if (!showFullScreenAd.isSupported() || !retryAdLoaded) {
        startRetrySimulation();
        return;
      }

      setRetryAdMode('showing');
      setRetryAdHint('전면광고를 여는 중이에요.');

      cleanupRetryAdListeners();
      retryAdShowCleanupRef.current = showFullScreenAd({
        options: { adGroupId: RETRY_AD_GROUP_ID },
        onEvent: (event) => {
          switch (event.type) {
            case 'requested':
            case 'show':
            case 'impression':
            case 'clicked':
            case 'userEarnedReward':
              return;
            case 'dismissed':
              cleanupRetryAdListeners();
              setRetryAdLoaded(false);
              setRetryAdMode('ready');
              setRewardOpen(false);
              animationTimersRef.current.push(
                window.setTimeout(() => {
                  resetToWishPage();
                }, 180),
              );
              return;
            case 'failedToShow':
              cleanupRetryAdListeners();
              setRetryAdLoaded(false);
              startRetrySimulation();
              return;
          }
        },
        onError: (error) => {
          console.error('retry interstitial show error:', error);
          cleanupRetryAdListeners();
          setRetryAdLoaded(false);
          startRetrySimulation();
        },
      });
    } catch (error) {
      console.error('retry interstitial unavailable:', error);
      startRetrySimulation();
    }
  };

  const fallbackShare = async (unlockGolden: boolean) => {
    if (!fortune || !fortuneInput) {
      return;
    }

    const shareText = [
      `오늘의 포춘: ${fortune.message}`,
      `흐름 해석: ${fortune.interpretation}`,
      `오늘의 행동: ${fortune.actionHint}`,
      `소원: ${fortuneInput.wish}`,
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({
          title: '포츈에그',
          text: shareText,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      }

      if (unlockGolden) {
        setGoldenUnlocked(true);
      }

      setShareLabel('공유했어요');
      resetShareLabelLater();
    } catch {
      setShareLabel('다시 시도해 주세요');
      resetShareLabelLater();
    }
  };

  const runContactsViral = async (unlockGolden: boolean) => {
    try {
      const { contactsViral } = await import('@apps-in-toss/web-framework');

      let cleanup = () => {};

      cleanup = contactsViral({
        options: { moduleId: CONTACTS_VIRAL_MODULE_ID.trim() },
        onEvent: (event) => {
          if (event.type === 'sendViral') {
            setShareLabel(`${event.data.rewardAmount}${event.data.rewardUnit} 받았어요`);

            if (unlockGolden) {
              setGoldenUnlocked(true);
            }

            resetShareLabelLater();
            return;
          }

          if (event.type === 'close') {
            cleanup();

            if (event.data.closeReason === 'noReward') {
              setShareLabel('공유가 완료되지 않았어요');
              resetShareLabelLater();
            }
          }
        },
        onError: async (error) => {
          console.error('contactsViral error:', error);
          cleanup?.();
          await fallbackShare(unlockGolden);
        },
      });
    } catch (error) {
      console.error('contactsViral unavailable:', error);
      await fallbackShare(unlockGolden);
    }
  };

  const handleShare = async () => {
    await runContactsViral(false);
  };

  const handleShareAndUnlockGolden = async () => {
    await runContactsViral(true);
  };

  return (
    <>
      <main className="app-shell">
        <section className="stage-layout">
          <div className={`stage-view stage-view--${page}`}>
            {page === 'intro' ? (
              <section className="panel intro-panel">
                <div className="intro-orb intro-orb-one" />
                <div className="intro-orb intro-orb-two" />

                <div className="intro-copy">
                  <p className="eyebrow">포츈에그</p>
                  <h1>
                    소원을 적고 에그를 깨면
                    {'\n'}
                    오늘의 징조가
                    {'\n'}
                    한 문장으로
                    {'\n'}
                    열립니다
                  </h1>
                  <p className="body-copy">
                    분야 하나와 작은 바람만 적으면,
                    <br />
                    첫 포춘은 무료로 열리고 더 깊은 해석은 황금 에그로 이어집니다.
                  </p>
                </div>

                <div className="intro-egg-display" aria-hidden="true">
                  <span className="intro-egg-glow" />
                  <span className="intro-egg-whole" />
                </div>

                <div className="policy-strip policy-strip--intro">
                  <span>분야 선택</span>
                  <span>희망 메시지</span>
                  <span>첫 포춘 무료</span>
                  <span>황금 에그 확장</span>
                </div>

                <button
                  className="primary-button intro-start-button"
                  type="button"
                  onClick={() => setPage('category')}
                >
                  시작하기
                </button>
              </section>
            ) : null}

            {page === 'category' ? (
              <FortuneForm
                step="category"
                value={wish}
                category={category}
                presets={presets}
                categoryOptions={categoryOptions}
                onChange={setWish}
                onPresetClick={setWish}
                onCategoryChange={setCategory}
                onNext={() => setPage('wish')}
                onBack={() => setPage('intro')}
                onSubmit={handleGoToEgg}
              />
            ) : null}

            {page === 'wish' ? (
              <FortuneForm
                step="wish"
                value={wish}
                category={category}
                presets={presets}
                categoryOptions={categoryOptions}
                onChange={setWish}
                onPresetClick={setWish}
                onCategoryChange={setCategory}
                onNext={() => undefined}
                onBack={() => setPage('category')}
                onSubmit={handleGoToEgg}
              />
            ) : null}

            {page === 'egg' ? (
              <EggStage
                phase={eggPhase}
                disabled={!fortuneInput}
                onCrack={handleCrack}
                onBack={handleBackToWish}
              />
            ) : null}

            {page === 'result' && fortune && fortuneInput ? (
              <div className="result-reveal result-reveal--page">
                <FortuneResultCard
                  result={fortune}
                  wish={fortuneInput.wish}
                  goldenUnlocked={goldenUnlocked}
                  shareLabel={shareLabel}
                  onShare={handleShare}
                  onShareAndUnlockGolden={handleShareAndUnlockGolden}
                  onTryAnotherWish={() => {
                    setRewardOpen(true);
                    setRewardCountdown(5);
                  }}
                />
              </div>
            ) : null}

            {page === 'result' && !fortune ? (
              <section className="panel policy-panel">
                <p className="eyebrow">FORTUNE NOTE</p>
                <h2>소원이 아직 비어 있어요.</h2>
                <ul className="policy-list">
                  <li>분야를 고른 뒤 희망 메시지를 적으면 포춘 에그를 열 수 있어요.</li>
                  <li>첫 결과는 무료이고, 더 깊은 해석은 황금 에그에서 이어집니다.</li>
                </ul>
                <button className="primary-button" type="button" onClick={resetToWishPage}>
                  소원 적으러 가기
                </button>
              </section>
            ) : null}
          </div>
        </section>
      </main>

      <RewardModal
        open={rewardOpen}
        mode={retryAdMode}
        countdown={rewardCountdown}
        description={retryAdHint}
        startLabel={retryAdLoaded ? '전면광고 보고 다시보기' : '바로 다시보기'}
        startDisabled={retryAdMode === 'loading' || retryAdMode === 'showing'}
        onClose={() => setRewardOpen(false)}
        onStart={() => {
          void handleRewardStart();
        }}
      />
    </>
  );
}

export default App;
