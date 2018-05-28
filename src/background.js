// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu, session} from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";

// import helperobj from './testInsert.js'
// import './static/style.css' as mainCSSStyle;
// import './static/assets/css/share.min.css' as mainCSSShare;
// import './static/assets/js/pangu.min.js' as mainJS;
// import './static/assets/js/social-share.min.js' as mainJSShare;
// 

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const staticFiles = [
  'style.css',
  'assets/css/share.min.css',
  'assets/js/social-share.min.js',
  'assets/js/pangu.min.js'
];

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  setApplicationMenu();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'static' ,"index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  if (env.name === "development") {
    mainWindow.openDevTools();
  }

  // const reloadFilter = {
  //   urls: staticFiles.map(e => 'file://' + path.join(__dirname, 'static', e))
  // };
  // const filter = {
  //   urls: staticFiles.map(e => 'file:///static/' + e)
  // };
  // // console.log(filter.urls);
  // session.defaultSession.webRequest.onBeforeRequest(filter , (details, callback) => {
  //   // console.log("Captured! This is: " , details);
  //   callback({cancel: false, redirectURL: details.url.replace('/static/', path.join(__dirname, 'static') + '/')});
  // });

  // mainWindow.webContents.on('will-navigate', (e,u) => {
  //   e.preventDefault();
  //   // console.log('Web content will navigate to: ', u);
  //   // console.log('The folder structure is: ', path.join(__dirname, 'static', 'index.html'));
  //   if (u.startsWith('file:///static/') && u.length > 15 && u.substr(15,4) !== 'page'){
  //     let anotherU = path.join(__dirname, 'static', u.substring(15));
  //     mainWindow.loadURL(
  //        url.format({
  //         pathname: anotherU,
  //         protocol: "file:",
  //         slashes: true
  //       })
  //     );
  //   } else if (u.substr(15,4) === 'page') {
  //     mainWindow.loadURL(
  //       url.format({
  //         pathname: path.join(__dirname, 'static', u.substr(15) , 'index.html'),
  //         protocol: "file:",
  //         slashes: true
  //       })
  //     );
  //   } else {
  //     mainWindow.loadURL(
  //       url.format({
  //         pathname: path.join(__dirname, 'static', 'index.html'),
  //         protocol: "file:",
  //         slashes: true
  //       })
  //     );
  //   }
  const linuxURLs = staticFiles.map(e => 'file:///static/' + e);
  const winURLs_big = staticFiles.map(e => 'file:///C:/static/' + e);
  const winURLs_small = staticFiles.map(e => 'file:///c:/static/' + e);
  const filter = {
    urls: [...linuxURLs, ...winURLs_big, ...winURLs_small]
  };
  // console.log(filter.urls);
  session.defaultSession.webRequest.onBeforeRequest(filter , (details, callback) => {
    // console.log("Captured! This is: " , details);
    if (details.url.startsWith('file:///static/')) {
      callback({cancel: false, redirectURL: details.url.replace('/static/', path.join(__dirname, 'static') + '/')});    
    } else if (details.url.startsWith('file:///C:/static/')) {
      callback({cancel: false, redirectURL: details.url.replace('C:/static/', path.join(__dirname, 'static') + '/')});
    } else {
      callback({cancel: false, redirectURL: details.url.replace('c:/static/', path.join(__dirname, 'static') + '/')});
    }
    // callback({cancel: false, redirectURL: details.url.replace('/static/', path.join(__dirname, 'static') + '/')});
  });

  mainWindow.webContents.on('will-navigate', (e,u) => {
    e.preventDefault();
    // console.log('Web content will navigate to: ', u);
    // console.log('The folder structure is: ', path.join(__dirname, 'static', 'index.html'));

    // For non-windows users
    if (u.startsWith('file:///static/')) {
        if (u.length > 15 && u.substr(15,4) !== 'page') {
            let anotherU = path.join(__dirname, 'static', u.substring(15));
            mainWindow.loadURL(
               url.format({
                pathname: anotherU,
                protocol: "file:",
                slashes: true
              })
            );
        } else if (u.substr(15,4) === 'page') {
            mainWindow.loadURL(
              url.format({
                pathname: path.join(__dirname, 'static', u.substr(15) , 'index.html'),
                protocol: "file:",
                slashes: true
              })
            );
        } else {
            mainWindow.loadURL(
              url.format({
                pathname: path.join(__dirname, 'static', 'index.html'),
                protocol: "file:",
                slashes: true
              })
            );
        }
    } else if (u.startsWith('file:///C:/static/')) {
        if (u.length > 18 && u.substr(18,4) !== 'page') {
          let anotherU = path.join(__dirname, 'static', u.substring(18));
          mainWindow.loadURL(
             url.format({
              pathname: anotherU,
              protocol: "file:",
              slashes: true
            })
          );
        } else if (u.substr(18,4) === 'page') {
          mainWindow.loadURL(
            url.format({
              pathname: path.join(__dirname, 'static', u.substr(18) , 'index.html'),
              protocol: "file:",
              slashes: true
            })
          );
        } else {
          mainWindow.loadURL(
            url.format({
              pathname: path.join(__dirname, 'static', 'index.html'),
              protocol: "file:",
              slashes: true
            })
          );
        }
    } else if (u.startsWith('file:///c:/static/')) {
          if (u.length > 18 && u.substr(18,4) !== 'page') {
          let anotherU = path.join(__dirname, 'static', u.substring(18));
          mainWindow.loadURL(
             url.format({
              pathname: anotherU,
              protocol: "file:",
              slashes: true
            })
          );
        } else if (u.substr(18,4) === 'page') {
          mainWindow.loadURL(
            url.format({
              pathname: path.join(__dirname, 'static', u.substr(18) , 'index.html'),
              protocol: "file:",
              slashes: true
            })
          );
        } else {
          mainWindow.loadURL(
            url.format({
              pathname: path.join(__dirname, 'static', 'index.html'),
              protocol: "file:",
              slashes: true
            })
          );
        }
    }

    // staticFiles.forEach(e => mainWindow.loadURL(
    //     url.format({
    //       pathname: path.join(__dirname, 'static', e),
    //       protocol: 'file:',
    //       slashes: true
    //     }), {
    //       baseURLForDataURL: 'file:///' + path.join(__dirname, 'static')
    //     }
    // ));
  });
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on('open-file' , (e) => {
  e.preventDefault();
  console.log("Trying Open File for : " , e);
});

app.on('open-url', (e) => {
  e.preventDefault();
  console.log('Trying open URL for : ', e);
});