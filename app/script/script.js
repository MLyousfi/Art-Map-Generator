var app = angular.module('app', ['ngRoute']);

const {remote , ipcRenderer } = require('electron');
const { data } = require('jquery');
const { constants } = require('original-fs');

app.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl : `${__dirname}/components/home.html`,
        controller  : 'homeCtrl'
    }).when('/edit', {
        templateUrl : `${__dirname}/components/edit.html`,
        controller  : 'editCtrl'
    }).otherwise({
        templateUrl : '404 err'
    });
});
app.service('image', function (){
    var imagePath = '';
    this.setImagePath = function (path) {
        imagePath = path;
    }
    this.getImagePath = function (){
        return imagePath;
    }
    this.getImageName = function () {
        return imagePath.replace(/^.*[\\\/]/, '')
    }
})

app.constant('Constants', {
    Sizes: {
        1: '128 X 128',
        2: '256 X 256',
        3: '384 X 384',
        4: '512 X 256'
    }
});

app.directive('dragged', function () {
    return {
        restrict : "A",
        link: function (scope, elem) {
            elem.bind('dragover', function (e) {
                if(e != null)
                {
                    e.stopPropagation();
                    e.preventDefault();
                }
                
            }); 
            elem.bind('dragenter', function (e) {
                if(e != null)
                {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    
                }
                elem.attr('class','fileDragEnter');
                scope.msgDrop = "";
                scope.$apply();
                
            }); 
            elem.bind('dragleave', function (e) {
                if(e != null)
                {
                    
                    e.preventDefault();
                    
                }
                elem.attr('class','');
                scope.msgDrop = "";
                scope.$apply();
                
            }); 

            elem.bind('drop', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var files = evt.dataTransfer.files;
                if(files.length == 1)
                {
                    if(files[0].type == 'image/png' || files[0].type == 'image/jpeg' || files[0].type == 'image/jpg')
                    {
                        scope.msgDrop = "";
                        scope.$apply();
                        elem.attr('class','fileDragEnter');
                        scope.GetFileFromDrop(files[0].path);
                    }else{
                        elem.attr('class','fileDragEnterDanger');
                        scope.msgDrop = "The file dragged must be a image format";
                        scope.$apply();
                    }
                }else
                {
                    elem.attr('class','fileDragEnterDanger');
                    scope.msgDrop = "The file dragged must be a image format";
                    scope.$apply();
                }
                      
                

               
            });

           
        }
    }
});

app.controller('homeCtrl', function ($scope, $location, image){

    
    $scope.GetFileFromDrop = function (path) {
        image.setImagePath(path);
        $location.path('/edit');
        $scope.$apply();
    }
    $scope.msgDrop = '';
    $scope.pickFile= function() {
        var {dialog} = remote;
        dialog.showOpenDialog({
            properties : ['openFile'],
            filters : [{
                name : 'Images',
                extensions : ['jpg', 'png' , 'jpeg']
            }]
        }).then(result => {
            if(result.canceled) return;
            if(!!result.filePaths)
            {
                var path = result.filePaths[0];
                
                image.setImagePath(path);
                $location.path('/edit');
                $scope.$apply();
            }
          }).catch(err => {
            console.log(err)
          })
    };
});

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

function check(string) {
    if( string.length < 20) return string;
    
    return string.substring(0, 20)+'...';
    
  }
  



app.controller('editCtrl', function($scope,$rootScope,$location,$log,image ,Constants ) {
	$scope.imagePath = image.getImagePath();
    $scope.imageName = check(image.getImageName());
    $scope.actionName = 'Generate';
    $scope.showProgress = false;
    
    $scope.useCoor = 'false';
    $scope.disable = false;
    $scope.selectedSize = Constants.Sizes['1'];
    
    $scope.handleGenerate = function () {
        if($scope.useCoor == 'true' && !checkCoor()) 
        {
            sendAlert("error","coordinations incorrect!")
            return;
        }
        toggleProcessView($scope);
        var {XD,YD} = chinkeSizeGenerator($scope.selectedSize);
        

        var dataObject = {
            XD : XD,
            YD : YD,
            useCoor : $scope.useCoor,
            coordinations :  $scope.coordinations,
            image : image.getImagePath()
        }

        processing_step_one(dataObject,$scope);
        
    }
    $scope.appliedClass = function(v){
        if(v=='true')
        {
            return 'big';
        }else
        {
            return 'small';
        }

    }
    $scope.coordinations = {
        x1: '',
        x2: '',
        y1: '',
        y2: '',
      };
    function chinkeSizeGenerator(v)
    {
        switch (v) {
            case Constants.Sizes['1']:
                return {XD : 128,
                YD : 128}
                break;
            case Constants.Sizes['2']:
                return {XD : 256,
                    YD : 256}
                break;
            case Constants.Sizes['3']:
                return {XD : 384,
                    YD : 384}
                break;
            case Constants.Sizes['4']:
                return {XD : 512,
                    YD : 256}
                break;
            default:
                break;
        }
    }
    function getImageSize(imgSrc) {
        var imgLoader = new Image(); // create a new image object
   
       imgLoader.onload = function() { // assign onload handler
           $scope.imagesHeight = imgLoader.height;
           $scope.imagesWidth = imgLoader.width;
           
       }
   
       imgLoader.src = imgSrc; // set the image source
    }

    function BindingInfo(){
        getImageSize(image.getImagePath());
        $scope.imageName = check(image.getImageName());
        //$scope.$apply();
    }
    BindingInfo();

    $scope.deleteFile = function()
    {
        image.setImagePath('');
        $location.path('/');
        //$scope.$apply();
        //AssignEvents();
        //$scope.$apply();
    }

    
    $scope.changeFile = function()
    {


        var {dialog} = remote;
        dialog.showOpenDialog({
            properties : ['openFile'],
            filters : [{
                name : 'Images',
                extensions : ['jpg', 'png' , 'jpeg']
            }]
        }).then(result => {
            if(!!result.filePaths)
            {
                var path = result.filePaths[0];
                
                image.setImagePath(path);
                $scope.imagePath = path;
                BindingInfo();
                $scope.$apply();
            }
          }).catch(err => {
            console.log(err)
          })
          
          
    }
    $scope.setSelectedSize = function (v) 
    {
        $scope.selectedSize = Constants.Sizes[v];
    }

    $scope.changeChecker  = function ()
    {
       
        
    } 

    function checkCoor () {
        if($scope.coordinations.x1 != '' && $scope.coordinations.x2 != '' && $scope.coordinations.y1 != '' && $scope.coordinations.y2 != '')
        {
            if(Math.abs($scope.coordinations.x1 - $scope.coordinations.x2) == chinkeSizeGenerator($scope.selectedSize).XD - 1
            && Math.abs($scope.coordinations.y1 - $scope.coordinations.y2) == chinkeSizeGenerator($scope.selectedSize).YD - 1)
            {
                return true;
            }else
            {
                return false;
            }
        }

        return false;
    }
 
});



