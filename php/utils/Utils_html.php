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

   /*
    *
    */
   public static function echoHtmlScriptTagsForJsFiles($jsFilenamesWithFullPath, $indent)
   {
      // A unix timestamp to append as an unused $_GET variable to the
      // end of every JS filename so that cached files are not used.
      $timeUnix = time();

      foreach ($jsFilenamesWithFullPath as $filename)
      {
         echo "$indent<script type='text/javascript'";
         echo " src='", self::escapeSingleQuotes($filename), "?$timeUnix'></script>\n";
      }
   }

   /*
    *
    */
   public static function echoHtmlLinkTagsForCssFiles
   (
      $cssFilenamesWithFullPath, $indent, $extraAttributeValueByName = array()
   )
   {
      // A unix timestamp to append as an unused $_GET variable to the
      // end of every JS filename so that cached files are not used.
      $timeUnix = time();

      foreach ($cssFilenamesWithFullPath as $filename)
      {
         echo "$indent<link rel='stylesheet' type='text/css'";

         foreach ($extraAttributeValueByName as $name => $value)
         {
            echo " $name='", self::escapeSingleQuotes($value), "'";
         }

         echo " href='", self::escapeSingleQuotes($filename), "?$timeUnix'/>\n";
      }
   }
}

/*******************************************END*OF*FILE********************************************/
?>
