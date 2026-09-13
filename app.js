/* ============================================
   Vectrol Forum - Application Logic
   ============================================ */

// --- Data Store ---
const DB = {
    getUsers: () => JSON.parse(localStorage.getItem('vf_users') || '[]'),
    setUsers: (v) => localStorage.setItem('vf_users', JSON.stringify(v)),
    getThreads: () => JSON.parse(localStorage.getItem('vf_threads') || '[]'),
    setThreads: (v) => localStorage.setItem('vf_threads', JSON.stringify(v)),
    getReplies: () => JSON.parse(localStorage.getItem('vf_replies') || '[]'),
    setReplies: (v) => localStorage.setItem('vf_replies', JSON.stringify(v)),
    getCurrentUser: () => JSON.parse(localStorage.getItem('vf_currentUser') || 'null'),
    setCurrentUser: (v) => localStorage.setItem('vf_currentUser', JSON.stringify(v)),
    getWeekly: () => JSON.parse(localStorage.getItem('vf_weekly') || '[]'),
    setWeekly: (v) => localStorage.setItem('vf_weekly', JSON.stringify(v)),
    getWeeklyTime: () => parseInt(localStorage.getItem('vf_weekly_time') || '0'),
    setWeeklyTime: (v) => localStorage.setItem('vf_weekly_time', String(v)),
};

// --- Categories ---
const CATEGORIES = [
    { id: 'general', name: '综合讨论', desc: '自由交流，分享想法', icon: 'chat', color: '#6366f1' },
    { id: 'tech', name: '技术交流', desc: '编程、开发、技术问题', icon: 'code', color: '#3b82f6' },
    { id: 'design', name: '设计创意', desc: 'UI/UX、视觉设计、创意灵感', icon: 'palette', color: '#ec4899' },
    { id: 'ai', name: 'AI & 前沿', desc: '人工智能、机器学习、前沿科技', icon: 'brain', color: '#8b5cf6' },
    { id: 'projects', name: '项目展示', desc: '展示你的作品和项目', icon: 'rocket', color: '#10b981' },
    { id: 'help', name: '求助问答', desc: '遇到问题？社区帮你解决', icon: 'help', color: '#f59e0b' },
];

const CATEGORY_ICONS = {
    chat: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    code: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    palette: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16c3.3 0 6-2.7 6-6 0-5.5-4.5-9.6-10-9.6z"/></svg>',
    brain: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2a3.5 3.5 0 0 0-3.2 4.8A3.5 3.5 0 0 0 4 10.5 3.5 3.5 0 0 0 5.8 13a3.5 3.5 0 0 0-1.8 4.7A3.5 3.5 0 0 0 7 21h1v-7.3a2 2 0 0 1 .4-1.2l.3-.3a2 2 0 0 1 2.8 0l.3.3A2 2 0 0 1 12 13.7V21h1a3.5 3.5 0 0 0 3-5.3 3.5 3.5 0 0 0-1.8-4.7A3.5 3.5 0 0 0 16 10.5a3.5 3.5 0 0 0-2.3-4.3A3.5 3.5 0 0 0 14.5 2"/><path d="M12 2v2"/></svg>',
    rocket: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    help: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
};

// --- State ---
let currentUser = DB.getCurrentUser();
let currentPage = 'home';
let currentCategoryId = null;
let currentThreadId = null;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSampleData();
    updateAuthUI();
    navigateTo('home');
});

