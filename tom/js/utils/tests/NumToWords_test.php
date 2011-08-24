<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go -=b
*
* Filename: "NumToWords_test.php"
*
* Project: Tests
*
* Purpose: Test NumToWords.js
*
* Author: Tom McDonnell 2011-08-24.
*
\**************************************************************************************************/

// Global variables. ///////////////////////////////////////////////////////////////////////////////

$filenamesCss = array
(
   'style.css'
);

$filenamesJs = array
(
   '../../contrib/jquery/1.5/jquery_minified.js',
   '../../contrib/utils/DomBuilder.js'          ,
   '../NumToWords.js'                           ,
   '../NumToWordsTester.js'
);

// HTML code. //////////////////////////////////////////////////////////////////////////////////////
?>
<!DOCTYPE html PUBLIC
 "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
 <head>
<?php
 $timestamp = time();
 foreach ($filenamesCss as $filename)
 {
?>
  <link rel='stylesheet' type='text/css' href='<?php echo "$filename?$timestamp"; ?>'/>
<?php
 }

 foreach ($filenamesJs as $filename)
 {
?>
  <script type='text/javascript' src='<?php echo "$filename?$timestamp"; ?>'></script>
<?php
 }
?>
  <title>NumToWords Test</title>
 </head>
 <body>
  <h1>NumToWords Test</h1>
 </body>
</html>
<?php
/*******************************************END*OF*FILE********************************************/
?>
