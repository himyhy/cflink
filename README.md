# CFLink

一个基于 `Cloudflare Workers + KV + R2` 的轻量级分享服务，支持：

- 首页创建分享链接（支持跳转链接 / 文本页 / 文件上传）
- 后台管理分享内容（基于 Cookie 登录态）
- 自定义后台入口路径
- 长链接域名黑名单
- 短链后缀黑名单
- 自定义 403 / 404 跳转
- Cloudflare 一键部署

当前仓库面向 **Cloudflare 一键部署** 做了整理，默认使用当前主版本：`src/index.js`。

## 一键部署

点击下面按钮，直接部署到您自己的 Cloudflare 账号。如果页面展示旧的默认名，先强刷或重新打开部署页一次：

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/himyhy/cflink&ref=main)

## 最短部署清单

按下面填即可：

1. `LINKS`
   - 这是 `KV Namespace` 绑定
   - 按 Cloudflare 页面提示创建或选择即可

2. `FILES`
   - 这是 `R2 Bucket` 绑定
   - 默认桶名可用：`cflink-files`

3. `ADMIN_PATH`
   - 建议填：`/admin`

4. `ADMIN_PASS`
   - 建议直接改成你自己的后台密码
   - 默认值是：`change-this-password`

5. `LONG_DOMAIN_BLACKLIST`
   - 默认值：`placeholder.invalid`
   - 这是占位值，效果等同于不启用黑名单

6. `SUFFIX_BLACKLIST`
   - 默认值可用：`admin,login,api`
   - 不需要也可以留空

部署完成后访问：

- `/` → 首页创建短链接
- `/admin` → 后台管理页面（如果你把 `ADMIN_PATH` 改成别的，就访问对应路径）

## 功能说明

### 首页
- 用户可直接创建三种分享内容：
  - 长链接跳转短链
  - 文本内容分享页（支持标题、复制、基础 Markdown）
  - 文件上传分享（R2 存储，支持预览与下载，单文件上限 100 MB）

### 文件上传上限
- **100 MB 及以下**：流式直传（前端把文件直接当请求体发，后端 `request.body` 流式写 R2），不再全量读进 Worker 内存。Cloudflare Free/Pro 单次请求体硬上限就是 100 MB，超过会在边缘直接返回 413。
- **100 MB–5 GB**：预签名分片直传。浏览器先向 Worker 要分片上传会话（`POST /api/upload/initiate`），Worker 用 R2 绑定创建分片上传；再按片向 Worker 要预签名 PUT 地址（`POST /api/upload/part-url`），浏览器直传 R2，每片 10 MB、3 路并发、每片失败重试 3 次；传完调 `POST /api/upload/complete` 合并，Worker 用绑定 `resumeMultipartUpload().complete()` 合并并用 `FILES.head()` 验大小后写 KV。断点续传：分片状态（uploadId、已传分片的 ETag）存在浏览器 localStorage，刷新、断网后重新选同一文件可续传；点“暂停”会保留已传分片，点“取消上传”会调 `POST /api/upload/abort` 清理。未完成的分片上传 R2 会在 7 天后自动清理。
- **超过 5 GB**：请先压缩或分卷；上限是代码里的 `MAX_LARGE_FILE_SIZE`，改它要同步改前端同名常量。

### 大文件分片直传配置（只在传 >100 MB 时需要）
不配也能用：100 MB 及以下不受影响；>100 MB 没配会返回 501 并明说缺配置。

