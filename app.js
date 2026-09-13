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
    getBookmarks: () => JSON.parse(localStorage.getItem('vf_bookmarks') || '[]'),
    setBookmarks: (v) => localStorage.setItem('vf_bookmarks', JSON.stringify(v)),
    getNotifications: () => JSON.parse(localStorage.getItem('vf_notifications') || '[]'),
    setNotifications: (v) => localStorage.setItem('vf_notifications', JSON.stringify(v)),
    getReports: () => JSON.parse(localStorage.getItem('vf_reports') || '[]'),
    setReports: (v) => localStorage.setItem('vf_reports', JSON.stringify(v)),
    getOnlineUsers: () => JSON.parse(localStorage.getItem('vf_online') || '{}'),
    setOnlineUsers: (v) => localStorage.setItem('vf_online', JSON.stringify(v)),
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
let threadSortMode = 'latest';
let currentPageNum = 1;
const PAGE_SIZE = 10;
let replyingTo = null;
let activeMention = null;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSampleData();
    updateAuthUI();
    trackOnline();
    navigateTo('home');
});

function trackOnline() {
    if (!currentUser) return;
    const online = DB.getOnlineUsers();
    online[currentUser.id] = Date.now();
    DB.setOnlineUsers(online);
    setInterval(() => {
        if (!currentUser) return;
        const o = DB.getOnlineUsers();
        o[currentUser.id] = Date.now();
        const cutoff = Date.now() - 120000;
        Object.keys(o).forEach(k => { if (o[k] < cutoff) delete o[k]; });
        DB.setOnlineUsers(o);
    }, 30000);
}
function getOnlineCount() {
    const online = DB.getOnlineUsers();
    const cutoff = Date.now() - 120000;
    return Object.values(online).filter(t => t > cutoff).length;
}

// --- Sample Data ---
function initSampleData() {
    if (DB.getThreads().length > 0) return;
    DB.setUsers([]);
    DB.setThreads([]);
    DB.setReplies([]);
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
        case 'bookmarks': renderBookmarks(); break;
        case 'admin': renderAdmin(); break;
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
    updateAdminUI();
}

function toggleUserDropdown() { document.getElementById('userDropdown').classList.toggle('hidden'); }
document.addEventListener('click', (e) => {
    const um = document.getElementById('userMenu');
    const dd = document.getElementById('userDropdown');
    if (um && dd && !um.contains(e.target)) dd.classList.add('hidden');
});

// --- Home ---
function renderHome() {
    const threads = DB.getThreads();
    const replies = DB.getReplies();
    const users = DB.getUsers();
    const today = threads.filter(t => Date.now() - t.createdAt < 86400000).length;
    document.getElementById('statThreads').textContent = threads.length;
    document.getElementById('statReplies').textContent = replies.length;
    document.getElementById('statUsers').textContent = users.length;
    document.getElementById('statOnline').textContent = getOnlineCount();

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

    const latest = getSortedThreads(threads, 'latest').slice(0, 8);
    document.getElementById('latestThreads').innerHTML = latest.map(t => renderThreadRow(t)).join('');
    observeNewElements();
}

// --- Thread Row ---
function getSortedThreads(threads, mode) {
    const replies = DB.getReplies();
    const pinned = threads.filter(t => t.pinned);
    const unpinned = threads.filter(t => !t.pinned);
    switch (mode) {
        case 'replies': unpinned.sort((a, b) => { const ra = replies.filter(r => r.threadId === a.id).length; const rb = replies.filter(r => r.threadId === b.id).length; return rb - ra; }); break;
        case 'likes': unpinned.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)); break;
        case 'views': unpinned.sort((a, b) => (b.views || 0) - (a.views || 0)); break;
        default: unpinned.sort((a, b) => b.createdAt - a.createdAt);
    }
    return [...pinned, ...unpinned];
}
function paginate(items, page) {
    const start = (page - 1) * PAGE_SIZE;
    return { items: items.slice(start, start + PAGE_SIZE), total: items.length, pages: Math.ceil(items.length / PAGE_SIZE) };
}
function renderPagination(total, currentPageNum, onPageChange) {
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) return '';
    let html = '<div class="pagination">';
    html += `<button class="btn btn-ghost btn-sm" ${currentPageNum <= 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPageNum - 1})">上一页</button>`;
    for (let i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || (i >= currentPageNum - 2 && i <= currentPageNum + 2)) {
            html += `<button class="btn btn-sm ${i === currentPageNum ? 'btn-primary' : 'btn-ghost'}" onclick="${onPageChange}(${i})">${i}</button>`;
        } else if (i === currentPageNum - 3 || i === currentPageNum + 3) {
            html += '<span class="pagination-ellipsis">...</span>';
        }
    }
    html += `<button class="btn btn-ghost btn-sm" ${currentPageNum >= pages ? 'disabled' : ''} onclick="${onPageChange}(${currentPageNum + 1})">下一页</button>`;
    html += '</div>';
    return html;
}

