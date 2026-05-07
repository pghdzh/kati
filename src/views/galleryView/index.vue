<!--
  卡提希娅风格图集 - 双生瞬影
  配色：深蓝底 / 冰蓝 / 鎏金 / 圣洁白
  装饰：鸢尾暗纹、圣典网格、圣光扫掠、浮游粒子
-->
<template>
  <div class="cartethyia-gallery-container">
    <!-- ========== CSS 2D 动态背景层 ========== -->
    <div class="css-bg">
      <div class="bg-gradients"></div>
      <div class="bg-grid"></div>
      <div class="bg-fleur"></div>
      <div class="bg-sweep"></div>
      <div class="bg-particles">
        <span
          v-for="i in 24"
          :key="'p' + i"
          class="particle"
          :style="getBgParticleStyle(i)"
        ></span>
      </div>
    </div>

    <button class="upload-btn" @click="openUploadModal">
      <span class="btn-icon">⚜️</span> 上传图片
    </button>

    <section class="gallery section">
      <div class="sort-controls">
        <button @click="toggleSort" class="sort-btn">
          <span class="sort-icon">❖</span>
          按 {{ sortBy === "like_count" ? "点赞量" : "最新上传" }} 排序
        </button>
      </div>
      <div class="gallery-grid">
        <div
          v-for="(img, index) in images"
          :key="img.id"
          class="card"
          @click="openLightbox(index)"
          ref="cards"
        >
          <div class="card-inner">
            <img
              :src="img.src"
              :alt="img.alt"
              loading="lazy"
              @load="onImageLoad($event)"
            />
            <div class="overlay">
              <span>⚜️ 查看大图</span>
            </div>
            <button class="like-btn" @click.stop="handleLike(img)">
              <i class="heart" :class="{ liked: img.liked }"></i>
              <span class="like-count">{{ img.likeCount }}</span>
            </button>
          </div>
        </div>
      </div>
      <div ref="sentinel" class="sentinel"></div>
      <div class="loading" v-if="loading">
        <span class="ice-symbol">❄️</span> 圣典翻页中...
      </div>
      <div class="finished" v-if="finished">
        —— 已达圣典尽头 · 暂无更多图卷 ——
      </div>
    </section>

    <!-- 排行榜面板 -->
    <aside class="ranking-panel">
      <div class="panel-header" @click="expanded = !expanded">
        <h3 class="ranking-title">⚜️ 排行</h3>
        <span class="panel-total">共{{ imgTotal }}张</span>
        <span class="toggle-icon">{{ expanded ? "▾" : "▸" }}</span>
      </div>
      <transition name="fade">
        <ul v-if="expanded" class="ranking-list">
          <li
            v-for="(item, idx) in rankingList"
            :key="idx"
            class="ranking-item"
            :class="`rank-${idx + 1}`"
          >
            <span class="rank">{{ idx + 1 }}</span>
            <span class="name">{{ item.nickname }}</span>
            <span class="count">{{ item.count }} 张</span>
          </li>
        </ul>
      </transition>
    </aside>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
      <span class="close" @click="closeLightbox">✕</span>
      <span class="prev" @click.stop="prevImage">‹</span>
      <img :src="images[currentIndex].src" :alt="images[currentIndex].alt" />
      <span class="next" @click.stop="nextImage">›</span>
    </div>

    <!-- 上传弹窗 -->
    <div
      v-if="uploadModalOpen"
      class="upload-modal-overlay"
      @click.self="closeUploadModal"
    >
      <div class="upload-modal">
        <h3>⚜️ 圣典收录 · 提交图卷</h3>
        <div class="tip-container">
          <ul class="tips-list">
            <li>
              审核规则： 1.不要色情倾向（不要露三点） 2.要我能认出是卡提希娅。
            </li>
            <li>
              由于没有用户系统，我这边不好做审核反馈，但只要显示上传成功，我这边肯定能收到。
            </li>
            <li>
              如果图片数量较多请在b站私信联系我给我网盘链接，因为我云服务器比较小一次性上传太多图片可能会导致上传不上，感谢理解。
            </li>
            <li>
              因为审核上传一次比较麻烦，所以审核时间不定，最晚一周，感谢谅解。
            </li>
          </ul>
        </div>
        <p class="stats">
          今日已提交：<strong>{{ uploadedToday }}</strong> 张，
          剩余可提交：<strong>{{ remaining }}</strong> 张
        </p>
        <label>
          署名：
          <input v-model="nickname" type="text" placeholder="留下你的名讳…" />
        </label>
        <label>
          选择图卷（最多 {{ remaining }} 张）：
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileSelect"
          />
        </label>
        <p class="tip" v-if="selectedFiles.length">
          已选 {{ selectedFiles.length }} 张
        </p>
        <div class="modal-actions">
          <button :disabled="!canSubmit || isUploading" @click="submitUpload">
            {{ isUploading ? "收录中…" : "⚜️ 提交收录" }}
          </button>
          <button class="cancel" @click="closeUploadModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 浮动小人 -->
    <div class="floating-chibis">
      <img
        v-for="(pet, i) in chibiList"
        :key="i"
        :src="pet.src"
        :style="{ top: pet.top + 'px', left: pet.left + 'px' }"
        class="chibi-img"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from "vue";
