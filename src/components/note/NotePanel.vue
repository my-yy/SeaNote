<template>
  <div class="NotePanel">
    <note-tool-bar :is-read-mode="isReadMode"
                   :note="note"
                   @toEdit="onToEditModeClick"
                   @toRead="onToReadModeClick"
    ></note-tool-bar>

    <input v-model="note_name" ref="noteName"
           class="noteName"
           :disabled="isReadMode"
           @change="onNameInputChange"
           @keyup.enter=""/>

    <editor v-show="!isReadMode" ref="editor"></editor>
    <reader-display v-show="isReadMode" :html="html"></reader-display>
  </div>

</template>

<script>
import ReaderDisplay from "@/components/note/ReaderDisplay";
import NoteToolBar from "@/components/note/NoteToolBar";
import fs from "fs";
import path from "path";
import IconBtn from "@/components/IconBtn";
import img_load_saver from "@/utils/img_load_saver";
// import Editor from "@/components/note/Editor";
import Editor from "@/components/froala/Editor";
import filename_util from "@/utils/file/filename_util"

export default {
  name: 'NotePanel',
  props: [],
  components: {IconBtn, ReaderDisplay, NoteToolBar, Editor},
  data() {
    return {
      isReadMode: false,
      show_left_part: true,
      note_name: null,
      note: null,
      html: null
    }
  },
  mounted() {
    // this.isReadMode = localStorage.getItem("isReadMode") === "true"
  },
  methods: {
    clearDisplay() {
      this.note = null
      this.html = null
    },
    async displayNote(cur_note, is_new_note = false) {
      this.note = cur_note
      this.note_name = cur_note._name
      //1.读取内容
      const rawHtml = fs.readFileSync(path.join(cur_note._path, "index.html")).toString()
      const html = img_load_saver.toAbsolutePath(rawHtml, cur_note._path)

      if (is_new_note) {//切换到编辑模式
        this.$refs.editor.setEditorHTML(html, this.note)
        this.isReadMode = false
        await this.$nextTick() //有可能标题输入框尚未加载完成
        this.$refs.noteName.select()
        this.$refs.noteName.focus()
        return;
      }
      this.html = html
      // console.log("html", html)
      this.$refs.editor.setEditorHTML(html, this.note)
    },
    onNameInputChange() {
      console.log("onNameInputChange")
      this.onNameInputEnterEvent()
    },
    onNameInputEnterEvent() {
      const new_name = this.note_name
      const old_name = this.note._name
      const old_full_path = this.note._path
      if (new_name === old_name) {//未发生变化
        this.$refs.editor.focusFirstLine();
        return
      }
      const new_pkg_path = path.join(path.dirname(old_full_path), new_name + ".m2e")
      if (fs.existsSync(new_pkg_path)) {
        this.$message.error("名称重复")
        return;
      }
      if (!filename_util.isValid(new_name)) {
        this.$message.error("笔记名是无效的文件名")
        return;
      }

      console.log({old_full_path, new_path: new_pkg_path})
      //重命名package
      fs.renameSync(old_full_path, new_pkg_path)
      //更新结果：
      this.note._name = new_name
      this.note._path = new_pkg_path

      //聚焦到编辑框
      this.$refs.editor.focusFirstLine();
    },
    onToEditModeClick() {
      this.isReadMode = false
    },
    onToReadModeClick() {
      const html = this.$refs.editor.getData();
      this.html = html
      this.isReadMode = true
    },

  }
}
</script>
<style scoped>
.NotePanel {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 3px;
  /*overflow-y: hidden;*/
  /*border: 3px green solid;*/
}

.noteName {
  border: none;
  font-size: 1.3em;
  /*border: 1px red solid;*/
  padding-left: 10px;

}

.noteName:focus {
  outline: none;
}


</style>
