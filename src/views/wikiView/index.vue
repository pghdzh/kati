<!--
  卡提希娅文本分享 · 圣典残章（重构）
  保留：词条列表、搜索、新建/编辑/删除、点赞、详情弹窗、背景轮播
  改变：深海背景、圣典装饰、冰蓝/鎏金卡片、鸢尾暗纹、动态粒子
-->
<template>
  <div class="cartethyia-wiki">
    <!-- 背景轮播（保留原有逻辑） -->
    <div class="carousel" aria-hidden="true">
      <img
        v-for="(src, idx) in randomFive"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>

    <!-- 卡提希娅 CSS 动态装饰层 -->
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

    <!-- 顶部标题区 -->
    <header class="wiki-header">
      <div class="title">
        <h1>⚜️ 卡提文本分享</h1>
        <p class="subtitle">圣典残章 · 文字亦有余温</p>
      </div>
      <div class="actions">
        <input
          v-model="search"
          class="search"
          placeholder="搜索标题或者标签..."
        />
        <button class="btn btn-new" @click="openCreate">新建词条</button>
      </div>
    </header>

    <!-- 词条列表区 -->
    <main class="wiki-body">
      <div v-if="filteredEntries.length === 0" class="empty">
        没有找到匹配的词条 ⚜️
      </div>

      <ul class="entry-list">
        <li v-for="entry in filteredEntries" :key="entry.id" class="entry-card">
          <div class="entry-head">
            <div class="entry-meta" @click="openDetail(entry)">
              <div class="entry-title-wrap">
                <h2 class="entry-title">{{ entry.title }}</h2>
                <span class="entry-badge">#{{ entry.slug || "未设置" }}</span>
              </div>
              <div class="entry-info">
                <span class="meta-item">作者：{{ entry.author }}</span>
                <span class="meta-item"
                  >时间：{{ formatTime(entry.updatedAt) }}</span
                >
              </div>
            </div>

            <div class="entry-actions">
              <button
                class="like"
                :class="{ active: isLiked(entry.id) }"
                :aria-pressed="isLiked(entry.id)"
                @click.stop="toggleLike(entry.id)"
              >
                <img
                  :src="
                    isLiked(entry.id)
                      ? '/icons/heart-red-filled.svg'
                      : '/icons/heart-red-outline.svg'
                  "
                  alt="like"
                />
                <span class="like-count">{{ entry.likes }}</span>
              </button>
              <div class="edit-delete" v-if="canEdit(entry.id)">
                <button class="small" @click="openEdit(entry)">编辑</button>
                <button class="small danger" @click="remove(entry.id)">
                  删除
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </main>

    <!-- 新建/编辑弹窗 -->
    <transition name="fade-zoom">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal">
          <header class="modal-header">
            <h3>{{ editing ? "编辑词条" : "新建词条" }}</h3>
            <button class="close" @click="closeModal">✕</button>
          </header>
          <section class="modal-body">
            <label>
              标题
              <input v-model="form.title" placeholder="输入标题" />
            </label>
            <label>
              词条（短标签）
              <input
                v-model="form.slug"
                placeholder="比如：彩蛋、AI对话记录、二创小故事等等"
              />
            </label>
            <label>
              作者
              <input v-model="form.author" placeholder="作者昵称" />
            </label>
            <label>
              内容
              <textarea
                v-model="form.content"
                rows="8"
                placeholder="在这里输入词条内容"
              ></textarea>
            </label>
          </section>
          <footer class="modal-footer">
            <button class="btn ghost" @click="closeModal">取消</button>
            <button class="btn" @click="submit">
              {{ editing ? "保存" : "创建" }}
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- 详情弹窗 -->
    <transition name="fade-zoom">
      <div class="modal-overlay" v-if="detailEntry">
        <div class="modal detail-modal">
          <header class="modal-header">
            <h3>{{ detailEntry.title }}</h3>
            <button class="close" @click="detailEntry = null">✕</button>
          </header>
          <section class="modal-body">
            <div class="detail-content">{{ detailEntry.content }}</div>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import {
  getWikiList,
  createWiki,
  updateWiki,
  deleteWiki,
  likeWiki,
} from "@/api/modules/wiki";

