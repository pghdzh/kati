<!-- 📄 src/components/SideNav.vue -->
<template>
  <!--
    侧边导航 - 荧蓝深海 × 鎏金圣典
    展现卡提希娅 (Cartethyia) 光明与黑暗交织的命运
    统一使用折叠按钮，桌面/移动端行为一致
  -->
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 动态装饰背景层（折叠时 opacity 隐藏，防止内容溢出） -->
    <div class="sidebar-bg-decor" :style="{ opacity: isCollapsed ? 0 : 1 }">
      <!-- 粒子光尘 -->
      <div class="particles-layer">
        <span
          v-for="i in 16"
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        ></span>
      </div>
      <!-- 流动海浪波纹 -->
      <div class="wave-decor"></div>
      <!-- 双生瞬影 - 随机选取的两张竖图，更清晰更大 -->
      <div class="pixel-art-shadow">
        <img :src="randomImages[0]" alt="流浪骑士剪影" class="silhouette-img" />
        <img
          :src="randomImages[1]"
          alt="圣女剪影"
          class="silhouette-img second"
        />
      </div>
      <!-- 鸢尾花纹章暗纹 -->
      <div class="fleur-de-lis-pattern"></div>
    </div>

    <!-- 导航主体内容（折叠时隐藏交互） -->
    <div
      class="sidebar-inner"
      :style="{
        opacity: isCollapsed ? 0 : 1,
        pointerEvents: isCollapsed ? 'none' : 'auto',
      }"
    >
      <!-- 品牌标题区 -->
      <RouterLink to="/" class="site-brand" @click="isCollapsed = false">
        <h1 class="site-title">
          <span
            class="char"
            v-for="(char, index) in '卡提希婭'"
            :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }"
            >{{ char }}</span
          >
        </h1>
        <p class="site-subtitle">电子设定集</p>
        <div class="title-decor-line"></div>
      </RouterLink>

      <!-- 在线人数铭牌 -->
      <div class="online-badge" v-if="onlineCount !== null">
        <span class="badge-icon">⚔️</span>
        <span class="badge-text"
          >同行骑士：<strong>{{ onlineCount }}</strong> 人</span
        >
      </div>

      <!-- 导航菜单列表（纯文字） -->
      <nav class="nav-menu">
        <ul>
          <li v-for="item in navItems" :key="item.path">
            <RouterLink
              :to="item.path"
              class="nav-link"
              active-class="active-link"
              @click="isCollapsed = false"
            >
              <span class="link-text">{{ item.name }}</span>
              <span class="link-hover-effect"></span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- 底部区域（美化后） -->
      <div class="sidebar-footer">
        <div class="footer-decor">❖</div>
        <a
          href="https://slty.site/#/redirector"
          target="_blank"
          rel="noopener"
          class="external-link"
          @click="isCollapsed = false"
        >
          <span class="external-link-text">霜落映界</span>
          <span class="external-link-icon">↗</span>
        </a>
        <div class="footer-divider"></div>
        <blockquote class="character-quote">
          “风会指引你的前路，一如它曾指引我这持剑的流浪之人。”
        </blockquote>
      </div>
    </div>
  </aside>
  <!-- 统一的折叠按钮（独立于侧边栏，始终可见） -->
  <button
    class="collapse-toggle"
    :class="{ collapsed: isCollapsed }"
    @click="toggleCollapse"
    :aria-label="isCollapsed ? '展开导航' : '收起导航'"
    :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
  >
    <span class="arrow-icon">{{ isCollapsed ? "»" : "«" }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";

// ==================== 导航项 ====================
const navItems = [
  { name: "风旅之始", path: "/" },
  { name: "时痕刻印", path: "/timeLine" },
  { name: "剑心低语", path: "/message" },
  { name: "双生瞬影", path: "/gallery" },
  { name: "AI对话", path: "/talk" },
  { name: "圣典残章", path: "/resources" },
  { name: "鸢尾韵律", path: "/music" },
  { name: "文本分享", path: "/wiki" },
];

// ==================== 折叠控制（统一桌面/移动端） ====================
const isMobile = ref(window.innerWidth <= 768);
const isCollapsed = ref(isMobile.value); // 移动端默认折叠

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}

