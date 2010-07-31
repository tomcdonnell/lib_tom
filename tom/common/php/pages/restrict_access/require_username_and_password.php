<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "require_username_and_password.php"
*
* Project: Security.
*
* Purpose: Include this file at the top of any web page (before any other 'include' or 'require'
*          lines, and before any session directives) to restrict access to that web page to
*          those with a username and matching password.
*
*          A blacklist and whitelist of users may also be provided in text files.  See below for
*          details.
*
*          The reason that this page should be included before any other 'include' or 'require'
*          lines, and before any session directives, is that this page starts its own session,
*          and then closes it by calling session_write_close() if access is granted. (If access is
*          not granted, then the session will close and be written to when the script terminates).
*          If another session was started in the restricted file or in a file included from the
*          restricted file before the session for this file was started, then a 'session already
*          started' warning would result when this page attempted to start its session, the data to
*          be stored in the session for this page would instead be stored in the other session, and
*          so this page would not function correctly.
*
*          This script works by prompting the user for a username and password if the username is
*          not already stored in $_SESSION, and exiting with an 'Access Denied' message if the
*          username and password are incorrect.  If the username and password are correct, this
*          script does nothing (or acts so as to appear to do nothing), and so the execution of the
*          page from which this script was included (the restricted page) is allowed to continue
*          just as if this script had not been included.  Any parameters intended to be passed to
*          the restricted page are not interrupted by the display of the username and password
*          form, because that form reads and passes on all contents of the $_GET and $_POST arrays.
*          (The behaviour described relating to $_GET and $_POST parameters is what was meant by
*          'acting so as to appear to do nothing').
*
* Author: Tom McDonnell 2010-06-23.
*
* -------------------------------------------------------------------------------------------------
*
*    Whitelists / Blacklists
*
*    This script will check the directory from which it was included for the presence of two text
*    files: 'usernames_whitelist.txt' and 'usernames_blacklist.txt'.  These files, if present, are
*    expected to contain a list of usernames, one per line.
*
*    The authentication behaviour relating to the whitelist and blacklist is explained below.
*
*    * If neither whitelist nor blacklist is supplied,
*      Access granted only to users with correct password.
*
*    * If only whitelist is supplied,
*      Access granted only to users with correct password whose usernames are in whitelist.
*
*    * If only blacklist supplied,
*      Access granted only to users with correct password whose usernames are not in blacklist.
*
*    * If both whitelist and blacklist are supplied,
*      Access granted only to users with correct password whose usernames are in whitelist and
*      are not in blacklist.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/assert_cookies_enabled.php';
require_once dirname(__FILE__) . '/../../utils/Utils_file.php';
require_once dirname(__FILE__) . '/../../utils/Utils_misc.php';

// Defines. ////////////////////////////////////////////////////////////////////////////////////////

define('N_MINUTES_UNTIL_FORGET_AUTHENTICATION', 10);

define('WHITELIST_FILENAME', 'usernames_whitelist.txt');
define('BLACKLIST_FILENAME', 'usernames_blacklist.txt');

// Settings. ///////////////////////////////////////////////////////////////////////////////////////

