<!-- 📄 src/App.vue -->
<template>
  <div id="app">
    <!-- ================= 开屏欢迎页 ================= -->
    <transition name="intro-fade" v-if="showIntro">
      <div class="intro-container" @click="skipIntro">
        <!-- 全屏视频背景 -->
        <video
          class="video-background"
          :src="videoSrc"
          autoplay
          muted
          loop
          playsinline
        ></video>

        <!-- 幽蓝光影叠加层（提升清晰度 + 氛围） -->
        <div class="overlay-gradient"></div>

        <!-- 动态粒子装饰 -->
        <div class="particles-layer">
          <span
            v-for="i in 25"
            :key="'p' + i"
            class="particle"
            :style="getParticleStyle(i)"
          ></span>
        </div>

        <!-- 鸢尾花圣纹（旋转暗纹） -->
        <div class="fleur-de-lis-mandala"></div>

        <!-- 双生剪影（左右两侧） -->
        <div class="dual-silhouettes">
          <div class="silhouette left"></div>
          <div class="silhouette right"></div>
        </div>

        <!-- 主要文字区域 -->
        <div class="hero-content">
          <div class="text-wrapper">
            <p class="typewriter">
              <span class="line">{{ displayText }}</span>
              <span class="cursor">|</span>
            </p>
            <p class="sub-caption">卡提希娅 · 电子设定集</p>
          </div>
        </div>

        <!-- 底部引导提示 -->
        <div class="scroll-hint">
          <span class="hint-text">✦ 点击任意处，步入圣典 ✦</span>
        </div>
      </div>
    </transition>

    <!-- ================= 主应用（导航 + 内容） ================= -->
    <div v-else class="app-layout">
      <SideNav />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterView } from "vue-router";
import SideNav from "@/components/SideNav.vue";

// ---- 状态管理 ----
const showIntro = ref(true);
const videoSrc = ref("");
const displayText = ref("");

// ---- 角色语录池 ----
const lines = [
  "风会指引你的前路，一如它曾指引我这持剑的流浪之人。",
  "不必畏惧阴影，我手中的剑，曾斩断过更深的黑暗。",
  "在此刻，我是卡提希娅，也是芙露德莉斯——愿我的剑，能成为守护你的力量。",
  "告别了神座的枷锁，我以自由之姿，欢迎你的到来。",
  "听见风中的回响了吗？那是过往的悲鸣，也是新生的序曲。",
  "愿你的旅程，如绽放的鸢尾，永远追寻光明与自由。",
  "此身虽为鸣式所铸，此心却只遵循自我的意志。",
] as const;

// ---- 打字机逻辑 ----
let typingTimer: number | null = null;
const typingSpeed = 150; // ms per character

function pickRandomLine(): string {
  return lines[Math.floor(Math.random() * lines.length)];
}

