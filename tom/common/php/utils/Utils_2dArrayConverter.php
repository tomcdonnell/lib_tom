<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "Util_2dArrayConverter.php"
*
* Project: Utilities.
*
* Purpose: Utilities for converting two dimensional arrays containing text to CSV or HTML table
*          format.
*
* Author: Tom McDonnell 2010-06-15.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Utils_2dArrayConverter
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
            $valuesEnclosed[] = Utils_string::escapeAndEnclose($value, '"');
         }

         $csv .= implode(',', $valuesEnclosed) . "\n";
      }

      return $csv;
   }

   /*
    *
    */
   public static function toHtml($array2d, $indent = '  ')
   {
      $i = &$indent;

      $html  = "$i<table>\n";
      $html .= "$i <tbody>\n";

      foreach ($array2d as $row)
      {
         $valuesEnclosed = array();

         foreach ($row as $value)
         {
            $valuesEnclosed[] = Utils_string::encloseInTdTags($value);
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
