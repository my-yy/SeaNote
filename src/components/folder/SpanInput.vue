<template>
  <div>
    <el-link v-if="!edit_mode" @click="onChangeSpan">{{ showStr }}</el-link>
    <div v-else>
      <input v-model="spanStr" class="span_input" @keyup.enter="onConfirmClick">
      <el-link class="confirm_btn" @click="onConfirmClick">确定</el-link>
      <el-link class="confirm_cancel" @click="onCancelClick">取消</el-link>
    </div>
  </div>
</template>

<script>
import rev_util from "@/utils/rev/rev_util_pjs";

export default {
  name: 'SpanInput',
  props: ["value"],
  components: {},
  data() {
    return {
      edit_mode: false,
      spanStr: null,
    }
  },
  computed: {
    showStr() {
      const array = this.value || []
      const sum_val = array.reduce((partialSum, a) => partialSum + a, 0);
      const text = array.join(', ')
      return `${text} (复习${array.length}次，持续${sum_val}天)`
    }
  },
  methods: {
    onChangeSpan() {
      this.spanStr = this.value.join(', ')
      this.edit_mode = true
    },
    onConfirmClick() {
      const span_arr_text = this.spanStr
      const arr = rev_util.str2span(span_arr_text)
      if (arr.length === 0) {
        this.$message.error("无效间隔")
        return
      }
      console.log("arr", arr)
      this.$emit("change", arr)
      this.edit_mode = false
    },
    onCancelClick() {
      this.edit_mode = false
    }
  }
}
</script>
<style scoped>
.span_input {
  margin-right: 10px;
}

.confirm_cancel {
  margin-left: 20px;
}

</style>
