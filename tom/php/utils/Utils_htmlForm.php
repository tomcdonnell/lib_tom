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
   public static function getSelectorHtml
   (
      $name, $options, $indent, $selectedOptionValue = null, $class = null, $boolDisabled = false
   )
   {
      $i           = &$indent;
      $classStr    = ($class === null)? ''                     : "class='$class'";
      $disabledStr = ($boolDisabled  )? 'disabled=\'disabled\'': ''              ;

      $html = "$i<select name='$name'$disabledStr$classStr>\n";

      foreach ($options as $value => $text)
      {
         $selectedStr = ($value == $selectedOptionValue)? ' selected="selected"': '';
         $html .= "$i <option value='$value'$selectedStr>$text</option>\n";
      }

      $html .= "$i</select>\n";

      return $html;
   }

   /*
    *
    */
   public static function echoSelectorHtml
   (
      $name, $options, $indent, $selectedOptionValue = null, $class = null, $boolDisabled = false
   )
   {
      echo self::getSelectorHtml
      (
         $name, $options, $indent, $selectedOptionValue, $class, $boolDisabled
      );
   }

   /*
    *
    */
   public static function echoTextareaHtml
   (
      $name, $indent,
      $value = '', $class = null, $n_rows = null, $n_cols = null, $boolDisabled = false
   )
   {
      $rowsStr     = ($n_rows === null)? '': "rows='$n_rows'";
      $colsStr     = ($n_cols === null)? '': "cols='$n_cols'";
      $classStr    = ($class  === null)? '': "class='$class'";
      $disabledStr = ($boolDisabled   )? "disabled='disabled'": '';

      echo "$indent<textarea name='$name'$classStr$rowsStr$colsStr$disabledStr>$value</textarea>\n";
   }

   /*
    *
    */
   public static function echoCheckboxHtml($name, $indent, $boolChecked = false, $class = null)
   {
      $classStr   = ($class  === null)? '': "class='$class'"   ;
      $checkedStr = ($boolChecked    )? "checked='checked'": '';

      echo "$indent<input type='checkbox' name='$name'$classStr$checkedStr/>\n";
   }

   /*
    * Particularly useful for passing on $_GET parameters.
    *
    * TODO
    * ----
    * See php native function http_build_query().  That function
    * appears to do almost exactly whtat this one does.
    *
    * TODO: Check sugarCRM reports carefully for dependencies on this function before pushing live.
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
               echo "$indent<input type='hidden' name='$key' value='$arrayValue'/>\n";
            }
         }
         else
         {
            echo "$indent<input type='hidden' name='$key' value='$value'/>\n";
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
<!DOCTYPE html PUBLIC
 "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
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
  <form name='redirectForm' action='<?php echo $postUrl ?>' method='post'>
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
