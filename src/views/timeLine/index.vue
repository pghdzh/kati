<!-- src/views/CartethyiaProfile.vue -->
<template>
  <div class="cartethyia-page" aria-live="polite">
    <!-- ============ 纯 CSS 2D 动态背景层 ============ -->
    <div class="css-bg">
      <div class="bg-gradients"></div>
      <div class="bg-grid"></div>
      <div class="bg-fleur"></div>
      <div class="bg-sweep"></div>
      <div class="bg-particles" aria-hidden="true">
        <span
          v-for="i in 30"
          :key="'p' + i"
          class="particle"
          :style="getParticleStyle(i)"
        ></span>
      </div>
    </div>

    <main class="container" ref="mainContainer">
      <!-- HERO -->
      <header class="hero" role="banner">
        <div class="left-col">
          <div class="avatar-card">
            <picture class="avatar-wrap">
              <img
                src="@/assets/images1/slty (12).webp"
                class="avatar"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div class="avatar-meta">
              <span class="avatar-badge">共鸣能力：暴风雨</span>
            </div>
          </div>
        </div>
        <div class="right-col">
          <div class="hero-panel">
            <h1 class="name">卡提希娅 <span class="jp">（流浪骑士）</span></h1>
            <p class="subtitle">自圣座坠落，向自由新生</p>
            <p class="lead">
              她是曾经的圣女，是神之容器，是风潮之王。她曾被唤作芙露德莉斯，但现在，她只是一介自由自在的流浪骑士。
            </p>
          </div>
        </div>
      </header>

      <!-- 核心机制 -->
      <section id="personality" class="card personality">
        <div class="card-head"><h2>⚔️ 核心机制</h2></div>
        <ul class="traits">
          <li>
            <strong>【卡提希娅】形态</strong
            >：普攻最后一段、重击或变奏技能、共鸣技能分别召唤三种不同的<span
              class="highlight"
              >【剑之影】</span
            >。拥有剑之影时，下落攻击可吸收所有剑之影，根据种类造成额外伤害。
          </li>
          <li>
            <strong>共鸣能量满值</strong>时进入<span class="highlight-gold"
              >【芙露德莉斯】</span
            >形态，每种已吸收剑之影产生持续增益。
          </li>
          <li>
            <strong>【芙露德莉斯】形态</strong>：攻击积攒<span class="highlight"
              >【决意】</span
            >，满足120点释放<span class="highlight-gold"
              >【共鸣解放·看潮怒风哮之刃】</span
            >。
          </li>
          <li style="font-weight: bold; border-bottom: none">输出流程</li>
          <li class="code-line">
            变奏 → AAAE → 跳A → R → EEAAA → Z → A → R → Q
          </li>
          <li class="note-line">
            普攻=A · 重击=Z · 共鸣技能=E · 共鸣解放=R · 声骸=Q
          </li>
        </ul>
      </section>

      <!-- 三把剑之影：背景故事 -->
      <section id="sword-shadows" class="card sword-shadows">
        <div class="card-head">
          <h2>🗡️ 三把剑之影</h2>
          <span class="card-head-badge">三相之力</span>
        </div>
        <p class="sword-intro">
          卡提希娅的共鸣回路中流转着三把剑之影——神权剑象征岁主的恩赐，异权剑蕴藏鸣式的低语，人权剑承载她身为人的自我意志。三剑齐出，即为“三相之力”。
        </p>
        <div class="sword-grid">
          <!-- 神权剑 -->
          <div class="sword-card sword-holy">
            <div class="sword-icon">
              <span class="icon-sword">🪽</span
              ><span class="sword-label">剑之影·II</span>
            </div>
            <h3 class="sword-name">神权剑之影</h3>
            <p class="sword-summon">剑格双翼羽饰环绕 —— 象征岁主英白拉多</p>
            <div class="sword-story">
              <p>
                神权剑的剑格上饰有双翼与羽毛纹样，那是岁主英白拉多的印记。卡提希娅挥出第四段普攻时，神权剑即从虚空中显现——这是岁主“选中”她的证明，亦是那顶金色桂冠的具象。
              </p>
              <p>
                但所谓“选中”实为一场错位。英白拉多早已被鸣式利维亚坦侵蚀，神权剑之力既来自岁主，便也沾染了黑潮的暗影。每一次召唤，都同时触及光明与深渊。
              </p>
              <div class="story-lore">
                <strong>【关键剧情】</strong
                >坎特蕾拉·翡萨烈曾通过神权剑“提尔芬”与岁主进行二次共鸣，将力量反哺岁主，使英白拉多短暂夺回身体控制权，助芙露德莉斯斩断了被鸣式异化的身躯。
              </div>
            </div>
          </div>
          <!-- 异权剑 -->
          <div class="sword-card sword-heresy">
            <div class="sword-icon">
              <span class="icon-sword">🌊</span
              ><span class="sword-label">剑之影·I</span>
            </div>
            <h3 class="sword-name">异权剑之影</h3>
            <p class="sword-summon">剑柄带鳍、水波环绕 —— 象征鸣式利维亚坦</p>
            <div class="sword-story">
              <p>
                异权剑的剑柄缠绕着鱼鳍与波涛，那是利维亚坦的烙印。作为鸣式创造的完美容器，卡提希娅体内流淌着深海之力。异权剑通过变奏入场或重击召唤，恰如鸣式从深海悄然浮现。
              </p>
              <p>
                这把剑不请自来，如同那些无法摆脱的低语，时刻提醒她：她是鸣式的造物，而非岁主所选。但卡提希娅拒绝让异权剑定义她的存在——她以意志驾驭这把剑，使它成为风蚀之力的一部分。
              </p>
              <div class="story-lore">
                <strong>【关键剧情】</strong
                >七丘之战中，卡提希娅阻碍克里斯托弗的剧本，阿漂阻挡鸣式本体，露帕直面核心，三线并进击碎剧本。此后她体内频率开始偏向鸣式一侧——异权剑的波动，是她与鸣式永不停歇的拉锯。
              </div>
            </div>
          </div>
          <!-- 人权剑 -->
          <div class="sword-card sword-mortal">
            <div class="sword-icon">
              <span class="icon-sword">✨</span
              ><span class="sword-label">剑之影·III</span>
            </div>
            <h3 class="sword-name">人权剑之影</h3>
            <p class="sword-summon">朴质无华之人剑 —— 象征卡提希娅的自我意志</p>
            <div class="sword-story">
              <p>
                人权剑没有神明的羽翼，也没有鸣式的鳍波。它的剑柄素朴而坚定——这是卡提希娅以共鸣技能「此剑以人之名」召唤的剑。不是岁主赋予，不是鸣式强加，而是她身为埃格拉乡间少女、身为自由流浪骑士的自己。
              </p>
              <p>
                神权与异权，是命运强加于她的两极。而人权剑，是她在这两极之间找到的第三种答案——无需神选、不堕深渊，持剑者即为自己命运的主宰。
              </p>
              <div class="story-lore">
                <strong>【关键剧情】</strong
                >卡提希娅的专武为教会秘传的仪式之剑。当她挣脱神座、重拾卡提希娅之名后，这把仪式剑便成为她流浪骑士之旅的佩剑——人权剑之影，正是她在漫长孤独中为自己铸造的存在证明。
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 角色背景与形象 -->
      <section id="overview" class="card overview">
        <div class="card-head">
          <h2>📜 角色背景与形象</h2>
          <span class="card-head-badge">个人档案</span>
        </div>
        <div class="two-col">
          <!-- 背景：圣典残章风格 -->
          <div class="text-block background-block">
            <div class="block-header">
              <span class="block-icon">🏛️</span>
              <h3>背景</h3>
              <span class="block-tag">隐海修会 · 封存档案</span>
            </div>
            <div class="block-body">
              <p>
                据传故乡在<span class="highlight">拂风水畔</span
                >。凡于隐海修会任职的高阶教士，都会领受新的“名号”——传说中的“圣女”芙露德莉斯，其领受新名前的本名，正是<span
                  class="highlight-gold"
                  >卡提希娅</span
                >。
              </p>
              <div class="truth-box">
                <span class="truth-icon">⚠️</span>
                <p>
                  <strong>真相揭露：</strong
                  >卡提希娅并非人们口中流传的岁主选中的圣女，而是由来自深海的鸣式<span
                    class="highlight-gold"
                    >“利维亚坦”</span
                  >创造的共鸣者。这一身份错位，贯穿了她的整个命运线。
                </p>
              </div>
              <p class="lore-note">
                修会对外宣称她为“岁主所选”，实则以圣女之名掩盖鸣式造物的真相。她领受的并非神谕，而是深海传来的第一声低语。
              </p>
            </div>
          </div>

          <!-- 外貌／着装：茶歇手记风格 -->
          <div class="text-block appearance-block">
            <div class="block-header">
              <span class="block-icon">👗</span>
              <h3>外貌／着装</h3>
              <span class="block-tag">目击记录 · 画师手稿</span>
            </div>
            <div class="block-body">
              <p>
                卡提希娅拥有一头<span class="highlight">金色长发</span
                >，在阳光下耀眼如流金。额前声痕隐约可见——那是鸣式造物的印记，亦是她无法抹去的身份烙印。
              </p>
              <p>
                身着配饰精美的<span class="highlight-gold">仪典裙装</span
                >，由左中右三条缎带组合而成，设计巧妙，展露修长的手臂与双腿，以及部分胸腹肌肤。这套服饰兼具圣女的高洁与流浪骑士的灵动。
              </p>
              <div class="appearance-details">
                <div class="detail-item">
                  <span class="detail-icon">👣</span>
                  <span>白色凉鞋 —— 轻便，适合长途跋涉与乡间巡逻</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">✨</span>
                  <span>声痕位置：额头 —— 二次共鸣的罕见体征</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🎀</span>
                  <span>缎带组合设计 —— 左中右三带，可随风飘扬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 共鸣状况 -->
      <section id="resonance-status" class="card resonance">
        <div class="card-head">
          <h2>🌊 共鸣状况</h2>
          <span class="card-head-badge">机密档案</span>
        </div>
        <div class="two-col">
          <div class="text-block report-block">
            <!-- 频谱检验报告 -->
            <div class="report-section">
              <div class="report-header">
                <span class="report-icon">📋</span>
                <h4>频谱检验报告 <span class="report-id">RA-X006</span></h4>
              </div>
              <div class="report-body">
                <p>
                  无明确共鸣时间，推测因其受到<span class="highlight"
                    >岁主英白拉多</span
                  >和<span class="highlight-gold">鸣式利维亚坦</span
                  >互相角力的影响，频谱检测超出常规值
                  <span class="classified">▇▇▇▇▇▇▇</span
                  >，以现有的检测方式，无法进行准确测算。
                </p>
                <p>
                  受试样本的拉贝尔曲线不具收敛性，具有显著周期性特征，检测结果判断为<span
                    class="highlight"
                    >先天型共鸣者</span
                  >。
                </p>
                <p class="classified-note">
                  ⚠
                  本机判断名为卡提希娅的个体较为特殊，其档案已封存至特别项目组。提取权限为
                  <span class="classified">▇▇▇</span
                  >。本机将对名为卡提希娅的个体进行持续性观察。
                </p>
              </div>
            </div>

            <!-- 分隔线 -->
            <div class="report-divider"></div>

            <!-- 超频诊断报告 -->
            <div class="report-section">
              <div class="report-header">
                <span class="report-icon">📡</span>
                <h4>超频诊断报告</h4>
              </div>
              <div class="report-body">
                <p>
                  波形检验图呈椭圆形波动，时域表示规律，上下峰值间断性呈升高趋势，峰值暂未超过临界点，<span
                    class="highlight"
                    >未见异常波形</span
                  >。
                </p>
                <p>
                  受试样本体内外来力量已趋近融合。目前，受试样本超频临界值高，稳定性高，<span
                    class="highlight"
                    >暂无超频风险</span
                  >。但需注意的是，受试样本在远离黎那汐塔时，体内力量会呈现不稳定倾向。
                </p>
                <p>
                  受试样本为罕见成功进行<span class="highlight-gold"
                    >二次共鸣</span
                  >的个体。目前受试样本可自如在两种形态间转换。需要注意的是，这并非是一种超频，而是对自身力量的精确调用的结果。
                </p>
              </div>
            </div>

            <!-- 分隔线 -->
            <div class="report-divider"></div>

            <!-- 执花手记 -->
            <div class="report-section handwritten">
              <div class="report-header">
                <span class="report-icon">🌸</span>
                <h4>某位执花的手记</h4>
              </div>
              <div class="report-body">
                <p class="handwritten-text">
                  “卡提希娅小姐……啊不对，芙露德莉斯在展现自己力量的时候，整个测试空间差点都被风暴掀翻了！天哪……下次测试的时候应该更小心一点！”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 三大珍爱之物 -->
      <section id="food" class="card special-section">
        <div class="card-head"><h2>🪵 旧木剑</h2></div>
        <div class="content two-col">
          <div class="img-area">
            <img src="./img/item1.png" loading="lazy" decoding="async" />
          </div>
          <div class="text-block">
            <p>
              一把小小的道具用木剑。黎那汐塔流行戏剧，坐落乡间的埃格拉也不例外，永不停歇的风车与精彩的骑士传说构成了卡提希娅的童年。退隐的戏剧大师赠予卡提希娅一柄道具用的木剑，而她便在每天的课余时间提着木剑神采奕奕地在村内巡逻，惩治遇见的各种“不公”。
            </p>
            <p>她本该从这时起就成为一名流浪骑士。</p>
            <p class="fate-line">命运有太多本该如此，却从不会这样发生。</p>
          </div>
        </div>
      </section>
      <section id="shattered-crystal" class="card special-section">
        <div class="card-head"><h2>👑 金桂冠</h2></div>
        <div class="content two-col">
          <div class="img-area">
            <img src="./img/item2.png" loading="lazy" decoding="async" />
          </div>
          <div class="text-block">
            <p>一顶小小的桂冠。</p>
            <p>当那金色的冠冕落在她头上时，少女第一次听到神明的低语。</p>
            <p>
              从此开始，她不再是卡提希娅，她将成为黎那汐塔的圣女，将成为众人口中的「芙露德莉斯」。
            </p>
            <p class="fate-line">命运有时太过有情，却变为永下不止的暴雨。</p>
          </div>
        </div>
      </section>
      <section id="cyclic-clock" class="card special-section">
        <div class="card-head"><h2>🧸 手指偶</h2></div>
        <div class="content two-col">
          <div class="img-area">
            <img src="./img/item3.png" loading="lazy" decoding="async" />
          </div>
          <div class="text-block">
            <p>正在对峙的小小手偶。</p>
            <p>
              她在那座塔中寻了许久，也找不到其他人的踪迹。于是她制作手偶，自导自演一场又一场戏剧，来避免让自己忘记说话，也以此排遣只有一人的时间。
            </p>
            <p>她想念在人间看的戏剧，想念乡间的麦田，想念甜饮和人们的欢笑。</p>
            <p class="fate-line">命运总让人留恋过去，却总推人踽踽独行。</p>
          </div>
        </div>
      </section>
      <section id="collective-album" class="card special-section">
        <div class="card-head"><h2>🥗 流浪骑士之作</h2></div>
        <div class="content two-col">
          <div class="img-area">
            <img src="./img/food.png" loading="lazy" decoding="async" />
          </div>
          <div class="text-block">
            <p>
              卡提希娅亲自烹饪的青枝月桂沙拉，加入了更多青枝果，每一口都格外脆甜。
            </p>
            <p>
              现在，作为一位流浪骑士，她有很多东西想要学，有很多风景想要去看。
            </p>
            <p class="highlight-gold">
              ——那就从做一份独属于流浪骑士的沙拉开始吧。青枝果要多加多加、多多加！
            </p>
          </div>
        </div>
      </section>

      <!-- 共鸣链详解 -->
      <section
        id="timeline"
        class="card timeline"
        aria-labelledby="timeline-heading"
      >
        <div class="card-head">
          <h2 id="timeline-heading">🔗 共鸣链详解</h2>
        </div>
        <div class="tl-wrap" role="list">
          <div class="vl" aria-hidden="true"></div>
          <ol class="tl-list">
            <li
              v-for="(ev, i) in timeline"
              :key="i"
              class="tl-item"
              role="listitem"
              tabindex="0"
            >
              <div class="tl-card">
                <h3 class="tl-title">第 {{ i + 1 }} 链 · {{ ev.title }}</h3>
                <p class="tl-desc">{{ ev.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- 卡提希娅纪事 -->
      <section class="ll-stories" ref="storyRef">
        <div class="card" role="region" aria-labelledby="stories-title">
          <header class="card-head">
            <h2 id="stories-title" class="card-title">📖 卡提希娅纪事</h2>
          </header>
          <main class="card-body">
            <transition name="fade-slide" mode="out-in">
              <article
                :key="items[current].id"
                :id="`panel-${items[current].id}`"
                class="story"
                role="tabpanel"
              >
                <h3 class="story-head">{{ items[current].title }}</h3>
                <div
                  class="story-content"
                  v-html="items[current].content"
                ></div>
              </article>
            </transition>
          </main>
          <footer class="card-foot">
            <button class="nav-btn" @click="prev" aria-label="上一则故事">
              ‹
            </button>
            <div class="pager">{{ current + 1 }} / {{ items.length }}</div>
            <button class="nav-btn" @click="next" aria-label="下一则故事">
              ›
            </button>
          </footer>
        </div>
      </section>

      <!-- 彩蛋细节 -->
      <section id="easter-eggs" class="card easter-eggs">
        <div class="card-head">
          <h2>🥚 卡提希娅彩蛋细节</h2>
          <span class="card-head-badge">隐藏故事</span>
        </div>
        <p class="egg-intro">我自己收集整合的如有疏漏请谅解。</p>
        <div class="egg-grid">
          <div class="egg-card" v-for="egg in eggs" :key="egg.title">
            <h3>{{ egg.title }}</h3>
            <p>{{ egg.desc }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// 共鸣链数据
const timeline = ref([
  {
    title: "因命运戴上冠冕",
    desc: `【卡提希娅】、【芙露德莉斯】自身技能直接造成的伤害击败被附加【风蚀效应】状态的目标后，获得【集意】状态，持续10秒。
【集意】状态下保留击败目标被附加【风蚀效应】的最高层数，自身下一次技能直接造成的伤害立即为命中目标附加该层数，最高可叠加至当前目标的【风蚀效应】层数上限，同时清除【集意】状态，清除【集意】状态后进入冷却时间1秒。
【芙露德莉斯】每积攒【决意】达到30、60、90、120时，【芙露德莉斯】的暴击伤害提升25%，持续15秒，最多可叠加4层，每次叠加时不刷新持续时间，施放共鸣解放·看潮怒风哮之刃后会清除该暴击伤害提升效果。`,
  },
  {
    title: "听风潮斩断利刃",
    desc: `施放共鸣解放·听骑士从心祈愿后，使自身一定范围内的目标【风蚀效应】层数上限提升3层，自身技能下一次直接造成伤害后，对自身一定范围内的目标附加3层【风蚀效应】，并立刻结算1次目标身上的【风蚀效应】效果，此次结算不消耗【风蚀效应】层数。
【卡提希娅】普攻、重击、闪避反击、变奏技能倍率提升50%，空中攻击倍率提升200%。
施放空中攻击·卡提希娅后，每回收1种【剑之影】使共鸣技能·卡提希娅的冷却时间减少1秒。`,
  },
  {
    title: "以自身束悬高塔",
    desc: `【芙露德莉斯】的普攻·芙露德莉斯第5段，空中攻击·芙露德莉斯第2段，强化重击·芙露德莉斯，共鸣技能·凭风斩浪破敌会为命中目标附加2层【风蚀效应】。
共鸣解放·看潮怒风哮之刃的伤害倍率提升100%。`,
  },
  {
    title: "为拯救舍弃其身",
    desc: `队伍中的角色为目标附加【虚湮效应】、【聚爆效应】、【光噪效应】、【电磁效应】、【霜渐效应】、【风蚀效应】时，使队伍中所有角色全属性伤害加成提升20%，持续20秒。`,
  },
  {
    title: "将烈风重塑希望",
    desc: `【卡提希娅】或【芙露德莉斯】受到致命伤害时，此次伤害不会使【卡提希娅】或【芙露德莉斯】倒下，并获得【卡提希娅】20%生命上限的护盾，持续10秒，该效果每10分钟可触发1次。
施放共鸣解放·听骑士从心祈愿消耗的自身生命值降至生命上限的25%。`,
  },
  {
    title: "尽一线挣扎自由",
    desc: `施放共鸣解放·看潮怒风哮之刃对命中的目标附加【风蚀效应】至层数上限，且施放共鸣解放·看潮怒风哮之刃命中目标后，不再清空目标拥有的【风蚀效应】。
施放变奏技能·此剑，为潮水的过去、变奏技能·此剑，为自由的未来、共鸣解放·听骑士从心祈愿、共鸣解放·看潮怒风哮之刃后，30秒内，队伍中的角色对【风蚀效应】层数到达上限的目标再次附加【风蚀效应】时，立即结算一次【风蚀效应】。
目标受到【芙露德莉斯】的伤害提升40%。`,
  },
]);

// 纪事数据
const items = [
  {
    id: "1",
    title: "那些褪色的骑士时光",
    content: `退隐的戏剧大师喜欢讲述一个故事：据说埃格拉的乡间，曾有一名流浪骑士。他提着剑四处旅行，想要找到那传说中的巨人。那巨人的身体如风车一样高大，手臂也如风车一样修长。流浪骑士拼上一切，向巨人发起进攻——一次，又一次，但那巨人毫不言语，只是一次又一次挥舞手臂，将流浪骑士的进攻化为无形。

有人笑这骑士蠢笨，有人叹这骑士痴愚。毕竟那所谓巨人只是一个风车，那搏斗只是某种妄想。但那乡间最顽皮的少女有另一番理解。

她为自己找来一顶骑士头盔，又向戏剧大师要来一把小小木剑。她说，这流浪骑士能为了一个传说中的巨人拼上一切，自然有高尚的不染尘埃的品德。而她也要和这流浪骑士一样，她要寻找到那传说中打坏房屋赶跑牛羊的巨人，也要让路边的星币伏翼不再能抢走路过旅人的一枚财宝。

于是，她神采奕奕地坐在风滚牦背上，从乡间的麦草间穿行而过。天地如此广大，圣女的传说以此为起点，此后会穿过麦田，走过庆典，行入颠倒的塔中。

这将是一场盛大的巡礼。`,
  },
  {
    id: "2",
    title: "在最后一支舞里坚定着",
    content: `这场巡礼持续了很长一段时间。

在那些不被注意的时间里，这位少女已经走过了扶风水畔的每一块田野。她生性顽皮自由，甚至偷喝下圣酒，在高台上舞蹈，将那场严肃的祭典变为一场彻头彻尾的闹剧，就连修会的禁闭室都变成她的涂鸦墙。

人们说：这真是乡间最顽皮的女孩，任何严肃的命运都和她无关，再坚固的门墙都束缚不住她欢腾的翅膀。

但她却偏偏获得了神明的垂青。

为什么会是她？有人曾质疑过。她只是个巡礼官的女儿，最不服管教的乡野丫头！她身上不流淌一丝贵族的血液，更别说要让她理解尊卑！

就应该是她！有人曾感叹过。她倾听过每一个人的难过，带给每一个人欢笑！如果有谁能获得那神明的冠冕，就应该是这个女孩。

但名为芙露德莉斯之人该作何想法？在那场领受圣名的典礼之前的舞会上，在那过于沉闷潮湿的空气中，少女跳起她作为卡提希娅的最后一支舞。

对那神明的低语感到疑惑吗？对那看不清的未来感到恐惧吗？对那能握紧宝剑的自我感到欣慰吗？

她只是将「卡提希娅」藏在心底。再见啦，那些自由的被微风吹起的麦浪，那自由自在翻滚的风滚牦。天地如此广大，总有人要接过宝剑，有人要自缚荆棘，有人要领受责任，有人——

要成为守护黎那汐塔的「芙露德莉斯」。`,
  },
  {
    id: "3",
    title: "却也在风潮中犹豫",
    content: `作为「芙露德莉斯」，她持剑奔赴战场。

为此，她学习能接触的一切。她阅读修会典籍，磨炼战斗技巧。她倾听人们的声音，努力想要去实现人们的愿望。有人祈求健康，她托人送上珍贵的药品。有人祈求安宁，她也听人告解，倾听那些发生过的苦难。有残象潮爆发，她更是提剑前去，将那些潮水扼杀在摇篮之中。这些事，和她曾经在乡间所做，并无不同。

差别就在于，现在面对的不只是那个小小的村子，见到的也不只是那些熟悉的人。那些向她求助的人，她大多不相识，但她清楚，他们每个人都代表着一家小小的灯。帮助的人越多，黎那汐塔夜晚的灯火就多一盏。

只是，天地如此广大，修会不是如书中所写般无暇，贵族也只专注自己的利益。她看到自诩虔诚的教士只奉行信条，对人们的哭嚎视而不见；她也看到自称良善的贵族中饱私囊，对人们的祈求避而不听。

每到这时，她只能更加握紧手中的剑。

疑惑过，动摇过，失望过，因此，更要在黑潮面前将手里的剑握紧——她要向神明发问，她必须向神明发问。

无论那是一个怎样的答案，「芙露德莉斯」已做好准备。

抱着这样的觉悟，她只身向塔里走去。`,
  },
  {
    id: "4",
    title: "但那孤独一人中",
    content: `她似乎做了一个很长的梦。

在梦里，无数圣歌和赞颂如潮水一般涌向她，将她包裹其中。她持剑一遍又一遍劈开海潮，与那潮水之中的巨鱼斗争。为此。她拼尽全力，哪怕那流水最后都要变成能划破伤口的尖刀，她也不后退一步。

而睁开眼，她发现自己独身处于一个陌生的地方。

她在哪里，她要做什么，甚至她是谁，她都难以想起。

她走遍整座塔，试图寻找那些丢失的记忆。也试着找办法进入中央高塔去寻找答案。但她找遍所有能行走的地方，却只能找到自己。她所在之处没有任何一个“他人”存在，她是这里生活的唯一的灵魂。

于是，她开始自己和自己说话，为自己缝制一些玩偶，又试着给自己编织一些故事。

有意思的是，那些朦朦胧胧的记忆在她的手中轻轻苏醒。

她缝制了一个持剑的少女，一只可怕的巨鱼。她念出一些对白，然后明白这是她曾经听过的故事。那「流浪骑士」（持剑少女）找到传说中巨大恐怖的「巨人」（巨鱼），她拼上一切向「巨人」（巨鱼）发起进攻，一次又一次。

而无论那位「流浪骑士」（持剑少女）是为何而战斗，她都理解了一件事——

那位少女挥剑时，并不关心自己的过去如何，只是在意眼前应做之事。

既然如此，失去了那些记忆也没有关系。因为天地如此广大，她一定能在其中找到自己。

届时，自己究竟是持剑的勇士，还是恐怖的怪物，应该都会是一个自己能接受的答案吧。`,
  },
  {
    id: "5",
    title: "有最初的流浪骑士走向自由处",
    content: `在扶风水畔的一个小餐厅里，一位少女一口气点下好几份青枝月桂沙拉。在等待出餐的时候，这位少女悄悄跑到后厨，跟在厨师长后面认真观察着厨师长的烹饪手法。

“嗯……再多放点这种脆脆的青枝果吧。对的对的，再一颗！”

“这蜜糖也可以多放一些……是的，谢谢！”

“哪来的野丫头，要等饭就上外面去等呀。”厨师长放下刀叉，抬头却愣了愣神。眼前这个丫头她似乎见过，但她想不出一个名字。

“抱歉抱歉！我只是想学习一下你的烹饪手法。毕竟接下来我还有好长一段路要走，可能没办法再遇到这么好吃的店了。要不行的话，我就帮你们劈点柴火赔罪吧。”

“你是第一次来我们店吗？我咋觉得以前见过你。”厨师长把做好的沙拉递给这充满好奇的丫头，“是不是在那彩窗画上……”

“不是第一次来！但上次来已经是好久以前了。“少女自如地接过那盘沙拉，“那自我介绍一下吧，我是卡提希娅，现在的我是一介小小的流浪骑士。我现在正在准备进行新的巡礼修行，要是有什么难处，随时和我说。”

“不过，在巡礼开始之前，我想先试试这个！”少女舀起一勺沙拉，放进嘴里。

天地如此广大，一盘加了满满青枝果的沙拉，让这流浪骑士的自由之旅的开头，显得刚刚好。

真好吃啊。她由衷称赞。`,
  },
];
const current = ref(0);
const storyRef = ref<HTMLElement | null>(null);
function prev() {
  current.value = (current.value - 1 + items.length) % items.length;
  storyRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function next() {
  current.value = (current.value + 1) % items.length;
  storyRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// 彩蛋数据
const eggs = [
  {
    title: "最喜欢的食物",
    desc: "青枝月桂沙拉。卡提希娅可以连续三顿都吃沙拉，因为“酱汁裹着的青枝果脆脆的、甜甜的，烹饪起来也很方便快捷，就连我也能做得很美味”。",
  },
  {
    title: "拒绝菠萝披萨",
    desc: "投喂热海皇梨披萨时，卡提希娅会拒绝食用。触发条件：背包中持有传统窑炉披萨、热海皇梨披萨和青枝月桂沙拉后与她对话。",
  },
  {
    title: "奇怪的挑食",
    desc: "卡提希娅不喜欢吃鱼。“不知为何，每次想要尝试时，就觉得连手指尖都在抗拒……因为这个，小时候父母总说我挑食。”与鸣式利维亚坦（巨鱼形态）有关。",
  },
  {
    title: "岁主感恩礼醉酒",
    desc: "卡提希娅曾瞒过使节偷喝供奉用的圣酒，醉后跳上高台起舞，夺走圣事号角吹奏民间小调，使节追捕不及，祭礼沦为闹剧。她被关三天禁闭，把墙面改造成了涂鸦墙。",
  },
  {
    title: "塔中手偶戏",
    desc: "被困塔中时，卡提希娅找不到任何人，便缝制手偶、编写故事自导自演，以此避免忘记说话。她想念人间的戏剧、乡间的麦田、甜饮和人们的欢笑。",
  },
  {
    title: "拉古娜城彩蛋",
    desc: "完成2.2主线后，在拉古娜城首次相遇处（柯宝常驻点位对面远处），时间19:00-22:00可触发回忆剧情与专属对话。",
  },
  {
    title: "联结之塔彩蛋",
    desc: "完成2.2主线后，在阿维纽林联结之塔高处，时间22:00-4:00可触发夜间对话剧情。该彩蛋为剧情限定，过剧情后不再常驻。",
  },
  {
    title: "黑海岸疗愈",
    desc: "2.4版本战斗后，卡提希娅共鸣力量不稳定，前往黑海岸接受治疗。在后续版本中可在黑海岸特定点位找到她，触发专属对话彩蛋。（就是说想种鸢尾花）",
  },
  {
    title: "成就：睁眼之后",
    desc: "2.7版本新增成就。在联结之塔上方小岛亭子前，调整时间至次日晚上22:00与卡提希娅对话，选择“试试也行？”后获得。",
  },
  {
    title: "玛格烈特餐厅彩蛋",
    desc: "2.7版本大世界常驻彩蛋。在拉古那城玛格烈特餐厅周围，调整时间至次日中午12:00，可找到卡提希娅进行对话。",
  },
  {
    title: "拂风水畔大树彩蛋",
    desc: "2.7版本大世界常驻彩蛋。在拂风水畔西北方向的大树下，调整时间至次日下午18:00，可找到卡提希娅进行对话。",
  },
  {
    title: "待机动作：想吃•想玩•想睡",
    desc: "小卡形态的待机动作主打三种状态：想吃东西、想玩耍、想睡觉。最治愈的待机彩蛋是疲惫瘫倒后召唤出梦幻的“梦泡枕头”，整个场景被唯美蓝色特效笼罩。",
  },
  {
    title: "待机动作：手偶戏",
    desc: "卡提希娅的另一个待机动作为取出两只手偶，自导自演骑士与巨鱼的戏剧，呼应她在塔中缝制的那些手偶故事。",
  },
  {
    title: "会动的精灵耳",
    desc: "卡提希娅和夏空等角色的精灵耳朵专门绑定了骨骼并制作了动效，在剧情对话中会随表情和情绪微微抖动",
  },
  {
    title: "三权剑激活后的服饰细节",
    desc: "激活一把右手手环会发光，激活第二把左手手环发光，全部激活腿环和头冠会发光，肩部的飘带也会发光",
  },
  {
    title: "金发与声痕",
    desc: "卡提希娅金色长发在阳光下十分耀眼。声痕位置位于额头。她是鸣式利维亚坦创造的共鸣者，却被修会误认为岁主所选——这一身份错位贯穿了她的整个命运线。",
  },
  {
    title: "流浪骑士的起源",
    desc: "童年的卡提希娅听了退隐戏剧大师讲的“流浪骑士大战风车巨人”的故事后深受感动，为自己找来骑士头盔，向大师要来木剑，骑在风滚牦背上穿行麦田间巡逻——这是她“流浪骑士”梦想的起点。",
  },
];

// 生成 CSS 粒子样式
const getParticleStyle = (i: number) => {
  const colors = ["#a0d4ff", "#d4b87a", "#f0f5fc", "#b6e2ff"];
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
    backgroundColor: colors[i % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
  };
};

onMounted(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!prefersReducedMotion) {
    // 入场动画
    gsap.from(".avatar-card", {
      duration: 0.8,
      y: 18,
      opacity: 0,
      scale: 0.99,
    });
    gsap.from(".hero-panel .name", {
      duration: 0.9,
      x: 24,
      opacity: 0,
      delay: 0.3,
    });
    gsap.to(".avatar-card", {
      scale: 1.007,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    // 时间线条目动画
    gsap.utils.toArray(".tl-item").forEach((it: any, idx: number) => {
      gsap.from(it.querySelector(".tl-card"), {
        scrollTrigger: {
          trigger: it,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 22,
        duration: 0.7,
        delay: idx * 0.06,
      });
    });
  }
});
</script>

<style scoped lang="scss">
/* ===== 卡提希娅 荧蓝深海 × 鎏金圣典 ===== */
$bg-abyss: #050a18;
$deep-2: #070f24;
$ice-blue: #a0d4ff;
$ice-glow: #b6e2ff;
$gold: #d4b87a;
$gold-light: #e8cd7a;
$holy: #f0f5fc;
$text-main: #e9e8e7;
$text-muted: rgba(233, 232, 231, 0.75);
$card-bg: rgba(6, 10, 20, 0.55);
$card-border: rgba(160, 212, 255, 0.08);
$inner-glow: rgba(160, 212, 255, 0.04);
$shadow: 0 16px 48px rgba(0, 0, 0, 0.7);

.cartethyia-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, $bg-abyss 0%, $deep-2 100%);
  font-family: "Noto Serif SC", "Cinzel", "STKaiti", system-ui, serif;
  color: $text-main;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ========== CSS 2D 动态背景 ========== */
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
}

.bg-fleur {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L110 60 L140 50 L120 76 L150 90 L120 100 L150 110 L120 124 L140 150 L110 140 L100 170 L90 140 L60 150 L80 124 L50 110 L80 100 L50 90 L80 76 L60 50 L90 60 Z' fill='none' stroke='%23d4b87a' stroke-width='1' opacity='0.06'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.35;
  animation: slowSpin 60s linear infinite;
  mix-blend-mode: overlay;
}

.bg-sweep {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    $ice-blue,
    $gold,
    transparent
  );
  filter: blur(2px);
  animation: sweep 12s linear infinite;
  opacity: 0.25;
}

.bg-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 12px currentColor;
  animation: floatUp var(--anim-dur, 8s) var(--anim-delay, 0s) infinite
    ease-in-out;
  mix-blend-mode: screen;
  opacity: 0;
  background-color: inherit;
}

.container {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(16px, 3vw, 60px) clamp(10px, 2vw, 32px);
}

/* ========== 通用卡片 ========== */
.card {
  margin-top: 28px;
  background: $card-bg;
  border-radius: 14px;
  padding: 24px;
  backdrop-filter: blur(8px);
  border: 1px solid $card-border;
  box-shadow: $shadow, inset 0 1px 0 $inner-glow;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
    border-color: rgba(212, 184, 122, 0.15);
  }

  h2 {
    margin: 0;
    font-size: 1.3rem;
    color: $gold-light;
    letter-spacing: 1px;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(160, 212, 255, 0.06);
  }

  .card-head-badge {
    font-size: 0.8rem;
    color: $gold;
    padding: 4px 14px;
    border: 1px solid rgba(212, 184, 122, 0.2);
    border-radius: 24px;
    background: rgba(6, 10, 20, 0.4);
  }
}

.highlight {
  color: $ice-blue;
  font-weight: 600;
}
.highlight-gold {
  color: $gold-light;
  font-weight: 600;
}

/* ========== HERO ========== */
.hero {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 28px;
  align-items: start;
  padding: 12px;
  margin-bottom: 24px;

  .left-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-card {
    background: linear-gradient(
      180deg,
      rgba(160, 212, 255, 0.04),
      rgba(212, 184, 122, 0.03)
    );
    border-radius: 16px;
    padding: 12px;
    display: grid;
    justify-items: center;
    gap: 8px;
    border: 1px solid $card-border;
    box-shadow: $shadow, 0 0 30px rgba(160, 212, 255, 0.05) inset;
    cursor: pointer;
    transition: transform 0.35s, box-shadow 0.35s;
    width: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
    }
  }

  .avatar {
    width: 100%;
    border-radius: 12px;
    display: block;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(160, 212, 255, 0.04);
    filter: saturate(0.9) brightness(0.95);
  }

  .avatar-badge {
    font-size: 0.9rem;
    color: $ice-blue;
    background: rgba(6, 10, 20, 0.5);
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid rgba(160, 212, 255, 0.12);
    font-weight: 600;
    margin-top: 8px;
    display: inline-block;
  }

  .hero-panel {
    padding: 22px 28px;
    border-radius: 14px;
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.6),
      rgba(8, 14, 28, 0.5)
    );
    backdrop-filter: blur(10px);
    border: 1px solid $card-border;
    box-shadow: $shadow, inset 0 1px 0 $inner-glow;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      right: 20px;
      top: 20px;
      width: 60px;
      height: 60px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 15 L55 30 L70 25 L60 38 L75 45 L60 50 L75 55 L60 62 L70 75 L55 70 L50 85 L45 70 L30 75 L40 62 L25 55 L40 50 L25 45 L40 38 L30 25 L45 30 Z' fill='none' stroke='%23d4b87a' stroke-width='0.6' opacity='0.12'/%3E%3C/svg%3E");
      background-size: contain;
      opacity: 0.4;
      pointer-events: none;
    }
  }

  .name {
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 900;
    background: linear-gradient(180deg, $holy 0%, $ice-blue 40%, $gold 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 18px rgba(160, 212, 255, 0.4))
      drop-shadow(0 0 35px rgba(212, 184, 122, 0.15));
    margin: 0;
  }

  .jp {
    font-size: 0.95rem;
    color: $gold;
    margin-left: 10px;
    font-weight: 400;
  }

  .subtitle {
    margin: 8px 0 0;
    font-size: 1.15rem;
    color: $gold-light;
    font-weight: 600;
    letter-spacing: 2px;
  }

  .lead {
    margin: 12px 0 0;
    opacity: 0.92;
    line-height: 1.75;
  }
}