const LS_MY_WIKI_IDS = "kati:wiki:my_ids";
const myWikiIds: string[] = JSON.parse(
  localStorage.getItem(LS_MY_WIKI_IDS) || "[]"
);
const markAsMine = (id: string | number) => {
  if (!myWikiIds.includes(String(id))) {
    myWikiIds.push(String(id));
    localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds));
  }
};
const canEdit = (id: string | number) => myWikiIds.includes(String(id));

const entries = ref<any[]>([]);
const LS_LIKED_IDS = "kati:wiki:liked_ids";
const likedIds = ref<string[]>(
  JSON.parse(localStorage.getItem(LS_LIKED_IDS) || "[]")
);

const showModal = ref(false);
const editing = ref(false);
const editingId = ref<string | number | null>(null);
const detailEntry = ref<any>(null);
const form = reactive({ title: "", slug: "", author: "", content: "" });
const search = ref("");

function formatTime(ts: string | number | null | undefined) {
  if (!ts) return "未知时间";
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "未知时间";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

async function loadEntries() {
  try {
    const res: any = await getWikiList();
    entries.value = res.data.map((e: any) => ({
      ...e,
      createdAt: e.createdAt || e.created_at,
      updatedAt: e.updatedAt || e.updated_at,
    }));
  } catch (err) {
    console.error(err);
    ElMessage.error("加载词条失败");
  }
}

function openCreate() {
  editing.value = false;
  editingId.value = null;
  form.title = "";
  form.slug = "";
  form.author = "";
  form.content = "";
  showModal.value = true;
}
function openEdit(entry: any) {
  if (!canEdit(entry.id)) {
    ElMessage.warning("只有创建者可以编辑");
    return;
  }
  editing.value = true;
  editingId.value = entry.id;
  form.title = entry.title;
  form.slug = entry.slug;
  form.author = entry.author;
  form.content = entry.content;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

async function submit() {
  if (!form.title.trim() || !form.content.trim()) {
    ElMessage.warning("请填写标题和内容");
    return;
  }
  const payload = {
    title: form.title.trim(),
    author: form.author.trim() || "匿名的流浪者",
    content: form.content.trim(),
    slug: form.slug.trim() || null,
  };
  try {
    if (editing.value && editingId.value) {
      await updateWiki(editingId.value, payload);
      ElMessage.success("编辑成功");
    } else {
      const res: any = await createWiki(payload);
      markAsMine(res.data.id);
      ElMessage.success("创建成功");
    }
    showModal.value = false;
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("提交失败");
  }
}

async function remove(id: string | number) {
  if (!canEdit(id)) return ElMessage.warning("只有创建者可以删除");
  if (!confirm("确认删除该词条？此操作不可撤销")) return;
  try {
    await deleteWiki(id);
    const index = myWikiIds.indexOf(String(id));
    if (index !== -1) myWikiIds.splice(index, 1);
    localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds));
    ElMessage.success("删除成功");
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("删除失败");
  }
}

function persistLikedIds() {
  localStorage.setItem(LS_LIKED_IDS, JSON.stringify(likedIds.value));
}
function isLiked(id: string | number) {
  return likedIds.value.includes(String(id));
}

async function toggleLike(id: string | number) {
  const entry = entries.value.find((e) => e.id === id);
  if (!entry) return;
  const idStr = String(id);
  const wasLiked = likedIds.value.includes(idStr);
  if (wasLiked) {
    entry.likes = Math.max(0, (entry.likes || 0) - 1);
    likedIds.value = likedIds.value.filter((x) => x !== idStr);
  } else {
    entry.likes = (entry.likes || 0) + 1;
    likedIds.value.push(idStr);
  }
  persistLikedIds();
  try {
    const action = wasLiked ? "unlike" : "like";
    await likeWiki(id, action);
  } catch (err) {
    console.error("toggleLike error", err);
    if (wasLiked) {
      entry.likes = (entry.likes || 0) + 1;
      if (!likedIds.value.includes(idStr)) likedIds.value.push(idStr);
    } else {
      entry.likes = Math.max(0, (entry.likes || 0) - 1);
      likedIds.value = likedIds.value.filter((x) => x !== idStr);
    }
    persistLikedIds();
    ElMessage.error("点赞失败，请稍后重试");
  }
}

function openDetail(entry: any) {
  detailEntry.value = entry;
}

const filteredEntries = computed(() => {
  const q = search.value.trim().toLowerCase();
  let list = entries.value;
  if (q)
    list = list.filter(
      (e) =>
        (e.title || "").toLowerCase().includes(q) ||
        (e.slug || "").toLowerCase().includes(q)
    );
  return [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0));
});

