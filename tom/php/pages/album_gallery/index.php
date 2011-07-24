<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "index.php"
*
* Project: Common pages - Contact Me.
*
* Purpose: Display an email contact form whose configuration depends on $_POSTed data.
*
* Author: Tom McDonnell 2009-04-25.
*
\**************************************************************************************************/

// Settings. ///////////////////////////////////////////////////////////////////////////////////////

session_start();

ini_set('display_errors'        , '1');
ini_set('display_startup_errors', '1');

error_reporting(-1);

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../utils/Utils_validator.php';
require_once dirname(__FILE__) . '/../../utils/Utils_misc.php';
require_once dirname(__FILE__) . '/../../utils/Utils_file.php';

// Global variables. ///////////////////////////////////////////////////////////////////////////////

$FILES_JS          = array();
$FILES_CSS         = array();
$PAGE_TITLE        = null;
$PAGE_HEADING      = null;
$BACK_ANCHOR_HREF  = null;
$BACK_ANCHOR_TEXT  = null;

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   Utils_validator::checkArray($_GET, array('path' => 'nonEmptyString'));

   

   foreach (array_filter(glob("{$_GET['path']}/*"), 'is_dir') as $dir)
   {
      $fileNames = glob("$dir/info.txt");

      if (count($fileNames) != 1)
      {
         throw new Exception("Zero or multiple files named 'info.txt' found in directory '$dir'.");
      }

      $lines      = file($fileNames[0]);
      $year       = $lines[0];
      $title      = $lines[1];
      $desc       = $lines[2];
      $trackNames = array();

      for ($i = 3; $i < count($lines); ++$i)
      {
         $trackNames[] = $lines[$i];
      }

      $PAGE_TITLE   = $title;
      $PAGE_HEADING = $title;
   }
}
catch (Exception $e)
{
   echo $e;
}

// HTML. ///////////////////////////////////////////////////////////////////////////////////////////
?>
<!DOCTYPE html PUBLIC
 "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
 <head>
<?php
 $unixTime = time();
 foreach ($FILES_JS  as $file) {echo "  <script src='$file?$unixTime'></script>\n"         ;}
 foreach ($FILES_CSS as $file) {echo "  <link rel='stylesheet' href='$file?$unixTime' />\n";}
?>
  <title><?php echo $PAGE_TITLE; ?></title>
 </head>
 <body>
  <a href='<?php echo $BACK_ANCHOR_HREF; ?>' /><?php echo $BACK_ANCHOR_TEXT; ?></a>
  <h1><?php echo $PAGE_HEADING; ?></h1>
 </body>
</html>
<?php
/*******************************************END*OF*FILE********************************************/
?>
