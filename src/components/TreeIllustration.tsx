"use client";

/**
 * Inside Out 감정 구슬(Memory Orb) 모티프 일러스트레이션
 *
 * - LandingTree → LandingOrbs: 여러 감정 구슬이 모인 히어로 일러스트
 * - GrowingTree → GrowingOrb: 빈 구슬이 단계별로 색이 채워짐 (질문 프로그레스)
 * - BloomingTree → BloomingOrb: 완성된 구슬에 반짝이 추가 (추가 질문)
 * - LoadingTree → LoadingOrb: 구슬이 빛나며 완성되는 로딩
 */

const COLORS = {
  joy: "#E8D43A",
  sadness: "#3E67C8",
  anger: "#EF3320",
  anxiety: "#F36A16",
  envy: "#46C5B8",
  embarrassment: "#D6B8E8",
  ennui: "#2A2475",
  disgust: "#52B43C",
};

// ── 랜딩: 감정 구슬 클러스터 ──
export function LandingTree() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes float3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse { 0%,100% { opacity: 0.15; } 50% { opacity: 0.3; } }
        .orb-float-1 { animation: float1 3s ease-in-out infinite; }
        .orb-float-2 { animation: float2 3.5s ease-in-out 0.5s infinite; }
        .orb-float-3 { animation: float3 4s ease-in-out 1s infinite; }
        .orb-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* 배경 글로 */}
      <circle cx="110" cy="100" r="80" fill={COLORS.ennui} opacity="0.04" className="orb-pulse" />
      <circle cx="110" cy="100" r="55" fill={COLORS.sadness} opacity="0.05" className="orb-pulse" />

      {/* 메인 구슬 — 기쁨이 (가장 큼) */}
      <g className="orb-float-1">
        <defs>
          <radialGradient id="orbJoy" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#FBF0A0" />
            <stop offset="100%" stopColor={COLORS.joy} />
          </radialGradient>
        </defs>
        <circle cx="110" cy="90" r="36" fill="url(#orbJoy)" />
        <ellipse cx="100" cy="78" rx="10" ry="6" fill="white" opacity="0.35" />
      </g>

      {/* 슬픔이 */}
      <g className="orb-float-2">
        <defs>
          <radialGradient id="orbSad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#97ADE1" />
            <stop offset="100%" stopColor={COLORS.sadness} />
          </radialGradient>
        </defs>
        <circle cx="60" cy="110" r="24" fill="url(#orbSad)" />
        <ellipse cx="53" cy="102" rx="7" ry="4" fill="white" opacity="0.3" />
      </g>

      {/* 불안이 */}
      <g className="orb-float-3">
        <defs>
          <radialGradient id="orbAnx" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#FCDECC" />
            <stop offset="100%" stopColor={COLORS.anxiety} />
          </radialGradient>
        </defs>
        <circle cx="160" cy="105" r="22" fill="url(#orbAnx)" />
        <ellipse cx="154" cy="98" rx="6" ry="3.5" fill="white" opacity="0.3" />
      </g>

      {/* 부럽이 */}
      <g className="orb-float-1">
        <defs>
          <radialGradient id="orbEnvy" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#9BE0D9" />
            <stop offset="100%" stopColor={COLORS.envy} />
          </radialGradient>
        </defs>
        <circle cx="82" cy="148" r="18" fill="url(#orbEnvy)" />
        <ellipse cx="77" cy="142" rx="5" ry="3" fill="white" opacity="0.25" />
      </g>

      {/* 당황이 */}
      <g className="orb-float-2">
        <defs>
          <radialGradient id="orbEmb" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#F6EFFA" />
            <stop offset="100%" stopColor={COLORS.embarrassment} />
          </radialGradient>
        </defs>
        <circle cx="140" cy="145" r="16" fill="url(#orbEmb)" />
        <ellipse cx="136" cy="140" rx="4.5" ry="2.5" fill="white" opacity="0.25" />
      </g>

      {/* 버럭이 (작음) */}
      <g className="orb-float-3">
        <circle cx="48" cy="72" r="10" fill={COLORS.anger} opacity="0.6" />
        <ellipse cx="45" cy="69" rx="3" ry="2" fill="white" opacity="0.2" />
      </g>

      {/* 따분이 (작음) */}
      <g className="orb-float-1">
        <circle cx="170" cy="68" r="9" fill={COLORS.ennui} opacity="0.5" />
        <ellipse cx="168" cy="65" rx="2.5" ry="1.5" fill="white" opacity="0.2" />
      </g>

      {/* 작은 반짝이 파티클 */}
      <circle cx="130" cy="55" r="2" fill={COLORS.joy} opacity="0.4" />
      <circle cx="85" cy="65" r="1.5" fill={COLORS.envy} opacity="0.3" />
      <circle cx="145" cy="160" r="1.5" fill={COLORS.sadness} opacity="0.3" />
      <circle cx="65" cy="155" r="2" fill={COLORS.anxiety} opacity="0.25" />
    </svg>
  );
}

