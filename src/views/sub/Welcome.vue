<template>
  <div class="welcome">

    <div class="center_wrapper">
      <div>
        <el-button>创建笔记</el-button>
      </div>
      <div style="margin-top: 1em;">
        <el-button>使用帮助</el-button>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  name: 'HomeView',
  components: {},
  methods: {},
  data() {
    return {}
  }

}
</script>

<style scoped>
.welcome {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*border: 1px red solid;*/

}

.center_wrapper {
  /*border: 1px red solid;*/
  text-align: center;
}


</style>
