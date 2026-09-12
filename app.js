/* ============================================
   Vectrol Blog - Application Logic
   ============================================ */

// --- Data Store ---
const DB = {
    getUsers: () => JSON.parse(localStorage.getItem('vectrol_users') || '[]'),
    setUsers: (users) => localStorage.setItem('vectrol_users', JSON.stringify(users)),
    getPosts: () => JSON.parse(localStorage.getItem('vectrol_posts') || '[]'),
    setPosts: (posts) => localStorage.setItem('vectrol_posts', JSON.stringify(posts)),
    getComments: () => JSON.parse(localStorage.getItem('vectrol_comments') || '[]'),
    setComments: (comments) => localStorage.setItem('vectrol_comments', JSON.stringify(comments)),
    getCurrentUser: () => JSON.parse(localStorage.getItem('vectrol_currentUser') || 'null'),
    setCurrentUser: (user) => localStorage.setItem('vectrol_currentUser', JSON.stringify(user)),
};

// --- State ---
let currentUser = DB.getCurrentUser();
let currentPage = 'home';
let editingPostId = null;
let selectedTags = [];
let activeFilter = null;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateAuthUI();
    renderHome();
    initSampleData();
    initScrollReveal();
});

// --- Sample Data ---
function initSampleData() {
    if (DB.getPosts().length > 0) return;
    
    const sampleUsers = [
        { id: 'u1', name: 'Vectrol', email: 'admin@vectrol.com', password: '123456', bio: '探索技术与创意的边界', avatarColor: '#6366f1', createdAt: Date.now() - 86400000 * 7 },
        { id: 'u2', name: '张三', email: 'zhang@example.com', password: '123456', bio: '前端开发者，热爱开源', avatarColor: '#ec4899', createdAt: Date.now() - 86400000 * 5 },
        { id: 'u3', name: '李四', email: 'li@example.com', password: '123456', bio: '全栈工程师', avatarColor: '#10b981', createdAt: Date.now() - 86400000 * 3 },
    ];
    
    const samplePosts = [
        {
            id: 'p1',
            userId: 'u1',
            title: '欢迎来到 Vectrol Blog',
            content: '<h2>你好，世界！</h2><p>这是 Vectrol Blog 的第一篇文章。我们打造了一个使用 macOS Liquid Glass 设计语言的现代化博客平台。</p><p>在这里，你可以：</p><ul><li>分享你的技术文章</li><li>与读者互动交流</li><li>发现更多精彩内容</li></ul><blockquote>设计不仅仅是看起来怎样，更是用起来怎样。—— Steve Jobs</blockquote><p>希望你会喜欢这个平台！</p>',
            tags: ['公告', '入门'],
            likes: ['u2', 'u3'],
            views: 128,
            createdAt: Date.now() - 86400000 * 6,
        },
        {
            id: 'p2',
            userId: 'u2',
            title: 'Vue 3 组合式 API 最佳实践',
            content: '<h2>为什么要用组合式 API？</h2><p>Vue 3 的组合式 API（Composition API）提供了更灵活的代码组织方式。相比选项式 API，它有更好的逻辑复用性和类型推导。</p><h3>核心概念</h3><p>组合式 API 的核心是 <code>setup()</code> 函数，它在组件创建之前执行：</p><pre><code>import { ref, computed, onMounted } from \'vue\'\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubled = computed(() => count.value * 2)\n    \n    onMounted(() => {\n      console.log(\'组件已挂载\')\n    })\n    \n    return { count, doubled }\n  }\n}</code></pre><h3>逻辑复用</h3><p>通过自定义 Hooks（组合式函数），可以轻松复用有状态逻辑：</p><pre><code>function useCounter(initial = 0) {\n  const count = ref(initial)\n  const increment = () => count.value++\n  const decrement = () => count.value--\n  return { count, increment, decrement }\n}</code></pre><p>这就是组合式 API 的魅力所在！</p>',
            tags: ['Vue', '前端', '教程'],
            likes: ['u1'],
            views: 89,
            createdAt: Date.now() - 86400000 * 4,
        },
        {
            id: 'p3',
            userId: 'u3',
            title: 'CSS Glassmorphism 完全指南',
            content: '<h2>什么是 Glassmorphism？</h2><p>Glassmorphism 是一种 UI 设计趋势，通过半透明背景、模糊效果和微妙的边框来创建类似磨砂玻璃的视觉效果。</p><h3>核心 CSS 属性</h3><pre><code>.glass {\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 16px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n}</code></pre><h3>注意事项</h3><ul><li>确保背景有足够的颜色对比度</li><li>在 Firefox 中可能需要额外的兼容处理</li><li>不要过度使用，以免影响可读性</li></ul><p>Glassmorphism 结合暗色主题效果更佳！</p>',
            tags: ['CSS', '设计', '教程'],
            likes: ['u1', 'u2'],
            views: 256,
            createdAt: Date.now() - 86400000 * 2,
        },
    ];
    
    const sampleComments = [
        { id: 'c1', postId: 'p1', userId: 'u2', content: '太棒了！期待更多精彩内容！', createdAt: Date.now() - 86400000 * 5 },
        { id: 'c2', postId: 'p1', userId: 'u3', content: '设计很精美，Liquid Glass 效果太酷了', createdAt: Date.now() - 86400000 * 4 },
        { id: 'c3', postId: 'p2', userId: 'u1', content: '写得很详细，组合式 API 确实比选项式好用很多', createdAt: Date.now() - 86400000 * 3 },
        { id: 'c4', postId: 'p3', userId: 'u2', content: '正好在学 glassmorphism，收藏了！', createdAt: Date.now() - 86400000 * 1 },
    ];
    
    DB.setUsers(sampleUsers);
    DB.setPosts(samplePosts);
    DB.setComments(sampleComments);
}

