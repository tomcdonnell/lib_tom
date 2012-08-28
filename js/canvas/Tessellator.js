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
    *
    */
   this.reset = function ()
   {
      var f = 'Tessellator.reset()';
      UTILS.checkArgs(f, arguments, []);
console.debug('Resetting Tessellator.');
      var _positionsDrawnAtByKey = {};
   };

   /*
    * @param sketchFunction
    *    Function expecting a single object as an argument.
    *    The x and y position of the object to be drawn must be specified
    *    in the object by two values having keys 'x' and 'y' respectively.
    *
    * @param sketchFunctionArgument
    *    An object matching the format expected by the sketcherFunction.
    */
   this.drawSquareTessellationRecursively = function
   (
      x, y, spacingX, spacingY, sketchFunction, sketchFunctionArgument
   )
   {
      var f = 'Tessellator.drawSquareTessellationRecursively()';
      UTILS.checkArgs(f, arguments, ['int', 'int', 'int', 'int', Function, Object]);

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
               Math.abs(sketchFunctionArgument.x) < (_canvasWidth  / 2 + spacingX) &&
               Math.abs(sketchFunctionArgument.y) < (_canvasHeight / 2 + spacingY)
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
            this.drawSquareTessellationRecursively
            (
               position.x    , position.y,
               spacingX      , spacingY  ,
               sketchFunction, sketchFunctionArgument
            );
         }
      }
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
