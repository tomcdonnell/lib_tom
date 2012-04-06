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
   // Privileged functions. /////////////////////////////////////////////////////////////////////

   /*
    *
    */
   this.sketch = function (o)
   {
      UTILS.validator.checkObject
      (
         o,
         {
            delayMs            : 'nonNegativeInt',
            armSegmentLengthMin: 'positiveInt'   ,
            armSegmentLength   : 'positiveInt'   ,
            strokeStyle        : 'string'        ,
            x                  : 'float'         ,
            y                  : 'float'
         }
      );

      _strokeStyle         = o.strokeStyle;
      _delayMs             = o.delayMs;
      _armSegmentLengthMin = o.armSegmentLengthMin;

      _drawSwastikaFractal(o.x, o.y, o.armSegmentLength, true, null);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _drawSwastikaFractal(x, y, armSegmentLength, boolClockwise, positionName)
   {
      var oldStrokeStyle = ctx.strokeStyle;

      ctx.beginPath();
      ctx.strokeStyle = _strokeStyle;

      _drawSwastika(x, y, armSegmentLength, boolClockwise);
      ctx.stroke();

      if (armSegmentLength / 2 < _armSegmentLengthMin)
      {
         return;
      }

      switch (boolClockwise)
      {
       case true : var l1 = armSegmentLength; var l2 = armSegmentLength / 2; break;
       case false: var l2 = armSegmentLength; var l1 = armSegmentLength / 2; break;
       default: throw new Exception('_drawSwastikaFractal', 'Unexpected value for boolean.', '');
      }

      var swastikaDetails =
      [
         {posName: 'bl', oppPosName: 'tr', x: x - l2, y: y + l1},
         {posName: 'br', oppPosName: 'tl', x: x + l1, y: y + l2},
         {posName: 'tl', oppPosName: 'br', x: x - l1, y: y - l2},
         {posName: 'tr', oppPosName: 'bl', x: x + l2, y: y - l1}
      ];

      ctx.beginPath();
      ctx.strokeStyle = _strokeStyle;

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
            setTimeout
            (
               _drawSwastikaFractal, _delayMs,
               details.x, details.y, armSegmentLength / 2, !boolClockwise, details.posName
            );
         }
      }

      ctx.stroke();

      ctx.strokeStyle = oldStrokeStyle;
   }

   /*
    *
    */
   function _drawSwastika(x, y, l, boolClockwise)
   {
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

   var _delayMs             = null;
   var _armSegmentLengthMin = null;
   var _strokeStyle         = null;
}

/*******************************************END*OF*FILE********************************************/
