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
  <link rel="icon" href="/favicon.ico" sizes="any">
  <title>${safeTitle || (safeKey ? safeKey + " - 文本页" : "文本页")}</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #edf4ff;
      --bg-2: #f8fbff;
      --surface: rgba(255,255,255,0.86);
      --surface-strong: rgba(255,255,255,0.94);
      --border: rgba(148,163,184,0.24);
      --border-strong: rgba(148,163,184,0.34);
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
        --border-strong: rgba(100,116,139,0.48);
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
    .wrap { max-width: 860px; margin: 0 auto; }
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
    .top-actions { display:flex; gap:8px; }
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
    .hero { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
    .eyebrow {
      display:inline-flex; padding:6px 10px; border-radius:999px; margin-bottom:10px;
      border:1px solid rgba(37,99,235,.16); background:rgba(37,99,235,.10); color:var(--primary);
      font-size:10px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
    }
    h1 { margin:0 0 6px; font-size:clamp(24px,6vw,34px); letter-spacing:-.05em; }
    .meta { margin:0; color:var(--sub); font-size:13px; line-height:1.7; }
    .content {
      margin-top:14px; padding:14px; border-radius:16px; border:1px solid var(--border);
      background:var(--surface-strong); line-height:1.78; font-size:16px; word-break:break-word;
    }
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
    .content table { width: 100%; border-collapse: collapse; min-width: 420px; }
    .content th,.content td { padding: 10px 12px; border: 1px solid rgba(148,163,184,0.28); text-align: left; vertical-align: top; }
    .content th { background: rgba(148,163,184,0.12); font-weight: 700; }
    .content .footnotes { margin-top: 24px; padding-top: 14px; border-top: 1px solid rgba(148,163,184,0.35); color: var(--sub); font-size: 14px; }
    .content .footnotes ol { margin-top: 10px; }
    .content .footnote-backref { text-decoration: none; margin-left: 6px; }
    .content a { color: #2563eb; }
    @media (max-width: 640px) {
      .top-actions { width:100%; }
      .top-actions .btn { flex:1; }
      .hero { flex-direction:column; }
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
          <div class="brand-sub">文本分享</div>
        </div>
      </div>
      <div class="top-actions">
        <a class="btn btn-ghost" href="/">回到首页</a>
        <button class="btn btn-primary" type="button" onclick="copyContent(this)">复制内容</button>
      </div>
    </header>

    <article class="panel">
      <div class="hero">
        <div>
          <div class="eyebrow">Text Share</div>
          <h1>${safeTitle || "文本内容"}</h1>
          <p class="meta">链接标识：/${safeKey || "-"}</p>
        </div>
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
      svg: { fontCache: 'local' },
      startup: { typeset: false }
    };

    const MATHJAX_SOURCES = [
      'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js',
      'https://unpkg.com/mathjax@3/es5/tex-svg.js',
      'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js'
    ];

    let __mathRendered = false;
    let __mathLoadPromise = null;

    async function renderMath() {
      if (__mathRendered) return true;
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

    async function loadMathJax() {
      if (window.MathJax && window.MathJax.tex2svgPromise) return true;
      if (__mathLoadPromise) return __mathLoadPromise;
      __mathLoadPromise = (async () => {
        for (const src of MATHJAX_SOURCES) {
          const ok = await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => { script.remove(); resolve(false); };
            document.head.appendChild(script);
          });
          if (!ok) continue;
          for (let i = 0; i < 100; i++) {
            if (window.MathJax && window.MathJax.tex2svgPromise) return true;
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        return false;
      })();
      return __mathLoadPromise;
    }

    async function ensureMathRendered() {
      const loaded = await loadMathJax();
      if (!loaded) return false;
      return renderMath();
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

    window.addEventListener('load', () => { ensureMathRendered(); });
    if (document.readyState === 'complete' || document.readyState === 'interactive') ensureMathRendered();
  </script>
</body>
</html>`;
}
