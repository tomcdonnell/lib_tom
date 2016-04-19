<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "UtilsString.php"
*
* Project: Utilities.
*
* Purpose: Utilities pertaining to strings.
*
* Author: Tom McDonnell 2010-04-09.
*
\**************************************************************************************************/

/*
 *
 */
class UtilsString
{
   /*
    *
    */
   public function __construct()
   {
      throw new Exception('This class is not intended to be instatiated.');
   }

   /*
    *
    */
   public static function filterNonPrintable($string)
   {
      // Note on Error Reporting
      // -----------------------
      // The iconv function causes notice-level error messages in some circumstances.
      //
      // Eg. Notice: iconv(): Detected an incomplete multibyte character in input string in <file>
      //
      // Therefore E_NOTICE level errors are temporarily disabled.
      $oldErrorLevel = error_reporting();
      error_reporting($oldErrorLevel & ~E_NOTICE);

      $string = iconv('UTF-8', 'ASCII//IGNORE', $string);
      $string = str_replace("\n", '_{_NEWLINE_}_', $string);
      $string = preg_replace( '/[^[:print:]]/', '', $string);
      $string = str_replace('_{_NEWLINE_}_', "\n", $string);
      $string = trim($string);

      // Reset error reporting level to old value.
      error_reporting($oldErrorLevel);

      return $string;
   }

   /*
    *
    */
   public static function countOccurrencesOfCharacter($string, $character)
   {
      $n = 0;

      for ($i = 0; $i < strlen($string); ++$i)
      {
         if ($string[$i] == $character)
         {
            ++$n;
         }
      }

      return $n;
   }

   /*
    *
    */
   public static function removeAllNonAlphaCharacters($string)
   {
      $stringLength = strlen($string);
      $newString    = '';

      for ($i = 0; $i < $stringLength; ++$i)
      {
         $character = $string[$i];

         if (ctype_alpha($character))
         {
            $newString .= $character;
         }
      }

      return $newString;
   }

   /*
    * @return {array}
    *    Containing all strings of length 'k' that can be made from
    *    the letters in the given string where order is unimportant.
    *
    * @param $indicesToAvoidAsKeys {array}
    *    Used for recursive calls only.  Supply empty array.
    *
    * Examples
    * -------------------------------------+---------------------------------------------
    * findAllKSubsets('abcde', 2, array()) | findAllKSubsets('abcde', 3, array())
    * return array                         | return
    * (                                    | (
    *    'ab', 'ac', 'ad', 'ae',           |    'abc', 'abd', 'abe', 'acd', 'ace', 'ade',
    *          'bc', 'bd', 'be',           |                         'bcd', 'bce', 'bde',
    *                'cd', 'ce',           |                                       'cde'
    *                      'de'            | );
    * );
    */
   public static function findAllKSubsets($string, $k, $indicesToAvoidAsKeys = array())
   {
      $strlen         = strlen($string);
      $kSubsetsAsKeys = array(); 

      if ($k == 1)
      {
         $oneSubsets = array();

         for ($j = 0; $j < $strlen; ++$j)
         {
            if (!array_key_exists($j, $indicesToAvoidAsKeys))
            {
               $oneSubsets[] = $string[$j];
            }
         }

         return $oneSubsets;
      }

      for ($i = 0; $i < $strlen; ++$i)
      {
         if (array_key_exists($i, $indicesToAvoidAsKeys))
         {
            continue;
         }

         $indicesToAvoidAsKeys[$i] = true;
         $kMinusOneSubsets         = self::findAllKSubsets($string, $k - 1, $indicesToAvoidAsKeys);

         foreach ($kMinusOneSubsets as $kMinusOneSubset)
         {
            $kSubsetsAsKeys["{$string[$i]}$kMinusOneSubset"] = true;
         }
      }

      return array_keys($kSubsetsAsKeys);
   }

   /**
    * @return {array}
    *   A new string that is $strA with all characters that are in $strB removed.
    *   A maximum of one character is removed from $strA for each character in $strB.
    *   The order of characters in the returned string is unchanged from the order of $strA.
    */
   public static function diff($strA, $strB)
   {
      $strlenA       = strlen($strA);
      $offsetsByChar = array();
      $diffStr       = '';

      for ($i = 0; $i < $strlenA; ++$i)
      {
         $charA  = $strA[$i];
         $offset = (array_key_exists($charA, $offsetsByChar))? $offsetsByChar[$charA]: null;
         $pos    = strpos($strB, $strA[$i], $offset);

         if ($pos !== false)
         {
            $offsetsByChar[$charA] = $pos + 1;
            continue;
         }

         $diffStr .= $charA;
      }

      return $diffStr;
   }

   /*
    * Eg.  When supplied  'This string contains a "quoted" word.',
    *      will return   "'This string contains a \"quoted\" word.'".
    */
   public static function escapeAndEnclose($string, $quote = '"')
   {
      if (strlen($quote) > 1)
      {
         throw new Exception("Quote string '$quote' contains more than one character.");
      }

      return $quote . str_replace("$quote", "\"$quote", $string) . $quote;
   }

   /*
    * For use with array_map() function.
    */
   public static function encloseInThTags($string) {return "<th>$string</th>";}
   public static function encloseInTdTags($string) {return "<td>$string</td>";}

   /*
    *
    */
   public static function padNumberWithZeros($number, $n_zerosToPad)
   {
      $str = '';

      for ($n = 1; $n <= $n_zerosToPad; ++$n)
      {
         if ($number < pow(10, $n))
         {
            $str .= '0';
         }
      }

      return $str . $number;
   }

   /*
    *
    */
   public static function isAllUppercase($string)
   {
      for ($i = 0; $i < strlen($string); ++$i)
      {
         $c = $string[$i];

         if ($c != strtoupper($c))
         {
            return false;
         }
      }

      return true;
   }

   /*
    *
    */
   public static function replaceAllWhitespaceCharsWithSingleSpaces($string)
   {
      $string = preg_replace('/\s/', ' ', $string);
      return preg_replace('/  +/', ' ', $string);
   }

   /*
    * Eg. 'camelCaseString' becomes 'camel-case-string'.
    */
   public static function convertCamelCaseToHyphenated($camelCaseString)
   {
      $camelCaseStringLength = strlen($camelCaseString);
      $hyphenatedString      = '';

      for ($i = 0; $i < $camelCaseStringLength; ++$i)
      {
         $c                 = $camelCaseString[$i];
         $hyphenatedString .= (self::isLowercase($c))? $c: (($i === 0)? '': '-') . strtolower($c);
      }

      return $hyphenatedString;
   }

   /*
    * Eg. 'camel-case-string' becomes 'camelCasedString'.
    */
   public static function convertHyphenatedToCamelCase($hyphenatedString)
   {
      $hyphenatedStringLength = strlen($hyphenatedString);
      $camelCaseString        = '';

      for ($i = 0; $i < $hyphenatedStringLength; ++$i)
      {
         $c                = $hyphenatedString[$i];
         $camelCaseString .= ($c === '-')? strtoupper($hyphenatedString[++$i]): $c;
      }

      return $camelCaseString;
   }
}

/*******************************************END*OF*FILE********************************************/
?>
