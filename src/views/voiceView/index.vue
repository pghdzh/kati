<template>
  <section class="voice-gallery">
    <div class="bg-carousel" aria-hidden="true">
      <transition-group name="bg-fade" tag="div" class="bg-layer">
        <img
          v-for="(src, idx) in activeImages"
          :key="`bg-${idx}-${isMobile ? 'm' : 'd'}`"
          :src="src"
          :class="['bg-img', { active: idx === currentIndex }]"
          alt=""
        />
      </transition-group>
    </div>

    <div class="vg__wrap">
      <header class="vg__header">
        <div class="logo">
          <div class="title-group">
            <h1 class="title">卡提希娅 · 语音馆</h1>
            <p class="subtitle">在此聆听，她于风中的低语与宣告。</p>
          </div>
        </div>
      </header>

      <!-- 列表（已解锁放前，未解锁放后） -->
      <ul class="vg__list" role="list">
        <li
          v-for="id in allVoiceIds"
          :key="id"
          class="vg__item isUnlocked"
          :class="{ playing: id === currentId }"
        >
          <div class="item__left">
            <div class="index">{{ String(id).padStart(3, "0") }}</div>
            <div class="info">
              <div class="name">语音 {{ String(id).padStart(3, "0") }}</div>
            </div>
          </div>

          <div class="item__right">
            <button
              class="btn btn--icon"
              @click="playEntry(id)"
              :title="currentId === id && isPlaying ? '暂停' : '播放'"
            >
              <span v-if="currentId === id && isPlaying">❚❚</span>
              <span v-else>▶</span>
            </button>

            <a :href="voicePath(id)" :download="`audio_${id}.mp3`" title="下载">
              <el-button type="primary" :icon="Download" circle />
            </a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Download } from "@element-plus/icons-vue";
/* ================== 配置 ================== */
const TOTAL_VOICES = 21; // 语音总数，按实际替换
const BG_INTERVAL_MS = 4500; // 背景切换间隔（毫秒）
const MOBILE_BREAKPOINT = 720; // 小于这个宽度视为移动端
/* ========================================= */

/* ========== 导入图片资源（Vite：eager） ========== */
/* 横图（用于 PC） */
const modules: Record<string, any> = import.meta.glob(
  "@/assets/images1/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const allSrcs: string[] = Object.values(modules).map(
  (m: any) => m.default || m
);

/* 竖图（用于移动端） */
const modules2: Record<string, any> = import.meta.glob(
  "@/assets/images2/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const allSrcs2: string[] = Object.values(modules2).map(
  (m: any) => m.default || m
);

/* 简单洗牌函数 */
function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* 随机取 5 张（若不足 5 张则全部） */
const randomFive = ref<string[]>(
  shuffle(allSrcs).slice(0, Math.min(5, allSrcs.length))
);
const randomFive2 = ref<string[]>(
  shuffle(allSrcs2).slice(0, Math.min(5, allSrcs2.length))
);

/* 轮播索引（共享，但 index 会根据 activeImages 长度做取模） */
const currentIndex = ref(0);
let imgTimer: number | null = null;

/* ========== 设备判断（响应式） ========== */
const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT);
function handleResize() {
  const nowMobile = window.innerWidth < MOBILE_BREAKPOINT;
  if (nowMobile !== isMobile.value) {
    isMobile.value = nowMobile;
    // 切换图片组时重置索引以避免越界
    currentIndex.value = 0;
  }
}

/* activeImages 根据 isMobile 返回对应数组 */
const activeImages = computed(() =>
  isMobile.value ? randomFive2.value : randomFive.value
);
/* ========== 语音列表与播放逻辑 ========== */

/* 生成所有 id，并保持已解锁在前、未解锁在后 */
const allIds = Array.from({ length: TOTAL_VOICES }, (_, i) => i);
const allVoiceIds = allIds;

/* audio 单例 */
let currentAudio: HTMLAudioElement | null = null;
const currentId = ref<number | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const currentDuration = ref(0);

