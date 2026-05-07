<!--
  卡提希娅音乐播放器 · 鸢尾韵律
  保留：播放/暂停、上下曲、进度条、音量、模式切换、搜索、视频封面、浮动小人
  改变：深海背景、圣典装饰、冰蓝/鎏金控件、鸢尾暗纹、动态粒子
-->
<template>
  <section
    class="cartethyia-player"
    @keydown.space.prevent="onSpace"
    tabindex="0"
    ref="rootEl"
    aria-label="卡提希娅 音乐播放器"
  >
    <!-- 卡提希娅装饰层（动态背景） -->
    <div class="decor-layer">
      <div class="decor-grid"></div>
      
      <div class="decor-particles">
        <span
          v-for="i in 20"
          :key="'p' + i"
          class="particle"
          :style="getParticleStyle(i)"
        ></span>
      </div>
      <div class="decor-sweep"></div>
    </div>

    <div class="stage">
      <!-- 左侧：封面与控制 -->
      <div class="left" role="region" aria-label="播放器控制区">
        <div class="cover" :style="coverStyle">
          <video
            v-if="videoSrc"
            class="video-background"
            :src="videoSrc"
            autoplay
            muted
            loop
            playsinline
            aria-hidden="true"
            tabindex="-1"
            :class="videoClass"
          ></video>
          <div v-if="loadingAudio" class="loading-overlay" aria-hidden="true">
            <div class="spinner" />
            <div class="loading-text">圣典加载中…</div>
          </div>
        </div>

        <div class="controls">
          <div class="title" :title="current?.title || '未选择曲目'">
            {{ current?.title || "未选择曲目" }}
          </div>

          <div class="meta">
            <span class="time">{{ formatTime(currentTime) }}</span>
            <span class="divider">/</span>
            <span class="time">{{ formatTime(duration) }}</span>
          </div>

          <!-- 进度条 -->
          <div
            class="progress-wrap"
            ref="progressWrap"
            @click="seekByClick"
            @pointerdown.prevent="onPointerDownProgress"
            role="slider"
            :aria-valuemin="0"
            :aria-valuemax="duration"
            :aria-valuenow="currentTime"
            aria-label="进度条"
          >
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <div
              class="progress-handle"
              :style="{ left: progressPercent + '%' }"
              aria-hidden="true"
            ></div>
          </div>

          <!-- 控件行 -->
          <div class="btns">
            <button class="icon" @click="prev" aria-label="上一首">⟵</button>
            <button
              class="play"
              @click="togglePlay"
              :aria-pressed="playing"
              :aria-label="playing ? '暂停' : '播放'"
            >
              <span v-if="!playing">▶</span>
              <span v-else>▌▌</span>
            </button>
            <button class="icon" @click="next" aria-label="下一首">⟶</button>

            <div class="modes" role="group" aria-label="播放模式">
              <button
                :class="{ active: shuffle }"
                @click="toggleShuffle"
                title="随机播放"
              >
                🔀
              </button>
              <button
                :class="{ active: repeatMode !== 'off' }"
                @click="toggleRepeat"
                title="循环模式"
              >
                🔁
              </button>
            </div>

            <div class="volume" aria-label="音量控制">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="volume"
                aria-label="音量"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="error-msg" role="status">
            {{ errorMessage }}
          </div>
        </div>
      </div>

      <!-- 右侧：播放列表 -->
      <div
        class="right"
        :class="{ collapsed: !playlistOpen && isMobile }"
        role="region"
        aria-label="播放列表"
      >
        <div class="playlist-header">
          <div class="left-head">
            <h3>🎵 圣典乐谱</h3>
            <button
              class="toggle-list-text"
              @click="togglePlaylist"
              :title="playlistOpen ? '收起播放列表' : '展开播放列表'"
            >
              {{ playlistOpen ? "收起" : "展开" }}
            </button>
            <div class="api-hint">
              {{ loading ? "翻阅乐谱…" : list.length ? "" : "乐谱为空" }}
            </div>
          </div>

          <div class="search-wrap">
            <input
              v-model="searchTerm"
              @input="onSearchInput"
              placeholder="搜索曲名..."
              aria-label="搜索曲目"
            />
            <button
              v-if="searchTerm"
              class="clear"
              @click="clearSearch"
              aria-label="清除搜索"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="list-area">
          <div v-if="loading" class="list-loading">
            <div class="small-spinner" />
            翻阅乐谱...
          </div>

          <ul class="playlist" role="list">
            <li
              v-for="(item, idx) in filteredList"
              :key="item.name || idx"
              :class="{ active: current && item.name === current.name }"
              @click="selectTrack(idx)"
              tabindex="0"
              @keyup.enter="selectTrack(idx)"
              role="listitem"
              :aria-current="idx === index ? 'true' : 'false'"
            >
              <div class="left-col">
                <div class="dot" aria-hidden="true"></div>
                <div class="title" :title="item.title">{{ item.title }}</div>
              </div>
              <div class="right-col">
                <div class="len">
                  {{ item.duration ? formatTime(item.duration) : "--:--" }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio
      ref="audioRef"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
      @error="onAudioError"
      preload="metadata"
    ></audio>

    <!-- 浮动小人（保留） -->
    <div class="floating-chibis">
      <img
        v-for="(pet, i) in chibiList"
        :key="i"
        :src="pet.src"
        :style="{ top: pet.top + 'px', left: pet.left + 'px' }"
        class="chibi-img"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { getMusicList, getMusicUrl } from "@/api/modules/music";
import gsap from "gsap";

type MusicItem = {
  name: string;
  title: string;
  url?: string;
  duration?: number | null;
};

const list = ref<MusicItem[]>([]);
const loading = ref(false);
const index = ref<number>(-1);
const playing = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);
const currentTime = ref<number>(0);
const duration = ref<number>(0);
const volume = ref<number>(Number(localStorage.getItem("kati_volume") ?? 0.8));
const shuffle = ref<boolean>(false);
const repeatMode = ref<"off" | "one" | "all">("off");