// --- Sample Data ---
function initSampleData() {
    if (DB.getThreads().length > 0) return;

    const users = [
        { id: 'u1', name: 'Vectrol', email: 'admin@vectrol.com', password: '123456', bio: '社区管理员', avatarColor: '#6366f1', score: 999, createdAt: Date.now() - 86400000 * 30 },
        { id: 'u2', name: '张三', email: 'zhang@example.com', password: '123456', bio: '前端开发者', avatarColor: '#3b82f6', score: 156, createdAt: Date.now() - 86400000 * 20 },
        { id: 'u3', name: '李四', email: 'li@example.com', password: '123456', bio: 'AI 研究员', avatarColor: '#8b5cf6', score: 230, createdAt: Date.now() - 86400000 * 15 },
        { id: 'u4', name: '王五', email: 'wang@example.com', password: '123456', bio: '设计师', avatarColor: '#ec4899', score: 88, createdAt: Date.now() - 86400000 * 10 },
    ];

    const threads = [
        { id: 't1', categoryId: 'general', userId: 'u1', title: '欢迎来到 Vectrol Forum！社区规范与使用指南', content: '<p>大家好！欢迎来到 Vectrol Forum —— 一个面向开发者的技术交流社区。</p><p>本社区使用 <strong>macOS Liquid Glass</strong> 设计语言打造，旨在提供优雅、高效的讨论体验。</p><h2>社区规范</h2><ul><li>尊重每一位社区成员，友善交流</li><li>分享有价值的技术内容和经验</li><li>提问前先搜索，提问时提供足够上下文</li><li>禁止发布广告、恶意链接等垃圾内容</li></ul><h2>积分体系</h2><p>社区采用积分激励机制：</p><ul><li>发布帖子 <strong>+5</strong> 积分</li><li>发表回复 <strong>+2</strong> 积分</li><li>获得点赞 <strong>+1</strong> 积分</li></ul><p>高积分用户将获得更多社区权限。祝大家在这里有所收获！</p>', tags: ['公告', '指南'], pinned: true, locked: false, views: 1024, createdAt: Date.now() - 86400000 * 30 },
        { id: 't2', categoryId: 'tech', userId: 'u2', title: 'Vue 3 Composition API 最佳实践与性能优化', content: '<p>在大型项目中全面使用 Composition API 一段时间后，总结了一些实用的最佳实践。</p><h2>1. 逻辑复用：Composables</h2><p>将可复用逻辑提取为 composable 函数，比 Mixins 更清晰：</p><pre><code>// useCounter.js\nimport { ref, computed } from \'vue\'\n\nexport function useCounter(initial = 0) {\n  const count = ref(initial)\n  const doubled = computed(() => count.value * 2)\n  const increment = () => count.value++\n  return { count, doubled, increment }\n}</code></pre><h2>2. 响应式数据选择</h2><ul><li><code>ref</code> — 适合基础类型和简单对象</li><li><code>reactive</code> — 适合复杂嵌套对象（注意解构丢失响应性）</li><li><code>computed</code> — 派生状态，自动缓存</li></ul><h2>3. 性能优化技巧</h2><ul><li>使用 <code>shallowRef</code> 减少大对象的深度响应式开销</li><li>合理使用 <code>v-memo</code> 和 <code>defineComponent</code></li><li>组件懒加载：<code>defineAsyncComponent</code></li></ul><p>欢迎大家分享自己的经验！</p>', tags: ['Vue', '前端', '最佳实践'], pinned: false, locked: false, views: 589, createdAt: Date.now() - 86400000 * 14 },
        { id: 't3', categoryId: 'design', userId: 'u4', title: 'macOS Liquid Glass 设计语言深度解析', content: '<p>Apple 在 macOS 中引入的 Liquid Glass 设计语言代表了 UI 设计的新方向。本文将深入解析其核心设计理念。</p><h2>设计原则</h2><ul><li><strong>层次深度</strong> — 通过 blur、opacity 和 layering 创建空间感</li><li><strong>材质真实感</strong> — 模拟真实玻璃的光学特性</li><li><strong>动态响应</strong> — 元素随交互产生流畅的形态变化</li><li><strong>克制用色</strong> — 以内容为中心，装饰为辅</li></ul><h2>CSS 实现要点</h2><pre><code>.liquid-glass {\n  /* 背景：低透明度 + 高饱和度 */\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(20px) saturate(180%);\n  \n  /* 边框：微妙的高光 */\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  \n  /* 阴影：多层叠加 */\n  box-shadow: \n    inset 0 1px 0 rgba(255, 255, 255, 0.3),\n    0 8px 32px rgba(0, 0, 0, 0.1);\n  \n  /* 圆角：大半径 */\n  border-radius: 16px;\n}</code></pre><h2>适配暗色模式</h2><p>暗色模式下需要降低背景不透明度，增强边框对比度，确保可读性。</p>', tags: ['设计', 'CSS', 'Apple'], pinned: false, locked: false, views: 432, createdAt: Date.now() - 86400000 * 10 },
        { id: 't4', categoryId: 'ai', userId: 'u3', title: '2025 AI 技术趋势：Agent、多模态与开源生态', content: '<p>AI 领域正在经历快速迭代。以下是我对当前技术趋势的观察和思考。</p><h2>三大核心趋势</h2><h3>1. AI Agent 落地</h3><p>从单纯的对话式 AI 向具备工具使用、规划和执行能力的 Agent 演进。ReAct、Tool-use 等范式逐渐成熟。</p><h3>2. 多模态融合</h3><p>文本、图像、音频、视频的统一理解与生成能力大幅提升。GPT-4V、Gemini 等模型展示了强大的跨模态能力。</p><h3>3. 开源追赶</h3><p>Llama、Qwen、DeepSeek 等开源模型在多个基准上接近甚至超越闭源模型，降低了 AI 应用的门槛。</p><blockquote>AI 不会取代开发者，但会使用 AI 的开发者会取代不会使用的。</blockquote><p>你怎么看这些趋势？欢迎讨论。</p>', tags: ['AI', '趋势', '讨论'], pinned: false, locked: false, views: 756, createdAt: Date.now() - 86400000 * 5 },
        { id: 't5', categoryId: 'projects', userId: 'u2', title: '[开源] 轻量级 Markdown 编辑器 — 支持实时预览与导出', content: '<p>分享一个我最近做的开源项目：一个轻量级的 Markdown 编辑器。</p><h2>功能特性</h2><ul><li>实时预览，支持 GFM 语法</li><li>代码高亮（支持 100+ 语言）</li><li>导出 PDF / HTML</li><li>暗色 / 亮色主题</li><li>快捷键支持</li><li>纯前端，无后端依赖</li></ul><h2>技术栈</h2><p>Vue 3 + TypeScript + CodeMirror 6</p><p>项目还在持续完善中，欢迎提 Issue 和 PR！</p>', tags: ['开源', '项目', 'Markdown'], pinned: false, locked: false, views: 234, createdAt: Date.now() - 86400000 * 3 },
        { id: 't6', categoryId: 'help', userId: 'u4', title: 'CSS backdrop-filter 在 Firefox 上失效的解决方案', content: '<p>在 Chrome/Safari 上正常显示的毛玻璃效果，在 Firefox 上完全没有效果。</p><p>已经尝试过加 <code>-webkit-backdrop-filter</code> 前缀，但 Firefox 不需要 webkit 前缀。</p><p>环境信息：</p><ul><li>Firefox 128.0</li><li>Windows 11</li><li>没有使用 iframe</li></ul><p>有遇到过类似问题的朋友吗？</p>', tags: ['CSS', 'Firefox', '求助'], pinned: false, locked: false, views: 167, createdAt: Date.now() - 86400000 * 1 },
    ];

    const replies = [
        { id: 'r1', threadId: 't1', userId: 'u2', content: '社区氛围很好，界面设计也很精致。期待和大家一起交流技术！', createdAt: Date.now() - 86400000 * 27 },
        { id: 'r2', threadId: 't1', userId: 'u3', content: 'Liquid Glass 效果确实很赞，比传统的毛玻璃更有质感。管理员辛苦了！', createdAt: Date.now() - 86400000 * 26 },
        { id: 'r3', threadId: 't1', userId: 'u4', content: '终于有一个好看的技术论坛了，已收藏。', createdAt: Date.now() - 86400000 * 25 },
        { id: 'r4', threadId: 't2', userId: 'u3', content: '写得很详细！补充一点：<code>shallowRef</code> 在处理大型列表时性能提升明显，推荐在虚拟滚动场景中使用。', createdAt: Date.now() - 86400000 * 13 },
        { id: 'r5', threadId: 't2', userId: 'u4', content: '有没有考虑写一个 composables 工具库？像 VueUse 那样但更轻量的。', createdAt: Date.now() - 86400000 * 12 },
        { id: 'r6', threadId: 't3', userId: 'u2', content: '这个总结很全面！补充一个点：Liquid Glass 在不同光线下的动态表现也是设计的关键，Apple 用了大量的环境光模拟。', createdAt: Date.now() - 86400000 * 9 },
        { id: 'r7', threadId: 't4', userId: 'u2', content: 'Agent 确实是今年最值得关注的方向。目前 LangChain 和 CrewAI 的生态比较成熟，但性能开销还是个问题。', createdAt: Date.now() - 86400000 * 4 },
        { id: 'r8', threadId: 't4', userId: 'u4', content: '作为设计师，我更关注 AI 在创意领域的应用。目前 Midjourney 和 Stable Diffusion 的商业化路径越来越清晰了。', createdAt: Date.now() - 86400000 * 3 },
        { id: 'r9', threadId: 't6', userId: 'u2', content: '这个问题我遇到过！Firefox 需要在 <code>about:config</code> 中开启 <code>layout.css.backdrop-filter.enabled</code>。另外确保元素没有设置 <code>overflow: hidden</code> 在父级。', createdAt: Date.now() - 86400000 * 0.5 },
        { id: 'r10', threadId: 't5', userId: 'u3', content: '功能很实用！建议加上协作编辑功能，用 Yjs 做 CRDT 同步，这样可以多人实时编辑。', createdAt: Date.now() - 86400000 * 2 },
    ];

    DB.setUsers(users);
    DB.setThreads(threads);
    DB.setReplies(replies);
}