import { uploadImages } from "@/api/modules/images";
import { getRankingList } from "@/api/modules/ranking";
import { gsap } from "gsap";
import { getImagesLikesList, likeImage } from "@/api/modules/imagesLikes";
import { debounce } from "lodash";

// ========== 排序 ==========
const sortBy = ref<"uploaded_at" | "like_count">("like_count");
const order = ref<"asc" | "desc">("desc");
function toggleSort() {
  if (sortBy.value === "uploaded_at") {
    sortBy.value = "like_count";
    order.value = "desc";
  } else {
    sortBy.value = "uploaded_at";
    order.value = "desc";
  }
  pageImage.value = 1;
  images.value = [];
  finished.value = false;
  window.scrollTo(0, 0);
  loadNextPage();
}

// ========== 点赞 ==========
function getLikedIds(): number[] {
  const data = localStorage.getItem("likedImageIds");
  return data ? JSON.parse(data) : [];
}
function setLikedIds(ids: number[]) {
  localStorage.setItem("likedImageIds", JSON.stringify(ids));
}

interface ImageItem {
  src: string;
  alt: string;
  likeCount: number;
  id: number;
  liked: Boolean;
}

async function handleLike(img: ImageItem) {
  if (img.liked) return;
  try {
    await likeImage(img.id);
    img.likeCount += 1;
    img.liked = true;
    const likedIds = getLikedIds();
    likedIds.push(img.id);
    setLikedIds(likedIds);
  } catch (error) {
    console.error("点赞失败", error);
    alert("点赞失败，请稍后重试");
  }
}

// ========== 排行榜 ==========
interface RankingItem {
  nickname: string;
  count: number;
}
const rankingList = ref<RankingItem[]>([]);
const expanded = ref(true);

const fetchRanking = async () => {
  const res = await getRankingList({
    page: 1,
    pageSize: 99,
    character_key: "kati",
  });
  if (res.success) {
    rankingList.value = res.data;
  } else {
    console.error("获取排行榜失败", res.message);
  }
};

// ========== 图片列表 ==========
const images = ref<ImageItem[]>([]);
const pageImage = ref(1);
const limit = ref(10);
const loading = ref(false);
const finished = ref(false);
const imgTotal = ref(0);
const sentinel = ref<HTMLElement | null>(null);

const observerCard = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerCard.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

async function observeNewCards(startIndex = 0) {
  await nextTick();
  const cards = document.querySelectorAll<HTMLElement>(".card");
  for (let i = startIndex; i < cards.length; i++) {
    observerCard.observe(cards[i]);
  }
}

const fixImageUrl = (url: string): string => {
  if (url.includes("127.0.0.1")) {
    return url.replace("http://127.0.0.1", window.location.origin);
  }
  return url;
};

