<template>
  <div class="MarkBar" v-if="showMarkBar">
    <mark-btn class="mark_btn1"
              v-for="(op,idx) in options"
              :obj="op"
              @click="op.onMark(op)">
    </mark-btn>
  </div>
</template>

<script>
import time_util from "@/utils/time_util";
import Assert from "assert-js";
import rev_util_pjs from "@/utils/rev/rev_util_pjs";
import alg_util from "@/utils/rev/anki_util";
import note_util from "@/utils/note_util";
import MarkBtn from "@/components/rev/MarkBtn";

export default {
  name: 'MarkBar',
  props: ["note"],
  components: {MarkBtn},
  data() {
    return {
      options: []
    }
  },
  watch: {
    note: function (value) {
      this.init()
    }
  },
  computed: {
    showMarkBar() {
      return this.note && this.note.rev_state === "rev"
    }
  },
  methods: {
    init() {
      console.log("init", this.note.rev_alg)
      if (!this.note) {
        console.log("note is null")
        return
      }

      //判断复习模式
      let options
      if (this.note.rev_alg === "ys") {
        //得到options
        options = this.getYSOptions()
      } else {//anki
        Assert.equal(this.note.rev_alg, "ak")
        options = this.getAnkiOptions()
      }
      this.options = options
    },
    getAnkiOptions() {
      console.log("getAnkiOptions")
      const note = this.note

      //1.获得距离上次复习的时间跨度
      let lastRevAt = rev_util_pjs.calc_last_rev_date_obj(note)
      const current_span = (new Date().getTime() - lastRevAt.getTime()) / time_util.ONE_DAY_MS

      //2.获得所有的选项
      const history_list = note.rev_history.map(obj => [obj.span, obj.mark])
      const options = alg_util.next_span_batch(history_list, current_span)
      const option_list = []
      const name_list = ["🤪 陌生", "😃 记得", "🤗 熟悉"]
      const color_list = ["#cdb4db", "#a2d2ff", "#a7c957"]
      for (let i = 0; i < options.length; i++) {
        const obj = {
          mark: i,
          this_span: current_span,
          next_span: options[i],
          name: name_list[i],
          color: color_list[i],
          onMark: this.handleAnkMark
        }
        option_list.push(obj)
      }
      console.log("option_list", option_list)
      return option_list
    },
    getYSOptions() {
      const note = this.note
      let plan = note.rev_plan
      const todayEnd = time_util.dateEnd(new Date())

      //1.过滤掉小于今天的
      plan = plan.filter(p => p.getTime() > todayEnd)

      //2.对plan进行排序
      plan.sort((a, b) => a.getTime() - b.getTime())

      let next_span
      if (plan.length === 0) {//未来没有内容了
        next_span = 365
        console.error("未来没有复习内容了")
      } else {
        const nex_obj = plan[0] //取第一个结果
        const future = nex_obj
        next_span = time_util.getDayDiff_tz(future, new Date())
      }
      const options = [
        {
          name: "😃 已完成本次复习",
          color: "#a2d2ff",
          next_span: next_span,
          onMark: this.handleYSMark
        }
      ]
      console.log("ys options", options)
      return options
    },
    async handleAnkMark(op) {
      const {mark, this_span, next_span} = op
      const note = this.note

      //添加新记录
      const next_rev_at_str = time_util.todayAddDays(next_span)
      const hist_obj = {
        span: this_span,
        mark: mark,
        time: new Date()
      }
      note.rev_plan = [next_rev_at_str]
      note.rev_history.push(hist_obj)

      console.log(`新增复习记录，mark:${mark},本次间隔${this_span.toFixed(2)},下次间隔:${next_span.toFixed(2)},下次日期:${next_rev_at_str}}`)
      //更新一下磁盘
      note_util.writeMeta(note)

      //4.提示切换到下一个
      this.$emit("mark")
    },
    async handleYSMark(op) {
      const {next_span} = op
      const span = next_span

      //1.增加一个新的日志
      const log = {
        "time": new Date(),
        "plan_span": span
      }
      this.note.rev_history.push(log)

      //2.plan中去除小于等于它的内容
      const aim_date = time_util.dateAddDays(new Date(), span)
      const aim_date_ms = time_util.dateEnd(aim_date)

      //从plan中删掉小于它的内容
      let rev_plan = this.note.rev_plan
      rev_plan = rev_plan.filter(p => p.getTime() > aim_date_ms)

      //在头部增加元素
      rev_plan.unshift(aim_date)
      this.note.rev_plan = rev_plan
      console.log(`跨度:${span}下次复习:${time_util.date2str(rev_plan[0])},全部计划:`, rev_plan)
      // return

      //3.保存
      note_util.writeMeta(this.note)

      //4.提示切换到下一个
      this.$emit("mark")
    }
  },

}
</script>
<style scoped>
.MarkBar {
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
}

.mark_btn1 {
  flex-grow: 1;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
