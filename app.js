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
        { id: 't1', categoryId: 'general', userId: 'u1', title: '欢迎来到 Vectrol Forum！', content: '<p>大家好！欢迎来到 Vectrol Forum 技术社区。</p><p>这里是一个使用 <strong>macOS Liquid Glass</strong> 设计语言打造的现代化论坛，希望大家在这里交流技术、分享创意。</p><h2>社区规范</h2><ul><li>尊重每位社区成员</li><li>分享有价值的内容</li><li>互助友爱，共同进步</li></ul><p>祝大家在这里玩得开心！</p>', tags: ['公告', '欢迎'], pinned: true, locked: false, views: 512, createdAt: Date.now() - 86400000 * 28 },
        { id: 't2', categoryId: 'tech', userId: 'u2', title: 'Vue 3 组合式 API 最佳实践分享', content: '<p>最近在项目中全面使用了 Vue 3 的组合式 API，总结了一些最佳实践。</p><h2>为什么选择组合式 API？</h2><p>相比选项式 API，组合式 API 有以下优势：</p><ul><li>更好的逻辑复用</li><li>更灵活的代码组织</li><li>更好的 TypeScript 支持</li></ul><pre><code>import { ref, computed } from \'vue\'\n\nexport function useCounter(initial = 0) {\n  const count = ref(initial)\n  const doubled = computed(() => count.value * 2)\n  return { count, doubled }\n}</code></pre><p>欢迎大家讨论！</p>', tags: ['Vue', '前端', '教程'], pinned: false, locked: false, views: 289, createdAt: Date.now() - 86400000 * 14 },
        { id: 't3', categoryId: 'design', userId: 'u4', title: 'Liquid Glass 设计规范详解', content: '<p>macOS 的 Liquid Glass 设计语言非常优雅，我来详细解析一下它的核心要素。</p><h2>核心原则</h2><ul><li><strong>层次感</strong>：通过模糊和透明度创建深度</li><li><strong>光影</strong>：微妙的内阴影和边框高光</li><li><strong>动态</strong>：流畅的过渡动画</li></ul><p>关键 CSS 实现：</p><pre><code>.liquid-glass {\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(20px) saturate(180%);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 16px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n}</code></pre>', tags: ['设计', 'CSS', '教程'], pinned: false, locked: false, views: 198, createdAt: Date.now() - 86400000 * 10 },
        { id: 't4', categoryId: 'ai', userId: 'u3', title: 'GPT-5 发布后的 AI 趋势分析', content: '<p>随着最新大模型的发布，AI 领域又迎来了新的变化。来聊聊我的观察。</p><h2>主要趋势</h2><ul><li>多模态能力大幅提升</li><li>推理能力显著增强</li><li>开源模型追赶速度加快</li><li>Agent 应用开始落地</li></ul><p>你觉得 AI 会如何改变我们的开发方式？</p>', tags: ['AI', '讨论', '趋势'], pinned: false, locked: false, views: 342, createdAt: Date.now() - 86400000 * 5 },
        { id: 't5', categoryId: 'projects', userId: 'u2', title: '[分享] 我做的一个开源 Markdown 编辑器', content: '<p>最近做了一个轻量级的 Markdown 编辑器，分享给大家。</p><h2>功能特点</h2><ul><li>实时预览</li><li>代码高亮</li><li>导出 PDF</li><li>暗色模式</li></ul><p>GitHub 地址会在完善后放出，欢迎提建议！</p>', tags: ['开源', '项目', '分享'], pinned: false, locked: false, views: 156, createdAt: Date.now() - 86400000 * 3 },
        { id: 't6', categoryId: 'help', userId: 'u4', title: 'CSS backdrop-filter 在 Firefox 上不生效怎么办？', content: '<p>在 Chrome 上正常显示的毛玻璃效果，在 Firefox 上完全没有。</p><p>已经尝试过加 <code>-webkit-backdrop-filter</code> 前缀，但还是不行。</p><p>有遇到过类似问题的朋友吗？怎么解决的？</p>', tags: ['CSS', 'Firefox', '求助'], pinned: false, locked: false, views: 87, createdAt: Date.now() - 86400000 * 1 },
    ];

    const replies = [
        { id: 'r1', threadId: 't1', userId: 'u2', content: '社区很棒！期待和大家一起交流', createdAt: Date.now() - 86400000 * 27 },
        { id: 'r2', threadId: 't1', userId: 'u3', content: '界面设计太漂亮了，Liquid Glass 效果很赞', createdAt: Date.now() - 86400000 * 26 },
        { id: 'r3', threadId: 't2', userId: 'u3', content: '写得很好！组合式 API 确实比 options API 好用很多，特别是逻辑复用方面', createdAt: Date.now() - 86400000 * 13 },
        { id: 'r4', threadId: 't2', userId: 'u4', content: '有没有考虑写一个 composables 的合集？', createdAt: Date.now() - 86400000 * 12 },
        { id: 'r5', threadId: 't3', userId: 'u2', content: '这个总结很全面！收藏了', createdAt: Date.now() - 86400000 * 9 },
        { id: 'r6', threadId: 't4', userId: 'u2', content: 'Agent 确实是今年最值得关注的方向', createdAt: Date.now() - 86400000 * 4 },
        { id: 'r7', threadId: 't4', userId: 'u4', content: '作为设计师，我更关注 AI 在创意领域的应用', createdAt: Date.now() - 86400000 * 3 },
        { id: 'r8', threadId: 't6', userId: 'u2', content: 'Firefox 需要在 <code>about:config</code> 里开启 <code>layout.css.backdrop-filter.enabled</code> 才行', createdAt: Date.now() - 86400000 * 0.5 },
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
    const isHot = replies.length >= 5 || thread.views >= 200;

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
                    <span>${esc(user.name)}</span>
                    <span>${cat ? cat.name : ''}</span>
                    <span>${timeAgo(thread.createdAt)}</span>
                    ${thread.tags?.length ? '<span>' + thread.tags.map(t => '#' + esc(t)).join(' ') + '</span>' : ''}
                </div>
            </div>
            <div class="thread-stats">
                <div class="thread-stats-replies">${replies.length}</div>
                <div>回复</div>
                ${lastReplyUser ? `<div class="thread-lastreply">最后回复 by ${esc(lastReplyUser.name)}<br>${timeAgo(lastReply.createdAt)}</div>` : ''}
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
