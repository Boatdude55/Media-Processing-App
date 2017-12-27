var Base = function () {
  
  this.Observable = (function () {
  
      /**
      * @private
      * @member [Array]
      * @type {Object}
      * */
      var Observers = [];
       
      /**
       * @public
       * @function attach observer to Observers
       * @param {Object} observer 
       * */
       var attach = function ( observer ) {
         try{
           
          Observers.push( observer );
          
         }catch( err ){
           
          console.error(err.name, err.message );
          
         }
       };
    
       /**
        * @public
        * @function detach observer to Observers
        * @param {Object} observer
        * */
       var detach = function ( observer ) {
         
          try{
            Observers = Observers.filter(
            
              function (item ) {
                  if ( item !== observer) {
                      return item;
                  }
              }
              
            );
          }catch(err){
            console.error(err.name, err.message);
          }
          
       };
       
       /**
        * @private
        * @function send data to observer
        * @param {FileReader.result} data
        * @param {observer} [thisObj] - thisArg for call()
        * */
       var notify = function( data , thisObj ) {
        
          try{ 
            
              var scope = thisObj;
              
              Observers.forEach( function ( item ) {
                
                  item.call( scope, data );
                  
              });
              
          }catch(err){
            
            console.error(err.name, err.message);
            
          }  
        };
        
        return {
          attach: attach,
          detach: detach,
          notify: notify
        };
    
  })();
  
  this.Cache = (function ( ) {
      
      var data = {
        home: false
      };
      
      var addMember = function ( callback, key, value,) {
        
        data[key] = value;
        
      };
      
      var removeMember = function (  callback, key ) {
        
        delete data[key];
        
      };
      
      var updateMember = function ( key, value ) {
        
        var oldValue = data[key];
        oldValue += value;
        data[key] = oldValue;
        
      };
      
      var getMember = function ( key ) {
        
        if( data.hasOwnProperty(key) === true ){
          return data[key];
        }
        
      };
      
      return {
        add: addMember,
        remove: removeMember,
        update: updateMember,
        getMember: getMember
      };
      
  })();

  this.CreateElement = function ( type, properties ) { 
  
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
  
};

var UploadPanel = (function () {
  
  //Base
  var tools = new Base;

  //Upoad Specific
  var styleProps = {
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
    }
  };
  var fileInput;
  
  /**
  *@function detects mime type from string provided by File
  * @param {String} mimeString
  **/
  var mimeDetect = function ( mimeString ) {
  
    var mimeType = mimeString.includes('video') ? 'video' : (mimeString.includes('image') ? 'img' : false );
    
    return mimeType;
    
  };
  
  var getFiles = function () {
      return fileInput.files;
  };
  
  /**
   * @param {Element} src
   * */
  var setFile = function ( src ) {
    fileInput =  src;
  };
  
  /**
   * @protected
   * @function read files from input, and append them to Carousel home
   * @param {FileList} files
   * @return [Array] cache, newly created img and video elems
   * */
  var upload = function (  ) {
    
    /**
     * @private
     * @member [Array]
     * */
     var files = getFiles();
    var cache = [];
    
    /**
     * @function implements read and add; notifies relevant observers
     * @param {File} file
     * */
    var readAndAdd = function ( file ) {
    
      /**
       * @private
       * @member {FileReader} reader
       * @member {string} mediaType
       * */
      var reader = new FileReader();
      var mediaType = file.type;
    
      reader.addEventListener( "loadend", function () {

          if ( this.readyState === 2 ) {
  
              var elemType = mimeDetect( mediaType );
              
              try{
  
                var tempProp = styleProps[elemType]( reader.result, mediaType );
    
                var media = tools.CreateElement( elemType, tempProp );
                cache.push(media);
                
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

    };
  
    try{

      Array().forEach.call( files, readAndAdd );
      if( cache.length === files.length ) {
        
      tools.Observable.notify(cache);
      cache = [];
        
      } 
    }catch(err){
  
      console.log(err.name,err.message);
  
    }
  };
  
  return {
    tools: tools,
    upload: upload,
    setSrc: setFile
  };
  
})();

var CarouselPanel = (function ( ) {

    /**
     * Observable WorkSpaces
     * Observer NavBar
     * */
    var WorkSpaces = new Base;
    var NavBar = new Base;

    this.styleProps = {
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
    
    this.carouselCont = WorkSpaces.CreateElement('div',this.styleProps['workspace']('home'));
    
    var createSlides = function ( mediaElems, wrap ) {
          
          var slides = mediaElems.map( function ( currElem, index ) {

              var newWrap = wrap.cloneNode();
              
              if ( index === 0 ) {
              
                  newWrap.stlye.class += "active";
                  
              }
              
              newWrap.appendChild( currElem );
            
          });
          
          return slides;
          
    };
    
    var setContainer = function ( name, slides ) {
           
           this.carouselCont.id = name;
           var value = WorkSpaces.Cache.getMember( 'name' );
           
           if( value ){
             
             value[0]
             slides = value.push(slides);

           }
           
           this.carouselCont.appendChild( slides );
           return this.carouselCont;
           
    };
    
    var appendToHome = function ( elems) {
  
        var s = createSlides(elems);
        var c = setContainer('home', s );
      
      WorkSpaces.Observable.notify({home:s});

      return c;
      
    };
    
    var appendToWorkSpace = function () {
      
    };
    
    return {
      appendToHome: appendToHome,
      appendToWorkSpace: appendToWorkSpace,
      WorkSpaces: WorkSpaces,
      NavBar: NavBar
    };
})();

$(function () {
  
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

  var uploadObservers = CarouselPanel.appendToHome();
  UploadPanel.setSrc(UIElements.files[0]);
  UploadPanel.tools.Observable.attach( uploadObservers );
  
  ////////////////////////////////////////////////////////////////////////////////

  $(UIElements.submit[0]).click(UploadPanel.upload);

});