1. **R2 API Token**：Cloudflare 控制台 → R2 → Manage R2 API Tokens → Create API Token，权限选 Object Read & Write，只勾 `cflink-files` 这个桶，记下 Access Key ID 和 Secret Access Key。**不要把这两个值写进仓库、不要发给任何人。**
2. **Account ID**：同一页能看到 Account ID，填到 `wrangler.jsonc` 的 `R2_ACCOUNT_ID`（已留占位 `YOUR_CLOUDFLARE_ACCOUNT_ID`），桶名默认 `cflink-files`，在 `R2_BUCKET_NAME`。
3. **Worker Secret**（二选一，推荐 wrangler）：
   ```bash
   npx wrangler secret put R2_ACCESS_KEY_ID
   npx wrangler secret put R2_SECRET_ACCESS_KEY
   ```
   或在控制台 Workers → 你的 Worker → Settings → Variables → Add variable，选 Secret 类型填这两个名。本地开发用 `.dev.vars`，同样不要提交。
4. **CORS**：浏览器直传 R2 必须配 CORS，否则 PUT 会被浏览器拦住。仓库里有模板 `r2-cors.json`，把 `AllowedOrigins` 里的 `https://YOUR-CFLINK-DOMAIN` 换成你的 cflink 域名（workers.dev 域名或自定义域名，只能填这一个，不要填 `*`），然后：
   ```bash
   npx wrangler r2 bucket cors set cflink-files --file r2-cors.json
   ```
   关键点：`ExposeHeaders` 必须含 `ETag`，前端靠它拿分片的 ETag 去合并；`AllowedMethods` 含 `PUT`。
5. **重新部署**：`npm run deploy`。验证：传一个 120 MB 文件，应看到进度条走到 100% 并生成短链；再传一个 >5 GB 的文件，应直接提示超过 5 GB 上限。

### 费用提醒
R2 免费额度是每月 10 GB 存储、100 万次 Class A 操作、1000 万次 Class B 操作，下载不收费；超出按 $0.015/GB·月。常传大文件很容易超 10 GB，例如 20 个 500 MB 就是 10 GB。
- 支持随机后缀
- 支持自定义后缀

### 后台
- 查看所有分享内容
- 搜索、分页、排序
- 区分链接 / 文本 / 文件类型
- 文本内容支持标题与基础 Markdown 预览
- 后台列表优先兼容旧链接数据与新文本数据
- 删除分享内容
- 可通过 `ADMIN_PATH` 自定义后台路径
- 后台登录成功后写入 Cookie，会话保存在浏览器中，可主动退出

### 黑名单
- `LONG_DOMAIN_BLACKLIST`
  - 拦截指定长链接域名
  - 支持多行或逗号分隔

- `SUFFIX_BLACKLIST`
  - 拦截指定短链后缀
  - 支持多行或逗号分隔

## Cloudflare 配置

### KV / R2 绑定

代码里使用的绑定名是：

- `LINKS`（KV）
- `FILES`（R2）

请确保部署时绑定名分别保持为 `LINKS` 与 `FILES`。

### 环境变量

- `ADMIN_PATH`
  - 后台路径
  - 示例：`/admin`

- `ADMIN_PASS`
  - 后台密码
  - 默认值：`change-this-password`
  - 强烈建议部署时直接改掉

- `LONG_DOMAIN_BLACKLIST`
  - 长链接域名黑名单
  - 默认值：`placeholder.invalid`
  - 这是给 Cloudflare 必填表单用的占位值，效果等同于不启用黑名单

- `SUFFIX_BLACKLIST`
  - 自定义后缀黑名单
  - 默认值：`admin,login,api`
  - 用来保留基础系统词，避免被占用
  - 不需要也可留空

## 目录说明

- `src/index.js`
  - 当前主版本 / 推荐部署版本
  - 包含链接、文本、文件三种分享模式

- `wrangler.jsonc`
  - Cloudflare Worker 配置

- `package.json`
  - 一键部署和 Wrangler 脚本配置

## 本地开发

安装依赖：

```bash
npm install
```

本地调试：

```bash
npm run dev
```

部署：

```bash
npm run deploy
```

## 说明

这个仓库已经去掉了旧版本文件和验证码相关配置，目标就是：

- 更干净
- 更适合 Cloudflare 一键部署
- 更少部署时的干扰项