// ── 질문 프로그레스: 구슬이 점점 채워지며 커짐 (5단계) ──
export function GrowingTree({ stage }: { stage: number }) {
  const colors = [COLORS.envy, COLORS.sadness, COLORS.joy, COLORS.anxiety, COLORS.embarrassment];
  const currentColor = colors[stage - 1] || COLORS.sadness;
  const isFull = stage >= 5;

  // 매 단계: 구슬 크기 증가 + 공전 구슬 추가
  const sizes = [14, 17, 20, 24, 28];
  const orbR = sizes[stage - 1] || 14;
  const fillPercent = isFull ? 100 : stage * 20;
  const cx = 45;
  const cy = 40;

  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <style>{`
        @keyframes breath { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes glowRing { 0%,100% { opacity: 0.06; } 50% { opacity: 0.18; } }
        @keyframes ripple { 0% { r: ${orbR}; opacity: 0.3; } 100% { r: ${orbR + 14}; opacity: 0; } }
        @keyframes orbitA { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orb-breath { animation: breath 2.5s ease-in-out infinite; transform-origin: ${cx}px ${cy}px; }
        .glow-ring { animation: glowRing 2.5s ease-in-out infinite; }
        .ripple { animation: ripple 0.6s ease-out forwards; }
        .orbit-slow { animation: orbitA 10s linear infinite; transform-origin: ${cx}px ${cy}px; }
      `}</style>

      <defs>
        <linearGradient id={`gf${stage}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={currentColor} />
          <stop offset={`${fillPercent}%`} stopColor={currentColor} />
          <stop offset={`${fillPercent}%`} stopColor={currentColor} stopOpacity={isFull ? "1" : "0.08"} />
          {!isFull && <stop offset="100%" stopColor={currentColor} stopOpacity="0.03" />}
        </linearGradient>
        <radialGradient id={`gs${stage}`} cx="35%" cy="28%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 파동 — key에 stage를 넣어 매 단계마다 새로 트리거 */}
      <circle key={`ripple-${stage}`} cx={cx} cy={cy} r={orbR} fill="none" stroke={currentColor} strokeWidth="2" className="ripple" />

      {/* 글로 링 */}
      {isFull && (
        <circle cx={cx} cy={cy} r={orbR + 8} fill={currentColor} className="glow-ring" />
      )}

      {/* 공전 구슬들 — 단계마다 1개씩 추가 */}
      <g className="orbit-slow">
        {stage >= 2 && <circle cx={cx} cy={cy - orbR - 9} r="3" fill={colors[0]} opacity="0.6" />}
        {stage >= 3 && <circle cx={cx + orbR + 9} cy={cy} r="2.5" fill={colors[1]} opacity="0.5" />}
        {stage >= 4 && <circle cx={cx} cy={cy + orbR + 9} r="2.5" fill={colors[2]} opacity="0.5" />}
        {isFull && <circle cx={cx - orbR - 9} cy={cy} r="3" fill={colors[3]} opacity="0.6" />}
      </g>

      {/* 구슬 본체 */}
      <g className={isFull ? "orb-breath" : ""}>
        <circle cx={cx} cy={cy} r={orbR} fill={`url(#gf${stage})`} style={{ transition: "r 0.4s ease" }} />
        <circle cx={cx} cy={cy} r={orbR} fill={`url(#gs${stage})`} />
        <circle
          cx={cx} cy={cy} r={orbR}
          stroke={currentColor} strokeWidth={isFull ? 2.5 : 1.5} strokeOpacity={isFull ? 0.4 : 0.2}
          fill="none"
        />
        <ellipse
          cx={cx - orbR * 0.28} cy={cy - orbR * 0.28}
          rx={orbR * 0.22} ry={orbR * 0.15}
          fill="white" opacity="0.35"
        />
      </g>

      {/* 단계 점들 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={33 + i * 6}
          cy="82"
          r={i < stage ? 2.5 : 2}
          fill={i < stage ? colors[i] : "#d0cfe1"}
          opacity={i < stage ? 1 : 0.3}
          style={{ transition: "all 0.3s ease" }}
        />
      ))}
    </svg>
  );
}

// ── 추가 질문: 이미 찬 구슬이 빛나며 커짐 + 공전 (3단계) ──
export function BloomingTree({ stage }: { stage: number }) {
  const orbitColors = [COLORS.envy, COLORS.embarrassment, COLORS.sadness];
  const sizes = [24, 27, 30];
  const orbR = sizes[stage - 1] || 24;
  const cx = 45;
  const cy = 40;

  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <style>{`
        @keyframes bloomBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.2; }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bloomRipple {
          0% { r: ${orbR}; opacity: 0.25; }
          100% { r: ${orbR + 16}; opacity: 0; }
        }
        .bloom-breath { animation: bloomBreath 2.5s ease-in-out infinite; transform-origin: ${cx}px ${cy}px; }
        .ring-pulse { animation: ringPulse 2s ease-in-out infinite; }
        .orbit { animation: orbitSpin ${9 - stage * 2}s linear infinite; transform-origin: ${cx}px ${cy}px; }
        .bloom-ripple { animation: bloomRipple 0.6s ease-out forwards; }
      `}</style>

      <defs>
        <radialGradient id={`bf${stage}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FBF0A0" />
          <stop offset="50%" stopColor={COLORS.joy} />
          <stop offset="100%" stopColor={COLORS.envy} />
        </radialGradient>
        <radialGradient id={`bs${stage}`} cx="35%" cy="28%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 파동 — 단계 변경 시 트리거 */}
      <circle key={`br-${stage}`} cx={cx} cy={cy} r={orbR} fill="none" stroke={COLORS.envy} strokeWidth="2" className="bloom-ripple" />

      {/* 글로 링 */}
      <circle cx={cx} cy={cy} r={orbR + 6 + stage * 2} fill={COLORS.envy} className="ring-pulse" />

      {/* 공전 구슬 */}
      <g className="orbit">
        {stage >= 1 && <circle cx={cx} cy={cy - orbR - 10} r="4" fill={orbitColors[0]} opacity="0.7" />}
        {stage >= 2 && <circle cx={cx + orbR + 10} cy={cy} r="3.5" fill={orbitColors[1]} opacity="0.6" />}
        {stage >= 3 && <circle cx={cx} cy={cy + orbR + 10} r="3" fill={orbitColors[2]} opacity="0.6" />}
      </g>

      {/* 구슬 본체 */}
      <g className="bloom-breath">
        <circle cx={cx} cy={cy} r={orbR} fill={`url(#bf${stage})`} style={{ transition: "r 0.4s ease" }} />
        <circle cx={cx} cy={cy} r={orbR} fill={`url(#bs${stage})`} />
        <circle cx={cx} cy={cy} r={orbR} stroke={COLORS.envy} strokeWidth="2" strokeOpacity="0.25" fill="none" />
        <ellipse
          cx={cx - orbR * 0.25} cy={cy - orbR * 0.25}
          rx={orbR * 0.2} ry={orbR * 0.14}
          fill="white" opacity="0.4"
        />
      </g>

      {/* 하단 점 (3개) */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={39 + i * 6}
          cy="82"
          r={i < stage ? 2.5 : 2}
          fill={i < stage ? orbitColors[i] : "#d0cfe1"}
          opacity={i < stage ? 1 : 0.3}
          style={{ transition: "all 0.3s ease" }}
        />
      ))}
    </svg>
  );
}

