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
   public static function getHtmlScriptTagsForJsFiles
   (
      Array $jsFilenamesWithFullPath, $indent = '  '
   )
   {
      // A unix timestamp to append as an unused $_GET variable to the
      // end of every JS filename so that cached files are not used.
      $timeUnix = time();
      $html     = '';

      foreach ($jsFilenamesWithFullPath as $filename)
      {
         $html .= "$indent<script type='text/javascript'";
         $html .= " src='" . self::escapeSingleQuotes($filename) . "?$timeUnix'></script>\n";
      }

      return $html;
   }

   /*
    *
    */
   public static function getHtmlLinkTagsForCssFiles
   (
      Array $cssFilenamesWithFullPath, $indent = '  ', Array $extraAttributeValueByName = array()
   )
   {
      // A unix timestamp to append as an unused $_GET variable to the
      // end of every JS filename so that cached files are not used.
      $timeUnix = time();
      $html     = '';

      foreach ($cssFilenamesWithFullPath as $filename)
      {
         $html .= "$indent<link rel='stylesheet' type='text/css'";

         foreach ($extraAttributeValueByName as $name => $value)
         {
            $html .= " $name='" . self::escapeSingleQuotes($value) . "'";
         }

         $html .= " href='" . self::escapeSingleQuotes($filename) . "?$timeUnix'/>\n";
      }

      return $html;
   }

   /*
    *
    */
   public static function getHtmlScriptAndLinkTagsForJsAndCssFiles
   (
      Array $cssFilenamesWithFullPath, Array $jsFilenamesWithFullPath, $indent = '  '
   )
   {
      $html  = self::getHtmlScriptTagsForJsFiles($jsFilenamesWithFullPath, $indent);
      $html .= self::getHtmlLinkTagsForCssFiles($cssFilenamesWithFullPath, $indent);

      return $html;
   }


   /*
    *
    */
   public static function echoHtmlScriptTagsForJsFiles
   (
      Array $jsFilenamesWithFullPath, $indent = '  '
   )
   {
      echo self::getHtmlScriptTagsForJsFiles($jsFilenamesWithFullPath, $indent);
   }

   /*
    *
    */
   public static function echoHtmlLinkTagsForCssFiles
   (
      Array $cssFilenamesWithFullPath, $indent = '  ', Array $extraAttributeValueByName = array()
   )
   {
      echo self::getHtmlLinkTagsForCssFiles
      (
         $cssFilenamesWithFullPath, $indent, $extraAttributeValueByName
      );
   }

   /*
    *
    */
   public static function echoHtmlScriptAndLinkTagsForJsAndCssFiles
   (
      Array $cssFilenamesWithFullPath, Array $jsFilenamesWithFullPath, $indent = '  '
   )
   {
      echo self::getHtmlScriptAndLinkTagsForJsAndCssFiles
      (
         $cssFilenamesWithFullPath, $jsFilenamesWithFullPath, $indent
      );
   }

   /*
    *
    */
   public static function getHtmlForElement(Array $params)
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
   public static function echoHtmlForElement(Array $params)
   {
      echo self::getHtmlForElement($params);
   }
}

/*******************************************END*OF*FILE********************************************/
?>
