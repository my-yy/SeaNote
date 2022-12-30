<template>
  <div class="file_view">
    <list-column :cur_note="cur_note"
                 @newNote="onNewNoteCreated"
                 @deleteNote="onNoteDeleted"
                 @clickNote="onNoteItemClick"
    >
    </list-column>
    <note-panel ref="NotePanel" v-show="cur_note"></note-panel>
    <div class="no_content" v-show="!cur_note">
      <div class="icon_wrapper">
        <i class="el-icon-folder"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ListColumn from "@/views/file/ListColumn";
import IconBtn from "@/components/IconBtn";
import config_util from "@/utils/config_util"
import json_util from "@/utils/file/json_util"
import fs from "fs"
import path from "path"
import NotePanel from "@/components/note/NotePanel";
import eventbus from "@/utils/eventbus";

export default {
  name: 'FolderView',
  components: {IconBtn, NotePanel, ListColumn},
  data() {
    return {
      cur_note: null,
    }
  },
  computed: {},
  async mounted() {
    //ListColumn发出
    // note 移动到 文件夹事件
    eventbus.bus.$on("list_column:note_moved", this.onNoteMoved)
  },
  beforeDestroy() {
    eventbus.bus.$off("list_column:note_moved", this.onNoteMoved)
  },
  methods: {
    onNoteMoved(note_pkg_path) {
      if (this.cur_note && this.cur_note._path === note_pkg_path) {
        this.cur_note = null;
      }
    },
    onNoteDeleted(note) {
      if (this.cur_note && this.cur_note._path === note._path) {
        this.cur_note = null
      }
    },
    onNewNoteCreated(note) {
      this.cur_note = note
      this.$refs.NotePanel.displayNote(note, true)
    },
    onNoteItemClick(note) {
      this.cur_note = note
      this.$refs.NotePanel.displayNote(note)
    },
  }
}
</script>

<style scoped>
.file_view {
  display: flex;
  flex-direction: row;
}

/*======================================================================================列表*/
.list_wrapper {
  flex-grow: 1;
  overflow-y: auto;
  /*border: 1px red solid;*/
}

.no_content {
  /*border: 1px red solid;*/
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icon_wrapper {
  text-align: center;
}

.icon_wrapper > i {
  font-size: 4em;
  font-weight: bold;
  color: lightgray;
}


.focused {
  /*background-color: lightgray;*/
}


</style>
