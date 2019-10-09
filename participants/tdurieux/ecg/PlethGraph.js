/*
 * 
 * Photoplethysmograph (Real Time PPG Grapher)
 * 
 *    by: Tso (Peter) Chen
 * 
 * 
 * 
 * 0.1 - first version
 * 
 * 
 * Absolutely free to use, copy, edit, share, etc.
 *--------------------------------------------------*/
  
  /*
   * Helper function to convert a number to the graph coordinate
   * ----------------------------------------------------------- */
  function convertToGraphCoord(g, num){
    return Math.floor((g.height / 2) * -(num * g.scaleFactor) + g.height / 2);
  }

  /*
   * Constructor for the PlethGraph object
   * ----------------------------------------------------------- */
  function PlethGraph(cid, datacb){
    
    var g             =   this;
    g.canvas_id       =   cid;
    g.canvas          =   $("#" + cid);
    g.context         =   g.canvas[0].getContext("2d");
    g.width           =   $("#" + cid).width();
    g.height          =   $("#" + cid).height();
    g.white_out       =   g.width * 0.01;
    g.fade_out        =   g.width * 0.10;
    g.fade_opacity    =   0.1;
    g.current_x       =   0;
    g.current_y       =   0;
    g.erase_x         =   null;
    g.speed           =   5;
    g.linewidth       =   3;
    g.scaleFactor     =   1;
    g.stop_graph      =   true;
    
    g.plethStarted    =   false;
    g.plethBuffer     =   new Array();
    
    devicePixelRatio = window.devicePixelRatio || 1,
    backingStoreRatio = g.context.webkitBackingStorePixelRatio ||
                        g.context.mozBackingStorePixelRatio ||
                        g.context.msBackingStorePixelRatio ||
                        g.context.oBackingStorePixelRatio ||
                        g.context.backingStorePixelRatio || 1,

    ratio = devicePixelRatio / backingStoreRatio;
    

    var oldWidth = g.canvas[0].width;
    var oldHeight = g.canvas[0].height;

    g.canvas[0].width = oldWidth * ratio;
    g.canvas[0].height = oldHeight * ratio;

    g.canvas[0].style.width = oldWidth + 'px';
    g.canvas[0].style.height = oldHeight + 'px';

    // now scale the context to counter
    // the fact that we've manually scaled
    // our canvas element
    g.context.scale(ratio, ratio);

    
    /*
     * The call to fill the data buffer using
     * the data callback
     * ---------------------------------------- */
    g.fillData = function() {
      g.plethBuffer = datacb();
      };

    /*
     * The call to check whether graphing is on
     * ---------------------------------------- */
    g.isActive = function() {
      return !g.stop_graph;
    };

    /*
     * The call to stop the graphing
     * ---------------------------------------- */
    g.stop = function() {
      g.stop_graph = true;
    };


    /*
     * The call to wrap start the graphing
     * ---------------------------------------- */
    g.start = function() {
      g.stop_graph = false;
      g.animate();
    };
    

    /*
     * The call to start the graphing
     * ---------------------------------------- */
    g.animate = function() {
      reqAnimFrame =   window.requestAnimationFrame       ||
                       window.mozRequestAnimationFrame    ||
                       window.webkitRequestAnimationFrame ||
                       window.msRequestAnimationFrame     ||
                       window.oRequestAnimationFrame;
      
      // Recursive call to do animation frames
      if (!g.stop_graph) reqAnimFrame(g.animate);
      
      // We need to fill in data into the buffer so we know what to draw
      g.fillData();
      
      // Draw the frame (with the supplied data buffer)
      g.draw();
    };
    
    
    g.draw = function() {
      // Circle back the draw point back to zero when needed (ring drawing)
      g.current_x = (g.current_x > g.width) ? 0 : g.current_x;
      
      // "White out" a region before the draw point
      for( i = 0; i < g.white_out ; i++){
        g.erase_x = (g.current_x + i) % g.width;
        g.context.clearRect(g.erase_x, 0, 1, g.height);
      }
      
      // "Fade out" a region before the white out region
      for( i = g.white_out ; i < g.fade_out ; i++ ){
        g.erase_x = (g.current_x + i) % g.width;
        g.context.fillStyle="rgba(0, 0, 0, " + g.fade_opacity.toString() + ")";
        g.context.fillRect(g.erase_x, 0, 1, g.height);
      }
  
      // If this is first time, draw the first y point depending on the buffer
      if (!g.started) {
        g.current_y = convertToGraphCoord(g, g.plethBuffer[0]);
        g.started = true;
      }
      
      // Start the drawing
      g.context.beginPath();

      // We first move to the current x and y position (last point)
      g.context.moveTo(g.current_x, g.current_y);

      g.context.strokeStyle = "#FF3454"
      for (i = 0; i < g.plethBuffer.length; i++) {
        // Put the new y point in from the buffer
        g.current_y = convertToGraphCoord(g, g.plethBuffer[i]);
        
        // Draw the line to the new x and y point
        g.context.lineTo(g.current_x += g.speed, g.current_y);
        
        // Set the 
        g.context.lineWidth   = g.linewidth;
        g.context.lineJoin    = "round";
        
        // Create stroke
        g.context.stroke();
      }
      
      // Stop the drawing
      g.context.closePath();
    };
  }