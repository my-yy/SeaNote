function hasQA(html) {
  const has_hr = html.indexOf("<hr>") >= 0
  const highlight = html.indexOf(`class="highlight"`) > 0
  return has_hr || highlight
}


function toReaderModeHtml(html) {
  if (!html) {
    return ""
  }
  const hr_index = html.indexOf("<hr>")
  if (hr_index > 0) {
    const question_part = html.substring(0, hr_index)
    const answer_part = html.substring(hr_index + 4, html.length)
    const answer_part_wrapper = `<div id="answer_area" class="hide">${answer_part}</div>`
    const desc_part = `<div id="answer_hide_desc">答案已隐藏</div>`
    return question_part + answer_part_wrapper + desc_part
  }
  return html
}


export default {
  hasQA,
  toReaderModeHtml
}
