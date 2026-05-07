<!--
  卡提希娅风格留言板 - 剑心低语（深度美化）
  新增：旋转光冕、上升圣光泡、呼吸剪影、鸢尾光标、水下光效
-->
<template>
  <div class="cartethyia-message-board" aria-live="polite">
    <!-- 背景轮播（保留原有逻辑，覆盖冰蓝滤镜） -->
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

    <!-- 卡提希娅装饰层（深度美化） -->
    <div class="cartethyia-decor">
      <!-- 圣典网格 -->
      <div class="scripture-grid"></div>
      <!-- 旋转鸢尾花暗纹 -->
      <div class="fleur-mandala"></div>
      <!-- 水下光效（新） -->
      <div class="underwater-light"></div>
      <!-- 旋转光冕（新） -->
      <div class="rotating-crown">
        <div class="crown-ring ring1"></div>
        <div class="crown-ring ring2"></div>
        <div class="crown-ring ring3"></div>
      </div>
      <!-- 上升圣光泡（新） -->
      <div class="holy-bubbles">
        <span
          v-for="i in 18"
          :key="'b' + i"
          class="bubble"
          :style="getBubbleStyle(i)"
        ></span>
      </div>
      <!-- 浮游粒子 -->
      <div class="ascension-particles">
        <span
          v-for="i in 20"
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        ></span>
      </div>
      <!-- 双生剪影（呼吸动态） -->
      <div class="dual-shadows">
        <div class="shadow left"></div>
        <div class="shadow right"></div>
      </div>
      <!-- 底部圣光扫掠 -->
      <div class="bottom-sweep"></div>
    </div>

    <!-- 顶部标题区 -->
    <header class="board-header" role="banner">
      <div class="title-wrap">
        <div class="holy-emblem">⚜️</div>
        <h1>剑心低语</h1>
        <span class="title-count">（共{{ totalCount }}条）</span>
        <p class="subtitle">圣典残章 · 诉说真实的心声</p>
      </div>
      <!-- 标题光晕 -->
      <div class="title-glow"></div>
    </header>

    <!-- 留言展示区（带无限滚动哨兵） -->
    <section class="message-list">
      <div class="message-list-inner">
        <transition-group name="msg" tag="div">
          <div
            v-if="loading && messages.length === 0"
            class="skeleton-wrap"
            key="skeleton"
          >
            <div class="skeleton" v-for="i in 3" :key="i">
              <div class="sk-avatar"></div>
              <div class="sk-lines">
                <div class="sk-line short"></div>
                <div class="sk-line"></div>
              </div>
            </div>
          </div>
          <div
            v-for="(msg, idx) in messages"
            :key="msg.id || msg._tempId || idx"
            class="message-card"
            :data-index="idx"
            tabindex="0"
            role="article"
            :aria-label="`留言来自 ${msg.name || '匿名'}，内容：${msg.content}`"
          >
            <div class="message-meta">
              <div class="left-meta">
                <div class="name-avatar" :title="msg.name || '匿名'">
                  {{ getInitial(msg.name) }}
                </div>
                <div class="meta-texts">
                  <div class="message-name">
                    {{ msg.name || "匿名的流浪者" }}
                  </div>
                  <div class="message-time">
                    {{ formatTime(msg.created_at) }}
                  </div>
                </div>
              </div>
            </div>
            <p class="message-content">
              <span class="content-decor-left"></span>
              {{ msg.content }}
            </p>
          </div>
        </transition-group>
        <!-- 无限滚动哨兵 -->
        <div ref="sentinel" class="sentinel"></div>
        <!-- 加载更多提示 -->
        <div v-if="loadingMore" class="loading-more">
          <span class="ice-symbol">❄️</span> 圣典翻页中...
          <span class="ice-symbol">❄️</span>
        </div>
        <div v-if="!hasMore && messages.length > 0" class="end-message">
          —— 已达圣典尽头 · 暂无更多留言 ——
        </div>
      </div>
    </section>

    <!-- 底部发送区 -->
    <section class="message-form" aria-label="留下你的圣典注脚">
      <label class="sr-only" for="mb-name">你的署名</label>
      <input
        id="mb-name"
        v-model="name"
        type="text"
        placeholder="留下你的名讳…"
        @keydown.enter.prevent
      />

      <label class="sr-only" for="mb-content">留言内容</label>
      <textarea
        id="mb-content"
        v-model="content"
        placeholder="在此写下你的圣典注脚…"
        @keydown.ctrl.enter.prevent="submitMessage"
        @input="autoGrow"
        ref="textareaRef"
      />

      <div class="form-row">
        <div class="hint">
          <span class="ice-symbol">⚜️</span>
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
          <span class="ice-symbol">快速发送</span>
        </div>
        <button @click="submitMessage" :disabled="isSending || !content.trim()">
          <span v-if="!isSending">镌刻留言</span>
          <span v-else>镌刻中…</span>
        </button>
      </div>
      <!-- 表单装饰线 -->
      <div class="form-decor-border"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { getMessageList, createMessage } from "@/api/modules/message";

