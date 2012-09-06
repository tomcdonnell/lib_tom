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
function TessellatorSwastiklover(canvas)
{
   var f = 'TessellatorSwastiklover()';
   UTILS.checkArgs(f, arguments, ['HTMLCanvasElement']);

   /*
    *
    */
   this.sketch = function (swastikloverConfig, tessellationNo, userOnCompleteFunction)
   {
      var f = 'TessellatorSwastiklover.sketch()';
      UTILS.checkArgs(f, arguments, ['object', 'positiveInt', 'nullOrFunction']);

      _userOnCompleteFunction = userOnCompleteFunction;

      switch (tessellationNo)
      {
       case 1:
         var spacingX = Math.ceil(swastikloverConfig.armSegmentLength * 1.62);
         //_sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 2));
         _tessellator.drawSquareTessellation
         (
            {
               sketchFunction    : sketcherSwastiklover.sketch,
               spacingX          : spacingX                   ,
               spacingY          : spacingX * 2               ,
               startX            : 0                          ,
               startY            : 0                          ,
               onCompleteFunction: _onCompleteTessellation    ,
               sketchFunctionArgumentObjectsByRecursionDepth:
               (
                  sketcherSwastiklover.getSketchFunctionArgumentSetsByRecursionDepth
                  (
                     swastikloverConfig
                  )
               )
            }
         );
         break;

       case 2:
         var spacingX = Math.ceil(swastikloverConfig.armSegmentLength * 3.62);
         _sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 4));
         _tessellator.drawSquareTessellation
         (
            {
               sketchFunction: sketcherSwastiklover.sketch,
               spacingX      : spacingX                   ,
               spacingY      : spacingX * 0.5             ,
               startX        : 0                          ,
               startY        : 0                          ,
               sketchFunctionArgumentObjectsByRecursionDepth:
               (
                  sketcherSwastiklover.getSketchFunctionArgumentSetsByRecursionDepth
                  (
                     swastikloverConfig
                  )
               )
            }
         );
         swastikloverConfig.armSegmentLength = Math.floor(swastikloverConfig.armSegmentLength / 2);
         _tessellator.drawSquareTessellation
         (
            {
               sketchFunction    : sketcherSwastiklover.sketch,
               spacingX          : spacingX                   ,
               spacingY          : spacingX * 0.5             ,
               startX            : spacingX * 0.25            ,
               startY            : spacingX * 0.75            ,
               onCompleteFunction: _onCompleteTessellation    ,
               sketchFunctionArgumentObjectsByRecursionDepth:
               (
                  sketcherSwastiklover.getSketchFunctionArgumentSetsByRecursionDepth
                  (
                     swastikloverConfig
                  )
               )
            }
         );
         break;

       default:
         throw 'Invalid tessellation number "' + tessellationNo + '".';
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _onCompleteTessellation()
   {
      var f = 'TessellatorSwastiklover._onCompleteTessellation()';
      UTILS.checkArgs(f, arguments, []);

      if (_userOnCompleteFunction !== null)
      {
         _userOnCompleteFunction();
      }
   };

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _ctx                  = canvas.getContext('2d');
   var _midX                 = $(canvas).width()  / 2;
   var _midY                 = $(canvas).height() / 2;
   var _sketcherGrid         = new SketcherGrid(canvas);
   var _sketcherSwastiklover = new SketcherSwastiklover(_ctx);
   var _tessellator          = new Tessellator(canvas);
}

/*******************************************END*OF*FILE********************************************/