// 监听窗口大小变化，调整初始折叠状态
window.addEventListener("resize", () => {
  const mobile = window.innerWidth <= 768;
  if (mobile !== isMobile.value) {
    isMobile.value = mobile;
    // 切换时自动折叠（移动端）或展开（桌面端）
    isCollapsed.value = mobile;
  }
});

// ==================== 随机双生剪影 ====================
// 获取 @/assets/images2 下所有图片
const modules2 = import.meta.glob("@/assets/images2/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const allSrcs2: string[] = Object.values(modules2).map(
  (mod: any) => mod.default
);

// 随机选取两张不重复的图片
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const shuffled = shuffle(allSrcs2);
const randomImages = ref<string[]>([shuffled[0], shuffled[1]]);

// ==================== 粒子随机样式 ====================
function getParticleStyle(index: number) {
  const colors = [
    "#a0d4ff",
    "#d4b87a",
    "#b0a0d0",
    "#ffffff",
    "#7fd8ff",
    "#f7d794",
  ];
  return {
    "--random-x": `${Math.random() * 100}%`,
    "--random-delay": `${Math.random() * 5}s`,
    "--random-duration": `${5 + Math.random() * 5}s`,
    "--random-size": `${2 + Math.random() * 4}px`,
    "--random-color": colors[Math.floor(Math.random() * colors.length)],
  };
}

// ==================== 在线人数 ====================
const siteId = "kati";
const onlineCount = ref<number | null>(null);
const socket: any = io(import.meta.env.VITE_API_BASE_URL, {
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
/* === 设计变量 === */
$sidebar-width: 280px;
$color-primary-blue: #a0d4ff;
$color-gold: #d4b87a;
$color-text-light: #f0f5fc;
$font-display: "Cinzel", "Noto Serif SC", serif;
$font-body: "STKaiti", "KaiTi", serif;
$transition-smooth: 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);

@import url("https://fonts.googleapis.com/css2?family=Cinzel:ital,wght@0,400;1,700&family=ZCOOL+QingKe+HuangYou&display=swap");

/* === 侧边栏容器 === */
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: $sidebar-width;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(10, 20, 40, 0.95) 0%,
    rgba(6, 8, 16, 0.98) 100%
  );
  backdrop-filter: blur(16px) saturate(1.3);
  box-shadow: 8px 0 40px rgba(0, 0, 0, 0.8),
    inset -1px 0 0 rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(180, 220, 255, 0.08);
  overflow: hidden;
  transition: transform $transition-smooth, box-shadow $transition-smooth,
    border-color $transition-smooth;
  font-family: $font-body;
  color: $color-text-light;
  transform: translateX(0);

  &.collapsed {
    transform: translateX(-100%); /* 完全隐藏，包括阴影和边框 */
    box-shadow: none;
    border-right-color: transparent;
  }

  /* 内容区与背景层统一透明度过渡 */
  .sidebar-bg-decor {
    transition: opacity $transition-smooth;
  }

  .sidebar-inner {
    transition: opacity $transition-smooth, pointer-events $transition-smooth;
  }
}

