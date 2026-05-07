<!--
  卡提希娅 AI 对话 · 剑心低语（完整重构）
  保留：统计、弹窗、设定、消息发送等所有功能
  改变：深海背景、圣典档案、冰蓝/鎏金气泡、鸢尾装饰、动态粒子
-->
<template>
  <div class="cartethyia-chat">
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

    <!-- 卡提希娅装饰层（动态粒子、鸢尾、光冕、扫掠） -->
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

    <div class="chat-container">
      <!-- 统计面板：圣典档案风格 -->
      <div class="stats-panel">
        <div class="stats-header">
          <span class="stats-icon">📜</span>
          <span class="stats-title">圣典对话录</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">总对话</span>
            <span class="stat-value">{{ stats.totalChats }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">首次记录</span>
            <span class="stat-value">{{
              new Date(stats.firstTimestamp).toISOString().slice(0, 10)
            }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">活跃天数</span>
            <span class="stat-value">{{ stats.activeDates.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">今日对话</span>
            <span class="stat-value">{{
              stats.dailyChats[new Date().toISOString().slice(0, 10)] || 0
            }}</span>
          </div>
        </div>
        <div class="panel-buttons">
          <button class="detail-btn" @click="showModal = true">
            <span class="btn-icon">📋</span>
            详细记录
          </button>
          <button class="settings-btn" @click="showSettingsModal = true">
            <span class="btn-icon">⚙️</span>
            设定
          </button>
        </div>
      </div>

      <!-- 消息区 -->
      <div class="messages" ref="msgList">
        <transition-group name="msg" tag="div">
          <div
            v-for="msg in chatLog"
            :key="msg.id"
            :class="[
              'message',
              msg.role,
              { error: msg.isError, egg: msg.isEgg },
            ]"
          >
            <div class="avatar" :class="msg.role">
              <!-- 用户头像：冰蓝渐变 + 首字母 -->
              <span v-if="msg.role === 'user'" class="avatar-initial">你</span>
              <!-- 机器人头像：卡提希娅立绘 -->
              <img
                v-else
                src="@/assets/avatar/changli.png"
                alt="卡提希娅"
                class="avatar-img"
              />
            </div>
            <div class="bubble">
              <div class="content" v-html="msg.text"></div>
            </div>
          </div>
          <div v-if="loading" class="message bot" key="loading">
            <div class="avatar bot">
              <img
                src="@/assets/images1/slty (12).webp"
                alt="卡提希娅"
                class="avatar-img"
              />
            </div>
            <div class="bubble loading">
              <span class="loading-text">圣典翻阅中</span>
              <span class="dots">
                <span class="dot">.</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
              </span>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 输入区 -->
      <form class="input-area" @submit.prevent="sendMessage">
        <textarea
          v-model="input"
          placeholder="在此写下你的问题，与流浪骑士对话…"
          :disabled="loading"
          @keydown="handleKeydown"
          rows="1"
        ></textarea>

        <div class="input-actions">
          <button
            type="button"
            class="clear-btn"
            @click="clearChat"
            :disabled="loading"
            title="清空对话"
          >
            <span class="btn-icon">🗑️</span>
          </button>

          <button
            type="submit"
            class="send-btn"
            :disabled="!input.trim() || loading"
          >
            <span v-if="!loading">⚜️ 发送</span>
            <span v-else>处理中</span>
          </button>
        </div>
      </form>
    </div>

    <!-- 详细统计弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-icon">📁</span>
          <h3>圣典对话详情</h3>
        </div>
        <ul class="detail-list">
          <li>
            <span class="detail-label">总对话次数</span
            ><span class="detail-value">{{ stats.totalChats }}</span>
          </li>
          <li>
            <span class="detail-label">首次记录</span
            ><span class="detail-value">{{
              new Date(stats.firstTimestamp).toISOString().slice(0, 10)
            }}</span>
          </li>
          <li>
            <span class="detail-label">活跃天数</span
            ><span class="detail-value">{{ stats.activeDates.length }} 天</span>
          </li>
          <li>
            <span class="detail-label">今日对话</span
            ><span class="detail-value"
              >{{
                stats.dailyChats[new Date().toISOString().slice(0, 10)] || 0
              }}
              次</span
            >
          </li>
          <li>
            <span class="detail-label">总时长</span
            ><span class="detail-value">{{
              formatDuration(stats.totalTime)
            }}</span>
          </li>
          <li>
            <span class="detail-label">当前连续活跃</span
            ><span class="detail-value">{{ stats.currentStreak }} 天</span>
          </li>
          <li>
            <span class="detail-label">最长连续活跃</span
            ><span class="detail-value">{{ stats.longestStreak }} 天</span>
          </li>
          <li>
            <span class="detail-label">最活跃日</span
            ><span class="detail-value"
              >{{ mostActiveDayComputed }} ({{
                stats.dailyChats[mostActiveDayComputed] || 0
              }}次)</span
            >
          </li>
        </ul>
        <button class="close-btn" @click="showModal = false">确认归档</button>
      </div>
    </div>

    <!-- 设定弹窗 -->
    <div
      v-if="showSettingsModal"
      class="modal-overlay"
      @click.self="showSettingsModal = false"
    >
      <div class="modal-content settings-modal">
        <div class="modal-header">
          <span class="modal-icon">⚙️</span>
          <h3>对话设定</h3>
        </div>
        <div class="settings-form">
          <div class="setting-item">
            <label>额外指令 <span class="optional">（临时覆盖）</span></label>
            <textarea
              v-model="tempAdditionalPrompt"
              placeholder="例如：与你对话的人是XXX、你和ta的关系是XXX……"
              rows="3"
              maxlength="200"
            ></textarea>
            <div class="char-counter">
              {{ tempAdditionalPrompt.length }} / 200 字符
            </div>
            <div class="hint">
              💡 追加在角色设定之后，优先级更高，可临时改变 AI 风格。
            </div>
          </div>
          <div class="setting-item">
            <label>温度 <span class="optional">（创造性）</span></label>
            <div class="temperature-control">
              <input
                type="range"
                v-model.number="tempTemperature"
                min="0.1"
                max="1.9"
                step="0.05"
              />
              <span class="temp-value">{{ tempTemperature.toFixed(2) }}</span>
            </div>
            <div class="hint">
              🌡️ 温度越高（接近2），回答越富有创造性和随机性；<br />🌡️
              温度越低（接近0），回答越确定、保守。建议范围0.5~1.2。
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showSettingsModal = false">
            取消
          </button>
          <button class="save-btn" @click="saveSettings">保存设定</button>
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

<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  onMounted,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import { sendMessageToHui } from "@/api/deepseekApi";
import gsap from "gsap";

// ==================== 存储 key ====================
const STORAGE_KEY = "kati_chat_log";
const STORAGE_STATS_KEY = "kati_chat_stats";
const STORAGE_SETTINGS_KEY = "kati_chat_settings";

// ==================== 统计 ====================
interface Stats {
  firstTimestamp: number;
  totalChats: number;
  activeDates: string[];
  dailyChats: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  totalTime: number;
}
const defaultStats: Stats = {
  firstTimestamp: Date.now(),
  totalChats: 0,
  activeDates: [],
  dailyChats: {},
  currentStreak: 0,
  longestStreak: 0,
  totalTime: 0,
};
function loadStats(): Stats {
  const saved = localStorage.getItem(STORAGE_STATS_KEY);
  if (saved) {
    try {
      return { ...defaultStats, ...JSON.parse(saved) };
    } catch {
      /* fallback */
    }
  }
  return { ...defaultStats };
}
function saveStats() {
  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
}
function updateActive(date: string) {
  if (!stats.activeDates.includes(date)) {
    stats.activeDates.push(date);
    updateStreak();
    saveStats();
  }
}
function updateStreak() {
  const dates = [...stats.activeDates].sort();
  let curr = 0,
    max = stats.longestStreak,
    prevTs = 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  dates.forEach((d) => {
    const ts = new Date(d).getTime();
    if (prevTs && ts - prevTs === 86400000) curr++;
    else curr = 1;
    max = Math.max(max, curr);
    prevTs = ts;
  });
  stats.currentStreak = dates[dates.length - 1] === todayStr ? curr : 0;
  stats.longestStreak = max;
  saveStats();
}
function updateDaily(date: string) {
  stats.dailyChats[date] = (stats.dailyChats[date] || 0) + 1;
  saveStats();
}
const mostActiveDayComputed = computed(() => {
  let day = "",
    max = 0;
  for (const [d, c] of Object.entries(stats.dailyChats)) {
    if (c > max) {
      max = c;
      day = d;
    }
  }
  return day || new Date().toISOString().slice(0, 10);
});
function formatDuration(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60),
    m = totalMin % 60;
  return h ? `${h} 小时 ${m} 分钟` : `${m} 分钟`;
}

const stats = reactive<Stats>(loadStats());
const sessionStart = Date.now();

// ==================== 对话 ====================
interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
  isError?: boolean;
  isEgg?: boolean;
}
const chatLog = ref<ChatMsg[]>(loadChatLog());
const input = ref("");
const loading = ref(false);
const msgList = ref<HTMLElement>();

// ==================== 设定 ====================
const showModal = ref(false);
const showSettingsModal = ref(false);
const tempAdditionalPrompt = ref("");
const tempTemperature = ref(0.7);
const currentAdditionalPrompt = ref("");
const currentTemperature = ref(0.7);

function loadSettings() {
  const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      currentAdditionalPrompt.value = settings.additionalPrompt || "";
      currentTemperature.value = settings.temperature ?? 0.7;
      tempAdditionalPrompt.value = currentAdditionalPrompt.value;
      tempTemperature.value = currentTemperature.value;
    } catch {
      /* fallback */
    }
  }
}
function saveSettings() {
  if (tempAdditionalPrompt.value.length > 200) {
    alert("额外指令不能超过200个字符");
    return;
  }
  currentAdditionalPrompt.value = tempAdditionalPrompt.value;
  currentTemperature.value = tempTemperature.value;
  localStorage.setItem(
    STORAGE_SETTINGS_KEY,
    JSON.stringify({
      additionalPrompt: currentAdditionalPrompt.value,
      temperature: currentTemperature.value,
    })
  );
  showSettingsModal.value = false;
}

