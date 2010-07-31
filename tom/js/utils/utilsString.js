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

// General purpose functions. --------------------------------------------------------------------//

// TODO: These functions should be re-written to use regular expressions.

 /*
  *
  */
UTILS.string.ltrim = function (str)
{
   var f = 'UTILS.string.ltrim()';
   UTILS.checkArgs(f, arguments, [String]);

   // Find index of leftmost non-whitespace character.
   var l = 0;
   var c = str.charAt(l);
   while (c == ' ') {c = str.charAt(++l);}

   return str.substr(l);
};

 /*
  *
  */
UTILS.string.trim = function (str)
{
   var f = 'UTILS.string.trim()';
   UTILS.checkArgs(f, arguments, [String]);

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
   UTILS.checkArgs(f, arguments, [String]);

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
   UTILS.checkArgs(f, arguments, [String]);

   return strIn.replace(/\s/g, '');
};

/*
 *
 */
UTILS.string.replaceAllWhitespaceCharsWithSpaces = function (strIn)
{
   var f = 'UTILS.string.replaceAllWhitespaceCharsWithSpaces()';
   UTILS.checkArgs(f, arguments, [String]);

   return strIn.replace(/\s/g, ' ');
};

/*
 *
 */
UTILS.string.removeMultipleSpaces = function (strIn)
{
   var f = 'BracketedTextFormatter.removeMultipleSpaces()';
   UTILS.checkArgs(f, arguments, [String]);

   // Replace multiple spaces with single spaces.
   return strIn.replace(/[ ]+/g, ' ');
};

/*
 * Same as the PHP function implode().
 */
UTILS.string.implode = function (joinStr, strs)
{
   var f = 'UTILS.string.implode()';
   UTILS.checkArgs(f, arguments, [String, Array]);

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

/*******************************************END*OF*FILE********************************************/