async function loadNextPage() {
  if (loading.value || finished.value) return;
  loading.value = true;
  try {
    const res = await getImagesLikesList({
      page: pageImage.value,
      limit: limit.value,
      sortBy: sortBy.value,
      character_key: "kati",
      order: order.value,
    });
    imgTotal.value = res.total;
    const likedIds = getLikedIds();
    const list = (
      res.images as Array<{ url: string; like_count: number; id: number }>
    ).map((item) => ({
      src: fixImageUrl(item.url),
      alt: "",
      likeCount: item.like_count,
      id: item.id,
      liked: likedIds.includes(item.id),
    }));
    if (list.length === 0) {
      finished.value = true;
      return;
    }
    const oldLength = images.value.length;
    const existingIds = new Set(images.value.map((i) => i.id));
    const filtered = list.filter((item) => !existingIds.has(item.id));
    images.value.push(...filtered);
    pageImage.value++;
    observeNewCards(oldLength);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const debouncedLoad = debounce(
  () => {
    loadNextPage();
  },
  200,
  { leading: true, trailing: false }
);

// ========== 灯箱 ==========
const lightboxOpen = ref(false);
const currentIndex = ref(0);
function openLightbox(index: number) {
  currentIndex.value = index;
  lightboxOpen.value = true;
}
function closeLightbox() {
  lightboxOpen.value = false;
}
function prevImage() {
  currentIndex.value =
    (currentIndex.value + images.value.length - 1) % images.value.length;
}
function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}
function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement;
  const card = img.closest(".card");
  card?.classList.add("loaded");
}

// ========== 上传 ==========
const uploadModalOpen = ref(false);
const nickname = ref("");
const fileInput = ref<HTMLInputElement>();
const selectedFiles = ref<File[]>([]);
const isUploading = ref(false);

function getTodayKey() {
  return `uploaded_${new Date().toISOString().slice(0, 10)}`;
}
const uploadedToday = ref<number>(
  Number(localStorage.getItem(getTodayKey()) || 0)
);
const remaining = computed(() => Math.max(27 - uploadedToday.value, 0));
const canSubmit = computed(() => {
  return (
    nickname.value.trim().length > 0 &&
    selectedFiles.value.length > 0 &&
    selectedFiles.value.length <= remaining.value
  );
});

function clearOldUploadRecords() {
  const today = new Date();
  const storage = window.localStorage;
  for (const key of Object.keys(storage)) {
    if (!key.startsWith("uploaded_")) continue;
    const dateStr = key.slice("uploaded_".length);
    const recordDate = new Date(dateStr);
    if (isNaN(recordDate.getTime())) continue;
    const diffDays =
      (today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 2) storage.removeItem(key);
  }
}

function openUploadModal() {
  clearOldUploadRecords();
  nickname.value = "";
  selectedFiles.value = [];
  if (fileInput.value) fileInput.value.value = "";
  uploadedToday.value = Number(localStorage.getItem(getTodayKey()) || 0);
  uploadModalOpen.value = true;
}
function closeUploadModal() {
  uploadModalOpen.value = false;
}

function handleFileSelect(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || []);
  if (!files) return;
  const validFiles: File[] = [];
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      alert(`文件太大：${file.name}，请控制在 20MB 内`);
      continue;
    }
    validFiles.push(file);
  }
  if (validFiles.length === 0) return;
  if (validFiles.length > remaining.value) {
    alert(
      `今天最多还能提交 ${remaining.value} 张，已为你截取前 ${remaining.value} 张`
    );
    selectedFiles.value = files.slice(0, remaining.value);
  } else {
    selectedFiles.value = files;
  }
}

async function submitUpload() {
  if (!canSubmit.value) return;
  isUploading.value = true;
  try {
    const res = await uploadImages(
      selectedFiles.value,
      nickname.value.trim(),
      "kati"
    );
    const uploadedCount = res.data.length;
    uploadedToday.value += uploadedCount;
    localStorage.setItem(getTodayKey(), String(uploadedToday.value));
    alert(`成功收录 ${uploadedCount} 张图卷`);
    closeUploadModal();
  } catch (err: any) {
    console.error(err);
    alert(err.message || "收录失败");
  } finally {
    isUploading.value = false;
  }
}

// ========== 浮动小人 ==========
interface Chibi {
  src: string;
  top: number;
  left: number;
}
const chibiList = ref<Chibi[]>([]);
let sentinelObserver: IntersectionObserver;

