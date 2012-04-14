<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Address.php"
*
* Project: Database wrapper class for address tables in `people` database.
*
* Purpose: To enable access to and manipulation of address data in the `people` database.
*
* Author: Tom McDonnell 2009-02-06.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../utils/Utils_validator.php';
require_once dirname(__FILE__) . '/../../utils/Utils_misc.php';

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Address
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

   // Insert functions. -----------------------------------------------------------------------//

   // Update functions. -----------------------------------------------------------------------//

   // Private functions. ////////////////////////////////////////////////////////////////////////
}

/*******************************************END*OF*FILE********************************************/
?>