async function sendMessage() {
  if (!input.value.trim()) return;
  if (stats.totalChats === 0 && !localStorage.getItem(STORAGE_STATS_KEY)) {
    stats.firstTimestamp = Date.now();
    saveStats();
  }
  const date = new Date().toISOString().slice(0, 10);
  stats.totalChats++;
  updateActive(date);
  updateDaily(date);
  saveStats();

  const userText = input.value;
  chatLog.value.push({ id: Date.now(), role: "user", text: userText });
  input.value = "";
  loading.value = true;

  try {
    const history = chatLog.value.filter((msg) => !msg.isEgg && !msg.isError);
    const options: any = { character: "kati" };
    if (currentAdditionalPrompt.value.trim())
      options.additionalPrompt = currentAdditionalPrompt.value.trim();
    if (currentTemperature.value !== undefined)
      options.temperature = currentTemperature.value;
    const botReply = await sendMessageToHui(userText, history, options);
    if (botReply === "error") {
      chatLog.value.push({
        id: Date.now() + 2,
        role: "bot",
        text: "API余额耗尽了，去b站提醒我充钱吧",
        isError: true,
      });
    } else {
      chatLog.value.push({ id: Date.now() + 1, role: "bot", text: botReply });
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function clearChat() {
  if (confirm("确定要清空全部对话吗？")) {
    chatLog.value = [
      {
        id: Date.now(),
        role: "bot",
        text: "风会指引你的前路，我是卡提希娅——今天想聊些什么？",
      },
    ];
    localStorage.removeItem(STORAGE_KEY);
  }
}

function loadChatLog(): ChatMsg[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      /* fallback */
    }
  }
  return [
    {
      id: Date.now(),
      role: "bot",
      text: "风会指引你的前路，我是卡提希娅——今天想聊些什么？",
    },
  ];
}

async function scrollToBottom() {
  await nextTick();
  if (msgList.value) msgList.value.scrollTop = msgList.value.scrollHeight;
}

watch(
  chatLog,
  async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatLog.value));
    await scrollToBottom();
  },
  { deep: true }
);

