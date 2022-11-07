const { stdin, stdout, exit } = process;

const fs = require("fs");
const path = require("path");

const output = fs.createWriteStream(path.join(__dirname, "text.txt"));
stdout.write("Write your message:\n");
stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") exit();
  output.write(data);
});
process.on("SIGINT", () => {
  exit();
});

process.on("exit", () => {
  stdout.write("Goodbye my friend!");
});
