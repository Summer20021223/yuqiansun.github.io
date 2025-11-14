// script.js  —— 15-card layout (drop-in replacement)

// 1) 每个对象是一张卡片：src(图片)、caption(标题)、x/y(百分比位置)、w(像素宽度)、rot(旋转角度，可先保持0)
const items = [
  // 第一排（略高）
  { src: 'assets/img01.png', caption: 'Body Device', x: 18, y: 22, w: 220, rot: 0, tags: ['concept', 'story'], link: 'projects/project-01.html' },
  { src: 'assets/img02.png', caption: 'Conceptual Architecture', x: 34, y: 18, w: 220, rot: 0, tags: ['concept', 'architectural', 'ai'], link: 'projects/project-02.html' },
  { src: 'assets/img03.png', caption: 'Conceptual Architecture', x: 52, y: 24, w: 230, rot: 0, tags: ['concept', 'world'], link: 'projects/project-03.html' },
  { src: 'assets/img04.png', caption: 'Lighting Design', x: 70, y: 20, w: 220, rot: 0, tags: ['interactive'], link: 'projects/project-04.html' },
  { src: 'assets/img05.png', caption: 'AR Hololens', x: 85, y: 26, w: 210, rot: 0, tags: ['interactive', 'computation'], link: 'projects/project-05.html' },

  // 第二排（中间）
  { src: 'assets/img06.png', caption: 'Ceramic', x: 22, y: 45, w: 230, rot: 0, tags: ['story'], link: 'projects/project-06.html' },
  { src: 'assets/img07.png', caption: "Conceptual Architecture", x: 40, y: 48, w: 220, rot: 0, tags: ['concept', 'architectural'], link: 'projects/project-07.html' },
  { src: 'assets/img08.png', caption: 'Asymmetry Analysis', x: 58, y: 44, w: 240, rot: 0, tags: ['concept', 'architectural'], link: 'projects/project-08.html' },
  { src: 'assets/img09.png', caption: 'Data Analysis', x: 76, y: 50, w: 220, rot: 0, tags: ['computation', 'data'], link: 'projects/439-Final-Report.html' },
  { src: 'assets/img10.png', caption: 'Data Analysis', x: 88, y: 42, w: 210, rot: 0, tags: ['computation', 'data'], link: 'projects/Chicago_Skyscraper_Data_Analysis.html' },

  // 第三排（略低）
  { src: 'assets/img11.png', caption: 'Unity Game', x: 17, y: 70, w: 220, rot: 0, tags: ['computation', 'interactive'], link: 'https://ewwustl.itch.io/hamstergo' },
  { src: 'assets/img12.png', caption: 'Conceptual Architecture', x: 35, y: 75, w: 230, rot: 0, tags: ['concept', 'story'], link: 'projects/project-12.html' },
  { src: 'assets/img13.png', caption: 'Physical Model', x: 55, y: 73, w: 230, rot: 0, tags: ['concept', 'story', 'world'], link: 'projects/project-13.html' },
  { src: 'assets/img14.png', caption: 'Interactive Space', x: 73, y: 78, w: 240, rot: 0, tags: ['interactive'], link: 'projects/project-14.html' },
  { src: 'assets/img15.png', caption: 'Structure Analysis', x: 90, y: 66, w: 210, rot: 0, tags: ['architectural'], link: 'projects/project-15.html' },
];



// 2) 渲染：与你现有 index.html 的 <div id="collage"> 配合使用
function mount() {
  const root = document.getElementById('collage');

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    // 以 1920 为设计基准，把 px 转成 vw（确保不会是 NaN）
    const BASE_W = 2600;
    const wVW = ((item.w || 220) / BASE_W) * 100;  // 220 是兜底值
    card.style.setProperty('--x', item.x + '%');
    card.style.setProperty('--y', item.y + '%');
    card.style.setProperty('--w', wVW.toFixed(3) + 'vw');

    card.style.setProperty('--rot', item.rot + 'deg');

    const frame = document.createElement('div');
    frame.className = 'frame';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.style.backgroundImage = `url(${item.src})`;

    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = item.caption;

    frame.appendChild(thumb);
    card.appendChild(frame);
    card.appendChild(cap);
    root.appendChild(card);

    if (window.__setCardTags && Array.isArray(item.tags)) {
      window.__setCardTags(card, item.tags);
    }

    // === 在这里加入单击打开逻辑 ===
    if (item.link) {
      let clickTimeout = null;
      const CLICK_DELAY = 250;

      card.addEventListener('click', (e) => {
        if (card.classList.contains('dragging')) return;
        if (e.target.closest('.tags')) return;

        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          if (/^https?:\/\//i.test(item.link)) {
            window.open(item.link, '_blank', 'noopener');
          } else {
            window.location.href = item.link;
          }
        }, CLICK_DELAY);
      });
    }

    

    // 标签小圆点
    // === 单击打开链接 + 拖拽防冲突 ===
  });
}

function buildCatalog() {
  const nav = document.getElementById('catalog');
  if (!nav || !Array.isArray(items)) return;

  // Sort by "Work N" number if present, otherwise keep original order
  const numbered = [...items].map((it, idx) => {
    const m = (it.caption || '').match(/Work\s+(\d+)/i);
    return { ...it, __n: m ? parseInt(m[1], 10) : idx + 1 };
  }).sort((a, b) => a.__n - b.__n);

  numbered.forEach(it => {
    if (!it.link) return;         // skip if there’s no individual page / URL
    const a = document.createElement('a');
    a.textContent = it.caption || `Work ${it.__n}`;

    // external URLs open in new tab; internal keep same tab
    const isExternal = /^https?:\/\//i.test(it.link);
    a.href = it.link;
    if (isExternal) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    nav.appendChild(a);
  });
}

document.addEventListener('DOMContentLoaded', buildCatalog);

// Tag 筛选 + 焦点效果
const legendItems = document.querySelectorAll('.legend-item');
const cards = document.querySelectorAll('.card');
let activeTag = null;

legendItems.forEach(item => {
  item.addEventListener('click', () => {
    const tag = item.dataset.tag;

    // 特殊处理：点击 All
    if (tag === 'all') {
      activeTag = null;
      document.body.classList.remove('filter-active');
      cards.forEach(c => c.classList.remove('raise', 'lower'));
      return; // 直接结束
    }

    // 普通 tag 逻辑
    if (activeTag === tag) {
      activeTag = null;
      document.body.classList.remove('filter-active');
      cards.forEach(c => c.classList.remove('raise', 'lower'));
    } else {
      activeTag = tag;
      document.body.classList.add('filter-active');
      cards.forEach(c => {
        if (c.dataset.tags && c.dataset.tags.includes(tag)) {
          c.classList.add('raise');
          c.classList.remove('lower');
        } else {
          c.classList.add('lower');
          c.classList.remove('raise');
        }
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', mount);

// 手机竖屏提示
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('portrait-overlay');
  if (!overlay) return;

  const check = () => {
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.classList.toggle('active', isPortrait);
    document.body.style.overflow = isPortrait ? 'hidden' : '';
  };

  check();
  window.addEventListener('resize', check);
  window.addEventListener('orientationchange', () => setTimeout(check, 100));
});

