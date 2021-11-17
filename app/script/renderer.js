
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

var C_Width  = window.innerWidth;
var C_Height = window.innerHeight ;

function init()
{
    C_Width = (RectSizeCoef * globalData.XD);
    C_Height = (RectSizeCoef * globalData.YD);
    canvas.width  = C_Width;
    canvas.height = C_Height;
    canvas.style.height='90%';
}

/*********************-------------------------- */


let cameraOffset = { x:0, y: 0 }
let cameraZoom = 1
let MAX_ZOOM = 5
let MIN_ZOOM = 0.1
let SCROLL_SENSITIVITY = 0.0005
let isDragging = false
let dragStart = { x: 0, y: 0 }
let initialPinchDistance = null
let lastZoom = cameraZoom
var X_beforeZooming = 0,Y_beforeZooming = 0;
var X_afterZooming = 0,Y_afterZooming = 0;

var isMaximized = false;
var selectedOldRect = {},oldRect = {};
var Coortext = document.getElementById("coor");
var itemName = document.getElementById("itemName");
var ItemIcon = document.getElementById('ItemIcon');
const hoveredRectOffset = 8;
function draw (){
  canvas.width = C_Width
    canvas.height = C_Height
    
    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    ctx.translate( 0,0 )
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate(  cameraOffset.x,cameraOffset.y )
    ctx.clearRect(0,0, C_Width, C_Height)

  ctx.fillStyle = 'black';
  ctx.clearRect(0,0,canvas.width, canvas.height)
  //ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillRect(originx, originy, C_Width, C_Height);
  for (const rect of globalData.rects) {
    if(selectedOldRect && rect.x === selectedOldRect.x && rect.y === selectedOldRect.y)
    {
      selectedOldRect = rect;
      continue;
    }
    else if(oldRect && rect.x === oldRect.x && rect.y === oldRect.y)
    {
      oldRect = rect;
      continue;
    }else
    {
      ctx.fillStyle = useMineCraftColor ? useAdvancedColors? rect.c3 : rect.c2 : rect.c1;
      ctx.fillRect(rect.x,rect.y,rect.w-strokeWidth,rect.h-strokeWidth);
    }
    
     
  }
  if(selectedOldRect)
  {
    ctx.strokeStyle = 'rgba(0,255,0,01)';
      ctx.lineWidth = 1;
      ctx.fillStyle = useMineCraftColor ? useAdvancedColors? selectedOldRect.c3 : selectedOldRect.c2 : selectedOldRect.c1;
      ctx.fillRect(selectedOldRect.x-hoveredRectOffset/2,selectedOldRect.y-hoveredRectOffset/2,selectedOldRect.w-strokeWidth+hoveredRectOffset,selectedOldRect.h-strokeWidth+hoveredRectOffset);
      ctx.strokeRect(selectedOldRect.x-hoveredRectOffset/2,selectedOldRect.y-hoveredRectOffset/2,selectedOldRect.w+hoveredRectOffset,selectedOldRect.h+hoveredRectOffset)
  }
  if(oldRect)
  {
    ctx.strokeStyle = 'rgba(255,0,0,01)';
    ctx.lineWidth = 1;
      ctx.fillStyle = useMineCraftColor ? useAdvancedColors? oldRect.c3 : oldRect.c2 : oldRect.c1;
      ctx.fillRect(oldRect.x-hoveredRectOffset/2,oldRect.y-hoveredRectOffset/2,oldRect.w-strokeWidth+hoveredRectOffset,oldRect.h-strokeWidth+hoveredRectOffset);
      ctx.strokeRect(oldRect.x-hoveredRectOffset/2,oldRect.y-hoveredRectOffset/2,oldRect.w+hoveredRectOffset,oldRect.h+hoveredRectOffset)
  }

    
    requestAnimationFrame(draw)
    
}