// ── 로딩: 빛나는 구슬 ──
export function LoadingTree() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="grow-up">
      <style>{`
        @keyframes orbGlow {
          0%,100% { r: 42; opacity: 0.15; }
          50% { r: 50; opacity: 0.25; }
        }
        @keyframes orbSpin {
          from { transform: rotate(0deg); transform-origin: 60px 60px; }
          to { transform: rotate(360deg); transform-origin: 60px 60px; }
        }
        .orb-glow { animation: orbGlow 1.5s ease-in-out infinite; }
        .orb-spin { animation: orbSpin 8s linear infinite; }
      `}</style>

      {/* 글로 이펙트 */}
      <circle cx="60" cy="60" r="48" fill={COLORS.joy} opacity="0.08" className="orb-glow" />
      <circle cx="60" cy="60" r="40" fill={COLORS.sadness} opacity="0.06" className="orb-glow" />

      {/* 메인 구슬 */}
      <defs>
        <radialGradient id="orbLoading" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FBF0A0" />
          <stop offset="40%" stopColor={COLORS.joy} />
          <stop offset="100%" stopColor={COLORS.envy} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="36" fill="url(#orbLoading)" />
      <ellipse cx="48" cy="48" rx="10" ry="7" fill="white" opacity="0.3" />

      {/* 공전하는 작은 구슬들 */}
      <g className="orb-spin">
        <circle cx="60" cy="14" r="5" fill={COLORS.sadness} opacity="0.6" />
        <circle cx="100" cy="60" r="4" fill={COLORS.anxiety} opacity="0.5" />
        <circle cx="60" cy="106" r="4.5" fill={COLORS.embarrassment} opacity="0.5" />
        <circle cx="20" cy="60" r="3.5" fill={COLORS.envy} opacity="0.5" />
      </g>
    </svg>
  );
}