const rootEl = ref<HTMLElement | null>(null);
const progressWrap = ref<HTMLElement | null>(null);
const dragging = ref(false);
const playlistOpen = ref(true);
const errorMessage = ref<string | null>(null);
const loadingAudio = ref(false);

const isMobile = ref<boolean>(window.innerWidth <= 920);
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 920;
});

const videoSrc = ref("");
const videoClass = ref("");

const searchTerm = ref("");
let searchTimer: any = null;
const searchDebounceMs = 240;

const current = computed(() =>
  index.value >= 0 && list.value[index.value] ? list.value[index.value] : null
);
const progressPercent = computed(() =>
  duration.value
    ? Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
    : 0
);

const coverStyle = computed(() => {
  const t = current.value?.title || "kati";
  let hash = 0;
  for (let i = 0; i < t.length; i++)
    hash = (hash << 5) - hash + t.charCodeAt(i);
  const r1 = (Math.abs(hash) % 80) + 60;
  const r2 = (Math.abs(hash * 3) % 80) + 60;
  return {
    background: `radial-gradient(circle at 30% 30%, rgba(160,212,255,0.08), transparent 50%), linear-gradient(135deg, rgba(${r1},${r2},255,0.1), rgba(212,184,122,0.08))`,
  };
});

const filteredList = computed(() => {
  const term = (searchTerm.value || "").trim().toLowerCase();
  if (!term) return list.value;
  return list.value.filter((i) => (i.title || "").toLowerCase().includes(term));
});

async function fetchList() {
  loading.value = true;
  try {
    const res = await getMusicList();
    const items =
      res?.ok && Array.isArray(res.list)
        ? res.list
        : Array.isArray(res)
        ? res
        : res?.list ?? [];
    list.value = items.map((it: any) => ({
      name: it.name,
      title: it.title ?? (it.name ? it.name.replace(/\.mp3$/i, "") : "未知"),
      url: getMusicUrl(it.name),
      duration: null,
    }));
  } catch (e) {
    console.error("获取音乐列表失败", e);
    list.value = [];
    errorMessage.value = "无法翻阅圣典乐谱";
  } finally {
    loading.value = false;
  }
}

async function safeSetSrc(url: string) {
  const a = audioRef.value!;
  errorMessage.value = null;
  loadingAudio.value = true;
  try {
    try {
      const head = await fetch(url, { method: "HEAD" });
      if (!head.ok) throw new Error(`资源响应 ${head.status}`);
      const ct = head.headers.get("content-type") || "";
      if (!ct.includes("audio")) console.warn("content-type 不是 audio:", ct);
    } catch (e) {
      /* HEAD 失败忽略 */
    }
    a.src = url;
    a.load();
  } catch (err) {
    console.error("设置音源失败", err);
    errorMessage.value = "无法加载音频资源";
    throw err;
  } finally {
    loadingAudio.value = false;
  }
}

