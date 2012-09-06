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
    *    As returned by this.getSketchDetailsByRecursionDepth().
    */
   this.sketch = function (o)
   {
      var f = 'SketcherSwastiklover.sketch()';
      UTILS.checkArgs(f, arguments, ['object']);
      _sketchSwastika(o.x, o.y, o.armSegmentLength, o.boolClockwise);
   };

   /*
    *
    */
   this.getSketchFunctionArgumentSetsByRecursionDepth = function (o)
   {
      var f = 'SketcherSwastiklover.getSketchFunctionArgumentSetsByRecursionDepth()';
      UTILS.checkArgs(f, arguments, ['object']);
      UTILS.validator.checkObject
      (
         o,
         {
            armSegmentLength   : 'positiveInt',
            armSegmentLengthMin: 'positiveInt'
         }
      );

      _armSegmentLengthMin                  = o.armSegmentLengthMin;
      _sketchElementDetailsByRecursionDepth = [];

      _fillSketchElementDetailsByRecursionDepthRecursively(0, 0, o.armSegmentLength, true, null, 0);

      return _sketchElementDetailsByRecursionDepth;
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _fillSketchElementDetailsByRecursionDepthRecursively
   (
      x, y, armSegmentLength, boolClockwise, positionName, recursionDepth
   )
   {
      try
      {
         var f = 'SketcherSwastiklover._fillSketchElementDetailsByRecursionDepthRecursively()';
         UTILS.checkArgs
         (
            f, arguments,
            ['int', 'int', 'nonNegativeInt', 'boolean', 'nullOrString', 'nonNegativeInt']
         );

         if (typeof _sketchElementDetailsByRecursionDepth[recursionDepth] == 'undefined')
         {
            _sketchElementDetailsByRecursionDepth[recursionDepth] = [];
         }

         _sketchElementDetailsByRecursionDepth[recursionDepth].push
         (
            {
               armSegmentLength: armSegmentLength,
               boolClockwise   : boolClockwise   ,
               positionName    : positionName    ,
               recursionDepth  : recursionDepth  ,
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

            _fillSketchElementDetailsByRecursionDepthRecursively
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

   /*
    *
    */
   function _sketchSwastika(x, y, l, boolClockwise)
   {
      var f = 'SketcherSwastiklover._sketchSwastika()';
      UTILS.checkArgs(f, arguments, ['int', 'int', 'nonNegativeInt', 'boolean']);

      var sign = (boolClockwise)? 1: -1;

      ctx.moveTo(x + l, y - sign * l);
      ctx.lineTo(x    , y - sign * l);
      ctx.lineTo(x    , y + sign * l);
      ctx.lineTo(x - l, y + sign * l);
      ctx.moveTo(x - l, y - sign * l);
      ctx.lineTo(x - l, y           );
      ctx.lineTo(x + l, y           );
      ctx.lineTo(x + l, y + sign * l);
   }

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   var _armSegmentLengthMin                  = null;
   var _sketchElementDetailsByRecursionDepth = null;
}

/*******************************************END*OF*FILE********************************************/