function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1)
    {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY)
    {
        return { x: e.clientX, y: e.clientY }        
    }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  scaleX = ((RectSizeCoef * globalData.XD) / cameraZoom /*scale*/) / rect.width,    // relationship bitmap vs. element for X
  scaleY = ((RectSizeCoef * globalData.YD) / cameraZoom /*scale*/) / rect.height;  // relationship bitmap vs. element for Y
  return {
    x: (evt.clientX - rect.left) * scaleX  ,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  };
}

function GetPositionWithTran(canvas , e)
{
  const transform = ctx.getTransform();
  const invertedScaleX = 1 / transform.a;
  const invertedScaleY = 1 / transform.d;
  var rect = canvas.getBoundingClientRect();
  let x = (((C_Width * e.offsetX* cameraZoom)/rect.width) - cameraOffset.x)  ;
  let y = (((C_Height * e.offsetY*cameraZoom)/rect.height) - cameraOffset.y);
  return {x,y};
}

function getTransformedPoint(x, y) {
  const transform = ctx.getTransform();
  var rect = canvas.getBoundingClientRect();
  const invertedScaleX = 1 / transform.a;
  const invertedScaleY = 1 / transform.d;

  const transformedX = invertedScaleX * x - invertedScaleX * transform.e;
  const transformedY = invertedScaleY * y - invertedScaleY * transform.f;
  
  //return { x: transformedX, y: transformedY ,invertedScaleX : invertedScaleX , so : ((C_Width * x * invertedScaleX)/rect.width) - cameraOffset.x };
  return { x: ((C_Width * x * invertedScaleX)/rect.width) - cameraOffset.x ,
  y: ((C_Height * y * invertedScaleY)/rect.height) - cameraOffset.y };
}

