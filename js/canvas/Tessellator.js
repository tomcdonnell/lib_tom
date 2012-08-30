/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename:: "Tessellator.js"
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
function Tessellator(canvas)
{
   var f = 'Tessellator()';
   UTILS.checkArgs(f, arguments, [HTMLCanvasElement]);

   /*
    * @param sketchFunction
    *    Function expecting a single object as an argument.
    *    The x and y position of the object to be drawn must be specified
    *    in the object by two values having keys 'x' and 'y' respectively.
    *
    * @param sketchFunctionArgument
    *    An object matching the format expected by the sketcherFunction.
    */
   this.drawSquareTessellation = function
   (
      x, y, spacingX, spacingY, sketchFunction,
      sketchFunctionArgument, onCompleteTessellationFunction
   )
   {
      var f = 'Tessellator.drawSquareTessellation()';
      UTILS.checkArgs
      (f, arguments, ['int', 'int', 'int', 'int', Function, Object, 'nullOrFunction']);

      _onCompleteTessellationFunction            = onCompleteTessellationFunction;
      _positionsDrawnAtByKey                     = {};
      _sketchFunction                            = sketchFunction;
      _sketchFunctionArgument                    = sketchFunctionArgument;
      _sketchFunctionArgument.onCompleteFunction = _onCompleteRecursiveSketch;
      _spacingX                                  = spacingX;
      _spacingY                                  = spacingY;

      _drawSquareTessellationRecursively(x, y);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _drawSquareTessellationRecursively(x, y)
   {
      var f = 'Tessellator._drawSquareTessellationRecursively()';
      UTILS.checkArgs(f, arguments, ['int', 'int']);

      var boolDrawnAny = false;
      var positions    =
      [
         {x: x            , y: y            },
         {x: x - _spacingX, y: y - _spacingY},
         {x: x + _spacingY, y: y - _spacingX},
         {x: x - _spacingY, y: y + _spacingX},
         {x: x + _spacingX, y: y + _spacingY}
      ];

      for (var i = 0; i < positions.length; ++i)
      {
         var position = positions[i];
         var key      = position.x + '-' + position.y;

         if (_positionsDrawnAtByKey[key] === undefined)
         {
            _sketchFunctionArgument.x = position.x;
            _sketchFunctionArgument.y = position.y;

            if
            (
               Math.abs(_sketchFunctionArgument.x) < (_canvasWidth  / 2 + _spacingX) &&
               Math.abs(_sketchFunctionArgument.y) < (_canvasHeight / 2 + _spacingY)
            )
            {
               _sketchFunction(_sketchFunctionArgument);
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
            _drawSquareTessellationRecursively(position.x, position.y);
         }
      }
   }

   /*
    *
    */
   function _onCompleteRecursiveSketch()
   {
      var f = 'Tessellator._onCompleteRecursiveSketch()';
      UTILS.checkArgs(f, arguments, []);

console.debug(f, 'finality');
      _onCompleteTessellationFunction();
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvasHeight                   = $(canvas).height();
   var _canvasWidth                    = $(canvas).width();
   var _ctx                            = canvas.getContext('2d');
   var _midX                           = Math.round(_canvasWidth  / 2);
   var _midY                           = Math.round(_canvasHeight / 2);
   var _onCompleteTessellationFunction = null;
   var _positionsDrawnAtByKey          = {};
   var _sketchFunction                 = null;
   var _sketchFunctionArgument         = null;
   var _spacingX                       = null;
   var _spacingY                       = null;
}

/*******************************************END*OF*FILE********************************************/