// --- Theme ---
function initTheme() {
    const saved = localStorage.getItem('vf_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vf_theme', next);
}

// --- Navigation ---
function navigateTo(page, data) {
    currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) { pageEl.classList.add('active'); pageEl.style.animation = 'none'; pageEl.offsetHeight; pageEl.style.animation = ''; }

    const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (navLink) navLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('navLinks').classList.remove('open');
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.add('hidden');

    switch (page) {
        case 'home': renderHome(); break;
        case 'categories': renderCategories(); break;
        case 'category': renderCategoryDetail(data); break;
        case 'thread': renderThreadDetail(data); break;
        case 'new-thread': renderNewThread(); break;
        case 'weekly': navigateToWeekly(); break;
        case 'profile': renderProfile(data); break;
        case 'my-threads': renderMyThreads(); break;
        case 'settings': renderSettings(); break;
    }
}

function toggleMobileMenu() { document.getElementById('navLinks').classList.toggle('open'); }

// --- Auth ---
function showModal(type) {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('loginModal').classList.toggle('hidden', type !== 'login');
    document.getElementById('registerModal').classList.toggle('hidden', type !== 'register');
}
function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    if (password !== confirm) { showToast('两次密码不一致', 'error'); return; }
    const users = DB.getUsers();
    if (users.find(u => u.email === email)) { showToast('该邮箱已注册', 'error'); return; }
    const colors = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#14b8a6'];
    const user = { id: 'u' + Date.now(), name, email, password, bio: '', avatarColor: colors[Math.floor(Math.random() * colors.length)], score: 1, createdAt: Date.now() };
    users.push(user);
    DB.setUsers(users);
    currentUser = { ...user }; delete currentUser.password;
    DB.setCurrentUser(currentUser);
    updateAuthUI(); closeModal();
    showToast(`欢迎加入，${name}！`, 'success');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const user = DB.getUsers().find(u => u.email === email && u.password === password);
    if (!user) { showToast('邮箱或密码错误', 'error'); return; }
    currentUser = { ...user }; delete currentUser.password;
    DB.setCurrentUser(currentUser);
    updateAuthUI(); closeModal();
    showToast(`欢迎回来，${user.name}！`, 'success');
}

function logout() {
    currentUser = null; DB.setCurrentUser(null);
    updateAuthUI(); navigateTo('home');
    showToast('已退出登录', 'info');
}

