const path = require("path");
builderOptions = {
  "productName": "拾忆笔记2",
  "appId": "com.huacishu.seanote2",
  "mac": {
    "icon": "public/icon/sea.icns",
    "target": {
      "target": "dmg",
      "arch": [
        "arm64", "x64"
      ]
    },
  },
  "fileAssociations": [
    {
      "ext": "m2e",
      "name": "SeaNote2 File",
      "icon": "public/icon/doc_icon.icns",
      "role": "Editor",
      "isPackage": true,
    }
  ]
}

const isMobile = process.env.FUSION_ENV === "mobile"
const config = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: builderOptions
    }
  },
  configureWebpack: {
    entry: {
      app: isMobile ? './src/main-mobile.js' : './src/main.js'
    }
  },
}

if (isMobile) {
  //直接打包到iOS里面去
  config.outputDir = path.resolve(__dirname, "../iOS/mymemo/bundle_files/dist/")
  config.publicPath = ""
}


module.exports = config
