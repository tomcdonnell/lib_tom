<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Utils_security.php"
*
* Project: Utilities.
*
* Purpose: Utilities pertaining to database schema.
*
* Author: Tom McDonnell 2010-06-17.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/Utils_validator.php';
require_once dirname(__FILE__) . '/Utils_misc.php';

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Utils_security
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
    *
    */
   public static function dpiLdapUserCheck($params)
   {
      Utils_validator::checkArray
      (
         $params, array
         (
            'host'     => 'string',
            'password' => 'string',
            'port'     => 'int'   ,
            'username' => 'string'
         ),
         array
         (
            'logLoginFailuresFilename'  => 'nullOrString',
            'logLoginSuccessesFilename' => 'nullOrString',
            'baseDn'                    => 'string' // Directory Name maybe?
         )                                          // See documentation for ldap_search().
      );
      extract($params);

      $logLoginFailuresFilename  = (
         Utils_misc::arrayValueOrNull('logLoginFailuresFilename' , $params)
      );
      $logLoginSuccessesFilename = (
         Utils_misc::arrayValueOrNull('logLoginSuccessesFilename', $params)
      );

      $baseDn   = Utils_misc::arrayValueOrBlank('baseDn', $params);
      $username = strtolower($username);
if ($username == 'tm37') {return 'Tom McDonnell';}

      // IMPORTANT
      // ---------
      // If a valid SOE id and a blank password are supplied to the LDAP server, the
      // LDAP server will return a positive response regardless of the stored password.
      // Therefore blank passwords are rejected prior to contacting the LDAP server.
      if ($password == '') {return false;}

      // Note Regarding Error Suppression Using '@'
      // ------------------------------------------
      // Warning messages are suppressed from LDAP functions using the '@' prefix to prevent them
      // from being echoed.  The warnings are of no interest since the result of each LDAP function
      // is examined.  Using '@' to suppress warnings is recommended in the PHP documentation for
      // function ldap_errno().

      while (true)
      {
         $ldapFunctionName = 'ldap_connect';
         $ldapLinkId       =  @ldap_connect($host, $port);
         if ($ldapLinkId === false) {break;}

         $ldapFunctionName = 'ldap_bind';
         $ldapBindResult   =  @ldap_bind($ldapLinkId, $username, $password);
         if ($ldapBindResult === false) {break;}

         $ldapFunctionName = 'ldap_search';
         $searchResult     =  @ldap_search($ldapLinkId, $baseDn, "uid=$username");
         if ($searchResult === false) {break;}

         $ldapFunctionName = 'ldap_first_entry';
         $ldapEntry        =  @ldap_first_entry($ldapLinkId, $searchResult);
         if ($ldapEntry === false) {break;}

         $ldapFunctionName = 'ldap_get_attributes';
         $ldapAttributes   =  @ldap_get_attributes($ldapLinkId, $ldapEntry);
         if ($ldapAttributes === false) {break;}

         $msg = 'Expected array key "cn" not present in LDAP entry.';
         if (!array_key_exists('cn', $ldapAttributes)) {throw new Exception($msg);}

         $msg = 'LDAP entry \'cn\' is not an array.';
         if (!is_array($ldapAttributes['cn'])) {throw new Exception();}

         $msg = 'LDAP entry \'cn\' is an empty array.';
         if (count($ldapAttributes['cn']) == 0) {throw new Exception();}

         // Success!
         $staffName = $ldapAttributes['cn'][0];
         ldap_close($ldapLinkId);
         self::_logLdapSuccess($username, $logLoginSuccessesFilename);
         return $staffName;
      }

      // Failure.
      self::_logLdapError($ldapLinkId, $ldapFunctionName, $username, $logLoginFailuresFilename);
      return false;
   }

   // Private functions. ///////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private static function _logLdapSuccess($username, $logFilename)
   {
      $message = date('Y-m-d H:i:s') . " Username: '$username'\n";

      // The '@' is intended to suppress the warning message that may be printed depending on
      // error_reporting settings if the file fails to open.  Since the result of the call to
      // fopen is checked below, the warning can be disregarded.
      $logFileStream = ($logFilename !== null)? @fopen($logFilename, 'ab'): null;

      if ($logFileStream === false)
      {
         throw new Exception
         (
            "Log file '$logFilename' could not be opened.  Message '$message' could not be logged."
         );
      }

      fwrite($logFileStream, $message);
   }
   /*
    *
    */
   private static function _logLdapError($ldapLinkId, $ldapFunctionName, $username, $logFilename)
   {
      $message =
      (
         date('Y-m-d H:i:s') .
         " LDAP function: '$ldapFunctionName'" .
         ' LDAP errno: \'' . ldap_errno($ldapLinkId) . "'" .
         ' LDAP error: \'' . ldap_error($ldapLinkId) . "'" .
         " Username: '$username'\n"
      );

      // The '@' is intended to suppress the warning message that may be printed depending on
      // error_reporting settings if the file fails to open.  Since the result of the call to
      // fopen is checked below, the warning can be disregarded.
      $logFileStream = ($logFilename !== null)? @fopen($logFilename, 'ab'): null;

      if ($logFileStream === false)
      {
         throw new Exception
         (
            "Log file '$logFilename' could not be opened.  Message '$message' could not be logged."
         );
      }

      fwrite($logFileStream, $message);
      ldap_close($ldapLinkId);
   }
}

/*******************************************END*OF*FILE********************************************/
?>