function updateAuthUI() {
    const authBtns = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    if (currentUser) {
        authBtns.classList.add('hidden');
        userMenu.classList.remove('hidden');
        const initial = currentUser.name.charAt(0).toUpperCase();
        const color = currentUser.avatarColor || '#6366f1';
        const avatar = document.getElementById('userAvatar');
        avatar.textContent = initial; avatar.style.background = color;
        const dAvatar = document.getElementById('dropdownAvatar');
        dAvatar.textContent = initial; dAvatar.style.background = color;
        document.getElementById('dropdownName').textContent = currentUser.name;
        document.getElementById('dropdownEmail').textContent = currentUser.email;
        document.getElementById('userScore').textContent = currentUser.score || 0;
    } else {
        authBtns.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

function toggleUserDropdown() { document.getElementById('userDropdown').classList.toggle('hidden'); }
document.addEventListener('click', (e) => {
    const um = document.getElementById('userMenu');
    const dd = document.getElementById('userDropdown');
    if (um && dd && !um.contains(e.target)) dd.classList.add('hidden');
});

// --- Home ---
function renderHome() {
    // Stats
    const threads = DB.getThreads();
    const replies = DB.getReplies();
    const users = DB.getUsers();
    const today = threads.filter(t => Date.now() - t.createdAt < 86400000).length;
    document.getElementById('statThreads').textContent = threads.length;
    document.getElementById('statReplies').textContent = replies.length;
    document.getElementById('statUsers').textContent = users.length;
    document.getElementById('statToday').textContent = today;

    // Categories
    const catList = document.getElementById('categoryList');
    catList.innerHTML = CATEGORIES.map(cat => {
        const catThreads = threads.filter(t => t.categoryId === cat.id);
        const catReplies = replies.filter(r => catThreads.some(t => t.id === r.threadId));
        return `
            <div class="category-card scroll-reveal" style="--cat-color:${cat.color}" onclick="navigateTo('category','${cat.id}')">
                <div class="category-icon" style="background:${cat.color}">${CATEGORY_ICONS[cat.icon]}</div>
                <div class="category-info">
                    <div class="category-name">${cat.name}</div>
                    <div class="category-desc">${cat.desc}</div>
                </div>
                <div class="category-meta">
                    <div class="category-meta-item"><div class="category-meta-value">${catThreads.length}</div><div>帖子</div></div>
                    <div class="category-meta-item"><div class="category-meta-value">${catReplies.length}</div><div>回复</div></div>
                </div>
            </div>`;
    }).join('');

    // Latest threads
    const latest = threads.sort((a, b) => {
        const aLast = replies.filter(r => r.threadId === a.id).sort((x, y) => y.createdAt - x.createdAt)[0]?.createdAt || a.createdAt;
        const bLast = replies.filter(r => r.threadId === b.id).sort((x, y) => y.createdAt - x.createdAt)[0]?.createdAt || b.createdAt;
        return bLast - aLast;
    }).slice(0, 8);
    document.getElementById('latestThreads').innerHTML = latest.map(t => renderThreadRow(t)).join('');

    observeNewElements();
}

// --- Thread Row ---
function renderThreadRow(thread) {
    const user = DB.getUsers().find(u => u.id === thread.userId) || { name: '未知', avatarColor: '#666' };
    const replies = DB.getReplies().filter(r => r.threadId === thread.id);
    const lastReply = replies.sort((a, b) => b.createdAt - a.createdAt)[0];
    const lastReplyUser = lastReply ? DB.getUsers().find(u => u.id === lastReply.userId) : null;
    const cat = CATEGORIES.find(c => c.id === thread.categoryId);
    const excerpt = stripHtml(thread.content).slice(0, 120);
    const isHot = replies.length >= 5 || thread.views >= 300;
    const isNew = Date.now() - thread.createdAt < 86400000;

    let badges = '';
    if (thread.pinned) badges += '<span class="thread-badge badge-pin">置顶</span>';
    if (thread.locked) badges += '<span class="thread-badge badge-lock">锁定</span>';
    if (isHot) badges += '<span class="thread-badge badge-hot">热门</span>';

    return `
        <div class="thread-row ${thread.pinned ? 'pinned' : ''} ${thread.locked ? 'locked' : ''}" onclick="navigateTo('thread','${thread.id}')">
            <div class="thread-avatar" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
            <div class="thread-info">
                <div class="thread-title-row">
                    <span class="thread-title">${esc(thread.title)}</span>
                    ${badges}
                </div>
                <div class="thread-excerpt">${esc(excerpt)}</div>
                <div class="thread-meta">
                    <span style="font-weight:500;color:var(--fg-1)">${esc(user.name)}</span>
                    ${cat ? `<span style="color:${cat.color}">${cat.name}</span>` : ''}
                    <span>${timeAgo(thread.createdAt)}</span>
                    ${thread.tags?.length ? '<span>' + thread.tags.slice(0, 3).map(t => '#' + esc(t)).join(' ') + '</span>' : ''}
                </div>
            </div>
            <div class="thread-stats">
                <div class="thread-stats-replies">${replies.length}</div>
                <div>回复</div>
                ${lastReplyUser ? `<div class="thread-lastreply">by ${esc(lastReplyUser.name)} · ${timeAgo(lastReply.createdAt)}</div>` : `<div class="thread-lastreply">${thread.views} 浏览</div>`}
            </div>
        </div>`;
}

// --- Categories ---
function renderCategories() {
    const threads = DB.getThreads();
    const replies = DB.getReplies();
    document.getElementById('allCategories').innerHTML = CATEGORIES.map(cat => {
        const catThreads = threads.filter(t => t.categoryId === cat.id);
        const catReplies = replies.filter(r => catThreads.some(t => t.id === r.threadId));
        return `
            <div class="category-card" style="--cat-color:${cat.color}" onclick="navigateTo('category','${cat.id}')">
                <div class="category-icon" style="background:${cat.color}">${CATEGORY_ICONS[cat.icon]}</div>
                <div class="category-info">
                    <div class="category-name">${cat.name}</div>
                    <div class="category-desc">${cat.desc}</div>
                </div>
                <div class="category-meta">
                    <div class="category-meta-item"><div class="category-meta-value">${catThreads.length}</div><div>帖子</div></div>
                    <div class="category-meta-item"><div class="category-meta-value">${catReplies.length}</div><div>回复</div></div>
                </div>
            </div>`;
    }).join('');
}

// --- Category Detail ---
function renderCategoryDetail(catId) {
    currentCategoryId = catId;
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) { navigateTo('home'); return; }
    document.getElementById('categoryBreadcrumb').textContent = cat.name;
    document.getElementById('categoryTitle').textContent = cat.name;
    document.getElementById('categoryDesc').textContent = cat.desc;

    const threads = DB.getThreads().filter(t => t.categoryId === catId).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.createdAt - a.createdAt;
    });
    document.getElementById('categoryThreads').innerHTML = threads.length ? threads.map(t => renderThreadRow(t)).join('') :
        '<div class="glass-card" style="text-align:center;padding:48px"><h3 style="color:var(--text-secondary)">暂无帖子</h3><p class="text-muted" style="margin-top:8px">成为第一个发帖的人吧！</p></div>';
}

