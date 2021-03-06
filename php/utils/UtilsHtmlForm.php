<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "UtilsHtmlForm.php"
*
* Project: Utilities.
*
* Purpose: Utilities pertaining to generation of HTML for forms.
*
* Author: Tom McDonnell 2010-02-28.
*
\**************************************************************************************************/

require_once dirname(__FILE__) . '/UtilsHtml.php';
require_once dirname(__FILE__) . '/UtilsValidator.php';

/*
 *
 */
class UtilsHtmlForm
{
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
    *       <string optionValue> =>
    *          <string optionText OR array('text' => <string>, 'title' => <string>)>
    *       ...
    *    )
    */
   public static function getSelectorHtml
   (
      $nameAndId, $options, $instructionOptionArray = null,
      $indent, $selectedOptionValue = null, $class = null, $boolDisabled = false
   )
   {
      // Selected option value must be null (if no option is to be selected by this function), or
      // a string.  This is to avoid confusion due to bizarre behaviour of PHP loose comparisons.
      // ('' == 0) === true.  ('0' == 0) === true.  ('php' == 0) === true.  ('1' == 0) === false.
      // So if there are options with values '0' and 'blank', and the $selectedOptionValue is given
      // as 0, both would be selected if loose comparisons were used.
      // See http://www.php.net/manual/en/types.comparisons.php.
      UtilsValidator::checkType($selectedOptionValue, 'nullOrString');

      $i                       = &$indent;
      $classStr                = ($class === null)? ''                      : " class='$class'";
      $disabledStr             = ($boolDisabled  )? ' disabled=\'disabled\'': ''               ;
      $boolFoundSelectedOption = false;

      $html = "$i<select name='$nameAndId' id='$nameAndId'$disabledStr$classStr>\n";

      if ($instructionOptionArray !== null)
      {
         $value = $instructionOptionArray[0];
         $text  = $instructionOptionArray[1];

         if (array_key_exists($value, $options))
         {
            throw new Exception("Value supplied for instruction option '$value' already exists.");
         }

         // NOTE: This is not the same as array_merge(array($value => $text), $options)).
         $options = array_combine
         (
            array_merge(array($value), array_keys($options)  ),
            array_merge(array($text ), array_values($options))
         );
      }

      if (array_key_exists('', $options))
      {
         throw new Exception
         (
            'Option with empty string key found.  Use of this key is not allowed because the' .
            ' Firefox browser confuses options having zero key with options having blank key.'
         );
      }

      foreach ($options as $value => $text)
      {
         if (is_array($text))
         {
            UtilsValidator::checkArray($text, array('text' => 'string', 'title' => 'string'));
            $title = $text['title'];
            $text  = $text['text' ];
         }
         else
         {
            $title = '';
         }

         // Convert $value to string to ensure that all comparisons are string::string and so
         // avoid loose comparison confusion.  Eg. ('' == 0) === true.  ('blank' == 0) === true.
         $value = (string)$value;

         if ($selectedOptionValue !== null && $selectedOptionValue == $value)
         {
            $boolFoundSelectedOption = true;
            $selectedStr             = ' selected="selected"';
         }
         else
         {
            $selectedStr = '';
         }

         $html .=
         (
            "$i <option value='" . UtilsHtml::escapeSingleQuotedAttribute($value) . "'$selectedStr".
            (($title == '')? '': " title='$title'") . ">" . htmlentities($text) . "</option>\n"
         );
      }

      $html .= "$i</select>\n";

      if ($selectedOptionValue !== null && !$boolFoundSelectedOption)
      {
         throw new Exception("Could not find option with value '$selectedOptionValue'.");
      }

      return $html;
   }

   /*
    *
    */
   public static function echoSelectorHtml
   (
      $nameAndId, $options, $instructionOptionArray = null,
      $indent, $selectedOptionValue = null, $class = null, $boolDisabled = false
   )
   {
      echo self::getSelectorHtml
      (
         $nameAndId, $options, $instructionOptionArray,
         $indent, $selectedOptionValue, $class, $boolDisabled
      );
   }

   /*
    *
    */
   public static function echoTextareaHtml
   (
      $name, $indent,
      $value = '', $class = null, $nRows = null, $nCols = null, $boolDisabled = false
   )
   {
      echo "$indent<textarea name='", UtilsHtml::escapeSingleQuotedAttribute($name), "'";

      if ($nRows !== null) {echo " rows='" , UtilsHtml::escapeSingleQuotedAttribute($nRows), "'";}
      if ($nCols !== null) {echo " cols='" , UtilsHtml::escapeSingleQuotedAttribute($nCols), "'";}
      if ($class !== null) {echo " class='", UtilsHtml::escapeSingleQuotedAttribute($class), "'";}
      if ($boolDisabled  ) {echo " disabled='disabled'"                                 ;}

      echo '>', htmlentities($value), "</textarea>\n";
   }

   /*
    *
    */
   public static function echoCheckboxHtml($name, $indent, $boolChecked = false, $class = null)
   {
      echo "$indent<input type='checkbox' name='",UtilsHtml::escapeSingleQuotedAttribute($name),"'";

      if ($class !== null) {echo " class='", UtilsHtml::escapeSingleQuotedAttribute($class), "'";}
      if ($boolChecked   ) {echo " checked='checked'"                                   ;}

      echo "/>\n";
   }

   /*
    * Particularly useful for passing on $_GET parameters.
    *
    * TODO
    * ----
    * See php native function http_build_query().  That function
    * appears to do almost exactly what this one does.
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
    * Particularly useful for passing on $_POST parameters.
    */
   public static function echoArrayAsHiddenInputs($array, $indent)
   {
      foreach ($array as $key => $value)
      {
         if (is_array($value))
         {
            $key .= '[]';

            foreach ($value as $arrayValue)
            {
               echo "$indent<input type='hidden'";
               echo " name='" , UtilsHtml::escapeSingleQuotedAttribute($key       ), "'";
               echo " value='", UtilsHtml::escapeSingleQuotedAttribute($arrayValue), "'/>\n";
            }
         }
         else
         {
            echo "$indent<input type='hidden'";
            echo " name='" , UtilsHtml::escapeSingleQuotedAttribute($key  ), "'";
            echo " value='", UtilsHtml::escapeSingleQuotedAttribute($value), "'/>\n";
         }
      }
   }

   /*
    * TODO
    * ----
    * Consider using cURL to accomplish this task.  See the following url for details.
    *  * http://stackoverflow.com/questions/2865289/php-redirection-with-post-parameters
    */
   public static function redirectToUrlIncludingGetAndPostParams
   (
      $redirectUrl, $alternateGet = null, $alternatePost = null
   )
   {
      $getArray  = ($alternateGet  === null)? $_GET : $alternateGet ;
      $postArray = ($alternatePost === null)? $_POST: $alternatePost;
      $postUrl   = $redirectUrl . self::createGetStringFromArray($getArray, '&');

      if (count($postArray) == 0)
      {
         // Nothing in $postArray, so a redirect using the header() function will suffice.
         header("Location: $postUrl");
         exit(0);
      };
?>
<!DOCTYPE html>
<html>
 <head>
  <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>
  <title>Redirecting...</title>
 </head>
 <body onload='document.redirectForm.submit()'>
  <h1>Redirecting...</h1>
  <p>This page is intended to redirect to another page immediately upon loading.</p>
  <p>
   If no redirection has occurred after a few seconds, then javascript may be disabled in your
   browser.  In that case you should click the 'Continue' button below.
  </p>
  <form name='redirectForm' method='post'
   action='<?php echo UtilsHtml::escapeSingleQuotedAttribute($postUrl); ?>'>
<?php
      self::echoArrayAsHiddenInputs($postArray, '   ');
?>
   <input type='submit' value='Continue'/>
  </form>
  <p>
   If the submit button has been clicked and still no redirection appears to have occurred, the
   reason could be that the page to which the redirection was intended does not display HTML
   content.  This situation can occur for example if a file download has been attempted.
  </p>
  <p>In any case do not be alarmed!  No doubt the universe is unfolding as it should.</p>
 </body>
</html>
<?php
      exit(0);
   }
}

/*******************************************END*OF*FILE********************************************/
?>