// --- Theme ---
function initTheme() {
    const saved = localStorage.getItem('vectrol_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vectrol_theme', next);
}

// --- Scroll Reveal ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

function observeNewElements() {
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        
        document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => observer.observe(el));
    }, 50);
}

// --- Navigation ---
function navigateTo(page, data) {
    currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) {
        pageEl.classList.add('active');
        pageEl.style.animation = 'none';
        pageEl.offsetHeight;
        pageEl.style.animation = '';
    }
    
    const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (navLink) navLink.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu
    document.getElementById('navLinks').classList.remove('open');
    
    // Close dropdown
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.add('hidden');
    
    // Render page content
    switch (page) {
        case 'home': renderHome(); break;
        case 'explore': renderExplore(); break;
        case 'write': renderWrite(data); break;
        case 'post': renderPostDetail(data); break;
        case 'profile': renderProfile(data); break;
        case 'my-posts': renderMyPosts(); break;
        case 'settings': renderSettings(); break;
        case 'about': break;
    }
}

function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}

// --- Auth ---
function showModal(type) {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('loginModal').classList.toggle('hidden', type !== 'login');
    document.getElementById('registerModal').classList.toggle('hidden', type !== 'register');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    
    if (password !== confirm) {
        showToast('两次输入的密码不一致', 'error');
        return;
    }
    
    const users = DB.getUsers();
    if (users.find(u => u.email === email)) {
        showToast('该邮箱已被注册', 'error');
        return;
    }
    
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];
    const newUser = {
        id: 'u' + Date.now(),
        name,
        email,
        password,
        bio: '',
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        createdAt: Date.now(),
    };
    
    users.push(newUser);
    DB.setUsers(users);
    
    currentUser = { ...newUser };
    delete currentUser.password;
    DB.setCurrentUser(currentUser);
    updateAuthUI();
    closeModal();
    showToast('注册成功！欢迎加入 Vectrol Blog', 'success');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const users = DB.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showToast('邮箱或密码错误', 'error');
        return;
    }
    
    currentUser = { ...user };
    delete currentUser.password;
    DB.setCurrentUser(currentUser);
    updateAuthUI();
    closeModal();
    showToast(`欢迎回来，${user.name}！`, 'success');
}

