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
   UTILS.checkArgs(f, arguments, [CanvasRenderingContext2D]);

   // Privileged functions. /////////////////////////////////////////////////////////////////////

   /*
    *
    */
   this.sketch = function (o)
   {
      var f = 'SketcherSwastiklover.sketch()';
      UTILS.checkArgs(f, arguments, [Object]);
      UTILS.validator.checkObject
      (
         o,
         {
            armSegmentLength   : 'positiveInt'   ,
            armSegmentLengthMin: 'positiveInt'   ,
            delayMs            : 'nonNegativeInt',
            onCompleteFunction : 'nullOrFunction',
            x                  : 'float'         ,
            y                  : 'float'
         }
      );

      _delayMs             = o.delayMs;
      _armSegmentLengthMin = o.armSegmentLengthMin;

      _drawSwastikaFractal(o.x, o.y, o.armSegmentLength, true, null, o.onCompleteFunction);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _drawSwastikaFractal
   (
      x, y, armSegmentLength, boolClockwise, positionName, onCompleteFunction
   )
   {
      try
      {
         var f = 'SketcherSwastiklover._drawSwastikaFractal()';
         UTILS.checkArgs
         (f, arguments, ['int', 'int', 'nonNegativeInt', Boolean, 'nullOrString','nullOrFunction']);

         ctx.beginPath();
         _drawSwastika(x, y, armSegmentLength, boolClockwise);
         ctx.stroke();

         if (armSegmentLength / 2 < _armSegmentLengthMin)
         {
            if (--_nRecursiveCallsInProgress == 0 && onCompleteFunction !== null)
            {
               onCompleteFunction();
            }
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

         ctx.beginPath();

         for (var i = 0, len = swastikaDetails.length; i < len; ++i)
         {
            var details = swastikaDetails[i];

            if (details.oppPosName === positionName)
            {
               continue;
            }

            if (_delayMs == 0)
            {
               _drawSwastikaFractal
               (
                  details.x, details.y, armSegmentLength / 2, !boolClockwise, details.posName
               );
            }
            else
            {
               ++_nRecursiveCallsInProgress;
               setTimeout
               (
                  _drawSwastikaFractal, _delayMs,
                  details.x, details.y, armSegmentLength / 2, !boolClockwise, details.posName,
                  onCompleteFunction
               );
            }
         }

         ctx.stroke();

         if (--_nRecursiveCallsInProgress == 0 && onCompleteFunction !== null)
         {
            onCompleteFunction();
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
   function _drawSwastika(x, y, l, boolClockwise)
   {
      var f = 'SketcherSwastiklover._drawSwastika()';
      UTILS.checkArgs(f, arguments, ['int', 'int', 'nonNegativeInt', Boolean]);

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

   var _delayMs                   = null;
   var _armSegmentLengthMin       = null;
   var _nRecursiveCallsInProgress = 0;
}

/*******************************************END*OF*FILE********************************************/
