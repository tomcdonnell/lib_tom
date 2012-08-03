/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename:: "TessellatorSwastiklover.js"
*
* Project: Canvas tessellators.
*
* Purpose: Draw a fractal mosaic based on a swastika.
*
* Author: Tom McDonnell 2012-04-03.
*
\**************************************************************************************************/

/*
 *
 */
function TessellatorSwastiklover(o)
{
   UTILS.validator.checkObject
   (
      o,
      {
         canvas            : HTMLCanvasElement,
         swastikloverConfig: 'object'
      }
   );

   /*
    *
    */
   this.sketch = function (tessellationNo)
   {
      _ctx.translate(_midX, _midY);
      _ctx.scale(1, -1);

      var sConfig = o.swastikloverConfig;

      switch (tessellationNo)
      {
       case 1 :
         var spacingX = Math.ceil(sConfig.armSegmentLength * 1.62);
         _sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 2));
         _tessellator.drawSquareTessalationRecursively
         (
            0, 0, spacingX, spacingX * 2, _sketcherSwastiklover.sketch, sConfig
         );
         break;

       case 2 :
         var spacingX = Math.ceil(sConfig.armSegmentLength * 3.62);
         _sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 4));
         _tessellator.drawSquareTessalationRecursively
         (
            0, 0, spacingX, spacingX * 0.5, _sketcherSwastiklover.sketch, sConfig
         );
         sConfig.armSegmentLength = Math.floor(sConfig.armSegmentLength / 2);
         _tessellator.drawSquareTessalationRecursively
         (
            spacingX * 0.25             , spacingX * 0.75,
            spacingX                    , spacingX * 0.5 ,
            _sketcherSwastiklover.sketch, sConfig
         );
         break;

       default:
         throw 'Invalid tessellation number "' + tessellationNo + '".';
      }

      _ctx.scale(1, -1);
      _ctx.translate(-_midX, -_midY);
   };

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _ctx                  = o.canvas.getContext('2d');
   var _midX                 = $(o.canvas).width()  / 2;
   var _midY                 = $(o.canvas).height() / 2;
   var _sketcherGrid         = new SketcherGrid(o.canvas);
   var _sketcherSwastiklover = new SketcherSwastiklover(_ctx, o.swastikloverConfig);
   var _tessellator          = new Tessellator(o.canvas);
}

/*******************************************END*OF*FILE********************************************/
