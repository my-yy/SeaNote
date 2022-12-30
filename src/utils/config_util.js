const isDevelopment = process.env.NODE_ENV !== 'production'
const {remote} = require('electron');

const path = require("path")
const fs = require("fs");

function mkdir_if_necessary(folder_path) {
  if (!fs.existsSync(folder_path)) {
    fs.mkdirSync(folder_path, {recursive: true})
  }
}

const userDataDir = remote.app.getPath("userData")
let sync_root = path.join(userDataDir, "sync")
console.log("sync_root", sync_root)

//创建默认存储文件夹
mkdir_if_necessary(sync_root)
// localStorage.setItem("repo_path", sync_root)

if (isDevelopment) {
  sync_root = "/Users/my/Documents/ONE/18_复习内容库/"
}

function getRepoRoot() {
  return localStorage.getItem("repo_path") || sync_root
}

function setRepoRoot(the_path) {
  localStorage.setItem("repo_path", the_path)
}

const testing_mode = isDevelopment

module.exports = {
  userDataDir,
  getRepoRoot,
  setRepoRoot,
  testing_mode
}