function handleBeforeUnload() {
  stats.totalTime += Date.now() - sessionStart;
  saveStats();
}

// ==================== 背景、浮动小人 ====================
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

interface Chibi {
  src: string;
  top: number;
  left: number;
}
const chibiList = ref<Chibi[]>([]);

// 动态粒子样式
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

onMounted(async () => {
  scrollToBottom();
  window.addEventListener("beforeunload", handleBeforeUnload);
  Imgtimer = window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % Math.max(1, randomFive.value.length);
  }, 5200);

  loadSettings();

  const total = 10;
  let pickCount = window.innerWidth <= 768 ? 1 : 3;
  const vw = window.innerWidth,
    vh = window.innerHeight,
    imgWidth = 100,
    imgHeight = 100;

  function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const picks = shuffleArray(
    Array.from({ length: total }, (_, k) => k + 1)
  ).slice(0, pickCount);
  chibiList.value = picks.map((i) => ({
    src: `/QImages/1 (${i}).png`,
    left: Math.random() * (vw - imgWidth),
    top: Math.random() * (vh - imgHeight),
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
        let deltaX = (Math.random() - 0.5) * 200,
          deltaY = (Math.random() - 0.5) * 200;
        if (x + deltaX < padding) deltaX = padding - x;
        if (x + deltaX + img.width > window.innerWidth - padding)
          deltaX = window.innerWidth - padding - (x + img.width);
        if (y + deltaY < padding) deltaY = padding - y;
        if (y + deltaY + img.height > window.innerHeight - padding)
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
  window.removeEventListener("beforeunload", handleBeforeUnload);
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
$text-dim: rgba(233, 232, 231, 0.65);
$card-bg: rgba(6, 10, 20, 0.55);
$card-border: rgba(160, 212, 255, 0.08);
$shadow: 0 16px 40px rgba(0, 0, 0, 0.7);

.cartethyia-chat {
  position: relative;
  min-height: 100vh;
  padding-top: 64px;
  font-family: "Noto Serif SC", "Cinzel", "STKaiti", system-ui, serif;
  color: $text;
  display: flex;
  flex-direction: column;
  background: $abyss;
  overflow-x: hidden;

  /* 背景轮播 */
  .carousel {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    .carousel-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.2s ease;
      filter: brightness(0.4) saturate(0.6) hue-rotate(10deg);
      &.active {
        opacity: 0.55;
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

  .chat-container {
    position: relative;
    z-index: 10;
    flex: 1;
    width: 900px;
    max-width: calc(100% - 32px);
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* 统计面板 */
  .stats-panel {
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.7),
      rgba(8, 14, 28, 0.8)
    );
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 18px 24px;
    border: 1px solid $card-border;
    box-shadow: $shadow, inset 0 1px 0 rgba(160, 212, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;

    .stats-header {
      display: flex;
      align-items: center;
      gap: 8px;
      .stats-icon {
        font-size: 20px;
      }
      .stats-title {
        font-weight: 700;
        color: $gold;
        letter-spacing: 2px;
      }
    }
    .stats-grid {
      display: flex;
      gap: 28px;
      .stat-item {
        text-align: center;
        .stat-label {
          display: block;
          font-size: 0.7rem;
          color: $text-dim;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .stat-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
          color: $ice;
        }
      }
    }
    .panel-buttons {
      display: flex;
      gap: 12px;
    }
    .detail-btn,
    .settings-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(160, 212, 255, 0.08);
      border: 1px solid $card-border;
      border-radius: 30px;
      padding: 8px 18px;
      color: $gold;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      .btn-icon {
        font-size: 16px;
      }
      &:hover {
        background: rgba(160, 212, 255, 0.15);
        border-color: $ice;
        transform: translateY(-2px);
      }
    }
  }

  /* 消息区 */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0 20px;
    max-height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .message {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    &.user {
      flex-direction: row-reverse;
    }

    .avatar {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      border: 2px solid transparent;

      &.bot {
        border-color: $gold;
        overflow: hidden;
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &.user {
        border-color: $ice;
        background: linear-gradient(135deg, $ice, $gold);
        .avatar-initial {
          font-size: 1.2rem;
          font-weight: 700;
          color: $abyss;
        }
      }
    }

    .bubble {
      max-width: 75%;
      padding: 14px 20px;
      background: rgba(6, 10, 20, 0.75);
      backdrop-filter: blur(8px);
      border-radius: 18px;
      line-height: 1.7;
      word-break: break-word;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      position: relative;
      color: $text;
      font-size: 0.95rem;

      .message.user & {
        background: linear-gradient(
          135deg,
          rgba(160, 212, 255, 0.1),
          rgba(6, 10, 20, 0.8)
        );
        border-right: 3px solid $ice;
        border-radius: 18px 6px 18px 18px;
      }
      .message.bot & {
        background: linear-gradient(
          135deg,
          rgba(212, 184, 122, 0.08),
          rgba(6, 10, 20, 0.8)
        );
        border-left: 3px solid $gold;
        border-radius: 6px 18px 18px 18px;
      }

      &.error {
        border-color: $ice;
        background: rgba(160, 212, 255, 0.1);
      }

      &.loading {
        display: flex;
        align-items: center;
        gap: 8px;
        .loading-text {
          color: $text-dim;
        }
        .dots .dot {
          animation: dotPulse 1.4s infinite;
          color: $ice;
          &:nth-child(2) {
            animation-delay: 0.2s;
          }
          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }
  }

  /* 输入区 */
  .input-area {
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.7),
      rgba(8, 14, 28, 0.8)
    );
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 16px 20px;
    border: 1px solid $card-border;
    box-shadow: $shadow, inset 0 1px 0 rgba(160, 212, 255, 0.05);
    display: flex;
    align-items: flex-end;
    gap: 16px;

    textarea {
      flex: 1;
      background: rgba(5, 10, 24, 0.8);
      border: 1px solid $card-border;
      border-radius: 16px;
      padding: 14px 18px;
      color: $text;
      font-size: 0.95rem;
      line-height: 1.5;
      outline: none;
      resize: none;
      min-height: 56px;
      max-height: 150px;
    
      &::placeholder {
        color: rgba($text, 0.35);
      }
      &:focus {
        border-color: $ice;
      }
    }

    .input-actions {
      display: flex;
      align-items: center;
      gap: 12px;

      .clear-btn {
        background: transparent;
        border: 1px solid $card-border;
        border-radius: 14px;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        color: $text-dim;
        &:hover {
          border-color: $gold;
          color: $gold;
        }
        .btn-icon {
          font-size: 18px;
        }
      }

      .send-btn {
        padding: 0 28px;
        height: 44px;
        background: linear-gradient(135deg, $ice, $gold);
        border: none;
        border-radius: 14px;
        font-weight: 700;
        color: $abyss;
        cursor: pointer;
        transition: all 0.2s;
        letter-spacing: 1px;
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(160, 212, 255, 0.3);
        }
        &:disabled {
          opacity: 0.5;
        }
      }
    }
  }

  /* 弹窗 */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(5, 10, 24, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .modal-content {
      width: 480px;
      max-width: 100%;
      background: linear-gradient(
        180deg,
        rgba(6, 10, 20, 0.95),
        rgba(8, 14, 28, 0.95)
      );
      border-radius: 24px;
      border: 1px solid $card-border;
      box-shadow: $shadow;
      padding: 28px;

      .modal-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid $card-border;
        .modal-icon {
          font-size: 24px;
        }
        h3 {
          margin: 0;
          color: $gold;
          font-weight: 700;
        }
      }
    }
  }

  .detail-list {
    list-style: none;
    margin: 0 0 24px;
    padding: 0;
    li {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed rgba(160, 212, 255, 0.1);
      .detail-label {
        color: $text-dim;
      }
      .detail-value {
        color: $ice;
        font-weight: 600;
      }
    }
  }

  .settings-modal {
    .settings-form {
      margin-bottom: 28px;
      .setting-item {
        margin-bottom: 28px;
        label {
          display: block;
          font-weight: 600;
          color: $gold;
          margin-bottom: 8px;
          .optional {
            font-size: 0.8rem;
            color: $text-dim;
            font-weight: normal;
          }
        }
        textarea {
          width: 100%;
          background: rgba(5, 10, 24, 0.8);
          border: 1px solid $card-border;
          border-radius: 12px;
          padding: 12px;
          color: $text;
          resize: vertical;
      
          &:focus {
            border-color: $ice;
            outline: none;
          }
        }
        .char-counter {
          text-align: right;
          font-size: 0.75rem;
          color: $text-dim;
          margin-top: 4px;
        }
        .temperature-control {
          display: flex;
          align-items: center;
          gap: 16px;
          input {
            flex: 1;
            height: 6px;
            -webkit-appearance: none;
            background: rgba($text-dim, 0.3);
            border-radius: 3px;
            outline: none;
            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 18px;
              height: 18px;
              background: $ice;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 0 4px $ice;
            }
          }
          .temp-value {
            min-width: 40px;
            text-align: center;
            font-weight: 700;
            color: $ice;
          }
        }
        .hint {
          font-size: 0.75rem;
          color: $text-dim;
          margin-top: 8px;
          line-height: 1.4;
        }
      }
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      button {
        padding: 10px 20px;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .cancel-btn {
        background: rgba(160, 212, 255, 0.1);
        color: $text-dim;
        &:hover {
          background: rgba(160, 212, 255, 0.2);
        }
      }
      .save-btn {
        background: linear-gradient(135deg, $ice, $gold);
        color: $abyss;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(160, 212, 255, 0.3);
        }
      }
    }
  }

  .close-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, $ice, $gold);
    border: none;
    border-radius: 14px;
    font-weight: 700;
    color: $abyss;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(160, 212, 255, 0.3);
    }
  }

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
  @keyframes dotPulse {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
  }

  .msg-enter-active,
  .msg-leave-active {
    transition: all 0.3s ease;
  }
  .msg-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .msg-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    .carousel1 {
      display: none;
    }
    .carousel2 {
      display: block;
    }
    .stats-panel {
      .stats-grid {
        display: none;
      }
      .panel-buttons .detail-btn span:last-child,
      .panel-buttons .settings-btn span:last-child {
        display: none;
      }
    }
    .input-area {
      flex-direction: column;
      textarea {
        width: 100%;
      }
      .input-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
    .message .bubble {
      max-width: 85%;
    }
    .modal-content {
      width: 90%;
    }
  }
}
</style>
