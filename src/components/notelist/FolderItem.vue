<template>
  <div class="folder_item" @contextmenu.prevent="showContextMenu"
       draggable="true"
       @dragstart="onDragStart"
       @dragenter="onDragEnter"
       @drop="onDrop"
       @dragover="onDragOver"
  >
    <div class="line1">
      <img class="folder_img" src="@/assets/1_folder.png">
      {{ folder._name }}
    </div>

    <div class="desc">
      {{ descText }}
    </div>
    <div>
      <!--      {{ folder }} {{ descText }}-->
    </div>

    <dialog-folder v-if="showSettingDialog" :folder="folder" @close="showSettingDialog=false">
    </dialog-folder>
  </div>
</template>

<script>
import {getCurrentWindow, Menu, MenuItem} from "@electron/remote";
import fs from "fs";
import path from "path";
import {shell} from "electron";
import DialogFolder from "@/components/folder/FolderSettingDialog";
import filename_util from "@/utils/file/filename_util";
import smalltalk from "smalltalk";

export default {
  name: 'FolderItem',
  props: ["folder"],
  components: {DialogFolder},
  data() {
    return {
      showSettingDialog: false
    }
  },
  computed: {
    descText() {
      const folder = this.folder
      if (!folder) {
        return
      }
      if (!folder.isolate_rev_alg) {
        return
      }

      if (folder.rev_alg === 'ys') {
        return folder.rev_span.join(", ")
      }
      return "anki"
    }
  },
  methods: {
    onDragStart(event) {
      event.dataTransfer.setData('text/plain', this.folder._path)
      event.dataTransfer.effectAllowed = "move";
    },
    onDragEnter(event) {
      event.preventDefault()
    },
    onDragOver(event) {
      event.preventDefault()
    },
    onDrop(event) {
      event.preventDefault()
      const from_path = event.dataTransfer.getData("text/plain")
      if (!from_path) {
        return
      }
      if (!fs.existsSync(from_path)) {
        return;
      }
      const to_folder = this.folder._path
      if (from_path === to_folder) {
        //自己拖拽到自己
        return;
      }


      const name = path.basename(from_path)
      const new_path = path.join(to_folder, name)
      // console.log(from_path, "===>", new_path)
      fs.renameSync(from_path, new_path)
      this.$emit("fileDragMoved", {
        "from_path": from_path,
      })
    },
    showContextMenu(event) {
      const menu = new Menu()
      const win = getCurrentWindow()
      const SEPARATOR = {
        type: 'separator'
      }
      const DELETE_FILE = {
        label: '删除',
        id: 'delete_folder',
        click: async (menuItem, browserWindow) => {
          const the_path = this.folder._path
          await shell.trashItem(the_path)
          // fs.rmdirSync(this.folder._path, {recursive: true, force: true})
          this.$emit("deleted")
        }
      }

      const RENAME = {
        label: '重命名文件夹',
        id: 'rename',
        click: (menuItem, browserWindow) => {
          this.changeFolderName()
        }
      }
      const REVEAL_IN_FINDER = {
        label: '在Finder中显示',
        id: 'revealInFinder',
        click: (menuItem, browserWindow) => {
          const the_path = this.folder._path
          shell.showItemInFolder(the_path)
        }
      }
      const Folder_Setting = {
        label: '设置',
        id: 'folder_setting',
        click: () => {
          this.showSettingDialog = true
        }
      }


      const item_list = [
        RENAME,
        REVEAL_IN_FINDER,
        SEPARATOR,
        Folder_Setting,
        SEPARATOR,
        DELETE_FILE]
      item_list.forEach(item => {
        menu.append(new MenuItem(item))
      })
      menu.popup([{window: win, x: event.clientX, y: event.clientY}])

      //监听显示、消失事件
      menu.addListener('menu-will-show', () => {
      });
      menu.addListener('menu-will-close', () => {
        // dom.style.border = tmp_border
      });
    },
    async changeFolderName() {
      let text
      try {
        text = await smalltalk.prompt('重命名文件夹', '', this.folder._name)
        text = text.trim()
      } catch (e) {
        return
      }

      //1.名称合法性
      const name = text.trim()
      if (name.length === 0) {
        return
      }

      if (!filename_util.isValid(name)) {
        this.$message.error('文件夹名称不合法');
        return;
      }

      //2.判断文件名是否发生更改
      const old_name = this.folder._name
      const new_name = name
      if (old_name === new_name) {//文件夹名称发生变化
        return
      }

      //3.判断文件夹名是否重复
      const new_path = path.join(path.dirname(this.folder._path), new_name)
      if (fs.existsSync(new_path)) {
        this.$message.error("文件夹名称重复")
        return
      }

      //4.进行磁盘文件修改
      const old_path = this.folder._path
      fs.renameSync(old_path, new_path)
      console.log(`文件夹名称更改:${old_path}==>${new_path}`)
      this.folder._path = new_path
      this.folder._name = new_name

    }


  }
}
</script>
<style scoped>

.folder_item {
  padding: 20px 10px 20px 10px;
  border-bottom: 1px rgba(211, 211, 211, 0.2) solid;
  /*cursor: pointer;*/
  /*display: flex;*/
  /*align-items: center;*/
  user-select: none;
}

.line1 {
  display: flex;
  align-items: center;
}

.desc {
  font-size: small;
}

.folder_img {
  width: 30px;
  margin-right: 5px;
}

</style>
