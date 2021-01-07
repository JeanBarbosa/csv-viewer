const csv = require('csv-parser');
const fs = require('fs');
const results = [];
const { ipcRenderer } = require('electron');
const selectDirBtn = document.getElementById('select-directory');
const modal = require('./modal');

const getFile = (filePath) => {
  if (Array.isArray(filePath)) {
    fs.createReadStream(filePath[0])
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        modal(results);
      });
  } else {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        modal(results);
      });
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