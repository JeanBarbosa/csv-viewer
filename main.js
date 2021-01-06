const { BrowserWindow, app, ipcMain, dialog } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('src/windows/index.html');
  win.webContents.toggleDevTools();
}

app.whenReady().then(createWindow);

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
    filters: [
      { name: 'All Files', extensions: ['csv'] }
    ]
  }).then(result => {

    if (result.filePaths) {
      event.sender.send('selected-directory', result.filePaths);
    }

  }).catch(err => {
    console.log(err)
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})