<template>
  <div class="ReaderDisplay">
    <div v-show="html" v-html="renderHtml" class="html_container preview"></div>
    <div class="show_answer_wrapper" v-show="haveAnswer">
      <el-button type="success" @click="onShowAnswerClick">{{ is_answer_showing ? '隐藏答案' : '显示答案' }}</el-button>
      <!--      <el-button icon="el-icon-view" circle @click="onShowAnswerClick"></el-button>-->
    </div>
    <div v-show="!html" class="no_content">
      无内容
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
    renderHtml() {
      return render_util.toReaderModeHtml(this.html)
    }
  },
  methods: {
    onShowAnswerClick() {
      //将hide标签去掉
      jquery("#answer_area").toggleClass("hide")
      jquery("#answer_hide_desc").toggleClass("hide")

      //挖空
      jquery(".preview .highlight").toggleClass("show_cloze")
      this.is_answer_showing = !this.is_answer_showing

    },
  }
}
</script>
<style scoped>

.ReaderDisplay {
  padding: 10px;
  flex-grow: 1;
  /*border-top: 1px lightgray solid;*/
  background-color: white;
  display: flex;
  flex-direction: column;
  /*border: 1px red solid;*/
  /*max-height: 100%;*/
  overflow-y: auto;
}

/*感觉很奇怪，ReaderDisplay与html_container都要设置为overflow-y: auto 才能使得长内容滚动 */

.html_container {
  /*border: 1px blue solid;*/
  flex-grow: 1;
  overflow-y: auto;
}

.show_answer_wrapper {
  padding-top: 10px;
  /*border: 1px red solid;*/
  text-align: center;
}


.preview /deep/ p {
  margin: 0;
  font-size: 1.1em;
}

.preview /deep/ img {
  max-width: 99%;
}

.no_content {
  text-align: center;
  color: gray;
}

/*===================================================答案分割线*/
.preview /deep/ #answer_hide_desc {
  text-align: center;
  color: gray;
  padding-top: 20px;
  border-top: 1px grey dashed;
}

.preview /deep/ .hide {
  /*background-color: #dcd9db;*/
  display: none;
}

/*===================================================Highlight*/
.preview /deep/ .highlight {
  color: rgb(255, 197, 28);
}

.preview /deep/ .highlight:hover {
  color: black;
}

.preview /deep/ .show_cloze {
  color: black;
}

</style>
