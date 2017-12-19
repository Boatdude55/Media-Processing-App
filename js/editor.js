paper.install(window);
	// Keep global references to both tools, so the HTML
	// links below can access them.
	var tool1, tool2;

	window.onload = function( ) {
	    paper.setup('selected-frame');
	    
	    var add = function ( src ) {
	        var raster = new Raster(src);
	        raster.scale(0.5);
            raster.rotate(10);
	    } ;
	    
		var Editor = {
		    insert: add
		};
		return Editor;
		
	};