function startTyping(text: string) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) {
    displayText.value = text;
    return;
  }

  let index = 0;
  typingTimer = window.setInterval(() => {
    index++;
    displayText.value = text.slice(0, index);
    if (index >= text.length && typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, typingSpeed);
}

// 点击任意处跳过开场
function skipIntro() {
  showIntro.value = false;
}

// ---- 粒子随机参数 ----
function getParticleStyle(id: number) {
  const colors = [
    "#a0d4ff", // 荧蓝
    "#d4b87a", // 鎏金
    "#b0a0d0", // 淡紫
    "#ffffff", // 圣光白
    "#7fd8ff",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = `${2 + Math.random() * 5}px`;
  const x = `${Math.random() * 100}%`;
  const y = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 8}s`;
  const duration = `${6 + Math.random() * 8}s`;

  return {
    "--x": x,
    "--y": y,
    "--size": size,
    "--color": color,
    "--delay": delay,
    "--duration": duration,
  };
}

// ---- 生命周期 ----
onMounted(() => {
  // 根据设备选择视频目录（需按你的实际路径调整）
  const isMobile = window.innerWidth <= 768;
  const folder = isMobile ? "/mp2" : "/mp1";
  const index = Math.floor(Math.random() * 4) + 1;
  videoSrc.value = `${folder}/1 (${index}).mp4`;

  // 9秒后自动进入主页
  setTimeout(() => {
    if (showIntro.value) showIntro.value = false;
  }, 9000);

  // 启动打字机效果（稍延迟）
  const randomLine = pickRandomLine();
  setTimeout(() => {
    startTyping(randomLine);
  }, 400);
});

onBeforeUnmount(() => {
  if (typingTimer) clearInterval(typingTimer);
});
</script>

<style scoped lang="scss">
/* ========== 设计变量 ========== */
$font-display: "Cinzel", "Noto Serif SC", serif;
$font-body: "STKaiti", "KaiTi", serif;
$color-blue: #a0d4ff;
$color-gold: #d4b87a;

/* 引入字体（可放在 index.html 中） */
@import url("https://fonts.googleapis.com/css2?family=Cinzel:ital,wght@0,400;1,700&display=swap");

/* ========== 全局 ========== */
#app {
  position: relative;
  min-height: 100vh;
  animation: cursorAnimation 1s infinite step-start;
}

/* 底部导航布局 */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #02040a; /* 极深底色 */
}

.main-content {
 
  flex: 1;
 
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
    padding-top: 70px;
  }
}

/* ========== 开屏过渡 ========== */
.intro-fade-enter-active,
.intro-fade-leave-active {
  transition: opacity 0.9s ease;
}
.intro-fade-enter-from,
.intro-fade-leave-to {
  opacity: 0;
}

/* ========== 开屏容器（全屏固定） ========== */
.intro-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  background: #030514; /* 视频未加载时的填充色 */
}

/* 视频背景：完全填充，无模糊，保留清晰细节 */
.video-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  z-index: 0;
  pointer-events: none;
  /* 不添加模糊或过度滤镜，确保清晰 */
}

/* 幽蓝光影叠加层（提升文字可读性，同时保留视频细节） */
.overlay-gradient {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(
    ellipse at 50% 40%,
    rgba(6, 10, 22, 0.4) 0%,
    rgba(2, 4, 10, 0.85) 100%
  );
  pointer-events: none;
}

/* ========== 装饰层 ========== */
.particles-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--color), 0 0 24px var(--color);
  opacity: 0;
  animation: riseAndShine var(--duration) var(--delay) infinite ease-in-out;
  mix-blend-mode: screen;
}

/* 鸢尾花圣纹（缓慢旋转的暗纹） */
.fleur-de-lis-mandala {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L110 60 L140 50 L120 76 L150 90 L120 100 L150 110 L120 124 L140 150 L110 140 L100 170 L90 140 L60 150 L80 124 L50 110 L80 100 L50 90 L80 76 L60 50 L90 60 Z' fill='none' stroke='%23d4b87a' stroke-width='1' opacity='0.08'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
  opacity: 0.5;
  animation: slowSpin 80s linear infinite;
  pointer-events: none;
}

/* 双生剪影（左右两侧） */
.dual-silhouettes {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  z-index: 2;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 8%;

  .silhouette {
    width: 130px;
    height: 260px;
    border-radius: 50% 50% 10% 10%;
    position: relative;

    &::before,
    &::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      background: inherit;
      opacity: 0.4;
    }

    &::before {
      width: 60px;
      height: 60px;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
    }

    &.left {
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(160, 212, 255, 0.12) 100%
      );
      filter: blur(12px) drop-shadow(0 0 30px rgba(160, 212, 255, 0.2));
      transform: rotate(-3deg);
    }

    &.right {
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(212, 184, 122, 0.1) 100%
      );
      filter: blur(12px) drop-shadow(0 0 30px rgba(212, 184, 122, 0.15));
      transform: scaleX(-1) rotate(3deg);
    }
  }
}

/* ========== 文字区域 ========== */
.hero-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
  text-align: center;
  padding: 0 20px;
}

.text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.typewriter {
  font-family: $font-display;
  font-weight: 700;
  font-style: italic;
  font-size: clamp(28px, 6vw, 50px);
  line-height: 1.3;
  margin: 0;
  background: linear-gradient(
    180deg,
    #f2f9ff 0%,
    $color-blue 35%,
    $color-gold 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 25px rgba(160, 212, 255, 0.6))
    drop-shadow(0 0 50px rgba(212, 184, 122, 0.2));
  letter-spacing: 0.02em;
}

.cursor {
  display: inline-block;
  color: $color-gold;
  -webkit-text-fill-color: $color-gold;
  background: none;
  filter: none;
  font-weight: 300;
  margin-left: 4px;
  animation: blink 1s step-end infinite;
}

.sub-caption {
  font-family: $font-display;
  font-size: 1.1rem;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: rgba(212, 184, 122, 0.8);
  margin: 0;
  filter: drop-shadow(0 0 8px rgba(160, 212, 255, 0.3));
}

/* ========== 底部提示 ========== */
.scroll-hint {
  position: absolute;
  bottom: 30px;
  z-index: 10;
  pointer-events: none;
}

.hint-text {
  font-family: $font-display;
  font-size: 0.9rem;
  color: rgba(212, 184, 122, 0.7);
  letter-spacing: 3px;
  animation: breathe 2.2s ease-in-out infinite;
}

/* ========== 移动端适配 ========== */
@media (max-width: 768px) {
  .dual-silhouettes {
    padding: 0 5%;
    .silhouette {
      width: 90px;
      height: 180px;
    }
  }

  .typewriter {
    font-size: clamp(22px, 7vw, 34px);
  }
}

/* ========== 动画关键帧 ========== */
@keyframes riseAndShine {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-60px) scale(1.4);
    opacity: 0;
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

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 0.5;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px);
  }
}
</style>
