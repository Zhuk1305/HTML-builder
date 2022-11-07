const fs = require("fs");
const path = require("path");
fs.rm(
  path.join(__dirname, "files-copy"),
  { force: true, recursive: true },
  (err) => {
    if (err) throw err;

    fs.mkdir(path.join(__dirname, "files-copy"), { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.readdir(
      path.join(__dirname, "files"),
      { withFileTypes: true },
      (err, data) => {
        if (err) throw err;
        for (const file of data) {
          if (file.isFile()) {
            copyFile(file.name);
          }
        }
      }
    );
  }
);

function copyFile(file) {
  fs.copyFile(
    path.join(__dirname, "files", file),
    path.join(__dirname, "files-copy", file),
    (err) => {
      if (err) throw err;
    }
  );
}
