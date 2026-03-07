import { htmlLogin, htmlAdmin } from "./pages/admin.js";
import { htmlIndex } from "./pages/home.js";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
// ==================== 基础配置 ====================
// 后台密码优先使用环境变量 ADMIN_PASS；若未配置则回退到默认占位值
const DEFAULT_ADMIN_PASS = "change-this-password";
marked.use(markedHighlight({
  emptyLangClass: 'hljs',
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));

function renderMathInHtml(input) {
  return String(input || '');
}

function extractMathPlaceholders(text) {
  const math = [];
  let content = String(text || '');

  function push(expr, displayMode) {
    const id = math.length;
    math.push({ expr: String(expr || '').trim(), displayMode });
    return displayMode ? '\n\n@@MATH_BLOCK_' + id + '@@\n\n' : '@@MATH_INLINE_' + id + '@@';
  }

  content = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => push(expr, true));
  content = content.replace(/\\\[([\s\S]+?)\\\]/g, (_, expr) => push(expr, true));
  content = content.replace(/(^|\n)((?:\\begin\{[^}]+\}[\s\S]+?\\end\{[^}]+\}))(?:\n|$)/g, (_, prefix, expr) => (prefix || '') + push(expr, true));
  content = content.replace(/\\\((.+?)\\\)/g, (_, expr) => push(expr, false));
  return { content, math };
}

function restoreMathPlaceholders(html, math) {
  let out = String(html || '');
  out = out.replace(/<p>@@MATH_BLOCK_(\d+)@@<\/p>/g, (_, id) => {
    const item = math[Number(id)];
    if (!item) return '';
    return '<div class="math-block">\\[' + escapeHtmlServer(item.expr) + '\\]</div>';
  });
  out = out.replace(/@@MATH_BLOCK_(\d+)@@/g, (_, id) => {
    const item = math[Number(id)];
    if (!item) return '';
    return '<div class="math-block">\\[' + escapeHtmlServer(item.expr) + '\\]</div>';
  });
  out = out.replace(/@@MATH_INLINE_(\d+)@@/g, (_, id) => {
    const item = math[Number(id)];
    if (!item) return '';
    return '<span class="math-inline">\\(' + escapeHtmlServer(item.expr) + '\\)</span>';
  });
  return out;
}
function extractFootnotes(text) {
  const lines = String(text || '').split(/\r?\n/);
  const defs = new Map();
  const kept = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\[\^([^\]\n]+)\]:(?:\s*)(.*)$/);
    if (!match) {
      kept.push(line);
      continue;
    }
    const label = match[1];
    let body = match[2] || '';
    while (i + 1 < lines.length && (/^( {2,}|\t)/.test(lines[i + 1]) || lines[i + 1] === '')) {
      i++;
      body += '\n' + lines[i].replace(/^( {2,}|\t)/, '');
    }
    defs.set(label, body.trim());
  }

  return { content: kept.join('\n'), defs };
}

function replaceBlockMathWithPlaceholders(text) {
  const blocks = [];
  let content = String(text || '');

  function pushBlock(expr) {
    const id = blocks.length;
    blocks.push('<div class="math-block" data-math-block="' + id + '">\\[' + escapeHtmlServer(String(expr || '').trim()) + '\\]</div>');
    return '\n\n@@BLOCK_MATH_' + id + '@@\n\n';
  }

  content = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => pushBlock(expr));
  content = content.replace(/\\\[([\s\S]+?)\\\]/g, (_, expr) => pushBlock(expr));
  content = content.replace(/(^|\n)((?:\\begin\{[^}]+\}[\s\S]+?\\end\{[^}]+\}))(?:\n|$)/g, (_, prefix, expr) => (prefix || '') + pushBlock(expr));
  return { content, blocks };
}

