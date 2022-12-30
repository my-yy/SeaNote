<template>
  <div class="note_item" :class="{'focused':focused}"
       @contextmenu.prevent="showNoteItemMenu" ref="note_item"
       draggable="true"
       @dragstart="onDragStart"
  >
    <div style="display: flex;flex-direction: row;">
      <span class="note_title">{{ note._name }}</span>
      <span style="flex-grow: 1"></span>
      <span class="note_date">{{ modified_at }}</span>
    </div>
    <div class="note_desc">
      {{ note.note_digest }}
    </div>
    <div class="rev_desc">
      <span v-show="revNextAt">{{ revNextAt }}</span>
      <!--      <i class="el-icon-refresh-right"></i> 1周前-->
      <!--      <span style="flex-grow: 1;"></span>-->
      <!--      <i class="icon2 el-icon-star-on star_selected"></i>-->
    </div>
  </div>
</template>

<script>
import {getCurrentWindow, Menu, MenuItem} from "@electron/remote";
import {shell} from "electron";
import moment from "moment";
import rev_util_pjs from "@/utils/rev/rev_util_pjs";

export default {
  name: 'NoteItem',
  props: ["note", "focused"],
  components: {},
  data() {
    return {}
  },
  mounted() {
  },
  computed: {
    modified_at() {
      if (!this.note) {
        return
      }
      const date = this.note.note_modified_at
      return moment(date).format("M-D")
    },
    revNextAt() {
      return rev_util_pjs.noteRevStateDescText(this.note)
    },
  },
  methods: {
    onDragStart(event) {
      event.dataTransfer.setData('text/plain', this.note._path)
    },
    showNoteItemMenu(event) {
      const menu = new Menu()
      const win = getCurrentWindow()
      const SEPARATOR = {
        type: 'separator'
      }
      const DELETE_FILE = {
        label: '删除',
        id: 'delete_note',
        click: async (menuItem, browserWindow) => {
          //直接删除
          await shell.trashItem(this.note._path)
          // fs.rmdirSync(this.note._path, {recursive: true, force: true})
          this.$emit("deleted", this.note)
        }
      }
      const LOCATE_IN_FINDER = {
        label: '在Finder中显示',
        id: 'locate_in_finder',
        click: () => {
          shell.showItemInFolder(this.note._path)
        }
      }
      const item_list = [LOCATE_IN_FINDER, SEPARATOR, DELETE_FILE]
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
  }
}
</script>
<style scoped>
.note_item {
  padding: 20px 10px 20px 10px;
  border-bottom: 1px rgba(211, 211, 211, 0.2) solid;
  /*cursor: pointer;*/
  user-select: none;
}


.note_item.focused {
  background-color: #f1f7f8;
}

.note_item:hover {
  background-color: #f1f7f8;
}

.note_title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.note_desc {
  font-size: small;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.note_date {
  flex-shrink: 0;
  font-size: small;
  color: gray;
}

.rev_desc {
  font-size: small;
}
</style>
