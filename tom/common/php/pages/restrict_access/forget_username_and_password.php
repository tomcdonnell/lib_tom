<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "forget_username_and_password.php"
*
* Project: Security.
*
* Purpose: Include this file at the top of any web page to clear any authentication information
*          stored in the relevant $_SESSION by the 'require_username_and_password.php' script.
*
* Author: Tom McDonnell 2010-06-28.
*
\**************************************************************************************************/

// Settings. ///////////////////////////////////////////////////////////////////////////////////////

error_reporting(E_ALL ^ E_STRICT);
session_start();

unset($_SESSION['__authentication']);

// HTML code. //////////////////////////////////////////////////////////////////////////////////////
?>
<!DOCTYPE html PUBLIC
 "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
 <head><title>Authentication Details Deleted</title></head>
 <body>
  <h1>Authentication Details Deleted</h1>
  <p>The username and password you previously provided have now been deleted.</p>
  <p>
   Do not be alarmed, this just means that the next time you attempt to access a
   restricted page, you will be prompted to provide your username and password again.
  </p>
 </body>
</html>
<?php
/*******************************************END*OF*FILE********************************************/
?>
