![TerminusApp](https://user-images.githubusercontent.com/14846040/40702157-5a8cb50c-6413-11e8-8c4c-1c3c8a215bd3.png) 
# 时光机 - An App For Terminus

「时光机」是端点星计划 [Terminus](https://github.com/terminus2049) 的一款桌面App，使用[Electron](http://electronjs.org)开发，打包工具为[Electron Buillder](http://electron.build/)。目前支持Windows、Mac以及Linux。

## 特性
* **文件离线**。无需担心被某墙限制访问。
* **自动更新**。自动检查更新与完成自动更新。出现问题可回退（目前版本暂不支持回退）。
* **可设置不同更新源**。 保证数据版本的去中心化。使用版本管理仓库 [SiteVersion](https://github.com/mxwlou/sitever) 管理记录，任何Fork Repo都能与此App的自动更新兼容。同时支持第三方hosting更新（需要第三方静态site支持**https**协议，同时保证与版本管理仓库相同的文件结构）.

## 最新版本安装包
* **Windows** : [TimeMachine-Windows-X64-Setup](https://raw.githubusercontent.com/mxwlou/TerminusApp/master/dist/win.zip)
* **macOS**: [TimeMachine-macOS-X64-DMG](https://raw.githubusercontent.com/mxwlou/TerminusApp/master/dist/mac.zip)
* **Linux**: [TimeMachine-Linux-X64-AppImage](https://raw.githubusercontent.com/mxwlou/TerminusApp/master/dist/linux-appimage.zip)、[TimeMachine-Linux-X64-deb](https://raw.githubusercontent.com/mxwlou/TerminusApp/master/dist/linux-deb.zip)、
[TimeMachine-Linux-X64-tar.xz](https://raw.githubusercontent.com/mxwlou/TerminusApp/master/dist/linux-tar.xz.zip)



# 开发者指南

## 文件结构

* `src` - 这个文件夹下面的文件会被编译后放进 `app` 文件夹后打包.
* `app` - 放置静态资源的地方，此文件夹下的内容会被完全打包.
*   * `static`: 放置Terminus打包出来的静态资源页面。
*   * `static-old`: 自动创建，用于版本回退。
*   * `tmp`: 自动创建，下载文件的临时存放位置。
*   * `ver.json`: 内容版本控制文件。
*   * `conf.json`: 更新仓库和地址的设定文件，自动生成。
* `build` - 构建脚本
* `config` - 配置文件
* `resources` - 放置App的图标。
* `e2e` - 放置测试文件。
* `package.json` - 里面的`build`选项为提供给**Electron Builder**的配置参数。

## 开发步骤

### 安装依赖项并启动本地Electron程序
```shell
# 克隆项目
git clone https://github.com/mxwlou/TerminusApp
cd TerminusApp
# 使用Yarn进行包管理
# 没有安装yarn请 npm install -g yarn
yarn
# 启动项目
yarn start
```

### 测试
```
yarn run test
```

### 编译当前机器运行版本的安装包(Linux/Mac/Windows)
```
yarn run release
```

### 在Mac下或者在Linux下生成Windows的安装包
```
yarn run build:win
```

### 生成三个平台下的安装包（Warining：非常耗时）
```
yarn run build
```


