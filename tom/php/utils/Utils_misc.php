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
    * Usage example:
    *    $var = Utils_misc::switchAssign
    *    (
    *       $inputValue, array
    *       (
    *          'case1' => $outputValue1,
    *          'case2' => $outputvalue2
    *       )
    *    );
    *
    * @param $defaultOutputValue {any type}
    *     This parameter is optional.  If it is not supplied, then there will be no output value
    *     for the default case specified and so an exception will be thrown in the default case.
    */
   public static function switchAssign(
      $inputValue, $outputValueByInputValue, $defaultOutputValue = null
   )
   {
      if (array_key_exists($inputValue, $outputValueByInputValue))
      {
         return $outputValueByInputValue[$inputValue];
      }

      // Note on Use of func_num_args() Below
      // ------------------------------------
      // Function func_num_args() is used below instead of checking if $defaultOutputValue is its
      // default value as set in this function's parameters list.  This is done so that the default
      // value of $defaultOutputValue may be used as an actual default output value and not just as
      // an indicator that an exception should be thrown in the default case.
      if (func_num_args() == 3)
      {
         return $defaultOutputValue;
      }

      throw new Exception
      (
         "Case '$inputValue' not handled in switchAssign and no default supplied."
      );
   }
}

/*******************************************END*OF*FILE********************************************/
?>
