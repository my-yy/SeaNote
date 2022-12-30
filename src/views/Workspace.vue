<template>
  <div class="home">
    <left-navi-bar></left-navi-bar>
    <router-view class="workspace_sub"></router-view>
  </div>
</template>

<script>
import LeftNaviBar from "@/components/workspace/LeftNaviBar";

export default {
  name: 'Today',
  components: {LeftNaviBar},
  data() {
    return {
      cur_panel: null,
      is_fold_mode: false,
    }
  },
  mounted() {
  },
  methods: {},


}
</script>

<style scoped>
.home {
  display: flex;
}

.workspace_sub {
  flex-grow: 1;
}
</style>
