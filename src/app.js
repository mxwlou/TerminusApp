import "./stylesheets/main.css";
// Small helpers you might want to keep
// import "./helpers/context_menu.js";
// import "./helpers/external_links.js";
// import './js/classie.js';
import './js/modalEffects.js';

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

import { remote } from "electron";
import jetpack from "fs-jetpack";
import https from 'https';
import fs from 'fs';
import compressing from 'compressing';
// import fs
// import './social-share.min.js';

// import { greet } from "./hello_world/hello_world";
import env from "env";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");
const localVerManifest = appDir.read('app/ver.json', 'json');
const localConfigManifest = appDir.read('app/conf.json', 'json');
const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

// console.log("I'm Executed!!!!");
// console.log(https);
// console.log(manifest);
console.log(appDir);

const updatenow = (e) => {
    console.log("trying update");
}

const checkForUpdates = (src, success, error) => {
    // success = (success || (e) => console.log("获取更新资源成功"));
    // error = (error || (e) => console.log("获取更新资源失败"));

    if (!success) success = e => console.log("获取更新资源成功");
    if (!error) error = e => console.log("获取更新资源失败");

    https.get(src, res => {
        let statusCode = res.statusCode;
        if (statusCode !== 200) {
            // 出错回调
            error();
            // 消耗响应数据以释放内存
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });

        // 请求结束
        res.on('end', () => success(rawData))
           .on('error', e => error(e));
      });
};


const loc = 'https://raw.githubusercontent.com/mxwlou/sitever/master/package.json';

/**
 * [configOptions description]配置选项
 * 从配置文件中读取，可以由用户修改
 * @type {Object}
 */
// const configOptions = {
//     baseLoc: 'https://raw.githubusercontent.com',
//     ghOwner: 'mxwlou',
//     ghRepo: 'sitever',
//     ghBranch: 'master',
//     folder: 'here/can/set/the/folder/related/to/route',
//     type: 'github', // github means take owner:repo:branch, other means take folder option
// }
const configOptions = localConfigManifest;

/**
 * [description] 获取更新版本地址
 * @param  {[type]} option [description]
 * @return {[type]}        [description]
 */
const getUpdateVersionUrl = (option) => {
    if (option.type === 'github') {
        return option.baseLoc + '/' + option.ghOwner + '/' + option.ghRepo + '/' + option.ghBranch + '/package.json';
    } else if (option.type === 'other') {
        return option.baseLoc + '/' + option.folder + '/package.json'
    } else {
        // 不是合法选项
        return 'ERROR';
    }
};

const getUpdateRealUrl = (option, filename) => {
    if (option.type === 'github') {
        return option.baseLoc + '/' + option.ghOwner + '/' + option.ghRepo + '/' + option.ghBranch + '/' + filename;
    } else if (option.type === 'other') {
        return option.baseLoc + '/' + option.folder + '/' + filename;
    } else {
        return 'ERROR';
    }
}

const createListElem = (lbl, ctnt) => {
    return '<li><strong>' + lbl + ':</strong>' + ctnt + '</li>';
}

let updateList;
let remotePackageJSON;

const succFn = (result) => {
    let versionCtrl = JSON.parse(result);
    remotePackageJSON = versionCtrl;
    console.log(versionCtrl.manifest);
    console.log(localVerManifest.version);

    /**
     * 最新版本不更新
     * @type {[type]}
     */
    let remoteVersionElement = document.getElementById('remote-ver');
    let localVersionElement = document.getElementById('local-ver');
    remoteVersionElement.innerText = versionCtrl.version;
    localVersionElement.innerText = localVerManifest.version;
    let modalContent = document.getElementById('modal-14');
    let updateBtn = document.getElementById('get-update-button');
    let remoteUpdateContent = document.getElementById('update-content');
    if (versionCtrl.version === localVerManifest.version) {
        modalContent.innerHTML = '';
        return;
    }


    // document.getElementById("update").innerText = "获取更新成功！当前版本为：" + versionCtrl.version;
    // let updateBtn = document.getElementById('get-update-button');
    // let modalContent = document.getElementById('modal-14');
    // let remoteUpdateContent = document.getElementById('update-content');

    let latestVerIndex = versionCtrl.manifest.length - 1;
    updateList = versionCtrl.manifest[latestVerIndex];

    let updtCtnt = createListElem('更新日期', versionCtrl.manifest[latestVerIndex].detail[0]);
    versionCtrl.manifest[latestVerIndex].detail.slice(1).forEach(e => {
        updtCtnt += createListElem('更新文章', e);
    });
    remoteUpdateContent.innerHTML = updtCtnt;

    document.getElementById('immupd-btn').addEventListener('click', doupdate);
    updateBtn.style = 'opacity: 1; transition: opacity 0.5s ease-in-out;';

};

// checkForUpdates(getUpdateVersionUrl(configOptions),succFn);

