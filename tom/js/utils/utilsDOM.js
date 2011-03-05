/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "utilsDOM.js"
*
* Project: Utilities.
*
* Purpose: Utilities concerning the Document Object Model (DOM).
*
* Dependencies: jQuery.
*
* Author: Tom McDonnell 2010-07-30.
*
\**************************************************************************************************/

// Namespace 'UTILS' variables. ////////////////////////////////////////////////////////////////////

/**
 * Namespace for DOM utilities.
 */
UTILS.DOM = {};

// Namespace 'UTILS.array' functions. //////////////////////////////////////////////////////////////

/*
 * @param separator HTML DOM element.
 * @param elements  Array of HTML DOM elements.
 * @param container HTML DOM element.
 *
 * @return container with elements separated by clones of separator appended.
 */
UTILS.DOM.implode = function (separator, elements, container, boolWithDataAndEvents)
{
   var f = 'UTILS.DOM.implode()';
   UTILS.checkArgs(f, arguments, ['Defined', Array, 'Defined', Boolean]);

   for (var i = 0; i < elements.length - 1; ++i)
   {
      $(container).append(elements[i]);
      $(container).append($(separator).clone(boolWithDataAndEvents));
   }

   $(container).append(elements[elements.length - 1]);

   return container;
};

/*
 * DEPRECATED
 * ----------
 * There is an equivalent jQuery function.
 * Use $(parentHtmlElement).index(htmlElement) instead.
 */
UTILS.DOM.countPreviousSiblings = function (htmlElement)
{
   var f = 'UTILS.DOM.countPreviousSiblings()';
   UTILS.checkArgs(f, arguments, ['Defined']);

   var n = -1;

   // Enclose in array so jQuery functions may be used.
   htmlElements = [htmlElement];

   while (htmlElements.length > 0)
   {
      htmlElements = $(htmlElements[0]).prev();
      ++n;
   }

   return n;
};

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

/*******************************************END*OF*FILE********************************************/