/* ========== 核心机制 ========== */
.personality .traits {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 10px 0;
    border-bottom: 1px dashed rgba(160, 212, 255, 0.06);
    font-size: 0.95rem;
    line-height: 1.65;
    color: $text-muted;

    &.code-line {
      font-family: "Courier New", monospace;
      color: $ice-blue;
      background: rgba(160, 212, 255, 0.04);
      padding: 8px 16px;
      border-radius: 6px;
      border-bottom: none;
      margin-top: 8px;
    }

    &.note-line {
      font-size: 0.8rem;
      opacity: 0.65;
      border-bottom: none;
      padding-top: 4px;
    }
  }
}

/* ========== 三把剑之影 ========== */
.sword-intro {
  color: $text-muted;
  line-height: 1.7;
  margin-bottom: 20px;
}

.sword-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
}

.sword-card {
  padding: 20px;
  border-radius: 12px;
  border: 1px solid $card-border;
  background: rgba(6, 10, 20, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  }

  &.sword-holy {
    border-left: 3px solid $ice-blue;
  }
  &.sword-heresy {
    border-left: 3px solid $gold;
  }
  &.sword-mortal {
    border-left: 3px solid $holy;
  }

  .sword-icon {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;

    .icon-sword {
      font-size: 1.5rem;
    }
    .sword-label {
      font-size: 0.75rem;
      color: $gold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }

  .sword-name {
    font-size: 1.2rem;
    color: $ice-blue;
    margin: 0 0 4px;
  }
  .sword-summon {
    font-size: 0.85rem;
    color: $gold-light;
    margin-bottom: 12px;
    font-style: italic;
  }

  .sword-story {
    font-size: 0.9rem;
    color: $text-muted;
    line-height: 1.7;
    p {
      margin: 0 0 10px;
    }
    .story-lore {
      margin-top: 12px;
      padding: 12px;
      background: rgba(160, 212, 255, 0.04);
      border-radius: 8px;
      border-left: 2px solid rgba(212, 184, 122, 0.3);
      font-style: italic;
      color: rgba(233, 232, 231, 0.8);
    }
  }
}

/* ========== 概览 / 共鸣 ========== */
/* ========== 角色背景与形象模块独立样式 ========== */
.overview {
  position: relative;
  overflow: hidden;

  /* 背景装饰：圣典竖线 */
  &::before {
    content: "";
    position: absolute;
    left: 40px;
    top: 80px;
    bottom: 40px;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent,
      rgba($ice-blue, 0.12),
      rgba($gold, 0.08),
      transparent
    );
    pointer-events: none;
    z-index: 0;
  }

  .card-head {
    .card-head-badge {
      font-size: 0.75rem;
      color: $gold;
      padding: 4px 12px;
      border: 1px solid rgba($gold, 0.25);
      border-radius: 4px;
      background: rgba($gold, 0.05);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-top: 16px;
    position: relative;
    z-index: 1;
  }

  .text-block {
    border-radius: 12px;
    padding: 20px;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s;

    .block-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba($ice-blue, 0.06);
      flex-wrap: wrap;

      .block-icon {
        font-size: 1.5rem;
      }

      h3 {
        font-size: 1.05rem;
        color: $ice-blue;
        margin: 0;
        letter-spacing: 1px;
        font-weight: 700;
      }

      .block-tag {
        font-size: 0.7rem;
        color: rgba($text-main, 0.4);
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-left: auto;
      }
    }

    .block-body {
      color: rgba($text-main, 0.9);
      line-height: 1.8;
      font-size: 0.95rem;

      p {
        margin: 0 0 12px;
      }
    }
  }

  /* 背景板块：圣典残章风格 */
  .background-block {
    background: linear-gradient(
      135deg,
      rgba(6, 10, 20, 0.5),
      rgba(8, 12, 24, 0.4)
    );
    border: 1px solid rgba($ice-blue, 0.06);
    border-left: 3px solid rgba($ice-blue, 0.2);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }

    /* 真相揭露框 */
    .truth-box {
      background: rgba($gold, 0.04);
      border: 1px dashed rgba($gold, 0.2);
      border-radius: 8px;
      padding: 14px 18px;
      margin: 16px 0;
      position: relative;
      display: flex;
      gap: 12px;
      align-items: flex-start;

      .truth-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
        margin-top: 1px;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
        color: rgba($text-main, 0.85);

        strong {
          color: $gold-light;
          font-weight: 700;
          letter-spacing: 1px;
        }
      }
    }

    /* 补充说明 */
    .lore-note {
      font-size: 0.85rem;
      color: rgba($text-main, 0.55);
      font-style: italic;
      padding: 10px 14px;
      border-left: 2px solid rgba($ice-blue, 0.1);
      margin-top: 8px;
    }
  }

  /* 外貌板块：茶歇手记风格 */
  .appearance-block {
    background: linear-gradient(
      135deg,
      rgba(8, 12, 24, 0.5),
      rgba(6, 10, 20, 0.4)
    );
    border: 1px solid rgba($gold, 0.06);
    border-right: 3px solid rgba($gold, 0.15);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }

    /* 细节列表 */
    .appearance-details {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .detail-item {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-size: 0.9rem;
        color: rgba($text-main, 0.75);
        padding: 6px 12px;
        border-radius: 6px;
        background: rgba($ice-blue, 0.02);
        transition: background 0.2s, color 0.2s;

        &:hover {
          background: rgba($ice-blue, 0.05);
          color: rgba($text-main, 0.95);
        }

        .detail-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }
      }
    }
  }

  /* 高亮文本 */
  .highlight {
    color: $ice-blue;
    font-weight: 600;
    text-shadow: 0 0 6px rgba($ice-blue, 0.3);
  }

  .highlight-gold {
    color: $gold-light;
    font-weight: 600;
    text-shadow: 0 0 6px rgba($gold, 0.25);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .overview {
    .two-col {
      grid-template-columns: 1fr;
    }
    .text-block .block-header .block-tag {
      margin-left: 0;
      width: 100%;
      margin-top: 4px;
    }
    .appearance-block {
      border-right: none;
      border-left: 3px solid rgba($gold, 0.15);
    }
  }
}
.resonance {
  border-left: 3px solid rgba($ice-blue, 0.25);
  position: relative;
  overflow: hidden;

  /* 背景暗纹装饰 */
  &::after {
    content: "";
    position: absolute;
    top: 20px;
    right: 20px;
    width: 80px;
    height: 80px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23a0d4ff' stroke-width='0.5' opacity='0.08'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23d4b87a' stroke-width='0.5' opacity='0.06' stroke-dasharray='4 4'/%3E%3Ccircle cx='50' cy='50' r='15' fill='none' stroke='%23a0d4ff' stroke-width='0.8' opacity='0.1'/%3E%3C/svg%3E");
    background-size: contain;
    pointer-events: none;
    opacity: 0.6;
  }

  .card-head {
    .card-head-badge {
      font-size: 0.75rem;
      color: $gold;
      padding: 4px 12px;
      border: 1px solid rgba($gold, 0.25);
      border-radius: 4px;
      background: rgba($gold, 0.05);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .two-col {
    display: block; /* 单列宽幅展示报告 */
  }

  .text-block.report-block {
    flex: 1;
    min-width: 100%;
    line-height: 1.8;
  }

  /* 每份报告区块 */
  .report-section {
    margin-bottom: 20px;

    .report-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;

      .report-icon {
        font-size: 1.3rem;
      }

      h4 {
        font-size: 1rem;
        color: $ice-blue;
        margin: 0;
        letter-spacing: 1.5px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;

        .report-id {
          font-size: 0.75rem;
          color: $gold;
          background: rgba($gold, 0.08);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: "Courier New", monospace;
          letter-spacing: 1px;
          font-weight: 600;
        }
      }
    }

    .report-body {
      padding-left: 34px; /* 对齐标题 */
      color: $text-muted;
      font-size: 0.95rem;

      p {
        margin: 0 0 10px;
      }

      .classified {
        font-family: "Courier New", monospace;
        background: rgba(160, 212, 255, 0.08);
        padding: 1px 6px;
        border-radius: 3px;
        letter-spacing: 2px;
        color: $ice-blue;
        font-weight: 600;
      }

      .classified-note {
        background: rgba(160, 212, 255, 0.04);
        border-left: 2px solid rgba($ice-blue, 0.3);
        padding: 10px 14px;
        border-radius: 0 6px 6px 0;
        font-size: 0.9rem;
        color: rgba($text-main, 0.8);
        margin-top: 12px;
      }
    }

    /* 手记特殊样式 */
    &.handwritten {
      .report-body {
        .handwritten-text {
          font-style: italic;
          color: $gold-light;
          background: rgba($gold, 0.04);
          border: 1px dashed rgba($gold, 0.2);
          border-radius: 8px;
          padding: 14px 18px;
          font-size: 0.95rem;
          line-height: 1.7;
          quotes: none;
          position: relative;

          &::before {
            content: "“";
            position: absolute;
            left: 6px;
            top: -6px;
            font-size: 2rem;
            color: rgba($gold, 0.3);
            font-family: "Georgia", serif;
          }

          &::after {
            content: "”";
            position: absolute;
            right: 6px;
            bottom: -18px;
            font-size: 2rem;
            color: rgba($gold, 0.3);
            font-family: "Georgia", serif;
          }
        }
      }
    }
  }

  /* 报告分隔线 */
  .report-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($ice-blue, 0.15),
      rgba($gold, 0.1),
      transparent
    );
    margin: 24px 0 24px 34px;
    border: none;
  }

  /* 高亮文本复用 */
  .highlight {
    color: $ice-blue;
    font-weight: 600;
    text-shadow: 0 0 6px rgba($ice-blue, 0.3);
  }

  .highlight-gold {
    color: $gold-light;
    font-weight: 600;
    text-shadow: 0 0 6px rgba($gold, 0.25);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .resonance {
    .report-section .report-body {
      padding-left: 10px;
    }
    .report-divider {
      margin-left: 10px;
    }
    .report-section .report-header h4 {
      font-size: 0.9rem;
    }
  }
}

