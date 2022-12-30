<template>
  <div class="Today">
    <div>
      <span class="the_title">
        今日
      </span>
      <icon-btn icon="el-icon-refresh-right" class="refresh_btn" @click="onRefreshClick"></icon-btn>
    </div>


    <div v-show="today_rev_note_list.length===0" class="today_no_content">
      <img src="../../assets/icons/1_badge-check.svg" class="badge_icon">
      今天没有需要复习的内容
    </div>
    <div v-if="today_rev_note_list.length>0">
      <div style="text-align: center">今日待复习{{ today_rev_note_list.length }}项
      </div>
      <div style="text-align: center;margin-top: 10px">
        <div v-show="today_rev_note_list.length>0">
          <el-button round type="success" @click="toRevPanel">开始复习</el-button>
        </div>
      </div>
    </div>


    <div class="the_title" style="margin-top: 1em;">
      未来
    </div>
    <!--    <future-task-table :list="future_list"></future-task-table>-->
    <future-chart v-show="future_list.length>0" ref="futureChart"></future-chart>
    <div class="no_content" v-show="future_list.length===0">未来没有需要复习的内容</div>

    <!--    <div class="the_title">-->
    <!--      历史-->
    <!--    </div>-->


  </div>
</template>

<script>
import config_util from "@/utils/config_util";
import search_util from "@/utils/search_util";
import moment from "moment/moment";
import path from "path";
import time_util from "@/utils/time_util";
import note_util from "@/utils/note_util";
import FutureTaskTable from "@/views/rev/FutureTaskTable";
import eventbus from "@/utils/eventbus";
import IconBtn from "@/components/IconBtn";
import FutureChart from "@/components/charts/FutureChart";

export default {
  name: 'Today',
  components: {FutureTaskTable, IconBtn, FutureChart},
  data() {
    return {
      show_today_detail: false,
      today_rev_note_list: [],
      future_list: []
    }
  },
  mounted() {
    this.init()
    // eventbus.bus.$on("navi_bar:refresh", this.onRefreshClick)
  },
  beforeDestroy() {
    // eventbus.bus.$off("navi_bar:refresh", this.onRefreshClick)
  },
  methods: {
    onRefreshClick() {
      this.init()
      this.$message.success("已刷新待复习内容")
    },
    toRevPanel() {
      this.$store.commit("setRevItems", this.today_rev_note_list);
      this.$router.push('/review/')
    },
    init() {
      const root = config_util.getRepoRoot()
      //1.获得所有的笔记内容
      const all_notes = search_util.searchAllNotes(root)

      //2.获得今天复习需要复习的内容
      const today_rev_note_set = new Set()
      const date2items = {}
      const today_end_ms = new Date().setHours(23, 59, 59, 999)
      for (const note_pkg_path of all_notes) {
        const note = note_util.readMeta(note_pkg_path)
        if (!note) {
          continue
        }
        if (note.rev_state !== "rev") {
          continue
        }
        //判断复习日期：
        const plans = note.rev_plan
        for (const rev_at_date of plans) {
          const day_str = time_util.date2str(rev_at_date, true)
          const tmp_arr = date2items[day_str] || []
          tmp_arr.push(note)
          date2items[day_str] = tmp_arr
          //判断是否要今天复习：
          const need_rev = today_end_ms >= rev_at_date.getTime()
          if (need_rev) {
            today_rev_note_set.add(note)
          }
        }
      }

      const today_rev_note_list = Array.from(today_rev_note_set)
      this.today_rev_note_list = today_rev_note_list
      console.log("today_rev_note_list:", today_rev_note_list)

      //未来7天需要复习的内容
      // const future_list = []
      // for (let i = 1; i <= 7; i++) {
      //   const future_date = moment().add(i, "days").toDate()
      //   const items = date2items[time_util.date2str(future_date, true)] || []
      //   future_list.push({
      //     span: i,
      //     date: future_date,
      //     items: items
      //   })
      // }

      //未来的num次
      const num = 5
      let date_list = Object.keys(date2items).map(date_str => time_util.str2date(date_str, true))
      console.log("date_list", date_list)
      //从小到大排序
      date_list = date_list.sort((a, b) => a - b)
      //比今天要大的
      date_list = date_list.filter(date => date.getTime() > today_end_ms)
      const max_len = Math.min(num, date_list.length)
      const future_list = []
      for (let i = 0; i < max_len; i++) {
        const future_date = date_list[i]
        const items = date2items[time_util.date2str(future_date, true)] || []
        future_list.push({
          span: time_util.getDayDiff_tz(future_date, new Date()),
          date: future_date,
          items: items
        })
      }
      this.future_list = future_list

      const xData = future_list.map(obj => obj.span + "天后")
      const yData = future_list.map(obj => obj.items.length)
      // console.log(xData)
      // console.log(yData)
      this.$refs.futureChart.show(xData, yData)

      //用于更新红点
      this.$store.commit("setRevItems", this.today_rev_note_list);

    }
  },


}
</script>

<style scoped>

.Today {

  padding: 10px;
  padding-top: 20px;
  flex-grow: 1;
  /*border: 1px red solid;*/
}

.today_no_content {
  text-align: center;
  color: grey;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.the_title {
  font-size: xx-large;
  /*border: 1px red solid;*/
  /*margin: 0;*/
  /*padding: 0;*/
}

.badge_icon {
  height: 80px;
}


.no_content {
  /*border: 1px red solid;*/
  text-align: center;
  color: gray;
}

.refresh_btn {
  /*border: 1px red solid;*/
  margin: 0;
}


</style>
