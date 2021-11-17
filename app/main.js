const electron = require('electron');
const url = require('url');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { dialog } = require('electron')

autoUpdater.logger = log;

autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');  

autoUpdater.autoInstallOnAppQuit = true;
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
        mainWindow.loadFile('./app/html/index.html')
        mainWindow.webContents.openDevTools();
        mainWindow.on('closed',function(){
            app.quit();
        })
        mainWindow.once('ready-to-show', function ()  {
          autoUpdater.checkForUpdatesAndNotify();
        });
        mainWindow.maximize();
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
    secondWindow.loadFile('./app/html/ChildWindow.html');
    secondWindow.webContents.openDevTools();
    secondWindow.once('ready-to-show', () => {
      secondWindow.show()
      secondWindow.maximize();
    })
    secondWindow.webContents.once('dom-ready', () => {
      secondWindow.webContents.send('render:add', globlData);
    });
    secondWindow.on('closed', () => secondWindow = null)

    
}

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = (text , percent = 0) => {
  let data = {text : text, percent : percent}
  log.info(data);
  if (mainWindow) {
    mainWindow.webContents.send('message', data);
  }
};

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('download-progress', progressObj => {
    let speed = progressObj.bytesPerSecond / (8 * 1024);
    let downloaded = progressObj.percent;
    let transferred = progressObj.transferred / (8 * 1024 * 1024);
    let total = progressObj.total / (8 * 1024 * 1024);
  let log_message = "Download speed: " + speed.toFixed(2) + ' Ko/s';
    log_message = log_message + ' - Downloaded ' + downloaded.toFixed(2) + '%';
    log_message = log_message + ' - (' + transferred.toFixed(2) + "Mo/" + total.toFixed(2) + 'Mo)';
    sendStatusToWindow(log_message,downloaded);
  });

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
autoUpdater.on('update-not-available', info => {
    console.log('Update not available.');
  });

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});




// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// });
// autoUpdater.on('update-available', info => {
//   sendStatusToWindow('Update available.');
// });
// autoUpdater.on('update-not-available', info => {
//   sendStatusToWindow('Update not available.');
// });
// autoUpdater.on('error', err => {
//   sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
// });
// autoUpdater.on('download-progress', progressObj => {
//   sendStatusToWindow(
//     `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
//   );
// });
// autoUpdater.on('update-downloaded', info => {
//   sendStatusToWindow('Update downloaded; will install now');
// });

// autoUpdater.on('update-downloaded', info => {
//   // Wait 5 seconds, then quit and install
//   // In your application, you don't need to wait 500 ms.
//   // You could call autoUpdater.quitAndInstall(); immediately
//   autoUpdater.quitAndInstall();
// });