// ========== 分页状态（不变） ==========
const messages = ref<any[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 20;
const hasMore = ref(true);
const loading = ref(true);
const loadingMore = ref(false);
let observer: IntersectionObserver | null = null;

// ========== 表单状态（不变） ==========
const name = ref(localStorage.getItem("message_name") || "");
const content = ref("");
const isSending = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// ========== 无限滚动哨兵 ==========
const sentinel = ref<HTMLElement | null>(null);

// ========== 数据获取（不变） ==========
const loadMessages = async (page: number, append = false) => {
  if (page === 1) loading.value = true;
  else loadingMore.value = true;

  try {
    const res = await getMessageList({ page, pageSize });
    const newData = res.data || [];
    const pagination = res.pagination;

    if (append) {
      messages.value = [...messages.value, ...newData];
    } else {
      messages.value = newData;
    }
    totalCount.value = pagination.total;
    hasMore.value = page < pagination.totalPages;
    currentPage.value = page;

    await nextTick();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 加载下一页（不变）
const loadNextPage = () => {
  if (!hasMore.value || loadingMore.value) return;
  loadMessages(currentPage.value + 1, true);
};

// ========== 提交留言（不变） ==========
const submitMessage = async () => {
  if (!content.value.trim() || isSending.value) return;
  isSending.value = true;
  const payload = { name: name.value || "匿名流浪者", content: content.value };
  try {
    localStorage.setItem("message_name", name.value);
    content.value = "";
    await nextTick();
    await createMessage(payload);
    // 重置分页，重新从第一页加载
    currentPage.value = 1;
    hasMore.value = true;
    await loadMessages(1, false);
    // 滚动到顶部
    const listEl = document.querySelector(".message-list-inner");
    if (listEl) listEl.scrollTop = 0;
  } catch (err) {
    console.error(err);
  } finally {
    isSending.value = false;
  }
};

// ========== 辅助函数（不变） ==========
const formatTime = (time: string) => {
  if (!time) return "";
  const d = new Date(time);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

const getInitial = (n?: string) => {
  if (!n) return "?";
  return n.trim().slice(0, 1).toUpperCase();
};

const autoGrow = (e?: Event) => {
  const ta = textareaRef.value;
  if (!ta) return;
  ta.style.height = "auto";
  const h = Math.min(ta.scrollHeight, 220);
  ta.style.height = h + "px";
};

// ========== 背景轮播（不变） ==========
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

// 粒子装饰（卡提希娅配色，增加数量）
const getParticleStyle = (i: number) => {
  const colors = ["#a0d4ff", "#d4b87a", "#f0f5fc", "#b6e2ff"];
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = 2 + Math.random() * 5;
  const delay = Math.random() * 8;
  const dur = 6 + Math.random() * 8;
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: colors[i % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
  };
};

// 圣光泡样式
const getBubbleStyle = (i: number) => {
  const colors = [
    "rgba(160,212,255,0.4)",
    "rgba(212,184,122,0.3)",
    "rgba(255,255,255,0.2)",
  ];
  const size = 10 + Math.random() * 30;
  const left = Math.random() * 100;
  const delay = Math.random() * 12;
  const dur = 10 + Math.random() * 10;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
    backgroundColor: colors[i % colors.length],
  };
};

// ========== 生命周期 ==========
onMounted(async () => {
  await loadMessages(1, false);

  // 初始化 IntersectionObserver
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loadingMore.value) {
        loadNextPage();
      }
    },
    { threshold: 0.5 }
  );
  if (sentinel.value) observer.observe(sentinel.value);

  Imgtimer = window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % Math.max(1, randomFive.value.length);
  }, 5200);

  nextTick(() => autoGrow());
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  if (Imgtimer) clearInterval(Imgtimer);
});
</script>

