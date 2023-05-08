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
