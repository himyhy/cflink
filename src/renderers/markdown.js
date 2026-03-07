import { marked } from "marked";

export function renderMathInHtml(input) {
  return String(input || '');
}

export function extractMathPlaceholders(text) {
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

export function restoreMathPlaceholders(html, math) {
  let out = String(html || '');
  out = out.replace(/<p>@@MATH_BLOCK_(\d+)@@<\/p>/g, (_, id) => {
    const item = math[Number(id)];
    if (!item) return '';
    return '<div class="math-block" data-math-display="true" data-expr="' + encodeURIComponent(item.expr) + '"></div>';
  });
  out = out.replace(/@@MATH_BLOCK_(\d+)@@/g, (_, id) => {
    const item = math[Number(id)];
    if (!item) return '';
    return '<div class="math-block" data-math-display="true" data-expr="' + encodeURIComponent(item.expr) + '"></div>';
  });
  out = out.replace(/@@MATH_INLINE_(\d+)@@/g, (_, id) => {
    const item = math[Number(id)];
    if (!item) return '';
    return '<span class="math-inline" data-expr="' + encodeURIComponent(item.expr) + '"></span>';
  });
  return out;
}

export function extractFootnotes(text) {
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

export function sanitizeRenderedHtml(html) {
  let out = String(html || '');
  out = out.replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  out = out.replace(/<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '');
  out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  out = out.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '');
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*javascript:[^"']*(\2)/gi, '');
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*data:text\/html[^"']*(\2)/gi, '');
  return out;
}

export function enhanceRenderedHtml(html) {
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

export function renderFootnotesSection(defs) {
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

export function renderRichMarkdown(text) {
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
