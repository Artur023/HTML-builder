//В файле **index.js** директории **02-write-file** напишите скрипт выводящий в консоль приветствие,
// ожидающий ввод текста, и записывающий введённый текст в файл.

// - [ ] Внутри папки 02-write-file находится 1 файл **index.js**
// - [ ] При выполнении команды ```node 02-write-file``` в папке  ```02-write-file``` создаётся текстовый файл,
//  а в консоль выводится приглашение на ввод текста(На ваш выбор)
// - [ ] После ввода текста в каталоге ```02-write-file``` введённый текст должен быть записан в созданный ранее файл.
//  Процесс не завершается и ждёт нового ввода.
// - [ ] После следующего ввода созданный изначально текстовый файл дополняется новым текстом, процесс продолжает ждать ввод.
// - [ ] При нажатии сочетания клавиш ```ctrl + c``` или вводе ```exit``` в консоль выводится прощальная фраза и процесс завершается.

const fs = require("fs");
const path = require("path");
const { stdout, stdin } = require("process");

stdout.write("Привет! вы находитесь в 02-write-file! Введите текст: ");

stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    process.exit();
  }

  fs.appendFile(path.join(__dirname, "new-text.txt"), data, (err) => {
    if (err) throw err;
  });
});

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("exit", () => {
  stdout.write("\n Пока пока");
});
