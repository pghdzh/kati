<!-- 📄 src/views/HomePage.vue -->
<template>
  <main class="home-page cartethyia-home" role="main">
    <!-- Three.js 背景容器（全屏固定，增加深海神秘感） -->
    <div class="three-dom" ref="threeContainer"></div>

    <!-- CSS 多层装饰背景（增强圣女与鸣式氛围） -->
    <div class="bg-decor">
      <!-- 深海波纹网格 -->
      <div class="abyss-grid"></div>
      <!-- 鸢尾花旋转暗纹 -->
      <div class="fleur-mandala"></div>
      <!-- 升腾的粒子群 - 象征鸣式能量 -->
      <div class="ascension-particles">
        <span
          v-for="i in 20"
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        ></span>
      </div>
      <!-- 双生光影剪影（左右两侧） -->
      <div class="dual-shadows">
        <div class="shadow left"></div>
        <div class="shadow right"></div>
      </div>
      <!-- 底部光栅扫掠 -->
      <div class="bottom-sweep"></div>
      <!-- 圣典竖线装饰 -->
      <div class="scripture-lines"></div>
    </div>

    <!-- 居中内容区 -->
    <section class="center-wrap" aria-live="polite">
      <header class="hero" role="banner">
        <div class="title-crown">
          <span class="crown-left">⚜️</span>
          <span class="crown-right">⚜️</span>
        </div>
        <h1 class="title">
          <span class="title-main">卡提希娅</span>
          <span class="title-sub">CARTETHYIA · ELECTRONICA CODEX</span>
        </h1>
        <div class="title-badge">
          <span class="badge-text">「 双生圣女 · 流浪骑士 」</span>
        </div>
        <div class="title-radiance"></div>
      </header>

      <div class="type-area" role="status" aria-atomic="true">
        <div class="type-box">
          <div class="type-content">
            <span class="typed-prefix">『</span>
            <span class="typed">{{ displayText }}</span>
            <span class="typed-suffix">』</span>
            <span class="cursor" aria-hidden="true">|</span>
          </div>
          <div class="type-border"></div>
          <div class="type-border-glow"></div>
          <!-- 圣剑装饰 -->
          <div class="holy-blade-decor"></div>
        </div>
        <button @click="randomExplore" class="enter-btn">
          <span class="btn-text">🗡️ 踏入圣典 🗡️</span>
          <div class="btn-glow"></div>
          <div class="btn-ripple"></div>
        </button>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="site-footer" role="contentinfo">
      <div class="footer-inner">
        <div class="left">
          <small
            >© {{ new Date().getFullYear() }} 卡提希娅电子设定集 ·
            荧蓝深海圣堂</small
          >
          <span class="dot">•</span>
          <small>愿风指引你的前路</small>
        </div>
      </div>
      <div class="footer-wave"></div>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import initCartethyiaBackground from "./initCartethyiaBackground";

const router = useRouter();
const threeContainer = ref(null);

// 可探索的页面（卡提希娅风格命名）
const exploreRoutes = [
  { name: "风旅之始", path: "/" },
  { name: "时痕刻印", path: "/timeLine" },
  { name: "剑心低语", path: "/message" },
  { name: "双生瞬影", path: "/gallery" },
  { name: "圣典残章", path: "/resources" },
  { name: "AI对话", path: "/talk" },
  { name: "鸢尾韵律", path: "/music" },
  { name: "文本分享", path: "/wiki" },
];

function randomExplore() {
  const random =
    exploreRoutes[Math.floor(Math.random() * exploreRoutes.length)];
  router.push(random.path);
}

// 角色语录池
const lines = [
  "风会指引你的前路，一如它曾指引我这持剑的流浪之人。",
  "不必畏惧阴影，我手中的剑，曾斩断过更深的黑暗。",
  "在此刻，我是卡提希娅，也是芙露德莉斯——愿我的剑，能成为守护你的力量。",
  "告别了神座的枷锁，我以自由之姿，欢迎你的到来。",
  "听见风中的回响了吗？那是过往的悲鸣，也是新生的序曲。",
  "愿你的旅程，如绽放的鸢尾，永远追寻光明与自由。",
  "此身虽为鸣式所铸，此心却只遵循自我的意志。",
];

