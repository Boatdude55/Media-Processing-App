"use strict";

$(function () {
  
  /**
   * Object for handling relevant MyDOM elements
   * */
  var UIElements = {}; 
  UIElements ={
          submit : $("#upload"),
          files : $("#file"),
          carousel : $("#workspaceContainer"),
          carouselLeft: $(".carousel-control-prev"),
          carouselRight:$(".carousel-control-next"),
          editor : $("#frame-container"),
          submitTime: $("#submit-times")
  };
  
  var frameObj = function () {
    var data;
    var name;
    var info = {
      active: false,
      prev: false,
      next: false
    };
  }
  var frameList = frameList || {};
  
  ////////////////////////////////////////////////////////////////////////////////
  /**
   * Object for handling MyDOM related functionality
   * */
  var MyDOM = MyDOM || {};

  /**
   * function for creating elements
   * @param type; the type of html element to create
   * @param properties; associative array of keys=attribute name, and values=attribute value
   * */
  MyDOM.CreateElement = function ( type, properties ) { 
  
    try{
  
     var tmp = document.createElement( type );
  
    }catch(err){
  
      alert(err.name, err.message);
  
    }
    for ( let i in properties ) {
  
      if ( properties.hasOwnProperty(i) ) {
  
        tmp.setAttribute(i, properties[i]);
  
      }
  
    } 
     return tmp; 
  };
  
  MyDOM.ElemStyle = {
    
    video: function ( result , mime ) {
      return {
        "class": 'media',
        src: result,
        type: mime,
        controls: true
      };
    },
    img: function ( result , mime ) {
      return {
        "class": 'media',
        src: result,
      };
    },
    slide: function () {
      return {
        "class": 'carousel-item',
      };
    },
    workspace: function ( name ) {
      name += '';
      return {
        "class": "carousel-inner",
        id: name
      };
    }
  };
  
  MyDOM.ClickEvents = {

    upload: function () {
      
      try{
        let uploadFiles = UIElements.files[0].files;
        MyFile.read( uploadFiles );
      }catch(err){
        console.log(err.name, err.message);
      }
    },
    getFrames: function () {
      let StartTime = document.getElementById("start-time");
      let EndTime = document.getElementById("end-time");
      let SetTimes = [StartTime, EndTime];
      let times = [0,0];
      const fps = 1/4;
      let frameCache = [];
      
      let video = $('video').hasClass("active"); 
      let dest = MyDOM.CreateElement( 'div' , MyDOM.ElemStyle["workspace"] );
      
      video.addEventListener('loadeddata', function () {
        /**
         * event makes sure video is fully loaded
         * sets the playback time to 0
         **/
         this.currentTime = 0;
      }, false);
    
        if(dest.childElementCount > 0){
            /**
             * reloading the video so there are no playback issues
             * might remove later
             * */
            video.load();
        }
        
        /**
         * Might turn this into a function later
         * */
        let j=0;
        for(let i of SetTimes){
            /**
             * Converts the times into a format
             * that video events can use 
             * Take substrings using the colon as base
             * parse substrings to ints
             * multiply string1 by 60 and add on string2 for a time
            **/
            let x = parseInt(i.value.substr(0, i.value.length - 3), 10);
            let y = parseInt(i.value.substr(i.value.length - 2), 10);
            i = (x*60) + y;
            times[j] = i;
            j++;
        }
        
        video.currentTime = times[0];//setting a new currentTime triggers seeking
        
        video.addEventListener('seeked', function () {
          /**when frame is captured, increase with fps trying to get a decent framerate
           * keep in mind this for rotoscoping so the framerate may not have to be that high
           * */
          times[0]+=(fps);
         //if still in seeking range
          if ( times[0] <= times[1] ) {
        
              /**Event is triggered when seeking is done
              * generateThumbnail() will get the currentTime and convert it to canvas element
              * */
              generateThumbnail(this);
              //another seeked event triggered
              video.currentTime = times[0];
          }else if( times[0] > times[1] ) {
            
            Carousel.addElem( frameCache );
            frameCache = [];
  
          }
        }, false);

      function generateThumbnail ( frame ) {
  
        let c = document.createElement("canvas");
        
        let ctx = c.getContext("2d");
        c.width = 220;
        c.height = 190;
        ctx.drawImage(frame, 0, 0, c.width, c.height);
      
        frameCache.push(c);
  
      }
    }
  
  };

  var Carousel = Carousel || {};
  
  Carousel.addElem = function ( elems ) {

     $("#workspace-identifier").on( "hide.bs.modal", function ( e ) {
       
        e.preventDefault();
        console.log($("#workspace-name").val());
        
     })
     
     $("#workspace-identifier").on( "hidden.bs.modal", function ( e ) {
       
       e.preventDefault();
       let cont = MyDOM.CreateElement('div', MyDOM.ElemStyle["workspace"]('myupload'));
       let slide = MyDOM.CreateElement('div', MyDOM.ElemStyle['slide']());
       
       
       $(elems).insertBefore(".carousel-control-prev");
       $(elems).wrapAll(cont).wrap(slide)
       $(elems).first().parent(".carousel-item").addClass("active");
     
     });
    };
    
  Carousel.removeElem = function ( slide ) {
  
     UIElements.carousel.removeChild( slide );
  
    };
    
    
  ////////////////////////////////////////////////////////////////////////////////
  var MyFile = {
  
    read : function ( files ) {
      var cache = [];
      function readAndAdd ( file ) {
      
      let reader = new FileReader();
      let mediaType = file.type;
      
      reader.addEventListener( "loadend", function () {

          if ( this.readyState == 2 ) {
  
              let elemType = mediaType.includes('video') ? 'video' : (mediaType.includes('image') ? 'img' : "Error Project Doesn't support mime type");
            try{
              let tempProp = MyDOM.ElemStyle[elemType]( reader.result, mediaType );
              
              let media = MyDOM.CreateElement( elemType, tempProp );
              cache.push(media);
              console.log(cache.length, files.length);
              if( cache.length === files.length ) {
                
                Carousel.addElem( cache );
                cache = [];
              } 
            }catch(err){
              console.log(err);
            } 
          }
    
      }, false);
  
      try{
  
        reader.readAsDataURL( file );
  
      }catch(err){
  
        alert( "func(read)",err.name, err.message );
  
      }
  
    }
    
      try{
  
        Array().forEach.call( files, readAndAdd );
    
      }catch(err){
    
        console.log(err.name, err.message);
    
      }
    }
  };
  ////////////////////////////////////////////////////////////////////////////////
  
$(UIElements.submit[0]).click( MyDOM.ClickEvents['upload'] );

$(UIElements.submitTime[0]).click( MyDOM.ClickEvents['getFrames']);

});