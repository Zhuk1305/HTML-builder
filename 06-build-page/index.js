const fs = require("fs");
const path = require("path");
fs.rm(
  path.join(__dirname, "project-dist"),
  { force: true, recursive: true },
  (err) => {
    if (err) throw err;

    fs.mkdir(
      path.join(__dirname, "project-dist"),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );
    // assets
    fs.mkdir(
      path.join(__dirname, "project-dist", "assets"),
      { recursive: true },
      (err) => {
        if (err) throw err;
        getCopyAssets("");
      }
    );
    // assets end
    // css
    buildCss();
    // css end
    // html
    buildHTML();
    // html end
  }
);
//assets
function getCopyAssets(folder) {
  const pathToFile = path.join(__dirname, "assets", folder);
  fs.readdir(pathToFile, { withFileTypes: true }, (err, data) => {
    if (err) throw err;
    for (const file of data) {
      if (file.isFile()) {
        copyFile(pathToFile, folder, file.name);
      } else {
        getCopyAssets(file.name);
      }
    }
  });
}
function copyFile(folderPath, folder, file) {
  fs.mkdir(
    path.join(__dirname, "project-dist", "assets", folder),
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
  fs.copyFile(
    path.join(folderPath, file),
    path.join(__dirname, "project-dist", "assets", folder, file),
    (err) => {
      if (err) throw err;
    }
  );
}

//css
function buildCss() {
  const outputCss = fs.createWriteStream(
    path.join(__dirname, "project-dist", "style.css")
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
}

// html
function buildHTML() {
  const outputHtml = fs.createWriteStream(
    path.join(__dirname, "project-dist", "index.html")
  );

  writeHtmlToFile();
  function writeHtmlToFile() {
    const readableTemplateStream = fs.createReadStream(
      path.join(__dirname, "template.html"),
      "utf-8"
    );

    readableTemplateStream.on("data", (templateData) => {
      let componentArr = [];
      fs.readdir(
        path.join(__dirname, "components"),
        { withFileTypes: true },
        (err, data) => {
          if (err) throw err;
          for (const file of data) {
            if (file.isFile() && path.extname(file.name) === ".html") {
              componentArr.push(file.name);
              for (let i = 0; i < componentArr.length; i++) {
                const compRead = fs.createReadStream(
                  path.join(__dirname, "components", componentArr[i]),
                  "utf-8"
                );
                compRead.on("data", (el) => {
                  templateData = templateData.replace(
                    `{{${componentArr[i].slice(
                      0,
                      componentArr[i].indexOf(".html")
                    )}}}`,
                    el
                  );
                  if (i === componentArr.length - 1) {
                    outputHtml.write(templateData);
                  }
                });
              }
            }
          }
        }
      );
    });
  }
}