const displayText = ref("");
const lineIndex = ref(0);
const charIndex = ref(0);
const TYPING_SPEED = 80;
const DELETING_SPEED = 25;
const PAUSE_AFTER_FULL = 1800;

let typingTimer = null;
let pauseTimer = null;

function typeStep() {
  const currentLine = lines[lineIndex.value];
  if (charIndex.value <= currentLine.length) {
    displayText.value = currentLine.slice(0, charIndex.value);
    charIndex.value++;
    typingTimer = setTimeout(typeStep, TYPING_SPEED);
  } else {
    pauseTimer = setTimeout(startDeleting, PAUSE_AFTER_FULL);
  }
}

function startDeleting() {
  const currentLine = lines[lineIndex.value];
  if (charIndex.value >= 0) {
    displayText.value = currentLine.slice(0, charIndex.value);
    charIndex.value--;
    typingTimer = setTimeout(startDeleting, DELETING_SPEED);
  } else {
    lineIndex.value = (lineIndex.value + 1) % lines.length;
    pauseTimer = setTimeout(() => {
      charIndex.value = 0;
      typeStep();
    }, 600);
  }
}

// 装饰粒子随机参数
const getParticleStyle = (i) => {
  const positions = [
    { top: "10%", left: "5%" },
    { top: "20%", left: "90%" },
    { top: "35%", left: "15%" },
    { top: "50%", left: "85%" },
    { top: "65%", left: "8%" },
    { top: "78%", left: "93%" },
    { top: "25%", left: "40%" },
    { top: "55%", left: "30%" },
    { top: "18%", left: "70%" },
    { top: "70%", left: "55%" },
    { top: "42%", left: "75%" },
    { top: "85%", left: "35%" },
    { top: "5%", left: "80%" },
    { top: "88%", left: "15%" },
    { top: "30%", left: "25%" },
    { top: "60%", left: "60%" },
    { top: "12%", left: "45%" },
    { top: "48%", left: "10%" },
    { top: "75%", left: "68%" },
    { top: "92%", left: "48%" },
  ];
  const delays = [
    "0s",
    "1.1s",
    "2.3s",
    "3.4s",
    "4.6s",
    "5.8s",
    "7.0s",
    "8.2s",
    "0.5s",
    "1.7s",
    "2.9s",
    "4.1s",
    "5.3s",
    "6.5s",
    "7.7s",
    "8.9s",
    "0.8s",
    "2.0s",
    "3.2s",
    "4.4s",
  ];
  const durations = [
    "8s",
    "7s",
    "9s",
    "6s",
    "10s",
    "7.5s",
    "8.5s",
    "6.5s",
    "9.2s",
    "7.8s",
    "8s",
    "6.2s",
    "10.5s",
    "7.1s",
    "9.1s",
    "8.3s",
    "7.4s",
    "9.8s",
    "6.8s",
    "8.9s",
  ];
  const sizes = [
    "3px",
    "2px",
    "4px",
    "2px",
    "3px",
    "2px",
    "4px",
    "3px",
    "2px",
    "4px",
    "3px",
    "2px",
    "3px",
    "4px",
    "2px",
    "3px",
    "2px",
    "4px",
    "3px",
    "2px",
  ];
  const pos = positions[(i - 1) % positions.length];
  return {
    top: pos.top,
    left: pos.left,
    animationDelay: delays[(i - 1) % delays.length],
    animationDuration: durations[(i - 1) % durations.length],
    width: sizes[(i - 1) % sizes.length],
    height: sizes[(i - 1) % sizes.length],
  };
};

let bgCleanup = null;

onMounted(() => {
  if (threeContainer.value) {
    const result = initCartethyiaBackground(threeContainer.value);
    bgCleanup = result.cleanup;
  }

  // 启动打字机
  pauseTimer = setTimeout(() => {
    charIndex.value = 0;
    typeStep();
  }, 1000);
});

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer);
  if (pauseTimer) clearTimeout(pauseTimer);
  if (bgCleanup) bgCleanup();
});
</script>