function createAudio(src?: string) {
  destroyAudio();
  currentAudio = new Audio();
  currentAudio.preload = "auto";
  if (src) currentAudio.src = src;
  currentAudio.addEventListener("timeupdate", onTimeUpdate);
  currentAudio.addEventListener("loadedmetadata", onLoadedMeta);
  currentAudio.addEventListener("ended", onEnded);
  currentAudio.addEventListener("error", onAudioError);
}
function destroyAudio() {
  if (!currentAudio) return;
  try {
    currentAudio.pause();
    currentAudio.removeEventListener("timeupdate", onTimeUpdate);
    currentAudio.removeEventListener("loadedmetadata", onLoadedMeta);
    currentAudio.removeEventListener("ended", onEnded);
    currentAudio.removeEventListener("error", onAudioError);
    currentAudio.src = "";
  } catch (e) {}
  currentAudio = null;
}
function onTimeUpdate() {
  if (currentAudio) currentTime.value = currentAudio.currentTime || 0;
}
function onLoadedMeta() {
  if (currentAudio) currentDuration.value = currentAudio.duration || 0;
}
function onEnded() {
  isPlaying.value = false; /* 不自动下一条 */
}
function onAudioError(e?: any) {
  console.error("audio error", e);
  isPlaying.value = false;
}

function voicePath(id: number) {
  return `/voice/audio (${id}).mp3`;
}

async function playEntry(id: number) {
  if (currentId.value === id && isPlaying.value) {
    currentAudio?.pause();
    isPlaying.value = false;
    return;
  }
  if (currentId.value === id && !isPlaying.value && currentAudio) {
    try {
      await currentAudio.play();
      isPlaying.value = true;
    } catch (e) {
      console.warn(e);
    }
    return;
  }

  // 新条目
  currentId.value = id;
  createAudio(voicePath(id));
  try {
    await currentAudio!.play();
    isPlaying.value = true;
  } catch (e) {
    console.warn("播放被阻止或失败", e);
    isPlaying.value = false;
  }
}

/* ========== 背景轮播控制 ========== */
function startBgTimer() {
  stopBgTimer();
  imgTimer = window.setInterval(() => {
    const len = Math.max(1, activeImages.value.length);
    // 保证在当前 activeImages 长度范围内循环
    currentIndex.value = (currentIndex.value + 1) % len;
  }, BG_INTERVAL_MS);
}
function stopBgTimer() {
  if (imgTimer !== null) {
    clearInterval(imgTimer);
    imgTimer = null;
  }
}

/* 生命周期 */
onMounted(() => {
  window.addEventListener("resize", handleResize);

  // 如果数组为空（没有图片），也避免报错：确保至少有一个占位空数组
  if (!randomFive.value.length && allSrcs.length)
    randomFive.value = shuffle(allSrcs).slice(0, Math.min(5, allSrcs.length));
  if (!randomFive2.value.length && allSrcs2.length)
    randomFive2.value = shuffle(allSrcs2).slice(
      0,
      Math.min(5, allSrcs2.length)
    );

  // 启动轮播
  startBgTimer();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  stopBgTimer();
  destroyAudio();
});

/* 监听 activeImages 长度变化（切换设备时重置 index 并保持循环） */
watch(activeImages, (nv) => {
  currentIndex.value = 0;
});
</script>

<style lang="scss" scoped>
$bg-deep: #050714; // 极深紫黑
$bg-shift: #071028; // 深紫中底
$accent-main: #7fd8ff; // 血玫高光
$accent-second: #ffd78a; // 冷紫次光
$text-light: #e8e5e8; // 苍白文字
$text-muted: rgba(232, 229, 233, 0.72);
$glass-border: rgba(154, 119, 183, 0.08);
$inner-glow: rgba(209, 72, 100, 0.04);