<style scoped lang="scss">
/* ======== 卡提希娅 荧蓝深海 × 鎏金圣典 ======== */
$abyss: #050a18;
$deep: #070f24;
$ice: #a0d4ff;
$ice-glow: #b6e2ff;
$gold: #d4b87a;
$gold-light: #e8cd7a;
$holy: #f0f5fc;
$text: #e9e8e7;
$text-dim: rgba(233, 232, 231, 0.7);
$card-bg: rgba(6, 10, 20, 0.55);
$card-border: rgba(160, 212, 255, 0.08);
$shadow: 0 16px 48px rgba(0, 0, 0, 0.7);

.cartethyia-message-board {
  position: relative;
  min-height: 100vh;
  padding-top: 120px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, $abyss 0%, $deep 100%);
  font-family: "Noto Serif SC", "Cinzel", "STKaiti", system-ui, serif;
  color: $text;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;

  /* 背景轮播（叠加冰蓝滤镜） */
  .carousel {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(5, 10, 24, 0.65);
      z-index: 1;
      mix-blend-mode: multiply;
    }
    .carousel-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.5s ease;
      filter: brightness(0.6) saturate(0.7) hue-rotate(10deg);
      &.active {
        opacity: 1;
      }
    }
  }
  .carousel2 {
    display: none;
  }

  /* 卡提希娅装饰层（深度美化） */
  .cartethyia-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }

  .scripture-grid {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        0deg,
        transparent 0 1px,
        rgba(160, 212, 255, 0.015) 1px 2px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0 1px,
        rgba(160, 212, 255, 0.015) 1px 2px
      );
    mask-image: radial-gradient(ellipse at 50% 40%, black 30%, transparent 70%);
    opacity: 0.5;
    animation: gridShift 18s linear infinite;
  }

  .fleur-mandala {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L110 60 L140 50 L120 76 L150 90 L120 100 L150 110 L120 124 L140 150 L110 140 L100 170 L90 140 L60 150 L80 124 L50 110 L80 100 L50 90 L80 76 L60 50 L90 60 Z' fill='none' stroke='%23d4b87a' stroke-width='1' opacity='0.06'/%3E%3C/svg%3E");
    background-size: 180px;
    opacity: 0.3;
    animation: slowSpin 60s linear infinite;
    mix-blend-mode: overlay;
  }

  /* 新增：水下光线波动效果 */
  .underwater-light {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 30% 50%,
      rgba(160, 212, 255, 0.06) 0%,
      transparent 60%
    );
    animation: underwaterShift 8s ease-in-out infinite;
    mix-blend-mode: screen;
    z-index: 2;
  }

  /* 新增：旋转光冕 */
  .rotating-crown {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 600px;
    transform: translate(-50%, -50%);
    z-index: 1;
    .crown-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid transparent;
      animation: crownRotate 20s linear infinite;
      &.ring1 {
        width: 100%;
        height: 100%;
        border-top-color: rgba($ice, 0.1);
        border-right-color: rgba($ice, 0.05);
      }
      &.ring2 {
        width: 80%;
        height: 80%;
        top: 10%;
        left: 10%;
        border-bottom-color: rgba($gold, 0.08);
        border-left-color: rgba($gold, 0.04);
        animation-duration: 25s;
        animation-direction: reverse;
      }
      &.ring3 {
        width: 60%;
        height: 60%;
        top: 20%;
        left: 20%;
        border-top-color: rgba(#fff, 0.04);
        border-bottom-color: rgba($ice, 0.06);
        animation-duration: 30s;
      }
    }
  }

  /* 新增：上升圣光泡 */
  .holy-bubbles {
    position: absolute;
    inset: 0;
    z-index: 2;
    .bubble {
      position: absolute;
      bottom: -20px;
      border-radius: 50%;
      box-shadow: 0 0 15px currentColor;
      animation: riseBubble 12s infinite ease-in;
      mix-blend-mode: screen;
      opacity: 0;
    }
  }

  .ascension-particles {
    position: absolute;
    inset: 0;
    z-index: 3;
    .particle {
      position: absolute;
      border-radius: 50%;
      box-shadow: 0 0 12px currentColor;
      animation: floatUp 8s infinite ease-in-out;
      mix-blend-mode: screen;
      opacity: 0;
      &:nth-child(even) {
        background: radial-gradient(circle, $gold, transparent);
      }
      &:nth-child(3n) {
        background: radial-gradient(circle, $holy, transparent);
      }
    }
  }

  .dual-shadows {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 8%;
    z-index: 1;
    .shadow {
      width: 130px;
      height: 240px;
      border-radius: 50% 50% 10% 10%;
      filter: blur(12px);
      animation: shadowBreathe 6s ease-in-out infinite;
      &.left {
        background: linear-gradient(
          180deg,
          transparent,
          rgba(160, 212, 255, 0.06)
        );
        transform: rotate(-4deg);
        box-shadow: 0 0 20px rgba(160, 212, 255, 0.1);
        animation-delay: 0s;
      }
      &.right {
        background: linear-gradient(
          180deg,
          transparent,
          rgba(212, 184, 122, 0.04)
        );
        transform: scaleX(-1) rotate(4deg);
        box-shadow: 0 0 20px rgba(212, 184, 122, 0.08);
        animation-delay: 1.5s;
      }
    }
  }

  .bottom-sweep {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, $ice, $gold, transparent);
    filter: blur(2px);
    animation: sweep 12s linear infinite;
    opacity: 0.25;
    z-index: 2;
  }

  /* 顶部标题区 */
  .board-header {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 960px;
    padding: 14px 28px;
    border-radius: 40px;
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.5),
      rgba(8, 14, 28, 0.65)
    );
    backdrop-filter: blur(12px);
    border: 1px solid $card-border;
    box-shadow: 0 12px 28px $shadow, inset 0 1px 0 rgba(160, 212, 255, 0.05);
    z-index: 6;
    overflow: visible;

    .title-glow {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 100%;
      background: radial-gradient(
        ellipse at center,
        rgba(160, 212, 255, 0.15),
        transparent 70%
      );
      filter: blur(30px);
      animation: titleGlowPulse 4s ease-in-out infinite;
      pointer-events: none;
    }

    .title-wrap {
      display: flex;
      align-items: baseline;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      position: relative;
      z-index: 2;

      .holy-emblem {
        font-size: 28px;
        filter: drop-shadow(0 0 8px $gold);
        animation: emblemPulse 3s ease-in-out infinite;
      }
      h1 {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 700;
        background: linear-gradient(180deg, $holy, $ice, $gold);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 3px;
      }
      .title-count {
        font-size: 0.85rem;
        color: rgba($text, 0.7);
        font-weight: 500;
      }
      .subtitle {
        margin: 0;
        margin-left: auto;
        font-size: 0.85rem;
        color: $gold-light;
        font-style: italic;
        letter-spacing: 1px;
      }
    }
  }

  /* 留言列表区 */
  .message-list {
    position: relative;
    z-index: 2;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    margin-top: 18px;
    max-height: 60vh;
    .message-list-inner {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .skeleton-wrap {
      display: flex;
      flex-direction: column;
      gap: 16px;
      .skeleton {
        display: flex;
        gap: 14px;
        align-items: center;
        padding: 14px;
        background: $card-bg;
        border-radius: 20px;
        border: 1px solid $card-border;
      }
      .sk-avatar {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, $ice, $gold);
      }
      .sk-lines {
        flex: 1;
        .sk-line {
          height: 12px;
          border-radius: 6px;
          background: rgba(160, 212, 255, 0.08);
          margin-bottom: 8px;
          &.short {
            width: 40%;
          }
        }
      }
    }

    .message-card {
      background: linear-gradient(
        135deg,
        rgba(6, 10, 20, 0.45),
        rgba(8, 14, 28, 0.5)
      );
      backdrop-filter: blur(8px);
      border-radius: 24px;
      padding: 18px 20px;
      margin: 20px 0;
      border: 1px solid $card-border;
      transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1);
      box-shadow: 0 8px 20px $shadow;
      position: relative;
      overflow: hidden;

      /* 卡片内部光扫效果 */
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(160, 212, 255, 0.03),
          transparent
        );
        transition: left 0.6s ease;
        z-index: 1;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-4px);
        border-color: $gold;
        box-shadow: 0 12px 28px rgba(160, 212, 255, 0.2);
        &::before {
          left: 100%;
        }
      }

      .message-meta {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        .left-meta {
          display: flex;
          gap: 14px;
          align-items: center;
          .name-avatar {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: linear-gradient(135deg, $ice, $gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.2rem;
            color: $abyss;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
            box-shadow: inset 0 -2px 6px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s;
          }
          .meta-texts {
            .message-name {
              font-size: 1rem;
              font-weight: 700;
              color: $ice;
              letter-spacing: 0.5px;
            }
            .message-time {
              font-size: 0.7rem;
              color: rgba($text, 0.55);
              margin-top: 2px;
            }
          }
        }
      }

      .message-content {
        font-size: 0.95rem;
        line-height: 1.7;
        color: $text;
        white-space: pre-wrap;
        word-break: break-word;
        margin: 0;
        border-left: 3px solid $ice;
        padding-left: 16px;
        position: relative;
        z-index: 2;

        .content-decor-left {
          display: none; /* 可替换为自定义图标 */
        }
      }
    }

    .sentinel {
      height: 20px;
      width: 100%;
      margin: 10px 0;
    }

    .loading-more,
    .end-message {
      text-align: center;
      padding: 20px;
      color: rgba($text, 0.6);
      font-size: 0.85rem;
      letter-spacing: 1px;
      .ice-symbol {
        color: $ice;
        margin: 0 8px;
      }
    }
    .end-message {
      padding: 10px;
      font-style: italic;
      color: $gold;
    }
  }

  /* 底部表单 */
  .message-form {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    width: calc(100% - 32px);
    max-width: 960px;
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.52),
      rgba(8, 14, 28, 0.55)
    );
    backdrop-filter: blur(16px);
    padding: 16px;
    border-radius: 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 12px 32px $shadow, inset 0 1px 0 rgba(160, 212, 255, 0.05);
    z-index: 6;
    border: 1px solid transparent;
    background-clip: padding-box;
    position: relative;
    overflow: hidden;

    /* 动态边框光效 */
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 28px;
      padding: 1px;
      background: linear-gradient(
        135deg,
        rgba($ice, 0.15),
        rgba($gold, 0.1),
        rgba($ice, 0.15)
      );
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      z-index: -1;
      animation: borderGlow 4s linear infinite;
    }

    input,
    textarea {
      background: rgba(6, 10, 20, 0.6);
      border: 1px solid $card-border;
      border-radius: 20px;
      padding: 12px 16px;
      font-size: 0.9rem;
      color: $text;
      outline: none;
      transition: all 0.2s;
     
      resize: none;
      &::placeholder {
        color: rgba($text, 0.35);
      }
      &:focus {
        border-color: $ice;
        box-shadow: 0 0 8px rgba(160, 212, 255, 0.2);
        background: rgba(6, 10, 20, 0.8);
      }
    }
    textarea {
      min-height: 70px;
      max-height: 200px;
    }

    .form-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      .hint {
        font-size: 0.75rem;
        color: rgba($text, 0.6);
        display: flex;
        align-items: center;
        gap: 6px;
        .ice-symbol {
          color: $ice;
        }
        kbd {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 0.7rem;
          font-family: monospace;
          border: 1px solid $card-border;
        }
      }
      button {
        background: linear-gradient(135deg, $ice, $gold);
        border: none;
        padding: 10px 24px;
        border-radius: 40px;
        font-weight: 700;
        color: $abyss;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
        letter-spacing: 1px;
        box-shadow: 0 4px 12px rgba(160, 212, 255, 0.3);
        position: relative;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(160, 212, 255, 0.5);
          &::after {
            left: 100%;
          }
        }
        &:active:not(:disabled) {
          transform: translateY(1px);
        }
        &:disabled {
          opacity: 0.5;
          &::after {
            display: none;
          }
        }
      }
    }
  }

  /* 动画 */
  @keyframes gridShift {
    0% {
      background-position: 0 0, 0 0;
    }
    100% {
      background-position: 0 42px, 0 0;
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
  @keyframes floatUp {
    0% {
      transform: translateY(0) scale(0);
      opacity: 0;
    }
    30% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-60px) scale(1.3);
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
  @keyframes shadowBreathe {
    0%,
    100% {
      opacity: 0.6;
      transform: rotate(-4deg) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: rotate(-4deg) scale(1.02);
    }
  }
  @keyframes underwaterShift {
    0%,
    100% {
      opacity: 0.3;
      transform: translateX(-10px);
    }
    50% {
      opacity: 0.6;
      transform: translateX(10px);
    }
  }
  @keyframes crownRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes riseBubble {
    0% {
      bottom: -20px;
      opacity: 0;
      transform: translateX(0);
    }
    20% {
      opacity: 0.6;
    }
    100% {
      bottom: 110%;
      opacity: 0;
      transform: translateX(40px);
    }
  }
  @keyframes titleGlowPulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
  }
  @keyframes emblemPulse {
    0%,
    100% {
      filter: drop-shadow(0 0 8px $gold);
    }
    50% {
      filter: drop-shadow(0 0 18px $gold);
    }
  }
  @keyframes borderGlow {
    0% {
      background: linear-gradient(
        135deg,
        rgba($ice, 0.1),
        rgba($gold, 0.05),
        rgba($ice, 0.1)
      );
    }
    50% {
      background: linear-gradient(
        135deg,
        rgba($gold, 0.1),
        rgba($ice, 0.05),
        rgba($gold, 0.1)
      );
    }
    100% {
      background: linear-gradient(
        135deg,
        rgba($ice, 0.1),
        rgba($gold, 0.05),
        rgba($ice, 0.1)
      );
    }
  }

  /* 响应式 */
  @media (max-width: 980px) {
    padding-top: 100px;
    .carousel1 {
      display: none;
    }
    .carousel2 {
      display: block;
    }

    .board-header {
      left: 12px;
      transform: none;
      width: calc(100% - 24px);
      padding: 8px 16px;
      .title-wrap {
        justify-content: space-between;
        .holy-emblem {
          font-size: 22px;
        }
        h1 {
          font-size: 1.2rem;
        }
        .subtitle {
          display: none;
        }
      }
    }

    .message-list {
      padding: 16px 12px 150px;
      .message-list-inner {
        gap: 12px;
      }
      .message-card {
        padding: 14px 16px;
        .name-avatar {
          width: 44px;
          height: 44px;
          font-size: 1rem;
        }
        .message-content {
          font-size: 0.85rem;
        }
      }
    }

    .message-form {
      left: 12px;
      transform: none;
      width: calc(100% - 24px);
      padding: 12px;
      .form-row .hint {
        display: none;
      }
      button {
        padding: 8px 18px;
      }
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
</style>
