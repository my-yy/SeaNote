import FroalaEditor from "froala-editor";

//图标：
FroalaEditor.DefineIcon('icon_highlight', {NAME: "tag", SVG_KEY: "inlineClass"});
// FroalaEditor.DefineIcon('icon_highlight', {NAME: 'Hi', template: 'text'});


FroalaEditor.RegisterCommand('highlight', {
  title: '高亮',
  icon: 'icon_highlight',
  callback: function () {
    const editor = this
    editor.format.toggle("span", {"class": "highlight"})
  },
  refreshAfterCallback: true,
  refresh: function (cur_btn) {
    const editor = this
    const is_highlight = editor.format.is("span", {"class": "highlight"});
    cur_btn.toggleClass("fr-active", is_highlight).attr("aria-selected", is_highlight)
  }
})


