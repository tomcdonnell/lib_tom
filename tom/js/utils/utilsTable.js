/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "utilsTable.js"
*
* Project: GUI elements.
*
* Purpose: Utilities used in files in the /result/ directory.
*
* Author: Tom McDonnell 2008-05-18.
*
\**************************************************************************************************/

// Namespace 'UTILS' variables. ////////////////////////////////////////////////////////////////////

/**
 * Namespace for utilities pertaining to HTML TABLE elements.
 */
UTILS.table = {};

// Namespace 'UTILS.table' functions. //////////////////////////////////////////////////////////////

/*
 * Build an HTML table cell element (TR or TD) containing text nodes separated by BR elements.
 * The BR elements are spliced into the string wherever '|' characters are found.
 *
 * Eg. Given:
 *        arguments = ['h', 'Three|line|string', {class: 'heading'}],
 *     Returns
 *        TH({class: 'heading'}, 'Three', BR(), 'line', BR(), 'string')
 *
 * @param hORd {String}
 *    'h' or 'd'.  Determines whether a TD or TH element is returned.
 *
 * @param str {String}
 *    The string to splice.  See example above.
 *
 * @param attributes {Object}
 *    Attributes object for the TH or TD element to be returned.
 */
UTILS.table.buildTCellWithBRs = function (hORd, str, attributes)
{
   var f = 'UTILS.table.buildTCellWithBRs()';
   UTILS.checkArgs(f, arguments, [String, String, Object]);

   var cell;

   switch (hORd)
   {
    case 'h': cell = TH(attributes); break;
    case 'd': cell = TD(attributes); break;
    default: throw new Exception(f, "Expected 'h' or 'd'.  Received '" + hORd + "'.", '');
   }

   var lines = str.split('|');

   for (var i = 0, len = lines.length; i < len; ++i)
   {
      cell.appendChild(document.createTextNode(lines[i]));

      if (i + 1 < len)
      {
         cell.appendChild(BR());
      }
   }

   return cell;
}

/*******************************************END*OF*FILE********************************************/
