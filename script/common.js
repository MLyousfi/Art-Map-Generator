var orange = getComputedStyle(document.body).getPropertyValue('--orange');
var orange_dark = getComputedStyle(document.body).getPropertyValue('--orange--dark');
var red = getComputedStyle(document.body).getPropertyValue('--red');
var red_dark = getComputedStyle(document.body).getPropertyValue('--red--dark');
var green = getComputedStyle(document.body).getPropertyValue('--green');
var green_dark = getComputedStyle(document.body).getPropertyValue('--green--dark');
var element = document.getElementById('alert');
var message = document.getElementById('alert_msg');
function sendAlert(type, msg,getBottom = false)
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
    message.innerHTML = msg;
    element.classList.remove('hide');
    element.classList.add('show');

    
}

function closeAlert()
{
    var element = document.getElementById('alert');
    element.classList.remove('show');
    element.classList.add('hide');
}

   