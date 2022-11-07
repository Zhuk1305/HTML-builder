const fs = require("fs");
const path = require("path");

const pathToSecretFolder = path.join(__dirname, "secret-folder");

fs.readdir(pathToSecretFolder, { withFileTypes: true }, (err, data) => {
  if (err) throw err;
  for (const file of data) {
    if (file.isFile()) {
      getStats(pathToSecretFolder, file.name);
    }
  }
});

function getStats(pathToSecretFolder, file) {
  const extension = path.extname(file);
  const name = file.slice(0, file.indexOf(extension));
  let size = "";
  fs.stat(path.join(pathToSecretFolder, file), (err, data) => {
    if (err) throw err;
    size = data.size / 1000 + "kb";
    console.log(`${name} - ${extension.slice(1)} - ${size}`);
  });
}
