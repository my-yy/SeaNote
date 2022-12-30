'use strict'

import {app, protocol, BrowserWindow, shell} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'

const isMacOS = process.platform === 'darwin';
const isDevelopment = process.env.NODE_ENV !== 'production'
const open_url_out = require("@/utils/background/open_url_out")
import * as window_quit_util from "@/utils/background/window_quit_util"

//====================================================================关闭窗口逻辑


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {scheme: 'app', privileges: {secure: true, standard: true}}
])
require('@electron/remote/main').initialize()

// const Store = require('electron-store');
// Store.initRenderer()

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: isDevelopment ? 1800 : 950,
    height: 600,
    titleBarStyle: "hidden",
    webPreferences: {
      enableRemoteModule: true,
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  require("@electron/remote/main").enable(win.webContents)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  //在浏览器中打开网页
  open_url_out.setUp(win)

  //对于Mac设置关闭窗口时的逻辑:关闭窗口只隐藏窗口
  if (window_quit_util.isMacOS) {
    window_quit_util.setUpOnCloseEvent(win)
  }

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    BrowserWindow.getAllWindows()[0].show()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
