const csv = require('csv-parser');
const fs = require('fs');
const results = [];
const { ipcRenderer } = require('electron');
const selectDirBtn = document.getElementById('select-directory');
const modal = require('./modal');

selectDirBtn.addEventListener('click', (event) => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('selected-directory', (event, path) => {
  // document.getElementById('selected-file').innerHTML = `You selected: ${path}`;

  if (Array.isArray(path)) {
    console.log(path[0])
    fs.createReadStream(path[0])
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        modal(results);
      });
  }
});