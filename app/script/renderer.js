
var app = angular.module('app', ['ngRoute']);

const { remote ,ipcRenderer } = require('electron');
const { globalEval } = require('jquery');
var globalData = null;
ipcRenderer.on('render:add' , (event, data) => {
    globalData = data;
    init();
    draw();
    console.log('data ',data);
})

//#region functions

const RectSizeCoef = 10;
var scale = 1;
var originx = 0;
var originy = 0;
var strokeWidth = 0.5;
var useMineCraftColor = false;

const canvas = document.getElementById('canvas');
ctx = canvas.getContext("2d");

function init()
{
    canvas.width  = (RectSizeCoef * globalData.XD);
    canvas.height = (RectSizeCoef * globalData.YD);
    canvas.style.height='90%';
}
function draw (){
    ctx.fillStyle = 'black';
    ctx.clearRect(0,0,canvas.width, canvas.height)
    //ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillRect(originx, originy, (RectSizeCoef * globalData.XD)/scale, (RectSizeCoef * globalData.Yd)/scale);
    for (const rect of globalData.rects) {
      ctx.fillStyle = useMineCraftColor ? useAdvancedColors? rect.c3 : rect.c2 : rect.c1;
      ctx.fillRect(rect.x,rect.y,rect.w-strokeWidth,rect.h-strokeWidth); 
    }
    if(selectedOldRect)
      {
        ctx.clearRect(selectedOldRect.x,selectedOldRect.y,selectedOldRect.w-strokeWidth,selectedOldRect.h-strokeWidth)
        ctx.fillStyle = 'rgba(0,255,0,01)';
        ctx.fillRect(selectedOldRect.x,selectedOldRect.y,selectedOldRect.w-strokeWidth,selectedOldRect.h-strokeWidth);
        
      }
      
      
}
const button_id = {
	original: "originalColor",
	minecraft: "minecraftColor",
}



