export const htmlLogin = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CFLink 后台登录</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    :root {
      color-scheme: light dark;
      --bg: #edf4ff;
      --bg-2: #f8fbff;
      --surface: rgba(255,255,255,0.84);
      --border: rgba(148,163,184,0.28);
      --text: #0f172a;
      --sub: #64748b;
      --primary: #2563eb;
      --primary-2: #4f46e5;
      --danger: #dc2626;
      --shadow: 0 28px 70px rgba(15,23,42,0.14);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #020617;
        --bg-2: #0b1120;
        --surface: rgba(15,23,42,0.84);
        --border: rgba(71,85,105,0.4);
        --text: #e2e8f0;
        --sub: #94a3b8;
        --shadow: 0 34px 80px rgba(2,6,23,0.55);
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background:
        radial-gradient(circle at 0% 0%, rgba(59,130,246,0.20), transparent 28%),
        radial-gradient(circle at 100% 10%, rgba(79,70,229,0.16), transparent 24%),
        linear-gradient(180deg, var(--bg), var(--bg-2));
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .card {
      width: 100%;
      max-width: 440px;
      padding: 28px 24px;
      border-radius: 28px;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: var(--shadow);
      backdrop-filter: blur(20px) saturate(145%);
      -webkit-backdrop-filter: blur(20px) saturate(145%);
    }
    .eyebrow {
      display: inline-flex;
      padding: 7px 12px;
      border-radius: 999px;
      border: 1px solid rgba(37,99,235,0.16);
      background: rgba(37,99,235,0.10);
      color: var(--primary);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    h1 { margin: 16px 0 8px; font-size: 30px; letter-spacing: -0.04em; }
    p { margin: 0 0 18px; color: var(--sub); font-size: 14px; line-height: 1.7; }
    label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: var(--sub); }
    input {
      width: 100%;
      padding: 13px 14px;
      border-radius: 16px;
      border: 1px solid rgba(148,163,184,0.4);
      background: rgba(255,255,255,0.9);
      color: inherit;
      outline: none;
      font-size: 14px;
    }
    input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(59,130,246,0.14); }
    button {
      width: 100%;
      margin-top: 14px;
      min-height: 48px;
      border: none;
      border-radius: 16px;
      color: #fff;
      cursor: pointer;
      font-size: 15px;
      font-weight: 800;
      background: linear-gradient(90deg,var(--primary),var(--primary-2));
      box-shadow: 0 16px 30px rgba(37,99,235,0.24);
    }
    .error { min-height: 20px; margin-top: 12px; color: var(--danger); font-size: 13px; }
  </style>
</head>
<body>
  <main class="card">
    <div class="eyebrow">CFLink Admin</div>
    <h1>后台登录</h1>
    <p>输入管理员密码后进入后台。登录成功后会写入安全会话 Cookie。</p>
    <label for="pass">管理员密码</label>
    <input id="pass" type="password" placeholder="请输入后台密码" autocomplete="current-password" />
    <button id="loginBtn" type="button" onclick="login()">登录</button>
    <div id="error" class="error"></div>
  </main>
  <script>
    async function login() {
      const pass = document.getElementById('pass').value;
      const btn = document.getElementById('loginBtn');
      const error = document.getElementById('error');
      if (error) error.textContent = '';
      if (!pass) {
        if (error) error.textContent = '请输入密码';
        return;
      }
      if (btn) btn.disabled = true;
      try {
        const res = await fetch(location.pathname + '/login', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ password: pass })
        });
        if (!res.ok) {
          if (error) error.textContent = '密码错误';
          return;
        }
        location.href = location.pathname;
      } catch (e) {
        if (error) error.textContent = '登录失败，请稍后重试。';
      } finally {
        if (btn) btn.disabled = false;
      }
    }
    document.getElementById('pass').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') login();
    });
  </script>