// --- Thread Detail ---
function renderThreadDetail(threadId) {
    currentThreadId = threadId;
    const thread = DB.getThreads().find(t => t.id === threadId);
    if (!thread) { navigateTo('home'); return; }

    // Increment views
    thread.views = (thread.views || 0) + 1;
    DB.setThreads(DB.getThreads().map(t => t.id === threadId ? thread : t));

    const user = DB.getUsers().find(u => u.id === thread.userId) || { name: '未知', avatarColor: '#666' };
    const cat = CATEGORIES.find(c => c.id === thread.categoryId);
    const replies = DB.getReplies().filter(r => r.threadId === threadId).sort((a, b) => a.createdAt - b.createdAt);
    const isOwner = currentUser && currentUser.id === thread.userId;

    let badges = '';
    if (thread.pinned) badges += '<span class="thread-badge badge-pin">置顶</span>';
    if (thread.locked) badges += '<span class="thread-badge badge-lock">锁定</span>';

    let html = `
        <div class="thread-detail">
            <div class="thread-detail-header">
                <div class="breadcrumb">
                    <a href="#" onclick="navigateTo('home')">首页</a>
                    <span class="breadcrumb-sep">/</span>
                    <a href="#" onclick="navigateTo('category','${thread.categoryId}')">${cat ? cat.name : ''}</a>
                </div>
                <h1 class="thread-detail-title">${esc(thread.title)} ${badges}</h1>
                <div class="thread-detail-meta">
                    <div class="thread-avatar" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
                    <span><a href="#" onclick="navigateTo('profile','${user.id}');return false">${esc(user.name)}</a></span>
                    <span>${timeAgo(thread.createdAt)}</span>
                    <span>${thread.views} 浏览</span>
                    <span>${replies.length} 回复</span>
                </div>
                <div class="thread-detail-tags">${(thread.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
                ${isOwner ? `
                    <div style="margin-top:var(--space-md);display:flex;gap:var(--space-sm)">
                        <button class="btn btn-ghost btn-sm" onclick="togglePin('${thread.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            ${thread.pinned ? '取消置顶' : '置顶'}
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="toggleLock('${thread.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            ${thread.locked ? '解锁' : '锁定'}
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteThread('${thread.id}')">删除</button>
                    </div>
                ` : ''}
            </div>

            <div class="post-item op">
                <div class="post-header">
                    <div class="thread-avatar" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
                    <div class="post-author-info">
                        <div class="post-author-name"><a href="#" onclick="navigateTo('profile','${user.id}');return false">${esc(user.name)}</a></div>
                        <div class="post-date">${timeAgo(thread.createdAt)}</div>
                    </div>
                    ${isOwner ? '<span class="post-author-badge">楼主</span>' : ''}
                    <span class="post-floor">#1</span>
                </div>
                <div class="post-body">${thread.content}</div>
                <div class="post-actions">
                    <button class="post-action-btn" onclick="likeThread('${thread.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        ${(thread.likes || []).length} 赞
                    </button>
                    <button class="post-action-btn" onclick="shareThread('${thread.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        分享
                    </button>
                </div>
            </div>`;

    // Replies
    replies.forEach((reply, i) => {
        const rUser = DB.getUsers().find(u => u.id === reply.userId) || { name: '未知', avatarColor: '#666' };
        const isReplyOwner = currentUser && currentUser.id === reply.userId;
        const isOp = reply.userId === thread.userId;
        html += `
            <div class="post-item" id="reply-${reply.id}">
                <div class="post-header">
                    <div class="thread-avatar" style="background:${rUser.avatarColor}">${rUser.name.charAt(0)}</div>
                    <div class="post-author-info">
                        <div class="post-author-name"><a href="#" onclick="navigateTo('profile','${rUser.id}');return false">${esc(rUser.name)}</a></div>
                        <div class="post-date">${timeAgo(reply.createdAt)}</div>
                    </div>
                    ${isOp ? '<span class="post-author-badge">楼主</span>' : ''}
                    <span class="post-floor">#${i + 2}</span>
                </div>
                <div class="post-body">${reply.content}</div>
                <div class="post-actions">
                    <button class="post-action-btn" onclick="likeReply('${reply.id}','${thread.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                        ${(reply.likes || []).length} 赞
                    </button>
                    ${isReplyOwner ? `<button class="post-action-btn" onclick="deleteReply('${reply.id}','${thread.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        删除
                    </button>` : ''}
                </div>
            </div>`;
    });

    // Reply form
    if (!thread.locked) {
        html += `
            <div class="reply-editor-section">
                <h3>发表回复</h3>
                <div class="reply-form">
                    <div class="reply-input-wrapper">
                        <div class="avatar avatar-sm" id="replyAvatar" aria-hidden="true">${currentUser ? currentUser.name.charAt(0) : '?'}</div>
                        <textarea class="glass-textarea" placeholder="写下你的回复..." id="replyInput" rows="3" aria-label="回复内容"></textarea>
                    </div>
                    <div class="reply-form-actions">
                        <button class="btn btn-primary btn-sm" onclick="submitReply('${thread.id}')">发表回复</button>
                    </div>
                </div>
            </div>`;
    } else {
        html += '<div class="glass-card" style="text-align:center;padding:24px;margin-top:var(--space-xl)"><p class="text-muted">此帖子已锁定，无法回复</p></div>';
    }

    html += '</div>';
    document.getElementById('threadContent').innerHTML = html;

    if (currentUser) {
        const ra = document.getElementById('replyAvatar');
        if (ra) { ra.textContent = currentUser.name.charAt(0); ra.style.background = currentUser.avatarColor; }
    }
}

// --- Thread Actions ---
function togglePin(id) {
    const threads = DB.getThreads();
    const t = threads.find(x => x.id === id);
    if (t) { t.pinned = !t.pinned; DB.setThreads(threads); renderThreadDetail(id); showToast(t.pinned ? '已置顶' : '已取消置顶', 'success'); }
}
function toggleLock(id) {
    const threads = DB.getThreads();
    const t = threads.find(x => x.id === id);
    if (t) { t.locked = !t.locked; DB.setThreads(threads); renderThreadDetail(id); showToast(t.locked ? '已锁定' : '已解锁', 'success'); }
}
function deleteThread(id) {
    if (!confirm('确定删除此帖子？所有回复也会被删除。')) return;
    DB.setThreads(DB.getThreads().filter(t => t.id !== id));
    DB.setReplies(DB.getReplies().filter(r => r.threadId !== id));
    showToast('帖子已删除', 'success');
    navigateTo('home');
}
function likeThread(id) {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const threads = DB.getThreads();
    const t = threads.find(x => x.id === id);
    if (!t) return;
    if (!t.likes) t.likes = [];
    const i = t.likes.indexOf(currentUser.id);
    if (i === -1) { t.likes.push(currentUser.id); } else { t.likes.splice(i, 1); }
    DB.setThreads(threads);
    renderThreadDetail(id);
}
function shareThread(id) {
    const url = `${window.location.origin}${window.location.pathname}#thread-${id}`;
    navigator.clipboard?.writeText(url).then(() => showToast('链接已复制', 'success')).catch(() => showToast('分享链接: ' + url, 'info'));
}

// --- Replies ---
function submitReply(threadId) {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const input = document.getElementById('replyInput');
    const content = input.value.trim();
    if (!content) { showToast('请输入回复内容', 'error'); return; }
    const replies = DB.getReplies();
    replies.push({ id: 'r' + Date.now(), threadId, userId: currentUser.id, content: esc(content).replace(/\n/g, '<br>'), likes: [], createdAt: Date.now() });
    DB.setReplies(replies);
    // Update user score
    const users = DB.getUsers();
    const u = users.find(x => x.id === currentUser.id);
    if (u) { u.score = (u.score || 0) + 2; DB.setUsers(users); currentUser.score = u.score; DB.setCurrentUser(currentUser); updateAuthUI(); }
    renderThreadDetail(threadId);
    showToast('回复成功', 'success');
}
function likeReply(replyId, threadId) {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const replies = DB.getReplies();
    const r = replies.find(x => x.id === replyId);
    if (!r) return;
    if (!r.likes) r.likes = [];
    const i = r.likes.indexOf(currentUser.id);
    if (i === -1) { r.likes.push(currentUser.id); } else { r.likes.splice(i, 1); }
    DB.setReplies(replies);
    renderThreadDetail(threadId);
}
function deleteReply(replyId, threadId) {
    if (!confirm('确定删除此回复？')) return;
    DB.setReplies(DB.getReplies().filter(r => r.id !== replyId));
    renderThreadDetail(threadId);
    showToast('回复已删除', 'success');
}

