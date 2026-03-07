export const htmlIndex = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CFLink 分享中心</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    :root {
      color-scheme: light dark;
      --bg: #eef4ff;
      --bg-2: #f8fafc;
      --card: rgba(255,255,255,0.86);
      --card-border: rgba(148,163,184,0.32);
      --text: #0f172a;
      --sub: #64748b;
      --muted: #94a3b8;
      --primary: #2563eb;
      --primary-2: #4f46e5;
      --accent: #16a34a;
      --danger: #dc2626;
      --shadow: 0 18px 45px rgba(15,23,42,0.10);
      --radius-xl: 24px;
      --radius-lg: 18px;
      --radius-md: 14px;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #020617;
        --bg-2: #0f172a;
        --card: rgba(15,23,42,0.84);
        --card-border: rgba(71,85,105,0.55);
        --text: #e5e7eb;
        --sub: #94a3b8;
        --muted: #64748b;
        --shadow: 0 22px 60px rgba(2,6,23,0.55);
      }
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 28%),
        radial-gradient(circle at bottom right, rgba(79,70,229,0.12), transparent 26%),
        linear-gradient(180deg, var(--bg), var(--bg-2));
      padding: 16px;
      -webkit-font-smoothing: antialiased;
    }

    .wrap {
      max-width: 1040px;
      margin: 0 auto;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      padding-left: 4px;
      user-select: none;
    }

    .brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 30%, #38bdf8 0, #2563eb 38%, #4f46e5 100%);
      box-shadow: 0 0 20px rgba(56,189,248,0.7);
    }

    .brand-title {
      font-size: 13px;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      align-items: start;
    }

    .panel {
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px) saturate(140%);
      -webkit-backdrop-filter: blur(18px) saturate(140%);
      padding: 18px;
    }

    .hero-card {
      padding: 20px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--primary);
      background: rgba(37,99,235,0.10);
      border: 1px solid rgba(37,99,235,0.18);
      border-radius: 999px;
      padding: 6px 10px;
    }

    h1 {
      margin: 12px 0 8px;
      font-size: 28px;
      line-height: 1.18;
      letter-spacing: -0.02em;
    }

    .subtitle {
      margin: 0;
      color: var(--sub);
      font-size: 14px;
      line-height: 1.7;
    }

    .tips {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 16px;
    }

    .tip {
      padding: 12px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.45);
      border: 1px solid rgba(148,163,184,0.18);
    }

    .tip strong {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
    }

    .tip span {
      color: var(--sub);
      font-size: 12px;
      line-height: 1.55;
    }

    .form-card {
      padding: 18px;
    }

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .section-head h2 {
      margin: 0;
      font-size: 18px;
    }

    .section-head span {
      font-size: 12px;
      color: var(--sub);
    }

    .mode-switch {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 6px;
      border-radius: 16px;
      background: rgba(255,255,255,0.55);
      border: 1px solid rgba(148,163,184,0.20);
      margin-bottom: 14px;
    }

    .mode-btn {
      border: none;
      border-radius: 12px;
      padding: 11px 10px;
      cursor: pointer;
      background: transparent;
      color: var(--sub);
      font-size: 14px;
      font-weight: 700;
    }

    .mode-btn.active {
      color: #fff;
      background: linear-gradient(90deg, var(--primary), var(--primary-2));
      box-shadow: 0 10px 22px rgba(37,99,235,0.22);
    }

    .form {
      display: grid;
      gap: 14px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .field {
      display: grid;
      gap: 6px;
    }

    label {
      font-size: 12px;
      font-weight: 600;
      color: var(--sub);
    }

    input[type="url"],
    input[type="text"],
    input[type="file"],
    textarea {
      width: 100%;
      border: 1px solid rgba(148,163,184,0.45);
      background: rgba(255,255,255,0.92);
      color: var(--text);
      border-radius: var(--radius-md);
      padding: 12px 13px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
      transition: .16s border-color ease, .16s box-shadow ease, .16s transform ease;
    }

    textarea {
      min-height: 180px;
      resize: vertical;
      line-height: 1.65;
    }

    input:focus,
    textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59,130,246,0.15);
      transform: translateY(-0.5px);
    }

    .hint {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.55;
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 2px;
    }

    .primary-btn,
    .copy-btn {
      border: none;
      cursor: pointer;
      border-radius: 14px;
      padding: 13px 16px;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .primary-btn {
      flex: 1;
      min-width: 160px;
      background: linear-gradient(90deg, var(--primary), var(--primary-2));
      box-shadow: 0 14px 30px rgba(37,99,235,0.25);
    }

    .copy-btn {
      width: 100%;
      background: linear-gradient(90deg, #16a34a, #22c55e);
      box-shadow: 0 12px 26px rgba(34,197,94,0.24);
    }

    .primary-btn:disabled,
    .copy-btn:disabled {
      opacity: .65;
      cursor: default;
      box-shadow: none;
    }

    .result {
      display: none;
      margin-top: 16px;
      padding: 14px;
      border-radius: 18px;
      background: rgba(248,250,252,0.9);
      border: 1px solid rgba(148,163,184,0.28);
    }

    .result-label {
      font-size: 11px;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }

    .result-link {
      font-size: 14px;
      line-height: 1.7;
      word-break: break-all;
      color: var(--primary);
      font-weight: 700;
      margin-bottom: 10px;
    }

    .footnote {
      margin-top: 14px;
      text-align: center;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.6;
    }

    @media (min-width: 860px) {
      body { padding: 24px; }
      .hero {
        grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
      }
      .hero-card, .form-card { padding: 24px; }
      .grid-2 { grid-template-columns: 1fr 1fr; }
      h1 { font-size: 34px; }
    }

    @media (max-width: 640px) {
      body { padding: 12px; }
      .panel { border-radius: 20px; }
      .hero-card, .form-card { padding: 16px; }
      h1 { font-size: 24px; }
      .tips { grid-template-columns: 1fr; }
      .mode-switch { gap: 6px; padding: 5px; }
      .mode-btn { font-size: 13px; padding: 10px 8px; }
      .section-head { align-items: start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="brand">
      <div class="brand-dot"></div>
      <div class="brand-title">CFLink Share Center</div>
    </header>

    <main class="hero">
      <section class="panel hero-card">
        <div class="eyebrow">Cloudflare Workers + KV + R2</div>
        <h1>一个链接，分享文字、跳转地址或文件</h1>
        <p class="subtitle">手机端操作要顺手，电脑端排版也要清楚。这一版把入口、模式切换和表单层级都收紧了，减少空白和视觉噪音，专注“选类型 → 填内容 → 生成链接”。</p>
        <div class="tips">
          <div class="tip">
            <strong>链接模式</strong>
            <span>输入长链接，生成短链跳转。</span>
          </div>
          <div class="tip">
            <strong>文本模式</strong>
            <span>支持标题、复制内容和基础 Markdown。</span>
          </div>
          <div class="tip">
            <strong>文件模式</strong>
            <span>上传到 R2，支持预览与下载。</span>
          </div>
        </div>
      </section>

      <section class="panel form-card">
        <div class="section-head">
          <h2>创建分享</h2>
          <span>支持自定义后缀</span>
        </div>

        <div class="mode-switch">
          <button id="modeUrlBtn" class="mode-btn active" type="button" onclick="setMode('url')">链接</button>
          <button id="modeTextBtn" class="mode-btn" type="button" onclick="setMode('text')">文本</button>
          <button id="modeFileBtn" class="mode-btn" type="button" onclick="setMode('file')">文件</button>
        </div>

        <div class="form">
          <div class="field" id="urlField">
            <label for="u">长链接</label>
            <input type="url" id="u" placeholder="例如：https://example.com/article/2026/hello" autocomplete="off" />
            <div class="hint">输入完整的 http 或 https 地址。</div>
          </div>

          <div id="textField" style="display:none;">
            <div class="field">
              <label for="tt">文本页标题（可选）</label>
              <input type="text" id="tt" placeholder="例如：临时公告 / 使用说明 / 今日笔记" autocomplete="off" />
            </div>
            <div class="field" style="margin-top:12px;">
              <label for="t">文本内容</label>
              <textarea id="t" placeholder="支持基础 Markdown：标题、列表、粗体、斜体、行内代码、链接。"></textarea>
            </div>
          </div>

          <div id="fileField" style="display:none;">
            <div class="field">
              <label for="ft">文件标题（可选）</label>
              <input type="text" id="ft" placeholder="例如：安装包 / 海报 / 使用文档" autocomplete="off" />
            </div>
            <div class="field" style="margin-top:12px;">
              <label for="f">选择文件</label>
              <input type="file" id="f" />
              <div class="hint">图片、PDF、文本、音视频更适合在线预览，其他格式也可下载分享。</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label for="k">自定义后缀（可选）</label>
              <input type="text" id="k" placeholder="例如：good / notes-2026 / setup" autocomplete="off" />
            </div>
            <div class="field">
              <label>当前模式说明</label>
              <div class="hint" id="modeHint">生成一个跳转到目标地址的短链。</div>
            </div>
          </div>

          <div class="actions">
            <button id="btn" class="primary-btn" onclick="s()">立即生成</button>
          </div>
        </div>

        <div id="res" class="result">
          <div class="result-label">Share Link</div>
          <div id="link" class="result-link"></div>
          <button class="copy-btn" onclick="cp(this)">复制链接</button>
        </div>
      </section>
    </main>

    <footer class="footnote">
      基于 Cloudflare Workers、KV 与 R2 持久化存储 · 统一分享入口 · 手机与桌面端响应式适配
    </footer>
  </div>

  <script>
    let mode = 'url';

    function setMode(nextMode) {
      mode = nextMode === 'file' ? 'file' : (nextMode === 'text' ? 'text' : 'url');
      const urlField = document.getElementById('urlField');
      const textField = document.getElementById('textField');
      const fileField = document.getElementById('fileField');
      const modeHint = document.getElementById('modeHint');
      const urlBtn = document.getElementById('modeUrlBtn');
      const textBtn = document.getElementById('modeTextBtn');
      const fileBtn = document.getElementById('modeFileBtn');
      if (urlField) urlField.style.display = mode === 'url' ? 'block' : 'none';
      if (textField) textField.style.display = mode === 'text' ? 'block' : 'none';
      if (fileField) fileField.style.display = mode === 'file' ? 'block' : 'none';
      if (modeHint) {
        modeHint.textContent = mode === 'url'
          ? '生成一个跳转到目标地址的短链。'
          : mode === 'text'
            ? '生成一个可直接展示文本内容的分享页。'
            : '上传文件到 R2，并生成可预览、可下载的分享链接。';
      }
      if (urlBtn) urlBtn.classList.toggle('active', mode === 'url');
      if (textBtn) textBtn.classList.toggle('active', mode === 'text');
      if (fileBtn) fileBtn.classList.toggle('active', mode === 'file');
    }

    async function s() {
      const u = document.getElementById('u').value.trim();
      const t = document.getElementById('t').value.trim();
      const tt = document.getElementById('tt').value.trim();
      const ft = document.getElementById('ft').value.trim();
      const file = document.getElementById('f').files[0];
      const k = document.getElementById('k').value.trim();

      if (mode === 'url') {
        if (!u || !u.startsWith('http')) {
          alert('请输入以 http 或 https 开头的完整链接。');
          return;
        }
      } else if (mode === 'text') {
        if (!t) {
          alert('请输入要分享的文本内容。');
          return;
        }
      } else if (!file) {
        alert('请选择要上传的文件。');
        return;
      }

      const btn = document.getElementById('btn');
      if (btn) btn.disabled = true;

      try {
        const body = mode === 'file'
          ? (() => {
              const form = new FormData();
              form.set('type', mode);
              form.set('title', ft);
              form.set('key', k);
              form.set('file', file);
              return form;
            })()
          : JSON.stringify({ type: mode, url: u, text: t, title: tt, key: k });

        const res = await fetch('/', {
          method: 'POST',
          body
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

    function cp(button) {
      const text = document.getElementById('link').textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        const old = button.innerText;
        button.innerText = '已复制';
        setTimeout(function () {
          button.innerText = old;
        }, 1800);
      });
    }
  </script>
</body>
</html>`;
