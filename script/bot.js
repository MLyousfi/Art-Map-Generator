const mineflayer = require('mineflayer')

const inventoryViewer = require('mineflayer-web-inventory')

const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock




function StartBot()
{

  closeAlert();
  var host = document.getElementById('host').value;
  var port = document.getElementById('port').value;
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  
  try {
    const bot = mineflayer.createBot({
      host: host, 
      username: username, 
      port: port,
    })
    bot.on('spawn', () => {
      bot.mcData = require('minecraft-data')(bot.version);
      followPlayer(bot);
      
    })
    bot.on('kicked', (reason, loggedIn) => sendAlert(reason+'\n'+loggedIn,err.message,true))
    bot.on('error', (err)=> {
      sendAlert('error',err.message,true)
    })
    bot.on('login',()=> {
      closeBotSection();
      sendAlert('success','connected',true);
    })

    bot.loadPlugin(pathfinder)
    
    




  } catch (error) {
    sendAlert('error',error.message,true)
    console.error(error.message)
  }
  
   

}

function followPlayer(bot)
{
  bot.chat('I am here');
  const playerCI = bot.players['HunterThe']

    if (!playerCI || !playerCI.entity) {
        bot.chat("I can't see CI!")
        return;
    }
  const movements = new Movements(bot,bot.mcData);

  bot.pathfinder.setMovements(movements);
  const goal = new GoalFollow(playerCI.entity, 2);
  bot.pathfinder.setGoal(goal , true);
  

}
