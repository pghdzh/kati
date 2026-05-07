<!--
  卡提希娅资源分享 · 圣典残章（完整重构）
  保留：上传、点赞、排序、本地存储等所有功能
  改变：深海背景、圣典装饰、冰蓝/鎏金卡片、鸢尾暗纹、动态粒子
-->
<template>
  <div class="cartethyia-resources">
    <!-- 背景轮播（保留） -->
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

    <!-- 卡提希娅装饰层 -->
    <div class="cartethyia-decor">
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

    <header class="hero">
      <div class="hero-inner">
        <h1>⚜️ 圣典残章</h1>
        <p class="subtitle">在此镌刻关于卡提希娅的珍贵链接</p>
      </div>
    </header>

    <main class="container">
      <!-- 上传区 -->
      <section class="uploader" :class="{ collapsed: uploaderCollapsed }">
        <div class="uploader-head">
          <button
            class="toggle"
            @click="toggleUploader"
            :aria-expanded="!uploaderCollapsed"
          >
            <span v-if="uploaderCollapsed">展开收录区</span>
            <span v-else>收起收录区</span>
          </button>
        </div>

        <form
          @submit.prevent="addResource"
          class="upload-form"
          :aria-hidden="uploaderCollapsed"
        >
          <div class="row">
            <input
              v-model="form.title"
              type="text"
              placeholder="标题（必填，解压码等信息也写在这里）"
              aria-label="标题"
            />
            <input
              v-model="form.type"
              type="text"
              placeholder="链接类型（网页、B站、网盘等）"
              aria-label="来源"
            />
          </div>

          <div class="row">
            <input
              v-model="form.uploader"
              type="text"
              placeholder="上传人（可选）"
              aria-label="上传人"
            />
            <input
              v-model="form.link"
              type="url"
              placeholder="链接（仅网址，不含中文）"
              aria-label="链接"
            />
          </div>

          <div class="actions">
            <button type="submit" class="btn primary">⚜️ 收录入圣典</button>
          </div>
        </form>
      </section>

      <!-- 资源列表 -->
      <section class="list">
        <div class="list-header">
          <h2>📜 资源列表（{{ resources.length }}）</h2>
          <div class="sort">
            <label>
              排序：
              <select v-model="sortBy">
                <option value="time">按时间（新→旧）</option>
                <option value="likes">按点赞（高→低）</option>
              </select>
            </label>
          </div>
        </div>

        <ul class="items">
          <li v-for="item in sortedResources" :key="item.id" class="item">
            <a
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="title"
              >{{ item.title }}</a
            >

            <div class="meta">
              <div class="left">
                <span class="uploader">{{
                  item.uploader || "匿名的流浪者"
                }}</span>
                <span class="dot">•</span>
                <time :datetime="item.time">{{ formatTime(item.time) }}</time>
              </div>

              <div class="right">
                <button
                  @click.prevent="handleLike(item)"
                  :aria-pressed="likedIds.has(String(item.id))"
                  class="like-btn"
                  :class="{ active: likedIds.has(String(item.id)) }"
                >
                  <img
                    :src="
                      likedIds.has(String(item.id))
                        ? '/icons/heart-red-filled.svg'
                        : '/icons/heart-red-outline.svg'
                    "
                    class="heart-icon"
                    alt="heart"
                  />
                  <span class="count">{{ item.likes }}</span>
                </button>

                <span class="badge">{{ item.type }}</span>
              </div>
            </div>
          </li>
        </ul>

        <p v-if="resources.length === 0" class="empty">
          圣典尚无记载，快来镌刻第一条链接吧！
        </p>
      </section>
    </main>

    <footer class="foot">❖ 点击标题将直接跳转至对应资源 ❖</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  getResourceList,
  createResource,
  likeResource,
} from "@/api/modules/resource";
import { ElMessage } from "element-plus";

interface Resource {
  id: number | string;
  title: string;
  uploader?: string;
  time: string;
  likes: number;
  link: string;
  type: string;
  role_key?: string;
}

const STORAGE_KEY = "kati_resources_v1";
const DEFAULT_ROLE = "kati";

const form = ref<{
  title: string;
  uploader: string;
  link: string;
  type: string;
}>({
  title: "",
  uploader: "",
  link: "",
  type: "",
});

const resources = ref<Resource[]>([]);
const likedIds = ref(new Set<string>());
const sortBy = ref<"time" | "likes">("time");
const uploaderCollapsed = ref(false);

function mapServerToLocal(row: any): Resource {
  return {
    id: row.id,
    title: row.title,
    uploader: row.uploader || "匿名的流浪者",
    time: row.created_at || row.time || new Date().toISOString(),
    likes: row.likes ?? 0,
    link: row.link,
    type: row.storage_type || row.type || "其他",
    role_key: row.role_key,
  };
}

