const fs = require("fs")
const path = require("path")

function searchAllNotes(root_path) {
  const queue = [root_path]
  const all_files = []
  while (queue.length > 0) {
    const folder_path = queue.pop()
    // console.log("search:", folder_path)
    const names = fs.readdirSync(folder_path)
    for (const name of names) {
      const full_path = path.join(folder_path, name)
      const id_dir = fs.lstatSync(full_path).isDirectory()
      if (!id_dir) {
        continue //只需要文件夹
      }
      if (name.startsWith(".") || name.startsWith("~")) {
        //不要隐藏的文件夹
        continue
      }
      const is_note = name.endsWith(".m2e")
      if (is_note) {
        all_files.push(full_path)
      } else {
        queue.push(full_path)
      }
    }
  }
  // console.log(all_files)
  return all_files
}

module.exports = {
  searchAllNotes
}
