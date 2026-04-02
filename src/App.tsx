import { useEffect, useMemo, useRef, useState } from 'react';
import { EggStage } from './components/EggStage';
import { FortuneForm } from './components/FortuneForm';
import { FortuneResultCard } from './components/FortuneResult';
import { RewardModal } from './components/RewardModal';
import { createFortune } from './lib/fortune';
import './App.css';

const CONTACTS_VIRAL_MODULE_ID = '55c1350e-0b58-4810-842a-55a36ad951df';
const RETRY_AD_GROUP_ID = 'ait.v2.live.4f0ba4d8c69b42dd';

const presets = [
  '좋아하는 사람에게 좋은 연락이 오면 좋겠어요.',
  '면접 결과가 기대한 방향으로 열리면 좋겠어요.',
  '요즘 마음이 조금 더 가벼워지면 좋겠어요.',
  '지금 고민하는 관계가 조금 더 선명해지면 좋겠어요.',
];

type Page = 'intro' | 'wish' | 'egg' | 'result';
type EggPhase = 'idle' | 'shaking' | 'cracking' | 'opened';
type RetryAdMode = 'ready' | 'loading' | 'showing' | 'simulating';

function App() {
  const [wish, setWish] = useState('');
  const [page, setPage] = useState<Page>('intro');
  const [eggPhase, setEggPhase] = useState<EggPhase>('idle');
  const [rewardOpen, setRewardOpen] = useState(false);
  const [rewardCountdown, setRewardCountdown] = useState(5);
  const [goldenUnlocked, setGoldenUnlocked] = useState(false);
  const [shareLabel, setShareLabel] = useState('친구에게 공유하기');
  const [retryAdMode, setRetryAdMode] = useState<RetryAdMode>('ready');
  const [retryAdLoaded, setRetryAdLoaded] = useState(false);
  const [retryAdHint, setRetryAdHint] = useState('광고를 보고 다른 소원을 다시 열 수 있어요.');

  const animationTimersRef = useRef<number[]>([]);
  const retryAdLoadCleanupRef = useRef<null | (() => void)>(null);
  const retryAdShowCleanupRef = useRef<null | (() => void)>(null);

  const normalizedWish = wish.trim();
  const fortune = useMemo(() => {
    if (!normalizedWish) {
      return null;
    }

    return createFortune(normalizedWish);
  }, [normalizedWish]);

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
    setGoldenUnlocked(false);
    setShareLabel('친구에게 공유하기');
    setEggPhase('idle');
    setPage('wish');
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
      setRetryAdHint('광고를 보고 다른 소원을 다시 열 수 있어요.');
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
            setRetryAdHint('현재 환경에서는 전면광고 대신 기본 다시보기로 이어져요.');
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
            setRetryAdHint('전면광고를 불러오지 못해 기본 다시보기로 전환돼요.');
          },
        });
      } catch (error) {
        console.error('retry interstitial unavailable:', error);

        if (isCancelled) {
          return;
        }

        setRetryAdLoaded(false);
        setRetryAdMode('ready');
        setRetryAdHint('웹 미리보기에서는 기본 다시보기로 진행해요.');
      }
    };

    void preloadRetryAd();

    return () => {
      isCancelled = true;
    };
  }, [rewardOpen]);

  const handleCrack = () => {
    if (!normalizedWish || eggPhase !== 'idle') {
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
    if (!normalizedWish) {
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
    setRetryAdHint('광고를 보고 다른 소원을 다시 열 수 있어요.');
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
    setRetryAdHint('잠시 후 다른 소원을 다시 열어드릴게요.');
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
            case 'userEarnedReward':
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
    if (!fortune) {
      return;
    }

    const shareText = [
      `오늘의 포춘: ${fortune.message}`,
      `소원: ${normalizedWish}`,
      `행동 힌트: ${fortune.actionHint}`,
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fortune Eggs',
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
                  <p className="eyebrow">FORTUNE EGGS</p>
                  <h1>
                    소원을 적고
                    {'\n'}
                    에그를 깨면,
                    {'\n'}
                    오늘의 징조가
                    {'\n'}
                    한 문장으로 열립니다
                  </h1>
                  <p className="body-copy">
                    첫 포춘은 무료로 열리고,
                    <br />
                    더 깊은 해석은 황금 에그로 이어집니다.
                  </p>
                </div>

                <div className="intro-egg-display" aria-hidden="true">
                  <span className="intro-egg-glow" />
                  <span className="intro-egg-whole" />
                </div>

                <div className="policy-strip policy-strip--intro">
                  <span>첫 포춘 무료</span>
                  <span>광고는 선택형</span>
                  <span>공유 후 황금 에그</span>
                </div>

                <button className="primary-button intro-start-button" type="button" onClick={() => setPage('wish')}>
                  시작하기
                </button>
              </section>
            ) : null}

            {page === 'wish' ? (
              <FortuneForm
                value={wish}
                presets={presets}
                onChange={setWish}
                onPresetClick={setWish}
                onSubmit={handleGoToEgg}
              />
            ) : null}

            {page === 'egg' ? (
              <EggStage
                phase={eggPhase}
                disabled={!normalizedWish}
                onCrack={handleCrack}
                onBack={handleBackToWish}
              />
            ) : null}

            {page === 'result' && fortune ? (
              <div className="result-reveal result-reveal--page">
                <FortuneResultCard
                  result={fortune}
                  wish={normalizedWish}
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
                <p className="eyebrow">POLICY NOTE</p>
                <h2>포춘을 열 소원이 아직 비어 있어요.</h2>
                <ul className="policy-list">
                  <li>먼저 소원을 적고 에그 페이지로 이동해 주세요.</li>
                  <li>진입 직후 광고를 띄우지 않고 무료 결과를 먼저 보여줍니다.</li>
                </ul>
                <button className="primary-button" type="button" onClick={handleBackToWish}>
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
