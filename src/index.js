import { renderTextPage } from "./pages/text.js";
import { renderFilePage } from "./pages/file.js";
import { renderRichMarkdown, renderMathInHtml, extractMathPlaceholders, restoreMathPlaceholders, extractFootnotes, sanitizeRenderedHtml, enhanceRenderedHtml, renderFootnotesSection } from "./renderers/markdown.js";
import { htmlLogin, htmlAdmin } from "./pages/admin.js";
import { htmlIndex } from "./pages/home.js";
import { renderErrorPage } from "./pages/error.js";
import { AwsClient } from "aws4fetch";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
// ==================== 基础配置 ====================
// 后台密码优先使用环境变量 ADMIN_PASS；若未配置则回退到默认占位值
const DEFAULT_ADMIN_PASS = "change-this-password";
// 文件上传上限：Cloudflare Free/Pro 单次请求体硬上限 100 MB，超过会在边缘直接返回 413，
// Worker 根本收不到请求。Worker 内存只有 128 MB，所以这里也用 100 MB 做统一上限，
// 再配合下面的流式写入，避免小文件也被内存拖垮。
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = "100 MB";
// 大文件（>100 MB）预签名分片上传：R2 分片单对象最大 5 TiB，这里先把分享服务上限定在 5 GiB，
// 够个人用，也防存储失控；想放宽只改 MAX_LARGE_FILE_SIZE（前端同名常量和 README 要同步改）。
const MAX_LARGE_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5 GiB
const LARGE_PART_SIZE = 10 * 1024 * 1024; // 10 MiB：R2 要求除最后一片外每片 ≥5 MiB，10 MiB 断点续传粒度也够细
const LARGE_PART_URL_EXPIRES = 3600; // 每个分片的预签名地址有效 1 小时；上传前现取现用，过期重取即可

function getR2PresignConfig() {
  const accountId = (typeof R2_ACCOUNT_ID === "string" ? R2_ACCOUNT_ID : "").trim();
  const bucket = (typeof R2_BUCKET_NAME === "string" && R2_BUCKET_NAME.trim() ? R2_BUCKET_NAME.trim() : "cflink-files");
  const accessKeyId = (typeof R2_ACCESS_KEY_ID === "string" ? R2_ACCESS_KEY_ID : "").trim();
  const secret = (typeof R2_SECRET_ACCESS_KEY === "string" ? R2_SECRET_ACCESS_KEY : "").trim();
  if (!accountId || accountId === "YOUR_CLOUDFLARE_ACCOUNT_ID" || !accessKeyId || !secret) return null;
  return { accountId, bucket, accessKeyId, secret };
}

function encodeR2Key(key) {
  return String(key || "").split("/").map((seg) => encodeURIComponent(seg)).join("/");
}

function normalizeEtag(etag) {
  let v = String(etag || "").trim();
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  return v;
}

function decodeHeaderValue(v) {
  try { return decodeURIComponent(String(v || "")); } catch { return String(v || ""); }
}
const FAVICON_ICO_BASE64 = "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O/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/mFk7/5hZO/+YWTv/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

function decodeBase64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

