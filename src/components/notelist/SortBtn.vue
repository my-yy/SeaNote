<template>
  <div class="SortBtn">
    <el-popover placement="top" width="130" trigger="click">
      <div style="display: flex;flex-direction: column;">
        <div style="text-align: center">排序方式</div>
        <el-radio-group :value="value" @input="onRadioInput">
          <el-radio class="radio" label="name">标题 (a-z)</el-radio>
          <el-radio class="radio" label="mtime">编辑日期 (新-旧)</el-radio>
        </el-radio-group>
      </div>
<!--      <icon-btn slot="reference" icon="far fa-sort"></icon-btn>-->
      <icon-btn slot="reference" icon="el-icon-sort"></icon-btn>
    </el-popover>
  </div>
</template>

<script>
import IconBtn from "@/components/IconBtn";

export default {
  name: 'SortBtn',
  props: ["value"],
  components: {IconBtn},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    onRadioInput(value) {
      this.$emit("input", value)
    }
  }
}
</script>
<style scoped>
.SortBtn /deep/ .el-radio {
  margin-top: 3px !important;
}

.radio{
  margin-top: 6px;
}

</style>
