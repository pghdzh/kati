<template>
  <header class="app-header">
    <h1 class="title">卡提希娅电子设定集</h1>
    <!-- 在线人数展示 -->
    <div class="online-count" v-if="onlineCount !== null">
      当前在线：<span class="count">{{ onlineCount }}人</span>
    </div>
    <!-- 移动端汉堡按钮 -->
    <button
      class="hamburger"
      @click="toggleMobileNav"
      aria-label="Toggle navigation"
    >
      <span :class="{ open: mobileNavOpen }"></span>
      <span :class="{ open: mobileNavOpen }"></span>
      <span :class="{ open: mobileNavOpen }"></span>
    </button>

    <!-- 普通导航 & 移动端下拉导航 -->
    <nav :class="['nav-links', { 'mobile-open': mobileNavOpen }]">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        active-class="active-link"
        @click="mobileNavOpen = false"
      >
        {{ item.name }}
      </RouterLink>

      <a
        href="http://36.150.237.25/#/redirector"
        target="_blank"
        rel="noopener"
        class="nav-item"
        active-class="active-link"
        @click="mobileNavOpen = false"
      >
        霜落映界
      </a>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";

const navItems = [
  { name: "风旅之始", path: "/" }, // 首页 - 象征流浪骑士的旅程开端
  { name: "时痕刻印", path: "/timeLine" }, // 年谱 - 时间留下的痕迹与记忆
  { name: "剑心低语", path: "/message" }, // 留言板 - 如剑般真诚的内心对话
  { name: "双生瞬影", path: "/gallery" }, // 图集 - 体现卡提希娅与芙露德莉斯双形态
  { name: "圣典残章", path: "/resources" }, // 资料库 - 呼应圣女时期的典籍记载
  { name: "风息回响", path: "/voice" }, // 语音馆 - 风中的声音与回响
  { name: "鸢尾韵律", path: "/music" }, // 歌曲库 - 以她追求的鸢尾花为意象
];

const mobileNavOpen = ref(false);
function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}

const siteId = "kati";

const onlineCount = ref<number | null>(null);

// 连接时带上 query.siteId
const socket: any = io("http://36.150.237.25:3000", {
  query: { siteId },
});

