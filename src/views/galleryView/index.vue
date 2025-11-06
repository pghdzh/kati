<template>
  <div class="gallery-container">
    <button class="upload-btn" @click="openUploadModal">上传图片</button>

    <section class="gallery section">
      <div class="sort-controls">
        <button @click="toggleSort" class="sort-btn">
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
              <span>查看大图</span>
            </div>
            <button class="like-btn" @click.stop="handleLike(img)">
              <i class="heart" :class="{ liked: img.liked }"></i>
              <span class="like-count">{{ img.likeCount }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- sentinel：用于触发无限滚动 -->
      <div ref="sentinel" class="sentinel"></div>
      <!-- 可选：加载中/结束提示 -->
      <div class="loading" v-if="loading">加载中...</div>
      <div class="finished" v-if="finished">已全部加载</div>
    </section>
    <aside class="ranking-panel">
      <div class="panel-header" @click="expanded = !expanded">
        <h3 class="ranking-title">排行榜</h3>
        <span>共{{ imgTotal }}张</span>
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
    <!-- Lightbox Modal -->
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
        <h3>批量上传图片</h3>
        <div class="tip-container">
          <ul class="tips-list">
            <li>
              审核规则： 1.不要色情倾向（不要露三点，我怕被封）
              2.要我能认出是卡提希娅。
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
          今日已上传：<strong>{{ uploadedToday }}</strong> 张，
          剩余可上传：<strong>{{ remaining }}</strong> 张
        </p>
        <label>
          昵称：
          <input v-model="nickname" type="text" placeholder="请输入昵称" />
        </label>
        <label>
          选择图片（最多 {{ remaining }} 张）：
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
            {{ isUploading ? "上传中..." : "立即上传" }}
          </button>
          <button class="cancel" @click="closeUploadModal">取消</button>
        </div>
      </div>
    </div>

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
import { uploadImages } from "@/api/modules/images"; // 前面封装的上传接口
import { getRankingList } from "@/api/modules/ranking"; // 根据你的实际路径调整
import { gsap } from "gsap"; // ← 本地引入
import { getImagesLikesList, likeImage } from "@/api/modules/imagesLikes";
import { debounce } from "lodash";

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
// 获取已点赞 ID 数组
function getLikedIds(): number[] {
  const data = localStorage.getItem("likedImageIds");
  return data ? JSON.parse(data) : [];
}

// 保存已点赞 ID 数组
function setLikedIds(ids: number[]) {
  localStorage.setItem("likedImageIds", JSON.stringify(ids));
}

async function handleLike(img: ImageItem) {
  if (img.liked) return; // 已点过就不重复调用

  try {
    await likeImage(img.id); // 调用后端接口
    img.likeCount += 1; // 本地更新点赞数
    img.liked = true; // 标记已点赞

    // 更新 localStorage
    const likedIds = getLikedIds();
    likedIds.push(img.id);
    setLikedIds(likedIds);
  } catch (error) {
    console.error("点赞失败", error);
    alert("点赞失败，请稍后重试");
  }
}

interface ImageItem {
  src: string;
  alt: string;
  likeCount: number;
  id: number;
  liked: Boolean;
}

interface RankingItem {
  id?: number; // 如果接口返回有 id，可加上
  nickname: string;
  count: number;
}
const rankingList = ref<RankingItem[]>([]);
const expanded = ref(true);

// 默认分页参数（如不分页可省略）
const page = 1;
const pageSize = 99;

const fetchRanking = async () => {
  const res = await getRankingList({ page, pageSize, character_key: "kati" });
  if (res.success) {
    rankingList.value = res.data;
  } else {
    console.error("获取排行榜失败", res.message);
  }
};

// 响应式存放最终图片列表
const images = ref<ImageItem[]>([]);

const pageImage = ref(1);
const limit = ref(10);
const loading = ref(false);
const finished = ref(false);

const sentinel = ref<HTMLElement | null>(null);

// 1. 在外层创建一个单例 observerCard
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
// 2. 每次有新卡片时，都调用这个方法去挂载观察
async function observeNewCards(startIndex = 0) {
  await nextTick();
  const cards = document.querySelectorAll<HTMLElement>(".card");
  for (let i = startIndex; i < cards.length; i++) {
    observerCard.observe(cards[i]);
  }
}
const imgTotal = ref(0);
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
      src: item.url,
      alt: "",
      likeCount: item.like_count,
      id: item.id, // 如果需要的话，方便点赞用
      liked: likedIds.includes(item.id),
    }));
    if (list.length === 0) {
      finished.value = true;
      return;
    }
    // 记录加载前的长度，方便后面找出“新增”节点
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

