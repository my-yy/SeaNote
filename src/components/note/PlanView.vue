<template>
  <div class="PlanView">
    <table>
      <thead>
      <tr>
        <th>日期</th>
        <th style="width: 4em;">间隔</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="obj in tableList">
        <td>{{ obj.time_str }}</td>
        <td class="span_area" @click="onSpanClick">{{ obj.span }}</td>
        <!--        <td>10分</td>-->
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import time_util from "@/utils/time_util";
import moment from "moment";
import smalltalk from "smalltalk";
import rev_util from "@/utils/rev/rev_util";
import note_util from "@/utils/note_util";

export default {
  name: 'PlanView',
  props: ["note"],
  components: {},
  data() {
    return {}
  },
  computed: {
    tableList() {
      if (!this.note) {
        return []
      }
      const plan = this.note.rev_plan || []
      //1.排序
      const plan_date_list = plan
      plan_date_list.sort((a, b) => a.getTime() - b.getTime())

      //2.
      let last = new Date() //现在
      const ans = []
      for (const date of plan_date_list) {
        const span = time_util.getDayDiff_tz(date, last)
        const obj = {
          span: span,
          time: date,
          time_str: moment(date).format("YYYY-MM-DD")
        }
        ans.push(obj)
        last = date
      }
      return ans
    }

  },
  mounted() {
  },
  methods: {
    async onSpanClick() {//重新输入span
      const span_list = this.tableList.map(obj => obj.span)
      const def_value = span_list.join(",")
      let span_arr_text
      try {
        span_arr_text = await smalltalk.prompt(
          `复习间隔`,
          '', def_value)
      } catch (e) {
        return//cancel
      }
      if (span_arr_text === def_value) {//未变化
        return
      }
      const arr = rev_util.str2span(span_arr_text)
      if (arr.length === 0) {
        this.$message.error("无效间隔")
        return
      }
      //重新更改note的plan
      this.note.rev_plan = note_util.createPlanListBySpan(arr)
      //更新
      note_util.writeMeta(this.note)
    }
  }
}
</script>
<style scoped>
.PlanView {

}

table {
  border-collapse: collapse;
  margin: 0 auto;
}

th, td {
  text-align: center;
  vertical-align: middle;
}

tbody tr:nth-child(even) {
  background-color: #f4f4f5;
}

.span_area {
  cursor: default;

}

.span_area:hover {
  text-decoration: underline;
}

</style>
