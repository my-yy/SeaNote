<template>
  <!--  <el-tooltip class="item" effect="dark" :content="tooltip" placement="right" :open-delay="1000">-->
  <div class="icon1"
       :class="{'selected':isSelected}"
       @click="onClick">
    <span v-if="red_dot" class="red_dot"></span>
    <i :class="icon"></i>
  </div>
  <!--  </el-tooltip>-->
</template>

<script>
export default {
  name: 'NaviIcon',
  props: ["icon", "red_dot", "uri", "tooltip"],
  components: {},
  data() {
    return {}
  },
  computed: {
    isSelected() {
      if (this.uri === "/") {
        return this.$route.path === "/"
      }
      return this.$route.path.startsWith(this.uri)
    }
  },
  mounted() {
  },
  methods: {
    onClick() {
      if (this.uri === "none") {
        this.$emit("click")
        return
      }
      this.$router.push(this.uri)
    }

  }
}
</script>
<style scoped>

.icon1 {
  /*border: 1px red solid;*/
  border-radius: 10px;
  padding: 10px;
  margin-top: 1em;
  position: relative;
}


.icon1.selected {
  background-color: #eff0f0;
}

.icon1:hover {
  background-color: #eff0f0;
}

.red_dot {
  position: absolute;
  right: 6px;
  border-radius: 50%;
  width: 5px;
  height: 5px;
  line-height: 5px;
  font-size: 5px;
  display: inline-block;
  text-align: center;
  /*background: #ee260b;*/
  background: #febd3a;
  color: #fff;
  vertical-align: center;
}
</style>
