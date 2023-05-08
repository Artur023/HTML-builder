const fs = require("fs");
const path = require("path");
const { readdir } = require("node:fs/promises");
// В файле index.js директории 06-build-page напишите скрипт который:

// Создаёт папку project-dist.
// Заменяет шаблонные теги в файле template.html с названиями файлов из папки components (пример:{{section}}) на содержимое одноимённых компонентов и сохраняет результат в project-dist/index.html.
// Собирает в единый файл стили из папки styles и помещает их в файл project-dist/style.css.
// Копирует папку assets в project-dist/assets

// Требования
//  После завершения работы скрипта должна быть создана папка project-dist
//  В папке project-dist должны находиться файлы index.html и style.css
//  В папке project-dist должна находиться папка assets являющаяся точной копией папки assets находящейся в 06-build-page
//  Запрещается использование fsPromises.cp()
//  Файл index.html должен содержать разметку являющуюся результатом замены шаблонных тегов в файле template.html
//  Файл style.css должен содержать стили собранные из файлов папки styles
//  При добавлении компонента в папку и соответствующего тега в исходный файл template.html повторное выполнение скрипта приведёт файл index.html в папке project-dist в актуальное состояние перезаписав его. Файл style.css и папка assets так же должны поддерживать актуальное состояние
//  При записи двух и более шаблонных тегов подряд в файле template.html, разделенных между собой только пробелами без переноса строки, не должно возникать ошибок выполнения кода. Например, {{about}} {{articles}} должно расцениваться как 2 отдельных компонента
//  Исходный файл template.html не должен быть изменён в ходе выполнения скрипта
//  Запись в шаблон содержимого любых файлов кроме файлов с расширением .html является ошибкой

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

// function changeTemp() {
//   const input = fs.createReadStream(
//     path.join(__dirname, "template.htm"),
//     "utf-8"
//   );
//   const output = fs.createWriteStream(
//     path.join(__dirname, "project-dist", "index.html")
//   );
//   let code = "";
//   input.on("data", (data) => {
//     code = data.toString();
//   });
//   function change(item) {
//     return `{{${item}}}`;
//   }
//   const components = path.join(__dirname, "components");
//   fs.readdir(components, { withFileTypes: true }, err, (data) => {
//     if (err) {
//       throw new Error("problems with readdir components");
//     }
//     let elems = [];
//     for (const elem of data) {
//       console.log("elem", elem);
//     }
//   });
// }
