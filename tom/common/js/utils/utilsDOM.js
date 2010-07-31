/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "utils_DOM.js"
*
* Project: Utilities.
*
* Purpose: General purpose DOM (Document Object Model) utilities.
*
* @author: Tom McDonnell 2007.
*
\**************************************************************************************************/

// Namespace 'UTILS' variables. ////////////////////////////////////////////////////////////////////

/**
 * Namespace for DOM utilities.
 */
UTILS.DOM = {};

// Namespace 'UTILS.DOM' functions. ////////////////////////////////////////////////////////////////

/**
 * Get a style property from a DOM element using the W3C recommended method.
 * This method is slow but returns the correct result in all cases.
 *
 * @param element  {}       The DOM element.
 * @param property {String} The property.
 *
 * @return {String} The requested style property.
 */
UTILS.DOM.getStyleProperty = function (element, cssPropertyNS)
{
   var f = 'UTILS.DOM.getStyleProperty()';
   UTILS.checkArgs(f, arguments, ['Defined', String]);

   // If browser is NS6+...
   if (window.getComputedStyle)
   {
      return window.getComputedStyle(element, '').getPropertyValue(cssPropertyNS);
   }

   // If browser is IE5+...
   if (element.currentStyle)
   {
      // For some style properties,
      // IE uses different names than NS.
      var cssPropertyIE;
      switch (cssPropertyNS)
      {
       //case '': 
       default: cssPropertyIE = cssPropertyNS;
      }

      return element.currentStyle[cssPropertyIE];
   }

   return null;
};

/*
 *
 */
UTILS.DOM.getStylePropertyInPixels = function (element, cssPropertyNS)
{
   var sp = UTILS.DOM.getStyleProperty(element, cssPropertyNS);

   return Number(sp.substring(0, sp.length - 2));
}

/*
 * @param sp {String}
 *   Style property with 'px' suffix.
 */
UTILS.DOM.removePxSuffix = function (sp)
{
   return Number(sp.substring(0, sp.length - 2));
}

/*
 *
 */
UTILS.DOM.countPreviousSiblings = function (element)
{
   var f = 'UTILS.DOM.countPreviousSiblings()';
   UTILS.checkArgs(f, arguments, ['Defined']);
   UTILS.assert(f, 0, element.parentNode !== null);

   var n = 0;
   while (element.previousSibling !== null)
   {
      element = element.previousSibling;
      ++n;
   }

   return n;
}

/**
 * Replace a DOM element with another element.
 *
 * @param dstElem {} The destination element.
 * @param srcElem {} The source element.
 */
UTILS.DOM.replaceElement = function (dstElem, srcElem)
{
   var f = 'UTILS.DOM.replaceElement()';
   UTILS.checkArgs(f, arguments, ['Defined', 'Defined']);

   var parent = dstElem.parentNode;
   UTILS.assert(f, 0, parent instanceof Object);

   parent.replaceChild(srcElem, dstElem);
};

/**
 * Replace a DOM element with another element.
 *
 * @param dstElem {} The destination element.
 * @param srcElem {} The source element.
 */
UTILS.DOM.swapElements = function (elem1, elem2)
{
   var f = 'UTILS.DOM.swapElement()';
   UTILS.checkArgs(f, arguments, ['Defined', 'Defined']);

   var parent1 = elem1.parentNode;
   var parent2 = elem2.parentNode;
   UTILS.assert(f, 0, parent1 instanceof Object);
   UTILS.assert(f, 1, parent2 instanceof Object);

   var elem1Clone = elem1.cloneNode(true);
   var elem2Clone = elem2.cloneNode(true);

   parent1.replaceChild(elem2Clone, elem1);
   parent2.replaceChild(elem1Clone, elem2);
};

/**
 * Remove a DOM element.
 *
 * @param e {} The DOM element.
 *
 * @return The DOM element removed.
 */
UTILS.DOM.removeElement = function (e)
{
   var f = 'UTILS.DOM.removeElement()';
   UTILS.checkArgs(f, arguments, ['Defined']);

   var parent = e.parentNode;
   UTILS.assert(f, parent instanceof Object);

   return parentNode.removeChild(e);
};

/**
 * Set all the position properties of a DOM element.
 * This function is useful when dealing with absolute
 * positioning and direct access of style properties.
 *
 * @param e {      } The DOM element.
 * @param t {String} Top.
 * @param r {String} Right.
 * @param b {String} Bottom.
 * @param l {String} Left.
 */
UTILS.DOM.setPosition = function (e, t, r, b, l)
{
   var f = 'UTILS.DOM.setPosition()';
   UTILS.checkArgs(f, arguments, ['Defined', String, String, String, String]);

   e.style.top    = t;
   e.style.right  = r;
   e.style.bottom = b;
   e.style.left   = l;
};

