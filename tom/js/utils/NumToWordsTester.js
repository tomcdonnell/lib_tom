/**********************************************************************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=156 go-=b
*
* Filename: "NumToWordsTester.js"
*
* Project: Utilities.
*
* Purpose: Test the NumToWords object (found in NumToWords.js).
*
* Author: Tom McDonnell 2011-08-24 (www.tomcdonnell.net).
*
\**********************************************************************************************************************************************************/

$(document).ready
(
   function (ev)
   {
      try
      {
         var numToWords = new NumToWords();
         var output     = '';
         var testPairs  =
         [
            [1 , 'one'],
            [10 , 'ten'],
            [100 , 'one hundred'],
            [1000 , 'one thousand'],
            [10000 , 'ten thousand' ],
            [100000 , 'one hundred thousand'],
            [1000000 , 'one million'],
            [10000000 , 'ten million'],
            [100000000 , 'one hundred million'],
            [1000000000 , 'one billion'],
            [10000000000, 'ten billion'],
            [9, 'nine'],
            [99, 'ninety-nine'],
            [999, 'nine hundred and ninety-nine'],
            [9999, 'nine thousand, nine hundred and ninety-nine'],
            [99999, 'ninety-nine thousand, nine hundred and ninety-nine'],
            [999999, 'nine hundred and ninety-nine thousand, nine hundred and ninety-nine'],
            [9999999, 'nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine'],
            [99999999, 'ninety-nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine'],
            [999999999, 'nine hundred and ninety-nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine'],
            [9999999999, 'nine billion, nine hundred and ninety-nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine'],
            [99999999999, 'ninety-nine billion, nine hundred and ninety-nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine'],
            [2, 'two'],
            [12, 'twelve'],
            [112, 'one hundred and twelve'],
            [2112, 'two thousand, one hundred and twelve'],
            [12112, 'twelve thousand, one hundred and twelve'],
            [112112, 'one hundred and twelve thousand, one hundred and twelve'],
            [2112112, 'two million, one hundred and twelve thousand, one hundred and twelve'],
            [12112112, 'twelve million, one hundred and twelve thousand, one hundred and twelve'],
            [112112112, 'one hundred and twelve million, one hundred and twelve thousand, one hundred and twelve'],
            [2112112112, 'two billion, one hundred and twelve million, one hundred and twelve thousand, one hundred and twelve'],
            [12112112112, 'twelve billion, one hundred and twelve million, one hundred and twelve thousand, one hundred and twelve'],
            [5, 'five'],
            [50, 'fifty'],
            [505, 'five hundred and five'],
            [5050, 'five thousand and fifty'],
            [50505, 'fifty thousand, five hundred and five'],
            [505050, 'five hundred and five thousand and fifty'],
            [5050505, 'five million, fifty thousand, five hundred and five'],
            [50505050, 'fifty million, five hundred and five thousand and fifty'],
            [505050505, 'five hundred and five million, fifty thousand, five hundred and five'],
            [5050505050, 'five billion, fifty million, five hundred and five thousand and fifty'],
            [50505050505, 'fifty billion, five hundred and five million, fifty thousand, five hundred and five'],
            [2, 'two'],
            [22, 'twenty-two'],
            [202, 'two hundred and two'],
            [2002, 'two thousand and two'],
            [20002, 'twenty thousand and two'],
            [200002, 'two hundred thousand and two'],
            [2000002, 'two million and two'],
            [20000002, 'twenty million and two'],
            [200000002, 'two hundred million and two'],
            [2000000002, 'two billion and two'],
            [20000000002, 'twenty billion and two']
         ];

         for (var i = 0; i < testPairs.length; ++i)
         {
            var testPair      = testPairs[i];
            var number        = testPair[0];
            var expectedWords = testPair[1];
            var words         = numToWords.convert(number);
            var nErrors       = 0;

            if (words == expectedWords)
            {
               output += number + ': ' + words + '\n'
            }
            else
            {
               output += '\nERROR:\nFor number ' + number + '\nExpected "' + expectedWords + '"\nReceived "' + words + '".\n\n'
               ++nErrors;
            }
         }

         $('body').append(PRE(output));
         $('body').append
         (
            H2
            (
               (
                  (nErrors == 0)?
                  'Perfect result!  In ' + numToWords.convert(testPairs.length) + ' tests, no errors were found.':
                  'Errors found.  In '   + numToWords.convert(testPairs.length) + ' tests, ' + numToWords.convert(nErrors) + ' errors were found.'
               )
            )
         );
      }
      catch (e)
      {
         console.debug('Caught exception: "' + e + '".');
      }
   }
);

/***********************************************************************END*OF*FILE************************************************************************/
