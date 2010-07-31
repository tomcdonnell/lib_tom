<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Utils_htmlForm.php"
*
* Project: Utilities.
*
* Purpose: Miscellaneous utilities.
*
* Author: Tom McDonnell 2010-02-28.
*
\**************************************************************************************************/

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Utils_htmlForm
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
    * @param $options {Array}
    *    array
    *    (
    *       <string optionValue> => <string optionText>
    *       ...
    *    )
    */
   public static function echoSelectorHtml($name, $options, $indent, $selectedOptionValue = null)
   {
      $i = $indent; // Abbreviation.

      echo "$i<select name='$name'>\n";

      foreach ($options as $value => $text)
      {
         $selectedStr = ($value == $selectedOptionValue)? ' selected="selected"': '';
         echo "$i <option value='$value'$selectedStr>$text</option>\n";
      }

      echo "$i</select>\n";
   }
}

/*******************************************END*OF*FILE********************************************/
?>
