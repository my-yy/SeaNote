<template>
  <div class="NoteToolBar">
    <!--        <span class="plus_button" v-show="!show_left_part">-->
    <!--          <i class="el-icon-plus"></i>-->
    <!--        </span>-->
<!--    <el-radio-group :value="radioValue" @change="onRadioChange" size="small" class="mode_switcher">-->
    <!--      <el-radio-button label="false">编辑模式</el-radio-button>-->
    <!--      <el-radio-button label="true">阅读模式</el-radio-button>-->
    <!--    </el-radio-group>-->

    <MyRadioGroup :isReadMode="radioValue" @change="onRadioChange" class="mode_switcher"></MyRadioGroup>

    <!--    <icon-btn v-show="isReadMode" icon="far fa-edit" @click="$emit('toEdit')"></icon-btn>-->
    <!--    <icon-btn v-show="!isReadMode" icon="far fa-book-open" @click="$emit('toRead')"></icon-btn>-->
    <span style="flex-grow: 1"></span>
    <el-popover placement="bottom" width="170" trigger="click" @hide="onPopInfoHide">
      <note-info :note="note" ref="note_info"></note-info>
      <icon-btn class="icon_info" icon="fal fa-info-circle" slot="reference"></icon-btn>
    </el-popover>

  </div>
</template>

<script>
import IconBtn from "@/components/IconBtn";
import NoteInfo from "@/components/note/NoteInfo";
import time_util from "@/utils/time_util"
import note_util from "@/utils/note_util"
import path from "path";
import json_util from "@/utils/file/json_util"
import moment from "moment";
import MyRadioGroup from "@/components/note/MyRadioGroup";

export default {
  name: 'NoteToolBar',
  props: ["isReadMode", "note"],
  components: {IconBtn, NoteInfo, MyRadioGroup},
  data() {
    return {
      radio1: ""
    }
  },
  computed: {
    radioValue() {
      return this.isReadMode
      if (this.isReadMode) {
        return "read"
      }
      return "edit"
    }
  },
  mounted() {
  },
  methods: {
    onPopInfoHide() {
      this.$refs.note_info.hideBtnChangeRevAlg()
    },
    onRadioChange() {
      if (this.isReadMode) {
        this.$emit('toEdit')
      } else {
        this.$emit('toRead')
      }
    }
  }
}
</script>
<style scoped>

.NoteToolBar {
  display: flex;
  /*justify-content: center;*/
  align-items: center;
  /*padding: 5px;*/
  /*border-bottom: 1px lightgray solid;*/
  height: 40px;
  flex-shrink: 0;
  /*border: 1px red solid;*/
}

.mode_switcher {
  margin-left: 10px;
}

.NoteToolBar /deep/ .el-radio-button__inner {
  padding: 5px 10px;
}


.icon_info {
  /*border: 1px red solid;*/
  margin-right: 10px;
}
</style>
