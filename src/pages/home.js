export const htmlIndex = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CFLink</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <style>
    :root {
      color-scheme: light dark;
      --bg: #edf4ff;
      --bg-2: #f8fbff;
      --surface: rgba(255,255,255,0.82);
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
      --shadow-lg: 0 28px 70px rgba(15,23,42,0.14);
      --shadow-md: 0 18px 40px rgba(15,23,42,0.10);
      --radius-2xl: 28px;
      --radius-xl: 22px;
      --radius-lg: 18px;
      --radius-md: 14px;
      --max: 1180px;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #020617;
        --bg-2: #0b1120;
        --surface: rgba(15,23,42,0.76);
        --surface-strong: rgba(15,23,42,0.92);
        --surface-soft: rgba(30,41,59,0.58);
        --border: rgba(71,85,105,0.38);
        --border-strong: rgba(100,116,139,0.48);
        --text: #e2e8f0;
        --sub: #cbd5e1;
        --muted: #94a3b8;
        --shadow-lg: 0 34px 80px rgba(2,6,23,0.55);
        --shadow-md: 0 18px 42px rgba(2,6,23,0.42);
      }

      .input,
      .textarea,
      .file-shell {
        background-color: rgba(15,23,42,0.96) !important;
        background: rgba(15,23,42,0.96) !important;
        color: var(--text) !important;
        caret-color: var(--text);
        border-color: rgba(100,116,139,0.54);
        color-scheme: dark;
        -webkit-text-fill-color: var(--text) !important;
      }

      .chip {
        background: rgba(15,23,42,0.62) !important;
        border-color: rgba(100,116,139,0.34) !important;
        color: rgba(226,232,240,0.96) !important;
      }

      .admin-link,
      .ghost-btn,
      .copy-btn,
      .open-btn {
        background: rgba(15,23,42,0.68) !important;
        color: rgba(226,232,240,0.96) !important;
        border-color: rgba(100,116,139,0.34) !important;
        -webkit-text-fill-color: rgba(226,232,240,0.96) !important;
      }

      .mode-switch {
        background: rgba(15,23,42,0.54) !important;
        border-color: rgba(71,85,105,0.44) !important;
      }

      .mode-btn {
        background: rgba(15,23,42,0.02) !important;
        color: rgba(203,213,225,0.92) !important;
        -webkit-text-fill-color: rgba(203,213,225,0.92) !important;
      }

      .mode-btn.active {
        color: #fff !important;
        -webkit-text-fill-color: #fff !important;
      }

      .mode-btn:not(.active):hover {
        background: rgba(30,41,59,0.72) !important;
      }

      .mode-meta,
      .capability {
        background: rgba(15,23,42,0.66) !important;
        border-color: rgba(100,116,139,0.34) !important;
      }

      .file-shell {
        background-color: rgba(15,23,42,0.84) !important;
        background: rgba(15,23,42,0.84) !important;
      }

      .file-copy span,
      .mode-desc,
      .hero-note,
      .capability p {
        color: rgba(148,163,184,0.94) !important;
      }

      .file-pill {
        background: rgba(37,99,235,0.16) !important;
        color: #bfdbfe !important;
        border: 1px solid rgba(96,165,250,0.22);
        -webkit-text-fill-color: #bfdbfe !important;
      }

      .input::placeholder,
      .textarea::placeholder {
        color: rgba(148,163,184,0.88);
        -webkit-text-fill-color: rgba(148,163,184,0.88);
        opacity: 1;
      }

      .input:focus,
      .textarea:focus,
      .file-shell.is-active {
        border-color: rgba(96,165,250,0.88);
        box-shadow: 0 0 0 4px rgba(59,130,246,0.18);
      }

      .input:-webkit-autofill,
      .input:-webkit-autofill:hover,
      .input:-webkit-autofill:focus,
      .textarea:-webkit-autofill,
      .textarea:-webkit-autofill:hover,
      .textarea:-webkit-autofill:focus {
        -webkit-text-fill-color: var(--text);
        box-shadow: 0 0 0 1000px rgba(15,23,42,0.94) inset;
        transition: background-color 9999s ease-out 0s;
      }
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 0% 0%, rgba(59,130,246,0.20), transparent 28%),
        radial-gradient(circle at 100% 10%, rgba(79,70,229,0.16), transparent 24%),
        radial-gradient(circle at 50% 100%, rgba(14,165,233,0.10), transparent 30%),
        linear-gradient(180deg, var(--bg), var(--bg-2));
      padding: 16px;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }

    a { color: inherit; text-decoration: none; }
    button, input, textarea { font: inherit; }

    .shell {
      max-width: var(--max);
      margin: 0 auto;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
      padding: 10px 4px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .brand-mark {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(37,99,235,1), rgba(79,70,229,1));
      box-shadow: 0 16px 30px rgba(37,99,235,0.24);
      position: relative;
      overflow: hidden;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: -0.06em;
    }

    .brand-mark::before {
      content: "CF";
      position: relative;
      z-index: 1;
    }

    .brand-mark::after {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: 13px;
      background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02));
      mix-blend-mode: screen;
      pointer-events: none;
    }

    .brand-copy {
      min-width: 0;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    .brand-sub {
      color: var(--muted);
      font-size: 12px;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .admin-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 42px;
      padding: 0 16px;
      border-radius: 999px;
      border: 1px solid var(--border-strong);
      background: var(--surface-soft);
      color: var(--text);
      font-size: 14px;
      font-weight: 700;
      backdrop-filter: blur(14px) saturate(150%);
      -webkit-backdrop-filter: blur(14px) saturate(150%);
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
      align-items: stretch;
    }

    .hero-copy,
    .create-card,
    .capability {
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(18px) saturate(145%);
      -webkit-backdrop-filter: blur(18px) saturate(145%);
    }

    .hero-copy {
      padding: 26px;
      position: relative;
      overflow: hidden;
    }

    .hero-copy::after {
      content: "";
      position: absolute;
      right: -40px;
      top: -40px;
      width: 180px;
      height: 180px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%);
      pointer-events: none;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
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

    h1 {
      margin: 16px 0 12px;
      font-size: clamp(32px, 5vw, 56px);
      line-height: 1.02;
      letter-spacing: -0.05em;
      max-width: 10ch;
    }

    .hero-desc {
      margin: 0;
      color: var(--sub);
      font-size: 15px;
      line-height: 1.82;
      max-width: 62ch;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 22px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 38px;
      padding: 0 13px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.48);
      color: var(--text);
      font-size: 13px;
      font-weight: 700;
    }

    .hero-note {
      margin-top: 18px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.7;
    }

    .create-card {
      padding: 22px;
      background: var(--surface-strong);
    }

    .card-top {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .card-top h2 {
      margin: 0;
      font-size: 22px;
      letter-spacing: -0.03em;
    }

    .card-top p {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.65;
    }

    .mode-switch {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 6px;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: rgba(148,163,184,0.10);
      margin-bottom: 16px;
    }

    .mode-btn {
      border: none;
      min-height: 44px;
      padding: 10px 10px;
      border-radius: 14px;
      background: transparent;
      color: var(--sub);
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      transition: .18s ease;
    }

    .mode-btn.active {
      color: #fff;
      background: linear-gradient(90deg, var(--primary), var(--primary-2));
      box-shadow: 0 12px 24px rgba(37,99,235,0.26);
    }

    .mode-meta {
      margin-bottom: 16px;
      padding: 14px 15px;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.42);
    }

    .mode-title {
      font-size: 14px;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .mode-desc {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.7;
    }

    .form {
      display: grid;
      gap: 14px;
    }

    .field, .field-group {
      display: grid;
      gap: 7px;
    }

    .field-group { display: none; }
    .field-group.active { display: grid; }

    label {
      color: var(--sub);
      font-size: 12px;
      font-weight: 700;
    }

    .input,
    .textarea,
    .file-shell {
      width: 100%;
      border: 1px solid var(--border-strong);
      background-color: rgba(255,255,255,0.86);
      background: rgba(255,255,255,0.86);
      color: var(--text);
      caret-color: var(--text);
      border-radius: var(--radius-lg);
      transition: .16s border-color ease, .16s box-shadow ease, .16s transform ease;
    }

    .input,
    .textarea {
      -webkit-appearance: none;
      appearance: none;
    }

    .input,
    .textarea {
      padding: 13px 14px;
      font-size: 14px;
      outline: none;
    }

    .textarea {
      min-height: 180px;
      resize: vertical;
      line-height: 1.7;
    }

    .input:focus,
    .textarea:focus,
    .file-shell.is-active {
      border-color: rgba(37,99,235,0.75);
      box-shadow: 0 0 0 4px rgba(59,130,246,0.14);
      transform: translateY(-1px);
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .hint {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.7;
    }


    .file-shell {
      position: relative;
      padding: 16px;
      overflow: hidden;
    }

    .file-shell input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .file-ui {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      min-height: 72px;
    }

    .file-copy strong {
      display: block;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .file-copy span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.65;
      display: block;
    }

    .file-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      min-width: 94px;
      height: 40px;
      border-radius: 999px;
      background: rgba(37,99,235,0.10);
      color: var(--primary);
      font-size: 13px;
      font-weight: 800;
      padding: 0 14px;
    }

    .file-meta {
      display: none;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed var(--border);
      color: var(--sub);
      font-size: 13px;
      line-height: 1.7;
      word-break: break-word;
    }

    .actions {
      display: grid;
      gap: 12px;
      margin-top: 2px;
    }

    .primary-btn,
    .ghost-btn,
    .copy-btn,
    .open-btn {
      border: none;
      cursor: pointer;
      border-radius: 16px;
      min-height: 48px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 800;
    }

    .primary-btn {
      color: #fff;
      background: linear-gradient(90deg, var(--primary), var(--primary-2));
      box-shadow: 0 16px 30px rgba(37,99,235,0.24);
    }

    .ghost-btn,
    .copy-btn,
    .open-btn {
      background: rgba(148,163,184,0.10);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .primary-btn:disabled,
    .copy-btn:disabled,
    .open-btn:disabled,
    .ghost-btn:disabled {
      opacity: .65;
      cursor: default;
      box-shadow: none;
    }

    .status {
      display: none;
      padding: 13px 14px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.7;
      border: 1px solid transparent;
    }

    .status.show { display: block; }
    .status.error {
      background: rgba(220,38,38,0.10);
      color: var(--danger);
      border-color: rgba(220,38,38,0.18);
    }

    .status.success {
      background: rgba(22,163,74,0.10);
      color: var(--success);
      border-color: rgba(22,163,74,0.18);
    }

    .result {
      display: none;
      margin-top: 8px;
      padding: 16px;
      border-radius: 20px;
      background: rgba(22,163,74,0.08);
      border: 1px solid rgba(22,163,74,0.18);
    }

    .result.show { display: block; }

    .result-head {
      display: flex;
      align-items: start;
      gap: 12px;
      margin-bottom: 10px;
    }

    .result-icon {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background: rgba(22,163,74,0.14);
      color: var(--success);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      flex: 0 0 auto;
    }

    .result-head strong {
      display: block;
      font-size: 15px;
      margin-bottom: 4px;
    }

    .result-head span {
      color: var(--sub);
      font-size: 13px;
      line-height: 1.65;
    }

    .result-link {
      padding: 14px;
      border-radius: 16px;
      background: rgba(255,255,255,0.75);
      border: 1px solid rgba(22,163,74,0.16);
      color: var(--primary);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.7;
      word-break: break-all;
      margin-bottom: 12px;
    }

    .result-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .capabilities {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      margin-top: 18px;
    }

    .capability {
      padding: 20px;
      box-shadow: var(--shadow-md);
    }

    .capability-kicker {
      color: var(--primary);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .capability h3 {
      margin: 0 0 8px;
      font-size: 20px;
      letter-spacing: -0.03em;
    }

    .capability p {
      margin: 0;
      color: var(--sub);
      font-size: 14px;
      line-height: 1.8;
    }

    .footer {
      margin: 22px 0 6px;
      text-align: center;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.7;
    }

    @media (min-width: 900px) {
      body { padding: 26px; }
      .hero {
        grid-template-columns: minmax(0, 1.04fr) minmax(390px, 0.96fr);
        gap: 20px;
      }
      .hero-copy { padding: 34px; }
      .create-card { padding: 26px; }
      .grid-2 { grid-template-columns: 1fr 1fr; }
      .capabilities {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }
      .result-actions {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 720px) {
      body { padding: 12px; }
      .topbar { margin-bottom: 14px; }
      .hero-copy, .create-card, .capability { border-radius: 22px; }
      .hero-copy { padding: 20px; }
      .create-card { padding: 18px; }
      .brand-mark { width: 36px; height: 36px; border-radius: 12px; font-size: 14px; }
      .brand-mark::after { border-radius: 11px; }
      .brand-name { font-size: 17px; }
      h1 { max-width: none; font-size: clamp(28px, 9vw, 40px); }
      .hero-desc { font-size: 14px; line-height: 1.75; }
      .chips { margin-top: 18px; gap: 8px; }
      .chip { min-height: 34px; padding: 0 11px; font-size: 12px; }
      .card-top { flex-direction: column; }
      .mode-switch { gap: 6px; padding: 5px; }
      .mode-btn { min-height: 42px; font-size: 13px; padding: 9px 8px; }
      .suffix-shell { display: block; padding: 10px 14px; }
      .suffix-prefix { display: block; margin-bottom: 2px; }
      .suffix-input { padding: 8px 0 2px; }
      .file-ui { align-items: start; flex-direction: column; min-height: 0; }
      .file-pill { min-width: 0; width: 100%; }
      .admin-link { height: 40px; padding: 0 13px; font-size: 13px; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark"></div>
        <div class="brand-copy">
          <div class="brand-name">CFLink</div>
          <div class="brand-sub">Fast Share on Cloudflare</div>
        </div>
      </div>
      <a class="admin-link" href="/admin">后台管理</a>
    </header>

    <main>
      <section class="hero">
        <section class="hero-copy">
          <div class="eyebrow">Cloudflare Workers · KV · R2</div>
          <h1>一条短链接，分享任何内容</h1>
          <p class="hero-desc">把网址跳转、文本页和文件上传收进同一个入口。更轻、更快，也更适合临时分享、轻量分发和跨设备传递内容。</p>
          <div class="chips">
            <span class="chip">秒速生成</span>
            <span class="chip">文本 / 链接 / 文件</span>
            <span class="chip">支持自定义后缀</span>
          </div>
          <div class="hero-note">一个统一入口，快速完成链接、文本和文件分享。</div>
        </section>

        <section class="create-card">
          <div class="card-top">
            <div>
              <h2>创建分享</h2>
              <p>选择类型，填写内容，立即生成链接。</p>
            </div>
          </div>

          <div class="mode-switch">
            <button id="modeUrlBtn" class="mode-btn active" type="button" onclick="setMode('url')">链接</button>
            <button id="modeTextBtn" class="mode-btn" type="button" onclick="setMode('text')">文本</button>
            <button id="modeFileBtn" class="mode-btn" type="button" onclick="setMode('file')">文件</button>
          </div>

          <div class="mode-meta">
            <div id="modeTitle" class="mode-title">链接分享</div>
            <div id="modeDesc" class="mode-desc">生成一个跳转到目标地址的短链，适合压缩长网址并快速转发。</div>
          </div>

          <div class="form">
            <div id="urlField" class="field-group active">
              <div class="field">
                <label for="u">目标链接</label>
                <input class="input" type="url" id="u" placeholder="https://example.com/article/2026/hello" autocomplete="off" />
                <div class="hint">请输入完整的 http 或 https 地址。</div>
              </div>
            </div>

            <div id="textField" class="field-group">
              <div class="field">
                <label for="tt">文本页标题（可选）</label>
                <input class="input" type="text" id="tt" placeholder="例如：公告 / 说明 / 笔记" autocomplete="off" />
              </div>
              <div class="field">
                <label for="t">文本内容</label>
                <textarea class="textarea" id="t" placeholder="输入要分享的文本内容，支持基础 Markdown：标题、列表、粗体、代码、链接。"></textarea>
                <div class="hint">适合公告、说明、备注、临时文档等轻量内容。</div>
              </div>
            </div>

            <div id="fileField" class="field-group">
              <div class="field">
                <label for="ft">文件标题（可选）</label>
                <input class="input" type="text" id="ft" placeholder="例如：安装包 / 海报 / 使用文档" autocomplete="off" />
              </div>
              <div class="field">
                <label for="f">上传文件</label>
                <div id="fileShell" class="file-shell">
                  <input type="file" id="f" />
                  <div class="file-ui">
                    <div class="file-copy">
                      <strong id="fileLabel">选择一个文件</strong>
                      <span id="fileHint">上传到 R2 后生成可访问链接；图片、PDF、文本、音视频更适合在线预览。</span>
                    </div>
                    <div class="file-pill">选择文件</div>
                  </div>
                  <div id="fileMeta" class="file-meta"></div>
                </div>
              </div>
            </div>

            <div class="grid-2">
              <div class="field">
                <label for="k">自定义后缀（可选）</label>
                <input class="input" type="text" id="k" placeholder="e.g. note / guide / memo" autocomplete="off" />
                <div class="hint">建议使用字母、数字、短横线；系统保留后缀不可用。</div>
              </div>
              <div class="field">
                <label>当前操作</label>
                <div class="hint" id="modeHint">将目标网址压缩成一条更短、更适合传播的链接。</div>
              </div>
            </div>

            <div id="status" class="status"></div>

            <div class="actions">
              <button id="btn" class="primary-btn" type="button" onclick="s()">生成短链</button>
            </div>

            <div id="res" class="result">
              <div class="result-head">
                <div class="result-icon">✓</div>
                <div>
                  <strong>分享链接已生成</strong>
                  <span id="resultDesc">现在可以复制或直接打开。</span>
                </div>
              </div>
              <div id="link" class="result-link"></div>
              <div class="result-actions">
                <button class="copy-btn" type="button" onclick="cp(this)">复制链接</button>
                <button id="openBtn" class="open-btn" type="button" onclick="openLink()">打开链接</button>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section class="capabilities">
        <article class="capability">
          <div class="capability-kicker">Link</div>
          <h3>链接分享</h3>
          <p>把长链接压缩成更短、更容易传播的地址，并支持自定义后缀。</p>
        </article>
        <article class="capability">
          <div class="capability-kicker">Text</div>
          <h3>文本分享</h3>
          <p>快速发布公告、说明、笔记或临时内容页，支持基础 Markdown 展示。</p>
        </article>
        <article class="capability">
          <div class="capability-kicker">File</div>
          <h3>文件分享</h3>
          <p>上传到 R2 后生成可预览、可下载的访问链接，适合轻量分发文件。</p>
        </article>
      </section>
    </main>

    <footer class="footer">CFLink · Lightweight Share Center · Powered by Cloudflare Workers, KV and R2</footer>
  </div>

  <script>
    let mode = 'url';
    let lastLink = '';

    function formatBytes(size) {
      const value = Number(size) || 0;
      if (value < 1024) return value + ' B';
      if (value < 1024 * 1024) return (value / 1024).toFixed(1) + ' KB';
      if (value < 1024 * 1024 * 1024) return (value / (1024 * 1024)).toFixed(1) + ' MB';
      return (value / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }

    function escapeHtml(value) {
      return String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function setStatus(type, message) {
      const box = document.getElementById('status');
      if (!box) return;
      if (!message) {
        box.className = 'status';
        box.textContent = '';
        return;
      }
      box.className = 'status show ' + (type === 'success' ? 'success' : 'error');
      box.textContent = message;
    }

    function resetResult() {
      lastLink = '';
      const resBox = document.getElementById('res');
      const linkEl = document.getElementById('link');
      if (linkEl) linkEl.textContent = '';
      if (resBox) resBox.classList.remove('show');
    }

    function showResult(link, description) {
      lastLink = link;
      const resBox = document.getElementById('res');
      const linkEl = document.getElementById('link');
      const descEl = document.getElementById('resultDesc');
      if (linkEl) linkEl.textContent = link;
      if (descEl) descEl.textContent = description || '现在可以复制或直接打开。';
      if (resBox) resBox.classList.add('show');
    }

    function updateFileState() {
      const input = document.getElementById('f');
      const shell = document.getElementById('fileShell');
      const label = document.getElementById('fileLabel');
      const hint = document.getElementById('fileHint');
      const meta = document.getElementById('fileMeta');
      const file = input && input.files ? input.files[0] : null;
      if (!shell || !label || !hint || !meta) return;

      if (!file) {
        shell.classList.remove('is-active');
        label.textContent = '选择一个文件';
        hint.textContent = '上传到 R2 后生成可访问链接；图片、PDF、文本、音视频更适合在线预览。';
        meta.style.display = 'none';
        meta.textContent = '';
        return;
      }

      shell.classList.add('is-active');
      label.textContent = file.name || '已选择文件';
      hint.textContent = '文件已就绪，生成后即可分享。';
      meta.style.display = 'block';
      meta.innerHTML = '大小：' + escapeHtml(formatBytes(file.size || 0)) + '<br>类型：' + escapeHtml(file.type || 'application/octet-stream');
    }

    function setMode(nextMode) {
      mode = nextMode === 'file' ? 'file' : (nextMode === 'text' ? 'text' : 'url');
      const urlField = document.getElementById('urlField');
      const textField = document.getElementById('textField');
      const fileField = document.getElementById('fileField');
      const modeTitle = document.getElementById('modeTitle');
      const modeDesc = document.getElementById('modeDesc');
      const modeHint = document.getElementById('modeHint');
      const btn = document.getElementById('btn');
      const urlBtn = document.getElementById('modeUrlBtn');
      const textBtn = document.getElementById('modeTextBtn');
      const fileBtn = document.getElementById('modeFileBtn');

      if (urlField) urlField.classList.toggle('active', mode === 'url');
      if (textField) textField.classList.toggle('active', mode === 'text');
      if (fileField) fileField.classList.toggle('active', mode === 'file');
      if (urlBtn) urlBtn.classList.toggle('active', mode === 'url');
      if (textBtn) textBtn.classList.toggle('active', mode === 'text');
      if (fileBtn) fileBtn.classList.toggle('active', mode === 'file');

      if (mode === 'url') {
        if (modeTitle) modeTitle.textContent = '链接分享';
        if (modeDesc) modeDesc.textContent = '生成一个跳转到目标地址的短链，适合压缩长网址并快速转发。';
        if (modeHint) modeHint.textContent = '将目标网址压缩成一条更短、更适合传播的链接。';
        if (btn) btn.textContent = '生成短链';
      } else if (mode === 'text') {
        if (modeTitle) modeTitle.textContent = '文本分享';
        if (modeDesc) modeDesc.textContent = '生成一个可直接展示内容的文本页，适合说明、公告、笔记和临时文档。';
        if (modeHint) modeHint.textContent = '生成一个可直接打开阅读的文本分享页。';
        if (btn) btn.textContent = '生成文本页';
      } else {
        if (modeTitle) modeTitle.textContent = '文件分享';
        if (modeDesc) modeDesc.textContent = '上传文件到 R2，生成支持预览与下载的分享链接。';
        if (modeHint) modeHint.textContent = '上传文件后生成访问链接，适合跨设备传递与轻量分发。';
        if (btn) btn.textContent = '上传并生成链接';
      }

      setStatus('', '');
      resetResult();
    }

    async function s() {
      const u = document.getElementById('u').value.trim();
      const t = document.getElementById('t').value.trim();
      const tt = document.getElementById('tt').value.trim();
      const ft = document.getElementById('ft').value.trim();
      const fileInput = document.getElementById('f');
      const file = fileInput && fileInput.files ? fileInput.files[0] : null;
      const k = document.getElementById('k').value.trim();
      const btn = document.getElementById('btn');

      setStatus('', '');
      resetResult();

      if (mode === 'url') {
        const lowerUrl = u.toLowerCase();
        if (!u || !(lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://'))) {
          setStatus('error', '请输入以 http 或 https 开头的完整链接。');
          return;
        }
      } else if (mode === 'text') {
        if (!t) {
          setStatus('error', '请输入要分享的文本内容。');
          return;
        }
      } else if (!file) {
        setStatus('error', '请选择要上传的文件。');
        return;
      }

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

        const d = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus('error', d.error || '请求失败，请稍后重试。');
          return;
        }

        if (d.key) {
          const full = window.location.origin + d.key;
          showResult(full, mode === 'url'
            ? '短链已生成，现在可以复制或直接打开。'
            : mode === 'text'
              ? '文本页已生成，现在可以复制或直接打开。'
              : '文件链接已生成，现在可以复制或直接打开。');
          setStatus('success', mode === 'file' ? '上传完成，链接已生成。' : '生成成功。');
        } else {
          setStatus('error', d.error || '生成失败，请稍后重试。');
        }
      } catch (e) {
        setStatus('error', '请求失败，请稍后重试。');
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    function cp(button) {
      if (!lastLink) return;
      navigator.clipboard.writeText(lastLink).then(function () {
        const old = button.innerText;
        button.innerText = '已复制';
        setTimeout(function () {
          button.innerText = old;
        }, 1800);
      });
    }

    function openLink() {
      if (!lastLink) return;
      window.open(lastLink, '_blank', 'noopener,noreferrer');
    }

    setMode('url');
    const fileInput = document.getElementById('f');
    if (fileInput) fileInput.addEventListener('change', updateFileState);
  </script>
</body>
</html>`;
