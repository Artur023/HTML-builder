const fs = require("fs");
const path = require("path");
const { readdir } = require("node:fs/promises");

const wayStyles = path.join(__dirname, "styles");
const output = fs.createWriteStream(
  path.join(__dirname, "project-dist", "style.css")
);

const option = {
  encoding: "utf-8",
  withFileTypes: true,
};

(async function createDirDist() {
  fs.mkdir(path.join(__dirname, "project-dist"), { recursive: true }, (err) => {
    if (err) throw new Error("problems with directory dist");
  });
})();

(async function getFilesStyle(way) {
  try {
    const files = await readdir(way, option);
    for (const file of files) {
      // console.log("getFileStyle", file);
      //проверка на css
      if (file.isFile() === true && path.extname(file.name) === ".css") {
        //streams
        const input = fs.createReadStream(
          path.join(__dirname, "styles", file.name),
          "utf-8"
        );
        input.on("data", (data) => {
          output.write(data.toString());
        });
      }
    }
  } catch (err) {
    console.error("getFilesStyle", err);
  }
})(wayStyles);
//Assets
let assetsWay = path.join(__dirname, "project-dist", "assets");
(async function createDirAssets() {
  fs.mkdir(assetsWay, { recursive: true }, async (err) => {
    if (err) {
      throw new Error("problems with directory assets");
    } else {
      await getAssets(path.join(__dirname, "assets"));
    }
  });
})();

async function getAssets(old, dist) {
  try {
    const files = await readdir(old, { withFileTypes: true });
    for (const file of files) {
      // console.log("getAssets", file);
      if (file.isDirectory()) {
        const old = path.join(__dirname, "assets", file.name);
        const dist = path.join(__dirname, "project-dist", "assets", file.name);
        getAssets(old, dist);
      } else {
        fs.mkdir(
          dist,
          {
            recursive: true,
          },
          (err) => {
            if (err) {
              throw new Error("problems with directory assets");
            }
          }
        );
        fs.copyFile(
          path.join(old, file.name),
          path.join(dist, file.name),
          (err) => {
            if (err) throw new Error("problems with assets copyFile");
          }
        );
      }
    }
  } catch (err) {
    console.error("getAssets", err);
  }
}

(async function changeTemp() {
  const input = fs.createReadStream(
    path.join(__dirname, "template.html"),
    "utf-8"
  );
  const output = fs.createWriteStream(
    path.join(__dirname, "project-dist", "index.html")
  );
  let code = "";
  input.on("data", (data) => {
    code = data.toString();
  });
  function changer(item) {
    return `{{${item}}}`;
  }

  const components = path.join(__dirname, "components");

  fs.readdir(components, { withFileTypes: true }, (err, data) => {
    if (err) {
      throw new Error("problems with readdir components");
    }
    let elemi = [];
    let filesName = [];
    for (const elem of data) {
      const fileName = elem.name;
      filesName.push(fileName);
      elemi.push(changer(fileName.slice(0, elem.name.indexOf("."))));
    }
    for (let i = 0; i < elemi.length; i++) {
      let tagName = elemi[i];
      const readableStream = fs.createReadStream(
        path.join(__dirname, "components", filesName[i]),
        "utf-8"
      );

      readableStream.on("data", (data) => {
        code = code.replace(tagName, data);
        if (i === elemi.length - 1 && !code.includes(tagName)) {
          output.write(code);
        }
      });
    }
  });
})();
