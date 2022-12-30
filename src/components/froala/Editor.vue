<template>
  <div id="fro_container"></div>
</template>

<script>
import img_load_saver from "@/utils/img_load_saver";

require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')
import FroalaEditor from "froala-editor";
import "@/components/froala/fro_config"
import "@/components/froala/fro_highlight"
import "@/components/froala/fro.css"
import toolbar from "@/components/froala/toolbar";
import fro_auto_resizer from "@/components/froala/fro_auto_resizer";
import "@/components/froala/fro_qaline";

import fs from "fs";
import path from "path";
import $ from "jquery";
import note_util from "@/utils/note_util";

const self_handle_paste_image = false

function newEditor(selector, config) {
  return new Promise(((resolve) => {
    const editor = new FroalaEditor(selector, config, () => {
      resolve(editor)
    })
  }))
}

const LinkProtocols = FroalaEditor.LinkProtocols
const aim = "file"
if (LinkProtocols.indexOf(aim) < 0) {
  LinkProtocols.push(aim)
}

export default {
  name: 'Editor',
  components: {},
  props: [],
  data() {
    return {
      note: null
    }
  },
  async mounted() {
    const link_conf = {
      //'linkOpen'
      linkEditButtons: ['linkEdit', 'linkRemove'],
      linkList: [] //去掉放大镜中的链接选项
    }
    const pragraph = {//段落
      paragraphFormat: {
        H1: 'Heading 1',
        H2: 'Heading 2',
        H3: 'Heading 3',
        N: 'Normal',
      },
      paragraphDefaultSelection: "Normal",
      paragraphFormatSelection: true, //显示当前正在编辑的是标题\正文
    }
    const image = {
      imageResize: true,
      imageDefaultAlign: 'left',
      // imageEditButtons: ['imageAlign'],
      imageEditButtons: [],
      imageInsertButtons: ["imageUpload"],
      pasteAllowLocalImages: true,
      imagePaste: !self_handle_paste_image,//禁止paste事件
      // imageDefaultDisplay: 'inline'
    }
    const table = {
      tableEditButtons: [
        'tableRows', 'tableColumns',
      ],
      tableResizer: true,
    }

    const events = {
      contentChanged: this.onContentChange,
      drop: this.onDrop,
      'image.inserted': this.onImageInserted
    }


    const conf = {
      ...pragraph,
      ...image,
      ...table,
      ...link_conf,
      tabSpaces: 4,
      language: "zh_cn",
      placeholderText: "输入内容",
      toolbarButtons: toolbar.toolbar,
      events: events,
    }
    this.editor = await newEditor("#fro_container", conf)
    fro_auto_resizer.setUp(this.editor)
    fro_auto_resizer.changeSizeCore()

    //paste事件
    if (self_handle_paste_image) {
      window.addEventListener("paste", this.pasteEventListener)
    }
  },
  beforeDestroy() {
    window.removeEventListener("paste", this.pasteEventListener)
    fro_auto_resizer.tearDown()
  },
  methods: {
    async pasteEventListener(pasteEvent) {
      const editor = this.editor
      if (!editor) {
        return
      }

      //1.检查是否是粘贴图片，是则进行处理
      const item = pasteEvent.clipboardData.items[0];
      if (!item || item.type.indexOf("image") === -1) {
        return
      }

      //2.
      const blob = item.getAsFile();
      const suffix = blob.type.split("/")[1]
      // assert(!!suffix)
      // const key = new Date().getTime() + '.' + suffix

      const URLObj = window.URL || window.webkitURL;
      const imgURL = URLObj.createObjectURL(blob);
      console.log("imgURL", imgURL)


      // const {width, height, url} = await image_util.getImageSizeFromBlob(blob)

      //不设置高度，为了防止非max-width引起的非等比例缩放
      // const html = `<img data-ky-key="${key}" src="${url}" width="${width}"/>`
      // console.log("on paste:", html)
      const html = `<img src="${imgURL}"/>`
      editor.html.insert(html, true);

      this.saveImage(key, blob)
    },
    focusFirstLine() {
      console.log("focusFirstLine")
      this.editor.events.focus(true);
    },
    async setEditorHTML(html, note) {
      if (this.note && this.note !== note && this.note._need_save) {//检查是否有待保存的内容，立即保存
        clearTimeout(this.save_pointer)
        const last_html = this.editor.html.get()
        console.log("立即保存:", this.note._name)
        await this.saveContent(last_html, this.note)
      }
      this.note = note
      // this.editor.html.set('<p>My custom paragraph.</p><p><img src="file:///Users/my/Documents/CODE/WebstormProjects/87_new_note_design/1_data/未命名 6.m2e/assets/90cac2a5680cff6f3c6bf101879fb258.png" style="width: 300px;" class="fr-fic fr-fil fr-dib"><br></p>');
      this.omit_content_change = true
      this.editor.html.set(html)
      setTimeout(() => {
        this.omit_content_change = false
      }, 1000)
      await this.$nextTick()
      //刚开始的时，虽然mount了，但此时container为none，那么或许获取不到正确的高度，但是当主动调用set时，应该是会显示的，那么重新设置一下高度
      fro_auto_resizer.changeSizeCore()
    },
    async onContentChange() {
      if (this.omit_content_change) { //忽视变化事件，因为editor.html.set(html) 也会触发这个事件
        console.log("omit_content_change")
        return
      }
      console.log("onContentChange")
      let html = this.editor.html.get()
      const note = this.note
      if (!note) {
        console.error("内容改变，但是note为空")
        return
      }
      note._need_save = true
      clearTimeout(this.save_pointer)
      this.save_pointer = setTimeout(() => {
        this.saveContent(html, note)
      }, 1000)
    },
    async saveContent(html, note) {
      const save_folder = note._path
      //1.转换html
      html = await img_load_saver.toRelativePath(html, save_folder)

      //2.生成摘要
      const plain_text = $(html).text().trim()
      let digest = plain_text
      if (digest.length > 20) {
        digest = digest.substring(0, 20)
      }
      note.note_digest = digest

      //3.更新编辑日期
      note.note_modified_at = new Date()

      //4.保存
      fs.writeFileSync(path.join(save_folder, "index.html"), html)
      note_util.writeMeta(note)
      note._need_save = false
      console.log("保存笔记：", save_folder.split("/").pop())
    },
    onDrop(dropEvent) {
      console.log("dropEvent", dropEvent)
    },
    async onImageInserted($img, response) {
      // const url = $img.attr('src')
      // console.log("onImageInserted:", url)
      console.log("onImageInserted width:", $img.css("width"))
      $img.css({"width": ""})
      // $img.removeClass() //去除所有的类
      $img.removeAttr('class'); //去除所有的类

    },
    getData() {
      return this.editor.html.get()
    }
  },
}
</script>

<style scoped>
#fro_container {
  /*border: 2px red solid;*/
  overflow-y: hidden;
  /*froala尺寸通过此容器计算，通过设置hidden以保证内容不会超长*/
  flex-grow: 1;

}

</style>
