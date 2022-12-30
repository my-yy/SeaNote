<template>
  <div class="NoteListTop">
    <div class="line">
      <!--      <icon-btn icon="far fa-redo" @click="onRefreshClick"></icon-btn>-->
      <icon-btn icon="el-icon-refresh-right" @click="onRefreshClick"></icon-btn>
      <sort-btn :value="list_sort_by" @input="$emit('listSortBy',$event)"></sort-btn>
      <!--      <icon-btn icon="far fa-folder-plus" @click="onNewFolderClick"></icon-btn>-->
      <!--      <icon-btn icon="far fa-plus" @click="onNewNoteClick"></icon-btn>-->
      <icon-btn icon="el-icon-folder-add" @click="onNewFolderClick"></icon-btn>
      <icon-btn icon="el-icon-edit-outline" @click="onNewNoteClick"></icon-btn>
    </div>
    <div class="line line2" v-show="!isInRootFolder">
      <i class="el-icon-arrow-left back_btn" @click="onLocationBackClick"></i>
      <span class="cur_folder_name">{{ currentFolderName }}</span>
      <span style="width: 1.5em;"></span>
    </div>
  </div>
</template>

<script>
import IconBtn from "@/components/IconBtn";
import config_util from "@/utils/config_util";
import smalltalk from "smalltalk";
import path from "path";
import fs from "fs";
import eventbus from "@/utils/eventbus";
import note_util from "@/utils/note_util";
import SortBtn from "@/components/notelist/SortBtn";

export default {
  name: 'NoteListTop',
  props: ["location", "list_sort_by"],
  components: {IconBtn, SortBtn},
  data() {
    return {}
  },
  computed: {
    isInRootFolder() {
      return is_same_path(this.location, config_util.getRepoRoot())
    },
    currentFolderName() {
      if (this.isInRootFolder) {
        return null
      }
      return this.location.split("/").pop()
    },
  },
  methods: {
    onRefreshClick() {
      this.$emit("refresh")
    },
    onLocationBackClick() {
      this.$emit("toParentLocation")
    },
    onNewNoteClick() {
      const note = note_util.createNewNote(this.location)
      eventbus.bus.$emit("newNote", note)
      this.$emit("newNote", note)
    },
    async onNewFolderClick() {
      let text
      try {
        text = await smalltalk.prompt('新建文件夹', '', '文件夹')
        text = text.trim()
      } catch (e) {
        return
      }
      if (text.length === 0) {
        return
      }
      const folder_path = path.join(this.location, text)
      if (fs.existsSync(folder_path)) {
        this.$message.error("文件夹已存在")
        return
      }
      //创建
      fs.mkdirSync(folder_path)
      //刷新
      this.$emit("folderCreated")
    }
  }
}

function is_same_path(p1, p2) {
  p1 = p1 || ""
  p2 = p2 || ""

  if (!p1.endsWith("/")) {
    p1 = p1 + "/"
  }
  if (!p2.endsWith("/")) {
    p2 = p2 + "/"
  }
  return p1 === p2
}

</script>
<style scoped>

.icon1 {
  margin-right: 10px;
}

.NoteListTop {
  flex-shrink: 0;
  padding: 5px;
}

.line {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.line2 {
  margin-top: 10px;
}

.cur_folder_name {
  flex-grow: 1;
  /*border: 1px red solid;*/
  text-align: center;
}

.back_btn {
  padding: 3px;
  border-radius: 3px;
}

.back_btn:hover {
  background-color: lightgray;
}

/*================ 绿色按钮*/
.plus_button {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 10px;
  display: inline-block;

  text-align: center;
  background: #24bc72;
  color: #fff;
  vertical-align: center;
}

.plus_button:hover {
  cursor: pointer;
  background: rgba(97, 184, 140, 0.97);
}

/*返回*/
.back_btn {
  padding: 3px;
  border-radius: 3px;
}

.back_btn:hover {
  background-color: lightgray;
}

</style>