async function loadResources() {
  try {
    const res: any = await getResourceList({
      role_key: DEFAULT_ROLE,
      page: 1,
      pageSize: 100,
    });
    if (res && res.success && Array.isArray(res.data)) {
      resources.value = res.data.map(mapServerToLocal);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.liked && Array.isArray(parsed.liked)) {
            parsed.liked.forEach((id: string) => likedIds.value.add(id));
          }
        } catch {
          /* ignore */
        }
      }
      return;
    }
  } catch (err) {
    console.warn("拉取资源失败，使用本地缓存", err);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.liked && Array.isArray(parsed.liked)) {
        parsed.liked.forEach((id: string) => likedIds.value.add(id));
      }
    }
  } catch {
    /* ignore */
  }
}

function saveLocalCache() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ liked: Array.from(likedIds.value) })
    );
  } catch {
    /* ignore */
  }
}

// ========== 背景图片 ==========
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

// ========== 粒子样式 ==========
const getParticleStyle = (i: number) => {
  const colors = ["#a0d4ff", "#d4b87a", "#f0f5fc"];
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = 2 + Math.random() * 4;
  const delay = Math.random() * 8;
  const dur = 6 + Math.random() * 8;
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: colors[i % 3],
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
  };
};

onMounted(() => {
  loadResources();
  Imgtimer = window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % Math.max(1, randomFive.value.length);
  }, 5200);
  uploaderCollapsed.value = window.innerWidth <= 640;
});

function toggleUploader() {
  uploaderCollapsed.value = !uploaderCollapsed.value;
}

onBeforeUnmount(() => {
  if (Imgtimer) clearInterval(Imgtimer);
});

async function addResource() {
  const t = form.value.title.trim();
  const l = form.value.link.trim();
  if (!t || !l) {
    return ElMessage.warning("请填写完整信息");
  }
  if (!/^https?:\/\//i.test(l)) {
    return ElMessage.error("请输入正确的链接（https开头）");
  }
  try {
    const payload = {
      title: t,
      uploader: form.value.uploader.trim() || "匿名的流浪者",
      link: l,
      storage_type: form.value.type,
      role_key: DEFAULT_ROLE,
    };
    const res: any = await createResource(payload);
    if (res && res.success && res.data) {
      resources.value.unshift(mapServerToLocal(res.data));
      saveLocalCache();
      form.value = { title: "", uploader: "", link: "", type: "" };
      ElMessage.success("收录成功 ⚜️");
      return;
    }
    ElMessage.error("收录失败");
  } catch (err) {
    console.warn("创建资源失败", err);
  }
}

async function handleLike(item: Resource) {
  const id = item.id;
  const wasLiked = likedIds.value.has(String(id));
  if (wasLiked) {
    likedIds.value.delete(String(id));
    item.likes = Math.max(0, item.likes - 1);
  } else {
    likedIds.value.add(String(id));
    item.likes++;
  }
  saveLocalCache();

  try {
    const action = wasLiked ? "unlike" : "like";
    const res: any = await likeResource(id, action);
    if (
      res &&
      res.success &&
      res.data &&
      typeof res.data.likes !== "undefined"
    ) {
      item.likes = res.data.likes;
    }
  } catch (err) {
    console.warn("点赞接口调用失败，回滚本地", err);
    if (wasLiked) {
      likedIds.value.add(String(id));
      item.likes++;
    } else {
      likedIds.value.delete(String(id));
      item.likes = Math.max(0, item.likes - 1);
    }
    saveLocalCache();
  }
}

const sortedResources = computed(() => {
  const arr = [...resources.value];
  if (sortBy.value === "time") {
    arr.sort((a, b) => +new Date(b.time) - +new Date(a.time));
  } else {
    arr.sort((a, b) => b.likes - a.likes);
  }
  return arr;
});

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
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
$card-bg: rgba(6, 10, 20, 0.5);
$card-border: rgba(160, 212, 255, 0.08);
$shadow: 0 16px 40px rgba(0, 0, 0, 0.7);

