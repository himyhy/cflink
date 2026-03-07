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
  let preview = '<p style="color:#64748b;">该文件类型暂不支持在线预览，请直接下载。</p>';
  if (String(file?.contentType || '').toLowerCase().startsWith('image/')) {
    preview = '<img src="' + previewUrl + '" alt="' + safeFilename + '" style="max-width:100%;border-radius:16px;display:block;">';
  } else if (String(file?.contentType || '').toLowerCase() === 'application/pdf') {
    preview = '<iframe src="' + previewUrl + '" style="width:100%;height:72vh;border:none;border-radius:16px;background:#fff;"></iframe>';
  } else if (String(file?.contentType || '').toLowerCase().startsWith('audio/')) {
    preview = '<audio controls style="width:100%;" src="' + previewUrl + '"></audio>';
  } else if (String(file?.contentType || '').toLowerCase().startsWith('video/')) {
    preview = '<video controls style="width:100%;border-radius:16px;background:#000;" src="' + previewUrl + '"></video>';
  } else if (String(file?.contentType || '').toLowerCase().startsWith('text/')) {
    preview = '<iframe src="' + previewUrl + '" style="width:100%;height:72vh;border:none;border-radius:16px;background:#fff;"></iframe>';
  }
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    body{margin:0;padding:24px 16px;background:#f3f4f6;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif}
    .wrap{max-width:960px;margin:0 auto}.card{background:#fff;border:1px solid rgba(148,163,184,.35);border-radius:24px;padding:24px 20px;box-shadow:0 18px 40px rgba(15,23,42,.08)}
    .meta{color:#64748b;font-size:14px;line-height:1.7}.actions{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.btn{display:inline-block;padding:10px 14px;border-radius:12px;text-decoration:none;color:#fff;background:linear-gradient(90deg,#2563eb,#4f46e5)}
    .btn.secondary{background:linear-gradient(90deg,#16a34a,#22c55e)}
  </style>
</head>
<body>
  <div class="wrap"><article class="card"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#64748b;">FILE SHARE</div><h1 style="margin:10px 0 8px;">${safeTitle}</h1><p class="meta">链接标识：/${safeKey || '-'}<br>文件名：${safeFilename}<br>MIME：${safeType}<br>大小：${escapeHtmlLocal(formatBytesLocal(file?.size || 0))}</p><div class="actions"><a class="btn" href="${previewUrl}" target="_blank" rel="noopener noreferrer">打开原文件</a><a class="btn secondary" href="${downloadUrl}">下载文件</a></div>${preview}</article></div>
</body>
</html>`;
}
