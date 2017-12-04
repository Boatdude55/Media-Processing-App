"use strict";


function Signal ( src ) {
    
    const _pxlBytes = 4;
    
    var _convert2D = function ( coords , length ) {
        
        var index1D;
       
        return index1D; 
    };
    
    var _convert1D = function ( index, length ) {
        
        var coords = {x:0, y:0};
        
        return coords;
    };
    
    var _getRed = function ( index ) {
        
        const offset = 0;
        var pxl;
        
        return pxl;
    };
    
    var _getGreen = function  ( index ) {
        const offset = 1;
        var pxl;
        
        return pxl;
    };
    
    var _getBlue = function  ( index ) {
        const offset = 2;
        var pxl;
        
        return pxl;
    };
    var _putRed = function  ( index, pxlValObj ) {
        
    };
    
    var _putGreen = function  ( index, pxlValObj ) {
        
    };
    
    var _putBlue = function  ( index, pxlValObj ) {
        
    };
    
    this.currSpace;
        this.getRGB = function ( MyTypedArray, coord ) {
            _getRed( index );
            _getGreen( index );
            _getBlue( index);
            return {};
        };
            
        this.setRGB = function ( index, pxlVal ) {
            _putRed( pxlVal );
            _putGreen( pxlVal );
            _putBlue( pxlVal );
    
        };
        
        this.getKernel = function ( infoArray  ) {
            
            var copiedVals;
            
            return copiedVals;
        };
};

function AlgorithmFactory () {
   /**
    * Implement Algorithm Structures later
    * */
    function SequentialProcess ( signal, process ) {
        
    };
    function ParallelProcess () {
        function Convolve ( signal, process ) {
            
        };
    };
    function GreyFactory () {
        
        var _brightness = function ( rgbObj )
    	{
    	    return (0.2126 * rgbObj.r + 0.7152 * rgbObj.g + 0.0722 * rgbObj.b + 0.5) ;
    	}
    
        var Grey = function ( rgb ) {
            
            var brightness = _brightness( rgb );
            
            return brightness;
        }
    };
                          
    function FilterFactory () {
        
        var filterRegExp;
        
        var _type = {
            median: (function () {
                
                var _windowRadius = 5;
                
                var swap = function ( a, b ) {
                    
                    let temp = a;
                    a = b;
                    b= a;

                };
                
                var bubbleSort = function ( data, coordCache ) {
                    
                    let swapped;
                    let max = 0; let min = 0;

                    for ( let i = 0 ; i < (coordCache.length - 1) ; i++ ) { 

                     swapped = false;

                     for ( let j = 0 ; j < (coordCache.length-i-1) ; j++ ) {
                        
                        min = data[coordCache[j]], max = data[coordCache[j+1]];

                        if (min > max)
                        {
                           swap(coordCache[j], coordCache[j+1]);
                           swapped = true;
                        }
                     }
                 
                     // IF no two elements were swapped by inner loop, then break
                     if (swapped == false)
                        break;
                   }
                   
                   return coordCache;
                };

                /**
                 * execute functionality should be handled by algorithm structure,
                 * not by the algorithm itself
                 * */
                var execute = function ( imgArray ) {
                    
                    let median = 0;
                    
                    for ( let i = 0; i < imgArray.height ; i++ ) {
                        
                        for( let j = 0; j < imgArray.width ; j++ ) {
        
                            let kernel = imgArray.getKernel([i,j,_windowRadius ]);
                            
                            kernel = bubbleSort( imgArray , kernel );
                            
                            median = kernel.length%2 ? ((kernel.length - 1)/2)+1 : kernel.length/2;
                            
                            imgArray.setRGB( imgArray.getRGB([i,j]) );
                        }
                        
                    }
                };
                
            })()
        };
        
        var BuildFilter = function ( filter = 'median' ) {
            
            filter += "";
            return _type[filter];
        }
        this.executeFilter = function ( filterType, MyTypedArray ) {
            
            var filter = _type[filterType];
            
        };
    }
    
    function Threshold () {
        
    };
    
    this.Build = function ( algorithm ) {

        
    }
    
};

function SpaceFactory () {
    
    var spaceName = "";
    
    var Space = function () {
        
        var state = false;
        var binaryData = this.currSpace;
        
        return binaryData;
   
    };
    
    this.BuildSpace = function ( transformation ) {
        
        spaceName += transformation;
        
        var spaceTransform = AlgorithmFactory.Build( spaceName );
        
        let newSpace = new Space();

        newSpace.prototype = {
            Signal: new Signal(),
            Transformation: spaceTransform
        };
        
        return newSpace;
    }
}

SpaceFactory.prototype = new AlgorithmFactory();

/****************Test case*************************/

let Tx = new SpaceFactory();

let g = Tx.BuildSpace('grey');
imageData.data

g()


function CannyAlgorithm ( signal ) {
    
let greySpace =  Tx.BuildSpace( 'grey' );
let filterSpace = Tx.BuildSpace( 'box' );
let binarySpace = Tx.BuildSpace( 'threshold' )

let result = signal.greySpace().filterSpace().binarySpace();
return 
}