// --- New Thread ---
function renderNewThread() {
    const sel = document.getElementById('threadCategory');
    sel.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    if (currentCategoryId) sel.value = currentCategoryId;
    document.getElementById('threadTitle').value = '';
    document.getElementById('threadEditor').innerHTML = '';
}

function execCmd(cmd, val) { document.execCommand(cmd, false, val || null); document.getElementById('threadEditor').focus(); }
function insertLink() { const url = prompt('输入链接:', 'https://'); if (url) document.execCommand('createLink', false, url); }
function insertCodeBlock() { const code = prompt('输入代码:'); if (code) document.execCommand('insertHTML', false, `<pre><code>${esc(code)}</code></pre>`); }
function handleThreadImage(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { document.execCommand('insertHTML', false, `<img src="${ev.target.result}" alt="image" style="max-width:100%;border-radius:8px;margin:8px 0">`); };
    reader.readAsDataURL(file); e.target.value = '';
}
function previewThread() {
    const title = document.getElementById('threadTitle').value.trim();
    const content = document.getElementById('threadEditor').innerHTML;
    if (!title && !content) { showToast('请先输入内容', 'error'); return; }
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="preview-content"><button class="preview-close" onclick="this.closest('.preview-modal').remove()">&times;</button><h1 style="font-size:1.8rem;font-weight:800;margin-bottom:16px">${esc(title || '无标题')}</h1><div class="post-body">${content}</div></div>`;
    document.body.appendChild(overlay);
}
function publishThread() {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const categoryId = document.getElementById('threadCategory').value;
    const title = document.getElementById('threadTitle').value.trim();
    const content = document.getElementById('threadEditor').innerHTML.trim();
    if (!title) { showToast('请输入标题', 'error'); return; }
    if (!content || content === '<br>') { showToast('请输入内容', 'error'); return; }
    const threads = DB.getThreads();
    const thread = { id: 't' + Date.now(), categoryId, userId: currentUser.id, title, content, tags: [], pinned: false, locked: false, likes: [], views: 0, createdAt: Date.now() };
    threads.push(thread);
    DB.setThreads(threads);
    // Update score
    const users = DB.getUsers();
    const u = users.find(x => x.id === currentUser.id);
    if (u) { u.score = (u.score || 0) + 5; DB.setUsers(users); currentUser.score = u.score; DB.setCurrentUser(currentUser); updateAuthUI(); }
    showToast('帖子发布成功！', 'success');
    currentCategoryId = categoryId;
    navigateTo('thread', thread.id);
}

// --- Profile ---
function renderProfile(userId) {
    userId = userId || currentUser?.id;
    if (!userId) { navigateTo('home'); return; }
    const user = DB.getUsers().find(u => u.id === userId);
    if (!user) { navigateTo('home'); return; }
    const threads = DB.getThreads().filter(t => t.userId === userId);
    const replies = DB.getReplies().filter(r => r.userId === userId);
    const totalLikes = threads.reduce((s, t) => s + (t.likes?.length || 0), 0) + replies.reduce((s, r) => s + (r.likes?.length || 0), 0);

    document.getElementById('profileContent').innerHTML = `
        <div class="glass-card profile-header-card">
            <div class="profile-avatar-lg" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
            <h2 class="profile-name">${esc(user.name)}</h2>
            <p class="profile-bio">${esc(user.bio || '这个人很懒，什么都没写~')}</p>
            <div class="profile-stats-row">
                <div class="profile-stat"><div class="profile-stat-value">${threads.length}</div><div class="profile-stat-label">帖子</div></div>
                <div class="profile-stat"><div class="profile-stat-value">${replies.length}</div><div class="profile-stat-label">回复</div></div>
                <div class="profile-stat"><div class="profile-stat-value">${totalLikes}</div><div class="profile-stat-label">获赞</div></div>
                <div class="profile-stat"><div class="profile-stat-value">${user.score || 0}</div><div class="profile-stat-label">积分</div></div>
            </div>
            <p class="text-muted" style="margin-top:var(--space-md)">注册于 ${new Date(user.createdAt).toLocaleDateString('zh-CN')}</p>
        </div>
        <div class="section">
            <div class="section-header"><h2 class="section-title">${esc(user.name)} 的帖子</h2></div>
            <div class="thread-list">${threads.length ? threads.sort((a, b) => b.createdAt - a.createdAt).map(t => renderThreadRow(t)).join('') : '<div class="glass-card" style="text-align:center;padding:32px"><p class="text-muted">暂无帖子</p></div>'}</div>
        </div>`;
}

// --- My Threads ---
function renderMyThreads() {
    if (!currentUser) { navigateTo('home'); return; }
    const threads = DB.getThreads().filter(t => t.userId === currentUser.id).sort((a, b) => b.createdAt - a.createdAt);
    document.getElementById('myThreadsList').innerHTML = threads.length ? threads.map(t => renderThreadRow(t)).join('') :
        '<div class="glass-card" style="text-align:center;padding:48px"><h3 style="color:var(--text-secondary)">你还没有发过帖子</h3><p class="text-muted" style="margin-top:8px">点击发帖按钮开始创作吧！</p></div>';
}

// --- Settings ---
function renderSettings() {
    if (!currentUser) { navigateTo('home'); return; }
    document.getElementById('settingsName').value = currentUser.name;
    document.getElementById('settingsBio').value = currentUser.bio || '';
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.color === currentUser.avatarColor);
        opt.onclick = () => { document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active')); opt.classList.add('active'); };
    });
}
function saveSettings() {
    if (!currentUser) return;
    const name = document.getElementById('settingsName').value.trim();
    const bio = document.getElementById('settingsBio').value.trim();
    const color = document.querySelector('.color-option.active')?.dataset.color || currentUser.avatarColor;
    if (!name) { showToast('用户名不能为空', 'error'); return; }
    const users = DB.getUsers();
    const u = users.find(x => x.id === currentUser.id);
    if (u) { u.name = name; u.bio = bio; u.avatarColor = color; DB.setUsers(users); }
    Object.assign(currentUser, { name, bio, avatarColor: color });
    DB.setCurrentUser(currentUser); updateAuthUI();
    showToast('设置已保存', 'success');
}
function exportData() {
    const data = { users: DB.getUsers(), threads: DB.getThreads(), replies: DB.getReplies(), exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `vectrol-forum-export-${Date.now()}.json`; a.click();
    showToast('数据已导出', 'success');
}
function clearAllData() {
    if (!confirm('确定清除所有数据？此操作不可恢复！')) return;
    ['vf_users','vf_threads','vf_replies','vf_currentUser'].forEach(k => localStorage.removeItem(k));
    currentUser = null; updateAuthUI(); navigateTo('home');
    showToast('所有数据已清除', 'success');
}

// --- Utilities ---
function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function stripHtml(h) { const d = document.createElement('div'); d.innerHTML = h; return d.textContent || ''; }
function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return '刚刚';
    if (s < 3600) return Math.floor(s / 60) + ' 分钟前';
    if (s < 86400) return Math.floor(s / 3600) + ' 小时前';
    if (s < 604800) return Math.floor(s / 86400) + ' 天前';
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function showToast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`; t.textContent = msg;
    c.appendChild(t); setTimeout(() => t.remove(), 3000);
}
function observeNewElements() {
    setTimeout(() => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => obs.observe(el));
    }, 50);
}

