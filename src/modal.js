const { BrowserWindow } = require('electron').remote;
const path = require('path');

const createModal = (csvdata) => {
  const modalPath = path.join('file://', __dirname, './windows/modal.html')
  let win = new BrowserWindow({ width: 700, height: 420 });

  win.on('close', () => { win = null });

  win.webContents.on('did-finish-load', () => {

    const properties = Object.getOwnPropertyNames(csvdata[0]);

    let code = `
    const csv = ${JSON.stringify(csvdata, true)};
    const properties = ${JSON.stringify(properties)};

    let table = document.getElementById("csv-table");

    csv.map((item, index) => {
      let row = table.insertRow();

      properties.map(property => {
        let cell = row.insertCell();
        cell.innerHTML = \`\$\{item[property] \}\`;
      })
      
    })
    `;

    win.webContents.executeJavaScript(code);
  });

  win.loadURL(modalPath);
  win.show();
}

module.exports = createModal;