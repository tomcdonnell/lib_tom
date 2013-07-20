/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "CanvasWrapper.js"
*
* Project: General objects.
*
* Purpose: Definition of the CanvasWrapper object.
*
* Author: Tom McDonnell 2008-09-25.
*
\**************************************************************************************************/

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function CanvasWrapper(canvas)
{
   var f = 'CanvasWrapper()';
   UTILS.checkArgs(f, arguments, [HTMLCanvasElement]);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getContext2d  = function () {return context.getContext('2d');};
   this.getOffsetTop  = function () {return canvasOffsetTop         ;};
   this.getOffsetLeft = function () {return canvasOffsetLeft        ;};

   /*
    *
    */
   this.getCanvasDimensions = function ()
   {
      var f = 'CanvasWrapper.getCanvasDimensions()';
      UTILS.checkArgs(f, arguments, []);

      var dimensions =
      {
         width : Number(canvas.getAttribute('width' )),
         height: Number(canvas.getAttribute('height'))
      };

      return dimensions;
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    * This function should be run after the canvas element has been added to the DOM.
    */
   this.setOffsets = function ()
   {
      var f = 'CanvasWrapper.setOffsets()';
      UTILS.checkArgs(f, arguments, []);

      var offset = $(canvas).offset();

      canvasOffsetTop  = offset.top;
      canvasOffsetLeft = offset.left;
   };

   // Other public functions. -----------------------------------------------------------------//

   /*
    * Convert window coordinates to those used inside the canvas.
    * Any coordinates supplied to member functions of CanvasWrapper() must be canvas coordinates.
    *
    * Definitions:
    *
    * Window coordinates:
    *   The normal coordinates used inside the browser window.
    *   Objects supply these coordinates.
    *   Eg. (x: 0                , y: 0                 ) is top    left  corner,
    *       (x: window.innerWidth, y: window.innerHeight) is bottom right corner.
    *
    * Canvas coordinates definition:
    *   The coordinates used inside the canvas.
    *   Eg. (x: 0                , y: 0                 ) is top    left  corner,
    *       (x: 0.5              , y: 0.5               ) is middle of top left square,
    *       (x: N_COLS           , y: N_ROWS            ) is bottom right corner.
    */
   this.convertCoordinatesWindowToCanvas = function (pos)
   {
      var f = 'CanvasWrapper.convertCoordinatesWindowToCanvas()';
      UTILS.checkArgs(f, arguments, [VectorRec2d]);

      pos.setX((pos.getX() - canvasOffsetLeft) / SCALING_FACTOR + window.scrollX);
      pos.setY((pos.getY() - canvasOffsetTop ) / SCALING_FACTOR + window.scrollY);
   };

   /*
    * See definitions given in convertCoordinatesWindowToCanvas().
    */
   this.convertCoordinatesCanvasToWindow = function (pos)
   {
      var f = 'CanvasWrapper.convertCoordinatesCanvasToWindow()';
      UTILS.checkArgs(f, arguments, [VectorRec2d]);

      pos.setX((pos.getX() * SCALING_FACTOR) + canvasOffsetLeft - window.scrollX);
      pos.setY((pos.getY() * SCALING_FACTOR) + canvasOffsetTop  - window.scrollY);
   };

   // Private variables. ////////////////////////////////////////////////////////////////////////

   // Offsets in pixels.
   // These must be set after the canvas element has been added to the DOM using this.setOffsets().
   var canvasOffsetTop  = null;
   var canvasOffsetLeft = null;

   const SCALING_FACTOR = 1;
}

/*******************************************END*OF*FILE********************************************/