marked.use(markedHighlight({
  emptyLangClass: 'hljs',
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));

function escapeHtmlServer(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

  if (pathname === "/favicon.ico") {
    return new Response(decodeBase64ToUint8Array(FAVICON_ICO_BASE64), {
      headers: {
        "content-type": "image/x-icon",
        "cache-control": "public, max-age=86400",
      },
    });
  }

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
    const typeRaw = String(url.searchParams.get("type") || "all").toLowerCase();
    const qRaw0 = String(url.searchParams.get("q") || "").trim();
    const qRaw = qRaw0.replace(/^\/+/, "");
    const q = qRaw.toLowerCase();

    const size = Math.min(10, Math.max(1, Math.floor(Number.isFinite(sizeRaw) ? sizeRaw : 10)));
    const sort = sortRaw === "time" ? "time" : "name";
    const filterType = typeRaw === "url" || typeRaw === "text" || typeRaw === "file" ? typeRaw : "all";

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
      const itemType = parsed?.type || 'url';
      if (filterType !== 'all' && itemType !== filterType) continue;
      const haystack = (it.name + "\n" + value + "\n" + title).toLowerCase();
      if (q && !haystack.includes(q)) continue;
      items.push({
        name: it.name,
        value,
        title,
        type: itemType,
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
      JSON.stringify({ page, size, sort, type: filterType, q: qRaw, total, totalPages, links }),
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

  // ---- 大文件预签名分片上传 API（>100 MB，不走 Worker 请求体）----
  // POST /api/upload/initiate | /part-url | /complete | /abort，均为小 JSON 入参。
  // 流程：initiate（Worker 用 R2 绑定创建分片上传，返回 uploadId）→
  // part-url（Worker 用 R2 Token 签分片 PUT 地址，浏览器直传 R2，绕过 100 MB 限制）→
  // complete（Worker 用绑定 resume + complete 合并，FILES.head() 验大小后写 KV）→ 返回短链。
  // 分片状态（uploadId、已传分片的 ETag）由浏览器存在 localStorage，刷新/断网后可续传；
  // Worker 本身不存会话，complete 时以前端传回的 parts 为准。未完成的分片上传 R2 会在 7 天后自动清理。
  if (pathname.startsWith("/api/upload/") && request.method === "POST") {
    const largeBody = await request.json().catch(() => ({}));
    const largeCfg = getR2PresignConfig();
    const needPresignConfig = () => new Response(JSON.stringify({ error: "大文件直传未配置：请在 Worker 设置 R2_ACCOUNT_ID、R2_ACCESS_KEY_ID、R2_SECRET_ACCESS_KEY，并给 R2 桶配 CORS（见 README 大文件一节）" }), {
      status: 501,
      headers: jsonHeaders,
    });

    if (pathname === "/api/upload/initiate") {
      const filename = typeof largeBody?.filename === "string" ? largeBody.filename.trim() : "";
      const size = Number(largeBody?.size || 0);
      const contentType = typeof largeBody?.contentType === "string" && largeBody.contentType.trim() ? largeBody.contentType.trim() : "application/octet-stream";
      const title = typeof largeBody?.title === "string" ? largeBody.title.trim() : "";
      const customKey = typeof largeBody?.key === "string" ? largeBody.key.trim() : "";
      if (!filename) {
        return new Response(JSON.stringify({ error: "文件名不能为空" }), { status: 400, headers: jsonHeaders });
      }
      if (!Number.isFinite(size) || size <= 0) {
        return new Response(JSON.stringify({ error: "文件大小无效" }), { status: 400, headers: jsonHeaders });
      }
      if (size <= MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "100 MB 及以下请用普通上传" }), { status: 400, headers: jsonHeaders });
      }
      if (size > MAX_LARGE_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "文件超过 5 GB 上限" }), { status: 413, headers: jsonHeaders });
      }
      if (!largeCfg) return needPresignConfig();
      if (customKey && isSuffixBlocked(customKey, suffixBlacklist)) {
        return new Response(JSON.stringify({ error: "该后缀已被占用" }), { status: 409, headers: jsonHeaders });
      }
      if (customKey && (await LINKS.get(customKey))) {
        return new Response(JSON.stringify({ error: "该后缀已被占用" }), { status: 409, headers: jsonHeaders });
      }
      let shortKey = customKey || Math.random().toString(36).substring(2, 8);
      if (!customKey && suffixBlacklist.size) {
        let guard = 0;
        while (isSuffixBlocked(shortKey, suffixBlacklist) && guard < 200) {
          shortKey = Math.random().toString(36).substring(2, 8);
          guard++;
        }
        if (isSuffixBlocked(shortKey, suffixBlacklist)) {
          return new Response(JSON.stringify({ error: "生成失败，请稍后重试" }), { status: 500, headers: jsonHeaders });
        }
      }
      const totalParts = Math.ceil(size / LARGE_PART_SIZE);
      if (totalParts > 10000) {
        return new Response(JSON.stringify({ error: "文件过大，分片数超过 10000" }), { status: 413, headers: jsonHeaders });
      }
      const fileExt = filename.includes(".") ? "." + filename.split(".").pop() : "";
      const objectKey = "uploads/" + Date.now() + "-" + Math.random().toString(36).slice(2, 10) + fileExt;
      let upload;
      try {
        upload = await FILES.createMultipartUpload(objectKey, {
          httpMetadata: {
            contentType,
            contentDisposition: 'inline; filename="' + encodeURIComponent(filename) + '"',
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "创建分片上传失败，请稍后重试" }), { status: 500, headers: jsonHeaders });
      }
      return new Response(JSON.stringify({
        uploadId: upload.uploadId,
        objectKey,
        shortKey,
        partSize: LARGE_PART_SIZE,
        totalParts,
        maxFileSize: MAX_LARGE_FILE_SIZE,
      }), { headers: jsonHeaders });
    }

    if (pathname === "/api/upload/part-url") {
      const uploadId = typeof largeBody?.uploadId === "string" ? largeBody.uploadId.trim() : "";
      const objectKey = typeof largeBody?.objectKey === "string" ? largeBody.objectKey.trim() : "";
      const partNumber = Number(largeBody?.partNumber || 0);
      if (!uploadId || !objectKey || !Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) {
        return new Response(JSON.stringify({ error: "分片参数无效" }), { status: 400, headers: jsonHeaders });
      }
      if (!largeCfg) return needPresignConfig();
      const client = new AwsClient({
        accessKeyId: largeCfg.accessKeyId,
        secretAccessKey: largeCfg.secret,
        service: "s3",
        region: "auto",
      });
      const url = new URL("https://" + largeCfg.accountId + ".r2.cloudflarestorage.com/" + largeCfg.bucket + "/" + encodeR2Key(objectKey));
      url.searchParams.set("partNumber", String(partNumber));
      url.searchParams.set("uploadId", uploadId);
      url.searchParams.set("X-Amz-Expires", String(LARGE_PART_URL_EXPIRES));
      const signed = await client.sign(new Request(url.toString(), { method: "PUT" }), { aws: { signQuery: true } });
      return new Response(JSON.stringify({ url: signed.url, expiresIn: LARGE_PART_URL_EXPIRES }), { headers: jsonHeaders });
    }

    if (pathname === "/api/upload/complete") {
      const uploadId = typeof largeBody?.uploadId === "string" ? largeBody.uploadId.trim() : "";
      const objectKey = typeof largeBody?.objectKey === "string" ? largeBody.objectKey.trim() : "";
      const shortKey = typeof largeBody?.shortKey === "string" ? largeBody.shortKey.trim() : "";
      const filename = typeof largeBody?.filename === "string" ? largeBody.filename.trim() : "download";
      const contentType = typeof largeBody?.contentType === "string" && largeBody.contentType.trim() ? largeBody.contentType.trim() : "application/octet-stream";
      const size = Number(largeBody?.size || 0);
      const title = typeof largeBody?.title === "string" ? largeBody.title.trim() : "";
      const rawParts = Array.isArray(largeBody?.parts) ? largeBody.parts : [];
      if (!uploadId || !objectKey || !shortKey || !rawParts.length) {
        return new Response(JSON.stringify({ error: "合并参数不完整" }), { status: 400, headers: jsonHeaders });
      }
      if (!Number.isFinite(size) || size <= 0 || size > MAX_LARGE_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "文件大小无效" }), { status: 400, headers: jsonHeaders });
      }
      const totalParts = Math.ceil(size / LARGE_PART_SIZE);
      if (rawParts.length !== totalParts) {
        return new Response(JSON.stringify({ error: "分片不完整：已传 " + rawParts.length + " / " + totalParts + " 片" }), { status: 400, headers: jsonHeaders });
      }
      const parts = rawParts
        .map((p) => ({ partNumber: Number(p?.partNumber || 0), etag: normalizeEtag(p?.etag || "") }))
        .filter((p) => Number.isInteger(p.partNumber) && p.partNumber >= 1 && p.partNumber <= 10000 && p.etag)
        .sort((a, b) => a.partNumber - b.partNumber);
      if (parts.length !== totalParts || parts.some((p, i) => p.partNumber !== i + 1)) {
        return new Response(JSON.stringify({ error: "分片编号不连续或 ETag 缺失，请重新上传缺失的分片" }), { status: 400, headers: jsonHeaders });
      }
      if (isSuffixBlocked(shortKey, suffixBlacklist)) {
        return new Response(JSON.stringify({ error: "该后缀已被占用" }), { status: 409, headers: jsonHeaders });
      }
      if (await LINKS.get(shortKey)) {
        return new Response(JSON.stringify({ error: "该后缀已被占用" }), { status: 409, headers: jsonHeaders });
      }
      try {
        const upload = FILES.resumeMultipartUpload(objectKey, uploadId);
        await upload.complete(parts);
      } catch (e) {
        return new Response(JSON.stringify({ error: "合并分片失败，uploadId 可能已过期（7 天未完成会自动清理），请重新上传" }), { status: 500, headers: jsonHeaders });
      }
      const head = await FILES.head(objectKey).catch(() => null);
      const actualSize = Number(head?.size || 0);
      if (actualSize && actualSize !== size) {
        await FILES.delete(objectKey).catch(() => {});
        return new Response(JSON.stringify({ error: "大小校验失败：实际 " + actualSize + "，声明 " + size + "，已删除不完整对象" }), { status: 500, headers: jsonHeaders });
      }
      await LINKS.put(shortKey, encodeStoredValue({
        type: "file",
        title,
        objectKey,
        filename,
        contentType,
        size: actualSize || size,
      }), { metadata: { createdAt: Date.now() } });
      invalidateAdminListCache();
      return new Response(JSON.stringify({ key: "/" + shortKey, type: "file" }), { headers: jsonHeaders });
    }

    if (pathname === "/api/upload/abort") {
      const uploadId = typeof largeBody?.uploadId === "string" ? largeBody.uploadId.trim() : "";
      const objectKey = typeof largeBody?.objectKey === "string" ? largeBody.objectKey.trim() : "";
      if (!uploadId || !objectKey) {
        return new Response(JSON.stringify({ error: "参数不完整" }), { status: 400, headers: jsonHeaders });
      }
      try {
        await FILES.resumeMultipartUpload(objectKey, uploadId).abort();
      } catch (e) {}
      return new Response(JSON.stringify({ ok: true }), { headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ error: "未知接口" }), { status: 404, headers: jsonHeaders });
  }

  // 生成短链 / 文本页 / 文件分享（全部永久）
  if (request.method === "POST") {
    // ---- 直传文件（新路径）：前端把 File 直接当 body 发，不走 multipart/form-data ----
    // 旧路径先 request.formData() 再 file.arrayBuffer()，一份文件在 128 MB 内存里
    // 存了两三份，20-50 MB 就可能爆内存（Error 1102），前端又没进度，看起来就是卡死。
    // 直传用 request.body 流式写 R2，不全量进内存，实际可用上限提到 Cloudflare 硬上限 100 MB。
    if (request.headers.get('x-cflink-upload') === 'raw-file') {
      const rawName = decodeHeaderValue(request.headers.get('x-file-name') || 'download');
      const rawTitle = decodeHeaderValue(request.headers.get('x-file-title') || '');
      const rawKey = decodeHeaderValue(request.headers.get('x-file-key') || '').trim();
      const rawType = request.headers.get('x-file-type') || request.headers.get('content-type') || 'application/octet-stream';
      const rawLen = Number(request.headers.get('content-length') || '0');
      if (rawLen && rawLen > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "文件超过 " + MAX_FILE_SIZE_LABEL + " 上限，请压缩或分卷后再上传" }), {
          status: 413,
          headers: jsonHeaders,
        });
      }
      if (rawKey && isSuffixBlocked(rawKey, suffixBlacklist)) {
        return new Response(JSON.stringify({ error: "该后缀已被占用" }), {
          status: 409,
          headers: jsonHeaders,
        });
      }
      if (rawKey && (await LINKS.get(rawKey))) {
        return new Response(JSON.stringify({ error: "该后缀已被占用" }), {
          status: 409,
          headers: jsonHeaders,
        });
      }
      let rawShortKey = rawKey || Math.random().toString(36).substring(2, 8);
      if (!rawKey && suffixBlacklist.size) {
        let guard = 0;
        while (isSuffixBlocked(rawShortKey, suffixBlacklist) && guard < 200) {
          rawShortKey = Math.random().toString(36).substring(2, 8);
          guard++;
        }
        if (isSuffixBlocked(rawShortKey, suffixBlacklist)) {
          return new Response(JSON.stringify({ error: "生成失败，请稍后重试" }), {
            status: 500,
            headers: jsonHeaders,
          });
        }
      }
      const rawExt = rawName && rawName.includes('.') ? '.' + rawName.split('.').pop() : '';
      const rawObjectKey = 'uploads/' + Date.now() + '-' + Math.random().toString(36).slice(2, 10) + rawExt;
      await FILES.put(rawObjectKey, request.body, {
        httpMetadata: {
          contentType: rawType,
          contentDisposition: 'inline; filename="' + encodeURIComponent(rawName) + '"',
        },
      });
      await LINKS.put(rawShortKey, encodeStoredValue({
        type: 'file',
        title: rawTitle,
        objectKey: rawObjectKey,
        filename: rawName,
        contentType: rawType,
        size: rawLen || 0,
      }), { metadata: { createdAt: Date.now() } });
      invalidateAdminListCache();
      return new Response(JSON.stringify({ key: "/" + rawShortKey, type: 'file' }), {
        headers: jsonHeaders,
      });
    }

    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    // 兼容旧前端的 multipart 路径：先看 Content-Length，超限直接 413，别等 formData() 把内存撑爆。
    const contentLength = Number(request.headers.get('content-length') || '0');
    if (isMultipart && contentLength && contentLength > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: "文件超过 " + MAX_FILE_SIZE_LABEL + " 上限，请压缩或分卷后再上传" }), {
        status: 413,
        headers: jsonHeaders,
      });
    }
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
      if (file.size && file.size > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "文件超过 " + MAX_FILE_SIZE_LABEL + " 上限，请压缩或分卷后再上传" }), {
          status: 413,
          headers: jsonHeaders,
        });
      }
      const fileExt = file.name && file.name.includes('.') ? '.' + file.name.split('.').pop() : '';
      const objectKey = 'uploads/' + Date.now() + '-' + Math.random().toString(36).slice(2, 10) + fileExt;
      // 别用 await file.arrayBuffer()：它会在 formData 已占一份内存的基础上再复制一份。
      // 直接传 File（Blob）给 R2，运行时知道长度、可流式写入，少占一份内存。
      await FILES.put(objectKey, file, {
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
    return new Response(renderErrorPage({
      status: 403,
      title: '访问受限',
      description: '这个链接当前不可访问，可能已被限制或保留。',
      primaryHref: '/',
      primaryText: '返回首页',
      secondaryHref: 'javascript:history.back()',
      secondaryText: '返回上一页'
    }), { status: 403, headers: htmlHeaders });
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
        return new Response(renderErrorPage({
          status: 404,
          title: '文件不存在',
          description: '这个文件链接已经失效，或者对应文件已不存在。',
          primaryHref: '/',
          primaryText: '返回首页',
          secondaryHref: adminBase,
          secondaryText: '进入后台'
        }), { status: 404, headers: htmlHeaders });
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
  return new Response(renderErrorPage({
    status: 404,
    title: '内容不存在',
    description: '这个链接不存在，或对应内容已经失效。你可以返回首页重新创建分享。',
    primaryHref: '/',
    primaryText: '返回首页',
    secondaryHref: '/',
    secondaryText: '创建新分享'
  }), { status: 404, headers: htmlHeaders });
}

addEventListener("fetch", (e) => e.respondWith(handleRequest(e.request)));