onMounted(async () => {
  await fetchRanking();
  await loadNextPage();
  observeNewCards(0);

  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) debouncedLoad();
    },
    { rootMargin: "0px", threshold: 0.1 }
  );
  if (sentinel.value) {
    sentinelObserver.observe(sentinel.value);
  }

  // 小人动画
  const total = 9;
  let pickCount = window.innerWidth <= 768 ? 1 : 3;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const imgWidth = 100;
  const imgHeight = 100;
  function shuffle(arr: number[]) {
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
    left: Math.random() * (vw - imgWidth),
    top: Math.random() * (vh - imgHeight),
  }));

  await nextTick();
  const imgs = document.querySelectorAll<HTMLImageElement>(".chibi-img");
  imgs.forEach((img, index) => {
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
      let deltaX = (Math.random() - 0.5) * 200;
      let deltaY = (Math.random() - 0.5) * 200;
      const padding = 200;
      let nextX = x + deltaX;
      let nextY = y + deltaY;
      if (nextX < padding) deltaX = padding - x;
      if (nextX + img.width > window.innerWidth - padding)
        deltaX = window.innerWidth - padding - (x + img.width);
      if (nextY < padding) deltaY = padding - y;
      if (nextY + img.height > window.innerHeight - padding)
        deltaY = window.innerHeight - padding - (y + img.height);
      gsap.to(img, {
        x: `+=${deltaX.toFixed(0)}`,
        y: `+=${deltaY.toFixed(0)}`,
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
  observerCard.disconnect();
  sentinelObserver.disconnect();
});

// 背景粒子样式
const getBgParticleStyle = (i: number) => {
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
</script>

<style lang="scss" scoped>
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
$card-bg: rgba(6, 10, 20, 0.5);
$card-border: rgba(160, 212, 255, 0.08);
$shadow: 0 16px 48px rgba(0, 0, 0, 0.7);

.cartethyia-gallery-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, $abyss 0%, $deep 100%);
  color: $text;
  font-family: "Noto Serif SC", "Cinzel", "STKaiti", system-ui, serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  padding-bottom: 60px;
  padding-top: 20px;
}

/* ========== CSS 动态背景 ========== */
.css-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.bg-gradients {
  position: absolute;
  inset: 0;
  background: radial-gradient(
      ellipse at 20% 30%,
      rgba(160, 212, 255, 0.04),
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 60%,
      rgba(212, 184, 122, 0.03),
      transparent 50%
    ),
    radial-gradient(
      ellipse at 50% 80%,
      rgba(180, 160, 210, 0.02),
      transparent 50%
    );
  mix-blend-mode: screen;
}
.bg-grid {
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
.bg-fleur {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L110 60 L140 50 L120 76 L150 90 L120 100 L150 110 L120 124 L140 150 L110 140 L100 170 L90 140 L60 150 L80 124 L50 110 L80 100 L50 90 L80 76 L60 50 L90 60 Z' fill='none' stroke='%23d4b87a' stroke-width='1' opacity='0.06'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.3;
  animation: slowSpin 60s linear infinite;
  mix-blend-mode: overlay;
}
.bg-sweep {
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
.bg-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  .particle {
    position: absolute;
    border-radius: 50%;
    box-shadow: 0 0 12px currentColor;
    animation: floatUp 8s infinite ease-in-out;
    mix-blend-mode: screen;
    opacity: 0;
  }
}

/* ========== 上传按钮 ========== */
.upload-btn {
  position: fixed;
  bottom: 64px;
  right: 24px;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: "Cinzel", "Noto Serif SC", serif;
  color: $abyss;
  background: linear-gradient(135deg, $ice, $gold);
  border: none;
  border-radius: 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(160, 212, 255, 0.15);
  transition: transform 0.25s, box-shadow 0.25s;
  .btn-icon {
    font-size: 1.1rem;
  }
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6),
      0 0 30px rgba(160, 212, 255, 0.25);
  }
}

/* ========== 图库区域 ========== */
.section {
  position: relative;
  z-index: 2;
  padding: 80px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.sort-controls {
  margin: 16px 0 24px;
  .sort-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    font-size: 0.95rem;
    font-family: "Cinzel", "Noto Serif SC", serif;
    cursor: pointer;
    border-radius: 28px;
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.7),
      rgba(8, 14, 28, 0.8)
    );
    color: $text;
    border: 1px solid $card-border;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(160, 212, 255, 0.05);
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
    .sort-icon {
      color: $gold;
      font-size: 1rem;
    }
    &:hover {
      transform: translateY(-3px);
      border-color: rgba(212, 184, 122, 0.3);
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.6),
        0 0 20px rgba(160, 212, 255, 0.1);
    }
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.card {
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    animation: fadeInUp 0.6s ease forwards;
  }
  &.loaded .card-inner img {
    filter: none;
    opacity: 1;
  }
}

