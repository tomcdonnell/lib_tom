<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Utils_misc.php"
*
* Project: Utilities.
*
* Purpose: Miscellaneous utilities.
*
* Author: Tom McDonnell 2008-06-28.
*
\**************************************************************************************************/

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Utils_misc
{
   // Public functions. -----------------------------------------------------------------------//

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
   public static function debugMsg()
   {  
   }

   /*
    * 
    */
   public static function errorMsg()
   {
   }

   /*
    *
    */
   public static function arrayValueOrNull($key, $array)
   {
      return (array_key_exists($key, $array))? $array[$key]: null;
   }

   /*
    *
    */
   public static function arrayValueOrZero($key, $array)
   {
      return (array_key_exists($key, $array))? $array[$key]: 0;
   }

   /*
    *
    */
   public static function arrayValueOrBlank($key, $array)
   {
      return (array_key_exists($key, $array))? $array[$key]: '';
   }

   /*
    *
    */
   public static function arrayValueOrDefault($key, $array, $default)
   {
      return (array_key_exists($key, $array))? $array[$key]: $default;
   }

   /*
    * $var = Utils_misc::switchAssign
    * (
    *    $inputValue, $defaultValue, array
    *    (
    *       'case1' => $outputValue1,
    *       'case2' => $outputvalue2
    *    )
    * );
    */
   public static function switchAssign($inputValue, $defaultOutputValue, $outputValueByInputValue)
   {
      if (array_key_exists($inputValue, $outputValueByInputValue))
      {
         return $outputValueByInputValue[$inputValue];
      }

      return $defaultOutputValue;
   }

   /*
    * Particularly useful for passing on $_GET parameters.
    */
   public static function createGetStringFromArray($array, $questionMarkOrAmpersand = '?')
   {
      if ($questionMarkOrAmpersand != '?' && $questionMarkOrAmpersand != '&')
      {
         throw new Exception("Expected '?' or '&'.  Received '$questionMarkOrAmpersand'.");
      }

      if (count($array) == 0)
      {
         return '';
      }

      $strs = array();

      foreach ($array as $key => $value)
      {
         $strs[] = "$key=" . urlencode($value);
      }

      return $questionMarkOrAmpersand . implode('&', $strs);
   }

   /*
    * Particularly useful for passing on $_POST parameters.
    */
   public static function echoArrayAsHiddenInputs($array, $indent)
   {
      foreach ($array as $key => $value)
      {
         echo "$indent<input type='hidden' name='$key' value='$value'/>\n";
      }
   }

   /*
    * Particularly useful for passing on $_POST parameters.
    */
   public static function getArrayAsHiddenInputsHtml($array, $indent)
   {
      $html = '';

      foreach ($array as $key => $value)
      {
         $html .= "$indent<input type='hidden' name='$key' value='$value'/>\n";
      }

      return $html;
   }
}

/*******************************************END*OF*FILE********************************************/
?>