function logout() {
    currentUser = null;
    DB.setCurrentUser(null);
    updateAuthUI();
    navigateTo('home');
    showToast('已退出登录', 'info');
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        
        const initial = currentUser.name.charAt(0).toUpperCase();
        const color = currentUser.avatarColor || '#6366f1';
        
        document.getElementById('userAvatar').textContent = initial;
        document.getElementById('userAvatar').style.background = color;
        document.getElementById('dropdownAvatar').textContent = initial;
        document.getElementById('dropdownAvatar').style.background = color;
        document.getElementById('dropdownName').textContent = currentUser.name;
        document.getElementById('dropdownEmail').textContent = currentUser.email;
        
        const commentAvatar = document.getElementById('commentAvatar');
        if (commentAvatar) {
            commentAvatar.textContent = initial;
            commentAvatar.style.background = color;
        }
    } else {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('hidden');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('userDropdown');
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// --- Home ---
function renderHome() {
    const posts = DB.getPosts().sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
    const container = document.getElementById('latestPosts');
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>暂无文章</h3><p>成为第一个发布文章的人吧！</p></div>';
        return;
    }
    
    container.innerHTML = posts.map(post => renderPostCard(post)).join('');
    
    // Render tags cloud
    const allTags = {};
    DB.getPosts().forEach(p => p.tags?.forEach(t => { allTags[t] = (allTags[t] || 0) + 1; }));
    const tagsCloud = document.getElementById('tagsCloud');
    tagsCloud.innerHTML = Object.entries(allTags)
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => `<span class="tag" onclick="filterByTag('${escapeHtml(tag)}')">${escapeHtml(tag)}</span>`)
        .join('');
    
    observeNewElements();
}

function renderPostCard(post) {
    const user = DB.getUsers().find(u => u.id === post.userId) || { name: '未知', avatarColor: '#666' };
    const comments = DB.getComments().filter(c => c.postId === post.id);
    const timeAgo = getTimeAgo(post.createdAt);
    const excerpt = stripHtml(post.content).slice(0, 150);
    
    return `
        <div class="post-card" onclick="navigateTo('post', '${post.id}')">
            <div class="post-card-header">
                <div class="post-card-avatar" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
                <div class="post-card-meta">
                    <div class="post-card-author">${escapeHtml(user.name)}</div>
                    <div class="post-card-date">${timeAgo}</div>
                </div>
            </div>
            <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
            <p class="post-card-excerpt">${escapeHtml(excerpt)}</p>
            <div class="post-card-tags">
                ${(post.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
            </div>
            <div class="post-card-footer">
                <span class="post-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    ${(post.likes || []).length}
                </span>
                <span class="post-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    ${comments.length}
                </span>
                <span class="post-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ${post.views || 0}
                </span>
            </div>
        </div>
    `;
}

// --- Explore ---
function renderExplore() {
    const posts = DB.getPosts().sort((a, b) => b.createdAt - a.createdAt);
    renderExplorePosts(posts);
    renderFilterTags();
}

function renderExplorePosts(posts) {
    const container = document.getElementById('explorePosts');
    const emptyState = document.getElementById('emptyState');
    
    if (posts.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    container.innerHTML = posts.map(post => renderPostCard(post)).join('');
    observeNewElements();
}

function renderFilterTags() {
    const allTags = {};
    DB.getPosts().forEach(p => p.tags?.forEach(t => { allTags[t] = (allTags[t] || 0) + 1; }));
    const container = document.getElementById('filterTags');
    container.innerHTML = `<span class="filter-tag ${!activeFilter ? 'active' : ''}" onclick="filterByTag(null)">全部</span>` +
        Object.entries(allTags)
            .sort((a, b) => b[1] - a[1])
            .map(([tag]) => `<span class="filter-tag ${activeFilter === tag ? 'active' : ''}" onclick="filterByTag('${escapeHtml(tag)}')">${escapeHtml(tag)}</span>`)
            .join('');
}

function filterByTag(tag) {
    activeFilter = tag;
    if (currentPage !== 'explore') navigateTo('explore');
    
    const search = document.getElementById('searchInput').value.toLowerCase();
    let posts = DB.getPosts();
    
    if (tag) {
        posts = posts.filter(p => p.tags?.includes(tag));
    }
    if (search) {
        posts = posts.filter(p =>
            p.title.toLowerCase().includes(search) ||
            stripHtml(p.content).toLowerCase().includes(search) ||
            p.tags?.some(t => t.toLowerCase().includes(search))
        );
    }
    
    posts.sort((a, b) => b.createdAt - a.createdAt);
    renderExplorePosts(posts);
    renderFilterTags();
}

function filterPosts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    let posts = DB.getPosts();
    
    if (activeFilter) {
        posts = posts.filter(p => p.tags?.includes(activeFilter));
    }
    if (search) {
        posts = posts.filter(p =>
            p.title.toLowerCase().includes(search) ||
            stripHtml(p.content).toLowerCase().includes(search) ||
            p.tags?.some(t => t.toLowerCase().includes(search))
        );
    }
    
    posts.sort((a, b) => b.createdAt - a.createdAt);
    renderExplorePosts(posts);
}

