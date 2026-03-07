import { renderRichMarkdown } from "../renderers/markdown.js";

function escapeHtmlLocal(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderTextPage(content, key, title) {
  const safeKey = escapeHtmlLocal(key || "");
  const safeTitle = escapeHtmlLocal(title || "");
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
      svg: { fontCache: 'global' },
      startup: { typeset: false }
    };

    let __mathRendered = false;

    async function renderMath() {
      if (__mathRendered) return;
      if (!window.MathJax || !window.MathJax.tex2svgPromise) return false;
      const nodes = document.querySelectorAll('[data-expr]');
      for (const node of nodes) {
        const expr = decodeURIComponent(node.getAttribute('data-expr') || '');
        const display = node.hasAttribute('data-math-display');
        try {
          const rendered = await window.MathJax.tex2svgPromise(expr, { display });
          const svg = rendered.querySelector('svg');
          if (svg) node.replaceChildren(svg);
        } catch (e) {
          node.textContent = expr;
        }
      }
      __mathRendered = true;
      return true;
    }

    async function waitAndRenderMath() {
      for (let i = 0; i < 80; i++) {
        if (await renderMath()) return;
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }

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

    window.addEventListener('load', () => {
      waitAndRenderMath();
    });

    if (document.readyState === 'complete') {
      waitAndRenderMath();
    }
  </script>
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
</body>
</html>`;
}