</body>
</html>`;

export const htmlAdmin = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CFLink 管理后台</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    :root {
      color-scheme: light dark;
      --bg: #edf4ff;
      --bg-2: #f8fbff;
      --surface: rgba(255,255,255,0.84);
      --surface-strong: rgba(255,255,255,0.92);
      --surface-soft: rgba(255,255,255,0.58);
      --border: rgba(148,163,184,0.24);
      --border-strong: rgba(148,163,184,0.34);
      --text: #0f172a;
      --sub: #475569;
      --muted: #64748b;
      --primary: #2563eb;
      --primary-2: #4f46e5;
      --success: #16a34a;
      --danger: #dc2626;
      --warning: #f59e0b;
      --shadow-lg: 0 28px 70px rgba(15,23,42,0.14);
      --shadow-md: 0 18px 40px rgba(15,23,42,0.10);
      --radius-2xl: 28px;
      --radius-xl: 22px;
      --radius-lg: 18px;
      --radius-md: 14px;
      --max: 1220px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #020617;
        --bg-2: #0b1120;
        --surface: rgba(15,23,42,0.80);
        --surface-strong: rgba(15,23,42,0.92);
        --surface-soft: rgba(30,41,59,0.56);
        --border: rgba(71,85,105,0.38);
        --border-strong: rgba(100,116,139,0.48);
        --text: #e2e8f0;
        --sub: #cbd5e1;
        --muted: #94a3b8;
        --shadow-lg: 0 34px 80px rgba(2,6,23,0.55);
        --shadow-md: 0 18px 42px rgba(2,6,23,0.42);
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 0% 0%, rgba(59,130,246,0.20), transparent 28%),
        radial-gradient(circle at 100% 10%, rgba(79,70,229,0.16), transparent 24%),
        radial-gradient(circle at 50% 100%, rgba(14,165,233,0.10), transparent 30%),
        linear-gradient(180deg, var(--bg), var(--bg-2));
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      padding: 16px;
    }
    button, input, select { font: inherit; }
    .page { max-width: var(--max); margin: 0 auto; }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
      padding: 10px 4px;
    }
    .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .brand-mark {
      width: 40px; height: 40px; border-radius: 14px;
      background: linear-gradient(135deg, rgba(37,99,235,1), rgba(79,70,229,1));
      box-shadow: 0 16px 30px rgba(37,99,235,0.24);
      position: relative; overflow: hidden; flex: 0 0 auto;
    }
    .brand-mark::before {
      content: ""; position: absolute; inset: 1px; border-radius: 13px;
      background: linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.02));
    }
    .brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.03em; }
    .brand-sub { color: var(--muted); font-size: 12px; margin-top: 2px; }
    .top-actions { display: flex; gap: 10px; flex-wrap: wrap; }

    .panel {
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(18px) saturate(145%);
      -webkit-backdrop-filter: blur(18px) saturate(145%);
      padding: 22px;
      margin-bottom: 18px;
    }
    .hero {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .hero h1 { margin: 0 0 8px; font-size: clamp(28px, 4vw, 42px); letter-spacing: -0.05em; }
    .hero p { margin: 0; color: var(--sub); font-size: 14px; line-height: 1.8; }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 7px 12px; border-radius: 999px;
      border: 1px solid rgba(37,99,235,0.16); background: rgba(37,99,235,0.10);
      color: var(--primary); font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
      margin-bottom: 14px;
    }
    .stats { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; margin-top: 18px; }
    .stat {
      padding: 16px; border-radius: 20px; background: rgba(255,255,255,0.46); border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
    }
    .stat-label { color: var(--muted); font-size: 12px; margin-bottom: 6px; }
    .stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.04em; }

    .btn {
      min-height: 44px; padding: 0 16px; border-radius: 14px; border: none; cursor: pointer;
      font-size: 14px; font-weight: 800;
    }
    .btn-primary { color: #fff; background: linear-gradient(90deg, var(--primary), var(--primary-2)); box-shadow: 0 16px 30px rgba(37,99,235,0.24); }
    .btn-ghost { color: var(--text); background: rgba(148,163,184,0.10); border: 1px solid var(--border); }
    .btn-danger { color: var(--danger); background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.18); }
    .btn:disabled { opacity: .6; cursor: default; box-shadow: none; }

    .filters {
      display: grid; gap: 14px;
    }
    .toolbar-row {
      display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
      padding: 14px; border-radius: 18px; border: 1px solid var(--border); background: rgba(255,255,255,0.38);
    }
    .tool-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .tool-label { color: var(--sub); font-size: 13px; font-weight: 700; }
    select, input[type="number"], input[type="text"] {
      min-height: 42px; padding: 0 13px; border-radius: 14px; border: 1px solid var(--border-strong);
      background: rgba(255,255,255,0.88); color: var(--text); outline: none;
    }
    input[type="text"] { min-width: 260px; }
    input[type="number"] { width: 96px; }
    select:focus, input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(59,130,246,0.14); }

    .type-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
    .type-tab {
      min-height: 42px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--border);
      background: rgba(255,255,255,0.55); color: var(--sub); cursor: pointer; font-size: 13px; font-weight: 800;
    }
    .type-tab.active { color: #fff; background: linear-gradient(90deg, var(--primary), var(--primary-2)); box-shadow: 0 12px 24px rgba(37,99,235,0.22); }

    .list-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
    .section-title { margin: 0; font-size: 18px; letter-spacing: -0.03em; }
    .section-sub { color: var(--muted); font-size: 13px; }
    .status-line { color: var(--muted); font-size: 13px; }

    .cards { display: grid; gap: 12px; }
    .item-card {
      border: 1px solid var(--border); border-radius: 20px; background: var(--surface-strong);
      padding: 16px; box-shadow: var(--shadow-md);
    }
    .item-top { display: flex; align-items: start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
    .item-key { font-size: 18px; font-weight: 800; letter-spacing: -0.03em; word-break: break-all; }
    .item-meta { color: var(--muted); font-size: 12px; margin-top: 6px; line-height: 1.7; }
    .pill {
      display: inline-flex; align-items: center; justify-content: center; min-height: 28px; padding: 0 10px; border-radius: 999px;
      font-size: 12px; font-weight: 800; white-space: nowrap; border: 1px solid transparent;
    }
    .pill-url { color: #1d4ed8; background: rgba(37,99,235,0.10); border-color: rgba(37,99,235,0.18); }
    .pill-text { color: #7c3aed; background: rgba(124,58,237,0.10); border-color: rgba(124,58,237,0.18); }
    .pill-file { color: #15803d; background: rgba(22,163,74,0.10); border-color: rgba(22,163,74,0.18); }
    .item-body {
      padding: 14px; border-radius: 16px; border: 1px solid var(--border); background: rgba(148,163,184,0.08);
      color: var(--text); font-size: 14px; line-height: 1.75; word-break: break-word;
    }
    .item-title { font-weight: 800; margin-bottom: 8px; }
    .item-body a { color: var(--primary); text-decoration: none; }
    .item-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
    .empty {
      text-align: center; color: var(--sub); padding: 30px 14px; border-radius: 20px; border: 1px dashed var(--border-strong);
      background: rgba(255,255,255,0.26);
    }

    @media (min-width: 920px) {
      body { padding: 24px; }
      .hero { grid-template-columns: 1.1fr 0.9fr; align-items: stretch; }
      .stats { grid-template-columns: repeat(2, minmax(0,1fr)); align-content: start; }
    }
    @media (max-width: 720px) {
      body { padding: 12px; }
      .panel { padding: 18px; border-radius: 22px; }
      .topbar { margin-bottom: 14px; }
      .brand-mark { width: 36px; height: 36px; border-radius: 12px; }
      .brand-mark::before { border-radius: 11px; }
      .brand-name { font-size: 17px; }
      .toolbar-row { padding: 12px; }
      input[type="text"] { min-width: 0; width: 100%; }
      .tool-group { width: 100%; }
      .top-actions { width: 100%; }
      .top-actions .btn { flex: 1; }
      .type-tabs { gap: 8px; }
      .type-tab { flex: 1 1 calc(50% - 8px); }
      .item-top { flex-direction: column; }
      .item-actions .btn { flex: 1; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark"></div>
        <div>
          <div class="brand-name">CFLink</div>
          <div class="brand-sub">Admin Panel</div>
        </div>
      </div>
      <div class="top-actions">
        <button class="btn btn-ghost" onclick="reload()">刷新数据</button>
        <button class="btn btn-ghost" onclick="logout()">退出登录</button>
      </div>
    </header>

    <section class="panel hero">
      <div>
        <div class="eyebrow">Manage Share Content</div>
        <h1>统一管理链接、文本和文件</h1>
        <p>这版后台和首页统一为同一套产品风格，同时补上按内容类型分类浏览。你可以按链接 / 文本 / 文件筛选、搜索、排序、分页，并直接打开或删除条目。</p>
      </div>
      <div class="stats">
        <div class="stat">
          <div class="stat-label">当前筛选</div>
          <div class="stat-value" id="statType">全部</div>
        </div>
        <div class="stat">
          <div class="stat-label">当前结果数</div>
          <div class="stat-value" id="statTotal">0</div>
        </div>
      </div>
    </section>

    <section class="panel filters">
      <div class="toolbar-row">
        <div>
          <h2 class="section-title">内容列表</h2>
          <div class="section-sub">支持类型筛选、关键词搜索、创建时间排序和分页跳转。</div>
        </div>
        <div class="status-line" id="pageInfo">第 1 / 1 页</div>
      </div>

      <div class="toolbar-row">
        <div class="tool-group">
          <span class="tool-label">分类</span>
          <div class="type-tabs">
            <button class="type-tab active" data-type="all" onclick="setType('all', this)">全部</button>
            <button class="type-tab" data-type="url" onclick="setType('url', this)">链接</button>
            <button class="type-tab" data-type="text" onclick="setType('text', this)">文本</button>
            <button class="type-tab" data-type="file" onclick="setType('file', this)">文件</button>
          </div>
        </div>
      </div>

      <div class="toolbar-row">
        <div class="tool-group">
          <span class="tool-label">排序</span>
          <select id="sortSelect" onchange="onSortChange()">
            <option value="name">按后缀（A → Z）</option>
            <option value="time">按创建时间（新 → 旧）</option>
          </select>
        </div>
        <div class="tool-group">
          <span class="tool-label">搜索</span>
          <input id="searchInput" type="text" placeholder="搜索后缀、标题、链接或文本内容" onkeydown="onSearchKey(event)" />
          <button class="btn btn-ghost" onclick="applySearch()">搜索</button>
          <button class="btn btn-ghost" onclick="clearSearch()">清除</button>
        </div>
        <div class="tool-group" style="justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="prevPage()">上一页</button>
          <button class="btn btn-ghost" onclick="nextPage()">下一页</button>
          <input id="jumpInput" type="number" min="1" placeholder="页码" />
          <button class="btn btn-primary" onclick="jumpPage()">跳转</button>
        </div>
      </div>

      <div id="linkContent"></div>
    </section>
  </div>

  <script>
    let base = location.pathname || "";
    while (base.length > 1 && base.endsWith("/")) base = base.slice(0, -1);
    const apiBase = base + "/api";

    const state = {
      page: 1,
      size: 10,
      sort: 'name',
      q: '',
      type: 'all',
      total: 0,
      totalPages: 1,
      loading: false,
    };

    function escapeHtml(input) {
      return String(input ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function pad2(n) {
      return String(n).padStart(2, '0');
    }

    function formatTime(createdAtMs) {
      const ms = Number.isFinite(createdAtMs) ? createdAtMs : 0;
      if (ms === 0) return '1970-01-01 00:00:00';
      const d = new Date(ms);
      return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
        + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
    }

    function formatBytes(size) {
      const value = Number(size) || 0;
      if (value < 1024) return value + ' B';
      if (value < 1024 * 1024) return (value / 1024).toFixed(1) + ' KB';
      if (value < 1024 * 1024 * 1024) return (value / (1024 * 1024)).toFixed(1) + ' MB';
      return (value / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }

    function typeLabel(type) {
      return type === 'url' ? '链接' : (type === 'text' ? '文本' : (type === 'file' ? '文件' : '全部'));
    }

    function typeClass(type) {
      return type === 'url' ? 'pill-url' : (type === 'text' ? 'pill-text' : 'pill-file');
    }

    function setSummary() {
      const pageInfo = document.getElementById('pageInfo');
      const statType = document.getElementById('statType');
      const statTotal = document.getElementById('statTotal');
      if (pageInfo) pageInfo.textContent = '第 ' + state.page + ' / ' + state.totalPages + ' 页 · 共 ' + state.total + ' 条';
      if (statType) statType.textContent = typeLabel(state.type);
      if (statTotal) statTotal.textContent = String(state.total);
    }

    function renderEmpty(msg) {
      document.getElementById('linkContent').innerHTML = '<div class="empty">' + escapeHtml(msg || '暂无数据') + '</div>';
      setSummary();
    }

    function buildPreview(item) {
      const title = String(item.title || '');
      const value = String(item.value || '');
      if (item.type === 'url') {
        return '<div class="item-body"><a href="' + escapeHtml(value) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(value) + '</a></div>';
      }
      if (item.type === 'file') {
        const name = escapeHtml(item.filename || value || 'download');
        const meta = [item.contentType || 'application/octet-stream', formatBytes(item.size || 0)].join(' · ');
        const titleHtml = title ? '<div class="item-title">' + escapeHtml(title) + '</div>' : '';
        return '<div class="item-body">'
          + titleHtml
          + '<div><a href="/' + encodeURIComponent(item.name) + '" target="_blank" rel="noopener noreferrer">' + name + '</a></div>'
          + '<div style="margin-top:8px;color:var(--muted);font-size:13px;">' + escapeHtml(meta) + '</div>'
          + '</div>';
      }
      const text = value.length > 220 ? value.slice(0, 220) + '…' : value;
      const titleHtml = title ? '<div class="item-title">' + escapeHtml(title) + '</div>' : '';
      return '<div class="item-body">' + titleHtml + (text ? escapeHtml(text).replaceAll('\n', '<br>') : '<span style="color:var(--muted);">（空）</span>') + '</div>';
    }

    function renderCards(items) {
      const html = items.map(item => {
        const key = escapeHtml(item.name);
        const created = escapeHtml(formatTime(Number(item.createdAt)));
        const type = typeLabel(item.type);
        const openHref = '/' + encodeURIComponent(item.name);
        return '<article class="item-card">'
          + '<div class="item-top">'
          +   '<div>'
          +     '<div class="item-key">/' + key + '</div>'
          +     '<div class="item-meta">创建时间：' + created + '</div>'
          +   '</div>'
          +   '<span class="pill ' + typeClass(item.type) + '">' + type + '</span>'
          + '</div>'
          + buildPreview(item)
          + '<div class="item-actions">'
          +   '<a class="btn btn-ghost" href="' + openHref + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none;">打开</a>'
          +   '<button class="btn btn-danger" data-key="' + key + '" onclick="delLink(this.dataset.key, this)">删除</button>'
          + '</div>'
          + '</article>';
      }).join('');
      document.getElementById('linkContent').innerHTML = '<div class="cards">' + html + '</div>';
      setSummary();
    }

    async function loadPage(page) {
      if (state.loading) return;
      state.loading = true;
      const p = Math.max(1, Math.floor(Number(page) || 1));
      renderEmpty('加载中...');

      const sortSelect = document.getElementById('sortSelect');
      if (sortSelect && sortSelect.value !== state.sort) sortSelect.value = state.sort;

      try {
        const qs = new URLSearchParams({
          page: String(p),
          size: String(state.size),
          sort: state.sort,
          type: state.type,
        });
        if (state.q) qs.set('q', String(state.q));

        const res = await fetch(apiBase + '/all?' + qs.toString(), {
          credentials: 'same-origin',
          cache: 'no-store'
        });
        if (res.status === 401) {
          location.href = base;
          return;
        }
        if (!res.ok) {
          renderEmpty('加载失败');
          return;
        }

        const data = await res.json();
        state.page = Number(data.page) || p;
        state.total = Number(data.total) || 0;
        state.totalPages = Math.max(1, Number(data.totalPages) || 1);
        state.type = data.type || state.type;

        const items = Array.isArray(data.links) ? data.links : [];
        if (!items.length) {
          renderEmpty(state.q ? '没有匹配结果' : '当前分类下暂无内容');
          return;
        }
        renderCards(items);
      } catch (e) {
        renderEmpty('加载失败');
      } finally {
        state.loading = false;
      }
    }

    function reload() { loadPage(state.page); }

    function onSortChange() {
      const sel = document.getElementById('sortSelect');
      state.sort = sel && sel.value === 'time' ? 'time' : 'name';
      state.page = 1;
      loadPage(1);
    }

    function setType(type, btn) {
      state.type = type === 'url' || type === 'text' || type === 'file' ? type : 'all';
      state.page = 1;
      document.querySelectorAll('.type-tab').forEach(el => el.classList.toggle('active', el === btn));
      loadPage(1);
    }

    function normalizeSearchQuery(raw) {
      let q = String(raw ?? '').trim();
      if (!q) return '';
      try {
        if (q.includes('://')) {
          const u = new URL(q);
          if (u.host === location.host) {
            const seg = decodeURIComponent((u.pathname || '').split('/')[1] || '');
            if (seg) q = seg;
          }
        }
      } catch (e) {}
      while (q.startsWith('/')) q = q.slice(1);
      return q.trim();
    }

    function applySearch() {
      const input = document.getElementById('searchInput');
      const q = normalizeSearchQuery(input ? input.value : '');
      state.q = q;
      state.page = 1;
      if (input) input.value = q;
      loadPage(1);
    }

    function clearSearch() {
      const input = document.getElementById('searchInput');
      if (input) input.value = '';
      state.q = '';
      state.page = 1;
      loadPage(1);
    }

    function onSearchKey(ev) {
      if (ev && ev.key === 'Enter') applySearch();
    }

    function prevPage() {
      if (state.page <= 1) return;
      loadPage(state.page - 1);
    }

    function nextPage() {
      if (state.page >= state.totalPages) return;
      loadPage(state.page + 1);
    }

    function jumpPage() {
      const input = document.getElementById('jumpInput');
      const v = input ? Number(input.value) : NaN;
      if (!Number.isFinite(v) || v < 1) return;
      loadPage(Math.floor(v));
    }

    async function delLink(name, btn) {
      if (!name) return;
      if (!confirm('确定删除 /' + name + ' 吗？')) return;
      if (btn) {
        btn.disabled = true;
        btn.textContent = '删除中...';
      }
      try {
        const res = await fetch(apiBase + '/delete/' + encodeURIComponent(name), {
          credentials: 'same-origin',
          cache: 'no-store'
        });
        if (res.status === 401) {
          location.href = base;
          return;
        }
        if (!res.ok) {
          alert('删除失败');
          if (btn) {
            btn.disabled = false;
            btn.textContent = '删除';
          }
          return;
        }
        loadPage(state.page);
      } catch (e) {
        alert('请求失败，请稍后重试。');
        if (btn) {
          btn.disabled = false;
          btn.textContent = '删除';
        }
      }
    }

    async function logout() {
      try {
        await fetch(base + '/logout', { method: 'POST', credentials: 'same-origin' });
      } catch (e) {}
      location.href = base;
    }

    const jumpInput = document.getElementById('jumpInput');
    if (jumpInput) {
      jumpInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') jumpPage();
      });
    }

    loadPage(1);
  </script>
</body>
</html>`;