// --- Write ---
function renderWrite(postId) {
    editingPostId = postId || null;
    selectedTags = [];
    
    if (postId) {
        const post = DB.getPosts().find(p => p.id === postId);
        if (post) {
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').innerHTML = post.content;
            selectedTags = [...(post.tags || [])];
        }
    } else {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').innerHTML = '';
    }
    
    renderSelectedTags();
}

function handleTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = document.getElementById('tagInput');
        const tag = input.value.trim();
        if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
            selectedTags.push(tag);
            renderSelectedTags();
        }
        input.value = '';
    }
}

function renderSelectedTags() {
    const container = document.getElementById('selectedTags');
    container.innerHTML = selectedTags.map((tag, i) =>
        `<span class="selected-tag">${escapeHtml(tag)}<button onclick="removeTag(${i})">&times;</button></span>`
    ).join('');
}

function removeTag(index) {
    selectedTags.splice(index, 1);
    renderSelectedTags();
}

function execCommand(command, value) {
    document.execCommand(command, false, value || null);
    document.getElementById('postContent').focus();
}

function insertLink() {
    const url = prompt('输入链接地址:', 'https://');
    if (url) document.execCommand('createLink', false, url);
}

function insertCode() {
    const code = prompt('输入代码:');
    if (code) document.execCommand('insertHTML', false, `<pre><code>${escapeHtml(code)}</code></pre>`);
}