var imageProcessing = function(rects, data ,img, dominationByIteration = true)
{
    const RectSizeCoef = 10;
 return new Promise(function(resolve, reject)
 {
     try {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext("2d");
        canvas.width  = (RectSizeCoef * data.XD);//canvas.offsetWidth;
        canvas.height = (RectSizeCoef * data.YD) ;//canvas.offsetHeight;
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        var progressbar = document.getElementById("progressBar"); 
        var progressIndicator = document.getElementById('progressBarIndicator');
        var iteration = 0;
        var max = data.XD * data.YD;
        for (let i = 0; i < data.XD; i++) {
            for (let j = 0; j < data.YD; j++) {    
                if(iteration == (data.XD * data.YD)-1)
                    {
                        resolve(rects);
                    }
                    iteration++;
                    progressIndicator.innerHTML = Math.floor(iteration*100 /max) + '%';
                    progressbar.style.width = Math.floor(iteration*100 /max)+"%";
                    var imgData = ctx.getImageData(canvas.width/data.XD*i,canvas.height/ data.YD*j,canvas.width/data.XD,canvas.height/ data.YD);
                    var colorsOfSection = new Array();
                    const counts = {};
                    for (let p = 0; p < imgData.data.length; p=p+4) {
                    colorsOfSection.push(`rgba(${imgData.data[p]},${imgData.data[p+1]},${imgData.data[p+2]},${imgData.data[p+3]})`)
                        if(dominationByIteration)
                        {
                            let rgba = `rgba(${imgData.data[p]},${imgData.data[p+1]},${imgData.data[p+2]},${imgData.data[p+3]})`;
                            counts[rgba] = counts[rgba] ? counts[rgba] + 1 : 1;
                            
                        }
                    }
                    let rgba = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                    let rect = {x:i*RectSizeCoef,y:j*RectSizeCoef,w:RectSizeCoef,h:RectSizeCoef,c1: rgba , c2: GetClosest(rgba) }
                    rects.push(rect);
            } 
        }
        
         
     } catch (error) {
         reject(error)
     }
    

 });
}

function toggleProcessView($scope)
{
    $scope.disable = !$scope.disable;
    $scope.showProgress = !$scope.showProgress;
    if($scope.actionName == 'Generate')
    {
        $scope.actionName = 'Processing...';
    }else
    {
        $scope.actionName = 'Generate';
    }
    
    
    $scope.$apply;
}
function SendingData(data){
    ipcRenderer.send('render-data:add', data);
}

function processing_step_one(data , $scope)
{
    
    let img = new Image();
    var imageSource = data.image;
    
    img.onload = () => {
        var rects = [];

        imageProcessing(rects,data,img).then((result)=> {
            toggleProcessView($scope);
            data.rects = result;
            SendingData(data);
            console.log(ItemsRequired)
        }).catch((err) => {
            toggleProcessView($scope);
            console.log(err);
        })
        
        
    }
    img.src = imageSource;
    
}

/***update */
const notification = document.getElementById('notification');
const messageUpdate = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const progress = document.getElementById('progressingContainer');
ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  messageUpdate.innerText = 'A new update is available. Downloading now...';
  notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  messageUpdate.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  restartButton.classList.remove('hidden');
  notification.classList.remove('hidden');
});
ipcRenderer.on('download_percent' , (e,message) => {
    let percentage = 100 - parseInt(message);
    console.log("percent  : ",parseInt(message) ,message ,percentage);
    progress.style.right  = percentage + '%';
})

function closeNotification() {
    notification.classList.add('hidden');
  }
function restartApp() {
    ipcRenderer.send('restart_app');
  }





