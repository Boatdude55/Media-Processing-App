"use strict";

$(function () {
  
  /**
   * Object for handling relevant MyDOM elements
   * */

  var UIElements = {
    submit : $("#upload"),
    files : $("#file"),
    carousel : $("#workspaceContainer"),
    homeCarousel: $("#home"),
    carouselLeft: $(".carousel-control-prev"),
    carouselRight:$(".carousel-control-next"),
    editor : $("#selected-frame"),
    rangeModal: {
      dataMin: $("#start-time"),
      dataMax: $("#end-time"),
      data: $("#workspace-name"),
      submit: $("#submit-times")
    },
    nav: $("#directory"),
    selector: $("#selection"),
    editor: $("#selected-frame"),
    canny: $("#canny"),
    compress: $("#compress")
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
    },
    nav: function ( name )  {
      return {
        "class": "btn directory",
        id: name + "Btn",
        value: name
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
      
      let startTime = UIElements.rangeModal.dataMin[0];
      let endTime = UIElements.rangeModal.dataMax[0];
      let workspaceName = UIElements.rangeModal.data[0];
      //let StartTime = document.getElementById("start-time");
      //let EndTime = document.getElementById("end-time");
      let SetTimes = [startTime, endTime];
      let times = [0,0];
      const fps = 1/4;
      let frameCache = [];
      
      let video = $('.carousel-item').filter(".active").children("video")[0];
      
      if ( video !== undefined ) {
        
        video.load();
        video.addEventListener('loadeddata', function () {
          /**
           * event makes sure video is fully loaded
           * sets the playback time to 0
           **/
           this.currentTime = 0;
        }, false);
          
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
                let newFrame = generateThumbnail(this);
                frameCache.push(newFrame);
                //another seeked event triggered
                video.currentTime = times[0];
            }else if( times[0] > times[1] ) {
              
              
              Carousel.createSpace( frameCache, workspaceName.value );
              frameCache = [];
    
            }
          }, false);

      }
      function generateThumbnail ( frame ) {
  
        let c = document.createElement("canvas");
        
        let ctx = c.getContext("2d");
        c.width = 500;
        c.height = 490;
        c.className = 'd-block mx-auto';
        
        ctx.drawImage(frame, 0, 0, c.width, c.height);
        apply.canny( c );
        return c;
        //frameCache.push(c);
  
      }
    },
    setSpace: function ( event ) {
      
      let dirName = event.currentTarget.value;
      let dir = Carousel.Workspaces[dirName];
      let prevSpace = $('.carousel-inner').replaceWith(dir);
      let prevName = prevSpace[0].id;
  
      Carousel.Workspaces[prevName] = prevSpace[0];
    }
  };
  
  var NavBar = {
    add: function ( dirName ) {
      
      let btnStyle = MyDOM.ElemStyle['nav'](dirName);
      let newBtn = MyDOM.CreateElement("button", btnStyle);
      newBtn.innerHTML = dirName;
      UIElements.nav.append(newBtn);
      
    }
    
  };
  
  var Button = {
    Events: {
      select: function () {

          
          /*
          let selection = $(".active").children();
          console.log(selection[0], UIElements.editor[0].parentElement);
          UIElements.editor[0].width = selection[0].width + 100;
          UIElements.editor[0].height = selection[0].height +100;
          let destCtx = UIElements.editor[0].getContext('2d');
          destCtx.drawImage( selection[0], 0, 0);
          $(UIElements.editor[0]).data("state","defined");
          */
      }
    }
  };
  
  var Processes = {
    canny: function () {
      
      let img = UIElements.editor[0].getContext('2d');
      let pxls = img.getImageData();
      
    }
  }
  
  var Carousel = Carousel || {};
  
  Carousel.Workspaces = {
    home: ''
  };
  
  Carousel.createSpace = function ( elems, workspace = "home" ) {
    
      let slide = MyDOM.CreateElement('div', MyDOM.ElemStyle['slide']());
      
      if ( arguments.length === 2 ) {
        
        let name = workspace;
        let frames = $(elems);
        
        let cont = MyDOM.CreateElement('div', MyDOM.ElemStyle["workspace"](name));
       
        //$(elems).insertBefore(".carousel-control-prev");
        frames = $(elems).wrapAll(cont).wrap(slide).parents('.carousel-inner');
        frames.children().first().addClass("active");
        Carousel.Workspaces[name] = frames;
        NavBar.add(name);
        
      }else if( arguments.length === 1 ) {

        $(elems).appendTo(UIElements.homeCarousel[0]);
        $(elems).wrap(slide);
        $(elems).first().parent(".carousel-item").addClass("active");
        
        Carousel.Workspaces['home'] = $(elems);
      }
     
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
              
              if( cache.length === files.length ) {
                
                Carousel.createSpace( cache );
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
  
  $(UIElements.rangeModal.submit[0]).click( MyDOM.ClickEvents['getFrames'] );
  
  $(UIElements.nav[0]).on("click", "button", MyDOM.ClickEvents['setSpace'] );
  
  $(UIElements.selector[0]).click(Button.Events['select']);
  
  $(UIElements.compress[0]).click( function ( event ) {
    
    var toggle = event.currentTarget;

    if( $(toggle).data("state") === "show") {
      
      $("#carousel-container").animate({
        width: '0%',
        height: '0%',
        display: 'hidden'
      });
      UIElements.nav[0].style.display = 'hidden';
      $(toggle).data("state", "hide");
    }else {
      
      $("#carousel-container").animate({
        width: '100%',
        height: '50%',
        display: 'block'
      });
      UIElements.nav[0].style.display = 'block';
      $(toggle).data("state", "show");
    }
  });
  
  $('#stream-modal').on('shown.bs.modal', function() {
       
       var constraints = window.constraints = {
      audio: false,
      video: true
    };
       function handleError(error) {
          if (error.name === 'ConstraintNotSatisfiedError') {
            errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
                constraints.video.width.exact + ' px is not supported by your device.');
          } else if (error.name === 'PermissionDeniedError') {
            errorMsg('Permissions have not been granted to use your camera and ' +
              'microphone, you need to allow the page access to your devices in ' +
              'order for the demo to work.');
          }
          errorMsg('getUserMedia error: ' + error.name, error);
        }
        
        function errorMsg(msg, error) {
          errorElement.innerHTML += '<p>' + msg + '</p>';
          if (typeof error !== 'undefined') {
            console.error(error);
          }
        }
        
        var errorElement = document.querySelector('#errorMsg');
        var video = document.querySelector('#stream');
      
        if (window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia) {
                // Not adding `{ audio: true }` since we only want video now
                window.navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                }).catch(handleError);
            }
            else if (window.navigator.getUserMedia) { // Standard
                window.navigator.getUserMedia({ video: true }, function (stream) {
                    video.src = stream;
                    video.play();
                }, handleError);
            } else if (window.navigator.webkitGetUserMedia) { // WebKit-prefixed
                window.navigator.webkitGetUserMedia({ video: true }, function (stream) {
                    video.src = window.webkitURL.createObjectURL(stream);
                    video.play();
                }, handleError);
            } else if (window.navigator.mozGetUserMedia) { // Mozilla-prefixed
                window.navigator.mozGetUserMedia({ video: true }, function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                }, handleError);
            }

  });
  
  $('#stream-modal').on('hidden.bs.modal', function () {
    
     var video = document.querySelector('#stream');
     
      let stream = video.srcObject;
      let tracks = stream.getTracks();
    
      tracks.forEach(function(track) {
        track.stop();
      });
    
      video.srcObject = null;
  });
});