var standardAdvance = document.getElementById('standardAdvance');
function changeColors(checked)
{
  if(!checked && useMineCraftColor == false)
  {
    useMineCraftColor = true;
    draw();
    standardAdvance.classList.remove("hide");
    if(StandardItemsRequired.length === 0) ItemsCalculation(true);

  }else if (checked && useMineCraftColor == true)
  {
    
    ChestPanel.style.transform="scale(0)"; 
    useMineCraftColor = false;
    draw();
    standardAdvance.classList.add("hide");
}
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    scaleX = ((RectSizeCoef * globalData.XD) / scale) / rect.width,    // relationship bitmap vs. element for X
    scaleY = ((RectSizeCoef * globalData.YD) / scale) / rect.height;  // relationship bitmap vs. element for Y
    return {
      x: (evt.clientX - rect.left) * scaleX  ,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    };
  }

  function GetDrawR(rects , x,y )
  {
    let r ,i = 0;
    while(r = rects[i++])
    {
      if(x == r.x && y == r.y)
      {
        return r;
      }
    }
  }
  
  function SwitchColorsType(checked)
  {
    useAdvancedColors = !checked;
    if(useAdvancedColors)
    {
      if(!hasAdvancedColors) PopulatingAdvancedColors();
      if(AdvancedItemsRequired.length === 0)
      {
        ItemsCalculation(false);
      }else
      {
        UpdateViewList(false);
      } 
    }else{
      if(StandardItemsRequired.length === 0)
      {
        ItemsCalculation(true);
      } else{
        UpdateViewList(true);
      }
    }
      
    draw();
  }
  var useAdvancedColors = false;
  var hasAdvancedColors = false;
  function PopulatingAdvancedColors()
  {
    document.body.style.cursor = "wait";
    for (const rect of globalData.rects)
    {
      if(!rect.hasOwnProperty('c3'))
      {
        rect.c3 = GetClosest(rect.c1 ,true);
      }
    }
    hasAdvancedColors = true;
    document.body.style.cursor = "default";
  }
  
  const createHashFromShallow = anObject => {
    if(anObject == null) return;
    const objKeys = Object.keys(anObject).sort().join("")
    const objValues = Object.values(anObject).sort().join("")
    return `${objKeys}${objValues}`
  }

  function ShowBotSection(){
    var element = document.getElementById('botSection');
    
    element.classList.remove('hide');
    element.classList.add('show');
  }
  function closeBotSection()
  {
      var element = document.getElementById('botSection');
      element.classList.remove('show');
      element.classList.add('hide');
  }

  var StandardItemsRequired = [];
  var AdvancedItemsRequired = [];
  function ItemsCalculation(standard)
  {
    const colorsdata = standard? MineCraftColors : AdvancedColors;
    const prop = standard? 'c2' : 'c3';
    const ItemsRequired = standard? StandardItemsRequired : AdvancedItemsRequired;
    for (let i = 0; i < globalData.rects.length; i++) {
      const color = globalData.rects[i][prop];
      const found = ItemsRequired.findIndex(el => el.itemName === colorsdata[colorsdata.findIndex(c => c.color === color)].name);
      if(found > -1) {
          ItemsRequired[found].number ++;
      }
      else
      {
        
        ItemsRequired.push({ number : 1, itemName: colorsdata[colorsdata.findIndex(c => c.color === color)].name });
      }
      
    }

    if(standard)
    {
      StandardItemsRequired = ItemsRequired;
      
    }
    else
    {
      AdvancedItemsRequired = ItemsRequired;
    }
    UpdateViewList(standard);
    
  }
  
  var ItemTableContent = document.getElementById('ItemTableContent');
  var smallIndicator = document.getElementById('smallIndicator');
  var BigIndicator = document.getElementById('ItemsTableContainer');
  var ChestPanel = document.getElementById('itemIndicator');
  var IsExpanded = false;
  function expandChest()
  {
    if(!IsExpanded)
    {
      smallIndicator.style.display = 'none';
      BigIndicator.style.display = 'flex';
      ChestPanel.style.height = '80%';
      IsExpanded = true;
    }else
    {
      smallIndicator.style.display = 'flex';
      BigIndicator.style.display = 'none';
      ChestPanel.style.height = '45px';
      IsExpanded = false;
    }
  }

  function UpdateViewList(standard) {

    if(standard && StandardItemsRequired.length !== 0)
    {
      ItemTableContent.innerHTML = '';
      for (let i = 0; i < StandardItemsRequired.length; i++) {
        ItemTableContent.appendChild(CreateRow(i+1,StandardItemsRequired[i].itemName,StandardItemsRequired[i].number))
      }
    }else if (!standard && AdvancedItemsRequired.length !== 0)
    {
      ItemTableContent.innerHTML = '';
      for (let i = 0; i < AdvancedItemsRequired.length; i++) {
        ItemTableContent.appendChild(CreateRow(i+1,AdvancedItemsRequired[i].itemName,AdvancedItemsRequired[i].number))
      }
    }
    console.log(standard, "hedere")
  }

 

  function CreateRow(id ,nom , number)
  {
    
    let name = document.createElement('div');
    name.setAttribute("id", "itemName");
    name.innerHTML = nom;
    let icon = document.createElement('i');
    icon.setAttribute("id", "ItemIcon");
    icon.className = 'icon-minecraft ' + getIconClassName(nom);
    let key = document.createElement('span');
    key.setAttribute("id", "ItemId");
    key.innerHTML = id;
    let nums = document.createElement('div');
    nums.className = 'NumberRow';
    nums.innerHTML = number;

    let itemR = document.createElement('div');
    itemR.className = 'itemsRow';
    itemR.appendChild(key);
    itemR.appendChild(icon);
    itemR.appendChild(name);

    let row = document.createElement('div');
    row.setAttribute("id", "ItemsShower");

    row.appendChild(itemR);
    row.appendChild(nums);

    return row;
  }
   

//#endregion

app.controller('headCtrl', function($scope) {
	var win = remote.getCurrentWindow();

	$scope.close = function() {
		win.close();
        
	};
	$scope.maximize = function() {
		win.isMaximized() ? win.unmaximize() : win.maximize();
	};
	$scope.minimize = function() {
		win.minimize();
	}
});