.voice-gallery {
  position: relative;
  min-height: 560px;
  font-family: "PingFang SC", "Noto Sans SC", system-ui, -apple-system,
    "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: $text-light;
  overflow: hidden;
  padding: 28px;
  padding-top: 80px;
  background: linear-gradient(180deg, $bg-deep 0%, $bg-shift 40%, #150a12 100%);
  -webkit-font-smoothing: antialiased;

  .bg-carousel {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;

    .bg-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;

      .bg-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        opacity: 0;
        transform: scale(1.02);
        transition: opacity 900ms ease, transform 900ms ease, filter 900ms ease;
        filter: brightness(0.68) contrast(0.9) saturate(0.8);
        mix-blend-mode: screen;
      }

      .bg-img.active {
        opacity: 1;
        transform: scale(1);
        filter: brightness(0.94) contrast(1) saturate(1.08);
      }
    }
  }

  .carousel2 {
    display: none;
  }

  .vg__wrap {
    position: relative;
    z-index: 2;
    max-width: 980px;
    margin: 0 auto;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8), inset 0 1px 0 $inner-glow;
    background: linear-gradient(
      180deg,
      rgba(10, 4, 8, 0.22),
      rgba(14, 6, 12, 0.15)
    );
    border: 1px solid $glass-border;
    backdrop-filter: blur(2px) saturate(0.92);
  }

  .vg__header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 24px;

    .logo {
      display: flex;
      gap: 12px;
      align-items: center;

      .title-group {
        display: flex;
        flex-direction: column;

        .title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(
            90deg,
            $accent-main 0%,
            $accent-second 60%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 6px 20px rgba(10, 4, 8, 0.48);
          letter-spacing: 0.4px;
        }

        .subtitle {
          margin: 4px 0 0;
          color: rgba($text-light, 0.86);
          font-size: 1rem;
          line-height: 1.3;
        }
      }
    }
  }

  .vg__list {
    display: grid;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 8px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(
        180deg,
        rgba($accent-main, 0.12),
        rgba($accent-second, 0.1)
      );
      border-radius: 8px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .vg__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(
      90deg,
      rgba(12, 4, 8, 0.22),
      rgba(14, 6, 12, 0.28)
    );
    border: 1px solid rgba(70, 30, 50, 0.04);
    backdrop-filter: blur(2px);
    transition: transform 0.15s ease, box-shadow 0.15s ease,
      border-color 0.15s ease, opacity 0.18s ease;
    &:hover {
      background: linear-gradient(
        90deg,
        rgba(12, 4, 8, 0.42),
        rgba(14, 6, 12, 0.48)
      );
      transform: translateY(-4px);
    }

    &.playing {
      transform: translateY(-4px);
      box-shadow: 0 0 42px rgba($accent-main, 0.12),
        inset 0 2px 12px rgba($accent-main, 0.03);
      border-color: rgba($accent-main, 0.12);
    }

    &.locked {
      opacity: 0.5;
      filter: grayscale(30%) brightness(0.78);

      .note--locked {
        color: #6e6270;
        font-style: italic;
      }
    }

    .item__left {
      display: flex;
      gap: 12px;
      align-items: center;

      .index {
        min-width: 60px;
        height: 60px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: linear-gradient(
          180deg,
          $accent-main 0%,
          $accent-second 60%
        );
        color: #1c0c12;
        font-weight: 800;
        box-shadow: 0 6px 20px rgba(8, 4, 8, 0.18);
        text-shadow: 0 0 6px rgba(0, 0, 0, 0.06);
      }

      .info {
        .name {
          color: $text-light;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .note {
          color: rgba(200, 185, 195, 0.9);
          font-size: 0.9rem;
          margin-top: 4px;
        }
        .note--locked {
          color: #6e6270;
        }
      }
    }

    .item__right {
      display: flex;
      gap: 10px;
      align-items: center;

      .btn {
        &--icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          border: none;
          display: inline-grid;
          place-items: center;
          background: linear-gradient(180deg, $accent-second, $accent-main);
          color: #1c0c12;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 26px rgba(40, 10, 20, 0.1);
          transition: all 0.15s ease;

          &:hover {
            background: linear-gradient(180deg, $accent-main, $accent-second);
            box-shadow: 0 8px 40px rgba($accent-main, 0.12);
            transform: translateY(-3px);
          }
        }

        &--hint {
          color: #9a8d9a;
        }
      }

      a {
        .el-button {
          background: linear-gradient(180deg, $accent-second, $accent-main);
          border: none;
          color: #1c0c12;
          transition: all 0.15s ease;

          &:hover {
            background: linear-gradient(180deg, $accent-main, $accent-second);
          }
        }
      }
    }
  }

  .bg-fade-enter-active,
  .bg-fade-leave-active {
    transition: opacity 900ms ease, transform 900ms ease;
  }
  .bg-fade-enter-from,
  .bg-fade-leave-to {
    opacity: 0;
    transform: scale(1.05);
  }
  .bg-fade-enter-to,
  .bg-fade-leave-from {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: 720px) {
    padding: 12px;
    padding-top: 80px;

    .vg__wrap {
      padding: 14px;
    }
    .vg__item {
      padding: 10px;
    }
    .vg__header {
      gap: 8px;
    }
    .index {
      min-width: 48px;
      height: 48px;
      font-size: 0.95rem;
    }
  }
}
</style>
