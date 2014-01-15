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
      UTILS.validator.checkObjectAndSetDefaults
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
            sketchFunctionArgumentObjectsByRecursionDepth: ['array'         , []  ],
            onCompleteFunction                           : ['function'      , null],
            delayMs                                      : ['nonNegativeInt', 0   ]
         }
      );

      _canvasHeight = $(canvas).height();
      _canvasWidth  = $(canvas).width();
      _midX         = Math.round(_canvasWidth  / 2);
      _midY         = Math.round(_canvasHeight / 2);

      _nOnTimeoutFunctionCalls = 0;
      _onCompleteFunction      = o.onCompleteFunction;
      _sketchPositionsAsKeys   = {};
      _spacingX                = o.spacingX;
      _spacingY                = o.spacingY;
      _sketchFunction          = o.sketchFunction;
      _maxRecursionDepth       = o.sketchFunctionArgumentObjectsByRecursionDepth.length;

      _sketchFunctionArgumentObjectsByRecursionDepth =
      (
         o.sketchFunctionArgumentObjectsByRecursionDepth
      );

      _buildSquareTessellationSketchPositionsListRecursively(o.startX, o.startY);
      _timeoutIds = [];

      for (var d = 0; d < _maxRecursionDepth; ++d)
      {
         if (o.delayMs == 0)
         {
            _onTimeout();
         }
         else
         {
            _timeoutIds[d] = setTimeout(_onTimeout, d * o.delayMs);
         }
      }
   };

   /*
    *
    */
   this.stopAnimation = function ()
   {
      var f = 'Tessellator.stopAnimation()';
      UTILS.checkArgs(f, arguments, []);

      if (_timeoutIds !== null)
      {
         for (var i = 0, len = _timeoutIds.length; i < len; ++i)
         {
            window.clearTimeout(_timeoutIds[i]);
         }
      }

      _initState();
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _onTimeout(e)
   {
      try
      {
         var f = 'Tessellator._onTimeout()';
         UTILS.checkArgs(f, arguments, []);

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

      _ctx.save();
      _ctx.translate(_midX, _midY);
      _ctx.scale(1, -1);
      _ctx.beginPath();

      for (var key in _sketchPositionsAsKeys)
      {
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
            _sketchPositionsAsKeys[key] === undefined              &&
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

   /*
    *
    */
   function _initState()
   {
      var f = 'Tessellator._initState()';
      UTILS.checkArgs(f, arguments, []);

      // All the private variables should be set to thier initial values here.
      _canvasHeight                                  = null;
      _canvasWidth                                   = null;
      _maxRecursionDepth                             = null;
      _midX                                          = null;
      _midY                                          = null;
      _nOnTimeoutFunctionCalls                       = null;
      _onCompleteFunction                            = null;
      _sketchFunction                                = null;
      _sketchFunctionArgumentObjectsByRecursionDepth = null;
      _sketchPositionsAsKeys                         = null;
      _spacingX                                      = null;
      _spacingY                                      = null;
      _timeoutIds                                    = null;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _ctx                                           = canvas.getContext('2d');
   var _canvasHeight                                  = null;
   var _canvasWidth                                   = null;
   var _maxRecursionDepth                             = null;
   var _midX                                          = null;
   var _midY                                          = null;
   var _nOnTimeoutFunctionCalls                       = null;
   var _onCompleteFunction                            = null;
   var _sketchFunction                                = null;
   var _sketchFunctionArgumentObjectsByRecursionDepth = null;
   var _sketchPositionsAsKeys                         = null;
   var _spacingX                                      = null;
   var _spacingY                                      = null;
   var _timeoutIds                                    = null;
}

/*******************************************END*OF*FILE********************************************/
