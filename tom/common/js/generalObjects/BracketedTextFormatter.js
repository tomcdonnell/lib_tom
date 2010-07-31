/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "BracketedTextFormatter.js"
*
* Project: General objects.
*
* Purpose: Definition of the BracketedTextFormatter object.
*
* Author: Tom McDonnell 2009-01-14.
*
\**************************************************************************************************/

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function BracketedTextFormatter()
{
   var f = 'BracketedTextFormatter()';
   UTILS.checkArgs(f, arguments, []);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getSettings = function () {return settings;};

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setSettings = function (newSettings)
   {
      var f = 'BracketedTextFormatter.setSettings()';
      UTILS.checkArgs(f, arguments, [Object]);

      UTILS.validator.checkObject
      (
         newSettings,
         {
            maxCharsPerLine                           : 'positiveInt',
            indentIncrement                           : 'string'     ,
            ignoreMaxCharsPerLineForUnbreakableStrings: 'bool'       ,
            removeAllNewLineCharactersFromStrings     : 'bool'
         }
      );

      settings = newSettings;
   };

   // Other public functions. -----------------------------------------------------------------//

   /*
    *
    */
   this.formatText = function (str)
   {
      var f = 'BracketedTextParser.formatText()';
      UTILS.checkArgs(f, arguments, [String]);

      initialiseState();

      if (settings.removeAllNewLineCharactersFromStrings)
      {
         str = str.replace(new RegExp(/\n/g), '');
      }

      var parseTree = bracketedTextParser.parse(str);

      return generateFormattedTextFromParseTree(parseTree, false);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function generateFormattedTextFromParseTree(parseTree, boolOneLine)
   {
      var f = 'BracketedTextParser.generateFormattedTextFromParseTree()';
      UTILS.checkArgs(f, arguments, [Array, Boolean]);

      var b = boolOneLine; // Abbreviation.

      str = '';

      for (var i = 0, len = parseTree.length; i < len; ++i)
      {
         var token = parseTree[i];
         UTILS.assert(f, 0, token.constructor == Object);

         switch (token.type)
         {
          case 'BracketedSubexpression':
            str += formatTextForBracketedSubexpression(token, b);
            break;
          case 'QuotedString':
            str += formatTextForQuotedString(token, b);
            break;
          case 'UnquotedString':
            var s = formatTextForUnquotedString(token, b);
            if (i == 0) {s = UTILS.string.ltrim(s);}
            str += s;
            break;
          default:
            throw new Exception(f, "Unknown token type '" + token.type + '".', '');
         }
      }
   
      // Remove blank lines.
      // These are introduced if the first token in a bracketed sub-expression that requires
      // a new block is another bracketed sub-expression that also requires a new block.
      str = str.replace(new RegExp('\\n[' + settings.indentIncrement + ']*\n'), '\n');

      return str;
   }

   /*
    *
    */
   function formatTextForBracketedSubexpression(token, boolOneLine)
   {
      var f = 'BracketedTextFormatter.formatTextForBracketedSubexpression()';
      UTILS.checkArgs(f, arguments, [Object, Boolean]);
      UTILS.assert(f, 0, token.type == 'BracketedSubexpression');

      saveLinePosition();

      var openingBracket = token.openingBracket;
      var closingBracket = token.closingBracket;

      var sameLineInsertionStr =
      (
         openingBracket +
         generateFormattedTextFromParseTree(token.content, true) +
         closingBracket
      );

      restoreLinePosition();

      if (boolOneLine)
      {
         return sameLineInsertionStr;
      }

      // Same line insertion.
      var maxCharsPerLine           = settings.maxCharsPerLine;
      var currentLinePos            = state.currentLinePosition;
      var posAfterSameLineInsertion = currentLinePos + sameLineInsertionStr.length;
      if (posAfterSameLineInsertion <= maxCharsPerLine)
      {
         state.currentLinePosition = posAfterSameLineInsertion;
         return sameLineInsertionStr;
      }

      // New line insertion.
      var currentIndentStr         = state.currentIndentStr;
      var newLineInsertionStr      = '\n' + currentIndentStr + sameLineInsertionStr;
      var posAfterNewLineInsertion = currentIndentStr.length + sameLineInsertionStr.length;
      if (posAfterNewLineInsertion <= maxCharsPerLine)
      {
         state.currentLinePosition = posAfterNewLineInsertion;
         return newLineInsertionStr;
      }

      // New block insertion.
      var oldIndentStr          = currentIndentStr;
      state.currentIndentStr    = oldIndentStr + settings.indentIncrement;
      state.currentLinePosition = state.currentIndentStr.length;
      var newBlockInsertionStr  =
      (
         '\n' + oldIndentStr + openingBracket +
         '\n' + state.currentIndentStr + generateFormattedTextFromParseTree(token.content, false) +
         '\n' + oldIndentStr + closingBracket
      );
      state.currentIndentStr    = oldIndentStr;
      state.currentLinePosition = oldIndentStr.length + 1;

      return newBlockInsertionStr;
   }

   /*
    *
    */
   function formatTextForQuotedString(token, boolOneLine)
   {
      var f = 'BracketedTextFormatter.formatTextForQuotedString()';
      UTILS.checkArgs(f, arguments, [Object, Boolean]);
      UTILS.assert(f, 0, token.type == 'QuotedString');

      var sameLineInsertionStr = token.quoteChar + token.content + token.quoteChar;
      var currentIndentStr     = state.currentIndentStr;

      if (boolOneLine)
      {
         return sameLineInsertionStr;
      }

      // Same line insertion.
      var maxCharsPerLine           = settings.maxCharsPerLine;
      var currentLinePos            = state.currentLinePosition;
      var posAfterSameLineInsertion = currentLinePos + sameLineInsertionStr.length;
      if (posAfterSameLineInsertion <= maxCharsPerLine)
      {
         state.currentLinePosition = posAfterSameLineInsertion;
         return sameLineInsertionStr;
      }

      // New line insertion.
      var newLineInsertionStr      = '\n' + currentIndentStr + sameLineInsertionStr;
      var posAfterNewLineInsertion = currentIndentStr.length + sameLineInsertionStr.length;
      if
      (
         posAfterNewLineInsertion <= maxCharsPerLine ||
         settings.ignoreMaxCharsPerLineForUnbreakableStrings
      )
      {
         state.currentLinePosition = posAfterNewLineInsertion;
         return newLineInsertionStr;
      }

      throw new Exception
      (
         f, 'Quoted string must be broken to fit.',
         token.quoteChar + token.content + token.quoteChar
      );
   }

   /*
    *
    */
   function formatTextForUnquotedString(token, boolOneLine)
   {
      var f = 'BracketedTextFormatter.formatTextForUnquotedString()';
      UTILS.checkArgs(f, arguments, [Object, Boolean]);
      UTILS.assert(f, 0, token.type == 'UnquotedString');

      var sameLineInsertionStr = token.content;
      var currentIndentStr     = state.currentIndentStr;

      if (boolOneLine)
      {
         return sameLineInsertionStr;
      }

      // Same line insertion.
      var maxCharsPerLine           = settings.maxCharsPerLine;
      var currentLinePos            = state.currentLinePosition;
      var posAfterSameLineInsertion = currentLinePos + sameLineInsertionStr.length;
      if (posAfterSameLineInsertion <= maxCharsPerLine)
      {
         state.currentLinePosition = posAfterSameLineInsertion;
         return sameLineInsertionStr;
      }

      // New line insertion.
      var sameLineInsertionStr     = UTILS.string.ltrim(sameLineInsertionStr);
      var newLineInsertionStr      = '\n' + currentIndentStr + sameLineInsertionStr;
      var posAfterNewLineInsertion = currentIndentStr.length + sameLineInsertionStr.length;
      if (posAfterNewLineInsertion <= maxCharsPerLine)
      {
         state.currentLinePosition = posAfterNewLineInsertion;
         return newLineInsertionStr;
      }

      // Attempt to break string at last space before maxCharsPerLine.
      var limitFirst      = maxCharsPerLine - state.currentLinePosition;
      var limitSubsequent = maxCharsPerLine - currentIndentStr.length;
      var strs = breakStringIntoSegments(sameLineInsertionStr, limitFirst, limitSubsequent);

      state.currentLinePosition = currentIndentStr.length + strs[strs.length - 1].length;
      return UTILS.string.implode('\n' + currentIndentStr, strs);
   }

   /*
    * Break the given string on spaces so that the length of the first segment is at most
    * lengthLimitFirst and the length of each subsequent segment is at most lengthLimitSubsequent.
    */
   function breakStringIntoSegments(str, lengthLimitFirst, lengthLimitSubsequent)
   {
      var f = 'BracketedTextFormatter.breakStringIntoSegments()';
      UTILS.checkArgs(f, arguments, [String, Number, Number]);

      var spacePos     = str.lastIndexOf(' ', lengthLimitFirst);
      var strs         = [str.substr(0, spacePos)];
      var remainingStr = UTILS.string.ltrim(str.substr(spacePos));

      while (spacePos != -1 && remainingStr.length > lengthLimitSubsequent)
      {
         spacePos = remainingStr.lastIndexOf(' ', lengthLimitSubsequent);
         strs.push(remainingStr.substr(0, spacePos));
         remainingStr = UTILS.string.ltrim(remainingStr.substr(spacePos));
      }

      strs.push(remainingStr);

      return strs;
   }

   // Buffer functions. -----------------------------------------------------------------------//

   function saveLinePosition()    {state.buffer.push(state.currentLinePosition)  ;}
   function restoreLinePosition() {state.currentLinePosition = state.buffer.pop();}

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function initialiseState()
   {
      var f = 'BracketedTextFormatter.initialiseState()';
      UTILS.checkArgs(f, arguments, []);

      state =
      {
         currentIndentStr   : '',
         currentLinePosition:  0,
         buffer             : []
      };
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var bracketedTextParser = new BracketedTextParser();

   var state = null;

   var settings =
   {
      maxCharsPerLine                           :   100,
      indentIncrement                           : '   ',
      ignoreMaxCharsPerLineForUnbreakableStrings: true ,
      removeAllNewLineCharactersFromStrings     : true
   };
}

/*******************************************END*OF*FILE********************************************/
