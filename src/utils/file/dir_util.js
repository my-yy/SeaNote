import fs from "fs";

function mkdir_if_necessary(folder_path) {
  if (!fs.existsSync(folder_path)) {
    fs.mkdirSync(folder_path, {recursive: true})
  }
}

export default {
  mkdir_if_necessary
}
