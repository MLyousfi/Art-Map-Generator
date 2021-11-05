const electron = require('electron');
const url = require('url');
const path = require('path');

const {app ,contextBridge , BrowserWindow,Menu , ipcMain} = electron;

let mainWindow,secondWindow;
let boot = () => {
        mainWindow = new BrowserWindow({
            width : 800,
            height : 600,
            frame : false,
            webPreferences : {
                enableRemoteModule: true,
                nodeIntegration : true,
                contextIsolation : false
            }
        });
    
        //load html file into the window
        mainWindow.loadFile('./index.html')
        mainWindow.webContents.openDevTools();
        mainWindow.on('closed',function(){
            app.quit();
        })
        
    
}
app.whenReady().then(boot)
  
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

var globlData = null;

ipcMain.on('render-data:add', (event, data)=> {
  
  
  globlData = data;
  createSecondWindow(data);

})


app.on('activate', () => {
    // On macOS it's common to re-create a window in the 
    // app when the dock icon is clicked and there are no 
    // other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    boot()
  }
})
  
// In this file, you can include the rest of your 
// app's specific main process code. You can also 
// put them in separate files and require them here.

let createSecondWindow = (data) =>
{
   
    secondWindow = new BrowserWindow({
        width : 800,
        height : 600,
        frame : false,
        webPreferences : {
            enableRemoteModule: true,
            nodeIntegration : true,
            contextIsolation : false
        }
    });
    secondWindow.loadFile('./ChildWindow.html');
    secondWindow.webContents.openDevTools();
    secondWindow.once('ready-to-show', () => {
      secondWindow.show()
    })
    secondWindow.webContents.once('dom-ready', () => {
      secondWindow.webContents.send('render:add', globlData);
    });
    secondWindow.on('closed', () => secondWindow = null)
    
}