<style scoped lang="scss">
/* ===== 卡提希娅配色体系 ===== */
.cartethyia-home {
  --deep-abyss: #060810;
  --panel-dark: #0c1220;
  --holy-white: #f0f5fc;
  --ice-blue: #a0d4ff;
  --ice-glow: #b6e2ff;
  --gold: #d4b87a;
  --gold-light: #e8cd7a;
  --purple-tinge: #b0a0d0;
  --accent-magenta: #c94a7a;
  --text-soft: #e9e8e7;
  --abyss-grid: rgba(160, 212, 255, 0.025);
  --fleur-color: rgba(212, 184, 122, 0.03);
  --shadow-deep: 0 20px 50px rgba(3, 4, 8, 0.8);

  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: "Cinzel", "Noto Serif SC", "STKaiti", serif;
  color: var(--text-soft);
  background: var(--deep-abyss);
  isolation: isolate;

  .three-dom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  // ===== CSS 多层装饰背景 =====
  .bg-decor {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;

    .abyss-grid {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
          0deg,
          transparent 0 1px,
          var(--abyss-grid) 1px 2px
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0 1px,
          var(--abyss-grid) 1px 2px
        );
      mask-image: radial-gradient(
        ellipse at 50% 40%,
        #000 30%,
        transparent 70%
      );
      opacity: 0.5;
      animation: gridPulse 12s ease-in-out infinite;
    }

    .fleur-mandala {
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L110 60 L140 50 L120 76 L150 90 L120 100 L150 110 L120 124 L140 150 L110 140 L100 170 L90 140 L60 150 L80 124 L50 110 L80 100 L50 90 L80 76 L60 50 L90 60 Z' fill='none' stroke='%23d4b87a' stroke-width='1' opacity='0.06'/%3E%3C/svg%3E");
      background-size: 180px 180px;
      opacity: 0.4;
      animation: slowSpin 60s linear infinite;
      mix-blend-mode: overlay;
    }

    .ascension-particles {
      position: absolute;
      inset: 0;
      .particle {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, var(--ice-blue), var(--gold-light));
        filter: blur(3px);
        animation: ascend 8s ease-in-out infinite;
        box-shadow: 0 0 20px var(--ice-blue);
        mix-blend-mode: screen;
        &:nth-child(even) {
          background: radial-gradient(circle, var(--gold), transparent);
          box-shadow: 0 0 25px var(--gold);
        }
        &:nth-child(3n) {
          background: radial-gradient(circle, var(--holy-white), transparent);
          box-shadow: 0 0 22px var(--holy-white);
        }
      }
    }

    .dual-shadows {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 8%;
      .shadow {
        width: 140px;
        height: 280px;
        border-radius: 50% 50% 10% 10%;
        filter: blur(12px);
        &.left {
          background: linear-gradient(
            180deg,
            transparent,
            rgba(160, 212, 255, 0.08)
          );
          transform: rotate(-4deg);
          box-shadow: 0 0 30px rgba(160, 212, 255, 0.15);
        }
        &.right {
          background: linear-gradient(
            180deg,
            transparent,
            rgba(212, 184, 122, 0.06)
          );
          transform: scaleX(-1) rotate(4deg);
          box-shadow: 0 0 30px rgba(212, 184, 122, 0.12);
        }
      }
    }

    .bottom-sweep {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--ice-blue),
        var(--gold),
        transparent
      );
      filter: blur(3px);
      animation: sweep 12s linear infinite;
      opacity: 0.3;
    }

    .scripture-lines {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 38px,
        rgba(255, 255, 255, 0.01) 38px,
        rgba(255, 255, 255, 0.01) 40px
      );
      opacity: 0.4;
    }
  }

  // ===== 居中内容 =====
  .center-wrap {
    position: relative;
    z-index: 6;
    min-height: calc(100vh - 96px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    gap: 3rem;
    text-align: center;

    .hero {
      position: relative;
      .title-crown {
        .crown-left,
        .crown-right {
          position: absolute;
          font-size: 2.5rem;
          color: var(--gold);
          opacity: 0.3;
          filter: drop-shadow(0 0 10px var(--gold));
          animation: crownFloat 4s ease-in-out infinite;
        }
        .crown-left {
          left: -55px;
          top: -10px;
          animation-delay: 0s;
        }
        .crown-right {
          right: -55px;
          top: -10px;
          animation-delay: 2s;
        }
        @media (max-width: 680px) {
          display: none;
        }
      }

      .title {
        margin: 0;
        .title-main {
          font-size: 6rem;
          font-weight: 800;
          font-family: "Cinzel", "Noto Serif SC", serif;
          background: linear-gradient(
            180deg,
            #f2f9ff 0%,
            var(--ice-blue) 35%,
            var(--gold) 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 6px;
          filter: drop-shadow(0 0 25px rgba(160, 212, 255, 0.5))
            drop-shadow(0 0 45px rgba(212, 184, 122, 0.2));
          animation: titleFloat 5s ease-in-out infinite;
        }
        .title-sub {
          display: block;
          font-size: 1rem;
          letter-spacing: 6px;
          color: var(--gold);
          margin-top: 12px;
          font-weight: 400;
          opacity: 0.85;
          text-transform: uppercase;
        }
      }

      .title-badge {
        margin-top: 18px;
        .badge-text {
          display: inline-block;
          padding: 6px 28px;
          font-size: 0.9rem;
          font-family: "Cinzel", serif;
          color: var(--gold);
          border: 1px solid rgba(212, 184, 122, 0.35);
          border-radius: 24px;
          background: rgba(6, 8, 16, 0.5);
          backdrop-filter: blur(6px);
          letter-spacing: 3px;
          box-shadow: 0 0 15px rgba(160, 212, 255, 0.1) inset;
        }
      }

      .title-radiance {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200%;
        height: 200%;
        transform: translate(-50%, -50%);
        background: radial-gradient(
          ellipse,
          rgba(160, 212, 255, 0.08),
          transparent 70%
        );
        filter: blur(80px);
        pointer-events: none;
      }
    }

    .type-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 44px;
      width: 100%;
      max-width: 680px;

      .type-box {
        position: relative;
        background: linear-gradient(
          180deg,
          rgba(10, 14, 24, 0.7),
          rgba(6, 8, 16, 0.4)
        );
        border: 1px solid rgba(160, 212, 255, 0.15);
        padding: 2rem 2.5rem;
        border-radius: 8px;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 50px rgba(3, 4, 8, 0.6),
          0 0 0 1px rgba(212, 184, 122, 0.08) inset,
          0 0 40px rgba(0, 0, 0, 0.5) inset;
        transition: all 0.35s ease;
        width: 100%;
        overflow: hidden;

        &:hover {
          border-color: rgba(212, 184, 122, 0.4);
          box-shadow: 0 24px 60px rgba(3, 4, 8, 0.7),
            0 0 0 1px rgba(212, 184, 122, 0.15) inset,
            0 0 50px rgba(160, 212, 255, 0.08) inset;
          transform: translateY(-4px);
        }

        .type-content {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;

          .typed-prefix,
          .typed-suffix {
            font-size: 1.5rem;
            color: var(--gold);
            opacity: 0.6;
            font-family: "Cinzel", serif;
          }
          .typed {
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1.6;
            letter-spacing: 1px;
            background: linear-gradient(
              90deg,
              var(--holy-white),
              var(--ice-blue),
              var(--gold-light)
            );
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            min-width: 200px;
          }
          .cursor {
            font-size: 1.4rem;
            color: var(--gold);
            animation: blink 0.8s step-end infinite;
            text-shadow: 0 0 10px var(--gold);
          }
        }

        .type-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--ice-blue),
            var(--gold),
            transparent
          );
          opacity: 0.4;
        }

        .type-border-glow {
          position: absolute;
          inset: -1px;
          border-radius: 8px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(160, 212, 255, 0.2),
            rgba(212, 184, 122, 0.15),
            transparent
          );
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        &:hover .type-border-glow {
          opacity: 0.7;
          animation: borderFlow 3s linear infinite;
        }

        .holy-blade-decor {
          position: absolute;
          bottom: 10px;
          right: 15px;
          width: 28px;
          height: 2px;
          background: var(--ice-blue);
          opacity: 0.2;
          transform: rotate(-30deg);
          &::before {
            content: "";
            position: absolute;
            left: 100%;
            top: -3px;
            width: 6px;
            height: 6px;
            background: var(--gold);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--gold);
          }
        }
      }

      .enter-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 1rem 3rem;
        border-radius: 4px;
        font-weight: 600;
        font-size: 1.15rem;
        text-decoration: none;
        color: var(--holy-white);
        background: linear-gradient(
          135deg,
          rgba(10, 14, 24, 0.9),
          rgba(6, 8, 16, 0.9)
        );
        border: 1px solid rgba(160, 212, 255, 0.3);
        box-shadow: 0 10px 28px rgba(3, 4, 8, 0.7),
          0 0 0 1px rgba(212, 184, 122, 0.2) inset;
        cursor: pointer;
        transition: all 0.35s ease;
        overflow: hidden;
        z-index: 6;
        letter-spacing: 4px;
        font-family: "Cinzel", serif;
        backdrop-filter: blur(6px);

        .btn-text {
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .btn-glow {
          position: absolute;
          inset: -4px;
          border-radius: 8px;
          background: radial-gradient(
            ellipse,
            rgba(160, 212, 255, 0.5),
            transparent 70%
          );
          filter: blur(18px);
          opacity: 0;
          transition: opacity 0.35s;
        }

        .btn-ripple {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 30%,
            rgba(160, 212, 255, 0.05) 50%,
            transparent 70%
          );
          animation: shieldSweep 4s linear infinite;
        }

        &:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 184, 122, 0.6);
          box-shadow: 0 18px 40px rgba(3, 4, 8, 0.8),
            0 0 0 1px rgba(212, 184, 122, 0.4) inset,
            0 0 35px rgba(160, 212, 255, 0.15);
          color: var(--ice-blue);

          .btn-glow {
            opacity: 0.9;
          }
        }

        &:active {
          transform: translateY(-2px);
        }
      }
    }
  }

  // ===== 页脚 =====
  .site-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 6;
    border-top: 1px solid rgba(160, 212, 255, 0.1);
    padding: 1rem;
    background: linear-gradient(0deg, rgba(6, 8, 16, 0.8), transparent);
    overflow: hidden;
    margin-top: auto;

    .footer-wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--ice-blue),
        var(--gold),
        transparent
      );
      animation: wave 8s linear infinite;
      filter: blur(1px);
    }

    .footer-inner {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      color: rgba(233, 232, 231, 0.5);
      font-size: 0.8rem;
      font-family: "Cinzel", serif;
      .left {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        backdrop-filter: blur(4px);
        padding: 0 1rem;
      }
      .dot {
        color: var(--gold);
        opacity: 0.4;
      }
    }
  }

  // ===== 关键帧动画 =====
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  @keyframes gridPulse {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.7;
    }
  }
  @keyframes slowSpin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes ascend {
    0% {
      transform: translateY(0) scale(0);
      opacity: 0;
    }
    30% {
      opacity: 0.9;
    }
    100% {
      transform: translateY(-50px) scale(1.2);
      opacity: 0;
    }
  }
  @keyframes sweep {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  @keyframes crownFloat {
    0%,
    100% {
      transform: translateY(0) scale(1);
      opacity: 0.25;
    }
    50% {
      transform: translateY(-5px) scale(1.1);
      opacity: 0.4;
    }
  }
  @keyframes titleFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
  @keyframes borderFlow {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  @keyframes shieldSweep {
    0% {
      transform: translateX(-100%) skewX(-20deg);
    }
    100% {
      transform: translateX(100%) skewX(-20deg);
    }
  }
  @keyframes wave {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  // ===== 响应式 =====
  @media (max-width: 880px) {
    .center-wrap .hero .title .title-main {
      font-size: 3.8rem;
      letter-spacing: 4px;
    }
    .type-box {
      padding: 1.4rem 1.8rem;
    }
    .typed,
    .cursor {
      font-size: 1.2rem;
    }
    .enter-btn {
      padding: 0.8rem 2.2rem;
      font-size: 1rem;
    }
  }
  @media (max-width: 480px) {
    .center-wrap .hero .title .title-main {
      font-size: 2.6rem;
    }
    .typed,
    .cursor {
      font-size: 1rem;
    }
  }
}
</style>