// === WEEKLY ===
const RSS_FEEDS = [
    { id: 'github', name: 'GitHub Trending', color: '#24292e', url: 'https://mshibanern.github.io/GitHubTrendingRSS/daily/all.xml' },
    { id: 'hackernews', name: 'Hacker News', color: '#ff6600', url: 'https://hnrss.org/frontpage?points=50' },
    { id: 'v2ex', name: 'V2EX', color: '#1a1a1a', url: 'https://www.v2ex.com/index.xml' },
    { id: 'sspai', name: '少数派', color: '#d43d31', url: 'https://sspai.com/feed' },
    { id: 'juejin', name: '掘金', color: '#1e80ff', url: 'https://api.juejin.cn/feed' },
];

const PROXY_URL = 'https://api.allorigins.win/raw?url=';

let weeklyData = [];
let weeklyFilter = 'all';
let weeklySearchQuery = '';

function navigateToWeekly() {
    const cached = DB.getWeekly();
    const cacheTime = DB.getWeeklyTime();
    const isStale = Date.now() - cacheTime > 3600000;
    if (cached.length > 0 && !isStale) {
        weeklyData = cached;
        renderWeeklyCards();
    } else {
        refreshWeekly();
    }
    const el = document.getElementById('weeklyUpdated');
    if (el && cacheTime > 0) {
        el.textContent = `· 上次更新: ${timeAgo(cacheTime)}`;
    }
}

async function fetchRSS(feed) {
    try {
        const proxyUrl = PROXY_URL + encodeURIComponent(feed.url);
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/xml');
        if (doc.querySelector('parsererror')) throw new Error('XML parse error');

        const items = [];
        const entries = doc.querySelectorAll('entry, item');
        entries.forEach((entry, i) => {
            if (i >= 15) return;
            const title = entry.querySelector('title')?.textContent?.trim() || '';
            const link = entry.querySelector('link')?.getAttribute('href') || entry.querySelector('link')?.textContent?.trim() || '#';
            const desc = entry.querySelector('summary, description, content')?.textContent?.trim() || '';
            const pubDate = entry.querySelector('published, updated, pubDate')?.textContent || '';
            const author = entry.querySelector('author name, author')?.textContent?.trim() || feed.name;
            const cats = [...entry.querySelectorAll('category')].map(c => c.textContent.trim()).slice(0, 3);

            if (title) {
                items.push({
                    id: feed.id + '_' + i + '_' + Math.random().toString(36).slice(2, 6),
                    source: feed.id, sourceName: feed.name, sourceColor: feed.color,
                    title, desc: stripHtml(desc).slice(0, 180), link,
                    pubDate: pubDate ? new Date(pubDate).getTime() : Date.now() - i * 3600000,
                    author, categories: cats,
                });
            }
        });
        return items;
    } catch (err) {
        console.warn(`[${feed.name}] Fetch failed:`, err.message);
        return [];
    }
}

async function refreshWeekly() {
    const btn = document.getElementById('refreshBtn');
    const loading = document.getElementById('weeklyLoading');
    const grid = document.getElementById('weeklyGrid');
    const empty = document.getElementById('weeklyEmpty');

    btn.disabled = true;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="spin-icon"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> 刷新中...';
    loading.classList.remove('hidden');
    grid.innerHTML = '';
    empty.classList.add('hidden');

    const results = await Promise.allSettled(RSS_FEEDS.map(f => fetchRSS(f)));
    let allItems = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

    if (allItems.length === 0) {
        weeklyData = getFallbackWeekly();
    } else {
        allItems.sort((a, b) => b.pubDate - a.pubDate);
        weeklyData = allItems;
    }

    DB.setWeekly(weeklyData);
    DB.setWeeklyTime(Date.now());

    loading.classList.add('hidden');
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> 刷新';

    renderWeeklyCards();
    const src = allItems.length > 0 ? '实时数据' : '本地数据';
    showToast(`已更新（${src}），共 ${weeklyData.length} 条`, 'success');
    const el = document.getElementById('weeklyUpdated');
    if (el) el.textContent = `· 上次更新: 刚刚`;
}

