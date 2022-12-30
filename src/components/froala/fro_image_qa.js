//https://froala.com/wysiwyg-editor/examples/custom-image-button/
import FroalaEditor from "froala-editor";
import $ from "jquery";

FroalaEditor.DefineIcon('imageQA', {NAME: 'star-half-alt', template: 'font_awesome_5'});

FroalaEditor.RegisterCommand('imageQA', {
  title: '图片遮挡',
  focus: false,
  undo: false,
  refreshAfterCallback: false,
  callback: function (cmdName) {
    console.log("cmdName", cmdName)
    const $img = this.image.get();
    handleQAImage($img)
    //隐藏掉该按钮
    $("div.fr-popup.fr-active").removeClass("fr-active")
  },
})

async function handleQAImage($img) {
  //1.获得原图
  let origin_src, jsonData
  const KEY_DATA_JSON = "data-qa-json"
  const KEY_DATA_Q_KEY = "data-ky-qkey"
  const jsonData_raw = $img.attr(KEY_DATA_JSON)
  if (jsonData_raw) {
    const key = $img.attr("data-ky-key")
    origin_src = await sybj_util.getImgUrl("sybj://" + key)
    jsonData = decodeURIComponent(jsonData_raw)
  } else {
    origin_src = $img.attr('src')
  }
  //2.保留现在的尺寸
  const originW = $img.width()
  const originH = $img.height()

  //3.加载编辑器
  const ans = await this.$refs.MyImageQA.load(origin_src, originW, originH, jsonData)
  if (ans.use_origin) {
    //1.删除
    $img.removeAttr(KEY_DATA_JSON)
    //2.变为原图
    $img.attr('src', origin_src)
    //注意：只设置宽度，而不设置高度，并且，通过jquery的attr()来设置，否则会设置到sytle='xx'中去
    $img.attr("width", originW)
    return
  }


  //1.重新加载图像内容
  const base64StringUrl = ans.url
  $img.attr('src', base64StringUrl)
  $img.attr("width", originW)


  //2.更新json信息：
  $img.attr(KEY_DATA_JSON, encodeURIComponent(ans.json))

  //3.保存新的图片内容
  const originKeyName = $img.attr("data-ky-key").split(".")[0]
  const qKey = originKeyName + ".q" + new Date().getTime() + ".jpg"
  protocol_util.saveBase64StringToSybjFolder(base64StringUrl, qKey)
  //4.更新qkey
  $img.attr(KEY_DATA_Q_KEY, qKey)


  //5.上传
  protocol_util.uploadSybjFile(qKey)

  console.log("done:", qKey)

  //6.提示change
  // this.onContentChange()
}

