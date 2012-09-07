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
       case 1: _sketchTessellationNumberOne(swastikloverConfig); break;
       case 2: _sketchTessellationNumberTwo(swastikloverConfig); break;
       default: throw 'Invalid tessellation number "' + tessellationNo + '".';
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _sketchTessellationNumberOne(swastikloverConfig)
   {
      var f = 'TessellatorSwastiklover._sketchTessellationNumberOne()';
      UTILS.checkArgs(f, arguments, ['object']);

      var tessellator = new Tessellator(canvas);
      var spacingX    = Math.ceil(swastikloverConfig.armSegmentLength * 1.62);

      _sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 2));

      tessellator.drawSquareTessellation
      (
         {
            delayMs           : 500                                 ,
            sketchFunction    : _sketcherSwastiklover.sketchSwastika,
            spacingX          : spacingX                            ,
            spacingY          : spacingX * 2                        ,
            startX            : 0                                   ,
            startY            : 0                                   ,
            onCompleteFunction: _onCompleteTessellation             ,
            sketchFunctionArgumentObjectsByRecursionDepth:
            (
               _sketcherSwastiklover.getSketchFunctionArgumentObjectsByRecursionDepth
               (
                  swastikloverConfig
               )
            )
         }
      );

      delete(tessellator);
   }

   /*
    *
    */
   function _sketchTessellationNumberTwo(swastikloverConfig)
   {
      var f = 'TessellatorSwastiklover._sketchTessellationNumberTwo()';
      UTILS.checkArgs(f, arguments, ['object']);

      var tessellator1 = new Tessellator(canvas);
      var tessellator2 = new Tessellator(canvas);
      var spacingX     = Math.ceil(swastikloverConfig.armSegmentLength * 3.62);

      _sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 4));

      tessellator1.drawSquareTessellation
      (
         {
            delayMs       : 500                                 ,
            sketchFunction: _sketcherSwastiklover.sketchSwastika,
            spacingX      : spacingX                            ,
            spacingY      : spacingX * 0.5                      ,
            startX        : 0                                   ,
            startY        : 0                                   ,
            sketchFunctionArgumentObjectsByRecursionDepth:
            (
               _sketcherSwastiklover.getSketchFunctionArgumentObjectsByRecursionDepth
               (
                  swastikloverConfig
               )
            )
         }
      );

      swastikloverConfig.armSegmentLength = Math.floor(swastikloverConfig.armSegmentLength / 2);

      tessellator2.drawSquareTessellation
      (
         {
            delayMs           : 500                                 ,
            sketchFunction    : _sketcherSwastiklover.sketchSwastika,
            spacingX          : spacingX                            ,
            spacingY          : spacingX * 0.5                      ,
            startX            : spacingX * 0.25                     ,
            startY            : spacingX * 0.75                     ,
            onCompleteFunction: _onCompleteTessellation             ,
            sketchFunctionArgumentObjectsByRecursionDepth:
            (
               _sketcherSwastiklover.getSketchFunctionArgumentObjectsByRecursionDepth
               (
                  swastikloverConfig
               )
            )
         }
      );

      delete(tessellator1);
      delete(tessellator2);
   }

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

   var _sketcherGrid         = new SketcherGrid(canvas);
   var _sketcherSwastiklover = new SketcherSwastiklover(canvas.getContext('2d'));
}

/*******************************************END*OF*FILE********************************************/
