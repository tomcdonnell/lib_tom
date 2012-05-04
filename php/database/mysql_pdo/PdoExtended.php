<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "PdoExtended.php"
*
* Project: Database Utilities.
*
* Purpose: Class for using MySQL in PHP using PDO more conveniently.
*
* Author: Tom McDonnell 2012.
*
\**************************************************************************************************/

/*
 *
 */
class PdoExtended extends PDO
{
   // Public functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   public function __construct($dsn, $username, $password, $driverOptions = null)
   {
      if ($driverOptions === null)
      {
         $driverOptions = array
         (
            PDO::ATTR_AUTOCOMMIT         => false            ,
            PDO::ATTR_ORACLE_NULLS       => PDO::NULL_NATURAL,
            PDO::ATTR_PERSISTENT         => true             ,
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
         );
      }

      parent::__construct($dsn, $username, $password, $driverOptions);

      $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   }

   /*
    * Usage:
    *
    * $pdoEx = new PdoExtended($dsn, $username, $password);
    * $rows  = $pdo->queryRows('SELECT id, name_first FROM user');
    * foreach ($rows as $row)
    * {
    *    echo $row['id'        ];
    *    echo $row['name_first'];
    * }
    */
   public function selectRows($sql, $params = array())
   {
      $pdoStatement = $this->_prepareAndExecuteSqlQuery($sql, $params);

      return $pdoStatement->fetchAll(PDO::FETCH_ASSOC);
   }

   /*
    * Usage:
    *
    * $pdoEx = new PdoExtended($dsn, $username, $password);
    * $rows  = $pdo->queryRows('SELECT id, name_first FROM user');
    * foreach ($rows as $row)
    * {
    *    echo $row['id'        ];
    *    echo $row['name_first'];
    * }
    */
   public function selectRow($sql, $params = array())
   {
      $pdoStatement = $this->_prepareAndExecuteSqlQuery($sql, $params);

      $rows = $pdoStatement->fetchAll(PDO::FETCH_ASSOC);

      if (count($rows) != 1)
      {
         // Justification for Throwing an Exception Here
         // --------------------------------------------
         // The most common use of this function is when the caller knows that a row having a
         // certain id exists because of referential integrity constraints.  In that case, if
         // zero or multiple rows are returned, then something serious has gone wrong and an
         // exception is appropriate.  In the less common case where the caller expects either
         // zero or one row to be returned, the caller would have to check the result anyway
         // to see whether zero or one row was returned.  Use $this->queryRows() in that case.
         throw new Exception('Expected one row from SQL query, zero or multiple rows returned.');
      }

      return $rows[0];
   }

   /*
    * Usage:
    *
    * $pdoEx = new PdoExtended($dsn, $username, $password);
    * $ids   = $pdo->queryColumn('SELECT id FROM user');
    * foreach ($ids as $id)
    * {
    *    echo $id;
    * }
    */
   public function selectColumn($sql, $params = array(), $boolConvertToInt = false)
   {
      $pdoStatement = $this->_prepareAndExecuteSqlQuery($sql, $params);
      $column       = array();

      while ($value = $pdoStatement->fetchColumn())
      {
         $column[] = ($boolConvertToInt)? (int)$value: $value;
      }

      return $column;
   }

   /*
    * Usage:
    *
    * $pdoEx         = new PdoExtended($dsn, $username, $password);
    * $nameFirstById = $pdo->queryIndexedColumn('SELECT id, name_first FROM user');
    * foreach ($nameFirstById as as $id => $nameFirst)
    * {
    *    echo $id;
    *    echo $nameFirst;
    * }
    */
   public function selectIndexedColumn($sql, $params = array(), $boolConvertToInt = false)
   {
      $pdoStatement = $this->_prepareAndExecuteSqlQuery($sql, $params);
      $valueByKey   = array();

      while ($row = $pdoStatement->fetch(PDO::FETCH_NUM))
      {
         if (count($row) != 2)
         {
            throw new Exception("Each row is expected to contain exactly two elements.");
         }

         $valueByKey[$row[0]] = ($boolConvertToInt)? (int)$row[1]: $row[1];
      }

      return $valueByKey;
   }

   /*
    * Usage:
    *
    * $pdoEx     = new PdoExtended($dsn, $username, $password);
    * $nameFirst = $pdo->queryField('SELECT nameFirst FROM user WHERE id=4');
    */
   public function selectField($sql, $params = array(), $boolConvertToInt = false)
   {
      $pdoStatement = $this->_prepareAndExecuteSqlQuery($sql, $params);
      $field        = $pdoStatement->fetchColumn();

      if ($field === false)
      {
         throw new Exception('Expected one row from SQL query, zero rows returned.');
      }

      if ($pdoStatement->fetchColumn())
      {
         throw new Exception('Expected one row from SQL query, multiple rows returned.');
      }

      return $field;
   }

