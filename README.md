# Shortlink Workers KV

基于 `Cloudflare Workers + KV` 的轻量级短链接服务，包含：

- 公开短链创建页面
- 可视化管理后台
- KV 持久化
- 域名黑名单与后缀黑名单
- 自定义 403 / 404 跳转

当前推荐部署版本：`worker_updated_v3.js`

## 一键部署

点击下面按钮可直接部署到您自己的 Cloudflare 账号：

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/himyhy/shortlink)

## 最短部署清单

1. 点击上方 `Deploy to Cloudflare`
2. 创建并绑定一个 `KV` 命名空间：`LINKS`
3. 将 `wrangler.jsonc` 中的 `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` 替换为您的 KV Namespace ID（Deploy to Cloudflare 页面里也应配置正确）
4. 设置后台路径：`ADMIN_PATH`，例如 `/admin`
5. 按需填写黑名单配置（可留空）
6. 部署完成后访问：
   - `/` → 首页创建短链
   - `/admin` → 管理后台

## 功能特性

### 1. Workers + KV 持久化
- 所有短链数据存储在 `KV`
- 默认永久有效（无 TTL）
- 同一长链接可复用已有短链（随机后缀模式）

### 2. 自助短链生成
- 支持随机后缀
- 支持自定义后缀
- 支持 Turnstile 验证（可选）
- 支持长链接域名黑名单
- 支持短链后缀黑名单

### 3. 可视化管理后台
- 后台路径可自定义，例如 `/admin`
- 支持搜索、分页、排序
- 支持删除短链
- 支持查看全部短链数据

### 4. 统一错误处理
- 被封禁后缀 → 跳转自定义 `403` 页面
- 不存在后缀 → 跳转自定义 `404` 页面
- 当前默认：
  - `403` → `https://403.lily.lat/`
  - `404` → `https://404.lily.lat/`

## Cloudflare 配置说明

### `KV`

需要绑定一个 KV 命名空间：

- 绑定变量名：`LINKS`

### 文本变量

- `ADMIN_PATH`
  - 后台入口路径
  - 示例：`/admin`

- `LONG_DOMAIN_BLACKLIST`
  - 长链接域名黑名单
  - 支持多行或逗号分隔

- `SUFFIX_BLACKLIST`
  - 后缀黑名单
  - 支持多行或逗号分隔

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

## 文件说明

- `worker_updated_v3.js`：当前推荐正式版本
- `worker_updated_v2.js`：历史版本
- `worker_updated.js`：更早期版本
- `wrangler.jsonc`：Cloudflare Worker 配置

## 默认入口

- `/`：短链创建页
- `ADMIN_PATH`：管理后台
- `/<suffix>`：短链跳转

## 说明

这个仓库现在已经补上：

- `wrangler.jsonc`
- `package.json`
- 一键部署按钮
- Cloudflare 模板元数据

因此更适合作为 Cloudflare Worker 模板仓库直接复用。
