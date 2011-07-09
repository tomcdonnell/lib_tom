<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Utils_html.php"
*
* Project: Utilities.
*
* Purpose: Miscellaneous utilities.
*
* Author: Tom McDonnell 2011-06-07.
*
\**************************************************************************************************/

require_once dirname(__FILE__) . '/Utils_validator.php';

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Utils_html
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
    * Use this when inserting string into HTML value attributes.
    *
    * Eg. <input type='text' value='<?php echo Utils_html::escapeSingleQuotes("I'm stringy."); ?>'/>
    */
   public static function escapeSingleQuotes($string)
   {
      return str_replace("'", htmlentities("'", ENT_QUOTES), $string);
   }
}

/*******************************************END*OF*FILE********************************************/
?>
