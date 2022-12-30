<template>
  <div class="ReaderDisplay">
    <div v-html="showHtml" class="html_container preview"></div>
    <div class="show_answer_wrapper" v-show="haveAnswer">
      <button @click="onShowAnswerClick">{{ is_answer_showing ? '隐藏答案' : '显示答案' }}</button>
      <!--      <el-button icon="el-icon-view" circle @click="onShowAnswerClick"></el-button>-->
    </div>
  </div>
</template>

<script>
import jquery from "jquery";
import render_util from "@/utils/render_util";

export default {
  name: 'Empty',
  props: ["html"],
  components: {},
  data() {
    return {
      is_answer_showing: false,
    }
  },
  mounted() {
  },
  computed: {
    haveAnswer() {
      return render_util.hasQA(this.html || "")
    },
    showHtml() {
      if (!this.haveAnswer) {
        return this.html
      }
      const html = this.html
      const hr_index = html.indexOf("<hr>")
      if (hr_index > 0) {
        const question_part = html.substring(0, hr_index + 4)
        const answer_part = html.substring(hr_index + 4, html.length)
        const answer_part_wrapper = `<div id="answer_area" class="hide">${answer_part}</div>`
        return question_part + answer_part_wrapper
      }
      return html
    }
  },
  methods: {
    onShowAnswerClick() {
      //将hide标签去掉
      const dom = document.getElementById("answer_area")
      if (dom) {
        jquery(dom).toggleClass("hide")
        // dom.classList.remove('hide');
      }
      //挖空
      jquery(".marker-yellow").toggleClass("show_cloze")
      this.is_answer_showing = !this.is_answer_showing

    },
  }
}
</script>
<style scoped>

.ReaderDisplay {
  padding: 5px;
  flex-grow: 1;
  /*border-top: 1px lightgray solid;*/
  background-color: white;
  display: flex;
  flex-direction: column;
  /*border: 1px red solid;*/
}

.html_container {
  /*border: 1px red solid;*/
  flex-grow: 1;
}

.show_answer_wrapper {
  /*border: 1px red solid;*/
  text-align: center;
}


/*隐藏*/
.preview /deep/ p {
  margin: 0;
}

.preview /deep/ .hide {
  /*background-color: #dcd9db;*/
  display: none;
}

.preview /deep/ .marker-yellow {
  /*background-color: #dcd9db;*/
  /*display: none;*/
  color: yellow;
}

.preview /deep/ .marker-yellow:hover {
  /*background-color: #dcd9db;*/
  /*display: none;*/
  /*color: yellow;*/
  color: black;
  /*background-color: white;*/
}

.preview /deep/ .show_cloze {
  /*background-color: #dcd9db;*/
  /*display: none;*/
  /*color: yellow;*/
  color: black;
  /*background-color: white;*/
}

</style>