   /*
    * Usage:
    *
    * $pdoEx  = new PdoExtended($dsn, $username, $password);
    * $idUser = $pdo->insert('user', array('nameFirst' => 'Estella', 'nameLast' => 'Havisham'));
    *
    * To perform more complex inserts use $pdoEx->prepare() and $pdoEx->execute() manually.
    */
   public function insert($tableName, $valueByKey)
   {
      if (count($valueByKey) == 0)
      {
         throw new Exception('Empty $valueByKey array passed to $pdoEx->insert() function.');
      }

      $strings = array();

      foreach ($valueByKey as $key => $value)
      {
         $strings[] = "`$key`=?";
      }

      $sql          = "INSERT INTO `$tableName` SET\n" . implode(",\n", $strings);
      $pdoStatement = $this->prepare($sql);

      try
      {
         $success = $pdoStatement->execute(array_values($valueByKey));
      }
      catch (Exception $e)
      {
         // Catch 'number of bound variables does not match' error and add more info to exception.
         // Note that this error will only be caught if errors are converted to exceptions.
         // See UtilsError::initErrorAndExceptionHandler().
         throw new Exception($e->getMessage() . self::_getSqlAndParamsAsString($sql, $valueByKey));
      }

      if (!$success)
      {
         throw new Exception
         (
            "Insert query failed.\nsql:\n" .
            var_export($sql, true) . "\nparams:" . var_export($valueByKey, true)
         );
      }

      return $this->lastInsertId();
   }

   /*
    * Usage:
    *
    * $pdoEx         = new PdoExtended($dsn, $username, $password);
    * $nRowsAffected = $pdo->update
    * (
    *    'user',                          // UPDATE `user`
    *    array('nameFirst' => 'Gargery'), // SET    `nameLast`='Gargery'
    *    array('nameLast'  => 'Biddy'  )  // WHERE  `nameFirst`='Biddy'
    * );
    *
    * To perform more complex updates use $pdoEx->prepare() and $pdoEx->execute() manually.
    */
   public function update($tableName, $updateValueByKey, $whereValueByKey = array())
   {
      if (count($updateValueByKey) == 0)
      {
         throw new Exception('Empty $valueByKey array passed to $pdoEx->insert() function.');
      }

      $strings    = array();
      $conditions = array();

      foreach ($updateValueByKey as $k => $v) {$strings[]    = "`$k`=" . $this->quote($v);}
      foreach ($whereValueByKey  as $k => $v) {$conditions[] = "`$k`=" . $this->quote($v);}

      $sql =
      (
         "UPDATE `$tableName` SET\n" . implode(",\n", $strings) .
         "\nWHERE " . implode(' AND ', $conditions)
      );

      // Function exec() is used here instead of execute because exec() returns the number
      // of rows affected while execute returns a boolean indicating success or failure.
      $nRowsAffected = $this->exec($sql);

      if ($nRowsAffected === false)
      {
         throw new Exception("Update query failed.\nsql:\n" . var_export($sql, true));
      }

      return $nRowsAffected;
   }

   // Private functions. ///////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private function _prepareAndExecuteSqlQuery($sql, $params)
   {
      $pdoStatement = $this->prepare($sql);

      if ($pdoStatement === false)
      {
         $this->_throwExceptionWithErrorInfo('PDO->prepare() returned false.');
      }

      try
      {
         $pdoStatement->execute($params);
      }
      catch (Exception $e)
      {
         // Catch 'number of bound variables does not match' error and add more info to exception.
         // Note that this error will only be caught if errors are converted to exceptions.
         // See UtilsError::initErrorAndExceptionHandler().
         throw new Exception($e->getMessage() . self::_getSqlAndParamsAsString($sql, $params));
      }


      return $pdoStatement;
   }

   /*
    *
    */
   public function _getSqlAndParamsAsString($sql, $params)
   {
      return "\nsql:\n" . var_export($sql, true) . "\nparams:\n" . var_export($params, true);
   }

   /*
    *
    */
   public function _throwExceptionWithErrorInfo($errorDescription)
   {
      $errorInfo = $this->errorInfo();

      throw new Exception
      (
         "$errorDescription\n"                         .
         "\nSQLSTATE: {$errorInfo[0]}"                 .
         "Driver-specific error code: {$errorInfo[1]}" .
         "Driver-specific error message: {$errorInfo[2]}"
      );
   }
}

/*******************************************END*OF*FILE********************************************/
?>
