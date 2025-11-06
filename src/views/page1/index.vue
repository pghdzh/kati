<template>
  <main class="home">
    <canvas ref="canvasEl" class="rose-canvas" aria-hidden="true"></canvas>

    <!-- 背景轮播（两组用于桌面/移动不同裁切） -->
    <div class="carousel carousel1" aria-hidden="true">
      <img
        v-for="(src, idx) in randomFive"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>
    <div class="carousel carousel2" aria-hidden="true">
      <img
        v-for="(src, idx) in randomFive2"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>

    <section class="center" role="main">
      <h1 class="title">风与剑的流浪诗 · 卡提希娅</h1>

      <div class="subtitle" aria-live="polite">
        <span class="typed">{{ typed }}</span
        ><span class="cursor" aria-hidden="true"></span>
      </div>
    </section>

    <footer
      class="shore-footer-simple"
      role="contentinfo"
      aria-label="页面页脚"
    >
      <div class="inner container">
        <div class="center">
          <div class="slogan">愿风指引你的旅程，愿鸢尾在你途经之路绽放。</div>
          <div class="meta">
            © <span>{{ year }}</span> 卡提希娅电子设定集 · 制作：霜落天亦
          </div>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import violet from "@/assets/violet.png"; // 若希望更贴合风格，可替换为“贝壳/羽毛/萤光点”贴图
const year = new Date().getFullYear();
const canvasEl = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D;
let animationId = 0;
let lastTime = 0;
let elapsed = 0;

interface Rose {
  baseX: number;
  y: number;
  size: number;
  speed: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  angle: number;
  angularSpeed: number;
}

const roses: Rose[] = [];
const ROSE_COUNT_DESKTOP = 18;
const ROSE_COUNT_MOBILE = 6;
const ROSE_IMG = new Image();
ROSE_IMG.src = violet;

function initRoses(count: number) {
  roses.length = 0;
  const canvas = canvasEl.value!;
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);

  for (let i = 0; i < count; i++) {
    const baseX = Math.random() * w;
    roses.push({
      baseX,
      y: Math.random() * -h,
      size: 28 + Math.random() * 48, // 稍微精简尺寸
      speed: 12 + Math.random() * 36, // 速度更缓
      swayAmp: 12 + Math.random() * 26,
      swayFreq: 0.15 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 1.2,
    });
  }
  elapsed = 0;
}

let resizeTimeout: number;
function resizeCanvas() {
  window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    cancelAnimationFrame(animationId);
    const canvas = canvasEl.value!;
    const parent = canvas.parentElement!;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = Math.max(parent.clientHeight, 420); // 给个最小高度，避免太窄时粒子不明显

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const isMobile = w < 768;
    initRoses(isMobile ? ROSE_COUNT_MOBILE : ROSE_COUNT_DESKTOP);
    lastTime = 0;
    animationId = requestAnimationFrame(tickCanvas);
  }, 160);
}

