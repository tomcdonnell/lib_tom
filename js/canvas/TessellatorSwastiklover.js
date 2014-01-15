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
   this.sketch = function (swastikloverConfig, tessellationNo, userOnCompleteFunction, delayMs)
   {
      var f = 'TessellatorSwastiklover.sketch()';
      UTILS.checkArgs(f, arguments, ['object', 'positiveInt', 'nullOrFunction', 'nonNegativeInt']);

      _userOnCompleteFunction = userOnCompleteFunction;

      switch (tessellationNo)
      {
       case 1: _sketchTessellationNumberOne(swastikloverConfig, delayMs); break;
       case 2: _sketchTessellationNumberTwo(swastikloverConfig, delayMs); break;
       default: throw 'Invalid tessellation number "' + tessellationNo + '".';
      }
   };

   /*
    *
    */
   this.stopAnimation = function ()
   {
      var f = 'TessellatorSwastiklover.sketch()';
      UTILS.checkArgs(f, arguments, []);

      _tessellator.stopAnimation();

      if (_tessellatorSpare !== null)
      {
         _tessellatorSpare.stopAnimation();
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _sketchTessellationNumberOne(swastikloverConfig, delayMs)
   {
      var f = 'TessellatorSwastiklover._sketchTessellationNumberOne()';
      UTILS.checkArgs(f, arguments, ['object', 'nonNegativeInt']);

      var spacingX = Math.ceil(swastikloverConfig.armSegmentLength * 1.62);

      _sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 2));

      _tessellator.drawSquareTessellation
      (
         {
            delayMs           : delayMs                             ,
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
   }

   /*
    *
    */
   function _sketchTessellationNumberTwo(swastikloverConfig, delayMs)
   {
      var f = 'TessellatorSwastiklover._sketchTessellationNumberTwo()';
      UTILS.checkArgs(f, arguments, ['object', 'nonNegativeInt']);

      var spacingX = Math.ceil(swastikloverConfig.armSegmentLength * 3.62);

      _sketcherGrid.drawSquareGrid(0.5, Math.ceil(spacingX / 4));

      _tessellator.drawSquareTessellation
      (
         {
            delayMs       : delayMs                             ,
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

      // Begin sketching the smaller swastiklover when the
      // larger swastiklover has sketched one iteration.
      setTimeout
      (
         function ()
         {
            swastikloverConfig.armSegmentLength = Math.floor
            (
               swastikloverConfig.armSegmentLength / 2
            );

            if (_tessellatorSpare === null)
            {
               _tessellatorSpare = new Tessellator(canvas);
            }

            _tessellatorSpare.drawSquareTessellation
            (
               {
                  delayMs           : delayMs                             ,
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
         },
         delayMs
      );
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
   var _tessellator          = new Tessellator(canvas);
   var _tessellatorSpare     = null;
}

/*******************************************END*OF*FILE********************************************/
