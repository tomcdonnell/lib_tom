/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "utils_selection_sort.js"
*
* Project: General.
*
* Purpose: A sorting routine for use with DOM node lists.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

// Global functions. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
UTILS.selectionSortNodeList = function (childNodes, ascORdsc, startIndex, finishIndex, compare)
{
   var f = 'UTILS.selectionSortNodeList()';
   UTILS.checkArgs(f, arguments, ['object', 'string', 'number', 'number', 'function']);
   UTILS.assert(f, 0, ascORdsc == 'asc' || ascORdsc == 'dsc');
   UTILS.assert(f, 1, startIndex >= 0);
   UTILS.assert(f, 2, finishIndex <= childNodes.length);

   function swapChildNodes(a, b)
   {
      var parent = a.parentNode;

      // Insert placeholder before a.
      // NOTE: Placeholder must be the same type as (a, b) or peculiar style problems may be caused.
      var placeholder = document.createElement(a.nodeName);
      parent.insertBefore(placeholder, a);

      // NOTE
      // ----
      // Suffix '1' appended to variable names below to avoid
      // strict warning on redefinition of function parameters.

      // Insert a before b.
      var a1 = parent.removeChild(a);
      parent.insertBefore(a1, b);

      // Insert b before placeholder.
      var b1 = parent.removeChild(b);
      parent.insertBefore(b1, placeholder);

      // Remove placeholder.
      parent.removeChild(placeholder);
   }

   // Selection sort.
   var maxIndex;
   for (var i = startIndex; i < finishIndex; ++i)
   {
      maxIndex = i;

      for (var j = i + 1; j < finishIndex; ++j)
      {
         if (compare(childNodes[j], childNodes[maxIndex]) > 0)
         {
            maxIndex = j;
         }
      }

      if (maxIndex != i)
      {
         swapChildNodes(childNodes[i], childNodes[maxIndex]);
      }
   }
}

/*******************************************END*OF*FILE********************************************/

