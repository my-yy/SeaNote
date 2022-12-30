<template>
  <div class="BtnRevAlg">
    <el-popover placement="bottom" width="170" trigger="manual" v-model="visible">
      <div v-if="note">
        <el-radio-group :value="note.rev_alg" @input="onChangeRevAlg">
          <el-radio label="ys">预设间隔</el-radio>
          <el-radio label="ak">Anki</el-radio>
        </el-radio-group>
      </div>
      <el-link slot="reference" @click="visible=!visible">{{ rev_alg_name }}</el-link>
    </el-popover>
  </div>
</template>

<script>
import folder_util from "@/utils/file/folder_util";
import path from "path";
import note_util from "@/utils/note_util";

export default {
  name: 'BtnRevAlg',
  props: ["note"],
  components: {},
  data() {
    return {
      visible: false
    }
  },
  mounted() {
  },
  computed: {
    rev_alg_name() {
      if (!this.note) {
        return
      }
      const alg = this.note.rev_alg
      const tmp = {
        "ak": "Anki",
        "ys": "预设间隔"
      }
      return tmp[alg]
    },
  },
  methods: {
    async onChangeRevAlg(value) {
      //1.判断复习历史记录
      // 如果有历史记录，那么先清除
      const note = this.note
      if (note.rev_history.length > 0) {//直接切换
        try {
          await this.$confirm('切换复习模式将会清除之前的复习记录, 是否继续?', '提示', {
            confirmButtonText: '清除',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } catch (e) {
          //取消
          this.visible = false
          return
        }
      }

      //2.进行初始化，下次复习为明日
      note.rev_history = []
      note.rev_alg = value
      if (value === 'ys') {//逐级向上寻找，找到默认的复习间隔
        const def_span = folder_util.findAlgTemplate(path.dirname(note._path)).rev_span || []
        note.rev_plan = note_util.createPlanListBySpan(def_span)
      } else {
        //明日
        note.rev_plan = note_util.createPlanListBySpan([1])
      }
      this.visible = false
    },
    hide() {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.BtnRevAlg {
  display: inline-block;
}

</style>
