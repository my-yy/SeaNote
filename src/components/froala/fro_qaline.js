import FroalaEditor from "froala-editor";

//图标：
FroalaEditor.DefineIcon('icon_qa_line', {NAME: "tag", SVG_KEY: "inlineClass"});
// FroalaEditor.DefineIcon('icon_qa_line', {NAME: 'QA', template: 'text'});

FroalaEditor.RegisterCommand('qa_line', {
  title: '答案分割线',
  icon: 'icon_qa_line',
  callback: function () {
    const editor = this
    const html = editor.html.get()
    const line = `<hr class="qa">`
    if (html.indexOf(line) >= 0) {
      return
    }
    editor.html.insert(line)
  },
  refreshAfterCallback: true,
  refresh: function (cur_btn) {
    const editor = this
    const is_highlight = editor.format.is("hr", {"class": "qa"});
    cur_btn.toggleClass("fr-active", is_highlight).attr("aria-selected", is_highlight)
  }
})


