const path = require("path");
const fs = require("fs");
const { readdir } = require("node:fs/promises");

const option = {
  encoding: "utf-8",
  withFileTypes: true,
};

const way = path.join(__dirname, "secret-folder");
async function getFiles(way) {
  try {
    const files = await readdir(way, option);
    for (const file of files) {
      if (file.isFile() === true) {
        let name = file.name.slice(0, file.name.indexOf("."));
        let pathFile = path.join(__dirname, "secret-folder", file.name);
        fs.stat(pathFile, (err, stats) => {
          console.log(
            `${name} - ${path.extname(file.name).slice(1)} - ${
              stats.size / 1000
            } kb`
          );
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}
getFiles(way);
