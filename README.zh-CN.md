# Nexso

基于 [Netcatty](https://github.com/binaricat/Netcatty) 的 SSH 客户端，调整为紧凑、圆润的界面，并统一动效。

## 下载

[下载最新安装包](https://github.com/aoomee/Nexso/releases/latest)

当前提供 **macOS Apple Silicon（M1 及更新芯片）DMG 预览版**。打开后拖入「应用程序」。Nexso 与 Netcatty 使用独立的应用标识及数据目录，可以共存。迁移主机请使用原有导出、导入功能。

## 更新

仅从 `aoomee/Nexso` 的 Releases 检查新版本，不再查询 Netcatty 的发布版本。发现新版本后打开本项目下载页安装。目前安装包为 ad-hoc 签名，未经过 Apple 公证；取得固定的 Apple 开发者签名后再接入自动安装。

## 开发与验证

构建方式见 [README](README.md)。版本号在 `package.json` 中维护，更新仓库在 `nexso.config.json` 中维护。仓库 Actions 中的 **Nexso Release** 工作流可为指定版本标签生成并发布 Apple Silicon 安装包。

已做界面和更新源回归测试、ESLint、正式构建及打包后的本地终端检查；真实 SSH/SFTP、硬件和云同步仍需实机验收。OAuth 云同步需要项目自己的客户端配置。

## 开源说明

基于 Netcatty 提交 `7949242765a07bc2e766cd04e69eff32cf666699`，遵循 **GPL-3.0-or-later**，保留上游版权及许可声明。每个 Release 标签提供对应源代码。原项目资料见 [README.upstream.md](README.upstream.md)。
