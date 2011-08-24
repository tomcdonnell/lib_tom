/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
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
    */
   this.convert = function (n)
   {
      if (n == 0)
      {
         return 'zero';
      }

      var str = _getIntAsWordsRecursively(n, 0);
      var c   = str.lastIndexOf(','      );
      var h   = str.lastIndexOf('hundred');

      // If no 'hundred' substring was found after the last comma...
      if (h < c)
      {
         // Replace the last ', ' with ' and '.
         str = str.substring(0, c) + ' and ' + str.substring(c + 2);
      }

      return str;
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _getIntAsWordsRecursively(n, nThousandsExponent)
   {
      var str = _getNonZeroNumberLessThanOneThousandAsWords(n % 1000);

      if (str != '' && nThousandsExponent > 0)
      {
         str += ' ' + _words.illions[nThousandsExponent - 1];
      }

      if (n < 1000)
      {
         return str;
      }

      return _getIntAsWordsRecursively(Math.floor(n / 1000), nThousandsExponent + 1) +
      (
         (str == '')? '': ', ' + str
      );
   }

   /*
    *
    */
   function _getNonZeroNumberLessThanOneThousandAsWords(n)
   {
      if (n == 0)
      {
         return '';
      }

      if (n < 10)
      {
         // n < 10.
         return _words.digits[n - 1];
      }

      if (n < 20)
      {
         // 10 <= n < 20.
         return _words.teens[n - 10];
      }

      if (n < 100)
      {
         // 20 <= n < 100.
         return _words.tens[Math.floor(n / 10) - 1] +
         (
            (n % 10 == 0)? '': '-' + _getNonZeroNumberLessThanOneThousandAsWords(n % 10)
         );
      }

      if (n < 1000)
      {
         // 100 <= n < 1000.
         return _words.digits[Math.floor(n / 100) - 1] + ' hundred' +
         (
            (n % 100 == 0)? '': ' and ' + _getNonZeroNumberLessThanOneThousandAsWords(n % 100)
         );
      }

      throw new Exception('Number ' + n + ' is out of range.');
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _words =
   {
      digits: ['one', 'two'   , 'three' , 'four' , 'five' , 'six'  , 'seven'  , 'eight' , 'nine'  ],
      tens  : ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
      teens :
      [
         'ten'    , 'eleven' , 'twelve'   , 'thirteen', 'fourteen',
         'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
      ],
      illions:
      [
          // See http://en.wikipedia.org/wiki/Names_of_large_numbers.
          'thousand'  , 'million'   , 'billion'  , 'trillion' , 'quadrillion', 'quintillion',
          'sextillion', 'heptillion', 'octillion', 'nonillion', 'decillion'
      ]
   };
}

/*******************************************END*OF*FILE********************************************/
