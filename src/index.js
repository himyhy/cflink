// ==================== 基础配置 ====================
// 后台密码优先使用环境变量 ADMIN_PASS；若未配置则回退到默认占位值
const DEFAULT_ADMIN_PASS = "change-this-password";

function escapeHtmlServer(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderTextPage(content, key, title) {
  const safeKey = escapeHtmlServer(key || "");
  const safeTitle = escapeHtmlServer(title || "");
  const renderedContent = renderBasicMarkdown(content);
  const copyTextJson = JSON.stringify(String(content || ""));
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${safeTitle || (safeKey ? safeKey + " - 文本页" : "文本页")}</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f3f4f6;
      --card: rgba(255,255,255,0.88);
      --border: rgba(148,163,184,0.35);
      --text: #0f172a;
      --sub: #64748b;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #020617;
        --card: rgba(15,23,42,0.9);
        --border: rgba(71,85,105,0.6);
        --text: #e5e7eb;
        --sub: #94a3b8;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      padding: 24px 16px;
      background: radial-gradient(circle at top left, rgba(56,189,248,0.15), transparent 35%), var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
    }
    .wrap { max-width: 760px; margin: 0 auto; }
    .card {
      border: 1px solid var(--border);
      background: var(--card);
      border-radius: 24px;
      padding: 24px 20px;
      backdrop-filter: blur(18px) saturate(130%);
      -webkit-backdrop-filter: blur(18px) saturate(130%);
      box-shadow: 0 18px 40px rgba(15,23,42,0.15);
    }
    .toolbar { display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom: 12px; flex-wrap:wrap; }
    .eyebrow { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--sub); }
    h1 { margin: 10px 0 8px; font-size: 24px; }
    .meta { margin: 0 0 18px; color: var(--sub); font-size: 13px; }
    .copy-btn { border:none; border-radius:12px; padding:10px 14px; cursor:pointer; color:#fff; background:linear-gradient(90deg,#16a34a,#22c55e); font-weight:600; }
    .content { line-height: 1.75; font-size: 16px; word-break: break-word; white-space: normal; }
    .content h1,.content h2,.content h3 { margin: 18px 0 8px; line-height:1.35; }
    .content p { margin: 0 0 12px; }
    .content ul { margin: 0 0 12px 20px; padding: 0; }
    .content li { margin: 0 0 8px; }
    .content code { padding: 2px 6px; border-radius: 8px; background: rgba(148,163,184,0.18); font-family: ui-monospace, SFMono-Regular, monospace; font-size: .92em; }
    .content a { color: #2563eb; }
  </style>
</head>
<body>
  <div class="wrap">
    <article class="card">
      <div class="toolbar">
        <div>
          <div class="eyebrow">TEXT SHARE</div>
          <h1>${safeTitle || "文本内容"}</h1>
          <p class="meta">链接标识：/${safeKey || "-"}</p>
        </div>
        <button class="copy-btn" type="button" onclick="copyContent(this)">复制内容</button>
      </div>
      <div class="content">${renderedContent || "<p>（空内容）</p>"}</div>
    </article>
  </div>
  <script>
    async function copyContent(btn) {
      try {
        await navigator.clipboard.writeText(${copyTextJson});
        const old = btn.textContent;
        btn.textContent = '已复制';
        setTimeout(() => { btn.textContent = old; }, 1800);
      } catch (e) {
        alert('复制失败，请手动复制。');
      }
    }
  </script>
</body>
</html>`;
}

function encodeStoredValue(payload) {
  return JSON.stringify(payload);
}

function parseStoredValue(raw) {
  if (typeof raw !== "string" || !raw.length) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return { type: "url", value: raw, raw };
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      if (parsed.type === "url" && typeof parsed.url === "string") {
        return { type: "url", value: parsed.url, raw };
      }
      if (parsed.type === "text" && typeof parsed.text === "string") {
        return { type: "text", value: parsed.text, title: typeof parsed.title === "string" ? parsed.title : "", raw };
      }
    }
  } catch (e) {}
  return { type: "text", value: raw, title: "", raw };
}

function renderInlineMarkdown(text) {
  return String(text || "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function renderBasicMarkdown(text) {
  const lines = String(text || "").split(/\r?\n/);
  const html = [];
  let inList = false;

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = escapeHtmlServer(rawLine);
    const trimmed = rawLine.trim();

    if (!trimmed) {
      closeList();
      html.push('<div style="height:10px"></div>');
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      closeList();
      html.push('<h3>' + renderInlineMarkdown(escapeHtmlServer(trimmed.replace(/^###\s+/, ""))) + '</h3>');
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      closeList();
      html.push('<h2>' + renderInlineMarkdown(escapeHtmlServer(trimmed.replace(/^##\s+/, ""))) + '</h2>');
      continue;
    }
    if (/^#\s+/.test(trimmed)) {
      closeList();
      html.push('<h1>' + renderInlineMarkdown(escapeHtmlServer(trimmed.replace(/^#\s+/, ""))) + '</h1>');
      continue;
    }
    if (/^-\s+/.test(trimmed)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push('<li>' + renderInlineMarkdown(escapeHtmlServer(trimmed.replace(/^-\s+/, ""))) + '</li>');
      continue;
    }

    closeList();
    html.push('<p>' + renderInlineMarkdown(line) + '</p>');
  }

  closeList();
  return html.join("\n");
}

// ==================== 1. 后台管理页面模板 ====================
const htmlLogin = `<!DOCTYPE html>
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

const htmlAdmin = `<!DOCTYPE html>
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
        const type = item.type === 'text' ? '文本' : '链接';
        const content = String(item.value || '');
        const preview = escapeHtml(content.length > 120 ? content.slice(0, 120) + '…' : content);
        const created = formatTime(Number(item.createdAt));

        html += '<tr>'
          + '<td data-label="后缀"><strong>/' + name + '</strong></td>'
          + '<td data-label="类型">' + type + '</td>'
          + '<td data-label="内容">'
          +   (item.type === 'text'
                ? (preview ? '<span>' + preview.replaceAll('\n', '<br>') + '</span>' : '<span style="color: var(--text-muted);">（空）</span>')
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

// ==================== 2. 首页模板 (生成页) ====================
const htmlIndex = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>短链接生成</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    :root {
      --bg-color: #f3f4f6;
      --bg-gradient: radial-gradient(circle at top left, #e0f2fe 0, #f3f4f6 35%, #e5e7eb 100%);
      --card-bg: rgba(255, 255, 255, 0.82);
      --card-border: rgba(148, 163, 184, 0.45);
      --card-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
      --radius-xl: 24px;
      --radius-lg: 18px;
      --radius-md: 12px;

      --text-main: #0f172a;
      --text-sub: #6b7280;
      --text-muted: #9ca3af;

      --primary: #2563eb;
      --primary-soft: rgba(37, 99, 235, 0.12);
      --primary-border: rgba(37, 99, 235, 0.4);

      --accent: #22c55e;
      --accent-soft: rgba(34, 197, 94, 0.12);

      --input-bg: rgba(255, 255, 255, 0.98);
      --input-border: rgba(148, 163, 184, 0.7);
      --input-focus-ring: rgba(59, 130, 246, 0.55);
      --textarea-min-height: 180px;

      --button-primary-from: #2563eb;
      --button-primary-to: #4f46e5;
      --button-primary-shadow: 0 14px 30px rgba(37, 99, 235, 0.35);

      --button-accent-from: #16a34a;
      --button-accent-to: #22c55e;
      --button-accent-shadow: 0 12px 26px rgba(34, 197, 94, 0.32);

      --result-bg: rgba(248, 250, 252, 0.92);
      --result-border: rgba(148, 163, 184, 0.4);
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

        --result-bg: rgba(15, 23, 42, 0.96);
        --result-border: rgba(55, 65, 81, 0.9);
      }
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
      background: var(--bg-gradient), var(--bg-color);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 100%;
      max-width: 520px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-left: 4px;
      user-select: none;
    }

    .brand-dot {
      width: 9px;
      height: 9px;
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

    .shell {
      position: relative;
    }

    .shell::before {
      content: "";
      position: absolute;
      inset: -80px;
      background:
        radial-gradient(circle at 10% 0, rgba(59,130,246,0.16) 0, transparent 55%),
        radial-gradient(circle at 120% 120%, rgba(129,140,248,0.18) 0, transparent 55%);
      opacity: 0.9;
      pointer-events: none;
      z-index: -1;
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius-xl);
      border: 1px solid var(--card-border);
      box-shadow: var(--card-shadow);
      padding: 26px 22px 22px;
      backdrop-filter: blur(20px) saturate(140%);
      -webkit-backdrop-filter: blur(20px) saturate(140%);
    }

    @media (min-width: 640px) {
      .card {
        padding: 30px 28px 26px;
      }
    }

    .card-header {
      margin-bottom: 18px;
    }

    .title-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }

    h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 650;
      letter-spacing: 0.03em;
    }

    .badge {
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 999px;
      background: var(--primary-soft);
      color: #1d4ed8;
      border: 1px solid rgba(129, 140, 248, 0.35);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      white-space: nowrap;
    }

    .subtitle {
      margin: 6px 0 0;
      font-size: 13px;
      color: var(--text-sub);
    }

    .form {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-sub);
    }

    input[type="url"],
    input[type="text"],
    textarea {
      width: 100%;
      padding: 11px 12px;
      font-size: 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--input-border);
      background: var(--input-bg);
      color: var(--text-main);
      outline: none;
      transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease, transform 0.06s ease;
      font-family: inherit;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--text-muted);
    }

    input:focus,
    textarea:focus {
      border-color: var(--primary);
      box-shadow:
        0 0 0 1px var(--primary-border),
        0 0 0 6px var(--input-focus-ring);
      transform: translateY(-0.5px);
    }

    textarea {
      min-height: var(--textarea-min-height);
      resize: vertical;
      line-height: 1.6;
    }

    .inline-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .inline-row > .field { flex: 1; min-width: 0; }

    .mode-switch {
      display: flex;
      gap: 10px;
      padding: 4px;
      border-radius: 14px;
      background: rgba(255,255,255,0.45);
      border: 1px solid rgba(148,163,184,0.25);
    }

    .mode-btn {
      flex: 1;
      border: none;
      border-radius: 10px;
      padding: 10px 12px;
      cursor: pointer;
      background: transparent;
      color: var(--text-sub);
      font-size: 14px;
      font-weight: 600;
    }

    .mode-btn.active {
      color: #fff;
      background-image: linear-gradient(90deg, #2563eb, #4f46e5);
      box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
    }

    .primary-btn {
      margin-top: 6px;
      width: 100%;
      padding: 13px 14px;
      border-radius: var(--radius-lg);
      border: none;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-align: center;
      color: #ffffff;
      background-image: linear-gradient(90deg, var(--button-primary-from), var(--button-primary-to));
      box-shadow: var(--button-primary-shadow);
      transform: translateY(0);
      transition:
        box-shadow 0.18s ease,
        transform 0.18s ease,
        filter 0.18s ease,
        opacity 0.18s ease;
    }

    .primary-btn:hover {
      transform: translateY(-1px);
      filter: brightness(1.04);
      box-shadow: 0 18px 38px rgba(37, 99, 235, 0.45);
    }

    .primary-btn:active {
      transform: translateY(0);
      box-shadow: 0 10px 24px rgba(30, 64, 175, 0.6);
      filter: brightness(0.97);
    }

    .primary-btn:disabled {
      cursor: default;
      opacity: 0.65;
      box-shadow: none;
      filter: grayscale(0.1);
    }

    .result {
      margin-top: 18px;
      padding: 14px 12px 12px;
      border-radius: var(--radius-lg);
      background: var(--result-bg);
      border: 1px solid var(--result-border);
      display: none;
    }

    .result-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .result-link {
      font-weight: 650;
      font-size: 14px;
      color: var(--primary);
      word-break: break-all;
      margin-bottom: 10px;
    }

    .copy-btn {
      width: 100%;
      padding: 10px 12px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 550;
      color: #ffffff;
      background-image: linear-gradient(90deg, var(--button-accent-from), var(--button-accent-to));
      box-shadow: var(--button-accent-shadow);
      transition: box-shadow 0.18s ease, transform 0.18s ease, filter 0.18s ease;
    }

    .copy-btn:hover {
      transform: translateY(-0.5px);
      filter: brightness(1.03);
      box-shadow: 0 16px 34px rgba(34, 197, 94, 0.45);
    }

    .copy-btn:active {
      transform: translateY(0);
      box-shadow: 0 10px 22px rgba(22, 163, 74, 0.65);
      filter: brightness(0.98);
    }

    .footnote {
      margin-top: 12px;
      font-size: 11px;
      color: var(--text-muted);
      text-align: center;
      user-select: none;
    }

    @media (max-width: 480px) {
      .card { border-radius: 20px; }
      h1 { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="brand">
      <div class="brand-dot"></div>
      <span class="brand-title">SHORT URL SERVICE</span>
    </header>

    <main class="shell">
      <section class="card">
        <div class="card-header">
          <div class="title-row">
            <h1>短链接生成</h1>
            <span class="badge">LIQUID GLASS UI</span>
          </div>
          <p class="subtitle">
          无需登陆，适用于分享、重定向和日常使用。为了防止域名屏蔽
          <a href="https://sink.lily.lat/link-fb" target="_blank" rel="noopener noreferrer">点击获取新域名</a>
        </p>
        </div>

        <div class="form">
          <div class="field">
            <label>内容类型</label>
            <div class="mode-switch">
              <button id="modeUrlBtn" class="mode-btn active" type="button" onclick="setMode('url')">链接</button>
              <button id="modeTextBtn" class="mode-btn" type="button" onclick="setMode('text')">文本</button>
            </div>
          </div>

          <div class="field" id="urlField">
            <label for="u">长链接</label>
            <input
              type="url"
              id="u"
              placeholder="例如：https://example.com/v1/2026/long-url...."
              autocomplete="off"
            />
          </div>

          <div class="field" id="textField" style="display:none;">
            <label for="tt">文本页标题（可选）</label>
            <input
              type="text"
              id="tt"
              placeholder="例如：临时公告 / 使用说明 / 今日笔记"
              autocomplete="off"
            />
            <label for="t">文本内容</label>
            <textarea
              id="t"
              placeholder="支持基础 Markdown：标题、列表、粗体、斜体、行内代码、链接。"
            ></textarea>
          </div>

          <div class="inline-row">
            <div class="field">
              <label for="k">自定义后缀（可选）</label>
              <input
                type="text"
                id="k"
                placeholder="例如：good 或者 worker-2026"
                autocomplete="off"
              />
            </div>
          </div>

          <button id="btn" class="primary-btn" onclick="s()">立即生成</button>
        </div>

        <div id="res" class="result">
          <div class="result-label">SHARE LINK</div>
          <div id="link" class="result-link"></div>
          <button class="copy-btn" onclick="cp(this)">点击复制</button>
        </div>
      </section>

      <footer class="footnote">
        通过 Cloudflare 驱动 · 基于 KV 持久化存储 · 后缀链接永久有效
      </footer>
    </main>
  </div>

  <script>
    let mode = 'url';

    function setMode(nextMode) {
      mode = nextMode === 'text' ? 'text' : 'url';
      const urlField = document.getElementById('urlField');
      const textField = document.getElementById('textField');
      const urlBtn = document.getElementById('modeUrlBtn');
      const textBtn = document.getElementById('modeTextBtn');
      if (urlField) urlField.style.display = mode === 'url' ? 'block' : 'none';
      if (textField) textField.style.display = mode === 'text' ? 'block' : 'none';
      if (urlBtn) urlBtn.classList.toggle('active', mode === 'url');
      if (textBtn) textBtn.classList.toggle('active', mode === 'text');
    }

    async function s() {
      const u = document.getElementById('u').value.trim();
      const t = document.getElementById('t').value.trim();
      const tt = document.getElementById('tt').value.trim();
      const k = document.getElementById('k').value.trim();

      if (mode === 'url') {
        if (!u || !u.startsWith('http')) {
          alert('请输入以 http 或 https 开头的完整链接。');
          return;
        }
      } else if (!t) {
        alert('请输入要分享的文本内容。');
        return;
      }

      const btn = document.getElementById('btn');
      if (btn) btn.disabled = true;

      try {
        const res = await fetch('/', {
          method: 'POST',
          body: JSON.stringify({ type: mode, url: u, text: t, title: tt, key: k })
        });
        const d = await res.json();

        if (d.key) {
          const full = window.location.origin + d.key;
          const linkEl = document.getElementById('link');
          const resBox = document.getElementById('res');
          if (linkEl) linkEl.textContent = full;
          if (resBox) resBox.style.display = 'block';
        } else {
          alert('错误：' + (d.error || '生成失败'));
        }
      } catch (e) {
        alert('请求失败，请稍后重试。');
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    function cp(b) {
      const text = document.getElementById('link').textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        const old = b.innerText;
        b.innerText = '已复制';
        setTimeout(function () {
          b.innerText = old;
        }, 2000);
      });
    }
  </script>
</body>
</html>`;

// ==================== 3. 后端核心逻辑 ====================
// 说明：
// - KV 命名空间绑定为 LINKS
async function sha512(url) {
  const url_digest = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(url)
  );
  return Array.from(new Uint8Array(url_digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function parseCookieHeader(cookieHeader) {
  const out = {};
  for (const part of String(cookieHeader || '').split(/;\s*/)) {
    if (!part) continue;
    const idx = part.indexOf('=');
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

async function createAdminSessionToken(adminPass) {
  return sha512('cflink-admin-session|' + String(adminPass || ''));
}

function buildSessionCookie(token) {
  return [
    'cflink_admin_session=' + token,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
    'Max-Age=2592000'
  ].join('; ');
}

function buildLogoutCookie() {
  return [
    'cflink_admin_session=',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
    'Max-Age=0'
  ].join('; ');
}

// ==================== 3.1 管理后台列表缓存 & 创建时间辅助 ====================
// 说明：
// - 创建时间存储在短链接 key 的 KV metadata 中：{ createdAt: epochMs }
// - 历史数据可能没有 metadata，则 createdAt 视为 0（1970）
const ADMIN_LIST_CACHE_TTL_MS = 4000;
const __adminListCache = {
  at: 0,
  /** @type {null | Array<{name: string, createdAt: number}>} */
  items: null,
};

function invalidateAdminListCache() {
  __adminListCache.at = 0;
  __adminListCache.items = null;
}

function readCreatedAt(meta) {
  if (!meta || typeof meta !== "object") return 0;
  const v = meta.createdAt;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function buildAdminIndex() {
  const out = [];
  let cursor = undefined;
  while (true) {
    const list = await LINKS.list({ cursor, limit: 1000 });
    for (const k of list.keys) {
      // 过滤：哈希索引（sha512=128位） + 旧的系统配置 key
      if (k.name.length !== 128 && !k.name.startsWith("SYS_CONFIG_")) {
        out.push({ name: k.name, createdAt: readCreatedAt(k.metadata) });
      }
    }
    if (list.list_complete || !list.cursor) break;
    cursor = list.cursor;
  }
  return out;
}

async function getAdminIndexCached() {
  const now = Date.now();
  if (__adminListCache.items && (now - __adminListCache.at) < ADMIN_LIST_CACHE_TTL_MS) {
    // 返回副本，避免排序时把缓存数组原地改掉
    return __adminListCache.items.slice();
  }
  const items = await buildAdminIndex();
  __adminListCache.items = items;
  __adminListCache.at = now;
  return items.slice();
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const path = decodeURIComponent(pathname.split("/")[1]);

  function normalizeAdminPath(p) {
    let v = (typeof p === "string" ? p : "").trim();
    if (!v) v = "/admin";
    if (!v.startsWith("/")) v = "/" + v;
    while (v.length > 1 && v.endsWith("/")) v = v.slice(0, -1);
    if (v === "/") v = "/admin";
    return v;
  }

  function isTruthyEnv(v) {
    if (typeof v !== "string") return false;
    const s = v.trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes" || s === "y" || s === "on";
  }


  function splitEnvList(raw) {
    return String(raw || "")
      .split(/\r?\n|,/)
      .map((l) => String(l || "").split("#")[0].trim())
      .filter((l) => l.length > 0);
  }

  function normalizeHostRule(rule) {
    let r = String(rule || "").trim().toLowerCase();
    if (!r) return "";
    // 支持写成 https://example.com 或 example.com/path
    r = r.replace(/^https?:\/\//, "");
    r = r.split("/")[0];
    r = r.split(":")[0];
    r = r.replace(/^\*\./, "").replace(/^\./, "");
    return r;
  }

  function buildDomainRules(raw) {
    const out = [];
    for (const line of splitEnvList(raw)) {
      const r = normalizeHostRule(line);
      if (r) out.push(r);
    }
    return out;
  }

  function isHostBlocked(host, rules) {
    const h = String(host || "").toLowerCase().replace(/\.$/, "");
    if (!h) return false;
    for (const r of rules) {
      if (!r) continue;
      if (h === r) return true;
      if (h.endsWith("." + r)) return true;
    }
    return false;
  }

  function normalizeSuffixRule(rule) {
    let r = String(rule || "").trim();
    if (!r) return "";
    while (r.startsWith("/")) r = r.slice(1);
    return r.toLowerCase();
  }

  function buildSuffixSet(raw) {
    const set = new Set();
    for (const line of splitEnvList(raw)) {
      const r = normalizeSuffixRule(line);
      if (r) set.add(r);
    }
    return set;
  }

  function isSuffixBlocked(key, set) {
    const k = normalizeSuffixRule(key);
    return k ? set.has(k) : false;
  }

  // ==================== 环境变量配置 ====================
  // 1) 后台入口路径：ADMIN_PATH（文本），例如：/a8f3k2p9
  const adminBase = normalizeAdminPath(typeof ADMIN_PATH === "string" ? ADMIN_PATH : "");
  const adminApiBase = adminBase + "/api";
  // 2) 后台密码：ADMIN_PASS（文本）
  const adminPass = (typeof ADMIN_PASS === "string" && ADMIN_PASS.trim())
    ? ADMIN_PASS.trim()
    : DEFAULT_ADMIN_PASS;
  const cookies = parseCookieHeader(request.headers.get('Cookie'));
  const expectedSessionToken = await createAdminSessionToken(adminPass);
  const isAdminAuthed = cookies.cflink_admin_session === expectedSessionToken;
  // 3) 长链接域名黑名单（环境变量，多行 / 逗号分隔均可）：LONG_DOMAIN_BLACKLIST
  //    - 例如：epochtimes.com  将拦截 epochtimes.com 以及所有子域名（www.epochtimes.com 等）
  //    - 例如：xxx.epochtimes.com 将拦截该子域名及其更深层子域名
  // 4) 自定义后缀黑名单（环境变量，多行 / 逗号分隔均可）：SUFFIX_BLACKLIST
  //    - 例如：xjp
  //            hjt
  const rawDomainBlacklist =
    (typeof LONG_DOMAIN_BLACKLIST === "string" ? LONG_DOMAIN_BLACKLIST : "") ||
    (typeof DOMAIN_BLACKLIST === "string" ? DOMAIN_BLACKLIST : "") ||
    (typeof LONG_URL_DOMAIN_BLACKLIST === "string" ? LONG_URL_DOMAIN_BLACKLIST : "");

  const rawSuffixBlacklist =
    (typeof SUFFIX_BLACKLIST === "string" ? SUFFIX_BLACKLIST : "") ||
    (typeof SHORT_SUFFIX_BLACKLIST === "string" ? SHORT_SUFFIX_BLACKLIST : "") ||
    (typeof SHORT_LINK_SUFFIX_BLACKLIST === "string" ? SHORT_LINK_SUFFIX_BLACKLIST : "");

  const domainBlacklist = buildDomainRules(rawDomainBlacklist);
  const suffixBlacklist = buildSuffixSet(rawSuffixBlacklist);

  const htmlHeaders = {
    "content-type": "text/html;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "cache-control": "no-store",
  };

  const jsonHeaders = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "cache-control": "no-store",
  };

  // 后台登录
  if (pathname === adminBase + "/login" && request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const password = typeof body?.password === 'string' ? body.password : '';
    if (password !== adminPass) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: jsonHeaders });
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        ...jsonHeaders,
        'set-cookie': buildSessionCookie(expectedSessionToken),
      },
    });
  }

  if (pathname === adminBase + "/logout" && request.method === "POST") {
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        ...jsonHeaders,
        'set-cookie': buildLogoutCookie(),
      },
    });
  }

  // 后台页面（路径由环境变量控制）
  if (pathname === adminBase || pathname === adminBase + "/") {
    return new Response(isAdminAuthed ? htmlAdmin : htmlLogin, { headers: htmlHeaders });
  }

  // 后台：获取短链接列表（分页 + 排序 + 显示长链接 + 创建时间）
  // GET {adminApiBase}/all?page=1&size=10&sort=name|time
  if (pathname === adminApiBase + "/all") {
    if (!isAdminAuthed) {
      return new Response("Unauthorized", { status: 401 });
    }

    const pageRaw = Number(url.searchParams.get("page") || "1");
    const sizeRaw = Number(url.searchParams.get("size") || "10");
    const sortRaw = String(url.searchParams.get("sort") || "name").toLowerCase();
    const qRaw0 = String(url.searchParams.get("q") || "").trim();
    const qRaw = qRaw0.replace(/^\/+/, "");
    const q = qRaw.toLowerCase();

    const size = Math.min(10, Math.max(1, Math.floor(Number.isFinite(sizeRaw) ? sizeRaw : 10)));
    const sort = sortRaw === "time" ? "time" : "name";

    // 读取索引（带 createdAt）
    const index = await getAdminIndexCached();

    // ====== 搜索模式：匹配后缀或长链接（全量检索，但做并发以加速）======
    if (q) {
      const matched = [];
      const missingKeys = [];

      // 并发拉取 value 来做搜索（KV 无法直接按 value 查询）
      let ptr = 0;
      const concurrency = Math.min(30, Math.max(1, index.length));

      async function worker() {
        while (true) {
          const i = ptr++;
          if (i >= index.length) break;

          const it = index[i];
          const raw = await LINKS.get(it.name);
          if (typeof raw !== "string" || !raw.length) {
            missingKeys.push(it.name);
            continue;
          }

          const parsed = parseStoredValue(raw);
          const content = String(parsed?.value || "");
          const nameMatch = it.name.toLowerCase().includes(q);
          const valMatch = content.toLowerCase().includes(q);
          if (nameMatch || valMatch) {
            matched.push({ name: it.name, value: content, type: parsed?.type || 'url', createdAt: it.createdAt || 0 });
          }
        }
      }

      await Promise.all(new Array(concurrency).fill(0).map(() => worker()));

      if (missingKeys.length) {
        await Promise.all(missingKeys.map((k) => LINKS.delete(k)));
        invalidateAdminListCache();
      }

      if (sort === "time") {
        matched.sort((a, b) => {
          const dt = (b.createdAt || 0) - (a.createdAt || 0);
          if (dt !== 0) return dt;
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
        });
      } else {
        matched.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
      }

      const total = matched.length;
      const totalPages = Math.max(1, Math.ceil(total / size));
      const page = Math.min(totalPages, Math.max(1, Math.floor(Number.isFinite(pageRaw) ? pageRaw : 1)));

      const start = (page - 1) * size;
      const pageItems = matched.slice(start, start + size);

      const links = pageItems.map((it) => ({ name: it.name, value: it.value, type: it.type || 'url', createdAt: it.createdAt || 0 }));

      return new Response(
        JSON.stringify({ page, size, sort, q: qRaw, total, totalPages, links }),
        { headers: jsonHeaders }
      );
    }

    // ====== 非搜索模式：分页取值（每页最多 10 条，避免全量 KV.get 导致缓慢）======
    if (sort === "time") {
      // 新 → 旧；同时间按 name 稳定排序
      index.sort((a, b) => {
        const dt = (b.createdAt || 0) - (a.createdAt || 0);
        if (dt !== 0) return dt;
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
      });
    } else {
      // A → Z，支持数字排序（a2 < a10）
      index.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
    }

    const total = index.length;
    const totalPages = Math.max(1, Math.ceil(total / size));
    const page = Math.min(totalPages, Math.max(1, Math.floor(Number.isFinite(pageRaw) ? pageRaw : 1)));

    const start = (page - 1) * size;
    const pageItems = index.slice(start, start + size);

    const values = await Promise.all(pageItems.map((it) => LINKS.get(it.name)));

    const links = [];
    const missingKeys = [];
    for (let i = 0; i < pageItems.length; i++) {
      const it = pageItems[i];
      const raw = values[i];
      if (typeof raw === "string" && raw.length) {
        const parsed = parseStoredValue(raw);
        links.push({
          name: it.name,
          value: String(parsed?.value || ""),
          type: parsed?.type || 'url',
          createdAt: it.createdAt || 0,
        });
      } else {
        missingKeys.push(it.name);
      }
    }

    if (missingKeys.length) {
      await Promise.all(missingKeys.map((k) => LINKS.delete(k)));
      invalidateAdminListCache();
    }

    return new Response(
      JSON.stringify({ page, size, sort, total, totalPages, links }),
      { headers: jsonHeaders }
    );
  }

  // 后台：删除指定后缀短链（包括哈希索引）
  if (pathname.startsWith(adminApiBase + "/delete/")) {
    if (!isAdminAuthed) {
      return new Response("Unauthorized", { status: 401 });
    }

    const prefix = adminApiBase + "/delete/";
    const keyDel = decodeURIComponent(pathname.slice(prefix.length) || "");
    if (!keyDel) return new Response("Bad Request", { status: 400 });

    const rawValue = await LINKS.get(keyDel);
    const parsedValue = parseStoredValue(rawValue);
    if (parsedValue?.type === 'url' && parsedValue.value) {
      const hash = await sha512(parsedValue.value);
      await Promise.all([LINKS.delete(hash), LINKS.delete(keyDel)]);
    } else {
      await LINKS.delete(keyDel);
    }

    // 刷新后台列表缓存
    invalidateAdminListCache();

    return new Response("OK", { headers: { "cache-control": "no-store" } });
  }

  // 生成短链 / 文本页（全部永久）
  if (request.method === "POST") {
    const req = await request.json();

    const ERR_SUFFIX_TAKEN = "该后缀已被占用";
    const ERR_DOMAIN_BLOCKED = "此长链接域名无法使用";
    const type = req?.type === "text" ? "text" : "url";
    const reqUrl = typeof req.url === "string" ? req.url.trim() : "";
    const reqText = typeof req.text === "string" ? req.text.trim() : "";
    const reqTitle = typeof req.title === "string" ? req.title.trim() : "";

    if (type === "url" && !reqUrl) {
      return new Response(JSON.stringify({ error: "链接不能为空" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (type === "text" && !reqText) {
      return new Response(JSON.stringify({ error: "文本内容不能为空" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    let urlObj;
    if (type === "url") {
      try {
        urlObj = new URL(reqUrl);
      } catch (e) {
        return new Response(JSON.stringify({ error: "链接格式错误" }), {
          status: 400,
          headers: jsonHeaders,
        });
      }

      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        return new Response(JSON.stringify({ error: "仅支持 http/https 链接" }), {
          status: 400,
          headers: jsonHeaders,
        });
      }

      const host = String(urlObj.hostname || "").toLowerCase();
      if (domainBlacklist.length && isHostBlocked(host, domainBlacklist)) {
        return new Response(JSON.stringify({ error: ERR_DOMAIN_BLOCKED }), {
          status: 403,
          headers: jsonHeaders,
        });
      }
    }

    const customKey = typeof req.key === "string" ? req.key.trim() : "";
    if (customKey && isSuffixBlocked(customKey, suffixBlacklist)) {
      return new Response(JSON.stringify({ error: ERR_SUFFIX_TAKEN }), {
        status: 409,
        headers: jsonHeaders,
      });
    }

    if (customKey && (await LINKS.get(customKey))) {
      return new Response(JSON.stringify({ error: ERR_SUFFIX_TAKEN }), {
        status: 409,
        headers: jsonHeaders,
      });
    }

    let key = customKey || Math.random().toString(36).substring(2, 8);
    if (!customKey && suffixBlacklist.size) {
      let guard = 0;
      while (isSuffixBlocked(key, suffixBlacklist) && guard < 200) {
        key = Math.random().toString(36).substring(2, 8);
        guard++;
      }
      if (isSuffixBlocked(key, suffixBlacklist)) {
        return new Response(JSON.stringify({ error: "生成失败，请稍后重试" }), {
          status: 500,
          headers: jsonHeaders,
        });
      }
    }

    if (type === "url") {
      const hash = await sha512(reqUrl);
      const existKey = await LINKS.get(hash);

      if (!customKey && existKey && !isSuffixBlocked(existKey, suffixBlacklist)) {
        key = existKey;
      } else {
        await LINKS.put(key, encodeStoredValue({ type: "url", url: reqUrl }), { metadata: { createdAt: Date.now() } });
        if (!customKey) await LINKS.put(hash, key);
        invalidateAdminListCache();
      }
    } else {
      await LINKS.put(key, encodeStoredValue({ type: "text", title: reqTitle, text: reqText }), { metadata: { createdAt: Date.now() } });
      invalidateAdminListCache();
    }

    return new Response(JSON.stringify({ key: "/" + key, type }), {
      headers: jsonHeaders,
    });
  }

  // 首页 or 重定向
  if (!path) return new Response(htmlIndex, { headers: htmlHeaders });

  // 访问黑名单后缀：统一跳转 403 页面
  if (isSuffixBlocked(path, suffixBlacklist)) {
    return Response.redirect("https://403.lily.lat/" + url.search, 302);
  }

  const targetRaw = await LINKS.get(path);
  const target = parseStoredValue(targetRaw);
  if (target?.type === 'url' && target.value) {
    return Response.redirect(target.value + url.search, 302);
  }
  if (target?.type === 'text') {
    return new Response(renderTextPage(target.value, path, target.title), { headers: htmlHeaders });
  }

  // 未创建的后缀：跳转到统一 404 页面
  return Response.redirect("https://404.lily.lat/" + url.search, 302);
}

addEventListener("fetch", (e) => e.respondWith(handleRequest(e.request)));

