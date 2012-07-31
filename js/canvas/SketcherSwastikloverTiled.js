/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename:: "SketcherSwastikloverTiled.js"
*
* Project: Canvas sketchers.
*
* Purpose: Draw a fractal mosaic based on a swastika.
*
* Author: Tom McDonnell 2012-04-03.
*
\**************************************************************************************************/

/*
 *
 */
function SketcherSwastikloverTiled(canvas)
{
   /*
    *
    */
   this.sketch = function (o)
   {
      UTILS.validator.checkObject
      (
         o,
         {
            armSegmentLength   : 'float',
            armSegmentLengthMin: 'float',
            tileSchemeNumber   : 'positiveInt'
         }
      );

      _ctx.translate(_midX, _midY);
      _ctx.scale(1, -1);

      switch (o.tileSchemeNumber)
      {
       case 1 :
         var spacingX       = Math.ceil(o.armSegmentLength * 1.62);
         var spacingYFactor = 2;
         _drawSquareGrid(0.5, Math.ceil(spacingX / 2));
         _drawSquareTessalationRecursively
         (
            0, 0, spacingX, spacingYFactor, sketcher.sketch,
            {
               armSegmentLength   : o.armSegmentLength   ,
               armSegmentLengthMin: o.armSegmentLengthMin,
               delayMs            : 0
            }
         );
         break;

       case 2 :
         var spacingX       = Math.ceil(o.armSegmentLength * 3.62);
         var spacingYFactor = 0.5;
         _drawSquareGrid(-0.5, Math.ceil(spacingX / 2));
         _drawSquareTessalationRecursively
         (
            0, 0, spacingX, spacingYFactor, sketcher.sketch,
            {
               armSegmentLength   : o.armSegmentLength   ,
               armSegmentLengthMin: o.armSegmentLengthMin,
               delayMs            : 0
            }
         );
         break;

       default:
         throw 'Invalid tile scheme number "' + o.tileSchemeNumber + '".';
      }

      _ctx.scale(1, -1);
      _ctx.translate(-_midX, -_midY);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _drawSquareTessalationRecursively
   (
      x, y, spacingX, spacingYFactor, sketchFunction, sketchFunctionArgument
   )
   {
      var spacingY     = spacingX * spacingYFactor;
      var boolDrawnAny = false;
      var positions    =
      [
         {x: x           , y: y           },
         {x: x - spacingX, y: y - spacingY},
         {x: x + spacingY, y: y - spacingX},
         {x: x - spacingY, y: y + spacingX},
         {x: x + spacingX, y: y + spacingY}
      ];

      for (var i = 0; i < positions.length; ++i)
      {
         var position = positions[i];
         var key      = position.x + '-' + position.y;

         if (_positionsDrawnAtByKey[key] === undefined)
         {
            sketchFunctionArgument.x = position.x;
            sketchFunctionArgument.y = position.y;

            if
            (
               Math.abs(sketchFunctionArgument.x) <  (_canvasWidth  / 2 + spacingX) &&
               Math.abs(sketchFunctionArgument.y) <  (_canvasHeight / 2 + spacingY)
            )
            {
               sketchFunction(sketchFunctionArgument);
               _positionsDrawnAtByKey[key] = true;
               boolDrawnAny                = true;
            }
         }
      }

      if (boolDrawnAny)
      {
         for (var i = 0; i < positions.length; ++i)
         {
            var position = positions[i];
            _drawSquareTessalationRecursively
            (
               position.x    , position.y    , spacingX,
               spacingYFactor, sketchFunction, sketchFunctionArgument
            );
         }
      }
   }

   /*
    * Draw a set of lines having the given gradient and vertical separation, and another
    * set of lines intersecting the first set at right angles so that a square grid is formed.
    * The grid will always have an intersection at x = 0, y = 0.
    */
   function _drawSquareGrid(horizontalishGradient, horizontalishLineVSeparation)
   {
      if (Math.abs(horizontalishGradient) > 1)
      {
         throw "Math.abs(horizontalishGradient) > 1.  Not very horizontalish.";
      }

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
      _ctx.strokeStyle = oldStrokeStyle;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvasHeight          = $(canvas).height();
   var _canvasWidth           = $(canvas).width();
   var _ctx                   = canvas.getContext('2d');
   var _midX                  = Math.round(_canvasWidth  / 2);
   var _midY                  = Math.round(_canvasHeight / 2);
   var _sketcher              = new SketcherSwastiklover(_ctx);
   var _positionsDrawnAtByKey = {};
}

/*******************************************END*OF*FILE********************************************/
