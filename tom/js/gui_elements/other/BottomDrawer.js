/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "BottomDrawer.js"
*
* Purpose: Definition of the BottomDrawer object.
*
* Project: GUI elements.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

function BottomDrawer()
{
   // Priviliged Functions. /////////////////////////////////////////////////////////////////////

   /**
    * Initialise the drawer.
    */
   this.init = function ()
   {
      console.info('BottomDrawer: Initialising.');

      // Set positions (top, right, bottom, left).
      UTILS.DOM.setPosition(drawerHeading, 'auto', 'auto', '0px', '0px');
      UTILS.DOM.setPosition(drawerContent, 'auto', 'auto', '0px', '0px');

      // Set dimensions (height, width).
      UTILS.DOM.setDimensions(drawerHeading, DRAWER_HEADING_HEIGHT + 'px', 'auto');
      UTILS.DOM.setDimensions(drawerContent, '0px', DRAWER_CONTENT_WIDTH  + 'px' );

      // Add event listener to drawer heading.
      drawerHeading.addEventListener('mousedown', onMouseDown, false);

      // Add event listeners to window.
      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('mouseup'  , onMouseUp  , false);
   };

   // Private Functions. ////////////////////////////////////////////////////////////////////////

   // Event handlers. -------------------------------------------------------------------------//

   /*
    *
    */
   function onMouseDown(e)
   {
      try
      {
         var f = 'BottomDrawer.onMouseDown()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         // Remember the mouse pointer Y coordinate.
         dragY = e.clientY;

         // Get the height of the drawer above and below the mouse pointer.
         var dhB = UTILS.DOM.removePXsuffix(drawerHeading.style.bottom);
         var b   = window.innerHeight - dhB - dragY;
         var t   = DRAWER_HEADING_HEIGHT - b;

         // Set the maximum and minimum Y coordinate for dragging.
         minDragY = TITLE_BAR_HEIGHT + t;
         maxDragY = window.innerHeight - b;

         // Set the ghost div position and dimensions to equal those of the drawer content div.
         UTILS.DOM.copyPositionAndDimensions(drawerContent, ghost);

         // Hide the drawer content and display the ghost.
         drawerContent.style.display = 'none';
         ghost.style.display         = 'block';

         // Note that the drawer is now being dragged.
         isBeingDragged = true;
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onMouseMove(e)
   {
      try
      {
         var f = 'BottomDrawer.onMouseMove()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         if (isBeingDragged)
         {
            newDragY = e.clientY;
            if (newDragY < minDragY) newDragY = minDragY;
            if (newDragY > maxDragY) newDragY = maxDragY;

            var dY = newDragY - dragY;

            moveGhost(dY);

            dragY = newDragY;
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
   function onMouseUp(e)
   {
      try
      {
         var f = 'BottomDrawer.onMouseUp()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         // Calculate the amount to move the drawer.
         var dhB = UTILS.DOM.removePXsuffix(drawerHeading.style.bottom);
         var dcH = UTILS.DOM.removePXsuffix(drawerContent.style.height);
         var dY  = dhB - dcH;

         // Hide the ghost and display the drawer content.
         ghost.style.display         = 'none';
         drawerContent.style.display = 'block';

         // Move the drawer.
         moveDrawer(dY);

         // Note that the drawer is no longer being dragged.
         isBeingDragged = false;
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Other functions. ------------------------------------------------------------------------//

   /*
    *
    */
   function moveGhost(dY)
   {
      // Update the drawer heading bottom property.
      var dhB = UTILS.DOM.removePXsuffix(drawerHeading.style.bottom);
      drawerHeading.style.bottom = dhB - dY + 'px';

      // Update the ghost height property.
      var ghostH = UTILS.DOM.removePXsuffix(ghost.style.height);
      ghost.style.height = ghostH - dY + 'px';
   }

   /*
    *
    */
   function moveDrawer(dY)
   {
      // Update the drawer content height property.
      var dcH = UTILS.DOM.removePXsuffix(drawerContent.style.height);
      drawerContent.style.height = dcH + dY + 'px';
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var isBeingDragged = false;

   var dragY;

   var minDragY;
   var maxDragY;

   var drawerHeading = document.getElementById('bottomDrawers').firstChild.firstChild;
   var drawerContent = document.getElementById('bottomDrawers').lastChild.firstChild.firstChild;

   var ghost = document.getElementById('drawerGhost');

   // Private constants. ////////////////////////////////////////////////////////////////////////

   const TITLE_BAR_HEIGHT =
     UTILS.DOM.getDimensionInPixels(document.getElementById('titleBar'), 'height');

   const DRAWER_HEADING_HEIGHT = UTILS.DOM.getDimensionInPixels(drawerHeading, 'height');
   const DRAWER_CONTENT_WIDTH  = UTILS.DOM.getDimensionInPixels(drawerContent, 'width' );

   // Inititialisation code. ////////////////////////////////////////////////////////////////////

   this.init();
}

/*******************************************END*OF*FILE********************************************/