function renderThreadRow(thread) {
    const user = DB.getUsers().find(u => u.id === thread.userId) || { name: '未知', avatarColor: '#666', score: 0 };
    const replies = DB.getReplies().filter(r => r.threadId === thread.id);
    const lastReply = replies.sort((a, b) => b.createdAt - a.createdAt)[0];
    const lastReplyUser = lastReply ? DB.getUsers().find(u => u.id === lastReply.userId) : null;
    const cat = CATEGORIES.find(c => c.id === thread.categoryId);
    const excerpt = stripHtml(thread.content).slice(0, 120);
    const isHot = replies.length >= 5 || thread.views >= 300;
    const isNew = Date.now() - thread.createdAt < 86400000;
    const level = getUserLevel(user.score || 0);
    const bookmarked = isBookmarked(thread.id);

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
                    <span class="user-level" style="color:${level.color}">${level.icon} ${level.name}</span>
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
    currentPageNum = 1;
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) { navigateTo('home'); return; }
    document.getElementById('categoryBreadcrumb').textContent = cat.name;
    document.getElementById('categoryTitle').textContent = cat.name;
    document.getElementById('categoryDesc').textContent = cat.desc;
    renderCategoryThreads(catId);
}
function renderCategoryThreads(catId) {
    const threads = DB.getThreads().filter(t => t.categoryId === catId);
    const sorted = getSortedThreads(threads, threadSortMode);
    const { items, total, pages } = paginate(sorted, currentPageNum);
    document.getElementById('categoryThreads').innerHTML = items.length ? items.map(t => renderThreadRow(t)).join('') :
        '<div class="glass-card" style="text-align:center;padding:48px"><h3 style="color:var(--fg-2)">暂无帖子</h3><p class="text-muted" style="margin-top:8px">成为第一个发帖的人吧！</p></div>';
    document.getElementById('categoryPagination').innerHTML = renderPagination(total, currentPageNum, 'goCategoryPage');
    document.getElementById('categorySort').innerHTML = `
        <button class="btn btn-sm ${threadSortMode === 'latest' ? 'btn-primary' : 'btn-ghost'}" onclick="setCategorySort('latest')">最新</button>
        <button class="btn btn-sm ${threadSortMode === 'replies' ? 'btn-primary' : 'btn-ghost'}" onclick="setCategorySort('replies')">最多回复</button>
        <button class="btn btn-sm ${threadSortMode === 'likes' ? 'btn-primary' : 'btn-ghost'}" onclick="setCategorySort('likes')">最多点赞</button>
        <button class="btn btn-sm ${threadSortMode === 'views' ? 'btn-primary' : 'btn-ghost'}" onclick="setCategorySort('views')">最多浏览</button>`;
}
function setCategorySort(mode) { threadSortMode = mode; currentPageNum = 1; renderCategoryThreads(currentCategoryId); }
function goCategoryPage(page) { currentPageNum = page; renderCategoryThreads(currentCategoryId); }