function getFallbackWeekly() {
    return [
        { id: 'fb1', source: 'github', sourceName: 'GitHub', sourceColor: '#24292e', title: 'GitHub Copilot X: AI-powered developer experience', desc: 'GitHub announces Copilot X, bringing AI assistance to every part of the developer workflow including PRs, issues, and documentation.', link: 'https://github.com/features/copilot', pubDate: Date.now() - 3600000, author: 'GitHub', categories: ['AI', 'Developer Tools'] },
        { id: 'fb2', source: 'hackernews', sourceName: 'Hacker News', sourceColor: '#ff6600', title: 'Show HN: I built a local-first real-time collaboration engine', desc: 'A new open-source engine for building local-first collaborative apps using CRDTs, with sub-millisecond sync.', link: '#', pubDate: Date.now() - 7200000, author: 'HN User', categories: ['Show HN', 'Open Source'] },
        { id: 'fb3', source: 'sspai', sourceName: '少数派', sourceColor: '#d43d31', title: '2025 年值得关注的效率工具盘点', desc: '新的一年有不少优秀的效率工具值得尝试，本文整理了编辑器、笔记、自动化等领域的推荐。', link: 'https://sspai.com', pubDate: Date.now() - 10800000, author: '少数派', categories: ['效率', '工具'] },
        { id: 'fb4', source: 'v2ex', sourceName: 'V2EX', sourceColor: '#1a1a1a', title: '讨论：远程工作两年的感受', desc: '分享远程工作的优缺点，包括自律、沟通、工作生活平衡等方面的经验。', link: 'https://v2ex.com', pubDate: Date.now() - 14400000, author: 'V友', categories: ['远程工作', '讨论'] },
        { id: 'fb5', source: 'juejin', sourceName: '掘金', sourceColor: '#1e80ff', title: '深入理解 JavaScript 引擎 V8 的优化策略', desc: '从 V8 的编译管线、Hidden Class、内联缓存等角度解析 JS 引擎的性能优化原理。', link: 'https://juejin.cn', pubDate: Date.now() - 18000000, author: '掘金作者', categories: ['JavaScript', '性能优化'] },
        { id: 'fb6', source: 'github', sourceName: 'GitHub', sourceColor: '#24292e', title: 'Bun 2.0: The fast JavaScript runtime, bundler, and package manager', desc: 'Bun 2.0 brings significant performance improvements, native S3 support, and a built-in database.', link: 'https://bun.sh', pubDate: Date.now() - 21600000, author: 'Bun Team', categories: ['JavaScript', 'Runtime'] },
        { id: 'fb7', source: 'hackernews', sourceName: 'Hacker News', sourceColor: '#ff6600', title: 'The rise of local-first software', desc: 'An in-depth look at the local-first software movement, CRDTs, and how modern apps are moving away from cloud-only architectures.', link: '#', pubDate: Date.now() - 25200000, author: 'HN User', categories: ['Architecture', 'Trends'] },
        { id: 'fb8', source: 'sspai', sourceName: '少数派', sourceColor: '#d43d31', title: '用 Shortcuts 构建你的个人自动化工作流', desc: 'Shortcuts（快捷指令）可以串联多个 App 完成复杂任务，本文介绍几个实用的自动化场景。', link: 'https://sspai.com', pubDate: Date.now() - 28800000, author: '少数派', categories: ['iOS', '自动化'] },
        { id: 'fb9', source: 'juejin', sourceName: '掘金', sourceColor: '#1e80ff', title: 'Rust 在前端的应用：从 Turbopack 到 MissionControl', desc: '越来越多的前端工具链开始使用 Rust 重写，本文分析 Rust 在前端领域的优势和实际案例。', link: 'https://juejin.cn', pubDate: Date.now() - 32400000, author: '掘金作者', categories: ['Rust', '前端'] },
        { id: 'fb10', source: 'v2ex', sourceName: 'V2EX', sourceColor: '#1a1a1a', title: '独立开发者如何选择技术栈？', desc: '从开发效率、运维成本、可扩展性等维度分析不同技术栈的优劣。', link: 'https://v2ex.com', pubDate: Date.now() - 36000000, author: 'V友', categories: ['独立开发', '技术选型'] },
    ];
}

function searchWeekly(q) {
    weeklySearchQuery = q.trim().toLowerCase();
    renderWeeklyCards();
}

function filterWeekly(source) {
    weeklyFilter = source;
    document.querySelectorAll('.weekly-tab').forEach(t => t.classList.toggle('active', t.dataset.source === source));
    renderWeeklyCards();
}

function getSourceIcon(source) {
    const icons = {
        github: '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        hackernews: '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 19.5h20L12 2z"/></svg>',
        v2ex: '<span style="font-size:16px;font-weight:700;color:#fff">V</span>',
        sspai: '<span style="font-size:11px;font-weight:700;color:#fff">SS</span>',
        juejin: '<span style="font-size:12px;font-weight:700;color:#fff">J</span>',
    };
    return icons[source] || icons.github;
}

function renderWeeklyCards() {
    const grid = document.getElementById('weeklyGrid');
    const empty = document.getElementById('weeklyEmpty');
    let items = weeklyFilter === 'all' ? weeklyData : weeklyData.filter(d => d.source === weeklyFilter);
    if (weeklySearchQuery) {
        items = items.filter(d =>
            d.title.toLowerCase().includes(weeklySearchQuery) ||
            d.desc.toLowerCase().includes(weeklySearchQuery) ||
            (d.categories || []).some(c => c.toLowerCase().includes(weeklySearchQuery))
        );
    }

    if (items.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        const emptyTitle = empty.querySelector('h3');
        const emptyDesc = empty.querySelector('p');
        if (weeklySearchQuery) {
            emptyTitle.textContent = '无搜索结果';
            emptyDesc.textContent = `未找到与「${esc(weeklySearchQuery)}」相关的资讯`;
        } else {
            emptyTitle.textContent = '暂无数据';
            emptyDesc.textContent = '点击刷新获取最新资讯';
        }
        return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = items.map(item => {
        const timeStr = timeAgo(item.pubDate);
        const cats = (item.categories || []).slice(0, 3).map(c => `<span class="tag">${esc(c)}</span>`).join('');
        return `
            <a class="weekly-card src-${item.source}" href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">
                <div class="weekly-card-source" style="background:${item.sourceColor}">
                    ${getSourceIcon(item.source)}
                </div>
                <div class="weekly-card-body">
                    <div class="weekly-card-title">${esc(item.title)}</div>
                    <div class="weekly-card-desc">${esc(item.desc)}</div>
                    <div class="weekly-card-meta">
                        <span class="weekly-card-meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${timeStr}
                        </span>
                        <span class="weekly-card-meta-item" style="color:${item.sourceColor}">${esc(item.sourceName)}</span>
                        <span class="weekly-card-meta-item">${esc(item.author)}</span>
                        ${cats}
                    </div>
                </div>
            </a>`;
    }).join('');

    observeNewElements();
}

// --- Keyboard ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); document.querySelector('.preview-modal')?.remove(); }
});

// Hash nav
window.addEventListener('hashchange', () => {
    const h = window.location.hash.slice(1);
    if (h.startsWith('thread-')) navigateTo('thread', h.replace('thread-', ''));
});
if (window.location.hash.startsWith('#thread-')) navigateTo('thread', window.location.hash.replace('#thread-', ''));
