<template>
  <div class="NoteInfo" v-if="note">
    <div>创建日期：{{ date2str(note.note_create_at, true) }}</div>
    <div>修改日期：{{ date2str(note.note_modified_at, true) }}</div>


    <template v-if="note.rev_state==='rev'">
      <div>
        复习算法：
        <btn-change-rev-alg :note="note" ref="btn_change_rev_alg"/>
      </div>
      <div>
        上次复习：{{ revLastAt }}
      </div>
      <div>
        下次复习：<span class="btn_change_next_rev_at" @click="onChangeNextAtClick">{{ revNextAt }}</span>
      </div>

      <template v-if="note.rev_alg==='ys'">
        <div class="new_sec_text">复习流程</div>
        <PlanView :note="note"></PlanView>
      </template>
    </template>


    <div style="margin-top: 1em;"></div>
    <div v-if="note.rev_state ==='new'">
      当前笔记为"未学习"状态，
      <el-link @click="markAsLearned">点击此处</el-link>
      开始复习流程，首次复习将安排到明天
    </div>


    <div v-if="note.rev_state==='rev'" class="center_btn_wrapper">
      <el-link @click="pauseRev"> 暂停复习</el-link>
    </div>

    <div v-if="note.rev_state==='pause'" class="center_btn_wrapper">
      <el-link @click="resumeRev">继续复习流程</el-link>
    </div>

    <div style="margin-top: 1em;"></div>
    <div v-if="note.rev_state==='pause'" class="center_btn_wrapper">
      <el-link @click="clearRevLogs">重置为未学习状态</el-link>
    </div>

  </div>
</template>

<script>
import time_util from "@/utils/time_util";
import moment from "moment/moment";
import note_util from "@/utils/note_util";
import folder_util from "@/utils/file/folder_util";
import path from "path";
import PlanView from "@/components/note/PlanView";
import smalltalk from "smalltalk";
import BtnChangeRevAlg from "@/components/note/BtnChangeRevAlg";
import rev_util_pjs from "@/utils/rev/rev_util_pjs";

export default {
  name: 'NoteInfo',
  props: ["note"],
  components: {PlanView, BtnChangeRevAlg},
  data() {
    return {}
  },
  computed: {
    isRevPaused() {
      if (!this.note) {
        return false
      }
      return this.note.rev_state === "pause"
    },
    revNextAt() {
      return rev_util_pjs.revNextAtText(this.note)
    },
    revLastAt() {
      return rev_util_pjs.revLastAtText(this.note)
    }
  },
  methods: {
    date2str: time_util.date2str,
    hideBtnChangeRevAlg() {
      const dom = this.$refs.btn_change_rev_alg
      if (dom) {
        dom.hide()
      }
    },
    async onChangeNextAtClick() {
      const date = this.note.rev_plan[0]
      const diff = time_util.getDayDiff_tz(date, new Date())

      //天数
      let next_span
      try {
        next_span = await smalltalk.prompt(
          `下次复习距今的天数`,
          '', diff)
      } catch (e) {
        return//cancel
      }
      next_span = parseInt(next_span)
      if (isNaN(next_span)) {
        console.error("not a number")
        return
      }
      const rev_point = time_util.todayAddDays(next_span).getTime()
      //过滤掉较小的
      const exist_plan = this.note.rev_plan.map(p => p.getTime()).filter(d => d > rev_point)
      const new_plan = [rev_point, ...exist_plan].map(v => new Date(v))
      this.note.rev_plan = new_plan
    },

    markAsLearned() {
      const note = this.note
      const rev_next_day = time_util.dateAddDays(new Date(), 1)
      note.rev_state = "rev"
      note.rev_learned_at = new Date()
      note.rev_plan = [rev_next_day]
      //保存内容
      note_util.writeMeta(note)
    },
    clearRevLogs() {
      const note = this.note
      note.rev_history = []
      note.rev_plan = []
      note.rev_state = "new"
      note_util.writeMeta(note)
    },
    resumeRev() {
      const note = this.note
      note.rev_state = "rev"
      note_util.writeMeta(note)
    },
    pauseRev() {
      const note = this.note
      note.rev_state = "pause"
      note_util.writeMeta(note)
    }
  }
}
</script>
<style scoped>
.new_sec_text {
  margin-top: 1em;
  font-size: small;
  margin-bottom: 2px;
  width: 100%;
  text-align: center;
  border-bottom: 1px lightgray solid;
}

.center_btn_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.btn_change_next_rev_at {
  cursor: default;
  user-select: none;
}

.btn_change_next_rev_at:hover {
  text-decoration: underline;
}
</style>