.card-inner {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6);
  border: 1px solid $card-border;
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s;
  background: $card-bg;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: blur(20px) grayscale(30%);
    opacity: 0.7;
    transition: filter 0.6s ease, opacity 0.6s ease;
  }

  .overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 14px 0;
    background: linear-gradient(transparent, rgba(5, 10, 24, 0.85));
    text-align: center;
    opacity: 0;
    transition: opacity 0.4s;
    span {
      color: $holy;
      font-family: "Cinzel", serif;
      font-size: 1rem;
      letter-spacing: 2px;
      background: rgba(5, 10, 24, 0.6);
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid rgba(212, 184, 122, 0.2);
    }
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
    border-color: rgba(212, 184, 122, 0.25);
    .overlay {
      opacity: 1;
    }
  }

  .like-btn {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.2);
    }
    .heart {
      width: 24px;
      height: 24px;
      background: url("/icons/heart-red-outline.svg") no-repeat center;
      background-size: contain;
      transition: all 0.3s;
      filter: drop-shadow(0 0 6px rgba(160, 212, 255, 0.5));
    }
    .liked {
      background: url("/icons/heart-red-filled.svg") no-repeat center;
      background-size: contain;
      animation: pop 0.4s ease;
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        background: rgba(160, 212, 255, 0.15);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: pulse 1.2s ease-out infinite;
        pointer-events: none;
      }
    }
    .like-count {
      font-size: 0.95rem;
      color: $ice;
      text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
      font-weight: bold;
    }
  }
}

.sentinel {
  height: 20px;
  width: 100%;
  margin: 10px 0;
}
.loading,
.finished {
  text-align: center;
  padding: 20px;
  color: $text-dim;
  font-size: 0.9rem;
  letter-spacing: 1px;
  .ice-symbol {
    color: $ice;
    margin: 0 8px;
  }
}
.finished {
  color: $gold;
  font-style: italic;
}

/* ========== Lightbox ========== */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(5, 10, 24, 0.96);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  img {
    max-width: 85%;
    max-height: 85%;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  }
  .close,
  .prev,
  .next {
    position: absolute;
    color: $text;
    font-size: 2.5rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: color 0.3s;
    &:hover {
      color: $ice;
    }
  }
  .close {
    top: 20px;
    right: 20px;
  }
  .prev {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  .next {
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}

/* ========== 上传弹窗 ========== */
.upload-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(5, 10, 24, 0.9),
    rgba(8, 14, 28, 0.86)
  );
  backdrop-filter: blur(10px);
}
.upload-modal {
  width: 720px;
  max-width: calc(100% - 40px);
  padding: 36px;
  border-radius: 16px;
  background: linear-gradient(
    180deg,
    rgba(6, 10, 20, 0.94),
    rgba(8, 14, 28, 0.92)
  );
  border: 1px solid $card-border;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.75),
    inset 0 1px 0 rgba(160, 212, 255, 0.04);
  color: $text;
  font-family: "Noto Serif SC", "Cinzel", serif;

  h3 {
    margin: 0 0 16px;
    font-size: 1.4rem;
    text-align: center;
    color: $gold-light;
    letter-spacing: 2px;
  }
  .stats {
    margin: 16px 0;
    text-align: center;
    strong {
      color: $ice;
    }
  }
  .tip-container {
    padding: 14px 18px;
    background: rgba(6, 10, 20, 0.5);
    border-left: 3px solid rgba(160, 212, 255, 0.15);
    border-radius: 8px;
    margin-bottom: 16px;
    .tips-list {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        padding: 6px 0 6px 28px;
        font-size: 0.9rem;
        color: $text-dim;
        position: relative;
        &::before {
          content: "⚜️";
          position: absolute;
          left: 0;
          top: 6px;
          font-size: 0.7rem;
          opacity: 0.5;
        }
      }
    }
  }
  .tip {
    text-align: right;
    font-size: 0.85rem;
    color: $text-dim;
  }
  label {
    display: block;
    margin-bottom: 14px;
    font-size: 0.9rem;
    color: $text-dim;
    input[type="text"],
    input[type="file"] {
      width: 100%;
      margin-top: 6px;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid $card-border;
      background: rgba(6, 10, 20, 0.6);
      color: $text;
 
      outline: none;
      transition: border-color 0.2s;
      &:focus {
        border-color: $ice;
        box-shadow: 0 0 8px rgba(160, 212, 255, 0.1);
      }
    }
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    button {
      padding: 10px 24px;
      border-radius: 24px;
      border: none;
      cursor: pointer;
      font-family: "Cinzel", serif;
      font-weight: 700;
      letter-spacing: 1px;
      transition: transform 0.2s, box-shadow 0.2s;
      &:not(.cancel) {
        background: linear-gradient(135deg, $ice, $gold);
        color: $abyss;
        box-shadow: 0 6px 20px rgba(160, 212, 255, 0.2);
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(160, 212, 255, 0.3);
        }
        &:disabled {
          opacity: 0.4;
          animation: cursorAnimation_disabled 1s infinite step-start;
        }
      }
      &.cancel {
        background: transparent;
        border: 1px solid $card-border;
        color: $text-dim;
        &:hover {
          background: rgba(160, 212, 255, 0.04);
        }
      }
    }
  }
}