function onPointerDown(e)
{
  if(e.button === 0)
  {
    var {x,y} = getTransformedPoint(e.offsetX, e.offsetY); // GetPositionWithTran(this,e);
    
    x = Math.floor(x/RectSizeCoef) * RectSizeCoef;
    y = Math.floor(y / RectSizeCoef)* RectSizeCoef;
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
  else if(e.button === 2)
  {
    isDragging = true
    dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
    dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y

    
    canvas.style.cursor = 'grabbing';
  }
    

}

//dev only 
const reset = () => {
  cameraZoom = 1;
  cameraOffset = { x : 0 , y : 0};
}

function onPointerUp(e)
{
    canvas.style.cursor = 'default';
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}
function CheckMapBoundary()
{
  if(cameraZoom < 1)
        {
          if(canvas.width*cameraZoom + cameraOffset.x * cameraZoom > canvas.width)
          {
            cameraOffset.x = canvas.width/cameraZoom - canvas.width;
          }
          if (canvas.height*cameraZoom + cameraOffset.y * cameraZoom > canvas.height)
          {
            cameraOffset.y = canvas.height/cameraZoom - canvas.height;
          }
          if (cameraOffset.x < 0)
          {
            cameraOffset.x =0
          }
          if (cameraOffset.y < 0)
          {
            cameraOffset.y =0
          }
        }
        else{
          if(canvas.width*cameraZoom + cameraOffset.x * cameraZoom < canvas.width)
          {
            cameraOffset.x = canvas.width/cameraZoom - canvas.width;
          }
          if (canvas.height*cameraZoom + cameraOffset.y * cameraZoom < canvas.height)
          {
            cameraOffset.y = canvas.height/cameraZoom - canvas.height;
          }
          if (cameraOffset.x > 0)
          {
            cameraOffset.x =0
          }
          if (cameraOffset.y > 0)
          {
            cameraOffset.y =0
          }
          
        }
}

function onPointerMove(e)
{
  
    if (isDragging)
    {
      //var {x,y}  = getTransformedPoint(e.offsetX , e.offsetY)
        cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x
        cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y
        CheckMapBoundary();
    }else
    {
      canvas.style.cursor = 'crosshair';
        
        var {x,y} = getTransformedPoint(e.offsetX, e.offsetY);//GetPositionWithTran(canvas,e);
        
        x = Math.floor(x/RectSizeCoef) * RectSizeCoef ;
        y = Math.floor(y / RectSizeCoef)* RectSizeCoef;
        

        //if(createHashFromShallow(GetDrawR(globalData.rects ,x,y )) !== createHashFromShallow(selectedOldRect))
        oldRect = GetDrawR(globalData.rects ,x,y );
        
    }
}


//for mobile only

function handleTouch(e, singleTouchHandler)
{
    if ( e.touches.length == 1 )
    {
        singleTouchHandler(e)
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
        isDragging = false
        handlePinch(e)
    }
}

function handlePinch(e)
{
    e.preventDefault()
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
    
    if (initialPinchDistance == null)
    {
        initialPinchDistance = currentDistance
    }
    else
    {
        adjustZoom( null, currentDistance/initialPinchDistance )
    }
}

function adjustZoom(e,zoomAmount, zoomFactor)
{
    if (!isDragging)
    {
        X_beforeZooming = GetPositionWithTran(canvas , e).x;
        Y_beforeZooming = GetPositionWithTran(canvas , e).y;
        
        
        if (zoomAmount)
        {
            cameraZoom += zoomAmount
        }
        else if (zoomFactor)
        {
            //console.log(zoomFactor)
            cameraZoom = zoomFactor*lastZoom
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
        
        X_afterZooming = GetPositionWithTran(canvas , e).x;
        Y_afterZooming = GetPositionWithTran(canvas , e).y;
        cameraOffset.x += (X_beforeZooming - X_afterZooming);
        cameraOffset.y += (Y_beforeZooming - Y_afterZooming);

        CheckMapBoundary();
        //console.log(X_beforeZooming - X_afterZooming , Y_beforeZooming - Y_afterZooming)
    }
}

canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener( 'wheel', (e) => adjustZoom(e,e.deltaY*SCROLL_SENSITIVITY))










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
  $scope.version = require('electron').remote.app.getVersion();
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

    // var isMaximized = false;
    // var selectedOldRect = {};
    // var Coortext = document.getElementById("coor");
    // var itemName = document.getElementById("itemName");
    // var ItemIcon = document.getElementById('ItemIcon');
  
    // canvas.onclick = function (e) {
      
    //   if(selectedOldRect)
    //   {
    //     ctx.clearRect(selectedOldRect.x,selectedOldRect.y,selectedOldRect.w-strokeWidth,selectedOldRect.h-strokeWidth)
    //     ctx.fillStyle = useMineCraftColor ? useAdvancedColors? selectedOldRect.c3 : selectedOldRect.c2 : selectedOldRect.c1;
    //     ctx.fillRect(selectedOldRect.x,selectedOldRect.y,selectedOldRect.w-strokeWidth,selectedOldRect.h-strokeWidth);
        
    //   }
    //   var {x,y} = getMousePos(this,e);
      
      
    //   x = Math.floor(x/RectSizeCoef) * RectSizeCoef;
    //   y = Math.floor(y / RectSizeCoef)* RectSizeCoef;
      
      
    //   ctx.fillStyle = 'rgba(0,255,0,01)'; 
    //   ctx.fillRect(x,y,RectSizeCoef-strokeWidth,RectSizeCoef-strokeWidth);
        
    //   selectedOldRect = GetDrawR(globalData.rects ,x,y );

    //   if(globalData.useCoor == 'true')
    //   {
    //     var X_coor = globalData.coordinations.x1 - x/RectSizeCoef; 
    //     var Y_coor = globalData.coordinations.y1 - y/RectSizeCoef; 
    //     Coortext.innerHTML = `X : ${X_coor} , Y : ${Y_coor}`;
    //   }else
    //   {
    //     Coortext.innerHTML = `X : ${x/RectSizeCoef} , Y : ${y/RectSizeCoef}`;
    //   }
    //   if(useMineCraftColor)
    //   {
    //     if(useAdvancedColors)
    //     {
    //       itemName.innerHTML = detectItemsName(selectedOldRect.c3);
    //     }
    //     else
    //     {
    //       itemName.innerHTML = detectItemsName(selectedOldRect.c2);
    //     }
        
    //     ChestPanel.style.transform="scale(1)"; 
    //     ItemIcon.classList.remove(ItemIcon.classList[1]);
    //     ItemIcon.classList.add(getIconClassName(itemName.textContent));
    //   }
    // }

    // var canDrag = false;
    // canvas.onmousedown = (e) => {
    //   if(e.button !== 2) return;
    //   canDrag = true;
    //   console.log(getMousePos(e.target,e))
    // }
     

    // var oldRect = {};
    // var lastX = 0, lasty= 0;
    // canvas.onmousemove = function(e) {
    //     if(!canDrag)
    //     {
    //       this.style.cursor = 'crosshair';
    //     }
    //     else{
    //       this.style.cursor = 'grabbing';
    //     } 
    //     if(oldRect && createHashFromShallow(oldRect) !== createHashFromShallow(selectedOldRect))
    //     {
    //       ctx.clearRect(oldRect.x,oldRect.y,oldRect.w-strokeWidth,oldRect.h-strokeWidth)
    //       ctx.fillStyle = useMineCraftColor ? useAdvancedColors? oldRect.c3 : oldRect.c2 : oldRect.c1;
    //       ctx.fillRect(oldRect.x,oldRect.y,oldRect.w-strokeWidth,oldRect.h-strokeWidth);
          
    //     }
    //     var {x,y} = getMousePos(this,e);
    //     x = Math.floor(x/RectSizeCoef) * RectSizeCoef ;
    //     y = Math.floor(y / RectSizeCoef)* RectSizeCoef;
        
    //     lastX = x;
    //     lasty = y;
    //     if(createHashFromShallow(GetDrawR(globalData.rects ,x,y )) !== createHashFromShallow(selectedOldRect))
    //     {
    //       ctx.fillStyle = 'rgba(255,0,0,0.3)'; 
    //       ctx.fillRect(x,y,RectSizeCoef-strokeWidth,RectSizeCoef-strokeWidth);
          
    //     }
    //     oldRect = GetDrawR(globalData.rects ,x,y );
    //   }

    //   var zoomFactor = 1.5;
      

    //   zooming = (action) => {
    //           const mousex = lastX;
    //           const mousey = lasty;
    //     var visibleWidth = (RectSizeCoef * globalData.XD) / scale;
        
    //     var visibleHeight = (RectSizeCoef * globalData.YD) / scale;
        
    //     if(action == 'minus' && visibleWidth == (RectSizeCoef * globalData.XD))
    //     {
    //       return;
    //     }else if (action == 'plus' && visibleWidth ==(RectSizeCoef * globalData.XD) / Math.pow(1.5,3))
    //     {
    //       return;
    //     }
    //     else
    //     {
    //       ctx.translate(-originx, -originy);
    //       if(action == 'plus')
    //       {
    //         zoomFactor = 1.5;
    //       }
    //       else
    //       {
    //         zoomFactor = 1 / 1.5;
            
    //       }
    //       scale *= zoomFactor;
    //       ctx.translate(originx, originy);
    //      originx -= mousex/(scale*zoomFactor) - mousex/scale;
    //       originy -= mousey/(scale*zoomFactor) - mousey/scale;
    //       ctx.scale(zoomFactor, zoomFactor);
    //       console.log('ize ' , (RectSizeCoef * globalData.YD) / scale) 
    //       draw();
    //     }
        
    //   }


    //   document.onkeydown = function (e){
    //     if (e.ctrlKey && e.keyCode == '109')
    //     {
    //       zooming('minus')
    //     } else if (e.ctrlKey && e.keyCode == '107')
    //     {
    //       zooming('plus')
    //     }
    //   }


//#endregion