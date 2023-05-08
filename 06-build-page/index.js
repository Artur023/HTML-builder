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

const way = path.join(__dirname, "styles");
const output = fs.createWriteStream(
  path.join(__dirname, "project-dist", "style.css")
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