function sanitizeRenderedHtml(html) {
  let out = String(html || '');
  out = out.replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  out = out.replace(/<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '');
  out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  out = out.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '');
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*javascript:[^"']*(\2)/gi, '');
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*data:text\/html[^"']*(\2)/gi, '');
  return out;
}

function enhanceRenderedHtml(html) {
  return String(html || '').replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (_, attrs, codeHtml) => {
    const plain = codeHtml
      .replace(/<span[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    const encoded = encodeURIComponent(plain);
    return '<div class="code-block"><div class="code-toolbar"><span>代码块</span><button class="code-copy-btn" type="button" data-code="' + encoded + '">复制代码</button></div><pre><code' + attrs + '>' + codeHtml + '</code></pre></div>';
  });
}

function renderFootnotesSection(defs) {
  if (!defs.size) return '';
  const items = [];
  for (const [label, raw] of defs.entries()) {
    const { content, math } = extractMathPlaceholders(raw);
    const rendered = restoreMathPlaceholders(
      enhanceRenderedHtml(sanitizeRenderedHtml(marked.parse(String(content || ''), { gfm: true, breaks: true }))),
      math
    );
    items.push('<li id="fn-' + encodeURIComponent(label) + '">' + rendered + ' <a class="footnote-backref" href="#fnref-' + encodeURIComponent(label) + '">↩</a></li>');
  }
  return '<section class="footnotes"><hr><ol>' + items.join('') + '</ol></section>';
}

function renderRichMarkdown(text) {
  const { content: withoutDefs, defs } = extractFootnotes(text);
  const { content: withMathPlaceholders, math } = extractMathPlaceholders(withoutDefs);
  const source = String(withMathPlaceholders || '').replace(/\[\^([^\]\n]+)\]/g, (_, label) => '<sup><a id="fnref-' + encodeURIComponent(label) + '" href="#fn-' + encodeURIComponent(label) + '">[' + label + ']</a></sup>');
  const rawHtml = marked.parse(source, {
    gfm: true,
    breaks: true,
  });
  const safeHtml = sanitizeRenderedHtml(rawHtml);
  const enhanced = enhanceRenderedHtml(safeHtml);
  return restoreMathPlaceholders(enhanced, math) + renderFootnotesSection(defs);
}

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
  const renderedContent = renderRichMarkdown(content);
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
    .content ul,.content ol { margin: 0 0 12px 20px; padding: 0; }
    .content li { margin: 0 0 8px; }
    .content img { max-width: 100%; height: auto; border-radius: 14px; display: block; margin: 0 0 14px; }
    .content video,.content audio { width: 100%; margin: 0 0 14px; }
    .content del { color: var(--sub); }
    .content code { padding: 2px 6px; border-radius: 8px; background: rgba(148,163,184,0.18); font-family: ui-monospace, SFMono-Regular, monospace; font-size: .92em; }
    .content .math-block { overflow-x: auto; overflow-y: hidden; padding: 6px 0; margin: 0 0 14px; }
    .content .math-inline { display: inline-block; vertical-align: middle; max-width: 100%; }
    .content mjx-container { max-width: 100%; overflow-x: auto; overflow-y: hidden; }
    .content .code-block { margin: 0 0 14px; border-radius: 14px; overflow: hidden; background: rgba(15,23,42,0.96); color: #e5e7eb; }
    .content .code-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #94a3b8; }
    .content .code-copy-btn { border:none; border-radius: 10px; padding: 7px 10px; cursor:pointer; font-size: 12px; font-weight: 700; color: #fff; background: linear-gradient(90deg,#2563eb,#4f46e5); }
    .content pre { margin: 0; padding: 14px; overflow:auto; background: transparent; color: #e5e7eb; }
    .content pre code { padding: 0; background: transparent; color: inherit; }
    .content blockquote { margin: 0 0 14px; padding: 2px 0 2px 14px; border-left: 4px solid rgba(37,99,235,0.4); color: var(--sub); }
    .content hr { border: none; border-top: 1px solid rgba(148,163,184,0.35); margin: 18px 0; }
    .content .table-wrap { overflow-x: auto; margin: 0 0 14px; }
    .content table { width: 100%; border-collapse: collapse; min-width: 420px; }
    .content th,.content td { padding: 10px 12px; border: 1px solid rgba(148,163,184,0.28); text-align: left; vertical-align: top; }
    .content th { background: rgba(148,163,184,0.12); font-weight: 700; }
    .content .md-space { height: 8px; }
    .content .task-list { list-style: none; margin-left: 0; }
    .content .task-item { display:flex; align-items:flex-start; gap:10px; }
    .content .task-item input { margin-top: 4px; }
    .content .footnotes { margin-top: 24px; padding-top: 14px; border-top: 1px solid rgba(148,163,184,0.35); color: var(--sub); font-size: 14px; }
    .content .footnotes ol { margin-top: 10px; }
    .content .footnote-backref { text-decoration: none; margin-left: 6px; }
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
    window.MathJax = {
      tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']]
      },
      svg: { fontCache: 'global' }
    };

    async function copyCode(btn) {
      try {
        const code = decodeURIComponent(btn.dataset.code || "");
        await navigator.clipboard.writeText(code);
        const old = btn.textContent;
        btn.textContent = "已复制";
        setTimeout(() => { btn.textContent = old; }, 1800);
      } catch (e) {
        alert("复制代码失败，请手动复制。");
      }
    }

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (target && target.classList && target.classList.contains("code-copy-btn")) {
        copyCode(target);
      }
    });

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
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
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
      if (parsed.type === "file" && typeof parsed.objectKey === "string") {
        return {
          type: "file",
          value: typeof parsed.filename === "string" ? parsed.filename : parsed.objectKey,
          title: typeof parsed.title === "string" ? parsed.title : "",
          objectKey: parsed.objectKey,
          filename: typeof parsed.filename === "string" ? parsed.filename : parsed.objectKey,
          contentType: typeof parsed.contentType === "string" ? parsed.contentType : "application/octet-stream",
          size: Number.isFinite(Number(parsed.size)) ? Number(parsed.size) : 0,
          raw,
        };
      }
    }
  } catch (e) {}
  return { type: "text", value: raw, title: "", raw };
}

