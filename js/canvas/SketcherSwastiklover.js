/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "SketcherSwastiklover.js"
*
* Project: Canvas sketchers.
*
* Purpose: Draw a fractal based on a swastika.
*
* Author: Tom McDonnell 2012-04-03.
*
\**************************************************************************************************/

/*
 *
 */
function SketcherSwastiklover(ctx)
{
   var f = 'SketcherSwastiklover()';
   UTILS.checkArgs(f, arguments, ['CanvasRenderingContext2D']);

   // Privileged functions. /////////////////////////////////////////////////////////////////////

   /*
    * @param sketchDetailsByRecursionDepth
    *    As returned by this.getSketchFunctionArgumentObjectsByRecursionDepth().
    */
   this.sketchSwastika = function (o)
   {
      var f = 'SketcherSwastiklover.sketchSwastika()';
      UTILS.checkArgs(f, arguments, ['object']);
      UTILS.validator.checkObject
      (
         o,
         {
            armSegmentLength: 'positiveInt',
            boolClockwise   : 'boolean'    ,
            x               : 'float'      ,
            y               : 'float'
         }
      );

      var sign = (o.boolClockwise)? 1: -1;
      var l    = o.armSegmentLength;
      var x    = o.x;
      var y    = o.y;

      ctx.moveTo(x + l, y - sign * l);
      ctx.lineTo(x    , y - sign * l);
      ctx.lineTo(x    , y + sign * l);
      ctx.lineTo(x - l, y + sign * l);
      ctx.moveTo(x - l, y - sign * l);
      ctx.lineTo(x - l, y           );
      ctx.lineTo(x + l, y           );
      ctx.lineTo(x + l, y + sign * l);
   };

   /*
    *
    */
   this.sketchSwastiklover = function (o)
   {
      var f = 'SketcherSwastiklover.sketchSwastiklover()';
      UTILS.checkArgs(f, arguments, ['object']);
      UTILS.validator.checkObjectAndSetDefaults
      (
         o,
         {
            armSegmentLength   : 'positiveInt'   ,
            armSegmentLengthMin: 'positiveInt'   ,
            delayMs            : 'nonNegativeInt',
            onCompleteFunction : 'nullOrFunction',
            x                  : 'int'           ,
            y                  : 'int'
         }
      );

      _armSegmentLengthMin                           = o.armSegmentLengthMin;
      _onCompleteFunction                            = o.onCompleteFunction;
      _sketchFunctionArgumentObjectsByRecursionDepth = [];

      _fillSketchArgumentObjectsByRecursionDepthRecursively
      (
         o.x, o.y, o.armSegmentLength, true, null, 0
      );

      _maxRecursionDepth       = _sketchFunctionArgumentObjectsByRecursionDepth.length;
      _nOnTimeoutFunctionCalls = 0;

      for (var d = 0; d < _maxRecursionDepth; ++d)
      {
         if (o.delayMs == 0)
         {
            _onTimeout();
         }
         else
         {
            setTimeout(_onTimeout, d * o.delayMs);
         }
      }
   };

   /*
    * Return a data structure containing arguments to be passed to this.sketchSwastika().
    */
   this.getSketchFunctionArgumentObjectsByRecursionDepth = function (o)
   {
      var f = 'SketcherSwastiklover.getSketchFunctionArgumentObjectsByRecursionDepth()';
      UTILS.checkArgs(f, arguments, ['object']);
      UTILS.validator.checkObject
      (
         o,
         {
            armSegmentLength   : 'positiveInt',
            armSegmentLengthMin: 'positiveInt'
         }
      );

      _armSegmentLengthMin                           = o.armSegmentLengthMin;
      _sketchFunctionArgumentObjectsByRecursionDepth = [];
      _fillSketchArgumentObjectsByRecursionDepthRecursively(0, 0, o.armSegmentLength, true, null,0);

      return _sketchFunctionArgumentObjectsByRecursionDepth;
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _onTimeout()
   {
      var f = 'Tessellator._onTimeout()';
      UTILS.checkArgs(f, arguments, []);

      var sketchFunctionArgumentObjects =
      (
         _sketchFunctionArgumentObjectsByRecursionDepth[_nOnTimeoutFunctionCalls]
      );

      ctx.beginPath();

      for (var i = 0; i < sketchFunctionArgumentObjects.length; ++i)
      {
         var o = sketchFunctionArgumentObjects[i];

         _self.sketchSwastika(sketchFunctionArgumentObjects[i]);
      }

      ctx.stroke();

      if (++_nOnTimeoutFunctionCalls == _maxRecursionDepth && _onCompleteFunction != null)
      {
         _onCompleteFunction();
      }
   };

   /*
    *
    */
   function _fillSketchArgumentObjectsByRecursionDepthRecursively
   (
      x, y, armSegmentLength, boolClockwise, positionName, recursionDepth
   )
   {
      try
      {
         var f = 'SketcherSwastiklover._fillSketchArgumentObjectsByRecursionDepthRecursively()';
         UTILS.checkArgs
         (
            f, arguments,
            ['int', 'int', 'nonNegativeInt', 'boolean', 'nullOrString', 'nonNegativeInt']
         );

         if (typeof _sketchFunctionArgumentObjectsByRecursionDepth[recursionDepth] == 'undefined')
         {
            _sketchFunctionArgumentObjectsByRecursionDepth[recursionDepth] = [];
         }

         _sketchFunctionArgumentObjectsByRecursionDepth[recursionDepth].push
         (
            {
               armSegmentLength: armSegmentLength,
               boolClockwise   : boolClockwise   ,
               x               : x               ,
               y               : y
            }
         );

         if (armSegmentLength / 2 < _armSegmentLengthMin)
         {
            return;
         }

         switch (boolClockwise)
         {
          case true : var l1 = armSegmentLength; var l2 = armSegmentLength / 2; break;
          case false: var l2 = armSegmentLength; var l1 = armSegmentLength / 2; break;
          default: throw 'Unexpected value for boolean.';
         }

         var swastikaDetails =
         [
            {posName: 'bl', oppPosName: 'tr', x: x - l2, y: y + l1},
            {posName: 'br', oppPosName: 'tl', x: x + l1, y: y + l2},
            {posName: 'tl', oppPosName: 'br', x: x - l1, y: y - l2},
            {posName: 'tr', oppPosName: 'bl', x: x + l2, y: y - l1}
         ];

         for (var i = 0, len = swastikaDetails.length; i < len; ++i)
         {
            var details = swastikaDetails[i];

            if (details.oppPosName === positionName)
            {
               continue;
            }

            _fillSketchArgumentObjectsByRecursionDepthRecursively
            (
               details.x, details.y, armSegmentLength / 2,
               !boolClockwise, details.posName, recursionDepth + 1
            );
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   var _self                                          = this;
   var _armSegmentLengthMin                           = null;
   var _maxRecursionDepth                             = null
   var _nOnTimeoutFunctionCalls                       = null;
   var _onCompleteFunction                            = null;
   var _sketchFunctionArgumentObjectsByRecursionDepth = null;
}

/*******************************************END*OF*FILE********************************************/
