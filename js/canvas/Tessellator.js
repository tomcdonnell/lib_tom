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

      _nSketchesFinished                         = 0;
      _onCompleteTessellationFunction            = onCompleteTessellationFunction;
      _sketchPositionByKey                       = {};
      _sketchFunction                            = sketchFunction;
      _sketchFunctionArgument                    = sketchFunctionArgument;
      _sketchFunctionArgument.onCompleteFunction = _onCompleteRecursiveSketch;
      _spacingX                                  = spacingX;
      _spacingY                                  = spacingY;

      _buildSquareTessellationSketchPositionsListRecursively(x, y);

      var _nSketchesToFinish = UTILS.object.length(_sketchPositionByKey);

      for (var key in _sketchPositionByKey)
      {
         var position = _sketchPositionByKey[key];

         _sketchFunctionArgument.x = position.x;
         _sketchFunctionArgument.y = position.y;
         _sketchFunction(_sketchFunctionArgument);
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _buildSquareTessellationSketchPositionsListRecursively(x, y)
   {
      var f = 'Tessellator._buildSquareTessellationSketchPositionsListRecursively()';
      UTILS.checkArgs(f, arguments, ['int', 'int']);

      var boolWillDrawAny = false;
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

         if
         (
            _sketchPositionByKey[key] === undefined                &&
            Math.abs(position.x) < (_canvasWidth  / 2 + _spacingX) &&
            Math.abs(position.y) < (_canvasHeight / 2 + _spacingY)
         )
         {
            _sketchPositionByKey[key] = position;
            boolWillDrawAny           = true;
         }
      }

      if (boolWillDrawAny)
      {
         for (var i = 0; i < positions.length; ++i)
         {
            var position = positions[i];
            _buildSquareTessellationSketchPositionsListRecursively(position.x, position.y);
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

      if (++_nSketchesFinished == _nSketchesToFinish)
      {
         _onCompleteTessellationFunction();
      }
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvasHeight                   = $(canvas).height();
   var _canvasWidth                    = $(canvas).width();
   var _ctx                            = canvas.getContext('2d');
   var _midX                           = Math.round(_canvasWidth  / 2);
   var _midY                           = Math.round(_canvasHeight / 2);
   var _nSketchesFinished              = null;
   var _nSketchesToFinish              = null;
   var _onCompleteTessellationFunction = null;
   var _sketchPositionByKey            = null;
   var _sketchFunction                 = null;
   var _sketchFunctionArgument         = null;
   var _spacingX                       = null;
   var _spacingY                       = null;
}

/*******************************************END*OF*FILE********************************************/