function isPreviewableContentType(contentType) {
  const t = String(contentType || '').toLowerCase();
  return t.startsWith('image/') || t.startsWith('text/') || t === 'application/pdf' || t.startsWith('audio/') || t.startsWith('video/');
}

function formatBytes(size) {
  const value = Number(size) || 0;
  if (value < 1024) return value + ' B';
  if (value < 1024 * 1024) return (value / 1024).toFixed(1) + ' KB';
  if (value < 1024 * 1024 * 1024) return (value / (1024 * 1024)).toFixed(1) + ' MB';
  return (value / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

function renderFilePage(file, key) {
  const safeKey = escapeHtmlServer(key || '');
  const safeTitle = escapeHtmlServer(file?.title || file?.filename || '文件分享');
  const safeFilename = escapeHtmlServer(file?.filename || 'download');
  const safeType = escapeHtmlServer(file?.contentType || 'application/octet-stream');
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
  <div class="wrap"><article class="card"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#64748b;">FILE SHARE</div><h1 style="margin:10px 0 8px;">${safeTitle}</h1><p class="meta">链接标识：/${safeKey || '-'}<br>文件名：${safeFilename}<br>MIME：${safeType}<br>大小：${escapeHtmlServer(formatBytes(file?.size || 0))}</p><div class="actions"><a class="btn" href="${previewUrl}" target="_blank" rel="noopener noreferrer">打开原文件</a><a class="btn secondary" href="${downloadUrl}">下载文件</a></div>${preview}</article></div>
</body>
</html>`;
}

// ==================== 1. 后台管理页面模板 ====================




// ==================== 2. 首页模板 (生成页) ====================


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

  // 后台：获取分享内容列表（稳妥模式：全量读取 -> 解析 -> 搜索 -> 排序 -> 分页）
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

    const index = await buildAdminIndex();
    const items = [];
    const missingKeys = [];

    for (const it of index) {
      const raw = await LINKS.get(it.name);
      if (typeof raw !== "string" || !raw.length) {
        missingKeys.push(it.name);
        continue;
      }
      const parsed = parseStoredValue(raw);
      const value = String(parsed?.value || "");
      const title = String(parsed?.title || "");
      const haystack = (it.name + "\n" + value + "\n" + title).toLowerCase();
      if (q && !haystack.includes(q)) continue;
      items.push({
        name: it.name,
        value,
        title,
        type: parsed?.type || 'url',
        filename: parsed?.filename || '',
        contentType: parsed?.contentType || '',
        size: parsed?.size || 0,
        createdAt: it.createdAt || 0,
      });
    }

    if (missingKeys.length) {
      await Promise.all(missingKeys.map((k) => LINKS.delete(k)));
      invalidateAdminListCache();
    }

    if (sort === "time") {
      items.sort((a, b) => {
        const dt = (b.createdAt || 0) - (a.createdAt || 0);
        if (dt !== 0) return dt;
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
      });
    } else {
      items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / size));
    const page = Math.min(totalPages, Math.max(1, Math.floor(Number.isFinite(pageRaw) ? pageRaw : 1)));
    const start = (page - 1) * size;
    const links = items.slice(start, start + size);

    return new Response(
      JSON.stringify({ page, size, sort, q: qRaw, total, totalPages, links }),
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
    } else if (parsedValue?.type === 'file' && parsedValue.objectKey) {
      await Promise.all([FILES.delete(parsedValue.objectKey), LINKS.delete(keyDel)]);
    } else {
      await LINKS.delete(keyDel);
    }

    // 刷新后台列表缓存
    invalidateAdminListCache();

    return new Response("OK", { headers: { "cache-control": "no-store" } });
  }

  // 生成短链 / 文本页 / 文件分享（全部永久）
  if (request.method === "POST") {
    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    const req = isMultipart ? null : await request.json();
    const form = isMultipart ? await request.formData() : null;

    const ERR_SUFFIX_TAKEN = "该后缀已被占用";
    const ERR_DOMAIN_BLOCKED = "此长链接域名无法使用";
    const type = isMultipart ? String(form?.get('type') || 'file').trim() : (req?.type === "text" ? "text" : "url");
    const reqUrl = typeof req?.url === "string" ? req.url.trim() : "";
    const reqText = typeof req?.text === "string" ? req.text.trim() : "";
    const reqTitle = isMultipart ? String(form?.get('title') || '').trim() : (typeof req?.title === "string" ? req.title.trim() : "");

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

    const uploadFile = isMultipart ? form?.get('file') : null;
    if (type === "file" && !(uploadFile instanceof File)) {
      return new Response(JSON.stringify({ error: "请选择要上传的文件" }), {
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

    const customKey = isMultipart ? String(form?.get('key') || '').trim() : (typeof req.key === "string" ? req.key.trim() : "");
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
    } else if (type === "text") {
      await LINKS.put(key, encodeStoredValue({ type: "text", title: reqTitle, text: reqText }), { metadata: { createdAt: Date.now() } });
      invalidateAdminListCache();
    } else {
      const file = uploadFile;
      const fileExt = file.name && file.name.includes('.') ? '.' + file.name.split('.').pop() : '';
      const objectKey = 'uploads/' + Date.now() + '-' + Math.random().toString(36).slice(2, 10) + fileExt;
      await FILES.put(objectKey, await file.arrayBuffer(), {
        httpMetadata: {
          contentType: file.type || 'application/octet-stream',
          contentDisposition: 'inline; filename="' + encodeURIComponent(file.name || 'download') + '"',
        },
      });
      await LINKS.put(key, encodeStoredValue({
        type: 'file',
        title: reqTitle,
        objectKey,
        filename: file.name || 'download',
        contentType: file.type || 'application/octet-stream',
        size: file.size || 0,
      }), { metadata: { createdAt: Date.now() } });
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

  const fileMatch = pathname.match(/^\/([^/]+)\/(raw|download)$/);
  if (fileMatch) {
    const shareKey = decodeURIComponent(fileMatch[1] || '');
    const action = fileMatch[2];
    const raw = await LINKS.get(shareKey);
    const parsed = parseStoredValue(raw);
    if (parsed?.type === 'file' && parsed.objectKey) {
      const obj = await FILES.get(parsed.objectKey);
      if (!obj) {
        return Response.redirect("https://404.lily.lat/" + url.search, 302);
      }
      const headers = new Headers();
      obj.writeHttpMetadata(headers);
      headers.set('etag', obj.httpEtag);
      headers.set('cache-control', 'public, max-age=3600');
      headers.set('content-type', parsed.contentType || obj.httpMetadata?.contentType || 'application/octet-stream');
      headers.set('content-disposition', (action === 'download' ? 'attachment' : 'inline') + '; filename*=UTF-8\'\'' + encodeURIComponent(parsed.filename || 'download'));
      return new Response(obj.body, { headers });
    }
  }

  const targetRaw = await LINKS.get(path);
  const target = parseStoredValue(targetRaw);
  if (target?.type === 'url' && target.value) {
    return Response.redirect(target.value + url.search, 302);
  }
  if (target?.type === 'text') {
    return new Response(renderTextPage(target.value, path, target.title), { headers: htmlHeaders });
  }
  if (target?.type === 'file') {
    return new Response(renderFilePage(target, path), { headers: htmlHeaders });
  }

  // 未创建的后缀：跳转到统一 404 页面
  return Response.redirect("https://404.lily.lat/" + url.search, 302);
}

addEventListener("fetch", (e) => e.respondWith(handleRequest(e.request)));