// 3. 给 loadNextPage 包装一个防抖版
const debouncedLoad = debounce(
  () => {
    loadNextPage();
  },
  200,
  { leading: true, trailing: false }
);

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

// 渐显＆Blur‑Up 效果
function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement;
  const card = img.closest(".card");
  card?.classList.add("loaded");
}

// 上传弹窗逻辑

const uploadModalOpen = ref(false);
const nickname = ref("");
const fileInput = ref<HTMLInputElement>();
const selectedFiles = ref<File[]>([]);

// 从 localStorage 读取“今天”已上传数量
function getTodayKey() {
  return `uploaded_${new Date().toISOString().slice(0, 10)}`;
}
const uploadedToday = ref<number>(
  Number(localStorage.getItem(getTodayKey()) || 0)
);
const remaining = computed(() => Math.max(27 - uploadedToday.value, 0));

// 控制提交按钮
const canSubmit = computed(() => {
  return (
    nickname.value.trim().length > 0 &&
    selectedFiles.value.length > 0 &&
    selectedFiles.value.length <= remaining.value
  );
});

// 放在 script 顶部，或者 utils 里
function clearOldUploadRecords() {
  const today = new Date();
  const storage = window.localStorage;
  for (const key of Object.keys(storage)) {
    if (!key.startsWith("uploaded_")) continue;

    // key 格式 uploaded_YYYY-MM-DD
    const dateStr = key.slice("uploaded_".length);
    const recordDate = new Date(dateStr);
    if (isNaN(recordDate.getTime())) continue;

    // 计算相差天数
    const diffMs = today.getTime() - recordDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    // 如果超过 2 天，就删掉
    if (diffDays > 2) {
      storage.removeItem(key);
    }
  }
}

function openUploadModal() {
  clearOldUploadRecords();
  nickname.value = "";
  selectedFiles.value = [];
  if (fileInput.value) fileInput.value.value = "";
  // 每次打开重新刷新已上传数
  uploadedToday.value = Number(localStorage.getItem(getTodayKey()) || 0);
  uploadModalOpen.value = true;
}
function closeUploadModal() {
  uploadModalOpen.value = false;
}

// 本地截断到剩余数量
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
      `今天最多还能上传 ${remaining.value} 张，已为你截取前 ${remaining.value} 张`
    );
    selectedFiles.value = files.slice(0, remaining.value);
  } else {
    selectedFiles.value = files;
  }
}
const isUploading = ref(false);
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
    // 更新 localStorage
    uploadedToday.value += uploadedCount;
    localStorage.setItem(getTodayKey(), String(uploadedToday.value));

    alert(`成功上传 ${uploadedCount} 张图片`);
    closeUploadModal();
    // …可选：刷新画廊列表或把新图片追加到 images …
  } catch (err: any) {
    console.error(err);
    alert(err.message || "上传失败");
  } finally {
    isUploading.value = false;
  }
}

interface Chibi {
  src: string;
  top: number;
  left: number;
}

