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
   UTILS.checkArgs(f, arguments, ['HTMLCanvasElement']);

   /*
    * @param sketchFunction
    *    Function expecting a single object as an argument.
    *    The x and y position of the object to be drawn must be specified
    *    in the object by two values having keys 'x' and 'y' respectively.
    */
   this.drawSquareTessellation = function (o)
   {
      var f = 'Tessellator.drawSquareTessellation()';
      UTILS.checkArgs(f, arguments, ['object']);
      UTILS.validator.checkObject
      (
         o,
         {
            sketchFunction: 'function',
            spacingX      : 'int'     ,
            spacingY      : 'int'     ,
            startX        : 'int'     ,
            startY        : 'int'
         },
         {
            sketchFunctionArgumentObjectsByRecursionDepth: 'array',
            onCompleteFunction                           : 'function'
         }
      );

      _nOnTimeoutFunctionCalls = 0;
      _onCompleteFunction      = o.onCompleteFunction;
      _sketchPositionsAsKeys   = {};
      _spacingX                = o.spacingX;
      _spacingY                = o.spacingY;
      _sketchFunction          = o.sketchFunction;
      _maxRecursionDepth       = o.sketchFunctionArgumentObjectsByRecursionDepth.length;
console.debug(f, '_maxRecursionDepth: ', _maxRecursionDepth);

      _sketchFunctionArgumentObjectsByRecursionDepth =
      (
         o.sketchFunctionArgumentObjectsByRecursionDepth
      );

      _buildSquareTessellationSketchPositionsListRecursively(o.startX, o.startY);

      for (var d = 0; d < _maxRecursionDepth; ++d)
      {
         setTimeout(_onTimeout, d * 500);
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _onTimeout(e)
   {
      try
      {
         var f = 'Tessellator.onTimeout()';
         UTILS.checkArgs(f, arguments, []);

console.debug(f, '_nOnTimeoutFunctionCalls: ', _nOnTimeoutFunctionCalls);
         _sketchElements
         (
            _sketchFunction,
            _sketchFunctionArgumentObjectsByRecursionDepth[_nOnTimeoutFunctionCalls]
         );

         if (++_nOnTimeoutFunctionCalls == _maxRecursionDepth && _onCompleteFunction != undefined)
         {
            _onCompleteFunction();
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _sketchElements(sketchFunction, sketchFunctionArgumentObjects)
   {
      var f = 'Tessellator._sketchElements()';
      UTILS.checkArgs(f, arguments, ['function', 'array']);

      var _midX = Math.round(_canvasWidth  / 2);
      var _midY = Math.round(_canvasHeight / 2);

      _ctx.save();
      _ctx.translate(_midX, _midY);
      _ctx.scale(1, -1);
      _ctx.beginPath();

      for (var key in _sketchPositionsAsKeys)
      {
         // TODO: Translate to sketch position.
         var indexOfPipe = key.indexOf('|');
         var x           = key.substr(0, indexOfPipe);
         var y           = key.substr(indexOfPipe + 1);

         _ctx.save();
         _ctx.translate(x, y);

         for (var i = 0; i < sketchFunctionArgumentObjects.length; ++i)
         {
            sketchFunction(sketchFunctionArgumentObjects[i]);
         }

         _ctx.restore();
      }

      _ctx.stroke();
      _ctx.restore();
   };

   /*
    *
    */
   function _buildSquareTessellationSketchPositionsListRecursively(x, y)
   {
      var f = 'Tessellator._buildSquareTessellationSketchPositionsListRecursively()';
      UTILS.checkArgs(f, arguments, ['int', 'int']);

      var boolWillDrawAny = false;
      var positions       =
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
         var key      = position.x + '|' + position.y;

         if
         (
            _sketchPositionsAsKeys[key] === undefined                &&
            Math.abs(position.x) < (_canvasWidth  / 2 + _spacingX) &&
            Math.abs(position.y) < (_canvasHeight / 2 + _spacingY)
         )
         {
            _sketchPositionsAsKeys[key] = position;
            boolWillDrawAny             = true;
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

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvasHeight                                  = $(canvas).height();
   var _canvasWidth                                   = $(canvas).width();
   var _ctx                                           = canvas.getContext('2d');
   var _nOnTimeoutFunctionCalls                       = null;
   var _onCompleteFunction                            = null;
   var _sketchFunction                                = null;
   var _sketchFunctionArgumentObjectsByRecursionDepth = null;
   var _sketchPositionsAsKeys                         = null;
   var _spacingX                                      = null;
   var _spacingY                                      = null;
}

/*******************************************END*OF*FILE********************************************/
