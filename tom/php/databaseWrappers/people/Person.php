<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Person.php"
*
* Project: Person database wrapper class.
*
* Purpose: Insert data specific to a person into the `people` database.
*
* Author: Tom McDonnell 2008-11-15.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../utils/Utils_validator.php';
require_once dirname(__FILE__) . '/../../utils/Utils_misc.php';

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Person
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   public function __construct()
   {
      throw new Exception('This class is not intended to be instantiated.');
   }

   // Getters. --------------------------------------------------------------------------------//

   /*
    *
    */
   public static function getEmailAddressFromIdPerson($dbc, $idPerson)
   {
      $rows = $dbc->query
      (
         'SELECT CONCAT(`userName`, "@", `domain`) AS `emailAddress`
          FROM `people`.`email` AS `email`
          JOIN `people`.`person` AS `person` ON (`email`.`id`=`person`.`idEmail`)
          WHERE `email`.`id`=`person`.`idEmail`
          AND `person`.`id`=?',
         array($idPerson)
      );

      return (count($rows) == 1)? $rows[0]['emailAddress']: null;
   }

   // Insert functions. -----------------------------------------------------------------------//

   /*
    *
    */
   public static function insert(DatabaseConnection $dbc, $personRow)
   {
      Utils_validator::checkArray
      (
         $personRow, array('nameFirst' => 'nonEmptyString'), array
         (
            'idSalutation' => 'nonNegativeInt' ,
            'nameMiddle'   => 'nonEmptyString' ,
            'nameLast'     => 'nonEmptyString' ,
            'nameNick'     => 'nonEmptyString' ,
            'dateOfBirth'  => 'date_yyyy-mm-dd'
         )
      );

      $dbc->query('START TRANSACTION');

      try
      {
         $idPerson = Utils_database::insertRowIntoTable($dbc, 'person', $personRow);
      }
      catch (Exception $e)
      {
         $dbc->rollbackTransaction();
         throw new Exception('Insertion of person failed.  Transaction rolled back.' . $e);
      }

      $dbc->query('COMMIT WORK');

      return $idPerson;
   }

   /*
    *
    */
   public static function insertEmail(DatabaseConnection $dbc, $emailAddressFull, $idPerson = null)
   {
      Utils_validator::checkEmailAddress($emailAddressFull);

      $posOfAtSymbol = strpos($emailAddressFull, '@');

      $idEmail = Utils_database::insertRowIntoTable
      (
         $dbc, 'email', array
         (
            'userName' => substr($emailAddressFull, 0, $posOfAtSymbol),
            'domain'   => substr($emailAddressFull,    $posOfAtSymbol)
         )
      );

      if ($idPerson !== null)
      {
         Utils_database::updateRowsInTable
         (
            $dbc, 'person',
            array('idEmail' => "$idEmail" ),
            array('id'      => "$idPerson")
         );
      }

      return $idEmail;
   }

   /*
    *
    */
   public static function insertWebsite(DatabaseConnection $dbc, $website, $idPerson = null)
   {
      Utils_validator::checkWebsite($website);

      $idWebsite = Utils_database::insertRowIntoTable($dbc, 'website', array('domain' => $website));

      if ($idPerson !== null)
      {
         Utils_database::updateRowsInTable
         (
            $dbc, 'person',
            array('idWebsite' => "$idWebsite"),
            array('id'        => "$idPerson" )
         );
      }

      return $idWebsite;
   }

   /*
    *
    */
   public static function insertAddress(DatabaseConnection $dbc, $address)
   {
   }

   // Update functions. -----------------------------------------------------------------------//

   /*
    *
    */
   public static function updateEmailForPerson($dbc, $idPerson, $emailAddressFull)
   {
      $idEmail = Utils_database::getFieldFromRowOfTable
      (
         $dbc, 'idEmail', 'person', array('id' => $idPerson)
      );

      if ($idEmail === null)
      {
         throw new Exception
         (
            'Attempted to update email address for person with no email address.' .
            " (idPerson: $idPerson)."
         );
      }

      $posOfAtSymbol = strpos($emailAddressFull, '@');

      return Utils_database::updateRowsInTable
      (
         $dbc, 'email', array
         (
            'userName' => substr($emailAddressFull, 0, $posOfAtSymbol),
            'domain'   => substr($emailAddressFull,    $posOfAtSymbol)
         ),
         array('id' => $idEmail)
      );
   }

   // Private functions. ////////////////////////////////////////////////////////////////////////

}

/*******************************************END*OF*FILE********************************************/
?>