// --- Thread Detail ---
function renderThreadDetail(threadId) {
    currentThreadId = threadId;
    const thread = DB.getThreads().find(t => t.id === threadId);
    if (!thread) { navigateTo('home'); return; }

    thread.views = (thread.views || 0) + 1;
    DB.setThreads(DB.getThreads().map(t => t.id === threadId ? thread : t));

    const user = DB.getUsers().find(u => u.id === thread.userId) || { name: '未知', avatarColor: '#666', score: 0 };
    const cat = CATEGORIES.find(c => c.id === thread.categoryId);
    const replies = DB.getReplies().filter(r => r.threadId === threadId).sort((a, b) => a.createdAt - b.createdAt);
    const isOwner = currentUser && currentUser.id === thread.userId;
    const level = getUserLevel(user.score || 0);
    const bookmarked = isBookmarked(thread.id);
    const threadLikes = (thread.likes || []).length;

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
                    <span class="user-level" style="color:${level.color}">${level.icon} ${level.name}</span>
                    <span>${timeAgo(thread.createdAt)}</span>
                    <span>${thread.views} 浏览</span>
                    <span>${replies.length} 回复</span>
                </div>
                <div class="thread-detail-tags">${(thread.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
                <div class="thread-detail-actions">
                    <button class="btn btn-sm ${bookmarked ? 'btn-primary' : 'btn-ghost'}" onclick="toggleBookmark('${thread.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        ${bookmarked ? '已收藏' : '收藏'}
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="shareThread('${thread.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        分享
                    </button>
                    ${!isOwner && currentUser ? `<button class="btn btn-ghost btn-sm" onclick="reportThread('${thread.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                        举报
                    </button>` : ''}
                </div>
                ${isOwner ? `
                    <div style="margin-top:var(--space-sm);display:flex;gap:var(--space-sm)">
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
                        <svg viewBox="0 0 24 24" fill="${threadLikes > 0 ? 'var(--accent)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        ${threadLikes} 赞
                    </button>
                </div>
            </div>`;

    // Replies with nesting
    const topLevelReplies = replies.filter(r => !r.parentId);
    const childReplies = replies.filter(r => r.parentId);
    topLevelReplies.forEach((reply, i) => {
        html += renderReplyItem(reply, i + 2, thread, childReplies);
    });

    // Reply form
    if (!thread.locked) {
        html += `
            <div class="reply-editor-section">
                <h3 id="replyFormTitle">${replyingTo ? '回复 @' + (DB.getUsers().find(u => u.id === replyingTo.userId)?.name || '') : '发表回复'}</h3>
                ${replyingTo ? `<div class="replying-to"><span>回复 ${esc(DB.getUsers().find(u => u.id === replyingTo.userId)?.name || '')}</span><button class="btn btn-ghost btn-sm" onclick="cancelReply()">取消</button></div>` : ''}
                <div class="reply-form">
                    <div class="reply-input-wrapper">
                        <div class="avatar avatar-sm" id="replyAvatar" aria-hidden="true">${currentUser ? currentUser.name.charAt(0) : '?'}</div>
                        <textarea class="glass-textarea" placeholder="写下你的回复... 输入 @ 提及用户" id="replyInput" rows="3" aria-label="回复内容" oninput="handleMentionInput(event)"></textarea>
                        <div class="mention-dropdown hidden" id="mentionDropdown"></div>
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

function renderReplyItem(reply, floorNum, thread, allChildReplies) {
    const rUser = DB.getUsers().find(u => u.id === reply.userId) || { name: '未知', avatarColor: '#666', score: 0 };
    const isReplyOwner = currentUser && currentUser.id === reply.userId;
    const isOp = reply.userId === thread.userId;
    const level = getUserLevel(rUser.score || 0);
    const replyLikes = (reply.likes || []).length;
    const children = allChildReplies.filter(r => r.parentId === reply.id);

    let html = `
        <div class="post-item" id="reply-${reply.id}">
            <div class="post-header">
                <div class="thread-avatar" style="background:${rUser.avatarColor}">${rUser.name.charAt(0)}</div>
                <div class="post-author-info">
                    <div class="post-author-name"><a href="#" onclick="navigateTo('profile','${rUser.id}');return false">${esc(rUser.name)}</a></div>
                    <div class="post-date">${timeAgo(reply.createdAt)}</div>
                </div>
                ${isOp ? '<span class="post-author-badge">楼主</span>' : ''}
                <span class="post-floor">#${floorNum}</span>
            </div>
            <div class="post-body">${reply.content}</div>
            <div class="post-actions">
                <button class="post-action-btn" onclick="likeReply('${reply.id}','${thread.id}')">
                    <svg viewBox="0 0 24 24" fill="${replyLikes > 0 ? 'var(--accent)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    ${replyLikes} 赞
                </button>
                ${!thread.locked ? `<button class="post-action-btn" onclick="startReplyTo('${reply.id}','${reply.userId}','${thread.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    回复
                </button>` : ''}
                ${isReplyOwner ? `<button class="post-action-btn" onclick="deleteReply('${reply.id}','${thread.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    删除
                </button>` : ''}
                ${currentUser && !isReplyOwner ? `<button class="post-action-btn" onclick="reportReply('${reply.id}','${thread.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                    举报
                </button>` : ''}
            </div>
        </div>`;

    // Nested children
    if (children.length > 0) {
        html += '<div class="reply-children">';
        children.forEach(child => { html += renderReplyItem(child, '↩', thread, allChildReplies); });
        html += '</div>';
    }

    return html;
}

function startReplyTo(replyId, userId, threadId) {
    replyingTo = { replyId, userId, threadId };
    const titleEl = document.getElementById('replyFormTitle');
    const user = DB.getUsers().find(u => u.id === userId);
    if (titleEl) titleEl.textContent = '回复 @' + (user?.name || '');
    const input = document.getElementById('replyInput');
    if (input) { input.focus(); input.placeholder = `回复 @${user?.name || ''}...`; }
}
function cancelReply() {
    replyingTo = null;
    const titleEl = document.getElementById('replyFormTitle');
    if (titleEl) titleEl.textContent = '发表回复';
    const input = document.getElementById('replyInput');
    if (input) input.placeholder = '写下你的回复... 输入 @ 提及用户';
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
    if (i === -1) {
        t.likes.push(currentUser.id);
        if (t.userId !== currentUser.id) {
            addNotification(t.userId, 'like', currentUser.id, id, `赞了你的帖子「${t.title}」`);
        }
    } else { t.likes.splice(i, 1); }
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
    const reply = {
        id: 'r' + Date.now(), threadId, userId: currentUser.id,
        content: parseContent(content), likes: [], createdAt: Date.now(),
        parentId: replyingTo ? replyingTo.replyId : null,
    };
    replies.push(reply);
    DB.setReplies(replies);

    // Score
    const users = DB.getUsers();
    const u = users.find(x => x.id === currentUser.id);
    if (u) { u.score = (u.score || 0) + 2; DB.setUsers(users); currentUser.score = u.score; DB.setCurrentUser(currentUser); updateAuthUI(); }

    // Notifications
    const thread = DB.getThreads().find(t => t.id === threadId);
    if (thread && thread.userId !== currentUser.id) {
        addNotification(thread.userId, 'reply', currentUser.id, threadId, `回复了你的帖子「${thread.title}」`);
    }
    if (replyingTo && replyingTo.userId !== currentUser.id) {
        const replyUser = DB.getUsers().find(u => u.id === replyingTo.userId);
        addNotification(replyingTo.userId, 'mention', currentUser.id, threadId, `在回复中提到了你`);
    }
    // @mentions
    const mentionMatches = content.match(/@(\S+)/g);
    if (mentionMatches) {
        mentionMatches.forEach(m => {
            const name = m.slice(1);
            const mentioned = DB.getUsers().find(u => u.name.toLowerCase() === name.toLowerCase());
            if (mentioned && mentioned.id !== currentUser.id && mentioned.id !== thread?.userId && mentioned.id !== replyingTo?.userId) {
                addNotification(mentioned.id, 'mention', currentUser.id, threadId, `在回复中 @了你`);
            }
        });
    }

    replyingTo = null;
    renderThreadDetail(threadId);
    showToast('回复成功', 'success');
}

function handleMentionInput(e) {
    const val = e.target.value;
    const cursorPos = e.target.selectionStart;
    const textBefore = val.slice(0, cursorPos);
    const mentionMatch = textBefore.match(/@(\S*)$/);
    const dropdown = document.getElementById('mentionDropdown');
    if (!dropdown) return;
    if (mentionMatch && mentionMatch[1].length > 0) {
        const query = mentionMatch[1].toLowerCase();
        const users = DB.getUsers().filter(u => u.name.toLowerCase().includes(query) && u.id !== currentUser?.id).slice(0, 5);
        if (users.length > 0) {
            dropdown.innerHTML = users.map(u => `<div class="mention-option" onclick="insertMention('${esc(u.name)}')"><div class="mention-avatar" style="background:${u.avatarColor}">${u.name.charAt(0)}</div><span>${esc(u.name)}</span></div>`).join('');
            dropdown.classList.remove('hidden');
            return;
        }
    }
    dropdown.classList.add('hidden');
}
function insertMention(name) {
    const input = document.getElementById('replyInput');
    if (!input) return;
    const cursorPos = input.selectionStart;
    const val = input.value;
    const textBefore = val.slice(0, cursorPos);
    const textAfter = val.slice(cursorPos);
    const newTextBefore = textBefore.replace(/@\S*$/, '@' + name + ' ');
    input.value = newTextBefore + textAfter;
    input.selectionStart = input.selectionEnd = newTextBefore.length;
    input.focus();
    document.getElementById('mentionDropdown')?.classList.add('hidden');
}
function likeReply(replyId, threadId) {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const replies = DB.getReplies();
    const r = replies.find(x => x.id === replyId);
    if (!r) return;
    if (!r.likes) r.likes = [];
    const i = r.likes.indexOf(currentUser.id);
    if (i === -1) {
        r.likes.push(currentUser.id);
        if (r.userId !== currentUser.id) {
            addNotification(r.userId, 'like', currentUser.id, threadId, '赞了你的回复');
        }
    } else { r.likes.splice(i, 1); }
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
    const level = getUserLevel(user.score || 0);

    document.getElementById('profileContent').innerHTML = `
        <div class="glass-card profile-header-card">
            <div class="profile-avatar-lg" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
            <h2 class="profile-name">${esc(user.name)}</h2>
            <div class="user-level-badge" style="background:${level.color}20;color:${level.color};border:1px solid ${level.color}40">${level.icon} ${level.name}</div>
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
    ['vf_users','vf_threads','vf_replies','vf_currentUser','vf_bookmarks','vf_notifications','vf_reports'].forEach(k => localStorage.removeItem(k));
    currentUser = null; updateAuthUI(); navigateTo('home');
    showToast('所有数据已清除', 'success');
}

// --- Admin ---
const ADMIN_EMAILS = ['admin@vectrol.com'];
function isAdmin() { return currentUser && ADMIN_EMAILS.includes(currentUser.email); }

function updateAdminUI() {
    const show = isAdmin();
    document.querySelectorAll('.admin-nav').forEach(el => el.style.display = show ? '' : 'none');
    document.querySelectorAll('.admin-dropdown').forEach(el => el.style.display = show ? '' : 'none');
}

function renderAdmin() {
    if (!isAdmin()) { showToast('无管理员权限', 'error'); navigateTo('home'); return; }
    const users = DB.getUsers();
    const threads = DB.getThreads();
    const replies = DB.getReplies();
    const reports = DB.getReports().filter(r => r.status === 'pending');
    const today = threads.filter(t => Date.now() - t.createdAt < 86400000).length;
    const online = getOnlineCount();

    document.getElementById('adminStats').innerHTML = `
        <div class="admin-stat glass-card"><div class="admin-stat-icon" style="background:rgba(10,132,255,.15);color:var(--accent)"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="admin-stat-info"><div class="admin-stat-value">${users.length}</div><div class="admin-stat-label">用户总数</div></div></div>
        <div class="admin-stat glass-card"><div class="admin-stat-icon" style="background:rgba(16,185,129,.15);color:#10b981"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div class="admin-stat-info"><div class="admin-stat-value">${threads.length}</div><div class="admin-stat-label">帖子总数</div></div></div>
        <div class="admin-stat glass-card"><div class="admin-stat-icon" style="background:rgba(236,72,153,.15);color:#ec4899"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div><div class="admin-stat-info"><div class="admin-stat-value">${replies.length}</div><div class="admin-stat-label">回复总数</div></div></div>
        <div class="admin-stat glass-card"><div class="admin-stat-icon" style="background:rgba(245,158,11,.15);color:#f59e0b"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="admin-stat-info"><div class="admin-stat-value">${today}</div><div class="admin-stat-label">今日新帖</div></div></div>
        <div class="admin-stat glass-card"><div class="admin-stat-icon" style="background:rgba(139,92,246,.15);color:#8b5cf6"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div><div class="admin-stat-info"><div class="admin-stat-value">${online}</div><div class="admin-stat-label">在线用户</div></div></div>
        <div class="admin-stat glass-card"><div class="admin-stat-icon" style="background:rgba(239,68,68,.15);color:#ef4444"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></div><div class="admin-stat-info"><div class="admin-stat-value">${reports.length}</div><div class="admin-stat-label">待处理举报</div></div></div>`;

    switchAdminTab('overview');
}

let adminTab = 'overview';
function switchAdminTab(tab) {
    adminTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.textContent.includes({overview:'概览',users:'用户',threads:'帖子',reports:'举报'}[tab])));
    const panel = document.getElementById('adminPanel');

    switch (tab) {
        case 'overview': renderAdminOverview(panel); break;
        case 'users': renderAdminUsers(panel); break;
        case 'threads': renderAdminThreads(panel); break;
        case 'reports': renderAdminReports(panel); break;
    }
}

function renderAdminOverview(el) {
    const users = DB.getUsers().sort((a, b) => (b.score || 0) - (a.score || 0));
    const threads = DB.getThreads();
    const catStats = CATEGORIES.map(c => ({ ...c, count: threads.filter(t => t.categoryId === c.id).length })).sort((a, b) => b.count - a.count);

    el.innerHTML = `
        <div class="admin-grid">
            <div class="glass-card">
                <h3 class="admin-card-title">用户排行 (按积分)</h3>
                <div class="admin-list">${users.slice(0, 10).map((u, i) => {
                    const level = getUserLevel(u.score || 0);
                    return `<div class="admin-list-item">
                        <span class="admin-rank">${i + 1}</span>
                        <div class="thread-avatar" style="background:${u.avatarColor}">${u.name.charAt(0)}</div>
                        <div class="admin-list-info"><div class="admin-list-name">${esc(u.name)}</div><div class="admin-list-sub">${level.icon} ${level.name}</div></div>
                        <div class="admin-list-value">${u.score || 0} 分</div>
                    </div>`;
                }).join('')}</div>
            </div>
            <div class="glass-card">
                <h3 class="admin-card-title">版块统计</h3>
                <div class="admin-list">${catStats.map(c => `<div class="admin-list-item">
                    <div class="category-icon-sm" style="background:${c.color}">${CATEGORY_ICONS[c.icon]}</div>
                    <div class="admin-list-info"><div class="admin-list-name">${c.name}</div><div class="admin-list-sub">${c.desc}</div></div>
                    <div class="admin-list-value">${c.count} 帖</div>
                </div>`).join('')}</div>
            </div>
        </div>`;
}

function renderAdminUsers(el) {
    const users = DB.getUsers().sort((a, b) => (b.score || 0) - (a.score || 0));
    el.innerHTML = `
        <div class="glass-card">
            <div class="admin-card-header"><h3 class="admin-card-title">用户管理</h3><span class="text-muted">${users.length} 个用户</span></div>
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>用户</th><th>邮箱</th><th>积分</th><th>等级</th><th>注册时间</th><th>操作</th></tr></thead>
                    <tbody>${users.map(u => {
                        const level = getUserLevel(u.score || 0);
                        const isSelf = currentUser && u.id === currentUser.id;
                        return `<tr>
                            <td><div style="display:flex;align-items:center;gap:8px"><div class="thread-avatar" style="background:${u.avatarColor};width:28px;height:28px;font-size:.7rem">${u.name.charAt(0)}</div>${esc(u.name)}</div></td>
                            <td class="text-muted">${esc(u.email)}</td>
                            <td><strong>${u.score || 0}</strong></td>
                            <td><span style="color:${level.color}">${level.icon} ${level.name}</span></td>
                            <td class="text-muted">${new Date(u.createdAt).toLocaleDateString('zh-CN')}</td>
                            <td>
                                <button class="btn btn-ghost btn-xs" onclick="navigateTo('profile','${u.id}')" title="查看">查看</button>
                                ${!isSelf && isAdmin() ? `<button class="btn btn-danger btn-xs" onclick="adminDeleteUser('${u.id}')" title="删除">删除</button>` : ''}
                            </td>
                        </tr>`;
                    }).join('')}</tbody>
                </table>
            </div>
        </div>`;
}

function renderAdminThreads(el) {
    const threads = DB.getThreads().sort((a, b) => b.createdAt - a.createdAt);
    el.innerHTML = `
        <div class="glass-card">
            <div class="admin-card-header"><h3 class="admin-card-title">帖子管理</h3><span class="text-muted">${threads.length} 个帖子</span></div>
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>标题</th><th>作者</th><th>版块</th><th>回复</th><th>浏览</th><th>状态</th><th>操作</th></tr></thead>
                    <tbody>${threads.map(t => {
                        const user = DB.getUsers().find(u => u.id === t.userId);
                        const cat = CATEGORIES.find(c => c.id === t.categoryId);
                        const replyCount = DB.getReplies().filter(r => r.threadId === t.id).length;
                        const isOwner = currentUser && t.userId === currentUser.id;
                        return `<tr>
                            <td><a href="#" onclick="navigateTo('thread','${t.id}');return false" class="admin-link">${esc(t.title).slice(0, 40)}${t.title.length > 40 ? '...' : ''}</a></td>
                            <td>${esc(user?.name || '未知')}</td>
                            <td><span style="color:${cat?.color || '#999'}">${cat?.name || '无'}</span></td>
                            <td>${replyCount}</td>
                            <td>${t.views || 0}</td>
                            <td>${t.pinned ? '<span class="thread-badge badge-pin" style="font-size:.65rem">置顶</span> ' : ''}${t.locked ? '<span class="thread-badge badge-lock" style="font-size:.65rem">锁定</span>' : ''}</td>
                            <td>
                                ${isOwner || isAdmin() ? `<button class="btn btn-ghost btn-xs" onclick="togglePin('${t.id}');switchAdminTab('threads')">${t.pinned ? '取消置顶' : '置顶'}</button>` : ''}
                                ${isOwner || isAdmin() ? `<button class="btn btn-ghost btn-xs" onclick="toggleLock('${t.id}');switchAdminTab('threads')">${t.locked ? '解锁' : '锁定'}</button>` : ''}
                                ${isOwner || isAdmin() ? `<button class="btn btn-danger btn-xs" onclick="if(confirm('确定删除？')){deleteThread('${t.id}');switchAdminTab('threads')}">删除</button>` : ''}
                            </td>
                        </tr>`;
                    }).join('')}</tbody>
                </table>
            </div>
        </div>`;
}

function renderAdminReports(el) {
    const reports = DB.getReports().sort((a, b) => b.createdAt - a.createdAt);
    el.innerHTML = `
        <div class="glass-card">
            <div class="admin-card-header"><h3 class="admin-card-title">举报处理</h3><span class="text-muted">${reports.filter(r => r.status === 'pending').length} 待处理</span></div>
            ${reports.length === 0 ? '<div style="text-align:center;padding:48px"><p class="text-muted">暂无举报</p></div>' :
            `<div class="admin-table-wrap"><table class="admin-table">
                <thead><tr><th>类型</th><th>目标</th><th>举报人</th><th>原因</th><th>时间</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>${reports.map(r => {
                    const reporter = DB.getUsers().find(u => u.id === r.userId);
                    let target = '';
                    if (r.type === 'thread') { const t = DB.getThreads().find(x => x.id === r.targetId); target = t ? t.title.slice(0, 30) : '已删除'; }
                    else { const rep = DB.getReplies().find(x => x.id === r.targetId); target = rep ? stripHtml(rep.content).slice(0, 30) : '已删除'; }
                    return `<tr>
                        <td>${r.type === 'thread' ? '帖子' : '回复'}</td>
                        <td class="text-muted">${esc(target)}</td>
                        <td>${esc(reporter?.name || '未知')}</td>
                        <td>${esc(r.reason).slice(0, 40)}</td>
                        <td class="text-muted">${timeAgo(r.createdAt)}</td>
                        <td>${r.status === 'pending' ? '<span style="color:#f59e0b">待处理</span>' : r.status === 'resolved' ? '<span style="color:#10b981">已处理</span>' : '<span style="color:#6b7280">已忽略</span>'}</td>
                        <td>${r.status === 'pending' ? `
                            <button class="btn btn-ghost btn-xs" onclick="handleReport('${r.id}','resolve')">处理</button>
                            <button class="btn btn-ghost btn-xs" onclick="handleReport('${r.id}','ignore')">忽略</button>
                            ${r.type === 'thread' ? `<button class="btn btn-danger btn-xs" onclick="if(confirm('确定删除该帖子？')){deleteThread('${r.targetId}');handleReport('${r.id}','resolve')}">删除帖子</button>` : ''}
                        ` : ''}</td>
                    </tr>`;
                }).join('')}</tbody></table></div>`}
        </div>`;
}

function handleReport(reportId, action) {
    const reports = DB.getReports();
    const r = reports.find(x => x.id === reportId);
    if (r) { r.status = action === 'resolve' ? 'resolved' : 'ignored'; DB.setReports(reports); }
    switchAdminTab('reports');
    renderAdmin();
}
function adminDeleteUser(userId) {
    if (!confirm('确定删除该用户？其帖子和回复也会被删除。')) return;
    DB.setUsers(DB.getUsers().filter(u => u.id !== userId));
    DB.setThreads(DB.getThreads().filter(t => t.userId !== userId));
    DB.setReplies(DB.getReplies().filter(r => r.userId !== userId));
    showToast('用户已删除', 'success');
    switchAdminTab('users');
    renderAdmin();
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

// --- Notifications ---
function addNotification(userId, type, fromUserId, threadId, message) {
    const notifs = DB.getNotifications();
    notifs.unshift({ id: 'n' + Date.now(), userId, type, fromUserId, threadId, message, read: false, createdAt: Date.now() });
    DB.setNotifications(notifs.slice(0, 100));
}
function getUnreadCount() {
    if (!currentUser) return 0;
    return DB.getNotifications().filter(n => n.userId === currentUser.id && !n.read).length;
}
function markAllRead() {
    if (!currentUser) return;
    const notifs = DB.getNotifications();
    notifs.forEach(n => { if (n.userId === currentUser.id) n.read = true; });
    DB.setNotifications(notifs);
    renderNotifications();
}
function renderNotifications() {
    const el = document.getElementById('notifList');
    const badge = document.getElementById('notifBadge');
    if (!el || !currentUser) return;
    const notifs = DB.getNotifications().filter(n => n.userId === currentUser.id).slice(0, 30);
    const unread = notifs.filter(n => !n.read).length;
    if (badge) { badge.textContent = unread || ''; badge.style.display = unread ? 'flex' : 'none'; }
    if (notifs.length === 0) { el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--fg-3)">暂无通知</div>'; return; }
    el.innerHTML = notifs.map(n => {
        const from = DB.getUsers().find(u => u.id === n.fromUserId);
        const thread = DB.getThreads().find(t => t.id === n.threadId);
        return `<div class="notif-item ${n.read ? '' : 'unread'}" onclick="handleNotifClick('${n.id}','${n.threadId}')">
            <div class="notif-avatar" style="background:${from?.avatarColor || '#666'}">${from ? from.name.charAt(0) : '?'}</div>
            <div class="notif-body">
                <div class="notif-text"><strong>${esc(from?.name || '未知')}</strong> ${esc(n.message)}</div>
                <div class="notif-time">${timeAgo(n.createdAt)}</div>
            </div>
        </div>`;
    }).join('');
}
function handleNotifClick(notifId, threadId) {
    const notifs = DB.getNotifications();
    const n = notifs.find(x => x.id === notifId);
    if (n) { n.read = true; DB.setNotifications(notifs); }
    toggleNotifPanel();
    if (threadId) navigateTo('thread', threadId);
}
function toggleNotifPanel() {
    const panel = document.getElementById('notifPanel');
    const wasHidden = panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    if (wasHidden) renderNotifications();
}

// --- Bookmarks ---
function toggleBookmark(threadId) {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const bm = DB.getBookmarks();
    const idx = bm.findIndex(b => b.userId === currentUser.id && b.threadId === threadId);
    if (idx === -1) { bm.push({ userId: currentUser.id, threadId, createdAt: Date.now() }); showToast('已收藏', 'success'); }
    else { bm.splice(idx, 1); showToast('已取消收藏', 'info'); }
    DB.setBookmarks(bm);
    if (currentPage === 'thread') renderThreadDetail(threadId);
    if (currentPage === 'bookmarks') renderBookmarks();
}
function isBookmarked(threadId) {
    if (!currentUser) return false;
    return DB.getBookmarks().some(b => b.userId === currentUser.id && b.threadId === threadId);
}
function renderBookmarks() {
    if (!currentUser) { navigateTo('home'); return; }
    const bm = DB.getBookmarks().filter(b => b.userId === currentUser.id);
    const threads = bm.map(b => DB.getThreads().find(t => t.id === b.threadId)).filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
    document.getElementById('bookmarksList').innerHTML = threads.length ? threads.map(t => renderThreadRow(t)).join('') :
        '<div class="glass-card" style="text-align:center;padding:48px"><h3 style="color:var(--fg-2)">暂无收藏</h3><p class="text-muted" style="margin-top:8px">浏览帖子时点击收藏按钮即可添加</p></div>';
}

// --- Reports ---
function reportThread(threadId) {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const reason = prompt('请输入举报原因：');
    if (!reason) return;
    const reports = DB.getReports();
    reports.push({ id: 'rp' + Date.now(), type: 'thread', targetId: threadId, userId: currentUser.id, reason, status: 'pending', createdAt: Date.now() });
    DB.setReports(reports);
    showToast('举报已提交，感谢反馈', 'success');
}
function reportReply(replyId, threadId) {
    if (!currentUser) { showToast('请先登录', 'error'); showModal('login'); return; }
    const reason = prompt('请输入举报原因：');
    if (!reason) return;
    const reports = DB.getReports();
    reports.push({ id: 'rp' + Date.now(), type: 'reply', targetId: replyId, threadId, userId: currentUser.id, reason, status: 'pending', createdAt: Date.now() });
    DB.setReports(reports);
    showToast('举报已提交，感谢反馈', 'success');
}

// --- User Level ---
function getUserLevel(score) {
    if (score >= 1000) return { name: '社区元老', icon: '👑', color: '#f59e0b' };
    if (score >= 500) return { name: '资深用户', icon: '⭐', color: '#8b5cf6' };
    if (score >= 200) return { name: '活跃用户', icon: '🔥', color: '#ef4444' };
    if (score >= 50) return { name: '正式用户', icon: '✅', color: '#10b981' };
    if (score >= 10) return { name: '新锐用户', icon: '🌱', color: '#3b82f6' };
    return { name: '新手', icon: '👋', color: '#6b7280' };
}

// --- Parse mentions ---
function parseContent(text) {
    return esc(text).replace(/@(\S+)/g, '<span class="mention">@$1</span>');
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
