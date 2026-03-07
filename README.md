# CFLink

一个基于 `Cloudflare Workers + KV` 的轻量级短链接服务，支持：

- 首页创建短链接
- 后台管理短链接
- 自定义后台入口路径
- 长链接域名黑名单
- 短链后缀黑名单
- 自定义 403 / 404 跳转
- Cloudflare 一键部署

当前仓库面向 **Cloudflare 一键部署** 做了整理，默认使用当前主版本：`src/index.js`。

## 一键部署

点击下面按钮，直接部署到您自己的 Cloudflare 账号：

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/himyhy/cflink)

## 最短部署清单

按下面填即可：

1. `LINKS`
   - 这是 `KV Namespace` 绑定
   - 按 Cloudflare 页面提示创建或选择即可

2. `ADMIN_PATH`
   - 建议填：`/admin`

3. `LONG_DOMAIN_BLACKLIST`
   - 不需要就留空

4. `SUFFIX_BLACKLIST`
   - 不需要就留空

部署完成后访问：

- `/` → 首页创建短链接
- `/admin` → 后台管理页面

## 功能说明

### 首页
- 用户可直接输入长链接生成短链
- 支持随机后缀
- 支持自定义后缀

### 后台
- 查看所有短链
- 搜索、分页、排序
- 删除短链
- 可通过 `ADMIN_PATH` 自定义后台路径

### 黑名单
- `LONG_DOMAIN_BLACKLIST`
  - 拦截指定长链接域名
  - 支持多行或逗号分隔

- `SUFFIX_BLACKLIST`
  - 拦截指定短链后缀
  - 支持多行或逗号分隔

## Cloudflare 配置

### KV 绑定

代码里使用的 KV 绑定名是：

- `LINKS`

请确保部署时绑定名保持为 `LINKS`。

### 环境变量

- `ADMIN_PATH`
  - 后台路径
  - 示例：`/admin`

- `LONG_DOMAIN_BLACKLIST`
  - 长链接域名黑名单
  - 可留空

- `SUFFIX_BLACKLIST`
  - 自定义后缀黑名单
  - 可留空

## 目录说明

- `src/index.js`
  - 当前主版本 / 推荐部署版本

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