/* ========== 珍爱之物 ========== */
.special-section .content {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-top: 16px;
}
.special-section .img-area {
  flex: 0 0 180px;
  img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55),
      0 0 12px rgba(160, 212, 255, 0.03);
    border: 1px solid rgba(160, 212, 255, 0.06);
  }
}
.special-section .text-block {
  flex: 1;
  line-height: 1.7;
  color: rgba($text-main, 0.93);
}
.fate-line {
  color: $gold;
  font-style: italic;
  font-weight: 500;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(212, 184, 122, 0.15);
}

/* ========== 共鸣链 ========== */
.timeline .tl-wrap {
  position: relative;
  padding: 24px 12px 12px 90px;
}
.timeline .vl {
  position: absolute;
  left: 74px;
  top: 32px;
  bottom: 20px;
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(
    180deg,
    rgba(160, 212, 255, 0.2),
    rgba(212, 184, 122, 0.12)
  );
  box-shadow: 0 6px 18px rgba(160, 212, 255, 0.06);
  opacity: 0.9;
}
.timeline .tl-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.timeline .tl-item {
  margin: 20px 0;
}
.timeline .tl-card {
  background: rgba(6, 10, 20, 0.45);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);
  width: calc(100% - 120px);
  border-left: 3px solid transparent;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
    border-left-color: rgba(212, 184, 122, 0.3);
  }
  .tl-title {
    margin: 0 0 8px;
    font-size: 1.1rem;
    color: $ice-blue;
  }
  .tl-desc {
    margin: 0;
    color: rgba($text-main, 0.9);
    white-space: pre-wrap;
    line-height: 1.6;
    font-size: 0.9rem;
  }
}

