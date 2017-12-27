/*paper.install(window);

window.onload = function () {
var CanvasTools = {};
    var canvas = document.getElementById('selected-frame');       
    paper.setup(canvas);
    
    CanvasTools.addElem = function ( src ) {
        
        var raster = new Raster({
            source: src,
            position: view.center
        });
        
        raster.scale(0.2);
        raster.rotate(90);
    };
    
    var select = document.getElementById("selection");
    select.addEventListener('click', function () {
        
        var slide = document.getElementsByClassName("active").item(0);
        var src = slide.childNodes.item(0);
        console.log(slide,src);
        CanvasTools.addElem(src);
        
    });
};*/
paper.install(window);

window.onload = function () {
    
    var CanvasTools = {};
    var tool = new Tool();
    
	tool.onMouseDrag = function ( event ) {
	    
	   if( event.item !== null ){
	       
		event.item.position = event.point;
	
	   }
	};

    tool.onMouseDown = function ( event ) {

        if( event.item !== null ){
        
            event.item.selected = true;
        }
    };
    
    tool.onMouseUp = function ( event ) {
        
        if( event.item === null ){
            
            event.item.selected = false;
        }
    };

    var canvas = document.getElementById('selected-frame');       
    paper.setup(canvas);
    
    CanvasTools.addElem = function ( src ) {
        
        var raster = new Raster(src);
        raster.position = view.center;
    };
    
    var select = document.getElementById("selection");
    
    select.addEventListener('click', function () {
        
        var slide = document.getElementsByClassName("active").item(0);
        var src = slide.childNodes.item(0);
        CanvasTools.addElem(src);
        
    });
    
};