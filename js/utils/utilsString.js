/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "utilsString.js"
*
* Project: Utilities.
*
* Purpose: Utilities concerning strings.
*
* Author: Tom McDonnell 2008-06-16.
*
\**************************************************************************************************/

// Namespace 'UTILS' variables. ////////////////////////////////////////////////////////////////////

/**
 * Namespace for string functions.
 */
UTILS.string = {};

// Namespace 'UTILS.string' functions. /////////////////////////////////////////////////////////////

// Constants. ------------------------------------------------------------------------------------//

UTILS.string.CHAR_CODE_ALPHA_LOW  = String('A').charCodeAt(0);
UTILS.string.CHAR_CODE_ALPHA_HIGH = String('z').charCodeAt(0);

// General purpose functions. --------------------------------------------------------------------//

/*
 *
 */
UTILS.string.isAlpha = function (str)
{
   var f = 'UTILS.string.isAlpha()';
   UTILS.checkArgs(f, arguments, ['string']);

   var ccLow  = this.CHAR_CODE_ALPHA_LOW ;
   var ccHigh = this.CHAR_CODE_ALPHA_HIGH;

   for (var i = 0, len = str.length; i < len; ++i)
   {
      var charCode = str.charCodeAt(i);

      if (charCode < ccLow | charCode > ccHigh)
      {
         return false;
      }
   }

   return true;
};

/*
 *
 */
UTILS.string.ltrim = function (str)
{
   var f = 'UTILS.string.ltrim()';
   UTILS.checkArgs(f, arguments, ['string']);

   // Find index of leftmost non-whitespace character.
   var l = 0;
   var c = str.charAt(l);
   while (c == ' ') {c = str.charAt(++l);}

   return str.substr(l);
};

/*
 * DEPRECATED.  Function trim() is included in standard Javascript.
 */
UTILS.string.trim = function (str)
{
   var f = 'UTILS.string.trim()';
   UTILS.checkArgs(f, arguments, ['string']);

   // Find index of leftmost non-whitespace character.
   var l = 0;
   var c = str.charAt(l);
   while (c == ' ') {c = str.charAt(++l);}

   // Find index of rightmost non-whitespace character.
   var r = str.length - 1;
   var c = str.charAt(r);
   while (c == ' ') {c = str.charAt(--r);}

   return str.substr(l, r + 1);
};

/*
 *
 */
UTILS.string.removeLeadingZeros = function (str)
{
   var f = 'UTILS.string.removeLeadingZeros()';
   UTILS.checkArgs(f, arguments, ['string']);

   var i = 0;
   var c = str.charAt(i);

   while (c == '0')
   {
      c = str.charAt(++i);
   }

   return str.substr(i);
};

/*
 *
 */
UTILS.string.removeWhitespace = function (strIn)
{
   var f = 'UTILS.string.removeWhiteSpace()';
   UTILS.checkArgs(f, arguments, ['string']);

   return strIn.replace(/\s/g, '');
};

/*
 *
 */
UTILS.string.replaceAllWhitespaceCharsWithSpaces = function (strIn)
{
   var f = 'UTILS.string.replaceAllWhitespaceCharsWithSpaces()';
   UTILS.checkArgs(f, arguments, ['string']);

   return strIn.replace(/\s/g, ' ');
};

/*
 *
 */
UTILS.string.removeMultipleSpaces = function (strIn)
{
   var f = 'BracketedTextFormatter.removeMultipleSpaces()';
   UTILS.checkArgs(f, arguments, ['string']);

   // Replace multiple spaces with single spaces.
   return strIn.replace(/[ ]+/g, ' ');
};

/*
 * Same as the PHP function implode().
 */
UTILS.string.implode = function (joinStr, strs)
{
   var f = 'UTILS.string.implode()';
   UTILS.checkArgs(f, arguments, ['string', 'array']);

   if (strs.length == 0)
   {
      return '';
   }

   var str = strs[0];

   for (var i = 1, len = strs.length; i < len; ++i)
   {
      str += joinStr + strs[i];
   }

   return str;
};

/*
 *
 */
UTILS.string.countOccurrencesOfCharacter = function (string, c)
{
   var f = 'UTILS.string.countOccurrencesOfCharacter()';
   UTILS.checkArgs(f, arguments, ['string', 'string']);

   console.assert(c.length == 1);

   var n = 0;

   for (var i = 0, len = string.length; i < len; ++i)
   {
      if (string[i] == c)
      {
         ++n;
      }
   }

   return n;
};

/*
 *
 */
UTILS.string.countOccurrencesOfSubstring = function (string, substring)
{
   var f = 'UTILS.string.countOccurrencesOfSubstring()';
   UTILS.checkArgs(f, arguments, ['string', 'string']);

   var nSubstrings     = 0;
   var inSubstring     = false;
   var substringLength = substring.length;

   if (substringLength > string.length)
   {
      return 0;
   }

   for (var i = 0, len = string.length; i < len; ++i)
   {
      switch (inSubstring)
      {
       case false:
         if (string[i] == substring[0])
         {
            inSubstring = true;
            substringI  = 0;
         }
         break;

       case true:
         ++substringI;

         if (string[i] != substring[substringI])
         {
            inSubstring == false;
         }
         else
         {
            if (substringI == substringLength - 1)
            {
               ++nSubstrings;
            }
         }
      }
   }

   return nSubstrings;
};

/*
 *
 */
UTILS.string.convertCamelCaseToHyphenated = function (camelCasedString)
{
   var f = 'UTILS.string.convertCamelCaseToHyphenated()';
   UTILS.checkArgs(f, arguments, ['string']);

   var hyphenatedString = '';

   for (var i = 0, len = camelCasedString.length; i < len; ++i)
   {
      var c = camelCasedString[i];

      if (c == c.toUpperCase())
      {
         hyphenatedString += '-';
      }

      hyphenatedString += c.toLowerCase();
   }

   return hyphenatedString;
};

/*
 * Build an HTML element containing text nodes separated by BR elements.
 * The BR elements are spliced into the string wherever '\n' characters are found.
 *
 * Eg. Given:
 *        arguments = ['h', 'Three|line|string', {'class': 'heading'}],
 *     Returns
 *        TH({'class': 'heading'}, 'Three', BR(), 'line', BR(), 'string')
 *
 * @param hORd {String}
 *    'h' or 'd'.  Determines whether a TD or TH element is returned.
 *
 * @param nullOrStr {'nullOrString'}
 *    The string to splice.  Null is allowed since often
 *    values in rows returned from SQL querys contain nulls.
 *
 * @param attributes {Object}
 *    Attributes object for the TH or TD element to be returned.
 */
UTILS.string.buildDomElementWithBrs = function (tagName, nullOrStr, attributes)
{
   var f = 'UTILS.string.buildDomElementWithBrs()';
   UTILS.checkArgs(f, arguments, ['string', 'nullOrString', 'object']);

   eval('var elem = ' + tagName.toUpperCase() + '();');

   for (var key in attributes)
   {
      $(elem).attr(key, attributes.key);
   }

   var lines = (nullOrStr === null)? []: nullOrStr.split('\n');

   for (var i = 0, len = lines.length; i < len; ++i)
   {
      $(elem).append(document.createTextNode(lines[i]));

      if (i + 1 < len)
      {
         $(elem).append(BR());
      }
   }

   return elem;
};

/*******************************************END*OF*FILE********************************************/