function insertImage() {
    document.getElementById('imageUpload').click();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        document.execCommand('insertHTML', false, `<img src="${event.target.result}" alt="uploaded image" style="max-width:100%;border-radius:8px;margin:8px 0">`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

function saveDraft() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').innerHTML.trim();
    
    if (!title && !content) {
        showToast('没有内容可保存', 'error');
        return;
    }
    
    showToast('草稿已保存', 'success');
}

function previewPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').innerHTML;
    
    if (!title && !content) {
        showToast('请先输入内容', 'error');
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
        <div class="preview-content">
            <button class="preview-close" onclick="this.closest('.preview-modal').remove()">&times;</button>
            <h1 style="font-size:2rem;font-weight:800;margin-bottom:16px">${escapeHtml(title || '无标题')}</h1>
            <div class="post-detail-body">${content}</div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function publishPost() {
    if (!currentUser) {
        showToast('请先登录', 'error');
        showModal('login');
        return;
    }
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').innerHTML.trim();
    
    if (!title) {
        showToast('请输入文章标题', 'error');
        return;
    }
    
    if (!content || content === '<br>') {
        showToast('请输入文章内容', 'error');
        return;
    }
    
    const posts = DB.getPosts();
    
    if (editingPostId) {
        const index = posts.findIndex(p => p.id === editingPostId);
        if (index !== -1) {
            posts[index].title = title;
            posts[index].content = content;
            posts[index].tags = [...selectedTags];
        }
        showToast('文章已更新', 'success');
    } else {
        const newPost = {
            id: 'p' + Date.now(),
            userId: currentUser.id,
            title,
            content,
            tags: [...selectedTags],
            likes: [],
            views: 0,
            createdAt: Date.now(),
        };
        posts.push(newPost);
        showToast('文章发布成功！', 'success');
    }
    
    DB.setPosts(posts);
    editingPostId = null;
    navigateTo('home');
}

// --- Post Detail ---
function renderPostDetail(postId) {
    const post = DB.getPosts().find(p => p.id === postId);
    if (!post) {
        navigateTo('home');
        return;
    }
    
    // Increment views
    post.views = (post.views || 0) + 1;
    DB.setPosts(DB.getPosts().map(p => p.id === postId ? post : p));
    
    const user = DB.getUsers().find(u => u.id === post.userId) || { name: '未知', avatarColor: '#666' };
    const isLiked = currentUser && post.likes?.includes(currentUser.id);
    const isBookmarked = currentUser && post.bookmarks?.includes(currentUser.id);
    const isOwner = currentUser && currentUser.id === post.userId;
    
    const detail = document.getElementById('postDetail');
    detail.innerHTML = `
        <div class="post-detail-header">
            <div class="post-card-tags" style="margin-bottom:16px">
                ${(post.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
            </div>
            <h1 class="post-detail-title">${escapeHtml(post.title)}</h1>
            <div class="post-detail-meta">
                <div class="post-detail-author">
                    <div class="avatar" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
                    <div>
                        <div style="font-weight:600;font-size:0.95rem">${escapeHtml(user.name)}</div>
                        <div style="font-size:0.8rem;color:var(--text-tertiary)">${getTimeAgo(post.createdAt)} · ${post.views} 次阅读</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="post-detail-body">${post.content}</div>
        <div class="post-detail-actions">
            <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                ${(post.likes || []).length} 赞
            </button>
            <button class="action-btn" onclick="sharePost('${post.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                分享
            </button>
            ${isOwner ? `
                <button class="action-btn" onclick="editPost('${post.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    编辑
                </button>
                <button class="action-btn" style="color:var(--danger)" onclick="deletePost('${post.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    删除
                </button>
            ` : ''}
        </div>
    `;
    
    renderComments(postId);
}

function toggleLike(postId) {
    if (!currentUser) {
        showToast('请先登录', 'error');
        showModal('login');
        return;
    }
    
    const posts = DB.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    if (!post.likes) post.likes = [];
    const index = post.likes.indexOf(currentUser.id);
    
    if (index === -1) {
        post.likes.push(currentUser.id);
        showToast('已点赞', 'success');
    } else {
        post.likes.splice(index, 1);
        showToast('已取消点赞', 'info');
    }
    
    DB.setPosts(posts);
    renderPostDetail(postId);
}

function sharePost(postId) {
    const url = `${window.location.origin}${window.location.pathname}#post-${postId}`;
    navigator.clipboard.writeText(url).then(() => {
        showToast('链接已复制到剪贴板', 'success');
    }).catch(() => {
        showToast('分享链接: ' + url, 'info');
    });
}

function editPost(postId) {
    navigateTo('write', postId);
}

function deletePost(postId) {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    const posts = DB.getPosts().filter(p => p.id !== postId);
    DB.setPosts(posts);
    
    const comments = DB.getComments().filter(c => c.postId !== postId);
    DB.setComments(comments);
    
    showToast('文章已删除', 'success');
    navigateTo('home');
}

// --- Comments ---
function renderComments(postId) {
    const comments = DB.getComments().filter(c => c.postId === postId).sort((a, b) => b.createdAt - a.createdAt);
    const container = document.getElementById('commentsList');
    
    if (comments.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:32px 0">暂无评论，快来发表第一条评论吧！</p>';
        return;
    }
    
    container.innerHTML = comments.map(comment => {
        const user = DB.getUsers().find(u => u.id === comment.userId) || { name: '未知', avatarColor: '#666' };
        const isOwner = currentUser && currentUser.id === comment.userId;
        
        return `
            <div class="comment-item">
                <div class="avatar avatar-sm" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${escapeHtml(user.name)}</span>
                        <span class="comment-date">${getTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p class="comment-text">${escapeHtml(comment.content)}</p>
                    <div class="comment-actions">
                        ${isOwner ? `<button class="comment-action" onclick="deleteComment('${comment.id}', '${postId}')">删除</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function submitComment(postId) {
    postId = postId || document.querySelector('.post-detail')?.querySelector('.action-btn')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
    
    if (!currentUser) {
        showToast('请先登录', 'error');
        showModal('login');
        return;
    }
    
    const input = document.getElementById('commentInput');
    const content = input.value.trim();
    
    if (!content) {
        showToast('请输入评论内容', 'error');
        return;
    }
    
    if (!postId) return;
    
    const comments = DB.getComments();
    comments.push({
        id: 'c' + Date.now(),
        postId,
        userId: currentUser.id,
        content,
        createdAt: Date.now(),
    });
    
    DB.setComments(comments);
    input.value = '';
    renderComments(postId);
    showToast('评论发表成功', 'success');
}

function deleteComment(commentId, postId) {
    if (!confirm('确定要删除这条评论吗？')) return;
    
    const comments = DB.getComments().filter(c => c.id !== commentId);
    DB.setComments(comments);
    renderComments(postId);
    showToast('评论已删除', 'success');
}

// --- Profile ---
function renderProfile(userId) {
    userId = userId || currentUser?.id;
    if (!userId) {
        navigateTo('home');
        return;
    }
    
    const user = DB.getUsers().find(u => u.id === userId);
    if (!user) {
        navigateTo('home');
        return;
    }
    
    const posts = DB.getPosts().filter(p => p.userId === userId);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
    
    const header = document.getElementById('profileHeader');
    header.innerHTML = `
        <div class="profile-avatar" style="background:${user.avatarColor}">${user.name.charAt(0)}</div>
        <h2 class="profile-name">${escapeHtml(user.name)}</h2>
        <p class="profile-bio">${escapeHtml(user.bio || '这个人很懒，什么都没写~')}</p>
        <div class="profile-stats">
            <div class="profile-stat">
                <div class="profile-stat-value">${posts.length}</div>
                <div class="profile-stat-label">文章</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${totalLikes}</div>
                <div class="profile-stat-label">获赞</div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('profilePosts');
    if (posts.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>暂无文章</h3></div>';
    } else {
        container.innerHTML = posts.sort((a, b) => b.createdAt - a.createdAt).map(p => renderPostCard(p)).join('');
    }
}

function switchProfileTab(tab) {
    document.querySelectorAll('.profile-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'posts') {
        renderProfile();
    } else if (tab === 'likes') {
        if (!currentUser) return;
        const posts = DB.getPosts().filter(p => p.likes?.includes(currentUser.id));
        const container = document.getElementById('profilePosts');
        if (posts.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>暂无收藏</h3></div>';
        } else {
            container.innerHTML = posts.map(p => renderPostCard(p)).join('');
        }
    }
}

// --- My Posts ---
function renderMyPosts() {
    if (!currentUser) {
        navigateTo('home');
        return;
    }
    
    const posts = DB.getPosts().filter(p => p.userId === currentUser.id).sort((a, b) => b.createdAt - a.createdAt);
    const container = document.getElementById('myPostsList');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>你还没有发布文章</h3>
                <p>点击上方按钮开始写作吧！</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="my-post-item" onclick="navigateTo('post', '${post.id}')">
            <div class="my-post-info">
                <div class="my-post-title">${escapeHtml(post.title)}</div>
                <div class="my-post-meta">
                    ${getTimeAgo(post.createdAt)} · ${(post.likes || []).length} 赞 · ${post.views || 0} 阅读
                    ${post.tags?.length ? ' · ' + post.tags.join(', ') : ''}
                </div>
            </div>
            <div class="my-post-actions" onclick="event.stopPropagation()">
                <button class="btn btn-ghost btn-sm" onclick="editPost('${post.id}')">编辑</button>
                <button class="btn btn-danger btn-sm" onclick="deletePost('${post.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

// --- Settings ---
function renderSettings() {
    if (!currentUser) {
        navigateTo('home');
        return;
    }
    
    document.getElementById('settingsName').value = currentUser.name;
    document.getElementById('settingsBio').value = currentUser.bio || '';
    
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.color === currentUser.avatarColor);
        opt.onclick = () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        };
    });
}

function saveSettings() {
    if (!currentUser) return;
    
    const name = document.getElementById('settingsName').value.trim();
    const bio = document.getElementById('settingsBio').value.trim();
    const colorEl = document.querySelector('.color-option.active');
    const avatarColor = colorEl ? colorEl.dataset.color : currentUser.avatarColor;
    
    if (!name) {
        showToast('用户名不能为空', 'error');
        return;
    }
    
    const users = DB.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index].name = name;
        users[index].bio = bio;
        users[index].avatarColor = avatarColor;
        DB.setUsers(users);
    }
    
    currentUser.name = name;
    currentUser.bio = bio;
    currentUser.avatarColor = avatarColor;
    DB.setCurrentUser(currentUser);
    updateAuthUI();
    showToast('设置已保存', 'success');
}

function exportData() {
    const data = {
        users: DB.getUsers(),
        posts: DB.getPosts(),
        comments: DB.getComments(),
        exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vectrol-blog-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('数据已导出', 'success');
}

function clearAllData() {
    if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) return;
    if (!confirm('再次确认：这将删除所有用户、文章和评论数据！')) return;
    
    localStorage.removeItem('vectrol_users');
    localStorage.removeItem('vectrol_posts');
    localStorage.removeItem('vectrol_comments');
    localStorage.removeItem('vectrol_currentUser');
    
    currentUser = null;
    updateAuthUI();
    navigateTo('home');
    showToast('所有数据已清除', 'success');
}

// --- Utilities ---
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' 分钟前';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' 小时前';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' 天前';
    
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        const preview = document.querySelector('.preview-modal');
        if (preview) preview.remove();
    }
});

// Handle hash navigation
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('post-')) {
        navigateTo('post', hash.replace('post-', ''));
    }
});

// Initial hash check
if (window.location.hash.startsWith('#post-')) {
    navigateTo('post', window.location.hash.replace('#post-', ''));
}
