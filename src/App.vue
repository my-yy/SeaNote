<template>
  <div id="app">
    <router-view class="the_router_view"/>
    <div class="custom-app-bar" @dblclick="toggleWindow"></div>
  </div>
</template>
<script>
import config_util from "@/utils/config_util"
import dir_util from "@/utils/file/dir_util"
import folder_util from "@/utils/file/folder_util"
import json_util from "@/utils/file/json_util"
import path from "path";
import moment from "moment";
import fs from "fs";
import window_util from "@/utils/window_util";

export default {
  name: 'App',
  components: {},
  data() {
    return {}
  },
  mounted() {
    window.addEventListener("keyup", this.onAppKeyUp, true)

    //1.获得存储路径，如果没有则创建
    const root_path = config_util.getRepoRoot()
    dir_util.mkdir_if_necessary(root_path)

    //2.获得默认的复习模式
    folder_util.createDefaultFolderConfigInRootPathIfNecessary()

  },
  methods: {
    toggleWindow: window_util.toggleWindow,
    onAppKeyUp(event) {
      // console.log("event", event)
      if (event.key === "F5") {
        this.$router.replace("/launchpad")
      }
    },

  },
}
</script>
<style>

* {
  padding: 0;
  margin: 0;
  /*box-sizing: border-box; !*这个消除了滚动条*!*/
  --appBarHeight: 25px;
}

.custom-app-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  -webkit-app-region: drag;
  height: var(--appBarHeight);
  /*background-color: #eeeff0;*/
  user-select: none;
}

.the_router_view {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  max-height: 100vh;
}

/*.hide {*/
/*  background-color: #d9d9dc;*/
/*}*/
</style>
