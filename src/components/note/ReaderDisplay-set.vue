<template>
  <div class="ReaderDisplay">
    <div v-html="preview_html" class="html_container preview"></div>
    <div class="show_answer_wrapper" v-show="have_answer">
      <button @click="onShowAnswerClick">{{ is_answer_showing ? '隐藏答案' : '显示答案' }}</button>
      <!--      <el-button icon="el-icon-view" circle @click="onShowAnswerClick"></el-button>-->
    </div>
  </div>
</template>

<script>
import jquery from "jquery";

export default {
  name: 'Empty',
  props: [],
  components: {},
  data() {
    return {
      have_answer: false,
      is_answer_showing: false,
      preview_html: null,
    }
  },
  mounted() {
    this.preview_html = "hahaaha"

  },
  methods: {
    displayHtml(html) {
      const hr_index = html.indexOf("<hr>")
      this.have_answer = hr_index > 0
      if (!this.have_answer) {//没有答案
        this.preview_html = html
        return
      }
      //有答案分割线
      const question_part = html.substring(0, hr_index + 4)
      const answer_part = html.substring(hr_index + 4, html.length)
      console.log({question_part, answer_part})
      const answer_part_wrapper = `<div id="answer_area" class="hide">${answer_part}</div>`
      this.preview_html = question_part + answer_part_wrapper
    },
    onShowAnswerClick() {
      this.show_answer = true
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
  border-top: 1px lightgray solid;

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
