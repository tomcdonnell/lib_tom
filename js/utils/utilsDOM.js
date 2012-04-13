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
 * TODO: Check whether this function is used anywhere.  If not, remove it.
 */
UTILS.DOM.fillSelector = function (selector, options, instructionText)
{
   var f = 'UTILS.DOM.fillSelector()';
   UTILS.checkArgs(f, arguments, [HTMLSelectElement, Array, 'nullOrString']);

   var selectorJq = $(selector);
   selectorJq.html('');

   if (instructionText !== null)
   {
      selectorJq.append(OPTION({value: '-1'}, instructionText));
   }

   for (var i = 0, len = options.length; i < len; ++i)
   {
      var option = options[i];
      selectorJq.append(OPTION({value: option.id}, option.text));
   }
};

/*******************************************END*OF*FILE********************************************/
