//#region dragging files 
window.onload=function(){
    //AssignEvents();
}

function containsFiles(event) {

    if (event.dataTransfer.types) {
        for (var i = 0; i < event.dataTransfer.types.length; i++) {
            if (event.dataTransfer.types[i] == "Files") {
                return true;
            }
        }
    }
    
    return false;

}

function AssignEvents() {
    
    var holder = document.getElementById("filePicker");
    holder.addEventListener('drop', (event ) => {
        event.preventDefault();
        event.stopPropagation();
        if(event.dataTransfer.files.length>1) return;
    
        console.log(event.dataTransfer.files[0].path);
        
        
        // for (const f of event.dataTransfer.files) {
        // 	// Using the path attribute to get absolute file path
        // 	console.log('File Path of dragged files: ', f.path)
        // }
    });
    
    holder.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    
    holder.addEventListener('dragenter', (event) => {
        console.log('File is in the Drop Space');
        
        var element = document.getElementById("filePicker");
        if(!element.classList.contains("fileDragEnter"))
        {
            element.classList.add("fileDragEnter");
        }
            
    });
    //document.getElementById("filePicker")
    holder.addEventListener('dragleave', (event) => {
        console.log('File has left the Drop Space');
        var element = document.getElementById("filePicker");
        if(element.classList.contains("fileDragEnter"))
        {
            element.classList.remove('fileDragEnter')
        }
        
    });
}
//#endregion