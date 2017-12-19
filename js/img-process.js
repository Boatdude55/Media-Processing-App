  var apply = ( function () {
      
      var options,ctx,canvasWidth,canvasHeight;
      var img_u8, canvas;

      const demo_opt = function(){
          this.blur_radius = 2;
          this.low_threshold = 20;
          this.high_threshold = 50;
      };

      var init = function ( frame ) {
          
          canvas = frame;
          canvasWidth  = canvas.width;
          canvasHeight = canvas.height;
          ctx = canvas.getContext('2d');

          ctx.fillStyle = "rgb(0,255,0)";
          ctx.strokeStyle = "rgb(0,255,0)";

          img_u8 = new jsfeat.matrix_t(canvasWidth, canvasHeight, jsfeat.U8C1_t);

          options = new demo_opt();
          
      };

    /**
     * @param frame; the current canvas being processed
     * @param x; for future mouse driven processing
     * @param y; for future mouse driven processing
     * */
      var canny = function ( frame, x = 0, y = 0 ) {
              
              init(frame);

              let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

              jsfeat.imgproc.grayscale(imageData.data, canvasWidth, canvasHeight, img_u8);

              let r = options.blur_radius|0;
              let kernel_size = (r+1) << 1;

              jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
              
              jsfeat.imgproc.canny(img_u8, img_u8, options.low_threshold|0, options.high_threshold|0);

              // render result back to canvas
              //!! Little Endian !!
              let data_u32 = new Uint32Array(imageData.data.buffer);
              let alpha = 0xff000000;
              let i = img_u8.cols*img_u8.rows, pix = 0;

              while(--i >= 0) {

                  pix = img_u8.data[i];
                  let invert = ~((pix << 16) | (pix << 8) | pix);
                  data_u32[i] = alpha | invert;
              }

              ctx.putImageData(imageData, 0, 0);

      };
      
      return {
                  canny: canny
              };
  })();