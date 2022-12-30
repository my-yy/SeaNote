<template>
  <div class="LeftNaviBar">

    <navi-icon icon="el-icon-star-off" uri="/today" :red_dot="revItems.length>0" tooltip="待复习"></navi-icon>
    <navi-icon icon="el-icon-folder" uri="/" tooltip="文件"></navi-icon>
    <!--    <navi-icon icon="el-icon-refresh-right" uri="none" @click="onRefreshClick" tooltip="刷新页面"></navi-icon>-->
    <span style="flex-grow: 1"></span>
    <navi-icon icon="el-icon-setting" uri="/setting" tooltip="设置"></navi-icon>
<!--    <navi-icon icon="el-icon-setting" uri="/launchpad" tooltip="LP"></navi-icon>-->

    <!--      <i class="icon1 el-icon-s-unfold"-->
    <!--         :class="{'selected':$route.path.startsWith('/setting')}"-->
    <!--         @click="$router.push('/setting')"-->
    <!--      ></i>-->
  </div>
</template>

<script>
import rev_util from "@/utils/rev/rev_util";
import NaviIcon from "@/components/workspace/NaviIcon";
import {mapState} from 'vuex'
import eventbus from "@/utils/eventbus";

export default {
  name: 'LeftNaviBar',
  components: {NaviIcon},
  computed: {
    ...mapState(["revItems"])
  },
  data() {
    return {}
  },
  mounted() {
    //查询今天要复习的内容
    const today_rev_notes = rev_util.checkNeedRevNotes()
    this.$store.commit("setRevItems", today_rev_notes)
  },
  methods: {
    toggleFold() {
      this.is_fold_mode = !this.is_fold_mode
    },
    onRefreshClick() {
      //
      eventbus.bus.$emit("navi_bar:refresh")
      console.log("refresh~")
    }
  },
}
</script>

<style scoped>

.LeftNaviBar {
  padding-top: 12px;
  width: 65px;
  flex-shrink: 0;
  border-right: 1px lightgray solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5px;
  background-color: #f7f8f9;
  -webkit-app-region: drag;
}


</style>
