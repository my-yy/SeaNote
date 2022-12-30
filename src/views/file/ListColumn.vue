<template>
  <div class="ListColumn">
    <note-list-top
      :location="current_path"
      :list_sort_by="list_sort_by"
      @listSortBy="changeListSortBy"
      @toParentLocation="OnToParentLocationClick"
      @folderCreated="onNewFolderCreated"
      @refresh="onRefreshClick"
      @newNote="onNewNoteCreated"
    >
    </note-list-top>
    <div v-show="note_list.length+folder_list.length===0" class="no_content">无内容</div>
    <div class="list_wrapper">
      <folder-item v-for="f in folder_list_sorted" :folder="f"
                   @dblclick.native="onFolderDBLClick(f)"
                   @deleted="onFolderDeleted"
                   @fileDragMoved="onFileDragMoved"
      >
      </folder-item>
      <note-item v-for="note in note_list_sorted"
                 :note="note"
                 :focused="note===cur_note"
                 @click.native="$emit('clickNote',note)"
                 @deleted="onNoteDeleted"
      >
      </note-item>
    </div>
  </div>
</template>

<script>
import NoteItem from "@/components/notelist/NoteItem";
import FolderItem from "@/components/notelist/FolderItem";
import NoteListTop from "@/components/notelist/NoteListTop";
import config_util from "@/utils/config_util";
import fs from "fs";
import path from "path";
import note_util from "@/utils/note_util";
import folder_util from "@/utils/file/folder_util";
import time_util from "@/utils/time_util";
import eventbus from "@/utils/eventbus";

export default {
  name: 'ListColumn',
  components: {NoteItem, FolderItem, NoteListTop},
  props: ["cur_note"],
  data() {
    return {
      folder_list: [],
      note_list: [],
      current_path: config_util.getRepoRoot(),
      list_sort_by: "name", //name,mtime
    }
  },
  computed: {
    folder_list_sorted() {
      return this.folder_list.sort((a, b) => a._name.localeCompare(b._name, undefined, {numeric: true}));
    },
    note_list_sorted() {
      const note_list = this.note_list
      if (this.list_sort_by === "name") {
        return note_list.sort((a, b) => a._name.localeCompare(b._name, undefined, {numeric: true}));
      }

      if (this.list_sort_by === "mtime") {
        return note_list.sort((a, b) => -a.note_modified_at.getTime() + b.note_modified_at.getTime())
      }
      return note_list
    }
  },
  mounted() {
    this.list_sort_by = localStorage.getItem("list_sort_by") || "mtime"
    this.init()
    eventbus.bus.$on("navi_bar:refresh", this.onRefreshClick)
  },
  beforeDestroy() {
    eventbus.bus.$off("navi_bar:refresh", this.onRefreshClick)
  },
  methods: {
    onRefreshClick() {
      this.init()
      this.$message.success("已刷新文件列表")
    },
    changeListSortBy(val) {
      this.list_sort_by = val
      localStorage.setItem("list_sort_by", val)
    },
    onNewNoteCreated(note) {
      // todo: 为什么没有触发排序？
      this.note_list.push(note)
      // console.log("note", note)
      this.$emit('newNote', note)
    },
    onNewFolderCreated() {
      this.init()
    },
    onFolderDeleted(f) {
      this.init()
    },
    onNoteDeleted(note) {
      this.init()
      //发送一个删除事件，以确保编辑页面能进行切换
      this.$emit('deleteNote', note)
      // eventbus.bus.$emit("note_item:deleted", note._path)
    },
    onFolderDBLClick(folder) {
      this.current_path = path.join(this.current_path, folder._name)
      this.init()
    },
    init() {
      const the_path = this.current_path
      //1.获得当前路径下的所有文件
      const names = fs.readdirSync(the_path)

      //2.过滤隐藏文件
      const names_valid = names.filter(name => !name.startsWith(".") && !name.startsWith("~"))

      //3.获得所有的文件夹
      const folder_names = names_valid.filter(name => fs.lstatSync(path.join(the_path, name)).isDirectory())

      //4.判断是文件夹还是笔记
      const real_folders = folder_names.filter(name => !name.endsWith(".m2e"))
      const note_names = folder_names.filter(name => name.endsWith(".m2e"))

      const folder_object_list = real_folders.map(f => folder_util.readFolderDesc(path.join(the_path, f)))

      const note_object_list = note_names.map(name => note_util.readMeta(path.join(the_path, name))).filter(obj => !!obj)
      //加一步filter，因为可能meta文件不存在或有错误

      this.note_list = note_object_list
      this.folder_list = folder_object_list
    },
    OnToParentLocationClick() {
      const tmp = this.current_path.split("/")
      tmp.pop()
      this.current_path = tmp.join("/")
      this.init()
    },
    onFileDragMoved(obj) {
      const from_path = obj.from_path
      //检查元素
      const is_note_file = from_path.endsWith(".m2e")
      const the_list = is_note_file ? this.note_list : this.folder_list
      const the_index = the_list.findIndex(obj => obj._path === from_path)
      the_list.splice(the_index, 1)
      // console.log("the_list", the_list)
      if (is_note_file) {
        eventbus.bus.$emit("list_column:note_moved", from_path)
      }
    },
  },


}
</script>

<style scoped>
.ListColumn {
  padding-top: 20px;
  width: 240px;
  min-width: 240px;
  border-right: 1px lightgray solid;
  display: flex;
  flex-direction: column;
  /*border: 1px red solid;*/
}

.list_wrapper {
  overflow-y: auto;
}

.no_content {
  text-align: center;
  color: gray;
  margin-top: 20vh;
  /*border: 1px red solid;*/
}


</style>
