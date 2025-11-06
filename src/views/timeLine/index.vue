<template>
  <div class="megumi-page" aria-live="polite">
    <main class="container" ref="mainContainer">
      <!-- HERO 区域 -->
      <header class="hero" role="banner">
        <div class="left-col">
          <button class="avatar-card">
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
          </button>
        </div>
        <div class="right-col" ref="metaCard">
          <div class="hero-panel">
            <h1 class="name">卡提希娅 <span class="jp">（流浪骑士）</span></h1>
            <p class="subtitle">自圣座坠落，向自由新生</p>
            <p class="lead">
              她是曾经的圣女，是神之容器，是风潮之王。她曾被唤作芙露德莉斯，但现在，她只是一介自由自在的流浪骑士。
            </p>
          </div>
        </div>
      </header>

      <!-- 内容卡片区 -->
      <section id="personality" class="card personality">
        <div class="card-head">
          <h2>核心机制</h2>
        </div>
        <ul class="traits">
          <li>
            【卡提希娅】形态：卡提希娅的普攻最后一段、重击或变奏技能、共鸣技能会分别召唤三种不同的【剑之影】到场中，当场上拥有【剑之影】时，卡提希娅施放下落攻击，可以吸收场地中的【剑之影】，并根据吸收的种类总和，造成不同程度的额外伤害。
          </li>
          <li>
            【卡提希娅】共鸣能量满值时，点按共鸣解放，进入【芙露德莉斯】形态，之前吸收的每种【剑之影】都会产生不同的、且持续一段时间的额外增益效果。
          </li>
          <li>
            【芙露德莉斯】形态：攻击命中目标时，可积攒【决意】，当【决意】满足120点时，可释放【共鸣解放·看潮怒风哮之刃】。
          </li>

          <li style="font-weight: bold">输出流程：</li>
          <li>变奏-AAAE-跳A-R-EEAAA-Z-A-R-Q</li>
          <li>
            技能缩写：普攻 = A，重击 = Z，共鸣技能 = E，共鸣解放 = R，声骸 = Q
          </li>
        </ul>
      </section>

      <section id="overview" class="card overview">
        <div class="card-head">
          <h2>角色背景与形象</h2>
        </div>
        <div class="two-col">
          <div class="text-block">
            <h3>背景</h3>
            <p>
              据传故乡在拂风水畔。凡于隐海修会任职的高阶教士，都会领受新的“名号”，传说中的“圣女”芙露德莉斯，领受新名前的本名是“卡提希娅”。但卡提希娅其实并非人们口中流传的岁主选中的圣女，而是由来自深海的鸣式“利维亚坦”创造的共鸣者
            </p>
          </div>
          <div class="text-block">
            <h3>外貌／着装</h3>
            <p>
              卡提希娅有着金色长发，在阳光的衬托下十分耀眼。
              身上穿着配饰精美的仪典裙装，为左中右三条缎带组合而成的服饰，露出修长的手臂和双腿、以及一部分胸腹的肌肤。
              脚上穿着白色凉鞋。
            </p>
          </div>
        </div>
      </section>

      <section id="resonance-status" class="card overview">
        <div class="card-head">
          <h2>共鸣状况</h2>
        </div>
        <div class="two-col">
          <div class="text-block">
            <p>
              卡提希娅体内外来力量已趋近融合。目前，卡提希娅超频临界值高，稳定性高，暂无超频风险。但需注意的是，卡提希娅在远离黎那汐塔时，体内力量会呈现不稳定倾向。
              卡提希娅为罕见成功进行二次共鸣的个体。目前卡提希娅可自如在两种形态间转换。需要注意的是，这并非是一种超频，而是对自身力量的精确调用的结果。
            </p>
          </div>
        </div>
      </section>

      <!-- 新增三大主题区域 -->
      <section id="food" class="card special-section">
        <div class="card-head">
          <h2>旧木剑</h2>
        </div>
        <div class="content two-col">
          <div class="img-area">
            <img src="./img/item1.png" loading="lazy" decoding="async" />
          </div>
          <div class="text-block">
            <p>
              一把小小的道具用木剑。黎那汐塔流行戏剧，坐落乡间的埃格拉也不例外，永不停歇的风车与精彩的骑士传说构成了卡提希娅的童年。退隐的戏剧大师赠予卡提希娅一柄道具用的木剑，而她便在每天的课余时间提着木剑神采奕奕地在村内巡逻，惩治遇见的各种“不公”。
            </p>
            <p>她本该从这时起就成为一名流浪骑士。</p>
            <p>命运有太多本该如此，却从不会这样发生。</p>
          </div>
        </div>
      </section>
      <section id="shattered-crystal" class="card special-section">
        <div class="card-head">
          <h2>金桂冠</h2>
        </div>
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
            <p>命运有时太过有情，却变为永下不止的暴雨。</p>
          </div>
        </div>
      </section>

      <section id="cyclic-clock" class="card special-section">
        <div class="card-head">
          <h2>手指偶</h2>
        </div>
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
            <p>命运总让人留恋过去，却总推人踽踽独行。</p>
          </div>
        </div>
      </section>

      <section id="collective-album" class="card special-section">
        <div class="card-head">
          <h2>流浪骑士之作</h2>
        </div>
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
            <p>
              ——那就从做一份独属于流浪骑士的沙拉开始吧。这回，青枝果要多加多加、多多加！
            </p>
          </div>
        </div>
      </section>

      <section
        id="timeline"
        class="card timeline"
        aria-labelledby="timeline-heading"
      >
        <div class="card-head">
          <h2 id="timeline-heading">共鸣链详解</h2>
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
              :aria-label="``"
            >
              <div class="tl-card">
                <h3 class="tl-title">第 {{ i + 1 }} 链 · {{ ev.title }}</h3>
                <p class="tl-desc">{{ ev.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="ll-stories" ref="storyRef">
        <div class="card" role="region" aria-labelledby="stories-title">
          <header class="card-head">
            <h2 id="stories-title" class="card-title">卡提希娅纪事</h2>
          </header>

          <main class="card-body">
            <transition name="fade-slide" mode="out-in">
              <article
                :key="items[current].id"
                :id="`panel-${items[current].id}`"
                class="story"
                role="tabpanel"
                :aria-labelledby="`tab-${items[current].id}`"
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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

const reducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const items = [
  {
    id: "1",
    title: "那些褪色的骑士时光",
    content: `
    退隐的戏剧大师喜欢讲述一个故事：据说埃格拉的乡间，曾有一名流浪骑士。他提着剑四处旅行，想要找到那传说中的巨人。那巨人的身体如风车一样高大，手臂也如风车一样修长。流浪骑士拼上一切，向巨人发起进攻——一次，又一次，但那巨人毫不言语，只是一次又一次挥舞手臂，将流浪骑士的进攻化为无形。

有人笑这骑士蠢笨，有人叹这骑士痴愚。毕竟那所谓巨人只是一个风车，那搏斗只是某种妄想。但那乡间最顽皮的少女有另一番理解。

她为自己找来一顶骑士头盔，又向戏剧大师要来一把小小木剑。她说，这流浪骑士能为了一个传说中的巨人拼上一切，自然有高尚的不染尘埃的品德。而她也要和这流浪骑士一样，她要寻找到那传说中打坏房屋赶跑牛羊的巨人，也要让路边的星币伏翼不再能抢走路过旅人的一枚财宝。

于是，她神采奕奕地坐在风滚牦背上，从乡间的麦草间穿行而过。天地如此广大，圣女的传说以此为起点，此后会穿过麦田，走过庆典，行入颠倒的塔中。

这将是一场盛大的巡礼。`,
  },
  {
    id: "2",
    title: "在最后一支舞里坚定着",
    content: `
    这场巡礼持续了很长一段时间。

在那些不被注意的时间里，这位少女已经走过了扶风水畔的每一块田野。她生性顽皮自由，甚至偷喝下圣酒，在高台上舞蹈，将那场严肃的祭典变为一场彻头彻尾的闹剧，就连修会的禁闭室都变成她的涂鸦墙。

人们说：这真是乡间最顽皮的女孩，任何严肃的命运都和她无关，再坚固的门墙都束缚不住她欢腾的翅膀。

但她却偏偏获得了神明的垂青。

为什么会是她？有人曾质疑过。她只是个巡礼官的女儿，最不服管教的乡野丫头！她身上不流淌一丝贵族的血液，更别说要让她理解尊卑！

就应该是她！有人曾感叹过。她倾听过每一个人的难过，带给每一个人欢笑！如果有谁能获得那神明的冠冕，就应该是这个女孩。

但名为芙露德莉斯之人该作何想法？在那场领受圣名的典礼之前的舞会上，在那过于沉闷潮湿的空气中，少女跳起她作为卡提希娅的最后一支舞。

对那神明的低语感到疑惑吗？对那看不清的未来感到恐惧吗？对那能握紧宝剑的自我感到欣慰吗？

她只是将「卡提希娅」藏在心底。再见啦，那些自由的被微风吹起的麦浪，那自由自在翻滚的风滚牦。天地如此广大，总有人要接过宝剑，有人要自缚荆棘，有人要领受责任，有人——

要成为守护黎那汐塔的「芙露德莉斯」。 `,
  },

  {
    id: "3",
    title: "却也在风潮中犹豫",
    content: `
    作为「芙露德莉斯」，她持剑奔赴战场。

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
    content: `
    她似乎做了一个很长的梦。

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

届时，自己究竟是持剑的勇士，还是恐怖的怪物，应该都会是一个自己能接受的答案吧。 `,
  },

  {
    id: "5",
    title: "有最初的流浪骑士走向自由处",
    content: `
    在扶风水畔的一个小餐厅里，一位少女一口气点下好几份青枝月桂沙拉。在等待出餐的时候，这位少女悄悄跑到后厨，跟在厨师长后面认真观察着厨师长的烹饪手法。

“嗯……再多放点这种脆脆的青枝果吧。对的对的，再一颗！”

“这蜜糖也可以多放一些……是的，谢谢！”

“哪来的野丫头，要等饭就上外面去等呀。”厨师长放下刀叉，抬头却愣了愣神。眼前这个丫头她似乎见过，但她想不出一个名字。

“抱歉抱歉！我只是想学习一下你的烹饪手法。毕竟接下来我还有好长一段路要走，可能没办法再遇到这么好吃的店了。要不行的话，我就帮你们劈点柴火赔罪吧。”

“你是第一次来我们店吗？我咋觉得以前见过你。”厨师长把做好的沙拉递给这充满好奇的丫头，“是不是在那彩窗画上……”

“不是第一次来！但上次来已经是好久以前了。“少女自如地接过那盘沙拉，“那自我介绍一下吧，我是卡提希娅，现在的我是一介小小的流浪骑士。我现在正在准备进行新的巡礼修行，要是有什么难处，随时和我说。”

“不过，在巡礼开始之前，我想先试试这个！”少女舀起一勺沙拉，放进嘴里。

天地如此广大，一盘加了满满青枝果的沙拉，让这流浪骑士的自由之旅的开头，显得刚刚好。

真好吃啊。她由衷称赞。
    `,
  },
];
const current = ref(0);

function select(index) {
  current.value = index;
  // 将焦点移回当前 tab（便于无障碍与键盘导航）
  const id = `tab-${items[index].id}`;
  const el = document.getElementById(id);
  if (el) el.focus();
}
const storyRef = ref<HTMLElement | null>(null);

function prev() {
  current.value = (current.value - 1 + items.length) % items.length;
  select(current.value);
  storyRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
}

function next() {
  current.value = (current.value + 1) % items.length;
  select(current.value);
  storyRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(() => {
  if (!reducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".avatar-card", {
      duration: 0.8,
      y: 18,
      opacity: 0,
      scale: 0.99,
    }).from(
      ".right-col > .hero-panel .name",
      { duration: 0.9, x: 24, opacity: 0 },
      "-=0.45"
    );

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

    gsap.to(".avatar-card", {
      scale: 1.007,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  } else {
    document.documentElement.classList.add("reduced-motion");
  }
});
</script>

<style scoped lang="scss">
/* 卡提希娅风格 —— 紫蓝海感（水母/幻海） + 毒药/治愈双重高光 */
$bg-deep: #050714; // 深海夜色底
$deep-2: #071028; // 次深底用于渐变
$accent-1: #7fd8ff; // 暗紫主光（冷雅）
$accent-2: #ffd78a; // 冷海蓝高光（湿光感）
$venom: #8ca6bd; // 毒色点缀（保留少量用于对比）
$text-main: #eae9ee;
$text-muted: rgba(234, 233, 238, 0.78);
$card-bg: rgba(6, 8, 12, 0.46);
$card-border: rgba(184, 107, 224, 0.06);
$soft-shadow: rgba(0, 0, 0, 0.6);
$inner-glow: rgba(184, 107, 224, 0.03);

.megumi-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, $bg-deep 0%, $deep-2 72%);
  font-family: "Noto Sans SC", system-ui, -apple-system, "Segoe UI", Roboto,
    Arial;
  color: $text-main;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: clamp(20px, 4vw, 80px);
  box-sizing: border-box;
  padding-top: 60px;

  &.reduced-motion * {
    transition: none !important;
    animation: none !important;
  }

  .container {
    position: relative;
    z-index: 10;
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(12px, 2vw, 40px);
  }
}

/* ========== HERO 区域（整体暗化 + 血玫点光） ========== */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 28px;
  align-items: start;
  padding: 12px;
  margin-bottom: 12px;

  /* 乐谱画布 —— 在 hero 背后增加五线谱移动感 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.02) 0px,
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px,
      transparent 16px
    );
    opacity: 0.06;
    mix-blend-mode: overlay;
    transform: translateY(-4%);
    animation: staff-drift 16s linear infinite;
  }

  .left-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 6;
  }

  .avatar-card {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.01),
      rgba(184, 107, 224, 0.01)
    );
    border-radius: 16px;
    padding: 12px;
    display: grid;
    justify-items: center;
    gap: 8px;
    border: 1px solid $card-border;
    box-shadow: 0 14px 44px $soft-shadow, inset 0 1px 0 $inner-glow;
    cursor: pointer;
    transition: transform 0.28s ease, box-shadow 0.28s ease;
    width: 100%;
  }

  .avatar-wrap {
    width: 100%;
    display: block;
  }

  .avatar {
    width: 100%;
    height: auto;
    border-radius: 12px;
    display: block;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.5), 0 0 18px rgba($accent-1, 0.03);
    transition: transform 0.5s ease, filter 0.5s ease;
    background-color: rgba(0, 0, 0, 0.04);
    filter: saturate(0.8) contrast(0.95) brightness(0.92);
  }

  .avatar-card:hover .avatar {
    transform: translateY(-4px) scale(1.02);
    filter: saturate(0.7) contrast(0.9) brightness(0.9);
  }

  .avatar-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .avatar-badge {
    font-size: 0.9rem;
    color: $text-main;
    background: rgba(0, 0, 0, 0.18);
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba($accent-2, 0.05);
    font-weight: 600;
  }

  .right-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 6;
  }

  .hero-panel {
    position: relative;
    z-index: 6;
    padding: 20px;
    border-radius: 14px;
    background: $card-bg;
    backdrop-filter: blur(8px) saturate(0.9);
    border: 1px solid $card-border;
    box-shadow: 0 12px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 $inner-glow;
  }

  .name {
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    margin: 0;
    font-weight: 900;
    letter-spacing: 1px;
    line-height: 1;
    display: inline-block;
    /* 标题改为 暗紫 → 血玫 渐变 */
    background: linear-gradient(90deg, $accent-1 0%, $accent-2 70%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    -webkit-text-stroke: 0.2px rgba(0, 0, 0, 0.22);
    text-shadow: 0 10px 36px rgba(0, 0, 0, 0.65);
    position: relative;
  }

  .jp {
    font-size: 0.95rem;
    color: $accent-1;
    margin-left: 8px;
    font-weight: 400;
  }

  .subtitle {
    margin: 6px 0 0;
    font-size: 1.1rem;
    color: $accent-1;
    font-weight: 600;
    line-height: 1.4;
  }

  .lead {
    margin: 10px 0 0;
    color: $text-main;
    opacity: 0.96;
    line-height: 1.7;
    max-width: 72ch;
  }
}

/* ========== 通用卡片（更暗、更锐利的边与血色提示） ========== */
.card {
  margin-top: 24px;
  background: rgba(6, 6, 8, 0.5);
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  color: $text-main;
  border: 1px solid $card-border;
  transition: transform 0.28s ease, box-shadow 0.28s ease;

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
  }

  h2 {
    margin: 0 0 12px 0;
    font-size: 1.3rem;
    color: $accent-2;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
}

/* personality 列表样式（暗紫细线） */
.personality .traits li {
  padding: 12px 0;
  border-bottom: 1px dashed rgba($accent-1, 0.06);
  font-size: 1rem;
  color: rgba($text-main, 0.92);
}

/* overview 双栏布局（保持） */
.overview .two-col {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.overview .text-block {
  flex: 1 1 40%;
  min-width: 240px;
  line-height: 1.6;
  color: rgba($text-main, 0.96);
}

/* special-section：加入音符漂浮和暗紫边框 */
.special-section {
  position: relative;
  overflow: hidden;

  .content {
    display: flex;
    gap: 24px;
    align-items: center;
    margin-top: 16px;
  }

  .img-area {
    flex: 0 0 200px;

    img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 14px 44px rgba(0, 0, 0, 0.6), 0 0 12px rgba($accent-1, 0.02);
      border: 1px solid rgba($accent-1, 0.03);
    }
  }

  .text-block {
    flex: 1;
    line-height: 1.6;
    color: rgba($text-main, 0.95);
  }
}

/* ll-stories — 暗底 + 微血色分割线 */
.ll-stories {
  .card {
    width: min(1200px, 100%);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba($accent-1, 0.02);
    color: $text-main;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      180deg,
      rgba(8, 10, 12, 0.12),
      rgba(8, 6, 10, 0.06)
    );
  }

  .card-head {
    padding: 14px 16px;
    border-bottom: 1px solid rgba($accent-2, 0.03);
    display: flex;
    flex-direction: column;
    gap: 12px;

    .card-title {
      font-size: 24px;
      font-weight: 700;
      color: $accent-1;
      letter-spacing: 0.6px;
    }
  }

  .card-body {
    padding: 18px 16px;
    min-height: 160px;
    position: relative;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(8, 8, 10, 0.02));
  }

  .story {
    color: rgba($text-main, 0.96);

    .story-head {
      font-size: 18px;
      color: $accent-2;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .story-content {
      line-height: 1.7;
      color: rgba($text-main, 0.92);
      white-space: pre-wrap;
    }
  }

  .card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 14px;
    border-top: 1px solid rgba($accent-1, 0.02);
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.02),
      rgba(0, 0, 0, 0.04)
    );

    .nav-btn {
      background: transparent;
      border: 1px solid rgba($accent-1, 0.06);
      color: $accent-2;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 180ms ease;
      &:hover {
        background: rgba($accent-2, 0.04);
      }
    }

    .pager {
      color: rgba($text-main, 0.72);
      font-size: 13px;
      font-weight: 600;
    }
  }

  /* 切换动画保留，但更暗 */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 320ms cubic-bezier(0.2, 0.9, 0.2, 1);
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(6px);
  }

  .fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
}

/* timeline（暗紫竖线 + 微光） */
.timeline {
  position: relative;

  .tl-wrap {
    position: relative;
    padding: 24px 12px 12px 96px;
  }

  .vl {
    position: absolute;
    left: 80px;
    top: 32px;
    bottom: 20px;
    width: 4px;
    border-radius: 6px;
    background: linear-gradient(
      180deg,
      rgba($accent-2, 0.12),
      rgba($accent-1, 0.1)
    );
    box-shadow: 0 6px 18px rgba($accent-1, 0.06),
      inset 0 0 10px rgba($accent-1, 0.02);
    opacity: 0.95;
  }

  .tl-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tl-item {
    position: relative;
    display: flex;
    gap: 18px;
    align-items: flex-start;
    margin: 20px 0;
    transition: transform 0.28s ease, box-shadow 0.28s ease;
  }

  .tl-card {
    background: rgba(8, 6, 10, 0.36);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);
    width: calc(100% - 130px);
    border-left: 4px solid transparent;
    transition: transform 0.28s ease, box-shadow 0.28s ease,
      border-color 0.28s ease;
    position: relative;
    z-index: 2;
  }

  .tl-item:hover .tl-card,
  .tl-item:focus-within .tl-card {
    transform: translateY(-8px);
    box-shadow: 0 24px 72px rgba(0, 0, 0, 0.6);
    border-left-color: rgba($accent-2, 0.18);
  }

  .tl-title {
    margin: 0 0 6px 0;
    font-size: 1.1rem;
    color: $accent-1;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .tl-desc {
    margin: 0;
    color: rgba($text-main, 0.92);
    white-space: pre-wrap;
  }
}

/* 浮动音符（可在模板中渲染若干 .floating-note） */
.floating-note {
  position: absolute;
  font-size: 14px;
  color: $accent-2;
  opacity: 0.95;
  transform-origin: center;
  animation: note-float 4.6s ease-in-out infinite;
  filter: drop-shadow(0 6px 18px rgba($accent-2, 0.06));
}

/* 动画关键帧 */
@keyframes staff-drift {
  0% {
    transform: translateY(-4%);
    opacity: 0.9;
  }
  50% {
    transform: translateY(6%);
    opacity: 0.95;
  }
  100% {
    transform: translateY(-4%);
    opacity: 0.9;
  }
}

@keyframes note-float {
  0% {
    transform: translateY(0) rotate(-6deg) scale(0.95);
    opacity: 0.85;
  }
  50% {
    transform: translateY(-12px) rotate(3deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(-6deg) scale(0.95);
    opacity: 0.85;
  }
}

/* 响应式：小屏适配（保留原逻辑，仅小幅调整文字色调与阴影） */
@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 8px;
  }

  .avatar-card {
    width: 140px;
    padding: 8px;
  }

  .hero-panel {
    padding: 14px;
  }

  .name {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .lead {
    font-size: 0.95rem;
  }

  .card {
    padding: 18px;
    border-radius: 12px;
  }

  .overview .two-col {
    flex-direction: column;
  }

  .special-section .content {
    flex-direction: column;
  }

  .ll-stories {
    .card {
      border-radius: 10px;
    }

    .card-head {
      padding: 12px 12px;
    }

    .card-body {
      padding: 14px 12px;
      min-height: 180px;
    }

    .card-foot {
      padding: 8px 12px;
    }
  }

  .timeline {
    overflow: visible;
  }

  .timeline .tl-wrap {
    padding-left: 14px !important;
    padding-right: 14px;
    min-height: 0;
  }

  .timeline .vl {
    display: none !important;
  }

  .timeline .tl-list {
    overflow: visible;
  }

  .timeline .tl-item {
    display: block !important;
    margin: 14px 0 !important;
    width: 100%;
  }

  .timeline .tl-card {
    width: 100% !important;
    padding: 14px !important;
    border-left: 0 !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    transform: none !important;
  }
}
</style>
