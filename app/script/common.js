var orange = getComputedStyle(document.body).getPropertyValue('--orange');
var orange_dark = getComputedStyle(document.body).getPropertyValue('--orange--dark');
var red = getComputedStyle(document.body).getPropertyValue('--red');
var red_dark = getComputedStyle(document.body).getPropertyValue('--red--dark');
var green = getComputedStyle(document.body).getPropertyValue('--green');
var green_dark = getComputedStyle(document.body).getPropertyValue('--green--dark');
var element = document.getElementById('alert');
var message = document.getElementById('alert_msg');
var sec_message = document.getElementById('alert_sec');
function sendAlert(type, msg,getBottom = false,sec = '')
{
    let border, background;
    switch (type) {
        case 'error':
            border = `8px solid ${red_dark}`;
            background = red;
            break;
        case 'alert':
            border = `8px solid ${orange_dark}`;
            background = orange;
            break;
        case 'success':
            border = `8px solid ${green_dark}`;
            background = green;
            break;
        
        default:
            break;
    }
    element.style.borderLeft = border;
    element.style.background = background;
    var botSection = document.getElementById('botSection');
    if(getBottom)
    {
        if(botSection.classList.contains('show'))
        {
            element.style.bottom = botSection.clientHeight + 10 + 10 +'px'
        }
        
    }else{
        element.style.bottom = '10px'
    }
    sec_message.innerHTML=sec;
    
    message.innerHTML = msg;
    element.classList.remove('hide');
    element.classList.add('show');

    
}

function closeAlert()
{
    var element = document.getElementById('alert');
    if(element.classList.contains('show'))
    {
        element.classList.remove('show');
        element.classList.add('hide');
    }
    
}


function donate() {
    const shell = require('electron').shell;
    shell.openExternal("https://www.half-shield.com")
    
};

const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
var helpWindow= null;

function help()
  {
    helpWindow = new BrowserWindow({
      width : 800,
      height : 600,
      frame : false,
      webPreferences : {
          enableRemoteModule: true,
          nodeIntegration : true,
          contextIsolation : false
        },
        resizable: false
    });
    helpWindow.loadFile('./app/html/help.html');
    
    //helpWindow.webContents.openDevTools();
    helpWindow.once('ready-to-show', () => {
      helpWindow.show()
      })
      helpWindow.on('closed', () => helpWindow = null)
  }

  function closeHelp()
  {
        var window = electron.remote.getCurrentWindow();
       window.close();
  }