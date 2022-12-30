<template>
  <div class="MyRadioGroup">
    <div class="radio_item" :class="{'selected':!isReadMode}" @click="onClick">
      编辑模式
    </div>
    <div class="radio_item" :class="{'selected':isReadMode}" @click="onClick">
      阅读模式
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyRadioGroup',
  props: ["isReadMode"],
  components: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    onClick() {
      this.$emit("change", !this.isReadMode)
    }
  }
}
</script>
<style scoped>

.MyRadioGroup {
  /*display: flex;*/
}

.radio_item {
  font-size: small;
  display: inline-block;
  border: 1px lightgrey solid;
  padding: 2px 10px;
  color: #606266;
  cursor: pointer;
  user-select: none;
}

.radio_item:first-child {
  border-radius: 10px 0 0 10px;
  border-right: 0;
}

.radio_item:last-child {
  border-radius: 0 10px 10px 0;
}

.radio_item.selected {
  background-color: #4da2fe;
  color: white;
  font-weight: bold;
}

</style>
