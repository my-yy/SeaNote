import path from "path";
import fs from "fs";
import time_util from "@/utils/time_util";
import moment from "moment";
import json_util from "@/utils/file/json_util";
import folder_util from "@/utils/file/folder_util";
import config_util from "@/utils/config_util";
import assert from "assert-plus"
import img_load_saver from "@/utils/img_load_saver";
import {v4 as uuidv4} from 'uuid';


function findValidName(current_path, BASE_NAME = "笔记") {
  let name = null;
  let index = 0;
  let pkg_path = null;
  while (true) {
    if (index === 0) {
      name = BASE_NAME
    } else {
      name = BASE_NAME + " " + index
    }
    pkg_path = path.join(current_path, name + ".m2e")
    if (fs.existsSync(pkg_path)) {//如果存在，则换一个新的名称
      index += 1
    } else {//可行，创建路径
      return name
    }
  }
}

const OS_VERSION = require('os').release()

//  22.1.0

function createNewNote(current_path) {
  const name = findValidName(current_path)
  const pkg_path = path.join(current_path, name + ".m2e")
  const now_date = new Date()
  const note_obj = {
    //============================笔记的内容
    note_create_at: now_date,
    note_modified_at: now_date,
    note_digest: "",

    //============================复习内容：
    rev_state: "rev",
    rev_learned_at: new Date(),
    rev_history: [],

    //============================文件版本格式：
    uuid: uuidv4(),
    meta_format_version: 1,
    meta_created_at: now_date,
    meta_created_app_version: "2.0.1",
    meta_created_os_version: OS_VERSION,
    meta_created_os: "mac",
  }
  //复习模式
  const config_obj = folder_util.findAlgTemplate(current_path)
  // console.log("config findAlgTemplate:", config_obj)
  note_obj.rev_alg = config_obj.rev_alg

  if (note_obj.rev_alg === 'ys') {
    if (config_util.testing_mode) {
      const test_span = [0, 1, 2]
      note_obj.rev_plan = createPlanListBySpan(test_span)
      console.log("测试模式，复习间隔为：", test_span)
    } else {
      note_obj.rev_plan = createPlanListBySpan(config_obj.rev_span)
    }
  } else {
    assert.ok(note_obj.rev_alg === 'ak')
    if (config_util.testing_mode) {
      note_obj.rev_plan = createPlanListBySpan([0])
      console.log("测试模式，复习间隔为0")
    } else {
      note_obj.rev_plan = createPlanListBySpan([1])
    }
  }

  if (config_util.testing_mode) {
    note_obj.rev_learned_at = moment().add(-1, 'days').toDate()
    console.log("测试模式，学习日期调整为昨天")
  }

  //补充字段
  note_obj["_name"] = name
  note_obj["_path"] = pkg_path

  //写入（不然如果上面出错了，文件创建的不完整）
  fs.mkdirSync(pkg_path)
  fs.writeFileSync(path.join(pkg_path, "index.html"), "")
  json_util.writeJson(path.join(pkg_path, "meta.json"), note_obj)
  return note_obj
}


function createPlanListBySpan(span) {
  const rev_plan = []
  let counter = 0
  for (const s of span) {
    counter += s
    const plan = moment().add(counter, 'days').toDate()
    rev_plan.push(plan)
  }
  return rev_plan
}


function writeMeta(note) {
  const pkg_path = note._path
  assert.ok(fs.existsSync(pkg_path))
  json_util.writeJson(path.join(note._path, "meta.json"), note)
}

function readHtml(note) {
  console.log("note", note)
  const html_path = path.join(note._path, "index.html")
  assert.ok(fs.existsSync(html_path))
  const rawHtml = fs.readFileSync(html_path).toString()
  const html = img_load_saver.toAbsolutePath(rawHtml, note._path)
  return html
}

function readMeta(pkg_path) {
  let note_obj
  try {
    //文件可能不存在（如iCloud未同步）或者 格式有错误
    const meta_path = path.join(pkg_path, "meta.json")
    note_obj = json_util.readJson(meta_path)
  } catch (e) {
    return null
  }
  note_obj._name = path.basename(pkg_path).replace(".m2e", "")
  note_obj._path = pkg_path
  return note_obj
}

export default {
  createNewNote,
  writeMeta,
  readHtml,
  readMeta,
  createPlanListBySpan
}
