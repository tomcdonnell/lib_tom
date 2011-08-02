/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "NumToWords.js"
*
* Project: Utilities.
*
* Purpose: Convert a given integer to words (eg 1115 => 'one thousand, one hundred and fifteen').
*
* License: Permission is granted to copy and redistribute under the GPL license.
*          http://www.gnu.org/licenses/gpl-3.0.txt
*
* Author: Tom McDonnell 2011-07-27 (www.tomcdonnell.net).
*
\**************************************************************************************************/

/**
 * Usage
 * -----
 * var numToWords = new NumToWords();
 * int            = 1345123451;
 * var intAsWords = numToWords.convert(int);
 *
 * Tom's Notes to Self
 * -------------------
 * This file is linked to in the blog post at
 *   http://tomcdonnell.blogspot.com/2011/07/converting-numbers-to-words-in.html
 * Check the blog after updating the code.
 * This file must have no dependencies.
 */
function NumToWords()
{
   /*
    * Return the given integer expressed in words.
    *
    * Eg. 1034913 => 'one million, thirty-four thousand, nine hundred and thirteen'
    *
    * Algorith Description With Example
    * ---------------------------------
    * Step 1:
    *   Convert each non-zero digit into a string of words describing the number that would result
    *   if all digits to the left of that digit were discarded, and all digits to the right of that
    *   digit were zero.  Combine all strings so produced into a single string.
    *   Eg. 94615 => 'ninety thousand' + 'four thousand' + 'six hundred' + 'ten' + 'five'
    * Step 2:
    *   Remove redundant words and substitute 'teen' words where appropriate.
    *   Also add an 'and' between the last two words if it is needed (see code).
    *   Eg. 'ninety thousand four thousand'   |   'ten five'
    *         => 'ninety-four thousand'       |     => 'fifteen'
    * Step 3:
    *   Perform string replacements to introduce commas, hyphens and 'and' words where appropriate.
    *   Eg. 'ninety four thousand six hundred and fifteen'
    *         => 'ninety-four thousand, six hundred and fifteen'
    *
    * Example: 9,999,999
    *  1 'nine million nine hundred thousand ninety thousand nine thousand nine hundred ninety nine'
    *  2 'nine million nine hundred ninety nine thousand nine hundred ninety nine'
    *  3 'nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine'.
    *
    * Example: 1,015,015
    *  1 'one million ten thousand five thousand ten five'
    *  2 'one million fifteen thousand fifteen'
    *  3 'one million, fifteen thousand and fifteen'.
    */
   this.convert = function (n)
   {
      if (n == 0) {return 'zero';}

      var intAsWords = '';

      // Step 1 (in Algorithm Description above)
      var arrayOfDigits = _getIntAsArrayOfDigits(n);
      for (var i = 0, len = arrayOfDigits.length; i < len; ++i)
      {
         var powerOfTen = len - i - 1;
         var digit      = arrayOfDigits[i];
         if (arrayOfDigits[i] == 0) {continue;}
         intAsWords += ' ' + _getNonZeroDigitInPositionAsWords(arrayOfDigits[i], powerOfTen);
      }

      // Step 2 (in Algorithm Description above)
      intAsWords = _condenseIntAsWordsString(intAsWords);

      // Step 3 (in Algorithm Description above)
      for (var searchStr in _replaceStrBySearchStr)
      {
         intAsWords = intAsWords.replace(searchStr, _replaceStrBySearchStr[searchStr], 'g');
      }

      return intAsWords;
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    * Convert the supplied non-zero digit into a string of words describing the number that
    * would result if that non-zero digit was multiplied by the power of ten also supplied.
    *
    * Eg. nonZeroDigit = 9, powerOfTen = 5.
    *     (9 x 10^5 = 900000)
    *     return 'nine hundred thousand'.
    */
   function _getNonZeroDigitInPositionAsWords(nonZeroDigit, powerOfTen)
   {
      var suffixWord = _getPowerOfTenSuffixWord(powerOfTen);
      if (suffixWord != '') {var suffixWord = ' ' + suffixWord;}

      switch (powerOfTen % 3)
      {
       case 0 : return _getNonZeroDigitAsWord(nonZeroDigit)         +              suffixWord;
       case 1 : return _getNonZeroDigitTimesTenAsWord(nonZeroDigit) +              suffixWord;
       case 2 : return _getNonZeroDigitAsWord(nonZeroDigit)         + ' hundred' + suffixWord;
       default: throw 'Impossible case.';
      }
   }

   /*
    *
    */
   function _condenseIntAsWordsString(intAsWords)
   {
      var intAsWords          = intAsWords.trim();
      var intAsWordsPreLength = intAsWords.length + 1;
      var nWords              = _largeNumberWords.length;

      while (intAsWords.length < intAsWordsPreLength)
      {
         intAsWordsPreLength = intAsWords.length;

         for (i = 0; i < nWords; ++i)
         {
            intAsWords = _performStringReplacements(intAsWords, _largeNumberWords[i]);
         }
      }

      intAsWords = _addFinalAndIfNecessary(intAsWords);

      return intAsWords;
   }

   /*
    *
    */
   function _performStringReplacements(string, word)
   {
      var tokens = string.split(' ');

      for (var i = 0; i < tokens.length - 1; ++i)
      {
         var token1 = tokens[i    ];
         var token2 = tokens[i + 1];

         if (token1 == 'ten' && _isNonZeroDigitWord(token2))
         {
            // Pattern 'ten <digitString>' found.
            // Replace with teen word.
            // Eg. 'ten two' => 'twelve'.
            tokens.splice(i, 2, [_getTeenWordMatchingDigitWord(token2)]);
            continue;
         }

         if (i < tokens.length - 2 && token1 == word && tokens[i + 2] == word)
         {
            // Pattern '<word> <x> <word>' found.
            // Replace with '<x> <word>' by splicing token1.
            // Eg. 'ninety thousand nine thousand' => 'ninety nine thousand'.
            tokens.splice(i, 1);
         }
      }

      return tokens.join(' ');
   }

   /*
    * If pattern 'hundred <word>', or 'thousand <word>', or 'ion <word>' appears at the end of the
    * string, and <word> is not 'hundred', 'thousand' or '...ion', an 'and' must be added between
    * the last two words.
    */
   function _addFinalAndIfNecessary(intAsWords)
   {
      var tokens  = intAsWords.split(' ');
      var nTokens = tokens.length;

      if (nTokens < 3)
      {
         return intAsWords;
      }

      var tok1 = tokens[nTokens - 2]; // Second-last token.
      var tok2 = tokens[nTokens - 1]; // Last        token.

      if
      (
          (tok1 == 'hundred'  || tok1 == 'thousand' || tok1.substring(tok1.length - 3) == 'ion') &&
         !(tok2 == 'hundred'  || tok2 == 'thousand' || tok2.substring(tok2.length - 3) == 'ion')
      )
      {
         tokens.splice(nTokens - 1, 0, 'and');
         intAsWords = tokens.join(' ');
      }

      return intAsWords;
   }

   /*
    *
    */
   function _getIntAsArrayOfDigits(n)
   {
      var nAsString     = String(n);
      var arrayOfDigits = [];

      for (var i = 0, len = nAsString.length; i < len; ++i)
      {
         arrayOfDigits.push(Number(nAsString.charAt(i)));
      }

      return arrayOfDigits;
   }

   /*
    *
    */
   function _isNonZeroDigitWord(w)
   {
      return b =
      (
         w == 'one'   || w == 'two'   || w == 'three' ||
         w == 'four'  || w == 'five'  || w == 'six'   ||
         w == 'seven' || w == 'eight' || w == 'nine'
      );
   }

   /*
    *
    */
   function _getNonZeroDigitAsWord(nonZeroDigit)
   {
      switch (nonZeroDigit)
      {
       case  1: return 'one'  ;
       case  2: return 'two'  ;
       case  3: return 'three';
       case  4: return 'four' ;
       case  5: return 'five' ;
       case  6: return 'six'  ;
       case  7: return 'seven';
       case  8: return 'eight';
       case  9: return 'nine' ;
       default: throw 'Unexpected value "' + nonZeroDigit + '" for nonZeroDigit.';
      }
   }

   /*
    *
    */
   function _getNonZeroDigitTimesTenAsWord(nonZeroDigit)
   {
      switch (nonZeroDigit)
      {
       case  1: return 'ten'    ;
       case  2: return 'twenty' ;
       case  3: return 'thirty' ;
       case  4: return 'forty'  ;
       case  5: return 'fifty'  ;
       case  6: return 'sixty'  ;
       case  7: return 'seventy';
       case  8: return 'eighty' ;
       case  9: return 'ninety' ;
       default: throw 'Unexpected value "' + nonZeroDigit + '" for nonZeroDigit.';
      }
   }

   /*
    *
    */
   function _getTeenWordMatchingDigitWord(digitWord)
   {
      switch (digitWord)
      {
       case 'one'  : return 'eleven'   ;
       case 'two'  : return 'twelve'   ;
       case 'three': return 'thirteen' ;
       case 'four' : return 'fourteen' ;
       case 'five' : return 'fifteen'  ;
       case 'six'  : return 'sixteen'  ;
       case 'seven': return 'seventeen';
       case 'eight': return 'eighteen' ;
       case 'nine' : return 'nineteen' ;
       default: throw "Unexpected value '" + digitWord + "' for digit word.";
      }
   }

   /*
    *
    */
   function _getPowerOfTenSuffixWord(powerOfTen)
   {
      switch (powerOfTen)
      {
       case  0: case  1: case  2: return ''                   ;
       case  3: case  4: case  5: return _largeNumberWords[ 0];
       case  6: case  7: case  8: return _largeNumberWords[ 1];
       case  9: case 10: case 11: return _largeNumberWords[ 2];
       case 12: case 13: case 14: return _largeNumberWords[ 3];
       case 15: case 16: case 17: return _largeNumberWords[ 4];
       case 18: case 19: case 20: return _largeNumberWords[ 5];
       case 21: case 22: case 23: return _largeNumberWords[ 6];
       case 23: case 24: case 25: return _largeNumberWords[ 7];
       case 25: case 26: case 27: return _largeNumberWords[ 8];
       case 28: case 29: case 30: return _largeNumberWords[ 9];
       case 31: case 32: case 33: return _largeNumberWords[10];
       default: throw 'Power of ten ' + powerOfTen + ' out of expected range.';
      }
   }

   /*
    * For debugging and testing purposes.
    */
   function _test()
   {
      var testNums =
      [
         1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000,
         9, 99, 999, 9999, 99999, 999999, 9999999, 99999999, 999999999, 9999999999, 99999999999,
         1, 12, 112, 2112, 12112, 112112, 2112112, 12112112, 112112112, 2112112112, 11211211211,
         5, 50, 505, 5050, 50505, 505050, 5050505, 50505050, 505050505, 5050505050, 50505050505,
         2, 20, 202, 2002, 20002, 200002, 2000002, 20000002, 200000002, 2000000002, 20000000002
      ];

      for (var i = 0; i < testNums.length; ++i)
      {
         var num   = testNums[i];
         var words = self.convert(num);
         console.debug(num, words);
      }
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _largeNumberWords =
   [
       // See http://en.wikipedia.org/wiki/Names_of_large_numbers.
       'thousand'  , 'million'   , 'billion'  , 'trillion' , 'quadrillion', 'quintillion',
       'sextillion', 'heptillion', 'octillion', 'nonillion', 'decillion'
   ];

   var _replaceStrBySearchStr =
   {
      'dred one':'dred and one', 'ty one':'ty-one',
      'dred two':'dred and two', 'ty two':'ty-two',
      'dred thr':'dred and thr', 'ty thr':'ty-thr',
      'dred fou':'dred and fou', 'ty fou':'ty-fou',
      'dred fiv':'dred and fiv', 'ty fiv':'ty-fiv',
      'dred six':'dred and six', 'ty six':'ty-six',
      'dred sev':'dred and sev', 'ty sev':'ty-sev',
      'dred eig':'dred and eig', 'ty eig':'ty-eig',
      'dred nin':'dred and nin', 'ty nin':'ty-nin',
      'dred ele':'dred and ele', 'sand ' :'sand, ',
      'dred twe':'dred and twe', 'ion '  :'ion, ' ,
      'dred thi':'dred and thi', ', and' : ' and' , // NOTE: Must happen after the commas are added.
      'dred fif':'dred and fif',
   };

   var self = this;
}

/*******************************************END*OF*FILE********************************************/
