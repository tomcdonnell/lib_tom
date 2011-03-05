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

   /*
    * @param $maxRowsForSingleColumn
    * @param $maxColumns
    *    See code for how table dimensions are affected by these two parameters.
    */
   public static function getStringsAsHtmlTable
   (
      $strings, $indent, $maxRowsForSingleColumn = 5, $maxColumns = 5,
      $className = 'tableColsSameNoHeading'
   )
   {
      if (count($strings) == 0)
      {
         return '';
      }

      $n_strings = count($strings);
      $tableType =
      (
         ($n_strings <= $maxRowsForSingleColumn)? 'small':
         (
            ($n_strings <= $maxRowsForSingleColumn * $maxColumns)? 'medium': 'large'
         )
      );

      switch ($tableType)
      {
       case 'small':
         $n_cols = 1;
         $n_rows = $n_strings;
         break;
       case 'medium':
         $n_rows = ceil(sqrt($n_strings));
         $n_cols = $n_rows;
         break;
       case 'large':
         $n_cols = $maxColumns;
         $n_rows = ceil($n_strings / $n_cols);
         break;
       default:
         throw new Exception('Unexpected case.');
      }

      $twoDimStringsArray = self::fill2dArrayMaintainingColumnOrder($strings, $n_rows, $n_cols);

      $i     = &$indent;
      $html  = "$i<table class='$className'>\n";
      $html .= "$i <tbody>\n";

      foreach ($twoDimStringsArray as $strings)
      {
         $html .= "$i  <tr>";

         foreach ($strings as $string)
         {
            $html .= "<td>$string</td>";
         }

         $html .= "</tr>\n";
      }

      $html .= "$i </tbody>\n";
      $html .= "$i</table>\n";

      return $html;
   }

   /*
    * Given a two dimensional array having continuous integer keys starting at zero, the arrays
    * inside which also meet this restriction, return a new array which is the given array with
    * rows swapped with columns.
    */
   public static function transpose($arrayIn)
   {
      if (count($arrayIn) == 0)
      {
         return array();
      }

      $firstRow = $arrayIn[0];
      $n_rows   = count($arrayIn );
      $n_cols   = count($firstRow);
      $arrayOut = array_fill(0, $n_cols, array());

      for ($r = 0; $r < $n_rows; ++$r)
      {
         for ($c = 0; $c < $n_cols; ++$c)
         {
            $arrayOut[$c][$r] = $arrayIn[$r][$c];
         }
      }

      return $arrayOut;
   }

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    * Eg. Given $array       = array('one', 'two', 'three', 'four', 'five');
    *           $n_rows      = 2;
    *           $n_cols      = 2;
    *           $fillerValue = '';
    *
    *     Return array
    *     (
    *        array('one'  , 'four'),
    *        array('two'  , 'five'),
    *        array('three', ''    )
    *     );
    *
    */
   private static function fill2dArrayMaintainingColumnOrder
   (
      $values, $n_rows, $n_cols, $fillerValue = ''
   )
   {
      $valuesArray = array();
      $n_values    = count($values);
      $n           = -1;

      if ($n_values > $n_rows * $n_cols)
      {
         throw new Exception('Too many values for given array dimensions.');
      }

      for ($c = 0; $c < $n_cols; ++$c)
      {
         $valuesArray[$c] = array();

         for ($r = 0; $r < $n_rows; ++$r)
         {
            $valuesArray[$c][$r] = (++$n < $n_values)? $values[$n]: $fillerValue;
         }
      }

      return self::transpose($valuesArray);
   }
}

/*******************************************END*OF*FILE********************************************/
?>
