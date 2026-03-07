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
  - 文件上传分享（R2 存储，支持预览与下载）
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
