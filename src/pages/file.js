function escapeHtmlLocal(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBytesLocal(size) {
  const value = Number(size) || 0;
  if (value < 1024) return value + ' B';
  if (value < 1024 * 1024) return (value / 1024).toFixed(1) + ' KB';
  if (value < 1024 * 1024 * 1024) return (value / (1024 * 1024)).toFixed(1) + ' MB';
  return (value / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

export function renderFilePage(file, key) {
  const safeKey = escapeHtmlLocal(key || '');
  const safeTitle = escapeHtmlLocal(file?.title || file?.filename || '文件分享');
  const safeFilename = escapeHtmlLocal(file?.filename || 'download');
  const safeType = escapeHtmlLocal(file?.contentType || 'application/octet-stream');
  const previewUrl = '/' + encodeURIComponent(key || '') + '/raw';
  const downloadUrl = '/' + encodeURIComponent(key || '') + '/download';
  const lowerType = String(file?.contentType || '').toLowerCase();

  let preview = '<div class="empty">该文件类型暂不支持在线预览，请直接下载。</div>';
  if (lowerType.startsWith('image/')) {
    preview = '<img class="preview-image" src="' + previewUrl + '" alt="' + safeFilename + '">';
  } else if (lowerType === 'application/pdf') {
    preview = '<iframe class="preview-frame" src="' + previewUrl + '"></iframe>';
  } else if (lowerType.startsWith('audio/')) {
    preview = '<audio controls class="preview-audio" src="' + previewUrl + '"></audio>';
  } else if (lowerType.startsWith('video/')) {
    preview = '<video controls class="preview-video" src="' + previewUrl + '"></video>';
  } else if (lowerType.startsWith('text/')) {
    preview = '<iframe class="preview-frame" src="' + previewUrl + '"></iframe>';
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <title>${safeTitle}</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #edf4ff;
      --bg-2: #f8fbff;
      --surface: rgba(255,255,255,0.86);
      --surface-strong: rgba(255,255,255,0.94);
      --border: rgba(148,163,184,0.24);
      --text: #0f172a;
      --sub: #475569;
      --muted: #64748b;
      --primary: #2563eb;
      --primary-2: #4f46e5;
      --shadow-lg: 0 24px 60px rgba(15,23,42,0.10);
      --shadow-md: 0 14px 32px rgba(15,23,42,0.08);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #020617;
        --bg-2: #0b1120;
        --surface: rgba(15,23,42,0.86);
        --surface-strong: rgba(15,23,42,0.94);
        --border: rgba(71,85,105,0.34);
        --text: #e2e8f0;
        --sub: #cbd5e1;
        --muted: #94a3b8;
        --shadow-lg: 0 28px 72px rgba(2,6,23,0.48);
        --shadow-md: 0 18px 36px rgba(2,6,23,0.38);
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
    }
    .wrap { max-width: 960px; margin: 0 auto; }
    .topbar {
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      margin-bottom:12px; padding:4px 2px;
    }
    .brand { display:flex; align-items:center; gap:10px; }
    .brand-mark {
      width:36px; height:36px; border-radius:12px; position:relative; overflow:hidden; flex:0 0 auto;
      background:linear-gradient(135deg,#2563eb,#4f46e5); box-shadow:0 14px 26px rgba(37,99,235,.22);
      display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:900; letter-spacing:-.06em;
    }
    .brand-mark::before {
      content:"CF"; position:relative; z-index:1;
    }
    .brand-mark::after {
      content:""; position:absolute; inset:1px; border-radius:11px;
      background:linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,.03)); mix-blend-mode:screen; pointer-events:none;
    }
    .brand-name { font-size:17px; font-weight:800; letter-spacing:-.03em; }
    .brand-sub { color:var(--muted); font-size:12px; margin-top:2px; }
    .top-actions { display:flex; gap:8px; flex-wrap:wrap; }
    .btn {
      min-height:40px; padding:0 14px; border-radius:12px; border:none; cursor:pointer;
      font-size:13px; font-weight:800; text-decoration:none;
      display:inline-flex; align-items:center; justify-content:center;
    }
    .btn-primary { color:#fff; background:linear-gradient(90deg,var(--primary),var(--primary-2)); box-shadow:0 12px 24px rgba(37,99,235,.20); }
    .btn-ghost { color:var(--text); background:rgba(148,163,184,.08); border:1px solid var(--border); }
    .panel {
      border:1px solid var(--border); background:var(--surface); border-radius:24px; box-shadow:var(--shadow-lg);
      backdrop-filter:blur(18px) saturate(145%); -webkit-backdrop-filter:blur(18px) saturate(145%); padding:16px;
    }
    .eyebrow {
      display:inline-flex; padding:6px 10px; border-radius:999px; margin-bottom:10px;
      border:1px solid rgba(37,99,235,.16); background:rgba(37,99,235,.10); color:var(--primary);
      font-size:10px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
    }
    h1 { margin:0 0 6px; font-size:clamp(24px,6vw,34px); letter-spacing:-.05em; }
    .meta { margin:0; color:var(--sub); font-size:13px; line-height:1.75; }
    .preview {
      margin-top:14px; padding:14px; border-radius:16px; border:1px solid var(--border); background:var(--surface-strong);
      box-shadow: var(--shadow-md);
    }
    .preview-image,.preview-video { width:100%; border-radius:14px; display:block; background:#000; }
    .preview-audio { width:100%; }
    .preview-frame { width:100%; height:72vh; border:none; border-radius:14px; background:#fff; }
    .empty { color:var(--sub); font-size:14px; line-height:1.7; }
    @media (max-width: 640px) {
      .top-actions { width:100%; }
      .top-actions .btn { flex:1; }
      .preview-frame { height:60vh; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark"></div>
        <div>
          <div class="brand-name">CFLink</div>
          <div class="brand-sub">文件分享</div>
        </div>
      </div>
      <div class="top-actions">
        <a class="btn btn-ghost" href="/">回到首页</a>
        <a class="btn btn-primary" href="${previewUrl}" target="_blank" rel="noopener noreferrer">打开原文件</a>
        <a class="btn btn-primary" href="${downloadUrl}">下载文件</a>
      </div>
    </header>

    <article class="panel">
      <div class="eyebrow">File Share</div>
      <h1>${safeTitle}</h1>
      <p class="meta">链接标识：/${safeKey || '-'}<br>文件名：${safeFilename}<br>MIME：${safeType}<br>大小：${escapeHtmlLocal(formatBytesLocal(file?.size || 0))}</p>
      <div class="preview">${preview}</div>
    </article>
  </div>
</body>
</html>`;
}
