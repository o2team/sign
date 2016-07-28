# O2 Mail Sign

`hexo`版本开发指南，确保本地已经安装了`hexo`，若无安装执行下面代码安装：

```bash
npm i -g hexo-cli
```

安装好`hexo`之后执行下面命令：

```bash

# 拉取项目源码
git clone https://github.com/o2team/sign.git

# 切换到dev分支
git checkout dev

# 安装依赖
npm i -d

# 预览
hexo s --watch
```

浏览器打开 [http://localhost:4000/sign/] 预览效果，若需要修改源码，请修改 `themes/sign` 目录里面的代码，修改之后预览效果即可。

代码没问题之后执行下面代码提交到 `github` 分支 `dev` 上：

```bash
git push origin dev
```

同时发布到 `aotu.io/sign` ，执行下面代码：

```bash
hexo d -g
```

然后打开浏览器 [https://sign.aotu.io](https://sign.aotu.io) 查看即可。
