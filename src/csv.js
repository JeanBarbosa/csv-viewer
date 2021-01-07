const csv = require('csv-parser');
const fs = require('fs');
const modal = require('./modal');
const selectDirBtn = document.getElementById('select-directory');
const { ipcRenderer } = require('electron');

const getFile = (filePath) => {

  const results = [];

  const parser = (path) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        modal(results);
      });
  }

  if (Array.isArray(filePath)) {

    filePath.map(file => {
      parser(file);
    })
  } else {
    parser(filePath);
  }
}

selectDirBtn.addEventListener('click', (event) => {
  ipcRenderer.send('open-file-dialog');
});

document.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();

  for (const f of event.dataTransfer.files) {
    if (f.type === "text/csv")
      getFile(f.path);
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

ipcRenderer.on('selected-directory', (event, path) => {
  // document.getElementById('selected-file').innerHTML = `You selected: ${path}`;
  getFile(path);
});