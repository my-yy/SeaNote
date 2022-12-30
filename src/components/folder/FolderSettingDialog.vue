<template>
  <el-dialog
    title="文件夹设置"
    width="80%"
    :visible="true"
    :append-to-body="true"
    @close="$emit('close')"
  >
    <el-form
      ref="form"
      label-width="12em"
      v-if="proxy"
    >
      <!--      <el-form-item label="创建笔记时的复习模式">-->
      <!--        <el-radio-group v-model="rev_refer" @change="">-->
      <!--          <el-radio label="global">参照上级\全局模式</el-radio>-->
      <!--          <el-radio label="isolate">额外的复习模式</el-radio>-->
      <!--        </el-radio-group>-->

      <!--      </el-form-item>-->

      <el-form-item label="独立的复习模式">
        <el-switch v-model="proxy.isolate_rev_alg"></el-switch>
      </el-form-item>
      <template v-if="proxy.isolate_rev_alg">
        <el-form-item label="创建笔记时的复习模式">
          <el-radio-group v-model="proxy.rev_alg">
            <el-radio label="ys">预设间隔</el-radio>
            <el-radio label="ak">Anki</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="proxy.rev_alg==='ys'" label="复习间隔">
          <span-input :value="proxy.rev_span" @change="onSpanChange"></span-input>
        </el-form-item>
      </template>
    </el-form>
    <div style="text-align: center">
      <el-button @click="onUpdateFolder">
        完 成
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import folder_util from "@/utils/file/folder_util";
import SpanInput from "@/components/folder/SpanInput";

const path = require("path")
const fs = require("fs")
const assert = require('assert-plus');

export default {
  name: 'DialogFolder',
  props: ["folder"],
  data() {
    return {
      proxy: null
    }
  },
  components: {SpanInput},
  mounted() {
    //生成拷贝
    this.proxy = JSON.parse(JSON.stringify(this.folder))
  },
  methods: {
    onSpanChange(v) {
      this.proxy.rev_span = v
    },
    onUpdateFolder() {
      //1.判断是否发生更改
      if (JSON.stringify(this.proxy) === JSON.stringify(this.folder)) {
        //未更改
        console.log("未更改")
        this.$emit("close")
        return
      }
      //2.已经更改了，那么就逐一赋值
      for (const key of Object.keys(this.proxy)) {
        if (key.startsWith("_")) {
          continue
        }
        const v = this.proxy[key]
        console.log("set", key, v)
        // this.folder[key] = v
        this.$set(this.folder, key, v)
      }
      //3.更新
      folder_util.writeFolderConfig(this.folder)

      this.$emit("close")
    },

  }
}
</script>
<style scoped>

</style>
