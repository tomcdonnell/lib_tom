<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "UtilsError.php"
*
* Project: Utilities.
*
* Purpose: Utilities pertaining to arrays.
*
* Author: Tom McDonnell 2010-06-18.
*
\**************************************************************************************************/

/*
 *
 */
class UtilsError
{
   /*
    *
    */
   public function __construct()
   {
      throw new Exception('This class is not intended to be instantiated.');
   }

   /*
    *
    */
   public static function initErrorAndExceptionHandler($logFilename, $genericErrorPageUrl = null)
   {
      if (!is_string($logFilename))
      {
         echo 'Supplied log file name is not a string.';
         die();
      }

      if ($genericErrorPageUrl !== null && !is_string($genericErrorPageUrl))
      {
         echo 'Supplied error page URL is not null and is not a string.';
         die();
      }

      self::$_logFilename         = $logFilename;
      self::$_genericErrorPageUrl = $genericErrorPageUrl;

      set_error_handler(array(__CLASS__, 'errorHandlerConvertErrorToExceptions'));
      set_exception_handler(array(__CLASS__, 'exceptionHandler'));
   }

   /*
    *
    */
   public static function logExceptionDetails($e, $messageToPrecedeErrorDetails = null)
   {
      if (self::$_logFilename === null)
      {
         echo "Attempted to log exception details when no log file name specified.\n";
         echo ' To specify a log file name call ';
         echo __CLASS__, '::initErrorAndExceptionHandler().';
         die();
      }

      self::logMessage
      (
         (($messageToPrecedeErrorDetails === null)? '': $messageToPrecedeErrorDetails) .
         $e->getMessage() . '|' . $e->getTraceAsString() . "|URL: {$_SERVER['PHP_SELF']}"
      );
   }

   /*
    *
    */
   public static function logMessage($message)
   {
      $file = fopen(self::$_logFilename, 'a');

      if ($file === false)
      {
         throw new Exception('Could not open log file "' . self::$_logFilename . '" for writing.');
      }

      $message = date('Y-m-d H:i:s') . " $message";
      $result  = fwrite($file, str_replace("\n", '__|__', $message) . "\n");

      if ($file === false)
      {
         throw new Exception('Could not write to file "' . self::$_logFilename . '".');
      }
   }

   /*
    * Convert all errors into Exceptions.
    *
    * See http://au2.php.net/manual/en/function.set-error-handler.php
    *
    * Note Regarding Privacy
    * ----------------------
    * This function must be public so that it can be used
    * as an error handler but should be treated as private.
    */
   public static function errorHandlerConvertErrorToExceptions
   (
      $errno, $errstr, $errfile, $errline, $errcontext
   )
   {
      // Note Regarding Errors Deliberately Suppressed Using '@'
      // -------------------------------------------------------
      // PHP will call this custom error handler if a function call generates an error despite
      // errors being suppressed on that function call using '@'.  The following conditional
      // return was added in order to prevent deliberately suppressed errors from appearing in
      // the error logs.
      //
      // See http://au2.php.net/manual/en/function.set-error-handler.php.
      if (error_reporting() == 0) {return;}

      if (self::$_exceptionAlreadyThrownAndCaught)
      {
         // Note Regarding Error Context
         // ----------------------------
         // The contents of the $errcontext variable is not dumped below because in for
         // some errors (eg. Doctrine errors) the $errcontext variable can be very large.
         self::logMessage("$errstr|$errfile|$errline");
         self::_redirectToErrorPageOrEchoGenericErrorMessageAndDie();
         die();
      }
      else
      {
         throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
      }
   }

   /*
    * Note Regarding Privacy
    * ----------------------
    * This function must be public so that it can be used as
    * an exception handler but should be treated as private.
    */
   public static function exceptionHandler($e)
   {
      self::$_exceptionAlreadyThrownAndCaught = true;
      self::logExceptionDetails($e);
      self::_redirectToErrorPageOrEchoGenericErrorMessageAndDie();
   }

   // Private functions. //////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private static function _redirectToErrorPageOrEchoGenericErrorMessageAndDie()
   {
      if (self::$_genericErrorPageUrl !== null)
      {
         try
         {
            header("Location: " . self::$_genericErrorPageUrl);
            die();
         }
         catch (Exception $e)
         {
            echo 'Attempted to redirect to generic error message page when headers already';
            echo " sent.  Use output bufferring to avoid seeing this message.\n";
         }
      }

      echo "A fatal error has occurred.  Check '", self::$_logFilename, "' for details.\n";
      die();
   }

   // Private variables. //////////////////////////////////////////////////////////////////////

   private static $_exceptionAlreadyThrownAndCaught = false;
   private static $_logFilename                     = null;
   private static $_genericErrorPageUrl             = null;
}

/*******************************************END*OF*FILE********************************************/
?>