async function loadCurrent(doPlay = false) {
  const a = audioRef.value;
  const curr = current.value;
  if (!a || !curr) return;
  a.pause();
  duration.value = 0;
  currentTime.value = 0;
  try {
    await safeSetSrc(curr.url || getMusicUrl(curr.name));
    if (doPlay) await play();
  } catch {
    playing.value = false;
    loadingAudio.value = false;
  }
}

async function play() {
  const a = audioRef.value;
  if (!a) return;
  try {
    await a.play();
    playing.value = true;
    errorMessage.value = null;
  } catch (e: any) {
    console.warn("播放失败", e);
    playing.value = false;
    errorMessage.value = "播放被浏览器阻止或资源不可用";
  }
}
function pause() {
  audioRef.value?.pause();
  playing.value = false;
}
function togglePlay() {
  if (!audioRef.value) return;
  if (playing.value) pause();
  else play();
}

function selectTrack(idxInFiltered: number) {
  const item = filteredList.value[idxInFiltered];
  if (!item) return;
  const originalIndex = list.value.findIndex((it) => it.name === item.name);
  if (originalIndex === -1) return;
  index.value = originalIndex;
  loadCurrent(true);
}

function onTimeUpdate(e: Event) {
  const t = e.target as HTMLAudioElement;
  currentTime.value = t.currentTime || 0;
}
function onLoadedMetadata(e: Event) {
  const t = e.target as HTMLAudioElement;
  duration.value = isFinite(t.duration) ? t.duration : 0;
  if (current.value && !current.value.duration)
    current.value.duration = duration.value;
  loadingAudio.value = false;
}
function onEnded() {
  loadingAudio.value = false;
  if (repeatMode.value === "one") {
    if (audioRef.value) {
      audioRef.value.currentTime = 0;
      play();
    }
    return;
  }
  if (shuffle.value) {
    playRandom();
    return;
  }
  if (index.value < list.value.length - 1) selectTrack(index.value + 1);
  else {
    if (repeatMode.value === "all") selectTrack(0);
    else playing.value = false;
  }
}
function onAudioError(e: Event) {
  const a = audioRef.value;
  console.error("audio error", a?.error);
  errorMessage.value = "音频播放出错";
  playing.value = false;
  loadingAudio.value = false;
}

function next() {
  if (!list.value.length) return;
  if (shuffle.value) {
    playRandom();
    return;
  }
  if (index.value < list.value.length - 1) selectTrack(index.value + 1);
  else if (repeatMode.value === "all") selectTrack(0);
}
function prev() {
  if (!audioRef.value) return;
  if (audioRef.value.currentTime > 4) {
    audioRef.value.currentTime = 0;
    return;
  }
  if (index.value > 0) selectTrack(index.value - 1);
  else if (repeatMode.value === "all") selectTrack(list.value.length - 1);
}
function playRandom() {
  if (!list.value.length) return;
  if (list.value.length === 1) {
    selectTrack(0);
    return;
  }
  let i = index.value;
  while (i === index.value) i = Math.floor(Math.random() * list.value.length);
  selectTrack(i);
}

function seekByClick(e: MouseEvent | TouchEvent) {
  if (!progressWrap.value || !duration.value || !audioRef.value) return;
  const rect = progressWrap.value.getBoundingClientRect();
  const clientX =
    (e as MouseEvent).clientX ?? (e as TouchEvent).touches?.[0]?.clientX;
  if (clientX == null) return;
  const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
  const ratio = x / rect.width;
  audioRef.value.currentTime = ratio * duration.value;
  currentTime.value = audioRef.value.currentTime;
}
function onPointerDownProgress(e: PointerEvent) {
  if (!progressWrap.value || !audioRef.value || !duration.value) return;
  dragging.value = true;
  (e.target as Element).setPointerCapture?.(e.pointerId);
  window.addEventListener("pointermove", onPointerMoveProgress);
  window.addEventListener("pointerup", onPointerUpProgress);
  handlePointer(e);
}
function onPointerMoveProgress(e: PointerEvent) {
  handlePointer(e);
}
function onPointerUpProgress(e: PointerEvent) {
  dragging.value = false;
  window.removeEventListener("pointermove", onPointerMoveProgress);
  window.removeEventListener("pointerup", onPointerUpProgress);
}
function handlePointer(e: PointerEvent) {
  if (!progressWrap.value || !audioRef.value || !duration.value) return;
  const rect = progressWrap.value.getBoundingClientRect();
  const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
  const ratio = x / rect.width;
  audioRef.value.currentTime = ratio * duration.value;
  currentTime.value = audioRef.value.currentTime;
}

