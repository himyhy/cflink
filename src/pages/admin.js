export const htmlLogin = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>后台登录</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    :root {
      --bg-color: #f3f4f6;
      --bg-gradient: radial-gradient(circle at top left, #e0f2fe 0, #f3f4f6 35%, #e5e7eb 100%);
      --card-bg: rgba(255,255,255,0.84);
      --card-border: rgba(148,163,184,0.45);
      --card-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
      --text-main: #0f172a;
      --text-sub: #6b7280;
      --primary: #2563eb;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-color: #020617;
        --bg-gradient: radial-gradient(circle at top left, #0f172a 0, #020617 40%, #020617 100%);
        --card-bg: rgba(15,23,42,0.88);
        --card-border: rgba(51,65,85,0.9);
        --card-shadow: 0 22px 60px rgba(15,23,42,0.9);
        --text-main: #e5e7eb;
        --text-sub: #94a3b8;
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
      background: var(--bg-gradient), var(--bg-color);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
    }
    .card {
      width: 100%;
      max-width: 420px;
      border-radius: 24px;
      padding: 26px 22px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      box-shadow: var(--card-shadow);
      backdrop-filter: blur(20px) saturate(140%);
      -webkit-backdrop-filter: blur(20px) saturate(140%);
    }
    h1 { margin: 0 0 8px; font-size: 24px; }
    p { margin: 0 0 16px; color: var(--text-sub); font-size: 14px; line-height: 1.6; }
    label { display: block; font-size: 13px; margin-bottom: 8px; color: var(--text-sub); }
    input {
      width: 100%;
      padding: 12px 13px;
      border-radius: 12px;
      border: 1px solid rgba(148,163,184,0.45);
      background: rgba(255,255,255,0.9);
      color: inherit;
      outline: none;
      font-size: 14px;
    }
    button {
      width: 100%;
      margin-top: 14px;
      padding: 12px 14px;
      border: none;
      border-radius: 12px;
      color: #fff;
      cursor: pointer;
      font-size: 15px;
      font-weight: 700;
      background: linear-gradient(90deg,#2563eb,#4f46e5);
    }
    .error { min-height: 20px; margin-top: 12px; color: #dc2626; font-size: 13px; }
  </style>
</head>
<body>
  <main class="card">
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
    <title>短链接管理后台</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <style>
      :root {
        --bg-color: #f3f4f6;
        --bg-gradient: radial-gradient(circle at top left, #e0f2fe 0, #f3f4f6 35%, #e5e7eb 100%);
        --card-bg: rgba(255, 255, 255, 0.82);
        --card-border: rgba(148, 163, 184, 0.45);
        --card-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
        --radius-xl: 26px;
        --radius-lg: 18px;
        --radius-md: 12px;

        --text-main: #0f172a;
        --text-sub: #6b7280;
        --text-muted: #9ca3af;

        --primary: #2563eb;
        --primary-soft: rgba(37, 99, 235, 0.12);
        --primary-border: rgba(37, 99, 235, 0.4);
        --danger: #ef4444;

        --input-bg: rgba(255, 255, 255, 0.98);
        --input-border: rgba(148, 163, 184, 0.7);
        --input-focus-ring: rgba(59, 130, 246, 0.55);
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --bg-color: #020617;
          --bg-gradient: radial-gradient(circle at top left, #0f172a 0, #020617 40%, #020617 100%);
          --card-bg: rgba(15, 23, 42, 0.88);
          --card-border: rgba(51, 65, 85, 0.9);
          --card-shadow: 0 22px 60px rgba(15, 23, 42, 0.9);

          --text-main: #e5e7eb;
          --text-sub: #9ca3af;
          --text-muted: #6b7280;

          --input-bg: rgba(15, 23, 42, 0.96);
          --input-border: rgba(75, 85, 99, 0.9);
        }
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: var(--bg-gradient), var(--bg-color);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
        color: var(--text-main);
        -webkit-font-smoothing: antialiased;
      }

      .page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 26px 18px 36px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-left: 4px;
        margin-bottom: 18px;
        user-select: none;
      }

      .brand-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: radial-gradient(circle at 30% 20%, #38bdf8 0, #2563eb 35%, #4f46e5 100%);
        box-shadow: 0 0 18px rgba(56, 189, 248, 0.8);
      }

      .brand-title {
        font-size: 13px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--text-muted);
      }

      .card {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--radius-xl);
        box-shadow: var(--card-shadow);
        backdrop-filter: blur(20px) saturate(140%);
        -webkit-backdrop-filter: blur(20px) saturate(140%);
        padding: 26px 22px 22px;
        margin-bottom: 20px;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      h2 {
        margin: 0;
        font-size: 22px;
        letter-spacing: 0.02em;
      }

      .subtitle {
        margin: 4px 0 0;
        color: var(--text-sub);
        font-size: 13px;
      }

      .section-title {
        margin: 0 0 12px;
        font-size: 16px;
        font-weight: 600;
      }

      .badge {
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--primary-soft);
        color: #1d4ed8;
        border: 1px solid rgba(129, 140, 248, 0.35);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .btn {
        padding: 10px 14px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: transform 0.16s ease, box-shadow 0.18s ease, filter 0.16s ease;
      }

      .btn-primary {
        background-image: linear-gradient(90deg, #2563eb, #4f46e5);
        color: #fff;
        box-shadow: 0 12px 26px rgba(37, 99, 235, 0.35);
      }

      .btn-primary:hover { transform: translateY(-1px); filter: brightness(1.03); }
      .btn-primary:active { transform: translateY(0); box-shadow: 0 8px 18px rgba(30,64,175,0.5); }

      .btn-ghost {
        background: rgba(255,255,255,0.6);
        color: var(--text-main);
        border: 1px solid var(--card-border);
      }

      .btn-red {
        background: rgba(248, 113, 113, 0.14);
        color: var(--danger);
        border: 1px solid rgba(248, 113, 113, 0.35);
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 10px;
        padding: 12px;
        border-radius: var(--radius-lg);
        border: 1px solid rgba(148,163,184,0.22);
        background: rgba(255,255,255,0.35);
      }

      .tool-group {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .tool-label {
        font-size: 13px;
        color: var(--text-sub);
        user-select: none;
      }

      select,
      input[type="number"],
      input[type="text"] {
        padding: 9px 10px;
        border-radius: 12px;
        border: 1px solid var(--card-border);
        background: rgba(255,255,255,0.78);
        color: var(--text-main);
        outline: none;
      }

      input[type="number"] {
        width: 110px;
      }

      input[type="text"] {
        width: 260px;
      }

      .pager-info {
        font-size: 13px;
        color: var(--text-sub);
        white-space: nowrap;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      thead th {
        text-align: left;
        padding: 12px;
        font-size: 13px;
        color: var(--text-sub);
        letter-spacing: 0.01em;
        border-bottom: 1px solid var(--card-border);
      }

      tbody td {
        padding: 14px 12px;
        border-bottom: 1px solid rgba(148,163,184,0.25);
        word-break: break-all;
      }

      .empty {
        text-align: center;
        color: var(--text-sub);
        padding: 18px 0;
      }

      @media (max-width: 720px) {
        thead { display: none; }
        tbody tr { display: block; margin-bottom: 14px; border: 1px solid var(--card-border); border-radius: 14px; background: rgba(255,255,255,0.78); }
        tbody td { display: flex; justify-content: space-between; align-items: center; gap: 10px; border-bottom: 1px solid rgba(148,163,184,0.18); }
        tbody td:last-child { border-bottom: none; }
        tbody td::before { content: attr(data-label); font-size: 12px; color: var(--text-sub); }
      }
    </style>
</head>
<body>
  <div class="page">
    <header class="brand">
      <div class="brand-dot"></div>
      <span class="brand-title">SHORT URL SERVICE</span>
    </header>

    <section class="card">
      <div class="card-header">
        <div>
          <h2>短链接管理后台</h2>
          <p class="subtitle">管理分享内容：查看后缀、类型、内容与创建时间（精确到秒）。删除链接项时会同时清理哈希索引。</p>
        </div>
        <span class="badge">ADMIN PANEL</span>
      </div>

      <div style="margin-top: 16px; display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn btn-ghost" onclick="reload()">刷新数据</button>
        <button class="btn btn-ghost" onclick="logout()">退出登录</button>
      </div>
    </section>

    <section class="card">
      <h3 class="section-title">链接列表</h3>

      <div class="toolbar">
        <div class="tool-group">
          <span class="tool-label">排序</span>
          <select id="sortSelect" onchange="onSortChange()">
            <option value="name">按后缀（A → Z）</option>
            <option value="time">按创建时间（新 → 旧）</option>
          </select>
          <span class="pager-info" id="totalInfo"></span>
        </div>

        <div class="tool-group tool-search">
          <span class="tool-label">搜索</span>
          <input id="searchInput" type="text" placeholder="搜索后缀或长链接" onkeydown="onSearchKey(event)" />
          <button class="btn btn-ghost" onclick="applySearch()">搜索</button>
          <button class="btn btn-ghost" onclick="clearSearch()">清除</button>
        </div>

        <div class="tool-group" style="justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="prevPage()">上一页</button>
          <button class="btn btn-ghost" onclick="nextPage()">下一页</button>
          <span class="pager-info" id="pageInfo"></span>
          <input id="jumpInput" type="number" min="1" placeholder="页码" />
          <button class="btn btn-primary" onclick="jumpPage()">跳转</button>
        </div>
      </div>

      <div id="linkContent" style="margin-top: 4px;"></div>
    </section>
  </div>

  <script>
    // 后台入口路径是可变的（由 Worker 环境变量控制），因此 API 路径使用当前页面路径推导：
    let base = location.pathname || "";
    while (base.length > 1 && base.endsWith("/")) base = base.slice(0, -1);
    const apiBase = base + "/api";

    const state = {
      page: 1,
      size: 10,
      sort: 'name',
      q: '',
      total: 0,
      totalPages: 1,
      loading: false,
    };

    function escapeHtml(input) {
      const s = String(input ?? '');
      return s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function pad2(n) {
      return String(n).padStart(2, '0');
    }

    // 本地时间格式：YYYY-MM-DD HH:mm:ss
    // 如果 createdAt 缺失/非法，默认显示 1970（epoch=0）
    function formatTime(createdAtMs) {
      const ms = Number.isFinite(createdAtMs) ? createdAtMs : 0;
      // 兼容：未存储创建时间时统一显示 1970-01-01 00:00:00
      if (ms === 0) return '1970-01-01 00:00:00';
      const d = new Date(ms);
      return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
        + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
    }

    function setPagerInfo() {
      const pageInfo = document.getElementById('pageInfo');
      const totalInfo = document.getElementById('totalInfo');
      if (pageInfo) pageInfo.textContent = '第 ' + state.page + ' / ' + state.totalPages + ' 页';
      if (totalInfo) totalInfo.textContent = '共 ' + state.total + ' 条';
    }

    function renderEmpty(msg) {
      document.getElementById('linkContent').innerHTML = '<div class="empty">' + (msg || '暂无数据') + '</div>';
      setPagerInfo();
    }

    function renderTable(items) {
      let html = '';
      html += '<table>';
      html += '<thead><tr>'
        + '<th style="width:16%">后缀</th>'
        + '<th style="width:10%">类型</th>'
        + '<th>内容</th>'
        + '<th style="width:20%">创建时间</th>'
        + '<th style="width:12%">操作</th>'
        + '</tr></thead>';
      html += '<tbody>';

      items.forEach(item => {
        const name = escapeHtml(item.name);
        const type = item.type === 'text' ? '文本' : (item.type === 'file' ? '文件' : '链接');
        const title = String(item.title || '');
        const content = String(item.value || '');
        const fileMeta = item.type === 'file'
          ? ('文件名：' + content + (item.size ? '｜大小：' + item.size + ' B' : ''))
          : '';
        const previewSource = item.type === 'file'
          ? (title ? title + '｜' + fileMeta : fileMeta)
          : (item.type === 'text' && title ? (title + '｜' + content) : content);
        const preview = escapeHtml(previewSource.length > 120 ? previewSource.slice(0, 120) + '…' : previewSource);
        const created = formatTime(Number(item.createdAt));

        html += '<tr>'
          + '<td data-label="后缀"><strong>/' + name + '</strong></td>'
          + '<td data-label="类型">' + type + '</td>'
          + '<td data-label="内容">'
          +   (item.type === 'text'
                ? (preview ? '<span>' + preview.split(String.fromCharCode(10)).join('<br>') + '</span>' : '<span style="color: var(--text-muted);">（空）</span>')
                : item.type === 'file'
                  ? (preview ? '<a href="/' + name + '" target="_blank" rel="noopener noreferrer">' + preview + '</a>' : '<span style="color: var(--text-muted);">（空）</span>')
                  : (preview
                      ? '<a href="' + escapeHtml(content) + '" target="_blank" rel="noopener noreferrer">' + preview + '</a>'
                      : '<span style="color: var(--text-muted);">（空）</span>'))
          + '</td>'
          + '<td data-label="创建时间">' + escapeHtml(created) + '</td>'
          + '<td data-label="操作">'
          +   '<button class="btn btn-red" data-key="' + name + '" onclick="delLink(this.dataset.key, this)">删除</button>'
          + '</td>'
          + '</tr>';
      });

      html += '</tbody></table>';
      document.getElementById('linkContent').innerHTML = html;
      setPagerInfo();
    }

    async function loadPage(page) {
      if (state.loading) return;
      state.loading = true;

      const p = Math.max(1, Math.floor(Number(page) || 1));
      renderEmpty('加载中...');

      const sortSelect = document.getElementById('sortSelect');
      if (sortSelect && sortSelect.value !== state.sort) {
        sortSelect.value = state.sort;
      }

      try {
        const qs = new URLSearchParams({
          page: String(p),
          size: String(state.size),
          sort: state.sort,
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
        if (!res.ok) { alert('加载失败'); renderEmpty(); return; }

        const data = await res.json();
        state.page = Number(data.page) || p;
        state.total = Number(data.total) || 0;
        state.totalPages = Math.max(1, Number(data.totalPages) || 1);

        const items = Array.isArray(data.links) ? data.links : [];
        if (!items.length) { renderEmpty(); return; }
        renderTable(items);
      } catch (e) {
        renderEmpty('加载失败');
      } finally {
        state.loading = false;
      }
    }

    function reload() {
      loadPage(state.page);
    }

    function onSortChange() {
      const sel = document.getElementById('sortSelect');
      const v = sel ? sel.value : 'name';
      state.sort = (v === 'time') ? 'time' : 'name';
      state.page = 1;
      loadPage(1);
    }

    function normalizeSearchQuery(raw) {
      let q = String(raw ?? '').trim();
      if (!q) return '';
      // 允许直接粘贴短链（同域名）进行搜索：例如 https://xxx.com/abc
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
      if (!ev) return;
      if (ev.key === 'Enter') applySearch();
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

        // 删除后刷新当前页（每页仅 10 条，刷新很快，且能保持分页与排序正确）
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
        await fetch(base + '/logout', {
          method: 'POST',
          credentials: 'same-origin'
        });
      } catch (e) {}
      location.href = base;
    }

    // 回车直接跳转
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
