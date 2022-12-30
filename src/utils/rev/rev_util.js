import config_util from "@/utils/config_util"
import search_util from "@/utils/search_util"
import note_util from "@/utils/note_util"
import time_util from "@/utils/time_util"

function replaceAll(string, search, replacement) {
  return string.replace(new RegExp(search, 'g'), replacement);
}

function str2span(spanStr) {
  //进行转化:
  let arr = replaceAll(spanStr.trim(), "，", ",").split(",");
  //变成数组:
  // console.log(arr);
  let tmp = [];
  let len = 0;
  for (let v of arr) {
    let i = parseInt(v);
    if (i > 0) {//不接受负数与0
      tmp.push(i);
      len = len + 1;
    }
  }
  return tmp
}

function span2str(span) {
  if (span instanceof Array) {
    if (span.length > 0) {
      return span.join("，")
    }
  }
  return "无"
}


function checkNeedRevNotes() {
  const root = config_util.getRepoRoot()
  //1.获得所有的笔记内容
  const all_notes = search_util.searchAllNotes(root)

  //2.获得今天复习需要复习的内容
  const today_rev_note_list = []
  const today_end_ms = new Date().setHours(23, 59, 59, 999)
  for (const note_pkg_path of all_notes) {
    const note = note_util.readMeta(note_pkg_path)
    if (!note) {//
      continue
    }

    if (note.rev_state !== "rev") {
      continue
    }
    //判断复习日期：
    const plans = note.rev_plan
    if (plans.length === 0) {
      continue
    }
    const rev_at = plans[0]
    const need_rev = today_end_ms >= rev_at
    if (need_rev) {
      today_rev_note_list.push(note)
    }
  }
  return today_rev_note_list
}


function calc_last_rev_date_obj(note) {
  let lastRevAt
  if (note.rev_history.length === 0) {//首次复习
    lastRevAt = note.rev_learned_at
  } else {
    const last = note.rev_history[note.rev_history.length - 1]
    lastRevAt = last.time
  }
  return lastRevAt
}

function getDiffStr(diff) {
  diff = parseInt(diff)
  if (diff === 0) {
    return "今日"
  }
  if (diff === 1) {
    return "昨日"
  }
  return diff + "天前"
}


function needTodayRev(note) {
  if (!note || note.rev_state !== 'rev') {
    return false
  }
  //next rev at
  const plan = note.rev_plan[0]
  if (!plan) {
    return
  }
  const todayEnd_ms = time_util.dateEnd(new Date())
  return plan.getTime() <= todayEnd_ms
}

export default {
  str2span,
  span2str,
  checkNeedRevNotes,
  calc_last_rev_date_obj,
  needTodayRev
}
