import $ from "jquery";
import SparkMD5 from "spark-md5";
import path from "path";
import fs from "fs";

async function toRelativePath(html, pkg_path) {
  const dom = $.parseHTML(`<div>${html}</div>`)[0]
  const img_list = $(dom).find("img")
  for (let i = 0; i < img_list.length; i++) {
    const d = $(img_list[i])
    const src = d.attr("src")
    let new_src
    if (src.startsWith("file://")) {
      //file:///Users/..../笔记1.m2e/assets/1668179808182.png =>  ./assets/1668179808182.png
      new_src = "./assets/" + src.split("/assets/").pop()
    } else if (src.startsWith("blob:")) {//存储
      new_src = await saveImage(src, pkg_path)
    }
    if (new_src) {
      d.attr("src", new_src)
    }

  }
  return $(dom).html()
}

async function saveImage(blob_url, pkg_path) {
  const blob = await blobUrl2Blob(blob_url)
  const buffer = await blob2Buffer(blob)


  //1.计算以md5命名
  const spark = new SparkMD5.ArrayBuffer()
  spark.append(buffer)
  const hash = spark.end()
  const name = hash + ".png"
  const save_folder = path.join(pkg_path, "assets")

  //2.存储
  if (!fs.existsSync(save_folder)) {
    fs.mkdirSync(save_folder, {recursive: true})
  }
  const file_path = path.join(save_folder, name)

  if (fs.existsSync(file_path)) {
    // console.log("跳过储存:", file_path)
  } else {
    fs.writeFileSync(file_path, buffer)
    // console.log("储存:", file_path)
  }
  return "./assets/" + name
}


function blobUrl2Blob(blobUrl) {
  return new Promise((resolve => {
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const recoveredBlob = xhr.response;
      resolve(recoveredBlob)
    };
    xhr.open('GET', blobUrl);
    xhr.send();
  }))
}

function blob2Buffer(blob) {
  //返回的buffer可以直接存储到本地：fs.writeFileSync(save_path, buffer)
  const reader = new FileReader()
  return new Promise((resolve => {
    reader.onload = function () {
      const buffer = new Buffer(reader.result)
      resolve(buffer)
    }
    reader.readAsArrayBuffer(blob)
  }))
}


function toAbsolutePath(html, folder_path) {
  if (!folder_path.endsWith("/")) {
    folder_path += "/"
  }
  const dom = $.parseHTML(`<div>${html}</div>`)[0]
  const img_list = $(dom).find("img")
  for (let i = 0; i < img_list.length; i++) {
    const d = $(img_list[i])
    const src = d.attr("src")
    //file:///Users/my/Library/Mobile Documents/com~apple~CloudDocs/笔记1.m2e/assets/1668179808182.png
    const new_src = `file://${folder_path}assets/` + src.split("/assets/").pop()
    d.attr("src", new_src)
  }
  return $(dom).html()
}

async function getImageSizeFromUrl(imgURL) {
  const img = new Image();
  img.src = imgURL
  const ratio = window.devicePixelRatio
  return new Promise((resolve => {
    img.onload = () => {
      resolve({
        width: img.width / ratio, height: img.height / ratio, url: imgURL, object: img
      })
    }
  }))
}

export default {
  toAbsolutePath,
  toRelativePath,
  getImageSizeFromUrl
}