function tickCanvas(now: number) {
  if (!lastTime) lastTime = now;
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  elapsed += dt;

  const canvas = canvasEl.value!;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.clearRect(0, 0, w, h);

  // 轻微整体雾层，增强深度（透明度低，避免影响可读性）
  ctx.fillStyle = "rgba(2,8,14,0.08)";
  ctx.fillRect(0, 0, w, h);

  roses.forEach((r) => {
    r.y += r.speed * dt;
    const sway = r.swayAmp * Math.sin(r.phase + elapsed * r.swayFreq);
    const x = r.baseX + sway;
    r.angle += r.angularSpeed * dt;

    if (r.y > h + r.size) {
      r.y = -r.size * 0.6;
      r.baseX = Math.random() * w;
      r.phase = Math.random() * Math.PI * 2;
    }

    if (x > w + r.size || x < -r.size) return;

    // 计算透明度：越远看上去越淡
    const alpha = Math.max(0, Math.min(1, 1 - (r.y / h) * 0.6));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, r.y);
    ctx.rotate(r.angle);

    if (ROSE_IMG && ROSE_IMG.complete && ROSE_IMG.naturalWidth > 0) {
      // 使用图片绘制，但加上一层冷色调叠加（globalCompositeOperation 简单处理）
      ctx.drawImage(ROSE_IMG, -r.size / 2, -r.size / 2, r.size, r.size);

      // 轻微冷光叠加，提升风格一致性
      ctx.globalCompositeOperation = "lighter";
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r.size);
      grad.addColorStop(0, `rgba(79,233,223,${0.08 * alpha})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(-r.size / 2, -r.size / 2, r.size, r.size);
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.restore();
  });

  animationId = requestAnimationFrame(tickCanvas);
}

// ========== 打字机文案 ==========
// 适合长离风格的副标题（偏长句，已为打字器准备）
const lines = [
  "风中的骑士，追寻着自由的鸢尾花",
  "以剑为誓，守护每一寸光明",
  "从圣座到旷野，我的道路由我定义",
  "双生之姿，既是约束也是力量",
  "听，风中有过往的低语，也有未来的回响",
  "此身为鸣式所铸，此心却向往苍穹",
  "不必为我祈祷，我早已告别神坛",
  "在流浪中找寻答案，在战斗中守护真实",
  "每一道剑光，都是我对世界的回应",
  "鸢尾不只为神坛绽放，也为自由盛放",
  "背负过往，却从不被过去束缚",
  "我的剑，为斩断枷锁而挥动",
  "在风止之处，见证我的完全形态",
  "从卡提希娅到芙露德莉斯，都是真实的我",
];

const typed = ref("");
let lineIndex = 0;
let charIndex = 0;
let deleting = false;
let timer: number | null = null;

const TYPING = 120;
const DELETING = 40;
const PAUSE = 1200;

function tick() {
  const cur = lines[lineIndex];
  if (!deleting) {
    typed.value = cur.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex >= cur.length) {
      timer = window.setTimeout(() => {
        deleting = true;
        tick();
      }, PAUSE);
      return;
    }
    timer = window.setTimeout(tick, TYPING);
  } else {
    typed.value = cur.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex <= 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      timer = window.setTimeout(tick, 360);
      return;
    }
    timer = window.setTimeout(tick, DELETING);
  }
}

// ========== 背景图片导入与轮播 ==========
const modules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const allSrcs: string[] = Object.values(modules).map((mod: any) => mod.default);

const modules2 = import.meta.glob("@/assets/images2/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const allSrcs2: string[] = Object.values(modules2).map(
  (mod: any) => mod.default
);

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const randomFive = ref<string[]>(shuffle(allSrcs).slice(0, 5));
const randomFive2 = ref<string[]>(shuffle(allSrcs2).slice(0, 5));

const currentIndex = ref(0);
let Imgtimer: number | undefined;

onMounted(() => {
  timer = window.setTimeout(tick, 420);

  Imgtimer = window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % Math.max(1, randomFive.value.length);
  }, 5200);

  const canvas = canvasEl.value!;
  ctx = canvas.getContext("2d")!;

  // 当图片加载或资源就绪后调整 canvas 大小并启动渲染
  ROSE_IMG.onload = () => {
    resizeCanvas();
  };
  // 如果图片已经加载完（缓存情况），也要触发 init
  if (ROSE_IMG.complete && ROSE_IMG.naturalWidth > 0) {
    resizeCanvas();
  }

  window.addEventListener("resize", resizeCanvas);
});

onBeforeUnmount(() => {
  if (Imgtimer) clearInterval(Imgtimer);
  if (timer) window.clearTimeout(timer);

  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resizeCanvas);
});
</script>

<style lang="scss" scoped>
/* 卡提希娅风格 - 紫蓝海感（水母/幻海）+ 毒药/治疗双面高光 */
$bg-deep: #050714; // 深海夜色底
$deep-2: #071028; // 次深底用于渐变
$accent-1: #7fd8ff; // 暗紫主光（冷雅）
$accent-2: #ffd78a; // 冷海蓝高光（湿光感）
$venom: #8ca6bd; // 毒色点缀（保留少量用于对比）
$heal-glow: #ffd886; // 治愈光晕（低饱和）
$muted-text: #f4f8fb; // 文字
$glass: rgba(95, 224, 255, 0.04);
$bubble: rgba(95, 224, 255, 0.06);

.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: radial-gradient(
      800px 240px at 20% 10%,
      rgba(95, 224, 255, 0.02),
      transparent 8%
    ),
    linear-gradient(180deg, $bg-deep 0%, $deep-2 76%);
  position: relative;
  overflow: hidden;
  color: $muted-text;
  font-family: Inter, "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei",
    sans-serif;

  /* 背景元素：水波纹 + 低透明五线谱（可选） */
  .rose-canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;

    /* 轻微浮动的水纹层（伪元素）*/
    &::before {
      content: "";
      position: absolute;
      inset: -10% -20%;
      background: radial-gradient(
          circle at 30% 10%,
          rgba(111, 92, 230, 0.03),
          transparent 10%
        ),
        radial-gradient(
          circle at 80% 70%,
          rgba(95, 224, 255, 0.02),
          transparent 8%
        );
      animation: slow-drift 18s linear infinite;
      mix-blend-mode: screen;
      pointer-events: none;
    }
  }

  /* 轮播区：图像做淡入 + 加水感滤镜 */
  .carousel {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      /* 细线纹理模拟轻微梦谱/五线（非常低透明） */
      background-image: repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.01) 0px,
        rgba(255, 255, 255, 0.01) 1px,
        transparent 1px,
        transparent 18px
      );
      opacity: 0.06;
      mix-blend-mode: overlay;
      z-index: 2;
      transform: translateY(-4%);
      animation: staff-scroll 16s linear infinite;
      pointer-events: none;
    }

    .carousel-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 900ms ease, transform 10s linear;
      filter: blur(0.6px) saturate(0.78) contrast(0.95) brightness(0.92);
      transform: scale(1.02);

      &.active {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
  .carousel2 {
    display: none;
  }

  .center {
    position: relative;
    z-index: 4;
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
    gap: 10px;

    /* 主标题：紫→海蓝渐变文字 + 水母触须光影伪元素 */
    .title {
      font-size: 4rem;
      font-weight: 800;
      margin: 0;
      line-height: 1;
      background: linear-gradient(90deg, $accent-1 0%, $accent-2 72%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: $muted-text;
      letter-spacing: 0.2px;

      position: relative;

      /* 左下方水母触须影（更梦幻） */
      &::before {
        content: "";
        position: absolute;
        left: -6%;
        bottom: -30%;
        width: 160%;
        height: 140%;
        background: radial-gradient(
            ellipse at 40% 20%,
            rgba($accent-2, 0.04),
            transparent 8%
          ),
          linear-gradient(90deg, transparent, rgba($accent-1, 0.02));
        pointer-events: none;
        mix-blend-mode: screen;
        filter: blur(12px);
        animation: tentacle-sway 10s ease-in-out infinite;
      }
    }

    .subtitle {
      font-size: 1.9rem;
      min-height: 1.6em;
      color: rgba($muted-text, 0.94);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-family: "Dancing Script", "Segoe Script", "Brush Script MT", cursive;
      font-weight: 500;
      letter-spacing: 0.1em; // 增加字母间距增强手写感

      .typed {
        display: inline-block;
        font-weight: 600;
      }

      .cursor {
        width: 12px;
        height: 1.05em;
        margin-left: 6px;
        background: linear-gradient(180deg, $accent-2, $accent-1);
        border-radius: 2px;
        animation: blink 1s steps(1) infinite;
        transform: translateY(2px);
        filter: drop-shadow(0 6px 16px rgba($accent-2, 0.06));
      }
    }

    /* 小范围的治愈光晕（点击/hover 可触发更强光） */
    &.healing {
      &::after {
        content: "";
        position: absolute;
        inset: -6%;
        pointer-events: none;
        background: radial-gradient(
          circle at 50% 50%,
          $heal-glow 0%,
          transparent 40%
        );
        mix-blend-mode: screen;
        opacity: 0.9;
        transition: opacity 360ms ease;
      }
    }
  }

  /* 页脚：深海玻璃 + 细微海蓝边 */
  .shore-footer-simple {
    background: linear-gradient(
      180deg,
      rgba(6, 6, 10, 0.78),
      rgba(8, 6, 12, 0.94)
    );
    border-top: 1px solid rgba($accent-2, 0.03);
    color: $muted-text;
    font-size: 13px;
    position: relative;
    overflow: visible;

    .inner.container {
      width: min(1100px, 94%);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .center {
      text-align: center;
      flex: 1 1 auto;

      .slogan {
        background: linear-gradient(90deg, $accent-1 0%, $accent-2 60%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
        line-height: 1;
        font-size: 14px;
        letter-spacing: 0.3px;
        text-shadow: 0 6px 20px rgba(6, 4, 8, 0.6);
      }

      .meta {
        color: rgba($muted-text, 0.66);
        margin-top: 6px;
        font-size: 12px;
      }
    }
  }
}

/* 单独浮动音符（可插入 .floating-note 在 DOM）*/
.floating-note {
  position: absolute;
  font-size: 14px;
  color: $accent-2;
  opacity: 0.95;
  transform-origin: center;
  animation: note-float 4.8s ease-in-out infinite;
  filter: drop-shadow(0 6px 18px rgba($accent-2, 0.06));
}

/* 关键帧：水波/触须漂动、谱线滚动、气泡上升、音符浮动 */
@keyframes staff-scroll {
  0% {
    transform: translateY(-6%);
    opacity: 0.92;
  }
  50% {
    transform: translateY(6%);
    opacity: 0.98;
  }
  100% {
    transform: translateY(-6%);
    opacity: 0.92;
  }
}

@keyframes note-float {
  0% {
    transform: translateY(0) rotate(-4deg) scale(0.96);
    opacity: 0.86;
  }
  50% {
    transform: translateY(-10px) rotate(2deg) scale(1.02);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(-4deg) scale(0.96);
    opacity: 0.86;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes tentacle-sway {
  0% {
    transform: translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
  }
  100% {
    transform: translateY(0) rotate(-1deg);
  }
}

@keyframes slow-drift {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0.95;
  }
  50% {
    transform: translateX(-8px) translateY(-6px);
    opacity: 1;
  }
  100% {
    transform: translateX(0) translateY(0);
    opacity: 0.95;
  }
}

/* 响应式：移动优先 */
@media (max-width: 720px) {
  .home {
    .carousel {
      display: none;
    }
    .carousel2 {
      display: block;
    }
    .center {
      padding: 18px 14px;
      .title {
        font-size: 2.2rem;
      }
      .subtitle {
        font-size: 1.4rem;
      }
    }
  }
}
</style>