/**
 * Set the height and width properties of a DOM element.
 * This function is useful when dealing with absolute
 * positioning and direct access of style properties.
 *
 * @param e {      } The DOM element.
 * @param t {String} Height.
 * @param r {String} Width.
 */
UTILS.DOM.setDimensions = function (e, h, w)
{
   var f = 'UTILS.DOM.setDimension()';
   UTILS.checkArgs(f, arguments, ['Defined', String, String]);

   e.style.height = h;
   e.style.width  = w;
};

/**
 *
 *
 */
UTILS.DOM.copyPositionAndDimensions = function (eSrc, eDest)
{
   var f = 'UTILS.DOM.copyPositionAndDimensions()';
   UTILS.checkArgs(f, arguments, ['Defined', 'Defined']);

   // Copy position properties.
   eDest.style.top    = eSrc.style.top;
   eDest.style.right  = eSrc.style.right;
   eDest.style.bottom = eSrc.style.bottom;
   eDest.style.left   = eSrc.style.left;

   // Copy dimension properties.
   eDest.style.height = eSrc.style.height;
   eDest.style.width  = eSrc.style.width;
};

/**
 * TO DO: Finish this function.
 *        Need to be able to identify text nodes.
 *        See "Pro Javascript techniques".
 *
 * Remove all text node descendents of the element given that contain only whitespace.
 *
 * @param e {} The DOM element.
 *
 * @return The DOM element removed.
 *
UTILS.DOM.removeDescendentWhitespaceNodes = function (e)
{
   var f = 'UTILS.DOM.removeDescendentWhitespaceNodes()';
   UTILS.checkArgs(f, arguments, ['Defined']);

   var childNodes = e.childNodes;
   UTILS.assert(f, childNodes instanceof Array);

   // For each child node...
   var child;
   for (var i = 0; i < childNodes.length; ++i)
   {
      child = childNodes[i];

      // If the child node is a text node...
      if ()
      {
         // If the text node contains only whitespace...
         if ()
           // Remove the text node.
           e.removeChild(child);
      }
      else
        // Remove all descendent whitespace nodes recursively.
        UTILS.DOM.removeDescendentWhitespaceNodes(child);
   }
};
 */

/*
 *
 */
UTILS.DOM.fillSelector = function (selector, options, instruction)
{
   var f = 'UTILS.DOM.fillSelector()';
   UTILS.assert(f, 0, selector.constructor == HTMLSelectElement                );
   UTILS.assert(f, 1, options.constructor  == Array                            );
   UTILS.assert(f, 2, instruction === null || instruction.constructor == String);

   selector.innerHTML = '';

   if (instruction !== null)
   {
      selector.appendChild(OPTION({value: ''}, instruction));
   }

   for (var i = 0, len = options.length; i < len; ++i)
   {
      selector.appendChild(OPTION({value: options[i].id}, options[i].name));
   }
}

/*
 *
 */
UTILS.DOM.selectOptionWithValue = function (selector, value)
{
   var f = 'UTILS.DOM.selectOptionWithValue()';
   UTILS.checkArgs(f, arguments, [HTMLSelectElement, String]);

   var options = selector.options;

   for (var i = 0, len = options.length; i < len; ++i)
   {
      if (options[i].value == value)
      {
         selector.selectedIndex = i;
         return;
      }
   }

   throw new Exception(f, "No option with value '" + value + "' found.", '');
};

/*
 * By Peter-Paul Koch & Alex Tingle.
 */
UTILS.DOM.getAbsoluteOffsetLeft = function (element)
{
   var f = 'UTILS.DOM.getAbsoluteOffsetLeft()';
   UTILS.checkArgs(f, arguments, ['Defined']);

   var curleft = 0;

   if (element.offsetParent)
   {
      while (true)
      {
         curleft += element.offsetLeft;

         if (!element.offsetParent)
         {
            break;
         }

         element = element.offsetParent;
      }
   }
   else
   {
      if (element.x)
      {
         curleft += element.x;
      }
   }

   return curleft;
};

/*
 * By Peter-Paul Koch & Alex Tingle.
 */
UTILS.DOM.getAbsoluteOffsetTop = function (element)
{
   var f = 'UTILS.DOM.getAbsoluteOffsetTop()';
   UTILS.checkArgs(f, arguments, ['Defined']);

   var curtop = 0;

   if (element.offsetParent)
   {
      while (true)
      {
         curtop += element.offsetTop;

         if (!element.offsetParent)
         {
            break;
         }

         element = element.offsetParent;
      }
   }
   else
   {
      if (element.y)
      {
         curtop += element.y;
      }
   }

   return curtop;
};

/*******************************************END*OF*FILE********************************************/
