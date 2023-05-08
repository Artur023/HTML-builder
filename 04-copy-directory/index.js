const fs = require("fs");
const path = require("path");
const { readdir } = require("node:fs/promises");

let copyFileWay = path.join(__dirname, "files-copy");

fs.rm(copyFileWay, { recursive: true }, () => {
  fs.mkdir(copyFileWay, { recursive: true }, async (err) => {
    if (err) {
      throw err;
    } else {
      await getFiles(path.join(__dirname, "files"));
    }
  });
});

async function getFiles(way) {
  try {
    const files = await readdir(way);
    for (const file of files) {
      fs.copyFile(
        path.join(__dirname, "files", file),
        path.join(__dirname, "files-copy", file),
        (err) => {
          if (err) throw err;
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
}