//#region events

    var isMaximized = false;
    var selectedOldRect = {};
    var Coortext = document.getElementById("coor");
    var itemName = document.getElementById("itemName");
    var ItemIcon = document.getElementById('ItemIcon');
  
    canvas.onclick = function (e) {
      
      if(selectedOldRect)
      {
        ctx.clearRect(selectedOldRect.x,selectedOldRect.y,selectedOldRect.w-strokeWidth,selectedOldRect.h-strokeWidth)
        ctx.fillStyle = useMineCraftColor ? useAdvancedColors? selectedOldRect.c3 : selectedOldRect.c2 : selectedOldRect.c1;
        ctx.fillRect(selectedOldRect.x,selectedOldRect.y,selectedOldRect.w-strokeWidth,selectedOldRect.h-strokeWidth);
        
      }
      var {x,y} = getMousePos(this,e);
      
      
      x = Math.floor(x/RectSizeCoef) * RectSizeCoef;
      y = Math.floor(y / RectSizeCoef)* RectSizeCoef;
      
      
      ctx.fillStyle = 'rgba(0,255,0,01)'; 
      ctx.fillRect(x,y,RectSizeCoef-strokeWidth,RectSizeCoef-strokeWidth);
        
      selectedOldRect = GetDrawR(globalData.rects ,x,y );

      if(globalData.useCoor == 'true')
      {
        var X_coor = globalData.coordinations.x1 - x/RectSizeCoef; 
        var Y_coor = globalData.coordinations.y1 - y/RectSizeCoef; 
        Coortext.innerHTML = `X : ${X_coor} , Y : ${Y_coor}`;
      }else
      {
        Coortext.innerHTML = `X : ${x/RectSizeCoef} , Y : ${y/RectSizeCoef}`;
      }
      if(useMineCraftColor)
      {
        if(useAdvancedColors)
        {
          itemName.innerHTML = detectItemsName(selectedOldRect.c3);
        }
        else
        {
          itemName.innerHTML = detectItemsName(selectedOldRect.c2);
        }
        
        ChestPanel.style.transform="scale(1)"; 
        ItemIcon.classList.remove(ItemIcon.classList[1]);
        ItemIcon.classList.add(getIconClassName(itemName.textContent));
      }

      

      
    }
    var oldRect = {};
    var lastX = 0, lasty= 0;
    canvas.onmousemove = function(e) {
        this.style.cursor = 'crosshair';
        if(oldRect && createHashFromShallow(oldRect) !== createHashFromShallow(selectedOldRect))
        {
          ctx.clearRect(oldRect.x,oldRect.y,oldRect.w-strokeWidth,oldRect.h-strokeWidth)
          ctx.fillStyle = useMineCraftColor ? useAdvancedColors? oldRect.c3 : oldRect.c2 : oldRect.c1;
          ctx.fillRect(oldRect.x,oldRect.y,oldRect.w-strokeWidth,oldRect.h-strokeWidth);
          
        }
        var {x,y} = getMousePos(this,e);
        x = Math.floor(x/RectSizeCoef) * RectSizeCoef ;
        y = Math.floor(y / RectSizeCoef)* RectSizeCoef;
        
        lastX = x;
        lasty = y;
        if(createHashFromShallow(GetDrawR(globalData.rects ,x,y )) !== createHashFromShallow(selectedOldRect))
        {
          ctx.fillStyle = 'rgba(255,0,0,0.3)'; 
          ctx.fillRect(x,y,RectSizeCoef-strokeWidth,RectSizeCoef-strokeWidth);
          
        }
        oldRect = GetDrawR(globalData.rects ,x,y );
      }

      var zoomFactor = 1.5;
      

      zooming = (action) => {
              const mousex = lastX;
              const mousey = lasty;
        var visibleWidth = (RectSizeCoef * globalData.XD) / scale;
        
        var visibleHeight = (RectSizeCoef * globalData.YD) / scale;
        
        if(action == 'minus' && visibleWidth == (RectSizeCoef * globalData.XD))
        {
          return;
        }else if (action == 'plus' && visibleWidth ==(RectSizeCoef * globalData.XD) / Math.pow(1.5,3))
        {
          return;
        }
        else
        {
          //ctx.translate(-originx, -originy);
          if(action == 'plus')
          {
            zoomFactor = 1.5;
          }
          else
          {
            zoomFactor = 1 / 1.5;
            
          }
          scale *= zoomFactor;
          //ctx.translate(originx, originy);
         // originx -= mousex/(scale*zoomFactor) - mousex/scale;
          //originy -= mousey/(scale*zoomFactor) - mousey/scale;
          ctx.scale(zoomFactor, zoomFactor);
          console.log('ize ' , (RectSizeCoef * globalData.YD) / scale) 
          draw();
        }
        
      }


      document.onkeydown = function (e){
        if (e.ctrlKey && e.keyCode == '109')
        {
          zooming('minus')
        } else if (e.ctrlKey && e.keyCode == '107')
        {
          zooming('plus')
        }
      }


//#endregion