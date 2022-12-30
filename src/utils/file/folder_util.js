const fs = require("fs")
const path = require("path")
const json_util = require("@/utils/file/json_util");
const config_util = require("@/utils/config_util");
const assert = require("assert-plus");
const CONF_FILE_NAME = ".folder_config.json"
const removeTrailingPathSeparator = require('remove-trailing-path-separator')

function removeFolderConfig(folder_full_path) {
  const desc_path = path.join(folder_full_path, CONF_FILE_NAME)
  if (fs.existsSync(desc_path)) {
    fs.rmSync(desc_path)
    console.log("delete folder_description:", desc_path)
  }
}

function getDefFolderConfig() {
  return {
    isolate_rev_alg: false,
    rev_alg: "ys",
    rev_span: [1, 3, 7, 15, 30, 60]
  }
}


function readFolderDesc(folder_path) {
  const desc_path = path.join(folder_path, CONF_FILE_NAME)
  let obj
  if (fs.existsSync(desc_path)) {
    obj = json_util.readJson(desc_path)
  } else {
    obj = getDefFolderConfig()
  }

  obj._name = path.basename(folder_path)
  obj._path = folder_path

  //返回一个默认的
  return obj
}


function writeFolderConfig(folder) {
  writeFolderConfig2(folder._path, folder)
}

function writeFolderConfig2(folder_path, folder) {
  assert.ok(fs.existsSync(folder_path))
  const desc_path = path.join(folder_path, CONF_FILE_NAME)
  json_util.writeJson(desc_path, folder)
}


function findAlgTemplate(start_path, root_path = null) {
  if (!root_path) {
    root_path = config_util.getRepoRoot()
  }

  //1.路径变为标准格式
  start_path = removeTrailingPathSeparator(start_path)
  root_path = removeTrailingPathSeparator(root_path)

  //2.开始逐级向上寻找
  assert.ok(start_path.startsWith(root_path))
  const start_path_arr = start_path.split("/")
  const root_path_arr = root_path.split("/")
  const count = start_path_arr.length - root_path_arr.length
  //在中间目录中寻找 /ROOT/[A,B,C]
  for (let i = count; i >= 1; i--) {
    const sub_path = start_path_arr.slice(0, root_path_arr.length + i).join("/")
    const obj = getConfigOrNone(sub_path)
    if (obj && obj.isolate_rev_alg) {//如果存在，且是独立的复习模式
      return obj
    }
  }
  //3.说明在中间目录中并未找到，因此在root中寻找
  const root_obj = getConfigOrNone(root_path)
  if (root_obj) {//对于root不验证独立性
    return root_obj
  }
  return getDefFolderConfig()
}

function getConfigOrNone(folder_path) {
  const desc_path = path.join(folder_path, CONF_FILE_NAME)
  if (fs.existsSync(desc_path)) {
    return json_util.readJson(desc_path)
  }
  return null
}


function createDefaultFolderConfigInRootPathIfNecessary() {
  const root_path = config_util.getRepoRoot()
  const conf_path = path.join(root_path, CONF_FILE_NAME)
  if (fs.existsSync(conf_path)) {//创建
    return
  }
  const def_config = getDefFolderConfig()
  writeFolderConfig2(root_path, def_config)
  console.log("创建了默认的复习模式")
}


module.exports = {
  CONF_FILE_NAME,
  readFolderDesc,
  writeFolderConfig,
  writeFolderConfig2,
  removeFolderConfig,
  getDefFolderConfig,
  findAlgTemplate,
  createDefaultFolderConfigInRootPathIfNecessary
}

