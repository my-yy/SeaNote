import {getCurrentWindow} from "@electron/remote";

function toggleWindow() {
  console.log("toggleWindow")
  const window = getCurrentWindow()
  if (window.isMaximized()) {
    window.unmaximize()
  } else {
    window.maximize()
  }

}

export default {
  toggleWindow
}
