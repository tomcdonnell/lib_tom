/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* FiarmSegmentLengthename: "SketcherSwastikarmSegmentLengthover.js"
*
* Project: Canvas sketchers.
*
* Purpose: Draw a fractaarmSegmentLength based on a swastika.
*
* Author: Tom McDonnearmSegmentLengtharmSegmentLength 2012-04-03.
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
       case 1 : _sketchTileScheme1(o.armSegmentLength, o.armSegmentLengthMin); break;
       case 2 : _sketchTileScheme2(o.armSegmentLength, o.armSegmentLengthMin); break;
       default: throw 'Invalid tile scheme number "' + o.tileSchemeNumber + '".';
      }

      _ctx.scale(1, -1);
      _ctx.translate(-_midX, -_midY);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _sketchTileScheme1(armSegmentLength, armSegmentLengthMin)
   {
      var spacingX          = 1.62 * armSegmentLength;
      var spacingY          = 2 * spacingX;
      var nSwastikaLines    = 2 * Math.round(_canvasHeight / (armSegmentLength * 3));
      var nSwastikasPerLine = 2 * Math.round(_canvasWidth  / (armSegmentLength * 3));

      _drawGrid(spacingX / 2, spacingY / 2, 1);

      for (var i = -Math.round(nSwastikaLines / 2); i < nSwastikaLines / 2; ++i)
      {
         _drawLineOfSwastiklovers
         (
            {
               armSegmentLength   : armSegmentLength   ,
               armSegmentLengthMin: armSegmentLengthMin,
               nSwastikasPerLine  : nSwastikasPerLine  ,
               offsetX            : spacingX * i       ,
               offsetY            : spacingY * i       ,
               spacingX           :  spacingX          ,
               spacingY           : -spacingY
            }
         );
      }
   }

   /*
    *
    */
   function _sketchTileScheme2(armSegmentLength, armSegmentLengthMin)
   {
      var spacingY          = 1.82 * armSegmentLength;
      var spacingX          = 2 * spacingY;
      var nSwastikaLines    = 4 * Math.round(_canvasHeight / spacingX);
      var nSwastikasPerLine = 4 * Math.round(_canvasWidth  / spacingY);

      _drawGrid(spacingX / 2, spacingY / 2, 2);

      for (var i = -Math.round(nSwastikaLines / 2); i < nSwastikaLines / 2; ++i)
      {
         _drawLineOfSwastiklovers
         (
            {
               armSegmentLength   : armSegmentLength   ,
               armSegmentLengthMin: armSegmentLengthMin,
               nSwastikasPerLine  : nSwastikasPerLine  ,
               offsetX            : spacingX * i       ,
               offsetY            : spacingY * i       ,
               spacingX           :  spacingX          ,
               spacingY           : -spacingY
            }
         );
      }

      for (var i = -Math.round(nSwastikaLines / 2); i < nSwastikaLines / 2; ++i)
      {
         _drawLineOfSwastiklovers
         (
            {
               armSegmentLength   : armSegmentLength / 2          ,
               armSegmentLengthMin: armSegmentLengthMin           ,
               nSwastikasPerLine  : nSwastikasPerLine             ,
               offsetX            : spacingX * i + 0.75 * spacingX,
               offsetY            : spacingY * i - 0.25 * spacingX,
               spacingX           :  spacingX                     ,
               spacingY           : -spacingY
            }
         );
      }
   }

   /*
    *
    */
   function _drawLineOfSwastiklovers(o)
   {
      UTILS.validator.checkObject
      (
         o,
         {
            armSegmentLength   : 'float'      ,
            armSegmentLengthMin: 'float'      ,
            offsetX            : 'float'      ,
            offsetY            : 'float'      ,
            nSwastikasPerLine  : 'positiveInt',
            spacingX           : 'float'      ,
            spacingY           : 'float'
         }
      );

      var startI   = -Math.round(o.nSwastikasPerLine / 2);
      var finishI  =  Math.round(o.nSwastikasPerLine / 2);
      var maxDrawX = _midX + 2 * o.armSegmentLength;
      var maxDrawY = _midY + 2 * o.armSegmentLength;;
      var minDrawX = -maxDrawX;
      var minDrawY = -maxDrawY;

      for (var i = startI; i < finishI; ++i)
      {
         var x = i * o.spacingY + o.offsetX;
         var y = i * o.spacingX + o.offsetY;

         if (x < minDrawX || x > maxDrawX || y < minDrawY || y > maxDrawY)
         {
            continue;
         }

         _sketcher.sketch
         (
            {
               x                  : x                    ,
               y                  : y                    ,
               armSegmentLength   : o.armSegmentLength   ,
               armSegmentLengthMin: o.armSegmentLengthMin,
               delayMs            : 0
            }
         );
      }
   }

   /*
    *
    */
   function _drawGrid(spacingX, spacingY, tilingSchemeNumber)
   {
      _ctx.beginPath();

      switch (tilingSchemeNumber)
      {
       case 1: var factorHoriz = -0.5; var factorVert = 2.0; break;
       case 2: var factorHoriz = -2.0; var factorVert = 0.5; break;
       default: throw 'Invalid tile scheme number "' + o.tileSchemeNumber + '".';
      }

      // Horizonalish lines.
      var nLines = 3 * Math.round(Math.max(_canvasWidth / spacingX, _canvasHeight / spacingY));
      for (var i = -Math.round(nLines / 2); i < nLines; ++i)
      {
         var c = spacingX * i;
         _ctx.moveTo(-_midX, factorHoriz * -_midX + c);
         _ctx.lineTo( _midX, factorHoriz *  _midX + c);
      }

      // Verticalish lines.
      var nLines = 3 * Math.round(Math.max(_canvasWidth / spacingX, _canvasHeight / spacingY));
      for (i = -Math.round(nLines / 2); i < nLines; ++i)
      {
         var c = spacingY * i;
         _ctx.moveTo(-_midX, factorVert * -_midX + c);
         _ctx.lineTo( _midX, factorVert *  _midX + c);
      }

      var oldStrokeStyle = _ctx.strokeStyle;
      _ctx.strokeStyle   = '#ccc';
      _ctx.stroke();
      _ctx.strokeStyle = oldStrokeStyle;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvasHeight = $(canvas).height();
   var _canvasWidth  = $(canvas).width();
   var _ctx          = canvas.getContext('2d');
   var _midX         = Math.round(_canvasWidth  / 2);
   var _midY         = Math.round(_canvasHeight / 2);
   var _sketcher     = new SketcherSwastiklover(_ctx);
}

/*******************************************END*OF*FILE********************************************/