.cartethyia-resources {
  position: relative;
  min-height: 100vh;
  color: $text;
  display: flex;
  flex-direction: column;
 
  font-family: "Noto Serif SC", "Cinzel", "STKaiti", system-ui, serif;
  -webkit-font-smoothing: antialiased;
  background: linear-gradient(180deg, $abyss 0%, $deep 100%);
  overflow-x: hidden;

  /* 背景轮播 */
  .carousel {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(5, 10, 24, 0.6);
      z-index: 1;
      mix-blend-mode: multiply;
    }
    .carousel-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.2s ease;
      filter: brightness(0.8) saturate(0.6) hue-rotate(10deg);
      &.active {
        opacity: 1;
      }
    }
  }
  .carousel2 {
    display: none;
  }

  /* 卡提希娅装饰层 */
  .cartethyia-decor {
    position: fixed;
    inset: 0;
    z-index: 1;
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

  /* 顶部标题 */
  .hero {
    position: relative;
    z-index: 2;
    padding: 18px 12px;
    background: linear-gradient(
      180deg,
      rgba(6, 10, 20, 0.6),
      rgba(5, 10, 24, 0.4)
    );
    backdrop-filter: blur(8px);
    border-bottom: 1px solid $card-border;

    .hero-inner {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 900;
        letter-spacing: 2px;
        background: linear-gradient(180deg, $holy, $ice, $gold);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .subtitle {
        color: $text-dim;
        font-size: 0.85rem;
      }
    }
  }

  /* 主体 */
  .container {
    position: relative;
    z-index: 2;
    max-width: 1000px;
    margin: 20px auto;
    padding: 0 16px;
    width: 100%;
    box-sizing: border-box;
  }

  /* 上传区 */
  .uploader {
    border-radius: 14px;
    padding: 0;
    box-shadow: $shadow;
    border: 1px solid $card-border;
    background: linear-gradient(
      180deg,
      rgba(6, 10, 20, 0.45),
      rgba(5, 10, 24, 0.35)
    );
    backdrop-filter: blur(6px);

    .uploader-head {
      display: flex;
      justify-content: flex-end;
      padding: 10px 14px;
      .toggle {
        background: rgba(160, 212, 255, 0.06);
        border: 1px solid $card-border;
        color: $ice;
        padding: 6px 14px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        font-family: "Cinzel", serif;
        letter-spacing: 1px;
        transition: all 0.2s;
        &:hover {
          background: rgba(160, 212, 255, 0.12);
          border-color: $ice;
        }
      }
    }

    .upload-form {
      padding: 0 14px 14px;
      max-height: 500px;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;

      .row {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
        input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid $card-border;
          background: rgba(5, 10, 24, 0.6);
          color: $text;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
          &::placeholder {
            color: rgba($text, 0.3);
          }
          &:focus {
            border-color: $ice;
          }
        }
      }

      .actions {
        .btn.primary {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          font-family: "Cinzel", serif;
          letter-spacing: 1px;
          cursor: pointer;
          background: linear-gradient(135deg, $ice, $gold);
          color: $abyss;
          box-shadow: 0 6px 18px rgba(160, 212, 255, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
          &:active {
            transform: translateY(1px);
          }
        }
      }
    }

    &.collapsed .upload-form {
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  /* 资源列表 */
  .list {
    margin-top: 24px;

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      h2 {
        font-size: 1.1rem;
        margin: 0;
        color: $gold;
        letter-spacing: 1px;
      }
      .sort select {
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid $card-border;
        background: rgba(5, 10, 24, 0.6);
        color: $text;
        font-family: inherit;
        &:focus {
          outline: none;
          border-color: $ice;
        }
      }
    }

    .items {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 60vh;
      overflow-y: auto;

      .item {
        border-radius: 14px;
        padding: 14px 18px;
        margin-bottom: 12px;
        background: linear-gradient(
          135deg,
          rgba(6, 10, 20, 0.5),
          rgba(8, 14, 28, 0.45)
        );
        border: 1px solid $card-border;
        backdrop-filter: blur(6px);
        transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        position: relative;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
          border-color: rgba(212, 184, 122, 0.25);
        }

        .title {
          display: block;
          color: $holy;
          font-weight: 700;
          text-decoration: none;
          margin-bottom: 10px;
          font-size: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0.5px;
          &:hover {
            color: $ice;
          }
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;

          .left {
            display: flex;
            align-items: center;
            gap: 8px;
            .uploader {
              color: $gold;
              font-weight: 600;
            }
            .dot {
              opacity: 0.4;
            }
            time {
              color: $text-dim;
            }
          }

          .right {
            display: flex;
            align-items: center;
            gap: 10px;

            .like-btn {
              background: transparent;
              border: none;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              padding: 4px 8px;
              border-radius: 12px;
              color: $text-dim;
              transition: transform 0.2s;
              &:hover {
                transform: translateY(-2px);
              }
              &.active .heart-icon {
                filter: none;
              }
              .heart-icon {
                width: 18px;
                height: 18px;
                filter: grayscale(100%) opacity(0.7);
              }
              .count {
                font-weight: 700;
              }
            }

            .badge {
              padding: 4px 10px;
              border-radius: 20px;
              font-size: 0.7rem;
              font-weight: 700;
              background: rgba(160, 212, 255, 0.08);
              color: $ice;
              border: 1px solid rgba(160, 212, 255, 0.15);
              letter-spacing: 1px;
            }
          }
        }
      }
    }

    .empty {
      text-align: center;
      color: $text-dim;
      padding: 40px 0;
      font-style: italic;
    }
  }

  /* 页脚 */
  .foot {
    position: relative;
    z-index: 2;
    text-align: center;
    color: rgba($text-dim, 0.7);
    font-size: 0.8rem;
    margin: 30px 0 40px;
    letter-spacing: 1px;
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

  @media (max-width: 640px) {
    padding-top: 70px;
    .carousel1 {
      display: none;
    }
    .carousel2 {
      display: block;
    }
    .upload-form .row {
      flex-direction: column;
    }
    .items .item .title {
      white-space: normal;
    }
  }
}
</style>