const removeFolder = (base) => {
    appDir.remove(base + '/static-old');
}
const renameFolder = (base) => {
    appDir.rename(base + '/static' , 'static-old');
}

const moveFolder = (fromBase, toBase) => {
    appDir.move(fromBase + '/static' , toBase + '/static');
    // return appDir.copyAsync(fromBase + '/static' , toBase);
}

const writeJSON = (jsObj, toBase) => {
    appDir.writeAsync(toBase + '/ver.json', jsObj);
}

const updateStaticFolder = () => {
    let currentPath = appDir.cwd() + '/app';
    let tempPath = currentPath + '/tmp';
    /**
     * Move to static.old for further version backpropagation
     */
    removeFolder(currentPath);
    renameFolder(currentPath);
    moveFolder(tempPath, currentPath);
    // .catch(err => console.log('文件结构更新失败！'));
}

const updateVersionFile = () => {
    let currentPath = appDir.cwd() + '/app';
    writeJSON(remotePackageJSON, currentPath);
    // .catch(err => console.log('版本文件更新失败！'));
}

function modifyConfiguration() {
    let toBeModified = configOptions;
    let selectedType = document.getElementById('type-select').selectedIndex;
    if (selectedType === 0) {
        // Github Update
        let user = document.getElementById('gh-user').value;
        let repo = document.getElementById('gh-repo').value;
        let branch = document.getElementById('gh-branch').value;

        toBeModified.baseLoc = 'https://raw.githubusercontent.com';
        toBeModified.type = 'github';
        toBeModified.ghOwner = user;
        toBeModified.ghRepo = repo;
        toBeModified.ghBranch = branch;

    } else {
        let baseloc = document.getElementById('tp-domain').value;
        let loc = document.getElementById('tp-repo').value;

        toBeModified.baseLoc = baseloc;
        toBeModified.type = 'other';
        toBeModified.folder = 'loc';
    }

    appDir.writeAsync(appDir.cwd() + '/app/conf.json', toBeModified);
}

