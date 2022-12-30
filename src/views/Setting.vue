<template>
  <div class="setting">
    <!--    <div class="setting_item">-->
    <!--      数据存储目录：-->
    <!--      <el-link @click="onOpenRepoInFinder">{{ repo_root }}</el-link>-->
    <!--      <el-button size="small" @click="onChangeRepo">设置</el-button>-->
    <!--    </div>-->
    <div class="setting_item">
      数据存储目录：

      <span class="link_text" @click="onOpenRepoInFinder">
        <span v-if="isRootICloud">
          <i class="far fa-cloud" style="margin-right: 2px;"></i>iCloud
        </span>
        <span v-else>{{ repo_root }}</span>
      </span>

      <el-link style="margin-left: 10px" @click="onChangeRepo">切换目录</el-link>
    </div>

    <div class="editor_setting">
      复习设置
    </div>
    <div class="setting_item">
      创建笔记时的复习算法：
      <span style="text-align: center">
        <el-radio-group v-model="rev_alg" @change="onRevAlgChange">
          <el-radio label="ys">预设的间隔</el-radio>
          <el-radio label="ak">Anki</el-radio>
        </el-radio-group>
      </span>

    </div>
    <div v-show="rev_alg==='ys'" class="setting_item">
      复习间隔：
      <span-input :value="rev_span" @change="onChangeRevSpan"/>
    </div>

    <div style="margin-top: 2em;">
      <el-link href="https://docs.qq.com/doc/DRklWWUZ4cXdwRGVt">使用帮助</el-link>
      <span style="margin-left: 1em;"></span>
      <el-link href="https://wj.qq.com/s2/11455001/1fd1/">反馈建议</el-link>
    </div>

    <!--    <div class="editor_setting">-->
    <!--      笔记预览设置-->
    <!--    </div>-->
    <!--    <div class="setting_item">-->
    <!--      <input type="checkbox">将"水平线"作为答案分割线-->
    <!--    </div>-->
    <!--    <div class="setting_item">-->
    <!--      <input type="checkbox">将"高亮"文字作为挖空-->
    <!--    </div>-->
    <!--    <div>{{ rootConf }}</div>-->

    <div class="about link_text">
      <span style="cursor: default;margin-left: 5px;" @click="onOpenHomepage">{{ version }}</span>
    </div>

  </div>
</template>

<script>
import rev_util from "@/utils/rev/rev_util"
import config_util from "@/utils/config_util"
import folder_util from "@/utils/file/folder_util"
import fs from "fs";
import path from "path";
import smalltalk from "smalltalk"
import {shell} from "electron";
import SpanInput from "@/components/folder/SpanInput";

const {BrowserWindow, app, dialog} = require('@electron/remote')

export default {
  name: 'Setting',
  components: {SpanInput},
  data() {
    return {
      repo_root: null,
      rev_span: [],
      rev_alg: null,
      version: "2.0.1",
      rootConf: null
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    isRootICloud() {
      if (!this.repo_root) {
        return false
      }
      const regex = /\/Users\/.*\/Library\/Mobile Documents\//g;
      return this.repo_root.match(regex);
    }

  },
  methods: {
    init() {
      //1.得到根目录
      //存储于localStorage
      this.repo_root = config_util.getRepoRoot()
      console.log(this.repo_root)

      //2.复习设置
      //存储于.folder_config  (可能并不存在）
      const conf = folder_util.readFolderDesc(this.repo_root)


      this.rev_alg = conf.rev_alg
      this.rev_span = conf.rev_span
      this.rootConf = conf
    },
    async onChangeRevSpan(arr) {
      this.rev_span = arr
      this.rootConf.rev_span = arr

      //更新folder_config
      folder_util.writeFolderConfig2(this.repo_root, this.rootConf)
      this.init()
    },
    onRevAlgChange() {
      this.rootConf.rev_alg = this.rev_alg
      folder_util.writeFolderConfig2(this.repo_root, this.rootConf)
      this.init()
    },
    onChangeRepo() {
      //openDirectory
      //openFile
      const path_list = dialog.showOpenDialogSync({
        properties: ['openDirectory']
      })
      if (!path_list) { //取消打开时为undefined
        return
      }
      const the_path = path_list[0]
      config_util.setRepoRoot(the_path)

      //重新init
      this.init()

      //不寻找更新列表\今日页面的显示
    },
    onOpenRepoInFinder() {
      shell.openExternal("file://" + this.repo_root)
    },
    onOpenHomepage() {
      shell.openExternal("https://huacishu.com")
    }


  },


}
</script>

<style scoped>
.setting {
  padding: 10px;
  padding-top: 20px;
}

.link_text {
  cursor: default;
  font-size: small;
}

.link_text:hover {
  text-decoration: underline;
}

.setting_item {
  margin-top: 10px;
  display: flex;
  align-items: baseline;
}

.about {
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: small;
  color: gray;
}

.about > .link_text {
  font-size: small;
}


.editor_setting {
  margin-top: 2em;
  font-size: small;
  border-bottom: 1px lightgrey solid;
}

</style>