watch(volume, (v) => {
  if (audioRef.value) audioRef.value.volume = v;
  localStorage.setItem("kati_volume", String(v));
});

function toggleShuffle() {
  shuffle.value = !shuffle.value;
}
function toggleRepeat() {
  if (repeatMode.value === "off") repeatMode.value = "all";
  else if (repeatMode.value === "all") repeatMode.value = "one";
  else repeatMode.value = "off";
}

function onSpace() {
  if (
    document.activeElement &&
    ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
  )
    return;
  togglePlay();
}

function togglePlaylist() {
  playlistOpen.value = !playlistOpen.value;
  if (playlistOpen.value)
    nextTick(() => {
      const el = document.querySelector(".playlist li.active");
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
}

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchTimer = null;
  }, searchDebounceMs);
}
function clearSearch() {
  searchTerm.value = "";
}

function formatTime(sec?: number) {
  if (!sec || !isFinite(sec)) return "--:--";
  const s = Math.floor(sec % 60),
    m = Math.floor(sec / 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface Chibi {
  src: string;
  top: number;
  left: number;
}
const chibiList = ref<Chibi[]>([]);

// 粒子样式
function getParticleStyle(i: number) {
  const colors = ["#a0d4ff", "#d4b87a", "#f0f5fc"];
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
    backgroundColor: colors[i % 3],
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${6 + Math.random() * 8}s`,
  };
}

onMounted(async () => {
  audioRef.value =
    (document.querySelector(".cartethyia-player audio") as HTMLAudioElement) ??
    null;
  if (audioRef.value) audioRef.value.volume = volume.value;

  const isM = isMobile.value;
  const folder = isM ? "/mp1" : "/mp2";
  const idx = Math.floor(Math.random() * 4) + 1;
  videoSrc.value = `${folder}/1 (${idx}).mp4`;
  videoClass.value = isM ? "landscape" : "portrait";

  await fetchList();

  window.addEventListener("keydown", globalKeydown);

  // 小人动画（保留原有逻辑）
  const total = 8;
  let pickCount = isMobile.value ? 1 : 3;
  const vw = window.innerWidth,
    vh = window.innerHeight,
    imgW = 100,
    imgH = 100;
  function shuffle(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const picks = shuffle(Array.from({ length: total }, (_, k) => k + 1)).slice(
    0,
    pickCount
  );
  chibiList.value = picks.map((i) => ({
    src: `/QImages/1 (${i}).png`,
    left: Math.random() * (vw - imgW),
    top: Math.random() * (vh - imgH),
  }));
  await nextTick();
  document
    .querySelectorAll<HTMLImageElement>(".chibi-img")
    .forEach((img, index) => {
      const padding = 200;
      gsap.fromTo(
        img,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(2)",
          delay: 0.2 * index,
        }
      );
      img.addEventListener("mouseenter", () => {
        gsap.killTweensOf(img);
        gsap.to(img, {
          x: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
          y: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
          duration: 1.2,
          ease: "back.out(2)",
          onComplete: () => animate(img),
        });
      });
      const animate = (img: HTMLImageElement) => {
        let { x, y } = img.getBoundingClientRect();
        let dx = (Math.random() - 0.5) * 200,
          dy = (Math.random() - 0.5) * 200;
        if (x + dx < padding) dx = padding - x;
        if (x + dx + img.width > window.innerWidth - padding)
          dx = window.innerWidth - padding - (x + img.width);
        if (y + dy < padding) dy = padding - y;
        if (y + dy + img.height > window.innerHeight - padding)
          dy = window.innerHeight - padding - (y + img.height);
        gsap.to(img, {
          x: `+=${dx.toFixed(0)}`,
          y: `+=${dy.toFixed(0)}`,
          rotation: `+=${((Math.random() - 0.5) * 60).toFixed(0)}`,
          duration: 2 + Math.random() * 2,
          ease: "power1.inOut",
          onComplete: () => animate(img),
        });
      };
      animate(img);
    });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", globalKeydown);
});

function globalKeydown(e: KeyboardEvent) {
  if (e.code === "Space") {
    if (
      document.activeElement &&
      ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    )
      return;
    e.preventDefault();
    togglePlay();
  } else if (e.code === "Escape") {
    pause();
  }
}
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
$text-dim: rgba(233, 232, 231, 0.65);
$card-bg: rgba(6, 10, 20, 0.55);
$card-border: rgba(160, 212, 255, 0.08);
$shadow: 0 16px 40px rgba(0, 0, 0, 0.7);

.cartethyia-player {
  position: relative;
  padding: 20px;
  min-height: 100vh;
  background: radial-gradient(ellipse at 30% 20%, $deep, $abyss);
  color: $text;
  padding-top: 90px;
  font-family: "Noto Serif SC", "Cinzel", "STKaiti", system-ui, serif;
  outline: none;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;

  // 装饰层
  .decor-layer {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    .decor-grid {
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
      mask-image: radial-gradient(
        ellipse at 50% 40%,
        black 30%,
        transparent 70%
      );
      animation: gridShift 18s linear infinite;
    }

    .decor-particles {
      position: absolute;
      inset: 0;
      .particle {
        position: absolute;
        border-radius: 50%;
        box-shadow: 0 0 12px currentColor;
        animation: floatUp 8s infinite ease-in-out;
        mix-blend-mode: screen;
        opacity: 0;
      }
    }
    .decor-sweep {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, $ice, $gold, transparent);
      filter: blur(2px);
      animation: sweep 12s linear infinite;
      opacity: 0.25;
    }
  }

  .stage {
    position: relative;
    z-index: 5;
    display: flex;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: flex-start;
  }

  .left {
    width: 440px;
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.7),
      rgba(8, 14, 28, 0.8)
    );
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 18px;
    border: 1px solid $card-border;
    box-shadow: $shadow, inset 0 1px 0 rgba(160, 212, 255, 0.05);
    min-height: 400px;
  }

  .cover {
    width: 100%;
    height: 640px;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4),
      inset 0 -6px 20px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(212, 184, 122, 0.12);
    background: $abyss;

    .video-background {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.8;
      filter: brightness(0.7) saturate(0.8) hue-rotate(5deg);
    }
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(5, 10, 24, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 8;
    .spinner {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid rgba(160, 212, 255, 0.1);
      border-top-color: $ice;
      animation: spin 1s linear infinite;
    }
    .loading-text {
      margin-top: 12px;
      color: $gold;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .controls {
    margin-top: 18px;
    padding: 0 4px;

    .title {
      font-size: 1.2rem;
      font-weight: 800;
      color: $holy;
      letter-spacing: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }
    .meta {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 0.9rem;
      color: $text-dim;
      margin-bottom: 12px;
      .divider {
        color: $gold;
        opacity: 0.5;
      }
    }
  }

  .progress-wrap {
    margin: 16px 0;
    cursor: pointer;
    touch-action: none;
    position: relative;
    .progress-bar {
      height: 6px;
      background: rgba(160, 212, 255, 0.08);
      border-radius: 6px;
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    .progress {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, $ice, $gold);
      box-shadow: 0 0 8px $ice;
      transition: width 80ms linear;
    }
    .progress-handle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: $holy;
      border: 2px solid $ice;
      transform: translateX(-50%);
      position: relative;
      top: -5px;
      box-shadow: 0 2px 10px rgba(160, 212, 255, 0.5);
      cursor: grab;
      transition: transform 0.1s;
      &:hover {
        transform: translateX(-50%) scale(1.2);
      }
      &:active {
        cursor: grabbing;
      }
    }
  }

  .btns {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 8px;

    .icon,
    .play {
      background: transparent;
      border: 1px solid $card-border;
      color: $holy;
      font-size: 18px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 10px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      &:hover {
        border-color: $ice;
        color: $ice;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }
    }
    .play {
      background: linear-gradient(
        135deg,
        rgba(160, 212, 255, 0.15),
        rgba(212, 184, 122, 0.1)
      );
      padding: 8px 18px;
      font-size: 20px;
      border-color: rgba(212, 184, 122, 0.25);
      &:hover {
        background: linear-gradient(
          135deg,
          rgba(160, 212, 255, 0.25),
          rgba(212, 184, 122, 0.15)
        );
        border-color: $gold;
      }
    }
  }

  .modes {
    display: flex;
    gap: 6px;
    margin-left: 4px;
    button {
      background: transparent;
      border: 1px solid $card-border;
      padding: 6px 10px;
      border-radius: 8px;
      color: $text-dim;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        color: $ice;
        border-color: $ice;
      }
      &.active {
        background: rgba(160, 212, 255, 0.12);
        border-color: $ice;
        color: $ice;
      }
    }
  }

  .volume {
    margin-left: auto;
    input[type="range"] {
      width: 100px;
      height: 4px;
      background: rgba(160, 212, 255, 0.1);
      border-radius: 4px;
      -webkit-appearance: none;
      appearance: none;
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: $ice;
        border: 2px solid $gold;
        cursor: pointer;
        box-shadow: 0 0 8px $ice;
      }
    }
  }

  .error-msg {
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(160, 212, 255, 0.1);
    border-left: 4px solid $ice;
    border-radius: 6px;
    color: $ice;
    font-weight: 600;
    font-size: 0.9rem;
  }

  /* 右侧播放列表 */
  .right {
    flex: 1;
    max-height: 65vh;
    overflow: hidden;
    border-radius: 20px;
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.7),
      rgba(8, 14, 28, 0.8)
    );
    backdrop-filter: blur(12px);
    border: 1px solid $card-border;
    padding: 18px;
    box-shadow: $shadow;
    display: flex;
    flex-direction: column;
    transition: max-height 0.3s ease;
    &.collapsed {
      max-height: 70px;
    }
  }

  .playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid $card-border;
    .left-head {
      display: flex;
      gap: 12px;
      align-items: center;
      h3 {
        margin: 0;
        color: $gold;
        font-weight: 700;
        letter-spacing: 2px;
      }
    }
    .toggle-list-text {
      padding: 6px 12px;
      border-radius: 20px;
      background: transparent;
      border: 1px solid $card-border;
      color: $ice;
      font-weight: 600;
      cursor: pointer;
      display: none;
      &:hover {
        background: rgba(160, 212, 255, 0.1);
      }
    }
    .api-hint {
      color: $text-dim;
      font-size: 0.85rem;
      font-style: italic;
    }
    .search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      input {
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid $card-border;
        background: rgba(5, 10, 24, 0.8);
        color: $text;
        width: 220px;
        font-size: 0.9rem;
        outline: none;
        transition: border 0.2s;
        &::placeholder {
          color: rgba($text, 0.35);
        }
        &:focus {
          border-color: $ice;
        }
      }
      .clear {
        background: transparent;
        border: 1px solid $card-border;
        color: $text-dim;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          border-color: $gold;
          color: $gold;
        }
      }
    }
  }

  .list-area {
    flex: 1;
    overflow: hidden;
  }
  .list-loading {
    display: flex;
    align-items: center;
    gap: 12px;
    color: $gold;
    padding: 20px 0;
  }
  .small-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(160, 212, 255, 0.1);
    border-top-color: $ice;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }

  .playlist {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    max-height: calc(65vh - 100px);
    display: flex;
    flex-direction: column;
    gap: 6px;
    li {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      align-items: center;
      padding: 12px 14px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
      background: rgba(5, 10, 24, 0.4);
      &:hover {
        transform: translateX(-6px);
        background: rgba(160, 212, 255, 0.05);
        border-color: $card-border;
      }
      &.active {
        background: linear-gradient(
          90deg,
          rgba(160, 212, 255, 0.12),
          rgba(212, 184, 122, 0.06)
        );
        border-left: 4px solid $ice;
        border-radius: 8px 12px 12px 8px;
        .dot {
          background: $ice;
          box-shadow: 0 0 10px $ice;
        }
      }
      .left-col {
        display: flex;
        gap: 14px;
        align-items: center;
        min-width: 0;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $gold;
        box-shadow: 0 0 6px $gold;
        flex-shrink: 0;
        transition: all 0.2s;
      }
      .title {
        font-weight: 600;
        color: $text;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.4;
      }
      .len {
        color: $text-dim;
        font-weight: 600;
        font-size: 0.85rem;
        min-width: 48px;
        text-align: right;
      }
    }
  }

  // 浮动小人
  .floating-chibis {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    .chibi-img {
      position: absolute;
      width: 80px;
      pointer-events: auto;
      filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
    }
  }

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

  @media (max-width: 920px) {
    .toggle-list-text {
      display: block;
    }
    .stage {
      flex-direction: column;
    }
    .left {
      width: 100%;
      min-height: auto;
    }
    .cover {
      height: 200px;
    }
    .right {
      width: 100%;
      max-height: none;
    }
    .search-wrap input {
      width: 160px;
    }
  }
  @media (max-width: 520px) {
    padding: 12px;
    padding-top: 80px;
    .btns {
      gap: 8px;
    }
    .volume input[type="range"] {
      width: 70px;
    }
    .playlist-header {
      flex-direction: column;
      align-items: flex-start;
    }
    .search-wrap {
      width: 100%;
      input {
        flex: 1;
      }
    }
  }
}
</style>
