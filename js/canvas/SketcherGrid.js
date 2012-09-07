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
    * Draw a set of lines having the given gradient and vertical separation, and another
    * set of lines intersecting the first set at right angles so that a square grid is formed.
    * The grid will always have an intersection at x = 0, y = 0.
    */
   this.drawSquareGrid = function (horizontalishGradient, horizontalishLineVSeparation)
   {
      var f = 'SketcherGrid.drawSquareGrid()';
      UTILS.checkArgs(f, arguments, ['float', 'float']);

      if (Math.abs(horizontalishGradient) > 1)
      {
         throw "Math.abs(horizontalishGradient) > 1.  Not very horizontalish.";
      }

      _ctx.save();
      _ctx.translate(_midX, _midY);
      _ctx.beginPath();

      var i = 0;

      while (true)
      {
         // Using y = mx + c representation.
         var c           = i++ * horizontalishLineVSeparation;
         var yAtFarLeft  = horizontalishGradient * -_midX + c;
         var yAtFarRight = horizontalishGradient *  _midX + c;

         if
         (
            // If the line will intersect the canvas...
            Math.abs(yAtFarLeft ) <= _midY ||
            Math.abs(yAtFarRight) <= _midY ||
            (yAtFarLeft < -_midY && yAtFarRight >  _midY) ||
            (yAtFarLeft >  _midY && yAtFarRight < -_midY)
         )
         {
            _ctx.moveTo(-_midX, yAtFarLeft );
            _ctx.lineTo( _midX, yAtFarRight);

            if (i != 0)
            {
               // Draw line at other side of y = 0.
               _ctx.moveTo(-_midX, horizontalishGradient * -_midX - c);
               _ctx.lineTo( _midX, horizontalishGradient *  _midX - c);
            }
         }
         else
         {
            break;
         }
      }

      var verticalishGradient        = -horizontalishGradient;
      var verticalishLineHSeparation = horizontalishLineVSeparation;

      i = 0;

      while (true)
      {
         // Using x = my + c representation.
         var c            = i++ * verticalishLineHSeparation;
         var xAtFarTop    = verticalishGradient * -_midY + c;
         var xAtFarBottom = verticalishGradient *  _midY + c;

         if
         (
            // If the line will intersect the canvas...
            Math.abs(xAtFarTop   ) <= _midX ||
            Math.abs(xAtFarBottom) <= _midX ||
            (xAtFarTop < -_midX && xAtFarBottom >  _midX) ||
            (xAtFarTop >  _midX && xAtFarBottom < -_midX)
         )
         {
            _ctx.moveTo(xAtFarTop   , -_midY);
            _ctx.lineTo(xAtFarBottom,  _midY);

            if (i != 0)
            {
               // Draw line at other side of x = 0.
               _ctx.moveTo(verticalishGradient * -_midY - c, -_midY);
               _ctx.lineTo(verticalishGradient *  _midY - c,  _midY);
            }
         }
         else
         {
            break;
         }
      }

      var oldStrokeStyle = _ctx.strokeStyle;
      _ctx.strokeStyle   = '#ccc';
      _ctx.stroke();
      _ctx.restore();
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvasHeight          = $(canvas).height();
   var _canvasWidth           = $(canvas).width();
   var _ctx                   = canvas.getContext('2d');
   var _midX                  = Math.round(_canvasWidth  / 2);
   var _midY                  = Math.round(_canvasHeight / 2);
   var _positionsDrawnAtByKey = {};
}

/*******************************************END*OF*FILE********************************************/
