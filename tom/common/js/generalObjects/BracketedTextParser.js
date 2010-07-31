/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "BracketedTextParser.js"
*
* Project: General objects.
*
* Purpose: Definition of the BracketedTextParser object.
*
* Author: Tom McDonnell 2009-01-17.
*
\**************************************************************************************************/

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function BracketedTextParser()
{
   var f = 'BracketedTextParser()';
   UTILS.checkArgs(f, arguments, []);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   this.parse = function (str)
   {
      var f = 'BracketedTextParser.parse()';
      UTILS.checkArgs(f, arguments, [String]);

      var parseTree = [];

      parseIndex = 0;

      while ((token = getToken(str)))
      {
         parseTree.push(token);
      }

      return parseTree;
   };

   // Private functions. ----------------------------------------------------------------------//

   /*
    *
    */
   function getToken(str)
   {
      var f = 'BracketedTextParser.getToken()';
      UTILS.checkArgs(f, arguments, [String]);

      if (parseIndex >= str.length)
      {
         return false;
      }

      switch (str[parseIndex])
      {
       case '(':
       case '{':
       case '[':
         return getTokenBracketedSubExpression(str);
       case "'":
       case '"':
         return getTokenQuotedString(str);
       default:
         return getTokenUnquotedString(str);
      }
   }

   // Get specific token functions. -----------------------------------------------------------//

   /*
    *
    */
   function getTokenBracketedSubExpression(str)
   {
      var f = 'BracketedTextParser.getBracketedSubExpression()';
      UTILS.checkArgs(f, arguments, ['nonEmptyString']);
      UTILS.assert(f, 0, parseIndex < str.length);

      var openingBracketIndex = parseIndex;
      var closingBracketIndex = getClosingBracketIndex(str, openingBracketIndex);
      var bracketContents     = str.substring(openingBracketIndex + 1, closingBracketIndex);

      oldParseIndex = parseIndex;
      parseIndex    = 0;

      var obj =
      {
         type          : 'BracketedSubexpression'   ,
         openingBracket: str[openingBracketIndex]   ,
         closingBracket: str[closingBracketIndex]   ,
         content       : self.parse(bracketContents)
      };

      parseIndex = closingBracketIndex + 1;

      return obj;
   }

   /*
    *
    */
   function getTokenQuotedString(str)
   {
      var f = 'BracketedTextParser.getTokenQuotedString()';
      UTILS.checkArgs(f, arguments, ['nonEmptyString']);
      UTILS.assert(f, 0, parseIndex < str.length);

      var openingQuoteIndex = parseIndex;
      var quoteChar = str[openingQuoteIndex];
      UTILS.assert(f, 1, isQuote(quoteChar));
      var closingQuoteIndex = str.indexOf(quoteChar, openingQuoteIndex + 1);

      if (closingQuoteIndex == -1)
      {
         throw new Exception
         (
            f,
            'No closing quote found for opening quote at position ' + openingQuoteIndex +
            " of string.",
            str.substr(0, openingQuoteIndex + 1)
         );
      }

      var obj =
      {
         type     : 'QuotedString',
         quoteChar: quoteChar     ,
         content  : str.substring(openingQuoteIndex + 1, closingQuoteIndex)
      };

      parseIndex = closingQuoteIndex + 1;

      return obj;
   }

   /*
    *
    */
   function getTokenUnquotedString(str)
   {
      var f = 'BracketedTextParser.getTokenUnquotedString()';
      UTILS.checkArgs(f, arguments, ['nonEmptyString']);
      UTILS.assert(f, 0, parseIndex < str.length);

      var exclusiveEndingChars = ['(', '{', '[', '"', "'"];
      var inclusiveEndingChars = [':', ';', ','];
      var startIndex           = parseIndex;
      var finishIndex          = null;

      for (var i = startIndex, len = str.length; i < len; ++i)
      {
         var c = str[i];

         if (UTILS.array.hasElement(exclusiveEndingChars, c))
         {
            finishIndex = i - 1;
            break;
         }

         if (UTILS.array.hasElement(inclusiveEndingChars, c))
         {
            finishIndex = i;
            break;
         }
      }

      if (finishIndex === null)
      {
         finishIndex = str.length;
      }

      var contentStr = str.substring(startIndex, finishIndex + 1);
      var contentStr = UTILS.string.replaceAllWhitespaceCharsWithSpaces(contentStr);
      var contentStr = UTILS.string.removeMultipleSpaces(contentStr);

      var obj =
      {
         type   : 'UnquotedString',
         content: contentStr
      };

      parseIndex = finishIndex + 1;

      return obj;
   }

   // Simple boolean functions. ---------------------------------------------------------------//

   function isQuote(c) {return (c == '"' || c == "'");}
      
   // Other private functions. ----------------------------------------------------------------//

   /*
    *
    */
   function getClosingBracketIndex(str, openingBracketIndex)
   {
      var f = 'BracketedTextFormatter.getClosingBracketIndex()';
      UTILS.checkArgs(f, arguments, ['nonEmptyString', 'nonNegativeInt']);
      UTILS.assert(f, 0, openingBracketIndex < str.length);

      var openingBracket            = str[openingBracketIndex];
      var closingBracket            = getClosingBracketForOpeningBracket(openingBracket);
      var n_closingBracketsToIgnore = 0;
      var inSingleQuotedStr         = false;
      var inDoubleQuotedStr         = false;

      for (var i = openingBracketIndex + 1, len = str.length; i < len; ++i)
      {
         var c = str[i];

         switch (c)
         {
          case '"': if (!inSingleQuotedStr) {inDoubleQuotedStr = !inDoubleQuotedStr;}; break;
          case "'": if (!inDoubleQuotedStr) {inSingleQuotedStr = !inSingleQuotedStr;}; break;
          default : // Do nothing.
         }

         if (!inSingleQuotedStr && !inDoubleQuotedStr)
         {
            if (c == openingBracket)
            {
               ++n_closingBracketsToIgnore;
               continue;
            }

            if (c == closingBracket)
            {
               switch (n_closingBracketsToIgnore == 0)
               {
                case false: --n_closingBracketsToIgnore; break;
                case true : return i;
               }
            }
         }
      }

      throw new Exception
      (
         f,
         'No closing bracket found for opening bracket at position ' + openingBracketIndex +
         " of string.",
         str.substr(0, openingBracketIndex + 1)
      );
   }

   /*
    *
    */
   function getClosingBracketForOpeningBracket(openingBracket)
   {
      var f = 'BracketedTextFormatter.getClosingBracketForOpeningBracket()';
      UTILS.checkArgs(f, arguments, ['char']);

      switch (openingBracket)
      {
       case '(': return ')';
       case '{': return '}';
       case '[': return ']';
       default :
         throw new Exception
         (
            f, "Character '" + openingBracket + "' is not an opening bracket.", ''
         );
      }
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var self = this;

   var parseIndex = null;
}

/*******************************************END*OF*FILE********************************************/
