let change_size_pointer
let editor

function setUp(the_editor) {
  editor = the_editor
  window.addEventListener("resize", changeSize);
}

function tearDown() {
  editor = null
  change_size_pointer = null
  window.removeEventListener("resize", changeSize);
}

function changeSize() {
  clearTimeout(change_size_pointer)
  change_size_pointer = setTimeout(changeSizeCore, 500)
}

// function changeFraoalaSizeCore1() {
//   const topLine = document.getElementById("top_Line")
//   if (!topLine) {
//     return
//   }
//   const domTopLine = topLine.getBoundingClientRect().bottom
//   const windowHeight = document.documentElement.clientHeight;
//   const height = windowHeight - domTopLine - 4
//   // console.log("windowHeight：", windowHeight, "domTopLine:" + domTopLine, "height:", height)
//   editor.opts.height = height;
//   editor.size.refresh();
// }

function changeSizeCore() {
  const container = document.getElementById("fro_container")
  const toolbar = document.getElementsByClassName("fr-toolbar")[0]
  const height = container.offsetHeight - toolbar.offsetHeight
  editor.opts.height = height;
  editor.size.refresh();
  console.log("height:", container.offsetHeight, toolbar.offsetHeight)
}

export default {
  setUp,
  tearDown,
  changeSizeCore
}
