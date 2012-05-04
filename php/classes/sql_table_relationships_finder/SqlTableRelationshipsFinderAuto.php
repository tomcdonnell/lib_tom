<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "SqlTableRelationshipFinderAuto.php
*
* Project: SQL Table Relationships Finder.
*
* Purpose: A class for finding the relationships that exist between a given SQL table and other
*          tables within the same database.  This class attempts to find the table naming
*          convention that is used in the given database.  It does this by attempting to find links
*          using all of the SqlTableRelationshipFinderNC<x> classes, and choosing the class that
*          returned the greatest number of links.
*
* Author: Tom McDonnell 2010-06-26.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../database/DatabaseManager.php';
require_once dirname(__FILE__) . '/../../utils/UtilsDatabase.php';

// Include all files defining classes that have been created for specific table naming conventions.
foreach (glob(dirname(__FILE__) . '/specific_naming_conventions/*') as $filename)
{
   require_once $filename;
}

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class SqlTableRelationshipsFinderAuto extends SqlTableRelationshipsFinder
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   public function __construct(DatabaseConnection $dbc, $tableName)
   {
      if (!UtilsDatabase::tableExistsInDatabase($dbc, $tableName))
      {
         throw new Exception("Table `$tableName` not found.");
      }

      $dbName = $dbc->getDatabaseName();

      $this->dbc                       = $dbc;
      $this->tableName                 = $tableName;
      $this->columnHeadingsByTableName = UtilsDbSchema::getColumnHeadingsByTableName($dbName);
      $this->columnHeadings            = $this->columnHeadingsByTableName[$tableName];

      $n_linksByNamingConventionName = array();
      $maxN_links                    = 0;
      $chosenClassName               = null;
      foreach ($this->getSqlTableRelationshipsFinderClassNames() as $className)
      {
         $classInstantiation = eval("return new $className(\$dbc, \$tableName);");
         $relationshipsInfo  = $classInstantiation->getAsArray();
         $n_links            = $classInstantiation->getN_links();

         if ($n_links > $maxN_links)
         {
            $maxN_links              = $n_links;
            $chosenClassName         = $className;
            $this->relationshipsInfo = $relationshipsInfo;
         }
      }

      echo "Chosen class name: '$chosenClassName'.\n";
   }

   // Protected functions. //////////////////////////////////////////////////////////////////////

   // These functions must be defined since they are abstract in parent class.
   // They are not used however.
   protected function getDirectLinksFromTableByTableLinkCol() {}
   protected function getDirectLinksToTableByLinkedTableName() {}
   protected function getIndirectLinksViaLinkTableByLinkTableName() {}

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private function getSqlTableRelationshipsFinderClassNames()
   {
      return array('SqlTableRelationshipsFinderNcTom', 'SqlTableRelationshipsFinderNcSugarCrm');
   }
}

/*******************************************END*OF*FILE********************************************/
?>
