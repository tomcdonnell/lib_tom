/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename:: "SketcherGrid.js"
*
* Project: Canvas sketchers.
*
* Purpose: Draw a square grid on the canvas.
*
* Author: Tom McDonnell 2012-04-03.
*
\**************************************************************************************************/

/*
 *
 */
function SketcherGrid(canvas)
{
   var f = 'SketcherGrid()';
   UTILS.checkArgs(f, arguments, ['HTMLCanvasElement']);

   /*
    * Draw a square grid of lines nPixelsSeparation apart, rotated angleInRadians radians clockwise.
    * Draw the grid so as to cover a square shaped area, with side length equal to 1.5 * the
    * longest side length of the canvas.  That way, the grid can be rotated to any angle while
    * still covering the canvas.
    */
   this.drawSquareGrid = function (nPixelsSeparation, angleInRadians, cssColor)
   {
      var f = 'SketcherGrid.drawSquareGrid()';
console.log(f, 'nPixelsSeparation: ', nPixelsSeparation);
console.log(f, 'angleInRadians   : ', angleInRadians   );
      UTILS.checkArgs(f, arguments, ['float', 'float', 'string']);

      var _canvasHeight = $(canvas).height();
      var _canvasWidth  = $(canvas).width();
      var _midX         = Math.round(_canvasWidth  / 2);
      var _midY         = Math.round(_canvasHeight / 2);

      _ctx.save();
      _ctx.translate(_midX, _midY);
      _ctx.rotate(angleInRadians);
      _ctx.beginPath();

      var gridSideLength = Math.max(_canvasHeight, _canvasWidth) * 1.5;
      var nGridLines     = gridSideLength / nPixelsSeparation;
      var halfNGridLines = Math.ceil(nGridLines / 2);

      // Draw horizontal grid lines.
      for (var i = 0; i < halfNGridLines; ++i)
      {
         var y = i * nPixelsSeparation;

         _ctx.moveTo(-gridSideLength,  y);
         _ctx.lineTo( gridSideLength,  y);
         _ctx.moveTo(-gridSideLength, -y);
         _ctx.lineTo( gridSideLength, -y);
      }

      // Draw vertical grid lines.
      for (var i = 0; i < halfNGridLines; ++i)
      {
         var x = i * nPixelsSeparation;

         _ctx.moveTo( x, -gridSideLength);
         _ctx.lineTo( x,  gridSideLength);
         _ctx.moveTo(-x, -gridSideLength);
         _ctx.lineTo(-x,  gridSideLength);
      }

      _ctx.strokeStyle = cssColor;
      _ctx.stroke();
      _ctx.restore();
   };

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _ctx = canvas.getContext('2d');
}

/*******************************************END*OF*FILE********************************************/