error_reporting(E_ALL ^ E_STRICT);
session_start();

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   // Note Regarding $_SESSION Parameters
   // -----------------------------------
   // Even though this page is designed to be the first script included in the page whose access is
   // to be restricted, this script must not initialise the entire $_SESSION array.  The reason is
   // that $_SESSION data may be intended to persist beyond the lifetime of a script.  In general,
   // each script to make use of the $_SESSION array should only modify variables inside an array
   // accessible by a single $_SESSION key.  The $_SESSION key chosen should be unique to the
   // script.
   if (!array_key_exists('__authentication', $_SESSION)) {$_SESSION['__authentication'] = array();}

   // Note Regarding $_GET and $_POST Parameters
   // ------------------------------------------
   // This script does not use $_GET parameters, but must not place restrictions on what $_GET
   // parameters may have been passed.  The reason is that this script is designed to be included
   // in arbitrary scripts that may make use of $_GET parameters.  Likewise, although this script
   // does use $_POST parameters, it must not let these interfere with any $_POSTed parameters used
   // by the restricted script.  Therefore no restrictions are placed on what can be passed to this
   // script by either the $_GET or the $_POST method, and the $_POSTed parameters used by this
   // script are unset once the user has been authenticated.

   if (array_key_exists('sessionCreateTimeUnix', $_SESSION['__authentication']))
   {
      if
      (
         time() - (int)$_SESSION['__authentication']['sessionCreateTimeUnix'] >
         N_MINUTES_UNTIL_FORGET_AUTHENTICATION * 60
      )
      {
         session_destroy();
      }
   }

   $username =
   (
      (array_key_exists('authenticatedUsername', $_SESSION['__authentication']))?
      $_SESSION['__authentication']['authenticatedUsername']: null
   );

   $whitelist = getLinesAsArrayFromFile(WHITELIST_FILENAME);
   $blacklist = getLinesAsArrayFromFile(BLACKLIST_FILENAME);

   $previouslyAuthenticated = ($username === null)? '0': '1';
   $detailsSuppliedViaPost  =
   (
      array_key_exists('username', $_POST) &&
      array_key_exists('password', $_POST)
   )? '1': '0';

   switch ("$previouslyAuthenticated-$detailsSuppliedViaPost")
   {
    case '0-0':
      echoSoeIdAndPasswordFormHtml($whitelist, $blacklist);
      exit(0);
    case '0-1':
      $username = dealWithCaseDetailsSuppliedViaPost($whitelist, $blacklist);
      break;
    case '1-0':
      $username = dealWithCasePreviouslyAuthenticated($whitelist, $blacklist, $username);
      break;
    case '1-1':
      // This will occur if the user refreshes the requested page after having entered correct
      //  username and password.  Deal with in same was as for case details supplied via $_POST.
      $username = dealWithCaseDetailsSuppliedViaPost($whitelist, $blacklist);
      break;
    default:
      throw new Exception('Unexpected case.');
   }

   // If execution reaches this point, access is granted. -------------------------------------//

   $_SESSION['__authentication']['authenticatedUsername'] = $username;
   $_SESSION['__authentication']['sessionCreateTimeUnix'] = time();

   // Remove $_POSTed variables so as not to
   // interfere with operation of restricted script.
   unset($_POST['username']);
   unset($_POST['password']);

   // Close the $_SESSION in case the restricted page starts its own $_SESSION.
   session_write_close();
}
catch (Exception $e)
{
   echo $e->getMessage();

   // IMPORTANT
   // ---------
   // This line must remain to ensure that an exception generated
   // above does not result in the security checks being skipped.
   exit(0);
}

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function getLinesAsArrayFromFile($filename)
{
   if (!file_exists($filename))
   {
      return null;
   }

   $fileAsString = file_get_contents($filename);
   $lines        = explode("\n", $fileAsString);

   // Discard empty string.
   array_pop($lines);

   foreach ($lines as &$line)
   {
      $line = rtrim($line);
   }

   return $lines;
}

/*
 *
 */
function dealWithCasePreviouslyAuthenticated($whitelist, $blacklist, $username)
{
   $uname           = &$username;
   $whitelistExists = ($whitelist === null)? '0': '1';
   $blacklistExists = ($blacklist === null)? '0': '1';

   switch ("$whitelistExists-$blacklistExists")
   {
    case '0-0': $granted = true; break;
    case '0-1': $granted = (!in_array($uname, $blacklist)); break;
    case '1-0': $granted = ( in_array($uname, $whitelist)); break;
    case '1-1': $granted = ( in_array($uname, $whitelist) && !in_array($uname, $blacklist)); break;
    default: throw new Exception('Unexpected case.');
   }

   if (!$granted)
   {
      // The user has been authenticated previously, but is either blacklisted, or is not on the
      // whitelist.  Rather than showing the user an 'Access Denied' message, allow the user to
      // re-enter their username and password.  The user will be less confused this way.
      echoSoeIdAndPasswordFormHtml($whitelist, $blacklist);
      exit(0);
   }

   // The user has previously been authenticated, and has passed
   // the whitelist / blacklist checks.  Therefore access is granted.
   return $username;
}

/*
 *
 */
