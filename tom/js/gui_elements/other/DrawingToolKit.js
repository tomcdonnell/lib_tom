/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "DrawingToolKit.js"
*
* Project: GUI Elements.
*
* Purpose: GUI for drawing tools for use with DOM canvas elements.
*
* Author: Tom McDonnell 2008-09-24.
*
\**************************************************************************************************/

// Class Definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function DrawingToolKit()
{
   var f = 'DrawingToolKit()';
   UTILS.checkArgs(f, arguments, []);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getTable  = function () {return domElements.tables.tools;};
   this.getInputs = function () {return inputs                  ;};

   /*
    *
    */
   this.getCanvasAsImgElement = function ()
   {
      var f = 'DrawingToolKit.getCanvasAsImgElement()';
      UTILS.checkArgs(f, arguments, []);

      var imgElement = Canvas2Image.saveAsPNG(canvas, true);

      return imgElement;
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setCanvasElement = function (c, onModifyFunct)
   {
      var f = 'DrawingToolKit.setCanvasElement()';
      UTILS.assert(f, 0, arguments.length == 1 || arguments.length == 2);
      UTILS.assert(f, 1, c.constructor == HTMLCanvasElement);
      var onModifyFunction = ((arguments.length == 2)? onModifyFunct: function () {});
      UTILS.assert(f, 2, onModifyFunction.constructor == Function);

      canvas                       = c;
      userCallbacks.onModifyCanvas = onModifyFunction;

      $(canvas       ).mousedown(onMouseDownCanvas);
      $(document.body).mouseup(onMouseUp);
      $(canvas       ).mousemove(onMouseMoveCanvas);

      var selectors = inputs.selectors;

      ctx             = canvas.getContext('2d');
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.lineWidth   = selectors.penWidth.options[selectors.penWidth.selectedIndex].value;
      ctx.strokeStyle = selectors.color.options[selectors.color.selectedIndex].value;
      canvasWrapper   = new CanvasWrapper(canvas);

      canvasWrapper.setOffsets();
   };

   /*
    * Undo what was done in this.setCanvasElement().
    */
   this.clearCanvasElement = function ()
   {
      var f = 'DrawingToolKit.clearCanvasElement()';
      UTILS.checkArgs(f, arguments, []);

      if (canvas !== null)
      {
         $(canvas       ).unbind('mousedown', onMouseDownCanvas);
         $(document.body).unbind('mouseup'  , onMouseUp        );
         $(canvas       ).unbind('mousemove', onMouseMoveCanvas);
      }
   };

   /*
    *
    */
   this.setOnClickSubmitFunction = function (funct)
   {
      var f = 'DrawingToolKit.setOnClickSubmitFunction()';
      UTILS.checkArgs(f, arguments, [Function]);

      userCallbacks.onClickSubmit = funct;
   };

   // Simple boolean functions. ---------------------------------------------------------------//

   /*
    *
    */
   this.isHidden = function ()
   {
      var f = 'DrawingToolKit.isHidden()';
      UTILS.checkArgs(f, arguments, []);

      return ($(domElements.tables.tools).css('display') == 'none');
   }

   // Other priviliged functions. -------------------------------------------------------------//

   /*
    *
    */
   this.simulateMouseDownCanvasEvent = function (e)
   {
      var f = 'DrawingToolKit.simulateMouseDownCanvasEvent()';
      UTILS.checkArgs(f, arguments, [Object]);

      onMouseDownCanvas(e);
   };

   /*
    *
    */
   this.showOrHide = function (showORhide)
   {
      var f = 'DrawingToolKit.showOrHide()';
      UTILS.checkArgs(f, arguments, [String]);

      var style = domElements.tables.tools.style;

      switch (showORhide)
      {
       case 'show': style.display = 'block'; break;
       case 'hide': style.display = 'none' ; break;
       default:
         throw new Exception(f, "Expected 'show' or 'hide'.  Received '" + showORhide + "'.");
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onResizeWindow(e)
   {
      try
      {
         var f = 'DrawingToolKit.onResizeWindow()';
         UTILS.checkArgs(f, arguments, [Object]);

         if (canvasWrapper !== null)
         {
            canvasWrapper.setOffsets();
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Mouse events. ---------------------------------------------------------------------------//

   /*
    *
    */
   function onMouseDownCanvas(e)
   {
      try
      {
         var f = 'DrawingToolKit.onMouseDownCanvas()';
         UTILS.checkArgs(f, arguments, ['nullOrObject']);

         state.mouseIsHovering = false;

         if (mousePos === null)
         {
            initMousePos(e);
         }

         ctx.beginPath();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    * NOTE
    * ----
    * This function listens for all mouseup events, not just those from the canvas element.
    * Reason: If only listened to canvas mouseup events, then ending a line at the canvas border
    *         would be difficult and irritating.
    */
   function onMouseUp(e)
   {
      try
      {
         var f = 'DrawingToolKit.onMouseUp()';
         UTILS.checkArgs(f, arguments, [Object]);

         state.mouseIsHovering = true;
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onMouseMoveCanvas(e)
   {
      try
      {
         var f = 'DrawingToolKit.onMouseMoveCanvas()';
         UTILS.checkArgs(f, arguments, [Object]);

         switch (mousePos === null)
         {
          case true:
            initMousePos(e);
            break;
          case false:
            mousePos.setX(e.clientX);
            mousePos.setY(e.clientY);
            canvasWrapper.convertCoordinatesWindowToCanvas(mousePos);
            break;
         }

         if (state.mouseIsHovering)
         {
            return;
         }

         var x = mousePos.getX();
         var y = mousePos.getY();

         switch (state.selectedDrawingTool)
         {
          case 'freeform':
            ctx.lineTo(x, y);
            ctx.stroke();
            userCallbacks.onModifyCanvas(e);
            break;
          case 'line':
            break;
          case 'rectangle':
            break;
          case 'ellipse':
            break;
          case 'speechBubble':
            break;
          default:
            throw new Exception
            (
               f, "Unknown selected drawing tool '" + state.selectedDrawingTool + "'.", ''
            );
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Button events. --------------------------------------------------------------------------//

   /*
    *
    */
   function onClickSubmit(e)
   {
      try
      {
         var f = 'DrawingToolKit.onClickSubmit()';
         UTILS.checkArgs(f, arguments, [Object]);

         userCallbacks.onClickSubmit(e);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Selector events. ------------------------------------------------------------------------//

   /*
    *
    */
   function onChangeSelectorDrawingColor(e)
   {
      try
      {
         var f = 'DrawingToolKit.onChangeSelectorColor()';
         UTILS.checkArgs(f, arguments, [Object]);

         var selector    = inputs.selectors.color;
         ctx.strokeStyle = selector.options[selector.selectedIndex].value;
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onChangeSelectorDrawingTool(e)
   {
      try
      {
         var f = 'DrawingToolKit.onChangeSelectorDrawingTool()';
         UTILS.checkArgs(f, arguments, [Object]);

         // Remember the selected drawing tool rather than getting
         // the value as is done here after every mousemove event.
         var selector              = inputs.selectors.tool;
         state.selectedDrawingTool = selector.options[selector.selectedIndex].value;
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onChangeSelectorPenWidth(e)
   {
      try
      {
         var f = 'DrawingToolKit.onChangeSelectorPenWidth()';
         UTILS.checkArgs(f, arguments, [Object]);

         var selector      = inputs.selectors.penWidth;
         var selectedIndex = selector.selectedIndex;

         ctx.lineWidth = selector.options[selectedIndex].value;
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onChangeSelectorDrawingMode(e)
   {
      try
      {
         var f = 'DrawingToolKit.onChangeSelectorDrawingMode()';
         UTILS.checkArgs(f, arguments, [Object]);
         
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Other private functions. ----------------------------------------------------------------//

   /*
    *
    */
   function initMousePos(e)
   {
      var f = 'DrawingToolKit.initMousePos()';
      UTILS.checkArgs(f, arguments, [Object]);

      mousePos = new VectorRec2d(e.clientX, e.clientY);

      canvasWrapper.convertCoordinatesWindowToCanvas(mousePos);
   }

   /*
    *
    */
   function init()
   {
      var f = 'DrawingToolKit.init()';
      UTILS.checkArgs(f, arguments, []);

      var buttons   = inputs.buttons;
      var selectors = inputs.selectors;

      $(window).resize(onResizeWindow);

      // Add event listeners.
      $(buttons.submit    ).click(onClickSubmit);
      $(selectors.tool    ).change(onChangeSelectorDrawingTool );
      $(selectors.mode    ).change(onChangeSelectorDrawingMode );
      $(selectors.penWidth).change(onChangeSelectorPenWidth    );
      $(selectors.color   ).change(onChangeSelectorDrawingColor);

      // Set state variables.
      var selectorTool           = inputs.selectors.tool;
      var selectorColor          = inputs.selectors.color;
      state.selectedDrawingTool  = selectorTool.options[selectorTool.selectedIndex].value;
      state.selectedDrawingColor = selectorColor.options[selectorColor.selectedIndex].value;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   // DOM elements. ---------------------------------------------------------------------------//

   var inputs =
   {
      buttons:
      {
         submit: INPUT({'class': 'button', type: 'button', value: 'Submit'})
      },
      selectors:
      {
         color: SELECT
         (
            OPTION({value: '#000000'}, 'Black'),
            OPTION({value: '#ffffff'}, 'White')
         ),
         tool: SELECT
         (
            OPTION({value: 'freeform'    }, 'Freeform'     ),
            OPTION({value: 'straight'    , disabled: 'disabled'}, 'Line'         ),
            OPTION({value: 'rectangle'   , disabled: 'disabled'}, 'Rectangle'    ),
            OPTION({value: 'ellipse'     , disabled: 'disabled'}, 'Ellipse'      ),
            OPTION({value: 'speechBubble', disabled: 'disabled'}, 'Speech Bubble')
         ),
         penWidth: SELECT
         (
            OPTION({value:  1}, '1 pixel'  ),
            OPTION({value:  2}, '2 pixels' ),
            OPTION({value:  4}, '4 pixels' ),
            OPTION({value:  8}, '8 pixels' ),
            OPTION({value: 16}, '16 pixels'),
            OPTION({value: 32}, '32 pixels'),
            OPTION({value: 64}, '64 pixels')
         ),
         mode: SELECT
         (
            OPTION({value: 'final'                             }, 'Final'       ),
            OPTION({value: 'construction', disabled: 'disabled'}, 'Construction')
         )
      }
   };

   var domElements =
   {
      tables:
      {
         tools: TABLE
         (
            {'class': 'DrawingToolKit', style: 'display: none;'},
            TBODY
            (
               TR
               (
                  TH({style: 'width: 172px;'            }, 'Color'              ),
                  TH({style: 'width: 172px;'            }, 'Drawing Tool'       ),
                  TH({style: 'width: 172px;'            }, 'Pen Width'          ),
                  TH({style: 'width: 172px;'            }, 'Drawing Mode'       ),
                  TH({style: 'width: 102px;', rowspan: 2}, inputs.buttons.submit)
               ),
               TR
               (
                  TH(inputs.selectors.color   ),
                  TH(inputs.selectors.tool    ),
                  TH(inputs.selectors.penWidth),
                  TH(inputs.selectors.mode    )
               )
            )
         )
      }
   };

   // Other private variables. ----------------------------------------------------------------//

   var ctx           = null; // Reference to 2d drawing context of DOM canvas element.
   var canvas        = null;
   var canvasWrapper = null; // Wrapper for translation functions.
   var mousePos      = null;

   var state =
   {
      // True if the user is not currently drawing anything
      // (eg. a freeform line, a line, a rectangle, etc).
      mouseIsHovering: true,

      // This variable exists because getting the selected drawing tool
      // from the DOM selector is too slow to do on every mousemove event.
      selectedDrawingTool: null
   }

   var userCallbacks =
   {
      onClickSubmit : function () {},
      onModifyCanvas: function () {}
   }

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