/* === 动态背景装饰层 === */
.sidebar-bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  /* 粒子层 */
  .particles-layer {
    position: absolute;
    inset: 0;
    .particle {
      position: absolute;
      bottom: var(--random-x);
      left: var(--random-x);
      width: var(--random-size);
      height: var(--random-size);
      background: var(--random-color);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--random-color), 0 0 24px var(--random-color);
      opacity: 0;
      animation: floatUp var(--random-duration) var(--random-delay) infinite
        linear;
      mix-blend-mode: screen;
    }
  }

  /* 海浪波纹 */
  .wave-decor {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.08' fill='%23a0d4ff'/%3E%3C/svg%3E")
      repeat-x;
    background-size: 700px 120px;
    animation: waveMove 22s linear infinite;
    filter: drop-shadow(0 -5px 15px rgba(160, 212, 255, 0.15));
  }

  /* 双生瞬影 - 放大并减少模糊，更清晰 */
  .pixel-art-shadow {
    position: absolute;
    bottom: 130px;
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
    height: 320px;
    opacity: 0.5;
    filter: blur(1px) drop-shadow(0 0 25px rgba(160, 212, 255, 0.4));
    display: flex;
    justify-content: center;
    gap: 24px;
    transition: opacity 0.3s;

    .silhouette-img {
      width: 100px; /* 更大更清晰 */
      height: auto;
      object-fit: contain;
      border-radius: 2px;
      &.second {
        transform: scaleX(-1);
        opacity: 0.85;
        filter: drop-shadow(0 0 15px rgba(212, 184, 122, 0.6));
      }
    }
  }

  /* 鸢尾花纹章暗纹 */
  .fleur-de-lis-pattern {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 15 L55 30 L70 25 L60 38 L75 45 L60 50 L75 55 L60 62 L70 75 L55 70 L50 85 L45 70 L30 75 L40 62 L25 55 L40 50 L25 45 L40 38 L30 25 L45 30 Z' fill='none' stroke='%23d4b87a' stroke-width='0.5' opacity='0.06'/%3E%3C/svg%3E");
    background-size: 60px 60px;
    background-repeat: repeat;
    opacity: 0.5;
    mix-blend-mode: overlay;
  }
}

/* === 内部滚动区域 === */
.sidebar-inner {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 16px 24px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(160, 212, 255, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(160, 212, 255, 0.2);
    border-radius: 2px;
  }

  /* 品牌标题 */
  .site-brand {
    text-decoration: none;
    text-align: center;
    margin-bottom: 28px;
    display: block;

    .site-title {
      font-family: $font-display;
      font-style: italic;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
      display: flex;
      justify-content: center;
      gap: 2px;

      .char {
        display: inline-block;
        background: linear-gradient(
          180deg,
          #b6e2ff 0%,
          $color-primary-blue 40%,
          $color-gold 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 4px 15px rgba(5, 8, 12, 0.5);
        filter: drop-shadow(0 0 8px rgba(160, 212, 255, 0.4));
        animation: titleFloat 3.2s ease-in-out infinite;
      }
    }

    .site-subtitle {
      font-size: 0.85rem;
      color: $color-gold;
      letter-spacing: 5px;
      margin-top: 2px;
      text-transform: uppercase;
      opacity: 0.85;
    }

    .title-decor-line {
      width: 60%;
      height: 1px;
      margin: 14px auto 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(160, 212, 255, 0.6),
        transparent
      );
    }
  }

  /* 在线人数铭牌 */
  .online-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 18px;
    margin: 0 12px 28px;
    background: rgba(6, 8, 16, 0.5);
    border: 1px solid rgba(180, 220, 255, 0.1);
    border-radius: 24px;
    backdrop-filter: blur(8px);
    font-size: 0.9rem;
    transition: all 0.3s;

    &:hover {
      border-color: rgba(212, 184, 122, 0.3);
      box-shadow: 0 0 18px rgba(160, 212, 255, 0.15);
    }

    .badge-icon {
      font-size: 1.2rem;
      filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
    }

    strong {
      font-weight: 700;
      color: $color-primary-blue;
      text-shadow: 0 0 10px rgba(160, 212, 255, 0.4);
    }
  }

  /* 导航菜单 */
  .nav-menu {
    flex: 1;
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      color: rgba(240, 245, 252, 0.8);
      font-weight: 500;
      font-size: 1.05rem;
      transition: all 0.3s;
      position: relative;
      border: 1px solid transparent;

      .link-text {
        z-index: 2;
        letter-spacing: 0.5px;
        margin-left: 8px;
      }

      .link-hover-effect {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(160, 212, 255, 0.06),
          rgba(212, 184, 122, 0.1)
        );
        opacity: 0;
        transition: opacity 0.3s;
        border-radius: 8px;
        z-index: 0;
      }

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background: linear-gradient(
          180deg,
          transparent,
          $color-gold,
          transparent
        );
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 3;
        border-radius: 0 3px 3px 0;
      }

      &:hover {
        color: #fff;
        border-color: rgba(160, 212, 255, 0.2);
        transform: translateX(6px);
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
        background: rgba(10, 15, 30, 0.4);

        .link-hover-effect {
          opacity: 1;
        }
        &::before {
          opacity: 1;
        }
      }

      &.active-link {
        background: linear-gradient(
          135deg,
          rgba(212, 184, 122, 0.18),
          rgba(160, 212, 255, 0.12)
        );
        border-color: rgba(212, 184, 122, 0.5);
        color: #fff;
        font-weight: 600;
        box-shadow: 0 0 20px rgba(212, 184, 122, 0.15);
        border-left: 3px solid $color-gold;
        padding-left: 17px;

        .link-text {
          text-shadow: 0 0 12px rgba(160, 212, 255, 0.2);
        }

        &::after {
          content: "⚜️";
          position: absolute;
          right: 16px;
          font-size: 0.75rem;
          opacity: 0.9;
          animation: holyGlow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 6px $color-gold);
        }
      }
    }
  }

  /* 底部区域 (美化) */
  .sidebar-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);

    .footer-decor {
      text-align: center;
      color: rgba(212, 184, 122, 0.4);
      font-size: 1.3rem;
      margin-bottom: 14px;
    }

    .external-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      text-decoration: none;
      color: rgba(240, 245, 252, 0.8);
      border-radius: 8px;
      transition: all 0.3s;
      border: 1px solid transparent;
      font-weight: 500;

      .external-link-icon {
        font-size: 0.9rem;
        opacity: 0.6;
        transition: opacity 0.3s;
      }

      &:hover {
        color: #fff;
        background: rgba(10, 15, 30, 0.5);
        border-color: rgba(160, 212, 255, 0.25);
        box-shadow: 0 0 18px rgba(160, 212, 255, 0.08);
        .external-link-icon {
          opacity: 1;
        }
      }
    }

    .footer-divider {
      width: 40%;
      height: 1px;
      margin: 16px auto;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(212, 184, 122, 0.3),
        transparent
      );
    }

    .character-quote {
      font-family: $font-display;
      font-style: italic;
      font-size: 0.82rem;
      color: rgba(240, 245, 252, 0.45);
      text-align: center;
      line-height: 1.6;
      padding: 0 8px;
      transition: color 0.3s;
      &:hover {
        color: rgba(212, 184, 122, 0.75);
      }
    }
  }
}