/* ========== 纪事 ========== */
.ll-stories {
  margin-top: 28px;
  .card {
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(
      180deg,
      rgba(6, 10, 20, 0.5),
      rgba(4, 8, 16, 0.4)
    );
  }
  .card-head {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(160, 212, 255, 0.05);
  }
  .card-body {
    padding: 18px 16px;
    min-height: 160px;
  }
  .story .story-head {
    font-size: 1.15rem;
    color: $ice-blue;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .story .story-content {
    line-height: 1.8;
    color: rgba($text-main, 0.9);
    white-space: pre-wrap;
  }
  .card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 14px;
    border-top: 1px solid rgba(160, 212, 255, 0.05);
    .nav-btn {
      background: transparent;
      border: 1px solid rgba(160, 212, 255, 0.1);
      color: $gold-light;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1.2rem;
      transition: background 0.2s;
      &:hover {
        background: rgba(160, 212, 255, 0.06);
      }
    }
    .pager {
      color: rgba($text-main, 0.65);
      font-size: 0.85rem;
    }
  }
}

/* ========== 彩蛋 ========== */
.easter-eggs {
  border-top: 2px solid rgba(212, 184, 122, 0.12);
}
.egg-intro {
  color: $text-muted;
  line-height: 1.7;
  margin-bottom: 20px;
  font-style: italic;
}
.egg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.egg-card {
  padding: 18px;
  border-radius: 12px;
  background: rgba(6, 10, 20, 0.5);
  border: 1px solid $card-border;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
    border-color: rgba(212, 184, 122, 0.2);
  }

  h3 {
    font-size: 1rem;
    color: $gold-light;
    margin: 0 0 8px;
  }
  p {
    font-size: 0.9rem;
    color: $text-muted;
    line-height: 1.6;
    margin: 0;
  }
}

/* ========== 关键帧动画 ========== */
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
    transform: translateY(-80px) scale(1.3);
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

/* ========== 响应式 ========== */
@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .avatar-card {
    width: 140px;
    padding: 8px;
  }
  .overview .two-col,
  .special-section .content {
    flex-direction: column;
  }
  .tl-wrap {
    padding-left: 14px !important;
    padding-right: 14px;
  }
  .vl {
    display: none !important;
  }
  .tl-card {
    width: 100% !important;
    padding: 14px !important;
    border-left: 0 !important;
  }
  .sword-grid,
  .egg-grid {
    grid-template-columns: 1fr;
  }
}
</style>