function performReplacement() {
    // var closeButton = '<button class="ud-trigger call-update" id="get-close-button" style="opacity: 0;height:4rem;width:4rem;background:#6a4c9c;">完成更新</button>';
    document.getElementById('get-update-button').innerText= "更新完成";
    // document.getElementById('get-update-button').style = "opacity: 0;height:4rem;width:4rem;background:#6a4c9c;";
    document.getElementById('modal-14').innerHTML = '<div class="ud-content" style="background:#6a4c9c"><h3>更新完成</h3><div style="max-height: 40vh;overflow: scroll;"><p style="line-height:1.5;color:white;">您已成功更新至版本：<strong id="local-ver">0.0.1</strong>,请重启。</p></div><div class="buttonBar"><button class="ud-close emphasise" id="relaunch-btn">马上重启</button><button class="ud-close">稍后重启</button></div></div>';
    document.getElementById('relaunch-btn').addEventListener('click', e => {
        app.relaunch();
        app.quit();
    });
    Array.from(document.getElementsByClassName('ud-close')).forEach(e => e.addEventListener('click' , function() {
            document.getElementById('modal-14').classList.remove( 'ud-show' );
            document.getElementById('get-update-button').style="opacity:0;transition:0.3s all-ease;";
    }));
    // };
    // window.addModalEffects();
    // document.getElementById('relaunch-btn').addEventListener('click', e => {
    //     // app.relaunch();
    //     app.quit();
    // });
    /**
     * 更改文件结构
     */
    try {
        // statements
        updateStaticFolder();
    } catch(e) {
        // statements
        console.log(e);
        console.log("文件更新失败！");
    }

    try {
        // statements
        updateVersionFile();
    } catch(e) {
        // statements
        console.log(e);
        console.log("版本文件更新失败！");
    }
    // updateStaticFolder()
    /**
     * 更改版本信息
     */
        // .then(updateVersionFile())

    /**
     * 更新成功
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    // console.log("全部完成，请重启！");
    document.getElementById('get-update-button').style = "opacity:1;height:4rem;width:4rem;background:#6a4c9c;transition:0.3s ease-in-out";
        // .then(e => console.log('全部完成，请重启！'));
}

function doupdate() {
    console.log("开始更新！");
    if (updateList && updateList !== undefined) {
        let fetchUrl = getUpdateRealUrl(configOptions, updateList.file[0]);
        if (fetchUrl === 'ERROR') return;

        https.get(fetchUrl, function (res) {
            let statusCode = res.statusCode;
            if (statusCode !== 200) {
                error();
                res.resume();
                return;
            }

            // res.setEncoding('utf8');
            let rawData = new Buffer(0);
            res.on('data', function (chunk) {
              // rawData += chunk;
              rawData = Buffer.concat([rawData, chunk]);
            });
            // 请求结束
            res.on('end', function () {
              console.log('下载完成.');
              fs.writeFile(appDir.cwd() + '/app/tmp/' + updateList.file[0], rawData, function(err) {
                if (err) {
                    console.log("写入出错");
                } else {
                    console.log("写入成功");
                    compressing.zip.uncompress(appDir.cwd() + '/app/tmp/' + updateList.file[0], appDir.cwd() + '/app/tmp')
                     .then(() => {
                      console.log('解压完成');
                      performReplacement();
                     })
                     .catch(err => {
                      console.error(err);
                     });
                }
              });
            }).on('error', function (e) {
              console.log('下载失败');
            });
          });
    }
}


let thisModalEffects;
window.onload = function() {
    console.log("yup!");
    let tsk = '<div class="ud-modal ud-effect-14" id="modal-14"><div class="ud-content"><h3>发现新更新</h3><div style="max-height: 40vh;overflow: scroll;"><p style="line-height:1.3;">端点星App找到了新版本：<strong id="remote-ver">0.1.0</strong> (您的版本为<strong id="local-ver">0.0.1</strong>),最新更新内容为：</p><ul id="update-content"><li><strong>更新日期</strong>20180526</li><li><strong>增加文章:</strong>打法封禅大典发放到沙发地方司法范德萨发电风扇.</li><li><strong>增加文章:</strong>代发费打电话发费话费.</li></ul></div><div class="buttonBar"><button class="ud-close emphasise" id="immupd-btn">马上更新</button><button class="ud-close">暂不更新</button></div></div></div>';
    let tsk2 = '<div class="ud-modal ud-effect-14" id="modal-15"><div class="ud-content"><h3>设置更新源</h3><div style="max-height: 40vh;overflow: scroll;"><p style="line-height:1.3;display: inline-block;vertical-align: middle;">更新源设置：</p><select id="type-select"><option>github</option><option>第三方</option></select><div><p>Github更新源 ：</p><div><label>用户名：</label><input type="text" id="gh-user"></div><div><label>仓库名：</label><input type="text" id="gh-repo"></div><div><label>分支名：</label><input type="text" id="gh-branch"></div></div><div><p>第三方更新源 ：</p><div><label>更新地址：</label><input type="text" id="tp-domain" placeholder="格式：https://www.haha.io"></div><div><label>仓库路径：</label><input type="text" id="tp-route" placeholder="格式：path/to/repo"></div></div></div><div class="buttonBar"><button class="ud-close emphasise" id="sets-btn">马上更改</button><button class="ud-close">暂不更改</button></div></div></div>';
    let overlayCtnt = '<div class="ud-overlay"></div>';
    let triggerBtn = '<button class="ud-trigger call-update" id="get-update-button" data-modal="modal-14" style="opacity: 0;">新更新</button>';
    let navigateBtns = '<div class="navigate-items"><button id="nav-back" class="nav-items nav-btn"></button><button id="nav-forward" class="nav-items nav-btn"></button></div>';
    let settingBtn = '<div class="settings"><button class="ud-trigger" data-modal="modal-15" id="setting-btn"></button></div>';
    console.log(window.location);
    let oldHtml;
    if (window.location.href.endsWith('static/index.html')) {
        console.log("yes");
        checkForUpdates(getUpdateVersionUrl(configOptions),succFn);
        oldHtml = tsk + tsk2 + document.body.innerHTML + triggerBtn + overlayCtnt + settingBtn;
        document.body.innerHTML = oldHtml;
    } else {
        oldHtml = tsk2 + document.body.innerHTML + navigateBtns + settingBtn;
        document.body.innerHTML = oldHtml;
        document.getElementById('nav-back').addEventListener('click', function(e) {
            e.stopPropagation();
            window.history.back();
            // console.log("按下了后退按键");
        });
        document.getElementById('nav-forward').addEventListener('click', function(e) {
            e.stopPropagation();
            window.history.forward();
            // console.log('按下了前进按键');
        });
    }
    // document.body.innerHTML = oldHtml;
    window.addModalEffects();
    thisModalEffects = window.addModalEffects();
    window.configOptions = configOptions;
    document.getElementById('sets-btn').addEventListener('click', modifyConfiguration);
    document.getElementById('setting-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('gh-user').value = configOptions.ghOwner;
        document.getElementById('gh-repo').value = configOptions.ghRepo;
        document.getElementById('gh-branch').value = configOptions.ghBranch;
        document.getElementById('type-select').selectedIndex = (configOptions.type === 'github' ? 0 : 1);
        console.log('按下了设置按键');
    });

// const configOptions = {
//     baseLoc: 'https://raw.githubusercontent.com',
//     ghOwner: 'mxwlou',
//     ghRepo: 'sitever',
//     ghBranch: 'master',
//     folder: 'here/can/set/the/folder/related/to/route',
//     type: 'github', // github means take owner:repo:branch, other means take folder option
// }
    // window.location.href.endsWith('index.html')
    // var oldHtml = tsk + document.body.innerHTML + triggerBtn + overlayCtnt;
    // document.body.innerHTML = oldHtml;
    // window.addModalEffects();
    // thisModalEffects = window.addModalEffects();
};
