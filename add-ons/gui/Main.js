const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
const Store = require('./src/store.js');

let win

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'guistorage',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 800, height: 600 }
  }
});

function createWindow () {
  let { width, height } = store.get('windowBounds');
  win = new BrowserWindow({ width, height })

  win.loadFile('index.html')
  //win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('goback', (event, arg) => {
  win.loadFile('index.html')
})

// Attach listener in the main process with the given ID
ipcMain.on('beginquery', (event, arg) => {
  if (arg['hash']) {
    store.set('query', arg['hash'])
    win.loadURL(`file://${__dirname}/pages/query.html`)
    ipcMain.on('gethash', (event, arg) => {
      event.sender.send('hashvalue', store.get('query'));
    });
  }
});