const chibiList = ref<Chibi[]>([]);
let sentinelObserver: IntersectionObserver;
// Scroll-triggered lazy animation
onMounted(async () => {
  // 1. 拉排行榜
  await fetchRanking();

  // 2. 拉第一页图片并挂载动画 observer
  await loadNextPage(); // 内部会调用 observeNewCards(oldLen)
  // 对首次卡片做一次完整 observe
  observeNewCards(0);

  // 3. 初始化 sentinelObserver，再 observe
  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) debouncedLoad();
    },
    { rootMargin: "0px", threshold: 0.1 }
  );
  if (sentinel.value) {
    sentinelObserver.observe(sentinel.value);
  }
  // 1. 基础配置信息
  const total = 9;
  let pickCount = 3; // 每次抽取 3 张
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = window.innerWidth <= 768;
  // 如果已知单张小人图片的宽高，可避免超出边界；
  // 假设小人图片宽 100px、高 100px，按需替换：
  const imgWidth = 100;
  const imgHeight = 100;

  // 2. Fisher–Yates 洗牌函数
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 3. 随机选出 3 个编号
  if (isMobile) {
    pickCount = 1;
  }
  const nums = shuffle(Array.from({ length: total }, (_, k) => k + 1));
  const picks = nums.slice(0, pickCount);

  // 4. 生成随机位置并填充 chibiList
  chibiList.value = []; // 先清空
  picks.forEach((i) => {
    chibiList.value.push({
      src: `/QImages/1 (${i}).png`,
      left: Math.random() * (vw - imgWidth), // 保证不超出左右边界
      top: Math.random() * (vh - imgHeight), // 保证不超出上下边界
    });
  });

  // 2. 等 img 渲染到 DOM
  await nextTick();

  // 3. 给每个小人绑定 GSAP 动画
  const imgs = document.querySelectorAll<HTMLImageElement>(".chibi-img");
  imgs.forEach((img, index) => {
    const padding = 200; // 边缘预留空间
    // ✅ 初始出场动画（闪现）
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

    // ✅ 鼠标靠近闪避
    img.addEventListener("mouseenter", () => {
      gsap.killTweensOf(img);

      gsap.to(img, {
        x: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        y: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        duration: 1.2,
        ease: "back.out(2)",
        onComplete: () => {
          // 闪避完成后，再重新启用动画
          animate(img);
        },
      });
    });

    const animate = (img: HTMLImageElement) => {
      let { x, y } = img.getBoundingClientRect();
      let deltaX = (Math.random() - 0.5) * 200;
      let deltaY = (Math.random() - 0.5) * 200;

      // 预测一下偏移后的位置
      let nextX = x + deltaX;
      let nextY = y + deltaY;

      // 校正：防漂出左、右、上、下边界
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
  // 以及你在 onMounted 里新建的其它 Observer
});
</script>

<style lang="scss" scoped>
$bg: #050714; // 深海夜色（卡提希娅风）
$accent: #7fd8ff; // 冷海蓝高光（主要点光）
$text: #f4f8fb; // 主文字（微冷象牙）
@use "sass:color";

// 辅助色（保留少量毒色点缀与暗紫）
$purple: #ffd78a;
$venom: #8ca6bd;
$muted: rgba(234, 233, 238, 0.78);
$card-border: rgba($accent, 0.04);
$soft-shadow: rgba(0, 0, 0, 0.64);
$halo: rgba($accent, 0.06);

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

/* 固定浮动小 chibi 层（保留） */
.floating-chibis {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.chibi-img {
  position: absolute;
  width: 80px;
  user-select: none;
  transform-origin: center center;
  pointer-events: auto;
  z-index: 10;
}

/* 画廊容器整体背景改为海感光斑 + 深海底 */
.gallery-container {
  background: radial-gradient(circle at center, #071018 0%, $bg 100%);
  color: $text;
  min-height: 100vh;
  padding-bottom: 60px;

  .section {
    padding: 80px 20px;
    max-width: 1200px;
    margin: 0 auto;

    .sort-controls {
      margin: 16px 0;

      .sort-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 28px 10px 56px;
        font-size: 1rem;
        line-height: 1;
        font-family: "PingFang SC", "Noto Sans SC", "Helvetica Neue", Arial,
          sans-serif;
        cursor: pointer;
        border-radius: 28px;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba($purple, 0.03);

        /* 暗紫底 + 紫→海蓝徽记渐变（替代原血红） */
        background: linear-gradient(
          90deg,
          rgba(10, 8, 14, 0.82) 0%,
          rgba(8, 10, 16, 0.92) 50%,
          rgba(6, 6, 10, 0.96) 100%
        );
        color: $text;
        box-shadow: 0 10px 28px rgba(4, 6, 8, 0.56),
          inset 0 1px 0 rgba($purple, 0.01);
        transition: transform 200ms cubic-bezier(0.2, 0.9, 0.25, 1),
          box-shadow 200ms ease, background 260ms ease, color 160ms ease,
          filter 200ms ease;
        -webkit-tap-highlight-color: transparent;
        will-change: transform, box-shadow, filter;

        /* 左侧徽记 —— 暗紫到海蓝渐变（替换原血红徽记） */
        &::after {
          content: "";
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%) rotate(-12deg);
          width: 18px;
          height: 22px;
          border-radius: 4px;
          background: linear-gradient(180deg, $purple 0%, $accent 70%);
          box-shadow: 0 6px 18px rgba(24, 12, 48, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.02);
          clip-path: polygon(
            50% 0,
            78% 25%,
            100% 45%,
            50% 100%,
            0% 45%,
            22% 25%
          );
          pointer-events: none;
          z-index: 3;
          transition: transform 220ms ease, opacity 220ms ease,
            box-shadow 220ms ease;
        }

        /* 左侧微光环（海蓝微光） */
        &::before {
          content: "";
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 35%,
            rgba($accent, 0.06),
            transparent 45%
          );
          filter: blur(6px);
          pointer-events: none;
          opacity: 0.9;
          z-index: 1;
        }

        /* hover：徽记放大 + 暗底微变（海蓝光晕） */
        &:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 22px 66px rgba(4, 6, 8, 0.66),
            0 0 44px rgba($accent, 0.12);
          filter: saturate(1.04) brightness(1.02);
          color: $accent;
          background: linear-gradient(
            90deg,
            rgba(10, 8, 14, 0.88) 0%,
            rgba(8, 10, 16, 0.94) 50%,
            rgba(6, 6, 10, 0.98) 100%
          );
        }

        &:hover::after {
          transform: translateY(-56%) rotate(-6deg) scale(1.12);
          box-shadow: 0 10px 30px rgba($accent, 0.14),
            inset 0 2px 6px rgba(255, 255, 255, 0.06);
          opacity: 1;
        }

        &:active {
          transform: translateY(-2px) scale(0.995);
          box-shadow: 0 10px 28px rgba(4, 6, 8, 0.5),
            0 0 20px rgba($accent, 0.06);
        }

        &:focus-visible {
          outline: none;
          box-shadow: 0 22px 66px rgba(4, 6, 8, 0.66),
            0 0 0 6px rgba($accent, 0.06);
        }
      }
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;

      .card {
        perspective: 1000px;
        opacity: 0;
        transform: translateY(20px);

        &.visible {
          animation: fadeInUp 0.6s ease forwards;
        }

        &.loaded {
          .card-inner img {
            filter: none;
            opacity: 1;
          }
        }

        .card-inner {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
          transform-style: preserve-3d;
          transition: transform 0.5s ease, box-shadow 0.5s ease;

          &:hover {
            transform: rotateY(6deg) rotateX(3deg) scale(1.05);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.9);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            filter: blur(20px) grayscale(40%);
            opacity: 0.8;
            transition: filter 0.6s ease, opacity 0.6s ease;
          }

          .overlay {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 12px 0;
            background: linear-gradient(transparent, rgba(2, 6, 10, 0.8));
            text-align: center;
            opacity: 0;
            transition: opacity 0.4s;

            span {
              color: $text;
              font-family: "Cinzel Decorative", serif;
              font-size: 1.1rem;
              letter-spacing: 1px;
              background: rgba(0, 0, 0, 0.6);
              padding: 4px 12px;
              border-radius: 20px;
            }
          }

          &:hover .overlay {
            opacity: 1;
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
            border-radius: 50%;
            transition: transform 0.2s ease;

            &:hover {
              transform: scale(1.3);
            }

            .heart {
              width: 24px;
              height: 24px;
              background: url("/icons/heart-red-outline.svg") no-repeat center;
              background-size: contain;
              transition: all 0.3s ease;
              filter: drop-shadow(0 0 6px rgba($accent, 0.6));
            }

            .liked {
              background: url("/icons/heart-red-filled.svg") no-repeat center;
              background-size: contain;
              animation: pop 0.4s ease;
              position: relative;

              &::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                background: rgba($accent, 0.18);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: pulse 1.2s ease-out infinite;
                pointer-events: none;
              }
            }

            .like-count {
              font-size: 1rem;
              color: red;
              text-shadow: 0 0 6px rgba(0, 0, 0, 0.48);
              font-weight: bold;
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
        }
      }
    }
  }

  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 10, 0.96);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    img {
      max-width: 85%;
      max-height: 85%;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.9);
      animation: fadeInUp 0.4s ease;
    }

    .close,
    .prev,
    .next {
      position: absolute;
      color: $text;
      font-size: 2.5rem;
      cursor: pointer;
      user-select: none;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.3s;

      &:hover {
        color: $accent;
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

  .upload-btn {
    position: fixed;
    bottom: 64px;
    left: 24px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    font-size: 1rem;
    z-index: 10;
    cursor: pointer;
    user-select: none;

    color: #071018; // 深色文本以配合亮色按钮
    background: linear-gradient(90deg, $accent 0%, $purple 60%);
    border-radius: 28px;
    backdrop-filter: blur(6px) saturate(120%);
    box-shadow: 0 14px 36px rgba(4, 4, 8, 0.54), 0 0 28px rgba($accent, 0.12);
    overflow: visible;
    transition: transform 220ms cubic-bezier(0.2, 0.9, 0.25, 1),
      box-shadow 220ms ease, background 260ms ease, filter 220ms ease;

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 26px 68px rgba(4, 2, 6, 0.62), 0 0 56px rgba($accent, 0.18);
      filter: brightness(1.04) saturate(1.05);
      background: linear-gradient(90deg, $accent, $purple);
    }

    &:active {
      transform: translateY(-2px) scale(0.99);
      box-shadow: 0 16px 44px rgba(4, 2, 6, 0.48), 0 0 36px rgba($accent, 0.1);
    }
  }

  /* upload modal / overlay：改为海蓝 + 暗紫舞台匣 + 微毒点缀 */
  .upload-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      180deg,
      rgba(4, 6, 10, 0.9),
      rgba(8, 6, 12, 0.86)
    );
    backdrop-filter: blur(10px) saturate(0.95);

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(
          800px 260px at 50% 28%,
          rgba($accent, 0.06),
          transparent 14%
        ),
        radial-gradient(
          420px 160px at 18% 72%,
          rgba($purple, 0.03),
          transparent 18%
        ),
        linear-gradient(180deg, rgba(0, 0, 0, 0.26), transparent 40%);
      mix-blend-mode: screen;
    }
  }

  .upload-modal {
    position: relative;
    width: 720px;
    max-width: calc(100% - 40px);
    padding: 36px;
    border-radius: 16px;
    overflow: hidden;
    z-index: 2100;
    color: $text;
    font-family: "Helvetica Neue", "Noto Sans SC", "PingFang SC", sans-serif;
    -webkit-font-smoothing: antialiased;

    background: linear-gradient(
      180deg,
      rgba(8, 10, 12, 0.94),
      rgba(10, 8, 12, 0.92)
    );
    border: 1px solid rgba($purple, 0.06);
    backdrop-filter: blur(6px) saturate(0.92);
    box-shadow: 0 30px 90px rgba(4, 4, 8, 0.78),
      inset 0 1px 0 rgba($accent, 0.03);

    &::before {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 18px;
      pointer-events: none;
      background: linear-gradient(
        90deg,
        rgba($accent, 0.04),
        rgba($purple, 0.02),
        rgba($accent, 0.03)
      );
      filter: blur(12px);
      mix-blend-mode: screen;
      opacity: 0.95;
    }

    h3 {
      margin: 0 0 16px 0;
      font-size: 1.5rem;
      color: $text;
      font-weight: 900;
      text-align: center;
      letter-spacing: 0.6px;
      text-shadow: 0 6px 20px rgba(6, 4, 8, 0.48);
    }

    .stats {
      margin: 18px 0;
      font-size: 1rem;
      text-align: center;
      color: rgba($text, 0.96);

      strong {
        color: $accent;
      }
    }

    .tip-container {
      margin-top: 18px;
      padding: 14px 18px;
      background: linear-gradient(
        180deg,
        rgba(6, 8, 10, 0.64),
        rgba(6, 6, 8, 0.56)
      );
      border-left: 4px solid rgba($accent, 0.12);
      border-radius: 10px;
      backdrop-filter: blur(4px);
      color: rgba($text, 0.94);

      .tips-list {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          position: relative;
          padding-left: 34px;
          margin-bottom: 10px;
          font-size: 0.95rem;
          color: rgba($text, 0.94);

          &::before {
            content: "";
            position: absolute;
            left: 8px;
            top: 0px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: linear-gradient(90deg, $purple 0%, $accent 100%);
            box-shadow: 0 6px 18px rgba(10, 6, 18, 0.06);
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .tip {
      margin-top: 10px;
      text-align: right;
      font-size: 0.9rem;
      color: rgba($text, 0.86);
    }

    label {
      display: block;
      margin-bottom: 18px;
      font-size: 0.95rem;
      color: rgba($text, 0.96);

      input[type="text"],
      input[type="file"],
      textarea {
        width: 100%;
        margin-top: 8px;
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid rgba($purple, 0.04);
        background: linear-gradient(
          180deg,
          rgba(6, 8, 10, 0.6),
          rgba(6, 6, 8, 0.64)
        );
        color: rgba($text, 0.96);
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.18s ease, box-shadow 0.18s ease,
          transform 0.12s ease;
        box-shadow: inset 0 -4px 10px rgba(0, 0, 0, 0.46);
      }

      input[type="text"]::placeholder,
      textarea::placeholder {
        color: rgba(180, 190, 200, 0.3);
      }

      input[type="text"]:focus,
      input[type="file"]:focus,
      textarea:focus {
        border-color: rgba($accent, 0.36);
        box-shadow: 0 12px 36px rgba($accent, 0.06),
          0 2px 8px rgba($purple, 0.04);
        transform: translateY(-1px);
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 14px;
      margin-top: 28px;
      flex-wrap: wrap;
      align-items: center;

      button {
        padding: 12px 24px;
        border: none;
        border-radius: 24px;
        cursor: pointer;
        font-weight: 800;
        font-size: 0.95rem;
        transition: background 0.22s ease, box-shadow 0.22s ease,
          transform 0.12s ease;
        min-width: 96px;
        color: #071018;
      }

      /* 主按钮：海蓝 → 暗紫 渐变 */
      button:not(.cancel) {
        background: linear-gradient(
          135deg,
          $accent 0%,
          $purple 60%,
          rgba($purple, 6%) 100%
        );
        box-shadow: 0 12px 36px rgba(80, 140, 160, 0.08),
          0 4px 18px rgba(30, 20, 40, 0.04);
        color: #071018;
      }

      button:not(.cancel):hover:not(:disabled) {
        transform: translateY(-4px);
        box-shadow: 0 22px 66px rgba(6, 10, 14, 0.32),
          0 8px 28px rgba($accent, 0.12);
      }

      button:not(.cancel):disabled {
        background: linear-gradient(
          135deg,
          rgba(6, 8, 10, 0.48),
          rgba(6, 6, 8, 0.44)
        );
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
        color: rgba(180, 170, 180, 0.6);
      }

      button.cancel {
        background: transparent;
        border: 2px solid rgba($purple, 0.06);
        color: rgba(238, 228, 233, 0.9);
        min-width: 86px;
        box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.22);
      }

      button.cancel:hover {
        background: rgba($purple, 0.02);
      }
    }
  }

  /* 右侧排行面板：卡提希娅风格（清冷冰蓝 + 圣光金 + 深海暗蓝），已写实颜色（无变量）*/
  .ranking-panel {
    width: 220px;
    padding: 16px;
    position: fixed;
    top: 84px;
    right: 12px;
    z-index: 1200;
    color: #eaf7ff; /* 文字主色（冷白） */
    font-family: "PingFang SC", "Noto Sans SC", "Helvetica Neue", Arial,
      sans-serif;

    background: linear-gradient(
      180deg,
      rgba(6, 8, 12, 0.94),
      rgba(7, 10, 18, 0.92)
    );
    border-radius: 18px;
    border: 1px solid rgba(74, 62, 123, 0.06); /* 深蓝紫的细边 */
    -webkit-backdrop-filter: blur(8px) saturate(0.92);
    backdrop-filter: blur(8px) saturate(0.92);
    box-shadow: 0 18px 56px rgba(3, 4, 8, 0.78),
      inset 0 1px 0 rgba(116, 199, 255, 0.03);

    &.collapsed {
      height: auto;
      padding-bottom: 8px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      padding-bottom: 6px;

      .ranking-title {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 900;
        color: rgba(234, 247, 255, 0.92); /* 稍微柔和的冷白 */
        font-family: "Zhi Mang Xing", "STKaiti", serif;
        letter-spacing: 0.6px;
        text-shadow: 0 6px 18px rgba(6, 4, 8, 0.48);
      }

      .toggle-icon {
        font-size: 1rem;
        color: #74c7ff; /* 冰蓝高光 */
        background: linear-gradient(
          180deg,
          rgba(12, 10, 14, 0.48),
          rgba(8, 6, 10, 0.36)
        );
        padding: 6px 8px;
        border-radius: 9px;
        border: 1px solid rgba(74, 62, 123, 0.04);
        box-shadow: 0 6px 14px rgba(4, 4, 8, 0.48),
          inset 0 1px 0 rgba(116, 199, 255, 0.02);
        transition: transform 220ms, box-shadow 220ms;
      }

      &:hover .toggle-icon,
      &:focus-within .toggle-icon {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(116, 199, 255, 0.08),
          inset 0 1px 0 rgba(74, 62, 123, 0.02);
      }
    }

    .ranking-list {
      list-style: none;
      padding: 0;
      margin: 12px 0 0;
      overflow-y: auto;
      max-height: 55vh;

      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background: linear-gradient(
          180deg,
          rgba(116, 199, 255, 0.16),
          rgba(74, 62, 123, 0.12)
        );
        border-radius: 8px;
        border: 1px solid rgba(50, 30, 60, 0.04);
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    .ranking-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      margin-bottom: 8px;
      border-radius: 12px;
      cursor: default;
      background: linear-gradient(
        180deg,
        rgba(10, 10, 12, 0.56),
        rgba(6, 6, 8, 0.54)
      );
      transition: transform 260ms cubic-bezier(0.2, 0.9, 0.3, 1),
        box-shadow 260ms, background 260ms, color 200ms;
      position: relative;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 18px 48px rgba(6, 4, 8, 0.56),
          0 0 28px rgba(116, 199, 255, 0.04);
        background: linear-gradient(
          90deg,
          rgba(12, 10, 14, 0.66),
          rgba(8, 6, 10, 0.62)
        );
      }

      &:focus-within,
      &:focus {
        outline: none;
        box-shadow: 0 18px 48px rgba(116, 199, 255, 0.06),
          0 0 0 4px rgba(74, 62, 123, 0.03);
        transform: translateY(-4px);
      }

      .rank {
        width: 36px;
        text-align: center;
        font-weight: 900;
        font-size: 1rem;
        color: rgba(234, 247, 255, 0.88);
        flex-shrink: 0;
      }
      .name {
        flex: 1;
        padding: 0 8px;
        font-size: 0.95rem;
        color: #e8f8ff; /* 主文字色略带冰蓝感 */
        font-weight: 700;
        white-space: normal;
        word-break: break-word;
        line-height: 1.25;
      }
      .count {
        font-size: 0.9rem;
        color: #74c7ff; /* 数值用冰蓝强调 */
        font-weight: 800;
        min-width: 36px;
        text-align: right;
        text-shadow: 0 2px 6px rgba(6, 4, 8, 0.04);
        flex-shrink: 0;
      }

      /* 冠军样式：冰蓝 -> 钢蓝 -> 深海蓝，辅以微金光晕（无紫色） */
      &.rank-1 {
        background: linear-gradient(
          135deg,
          #afc3eb 0%,
          rgba(129, 195, 239, 0.9) 20%,
          #ffd78a 100%
        );
        color: #041018; /* 深色文字，保持可读 */
        box-shadow: 0 18px 56px rgba(116, 199, 255, 0.16),
          /* 冰蓝光晕 */ 0 0 30px rgba(255, 216, 134, 0.06); /* 轻微金色晕染（圣光感） */

        .rank,
        .name,
        .count {
          color: #041018;
        }
      }

      /* 亚军样式：深海蓝为主，带冰蓝高光（细微透明高亮） */
      &.rank-2 {
        background: linear-gradient(
          135deg,
          #7593cf 0%,
          rgba(116, 199, 255, 0.9) 40%,
          #ffd78a 100%
        );
        color: #eaf7ff; /* 近白冰冷文字 */
        box-shadow: 0 14px 48px rgba(35, 56, 84, 0.08);

        .rank,
        .name,
        .count {
          color: #eaf7ff;
        }
      }

      /* 季军样式：更沉稳的深海基调 + 极轻微金色提示（不显紫） */
      &.rank-3 {
        background: linear-gradient(
          135deg,
          #4c74c5 0%,
          rgba(65, 159, 222, 0.9) 60%,
          /* 冰蓝薄高光（透明） */ #ffd78a 100%
        );
        color: #eaf7ff;
        box-shadow: 0 10px 36px rgba(28, 36, 50, 0.08);

        .rank {
          color: rgba(255, 235, 200, 0.95); /* 近金/暖色点缀（很轻） */
        }
        .count {
          color: rgba(255, 235, 200, 0.95);
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.28s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
}

/* 动画关键帧：水感/音符/气泡等（低频，仅 transform/opacity） */
@keyframes staff-drift {
  0% {
    transform: translateY(-3%);
    opacity: 0.92;
  }
  50% {
    transform: translateY(5%);
    opacity: 0.98;
  }
  100% {
    transform: translateY(-3%);
    opacity: 0.92;
  }
}

@keyframes note-float {
  0% {
    transform: translateY(0) rotate(-6deg) scale(0.95);
    opacity: 0.86;
  }
  50% {
    transform: translateY(-12px) rotate(3deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(-6deg) scale(0.95);
    opacity: 0.86;
  }
}

@keyframes bubble-rise {
  0% {
    transform: translateY(6px) translateX(0);
    opacity: 0.06;
  }
  50% {
    transform: translateY(-6px) translateX(6px);
    opacity: 0.14;
  }
  100% {
    transform: translateY(-22px) translateX(0);
    opacity: 0.02;
  }
}

@keyframes slow-drift {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0.95;
  }
  50% {
    transform: translateX(-10px) translateY(-6px);
    opacity: 1;
  }
  100% {
    transform: translateX(0) translateY(0);
    opacity: 0.95;
  }
}

/* 响应式（保留你原有行为） */
@media (max-width: 980px) {
  .gallery-container .section {
    padding: 40px 14px;
  }
  .gallery-container .gallery-grid {
    gap: 16px;
  }
  .upload-modal {
    width: calc(100% - 24px);
    padding: 18px;
  }
  .ranking-panel {
    display: none;
  }
}
</style>
