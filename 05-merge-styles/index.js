const fs = require("fs");
const path = require("path");

const outputCss = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css")
);

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    for (const file of data) {
      if (file.isFile() && path.extname(file.name) === ".css") {
        writeCssToFile(file.name);
      }
    }
  }
);

function writeCssToFile(file) {
  const readableStream = fs.createReadStream(
    path.join(__dirname, "styles", file),
    "utf-8"
  );
  readableStream.on("data", (data) => outputCss.write(data));
}
