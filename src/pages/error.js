function escapeHtmlLocal(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderErrorPage({ status = 404, title = '', description = '', primaryHref = '/', primaryText = '返回首页', secondaryHref = 'javascript:history.back()', secondaryText = '返回上一页' } = {}) {
  const safeStatus = escapeHtmlLocal(String(status || '404'));
  const safeTitle = escapeHtmlLocal(title || (safeStatus === '403' ? '访问受限' : '内容不存在'));
  const safeDesc = escapeHtmlLocal(description || (safeStatus === '403' ? '这个链接当前不可访问，可能已被限制或保留。' : '这个链接不存在，或对应内容已经失效。'));
  const safePrimaryHref = escapeHtmlLocal(primaryHref || '/');
  const safePrimaryText = escapeHtmlLocal(primaryText || '返回首页');
  const safeSecondaryHref = escapeHtmlLocal(secondaryHref || 'javascript:history.back()');
  const safeSecondaryText = escapeHtmlLocal(secondaryText || '返回上一页');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <title>${safeStatus} · ${safeTitle}</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #edf4ff;
      --bg-2: #f8fbff;
      --surface: rgba(255,255,255,0.88);
      --border: rgba(148,163,184,0.24);
      --text: #0f172a;
      --sub: #475569;
      --muted: #64748b;
      --primary: #2563eb;
      --primary-2: #4f46e5;
      --shadow: 0 24px 60px rgba(15,23,42,0.10);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #020617;
        --bg-2: #0b1120;
        --surface: rgba(15,23,42,0.88);
        --border: rgba(71,85,105,0.34);
        --text: #e2e8f0;
        --sub: #cbd5e1;
        --muted: #94a3b8;
        --shadow: 0 28px 72px rgba(2,6,23,0.48);
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      padding: 12px;
      background:
        radial-gradient(circle at 0% 0%, rgba(59,130,246,0.18), transparent 28%),
        radial-gradient(circle at 100% 10%, rgba(79,70,229,0.14), transparent 24%),
        linear-gradient(180deg, var(--bg), var(--bg-2));
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wrap { width: 100%; max-width: 760px; }
    .card {
      border:1px solid var(--border); background:var(--surface); border-radius:28px; box-shadow:var(--shadow);
      backdrop-filter:blur(18px) saturate(145%); -webkit-backdrop-filter:blur(18px) saturate(145%); padding:22px;
    }
    .brand { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
    .brand-mark {
      width:36px; height:36px; border-radius:12px; position:relative; overflow:hidden; flex:0 0 auto;
      background:linear-gradient(135deg,#2563eb,#4f46e5); box-shadow:0 14px 26px rgba(37,99,235,.22);
      display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:900; letter-spacing:-.06em;
    }
    .brand-mark::before { content:"CF"; position:relative; z-index:1; }
    .brand-mark::after {
      content:""; position:absolute; inset:1px; border-radius:11px;
      background:linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,.03)); mix-blend-mode:screen;
    }
    .brand-name { font-size:17px; font-weight:800; letter-spacing:-.03em; }
    .brand-sub { color:var(--muted); font-size:12px; margin-top:2px; }
    .status { font-size: clamp(52px, 12vw, 92px); font-weight: 900; letter-spacing: -.08em; line-height: .95; margin: 6px 0 10px; }
    h1 { margin:0 0 10px; font-size: clamp(24px, 5vw, 36px); letter-spacing:-.05em; }
    p { margin:0; color:var(--sub); font-size:15px; line-height:1.8; max-width: 44ch; }
    .actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:18px; }
    .btn {
      min-height:42px; padding:0 15px; border-radius:12px; text-decoration:none; font-size:13px; font-weight:800;
      display:inline-flex; align-items:center; justify-content:center;
    }
    .btn-primary { color:#fff; background:linear-gradient(90deg,var(--primary),var(--primary-2)); box-shadow:0 12px 24px rgba(37,99,235,.20); }
    .btn-ghost { color:var(--text); background:rgba(148,163,184,.08); border:1px solid var(--border); }
  </style>
</head>
<body>
  <div class="wrap">
    <article class="card">
      <div class="brand"><div class="brand-mark"></div><div><div class="brand-name">CFLink</div><div class="brand-sub">Error Page</div></div></div>
      <div class="status">${safeStatus}</div>
      <h1>${safeTitle}</h1>
      <p>${safeDesc}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${safePrimaryHref}">${safePrimaryText}</a>
        <a class="btn btn-ghost" href="${safeSecondaryHref}">${safeSecondaryText}</a>
      </div>
    </article>
  </div>
</body>
</html>`;
}