// 背景图片
const pcModules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const mobileModules = import.meta.glob(
  "@/assets/images2/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const pcSrcs: string[] = Object.values(pcModules).map((m: any) => m.default);
const mobileSrcs: string[] = Object.values(mobileModules).map(
  (m: any) => m.default
);

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const randomFive = ref<string[]>([]);
const currentIndex = ref(0);
let timer: number;

function pickImages() {
  const isMobile = window.innerWidth < 768;
  const all = isMobile ? mobileSrcs : pcSrcs;
  randomFive.value = shuffle(all).slice(0, 5);
}

// 粒子样式
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
  loadEntries();
  pickImages();
  window.addEventListener("resize", pickImages);
  timer = window.setInterval(() => {
    if (randomFive.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % randomFive.value.length;
    }
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", pickImages);
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
$text-dim: rgba(233, 232, 231, 0.65);
$card-bg: rgba(6, 10, 20, 0.5);
$card-border: rgba(160, 212, 255, 0.08);
$shadow: 0 16px 40px rgba(0, 0, 0, 0.7);

.cartethyia-wiki {
  position: relative;
  min-height: 100vh;
  color: $text;
  padding: 16px;
  box-sizing: border-box;

  background: radial-gradient(ellipse at 30% 20%, $deep, $abyss);
  font-family: "Noto Serif SC", "Cinzel", "STKaiti", system-ui, serif;
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
      background: rgba(5, 10, 24, 0.5);
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
      filter: brightness(0.5) saturate(0.7) hue-rotate(10deg);
      &.active {
        opacity: 1;
      }
    }
  }

  /* 卡提希娅装饰层 */
  .decor-layer {
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
      bottom: 2px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, $ice, $gold, transparent);
      filter: blur(2px);
      animation: sweep 12s linear infinite;
      opacity: 1;
    }
  }

  /* 顶部标题区 */
  .wiki-header {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 18px 24px;
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.6),
      rgba(8, 14, 28, 0.5)
    );
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid $card-border;
    box-shadow: $shadow, inset 0 1px 0 rgba(160, 212, 255, 0.05);
    margin-bottom: 24px;
    flex-wrap: wrap;

    .title {
      h1 {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 800;
        letter-spacing: 2px;
        background: linear-gradient(180deg, $holy, $ice, $gold);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .subtitle {
        font-size: 0.85rem;
        color: $gold-light;
        letter-spacing: 2px;
        margin-top: 4px;
        font-style: italic;
      }
    }

    .actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search {
      padding: 10px 18px;
      border-radius: 28px;
      border: 1px solid $card-border;
      background: rgba(5, 10, 24, 0.8);
      color: $text;
      font-size: 0.9rem;
      min-width: 220px;
      outline: none;
      transition: border-color 0.2s;
      &::placeholder {
        color: rgba($text, 0.35);
      }
      &:focus {
        border-color: $ice;
      }
    }

    .btn-new {
      background: linear-gradient(135deg, $ice, $gold);
      color: $abyss;
      border: none;
      border-radius: 28px;
      padding: 10px 24px;
      font-size: 0.95rem;
      font-weight: 700;
      font-family: "Cinzel", serif;
      letter-spacing: 1px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(160, 212, 255, 0.2);
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(160, 212, 255, 0.3);
      }
    }
  }

  /* 词条列表 */
  .wiki-body {
    position: relative;
    z-index: 10;

    .empty {
      text-align: center;
      padding: 60px 20px;
      color: $text-dim;
      font-style: italic;
      border: 1px dashed $card-border;
      border-radius: 20px;
      background: rgba(6, 10, 20, 0.3);
    }

    .entry-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
      .entry-card {
        background: linear-gradient(
          135deg,
          rgba(6, 10, 20, 0.5),
          rgba(8, 14, 28, 0.45)
        );
        backdrop-filter: blur(8px);
        border-radius: 16px;
        padding: 20px 24px;
        border: 1px solid $card-border;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        position: relative;
        overflow: hidden;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
          border-color: rgba(212, 184, 122, 0.25);
        }

        // 冰蓝光条装饰
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, $ice, $gold);
          border-radius: 0 4px 4px 0;
          opacity: 0.7;
        }

        .entry-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
        }

        .entry-meta {
          flex: 1;
          cursor: pointer;
          .entry-title-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
          .entry-title {
            font-size: 1.2rem;
            margin: 0;
            color: $ice;
            font-weight: 700;
          }
          .entry-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            background: rgba(160, 212, 255, 0.1);
            color: $ice;
            font-size: 0.75rem;
            border: 1px solid rgba(160, 212, 255, 0.2);
            font-weight: 600;
            text-transform: uppercase;
          }
          .entry-info {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }
          .meta-item {
            font-size: 0.8rem;
            color: $text-dim;
          }
        }

        .entry-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          .like {
            display: flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            border: 1px solid $card-border;
            border-radius: 20px;
            padding: 6px 14px;
            cursor: pointer;
            transition: all 0.2s;
            img {
              width: 18px;
              height: 18px;
              filter: drop-shadow(0 0 4px rgba(160, 212, 255, 0.3));
            }
            .like-count {
              font-weight: 700;
              color: $text;
            }
            &:hover {
              border-color: $ice;
              background: rgba(160, 212, 255, 0.05);
            }
            &.active {
              border-color: $ice;
              background: rgba(160, 212, 255, 0.1);
            }
          }
          .edit-delete {
            display: flex;
            gap: 8px;
            .small {
              padding: 6px 14px;
              border-radius: 8px;
              background: transparent;
              border: 1px solid $card-border;
              color: $text;
              font-size: 0.8rem;
              cursor: pointer;
              transition: all 0.2s;
              &:hover {
                border-color: $ice;
                color: $ice;
              }
              &.danger {
                color: $gold;
                border-color: rgba(212, 184, 122, 0.3);
                &:hover {
                  background: rgba(212, 184, 122, 0.1);
                  border-color: $gold;
                }
              }
            }
          }
        }
      }
    }
  }

  /* 弹窗 */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 10, 24, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .modal {
      width: min(680px, 94%);
      max-height: 85vh;
      overflow-y: auto;
      background: linear-gradient(
        180deg,
        rgba(6, 10, 20, 0.95),
        rgba(8, 14, 28, 0.95)
      );
      border-radius: 24px;
      padding: 24px;
      box-shadow: $shadow, 0 0 40px rgba(160, 212, 255, 0.05);
      border: 1px solid $card-border;

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid $card-border;
        h3 {
          margin: 0;
          color: $gold;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .close {
          background: transparent;
          border: 1px solid $card-border;
          color: $text;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          &:hover {
            border-color: $ice;
            color: $ice;
          }
        }
      }

      .modal-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
        label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-weight: 600;
          color: $gold;
          input,
          textarea {
            background: rgba(5, 10, 24, 0.8);
            border: 1px solid $card-border;
            border-radius: 12px;
            padding: 12px 16px;
            color: $text;
            outline: none;
            transition: border 0.2s;
            &::placeholder {
              color: rgba($text, 0.3);
            }
            &:focus {
              border-color: $ice;
            }
          }
        }
        .detail-content {
          white-space: pre-wrap;
          line-height: 1.8;
          color: $text;
        }
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 28px;
        padding-top: 20px;
        border-top: 1px solid $card-border;
        .btn {
          padding: 10px 28px;
          border-radius: 24px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          font-family: "Cinzel", serif;
          letter-spacing: 1px;
          transition: all 0.2s;
          background: linear-gradient(135deg, $ice, $gold);
          color: $abyss;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(160, 212, 255, 0.3);
          }
          &.ghost {
            background: transparent;
            border: 1px solid $card-border;
            color: $text;
            &:hover {
              border-color: $ice;
              color: $ice;
            }
          }
        }
      }
    }
  }

  /* 过渡 */
  .fade-zoom-enter-active,
  .fade-zoom-leave-active {
    transition: all 0.25s ease;
  }
  .fade-zoom-enter-from,
  .fade-zoom-leave-to {
    opacity: 0;
    transform: scale(0.96);
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

  @media (max-width: 720px) {
    padding: 12px 8px;
    padding-top: 80px;
    .wiki-header {
      flex-direction: column;
      align-items: stretch;
      padding: 16px;
      .actions {
        flex-direction: column;
        .search {
          width: 100%;
        }
        .btn-new {
          width: 100%;
          text-align: center;
        }
      }
    }
    .entry-card {
      padding: 16px;
      .entry-head {
        flex-direction: column;
      }
      .entry-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
    .modal {
      width: 96%;
      padding: 18px;
    }
  }
}
</style>