function dealWithCaseDetailsSuppliedViaPost($whitelist, $blacklist)
{
   if (!array_key_exists('username', $_POST) || !array_key_exists('password', $_POST))
   {
      throw new Exception('Required $_POST parameter(s) not set.');
   }

   $username    = $_POST['username'];
   $password    = $_POST['password'];
   //$ldapSuccess = Utils_security::dpiLdapUserCheck($_POST['username'], $_POST['password']);
   $ldapSuccess = ($_POST['username'] == 'tom' && $_POST['password'] == 'letmein');

   if ($ldapSuccess)
   {
      $whitelistExists = ($whitelist === null)? '0': '1';
      $blacklistExists = ($blacklist === null)? '0': '1';

      switch ("$whitelistExists-$blacklistExists")
      {
       case '0-0':
         $accessGranted = true;
         $reason        = null;
         break;
       case '0-1':
         $accessGranted = (!in_array($username, $blacklist));
         $reason        = 'Your username is in the list of usernames to be denied access.';
         break;
       case '1-0':
         $accessGranted = (in_array($username, $whitelist));
         $reason        = 'Your username is not in the list of authorised user\'s usernames.';
         break;
       case '1-1':
         $accessGranted = (in_array($username, $whitelist) && !in_array($username, $blacklist));
         $reason        =
         (
            'Your username is either not on the list of authorised user\'s,' .
            ' usernames or is in the list of usernames to be denied access.'
         );
         break;
       default:
         throw new Exception('Unexpected case.');
      }
   }
   else
   {
      $accessGranted = false;
      $reason        =
      (
         'Your username is invalid, or the password you supplied did not match your username.'
      );
   }

   if (!$accessGranted)
   {
      // The user has been denied access for reason given in $reason.
      echoRejectionHtml($reason);
      exit(0);
   }

   // The user has passed the LDAP check, and has also passed the
   // whitelist / blacklist checks.  Therefore access is granted.
   return $_POST['username'];
}

/*
 *
 */
function echoRejectionHtml($reason)
{
?>
<!DOCTYPE html PUBLIC
 "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
 <head><title>Access Denied</title></head>
 <body>
  <h1>Access Denied</h1>
  <p><?php echo $reason; ?></p>
 </body>
</html>
<?php
}

/*
 *
 */
function echoSoeIdAndPasswordFormHtml($whitelist, $blacklist)
{
   $whitelistExists = ($whitelist === null)? '0': '1';
   $blacklistExists = ($blacklist === null)? '0': '1';

   $restrictionMsg = Utils_misc::switchAssign
   (
      "$whitelistExists-$blacklistExists", null, array
      (
         '0-0' => 'Access to the page you requested is restricted.', 
         '0-1' =>
         (
            'Access to the page you requested is restricted to users whose usernames do not' .
            ' appear on a list of users to be denied access.'
         ),
         '1-0' =>
         (
            'Access to the page you requested is restricted to users whose names appear on a' .
            ' list of authorised users.'
         ),
         '1-1' =>
         (
            'Access to the page you requested is restricted to users whose names appear on a' .
            ' list of authorised users, and do not appear on a list of users to be denied access.'
         )
      )
   );
?>
<!DOCTYPE html PUBLIC
 "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
 <head><title>Restricted Access</title></head>
 <body>
  <h1>Restricted Access</h1>
  <p><?php echo $restrictionMsg; ?></p>
  <p>If you are authorised is view the page, you should have been given a username and password.</p>
  <p>Enter both, then click 'Submit' to continue.</p>
  <p>
   If upon clicking 'Submit' you are granted access, your username and password will be remembered
   for <?php echo N_MINUTES_UNTIL_FORGET_AUTHENTICATION; ?> minutes.  The time to forget will be
   reset to <?php echo N_MINUTES_UNTIL_FORGET_AUTHENTICATION; ?> minutes each time you view a
   restricted page.  This will prevent you from having to repeatedly re-enter your username and
   password when viewing restricted pages.
  </p>
<?php
// The URL to which the username and password are $_POSTed must include the original
// $_GET string so that this script does not affect the operation of the restricted page.
$postUrl = $_SERVER['PHP_SELF'] . Utils_misc::createGetStringFromArray($_GET);
?>
  <form action='<?php echo $postUrl ?>' method='POST'>
<?php
// The parameters that are $_POSTed from this script must include those originally
// $_POSTed so that this script does not affect the operation of the restricted page.
foreach ($_POST as $key => $value)
{
?>
   <input type='hidden' name='<?php echo $key; ?>' value='<?php echo $value; ?>'/>
<?php
}
?>
   <table>
    <tbody>
     <tr><td>Username</td><td><input type='text' name='username'/></td></tr>
     <tr><td>Password</td><td><input type='password' name='password'/></td></tr>
     <tr><td colspan='2'><input type='submit' value='Submit'/></td></tr>
    </tbody>
   </table>
  </form>
 </body>
</html>
<?php
}

/*******************************************END*OF*FILE********************************************/
?>
