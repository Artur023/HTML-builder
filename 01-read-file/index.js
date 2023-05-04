//В файле **index.js** директории **01-read-file** напишите скрипт выводящий в консоль содержимое файла **text.txt**.

// - [ ] Внутри папки ***01-read-file*** находятся 2 файла **index.js** и **text.txt**
// - [ ] При выполнении команды ```node 01-read-file``` в корневом каталоге репозитория в консоль выводится содержимое файла **text.txt**.
// - [ ] В коде не должны быть использованы синхронные методы чтения файла.
// - [ ] Чтение файла должно происходить с помощью **ReadStream**.

const fs = require("fs");
const path = require("path");
const { stdout } = require("process");

const stream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
let text = "";
stream.on("data", (chunk) => {
  text += chunk;
});
stream.on("end", () => {
  stdout.write(text);
});