onMounted(() => {
  socket.on("onlineCount", (count: number) => {
    onlineCount.value = count;
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Cinzel:ital,wght@0,400;1,700&family=ZCOOL+QingKe+HuangYou&display=swap");

/* 卡提希娅风格：清冷的冰蓝/白 + 少量金色神圣光（兼具飘逸感与温润光泽） */
.app-header {
  /* 主题色变量（按卡提希娅视觉调整） */
  --deep-bg: rgba(6, 8, 16, 0.92); /* 更深的夜色底 */
  --glass-accent: rgba(78, 160, 255, 0.06); /* 冰蓝玻璃感 */
  --accent: #74c7ff; /* 主光：冰蓝 */
  --accent-2: #ffd78a; /* 辅助高光：淡蓝 */
  --gold-accent: #ffd78a; /* 圣光金用于 active / 边饰 */
  --muted-text: #f3f7fb; /* 冷象牙 / 近白 */
  --wet-sheen: rgba(255, 255, 255, 0.04); /* 薄光覆盖 */
  --feather: rgba(180, 230, 255, 0.06); /* 羽毛/飘带微光 */

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: radial-gradient(
      560px 110px at 12% 12%,
      rgba(190, 240, 255, 0.02),
      transparent 12%
    ),
    linear-gradient(180deg, rgba(8, 12, 20, 0.96), rgba(6, 6, 14, 0.98));
  backdrop-filter: blur(6px) saturate(1);
  box-shadow: 0 10px 36px rgba(3, 6, 10, 0.6),
    0 0 20px var(--glass-accent) inset;
  border-bottom: 1px solid rgba(180, 220, 255, 0.03);
  animation: fadeInDown 0.56s ease-out both;
  overflow: visible;

  /* 表面薄薄光感（增强冰冷护甲感） */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100%;
    pointer-events: none;
    background: linear-gradient(180deg, var(--wet-sheen), transparent 24%);
    mix-blend-mode: overlay;
  }

  /* 上层轻盈粒子（羽毛/尘光） */
  &::before {
    content: "";
    position: absolute;
    right: 6%;
    top: 8%;
    width: 220px;
    height: 80px;
    pointer-events: none;
    background: radial-gradient(
        40px 10px at 20% 20%,
        rgba(190, 230, 255, 0.12),
        transparent 35%
      ),
      radial-gradient(
        18px 6px at 80% 70%,
        rgba(255, 215, 138, 0.06),
        transparent 40%
      );
    filter: blur(6px);
    transform: translateY(0) rotate(-6deg);
    animation: feather-drift 8s ease-in-out infinite;
    mix-blend-mode: screen;
  }

  .title {
    position: relative;
    font-family: "Cinzel", serif;
    font-style: italic;
    font-size: 26px;
    font-weight: 700;
    color: var(--muted-text);
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.4px;
    text-shadow: 0 6px 18px rgba(5, 8, 12, 0.55);
    transition: transform 0.28s ease, text-shadow 0.28s ease;
    animation: float-slow 10s ease-in-out infinite;

    /* 文字上方光泽（更清冷、细腻） */
    &::before {
      content: "";
      position: absolute;
      left: -8%;
      top: -22%;
      width: 136%;
      height: 150%;
      background: radial-gradient(
        circle at 50% 18%,
        rgba(255, 255, 255, 0.03),
        transparent 20%
      );
      transform: translateY(0);
      animation: shimmer 6.4s linear infinite;
      pointer-events: none;
      mix-blend-mode: screen;
    }

    /* 在标题旁绘制一个简约的“羽冠”装饰（伪元素，呼应精灵耳/头饰） */
    &::after {
      content: "";
      position: absolute;
      left: -34px;
      top: -8px;
      width: 28px;
      height: 28px;
      background: radial-gradient(
        circle at 40% 30%,
        var(--accent-2),
        transparent 55%
      );
      border-radius: 50%;
      box-shadow: 0 0 18px rgba(115, 200, 255, 0.12),
        0 1px 0 rgba(255, 215, 138, 0.03) inset;
      transform: rotate(-18deg);
      opacity: 0.95;
      pointer-events: none;
    }

    &:hover {
      transform: translateY(-2px) scale(1.03);
      text-shadow: 0 10px 36px rgba(116, 199, 255, 0.12);
    }
  }

  .online-count {
    position: relative;
    margin-left: 16px;
    padding: 6px 14px;
    font-family: "Cinzel Decorative", serif;
    font-size: 1rem;
    color: var(--muted-text);
    background: linear-gradient(
      135deg,
      rgba(10, 12, 18, 0.28),
      rgba(6, 8, 14, 0.2)
    );
    border: 1px solid rgba(180, 220, 255, 0.04);
    border-radius: 24px;
    backdrop-filter: blur(6px);
    box-shadow: 0 6px 18px rgba(4, 6, 10, 0.44),
      0 0 10px rgba(78, 160, 255, 0.02) inset;
    overflow: hidden;
    cursor: default;
    transition: transform 0.22s ease, box-shadow 0.22s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px rgba(3, 4, 6, 0.56),
        0 0 34px rgba(180, 230, 255, 0.06);
    }

    .count {
      display: inline-block;
      margin-left: 18px;
      font-weight: 700;
      color: var(--accent-2);
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 8px rgba(120, 210, 255, 0.06);
    }
  }

  .nav-links {
    display: flex;
    gap: 22px;
    align-items: center;

    .nav-item {
      position: relative;
      color: var(--muted-text);
      font-weight: 500;
      text-decoration: none;
      transition: color 0.22s ease, transform 0.16s ease;
      padding: 6px 4px;
      border-radius: 6px;
      overflow: visible;
      font-family: "STKaiti", "KaiTi", "Noto Serif SC", serif;
      font-style: italic;

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -8px;
        width: 0;
        height: 6px;
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0),
          rgba(116, 199, 255, 0.92),
          rgba(191, 239, 255, 0.9),
          rgba(0, 0, 0, 0)
        );
        transform: translateX(-50%);
        opacity: 0.95;
        filter: blur(0.8px) contrast(1.03);
        transition: width 0.36s cubic-bezier(0.2, 0.9, 0.2, 1), left 0.36s,
          opacity 0.24s;
        background-size: 200% 100%;
        animation: flow-wave 6.8s linear infinite;
      }

      /* 替换“毒液滴”为羽毛光点（更柔和） */
      &::before {
        content: "";
        position: absolute;
        right: 14%;
        top: -8px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--accent-2), transparent 60%);
        opacity: 0;
        transform: translateY(-6px) scale(0.9);
        transition: opacity 0.26s, transform 0.36s;
        box-shadow: 0 6px 14px rgba(120, 210, 255, 0.08);
      }

      &:hover {
        color: var(--accent-2);
        transform: translateY(-1.8px);
        text-shadow: 0 0 8px rgba(120, 210, 255, 0.04);
      }

      &:hover::after {
        width: 72%;
        left: 50%;
        opacity: 1;
      }

      &:hover::before {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .active-link {
      color: var(--accent);
      font-weight: 600;

      /* 活动项用金色微光表示“圣女”感，同时保持冰蓝光晕 */
      &::before {
        content: "✦";
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: var(--gold-accent);
        text-shadow: 0 2px 10px rgba(255, 215, 138, 0.12);
        animation: holy-glow 3.6s ease-in-out infinite;
        opacity: 0.95;
      }

      &::after {
        width: 92%;
        opacity: 1;
        box-shadow: 0 6px 22px rgba(120, 210, 255, 0.06);
      }
    }
  }

  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 28px;
    height: 24px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    span {
      display: block;
      width: 100%;
      height: 3px;
      background: rgba(243, 247, 251, 0.92);
      border-radius: 2px;
      transition: transform 0.28s ease, opacity 0.28s ease, background 0.28s;
      box-shadow: 0 2px 6px rgba(8, 6, 10, 0.18),
        0 0 8px rgba(78, 160, 255, 0.02);
    }

    span.open:nth-child(1) {
      transform: translateY(10px) rotate(45deg);
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
    }

    span.open:nth-child(2) {
      opacity: 0;
    }

    span.open:nth-child(3) {
      transform: translateY(-10px) rotate(-45deg);
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
    }
  }

  @media (max-width: 768px) {
    padding: 0 20px;

    .title {
      display: none;
    }
    .hamburger {
      display: flex;
    }

    .nav-links {
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      flex-direction: column;
      background: linear-gradient(
        180deg,
        rgba(8, 6, 12, 0.98),
        rgba(6, 4, 10, 0.995)
      );
      backdrop-filter: blur(12px);
      gap: 0;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.34s ease;
      border-top: 1px solid rgba(180, 220, 255, 0.03);

      &.mobile-open {
        max-height: 520px;
      }

      .nav-item {
        padding: 14px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      }
    }
  }
}

/* 动效关键帧（调整时长、曲线更柔和） */
@keyframes flow-wave {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float-slow {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes feather-drift {
  0% {
    transform: translateY(0) rotate(-6deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-6px) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(-6deg);
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-6px) rotate(0.5deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
}

@keyframes holy-glow {
  0% {
    transform: translateY(-6%) rotate(-6deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(6%) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-6%) rotate(-6deg);
    opacity: 0.8;
  }
}
</style>