/* ========== 排行榜 ========== */
.ranking-panel {
  width: 210px;
  padding: 14px;
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 1200;
  background: linear-gradient(
    180deg,
    rgba(6, 10, 20, 0.92),
    rgba(8, 14, 28, 0.9)
  );
  border-radius: 16px;
  border: 1px solid $card-border;
  backdrop-filter: blur(8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(160, 212, 255, 0.03);
  color: $text;
  font-family: "Noto Serif SC", "Cinzel", serif;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding-bottom: 6px;
    .ranking-title {
      margin: 0;
      font-size: 1rem;
      color: $gold-light;
      letter-spacing: 1px;
    }
    .panel-total {
      font-size: 0.75rem;
      color: $text-dim;
    }
    .toggle-icon {
      font-size: 0.9rem;
      color: $ice;
    }
  }
  .ranking-list {
    list-style: none;
    padding: 0;
    margin: 10px 0 0;
    max-height: 50vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(160, 212, 255, 0.15);
      border-radius: 4px;
    }
    .ranking-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      margin-bottom: 6px;
      border-radius: 10px;
      background: rgba(6, 10, 20, 0.5);
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      }
      .rank {
        width: 28px;
        text-align: center;
        font-weight: 800;
        font-size: 0.9rem;
        color: $ice;
      }
      .name {
        flex: 1;
        padding: 0 8px;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .count {
        font-size: 0.8rem;
        color: $ice;
        font-weight: 700;
      }

      &.rank-1 {
        background: linear-gradient(
          135deg,
          rgba(160, 212, 255, 0.3),
          rgba(212, 184, 122, 0.3)
        );
        .rank,
        .name,
        .count {
          color: $gold-light;
        }
      }
      &.rank-2 {
        background: linear-gradient(
          135deg,
          rgba(160, 212, 255, 0.18),
          rgba(212, 184, 122, 0.15)
        );
      }
      &.rank-3 {
        background: linear-gradient(
          135deg,
          rgba(160, 212, 255, 0.1),
          rgba(212, 184, 122, 0.08)
        );
      }
    }
  }
}

/* ========== 浮动小人 ========== */
.floating-chibis {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}
.chibi-img {
  position: absolute;
  width: 80px;
  user-select: none;
  transform-origin: center center;
  pointer-events: auto;
}

/* ========== 动画 ========== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.6);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.6);
    opacity: 0;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== 响应式 ========== */
@media (max-width: 980px) {
  .section {
    padding: 60px 14px 30px;
  }
  .gallery-grid {
    gap: 16px;
  }
  .upload-modal {
    width: calc(100% - 24px);
    padding: 20px;
  }
  .ranking-panel {
    width: 180px;
    top: 60px;
    right: 8px;
    padding: 10px;
  }
}

@media (max-width: 640px) {
  .ranking-panel {
    display: none;
  }
  .upload-btn {
    bottom: 40px;
    left: 16px;
    padding: 10px 16px;
    font-size: 0.85rem;
  }
}
</style>
