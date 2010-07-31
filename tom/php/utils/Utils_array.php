<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Utils_array.php"
*
* Project: Utilities.
*
* Purpose: Utilities pertaining to arrays.
*
* Author: Tom McDonnell 2010-06-18.
*
\**************************************************************************************************/

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Utils_array
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

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
   public static function arraysAreEqual($a, $b)
   {
      assert('is_array($a) && is_array($b)');

      if (count($a) != count($b))
      {
         return false;
      }

      $count = count($a);

      for ($i = 0; $i < $count; ++$i)
      {
         if ($a[$i] != $b[$i])
         {
            return false;
         }
      }

      return true;
   }

   /*
    *
    */
   public static function rtrim($a, $blankValue = '', $boolPreserveKeys = false)
   {
      assert('is_array($a)');

      for ($i = count($a) - 1; $i >= 0; --$i)
      {
         if ($a[$i] != $blankValue)
         {
            break;
         }
      }

      return array_slice($a, 0, $i, $boolPreserveKeys);
   }
}

/*******************************************END*OF*FILE********************************************/
?>
