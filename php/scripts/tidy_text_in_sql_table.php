<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "tidy_text_in_sql_table.php"
*
* Project: Scripts.
*
* Purpose: Trim all fields of a given SQL table in a given SQL database.
*
* Author: Tom McDonnell 2010-05-06.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../../common/php/utils/UtilsDatabase.php';

// Global variables. ///////////////////////////////////////////////////////////////////////////////

$TABLE_NAME = '20100506_farm_services';

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   DatabaseManager::addMany
   (
      array
      (
         array
         (
            'name'     => 'sugar_stakeholders',
            'host'     => 'localhost'         ,
            'user'     => 'root'              ,
            'password' => 'igaiasma'          ,
            'database' => 'sugar_stakeholders'
         )
      )
   );

   $dbc = DatabaseManager::get('sugar_stakeholders');

   echo 'Getting ids from table...';
   $ids = UtilsDatabase::getColFromTable($dbc, 'id', $TABLE_NAME);
   echo 'done.  Got ', count($ids), " ids.\n";

   echo 'Trimming all fields...';
   $n_rowsUpdated = 0;
   $i             = 0;
   foreach ($ids as $id)
   {
      if (++$i % 100 == 0) {echo '.';}

      $row = UtilsDatabase::getRowFromTable($dbc, $TABLE_NAME, array('id' => $id));

      foreach ($row as $key => $value)
      {
         $value     = str_replace("\t", ' ', $value);
         $value     = str_replace("\n", ' ', $value);
         $value     = removeNonAlphaNumPunctCharsLeavingSpaces($value, $key);
         $value     = trim($value);
         $row[$key] = $value;
      }

      $n_rowsUpdated += UtilsDatabase::updateRowsInTable($dbc, $TABLE_NAME, $row, array('id'=>$id));
   }
   echo "done.\n$n_rowsUpdated rows were updated.\n";

}
catch (Exception $e)
{
   echo $e;
}

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function removeNonAlphaNumPunctCharsLeavingSpaces($value, $key)
{
   $newValue = '';

   for ($i = 0; $i < strlen($value); ++$i)
   {
      $char = $value[$i];

      if (ctype_alnum($char) || ctype_punct($char) || $char == ' ')
      {
         $newValue .= $char;
      }
   }

   return $newValue;
}

/*******************************************END*OF*FILE********************************************/
?>
