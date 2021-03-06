<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "Utils2dArrayConverter.php"
*
* Project: Utilities.
*
* Purpose: Utilities for converting two dimensional arrays containing text to CSV or HTML table
*          format.
*
* Author: Tom McDonnell 2010-06-15.
*
\**************************************************************************************************/

require_once dirname(__FILE__) . '/UtilsString.php';

/*
 *
 */
class Utils2dArrayConverter
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   public function __construct(DatabaseConnection $dbc, $idCase)
   {
      throw new Exception('This function is not intended to be instantiated.');
   }

   /*
    *
    */
   public static function toCsv($array2d)
   {
      $csv = '';

      foreach ($array2d as $row)
      {
         $valuesEnclosed = array();

         foreach ($row as $value)
         {
            $valuesEnclosed[] = UtilsString::escapeAndEnclose($value, '"');
         }

         $csv .= implode(',', $valuesEnclosed) . "\n";
      }

      return $csv;
   }

   /*
    *
    */
   public static function toHtml($array2d, $indent = '  ', $class = null)
   {
      $i = &$indent;

      $html  = "$i<table" . (($class === null)? '': " class='$class'") . ">\n";
      $html .= "$i <tbody>\n";

      foreach ($array2d as $row)
      {
         $valuesEnclosed = array();

         foreach ($row as $value)
         {
            $valuesEnclosed[] = UtilsString::encloseInTdTags($value);
         }

         $html .= "$i  <tr>" . implode($valuesEnclosed) . "</tr>\n";
      }

      $html .= "$i </tbody>\n";
      $html .= "$i</table>\n";

      return $html;
   }
}

/*******************************************END*OF*FILE********************************************/
?>
