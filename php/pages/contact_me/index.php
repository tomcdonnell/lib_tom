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

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../utils/UtilsValidator.php';
require_once dirname(__FILE__) . '/../../utils/UtilsMisc.php';

// Global variables. ///////////////////////////////////////////////////////////////////////////////

$filesJs  = array();
$filesCss = array();

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   if (count($_POST) > 0)
   {
      UtilsValidator::checkArray
      (
         $_POST, array
         (
            'backAnchorHrefPlusGetString' => 'nonEmptyString',
            'backAnchorText'              => 'nonEmptyString',
            'pageTitle'                   => 'nonEmptyString',
            'pageHeading'                 => 'nonEmptyString',
            'emailDstName'                => 'nonEmptyString',
            'emailSrcName'                => 'nonEmptyString',
            'replyEmailAddress'           => 'nonEmptyString',
            'subject'                     => 'nonEmptyString',
            'message'                     => 'nonEmptyString'
         )
      );

      $success = mail
      (
         getEmailAddressFromName($_POST['emailDstName']),
         $_POST['subject']                              ,
         $_POST['message']                              ,
         (
            "From: {$_POST['emailSrcName']}\r\n"          .
            "Reply-To: {$_POST['replyEmailAddress']}\r\n" .
            'X-Mailer: PHP/' . phpversion()
         )
      );

      $backAnchorHrefPlusGetString = $_POST['backAnchorHrefPlusGetString'];
      $backAnchorText              = $_POST['backAnchorText'             ];
      $pageTitle                   = $_POST['pageTitle'                  ];
      $pageHeading                 = $_POST['pageHeading'                ];

      $pageType = ($success)? 'messageSent': 'messageNotSent';
   }
   else
   {
      UtilsValidator::checkArray
      (
         $_GET,
         array
         (
            'backAnchorHref' => 'nonEmptyString',
            'backAnchorText' => 'nonEmptyString',
            'emailDstName'   => 'nonEmptyString'
         ),
         array
         (
            'pageTitle'               => 'nonEmptyString',
            'pageHeading'             => 'nonEmptyString',
            'emailSrcName'            => 'nonEmptyString',
            'styleSheet'              => 'nonEmptyString',
            'backAnchorHrefGetString' => 'nonEmptyString',
            'subject'                 => 'nonEmptyString'
         )
      );

      if (array_key_exists('styleSheet', $_GET))
      {
         $filesCss[] = $_GET['styleSheet'];
      }

      $backAnchorText = $_GET['backAnchorText'];
      $backAnchorHref = $_GET['backAnchorHref'];
      $emailDstName   = $_GET['emailDstName'  ];
      $pageTitle      = UtilsMisc::arrayValueOrDefault('pageTitle'    , $_GET, 'Contact Form');
      $pageHeading    = UtilsMisc::arrayValueOrDefault('pageHeading'  , $_GET, 'Contact Form');
      $emailSrcName   = UtilsMisc::arrayValueOrDefault('emailSrcName' , $_GET, 'Contact Form');
      $subject        = UtilsMisc::arrayValueOrDefault('subject'      , $_GET, ''            );

      $backAnchorHrefGetString     = UtilsMisc::arrayValueOrBlank('backAnchorHrefGetString',$_GET);
      $backAnchorHrefPlusGetString = $backAnchorHref;

      if ($backAnchorHrefGetString != '')
      {
         $backAnchorHref .= "?$backAnchorHrefGetString";
      }

      // This function is used here only to check that an
      // email address is known for the given emailDstName.
      getEmailAddressFromName($emailDstName);

      $filesJs  = array
      (
         '../../../js/contrib/jquery/1.5/jquery_minified.js',
         '../../../js/utils/utils.js'                       ,
         '../../../js/utils/utilsValidator.js'              ,
         'index.js'
      );
      $pageType = 'contactForm';
   }
}
catch (Exception $e)
{
   echo $e->getMessage();
}

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function getEmailAddressFromName($name)
{
   $emailAddressesByName = array
   (
      'tom'   => 'tomcdonnell@gmail.com',
      'luke'  => 'luketylim@hotmail.com',
      'shawn' => 'tomcdonnell@gmail.com' // Change when get Shawn's email address.
   );

   if (!array_key_exists($name, $emailAddressesByName))
   {
      throw new Exception("Unknown email destination name '$name'.");
   }

   if ($emailAddressesByName[$name] == '')
   {
      throw new Exception(ucfirst($name) . ', you need to give Tom your email address.');
   }

   return $emailAddressesByName[$name];
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
 foreach ($filesJs  as $file) {echo "  <script src='$file?$unixTime'></script>\n"         ;}
 foreach ($filesCss as $file) {echo "  <link rel='stylesheet' href='$file?$unixTime' />\n";}
?>
  <title><?php echo $pageTitle; ?></title>
 </head>
 <body>
  <a href='<?php echo $backAnchorHrefPlusGetString; ?>' /><?php echo $backAnchorText; ?></a>
  <h1><?php echo $pageHeading; ?></h1>
<?php
 switch ($pageType)
 {
  case 'contactForm':
?>
  <form action='index.php' method='POST'>
   <h4>Subject:</h4>
   <input type='text' name='subject' id='subjectInput' size='70' value='<?php echo $subject; ?>' />
   <br />
   <h4>Message:</h4>
   <textarea rows='10' cols='70' name='message' id='messageInput'></textarea>
   <br />
   <h4>Your Email Address</h4>
   <input type='text' name='replyEmailAddress' id='replyEmailAddressInput' size='70' />
   <br />
   <input type='hidden'
    name='backAnchorHrefPlusGetString' value='<?php echo $backAnchorHrefPlusGetString; ?>' />
   <input type='hidden' name='backAnchorText' value='<?php echo $backAnchorText; ?>' />
   <input type='hidden' name='pageTitle'      value='<?php echo $pageTitle     ; ?>' />
   <input type='hidden' name='pageHeading'    value='<?php echo $pageHeading   ; ?>' />
   <input type='hidden' name='emailDstName'   value='<?php echo $emailDstName  ; ?>' />
   <input type='hidden' name='emailSrcName'   value='<?php echo $emailSrcName  ; ?>' />
   <br />
   <input type='submit' value='Submit' id='submitButton' />
  </form>
<?php
    break;
  case 'messageSent':
?>
   <p>Your message has been sent.</p>
<?php
    break;
  case 'messageNotSent':
?>
   <p>Your message could not be sent due to a server error.</p>
<?php
    break;
  default:
    throw new Exception("Unknown page type '$pageType'.");
 }
?>
 </body>
</html>
<?php
/*******************************************END*OF*FILE********************************************/
?>
