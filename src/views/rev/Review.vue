<template>
  <div class="review">
    <rev-top-bar
      :rev-items="revItems"
      :cur_item="cur_item"
      @toLast="onToLastClick"
      @toNext="onToNextClick"
      @toEdit="onEditNoteClick"
    >
    </rev-top-bar>
    <div class="center_panel">
<!--      <div>{{cur_item}}</div>-->
      <ReaderDisplay class="theReaderDisplay" :html="cur_html"></ReaderDisplay>
      <rev-mark-bar :note="cur_item" @mark="onMark"></rev-mark-bar>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import IconBtn from "@/components/IconBtn";
import RevMarkBar from "@/components/rev/MarkBar";
import RevTopBar from "@/components/rev/RevTopBar";
import ReaderDisplay from "@/components/note/ReaderDisplay.vue";
import render_util from "@/utils/render_util";
import rev_util from "@/utils/rev/rev_util";
import note_util from "@/utils/note_util";

export default {
  name: 'Review',
  components: {IconBtn, RevTopBar, RevMarkBar, ReaderDisplay},
  computed: {
    ...mapState(["revItems"]),
    hasQA() {
      if (!this.cur_html) {
        return false
      }
      return render_util.hasQA(this.cur_html)
    }
  },
  data() {
    return {
      cur_item: null,
      cur_html: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onEditNoteClick() {

    },
    onToLastClick() {
      this.onToNextClick(-1)
    },
    onToNextClick(val = 1) {
      const cur_index = this.revItems.indexOf(this.cur_item)
      const new_index = cur_index + val
      if (new_index < 0 || new_index >= this.revItems.length) {
        return
      }
      this.setCurItemByIndex(new_index)
    },
    setCurItemByIndex(cur_index) {
      this.cur_item = this.revItems[cur_index]
      const html = note_util.readHtml(this.cur_item)
      this.cur_html = html
    },
    init() {
      const revItems = this.revItems
      if (revItems.length > 0) {
        this.setCurItemByIndex(0)
      }
    },
    onMark() {
      //判断是否有下一个
      const cur_index = this.revItems.indexOf(this.cur_item)
      const have_next = cur_index + 1 < this.revItems.length
      if (have_next) {//下一个
        this.setCurItemByIndex(cur_index + 1)
        return
      }

      //没有下一个，查看是否有剩余未复习的
      // const remain_items = this.revItems.filter(item => rev_util.needTodayRev(item))
      // if (remain_items.length > 0) {
      //   const item = remain_items[0]
      //   const index = this.revItems.indexOf(item)
      //   this.setCurItemByIndex(index)
      //   return;
      // }
      //已经完成
      this.$notify({
        title: '复习完成',
        message: '已完成今日复习',
        type: 'success'
      });
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.review {
  padding: 10px;
  padding-top: 25px;

  background-color: rgb(247, 247, 247);
  /*background-color: white;*/
  display: flex;
  flex-direction: column;
  /*border: 1px green solid;*/
}


.center_panel {
  width: 70vw;
  margin: 0px auto;
  flex-grow: 1;
  /*border: 1px blue solid;*/
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /*box-shadow: 8px 8px 24px -22px rgba(66, 68, 90, 1);*/
}

.theReaderDisplay {
  box-shadow: 8px 8px 24px -22px rgba(66, 68, 90, 1);
  border-radius: 20px;
  /*border: none !important;*/
  padding: 20px !important;
  overflow-y: auto;
  /*border: 1px red solid;*/
}

</style>