/* === 折叠按钮（固定定位，始终可见） === */
.collapse-toggle {
  position: fixed;
  top: 50%;
  left: $sidebar-width;
  transform: translateY(-50%) rotate(0);
  width: 36px;
  height: 70px;
  background: rgba(6, 8, 16, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(180, 220, 255, 0.25);
  border-left: none;
  border-radius: 0 12px 12px 0;
  cursor: pointer;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left $transition-smooth, box-shadow 0.3s, border-color 0.3s;
  box-shadow: 4px 0 18px rgba(0, 0, 0, 0.6);
  padding: 0;

  &:hover {
    background: rgba(20, 25, 45, 0.95);
    border-color: rgba(212, 184, 122, 0.6);
    box-shadow: 4px 0 24px rgba(160, 212, 255, 0.2);
  }

  &.collapsed {
    left: 0; /* 折叠后按钮移到最左边 */
  }

  .arrow-icon {
    font-size: 1.4rem;
    color: rgba(240, 245, 252, 0.9);
    text-shadow: 0 0 10px rgba(160, 212, 255, 0.6);
    transition: transform 0.3s;
  }
}

/* === 移动端适配 === */
@media (max-width: 768px) {
  .app-sidebar {
    width: 280px; /* 保持固定宽度 */
    transform: translateX(
      -100%
    ); /* 默认隐藏由折叠类控制，但初始为折叠所以隐藏 */

    &.collapsed {
      transform: translateX(-100%);
    }

    &:not(.collapsed) {
      transform: translateX(0);
    }
  }
}

/* === 动画关键帧 === */
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  30% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-100vh) scale(1.6);
    opacity: 0;
  }
}

@keyframes waveMove {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: 700px;
  }
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes holyGlow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>
