const fs = require("fs");
const path = require("path");
const { readdir } = require("node:fs/promises");

const way = path.join(__dirname, "styles");
const output = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css")
);

const option = {
  encoding: "utf-8",
  withFileTypes: true,
};

async function getFiles(way) {
  try {
    const files = await readdir(way, option);
    for (const file of files) {
      //проверка на css
      if (file.isFile() === true && path.extname(file.name) === ".css") {
        console.log(file);
        //streams
        const input = fs.createReadStream(
          path.join(__dirname, "styles", file.name),
          "utf-8"
        );
        // input.pipe(output);
        input.on("data", (data) => {
          output.write(data.toString());
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}
getFiles(way);
