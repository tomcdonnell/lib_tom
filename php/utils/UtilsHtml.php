<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "UtilsHtml.php"
*
* Project: Utilities.
*
* Purpose: Miscellaneous utilities.
*
* Author: Tom McDonnell 2011-06-07.
*
\**************************************************************************************************/

require_once dirname(__FILE__) . '/UtilsValidator.php';

/*
 *
 */
class UtilsHtml
{
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
    * Eg. <input type='text' value='<?php echo UtilsHtml::escapeSingleQuotes("I'm stringy."); ?>'/>
    */
   public static function escapeSingleQuotes($string)
   {
      return str_replace("'", htmlentities("'", ENT_QUOTES), $string);
   }

   /*
    *
    */
   public static function echoHtmlScriptTagsForJsFiles($jsFilenamesWithFullPath, $indent = '  ')
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
      $cssFilenamesWithFullPath, $indent = '  ', $extraAttributeValueByName = array()
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

   /*
    *
    */
   public static function getHtmlForElement($params)
   {
      UtilsValidator::checkArray
      (
         $params, array
         (
            'attributeValueByKey' => 'array' ,
            'indent'              => 'string',
            'tagName'             => 'string',
            'value'               => 'string'
         )
      );
      extract($params);

      $html             = "$indent<$tagName";
      $attributeStrings = array();

      foreach ($attributeValueByKey as $attrKey => $attrValue)
      {
         if ($attrValue !== null)
         {
            $attributeStrings[] = "$attrKey='" . self::escapeSingleQuotes($attrValue) . "'";
         }
      }

      if (count($attributeValueByKey) > 0)
      {
         $html .= ' ' . implode(' ', $attributeStrings);
      }

      $html .= '>' . htmlentities($value) . "</$tagName>";

      if ($indent != '')
      {
         $html .= "\n";
      }

      return $html;
   }

   /*
    *
    */
   public static function echoHtmlForElement($params)
   {
      echo self::getHtmlForElement($params);
   }

   /*
    *
    */
   public static function echoHtmlScriptAndLinkTagsForJsAndCssFiles
   (
      $cssFilenamesWithFullPath, $jsFilenamesWithFullPath, $indent = '  '
   )
   {
      self::echoHtmlScriptTagsForJsFiles($jsFilenamesWithFullPath, $indent);
      self::echoHtmlLinkTagsForCssFiles($cssFilenamesWithFullPath, $indent);
   }
}

/*******************************************END*OF*FILE********************************************/
?>
