<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "HighScores.php"
*
* Project: HighScores database wrapper class.
*
* Purpose: Insert and retrieve data into/from the `highscores` database.
*
* Author: Tom McDonnell 2009-07-04.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../utils/Utils_validator.php';
require_once dirname(__FILE__) . '/../../utils/Utils_database.php';
require_once dirname(__FILE__) . '/../../utils/Utils_misc.php';

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class HighScores
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

   /*
    *
    */
   public static function insert(DatabaseConnection $dbc, $gameNameShort, $scoreDetails)
   {
      Utils_validator::checkArray
      (
         $scoreDetails, array
         (
            'playerName' => 'string'        ,
            'gameMode'   => 'string'        ,
            'score'      => 'nonNegativeInt',
            'details'    => 'nullOrNonEmptyString'
         )
      );
      extract($scoreDetails);

      if (!Utils_database::rowExistsInTable($dbc, 'game', array('nameShort' => $gameNameShort)))
      {
         throw new Exception("No game with nameShort '$gameNameShort' found.");
      }

      if (!Utils_database::rowExistsInTable($dbc, 'gameMode', array('name' => $gameMode)))
      {
         throw new Exception("No game mode with name '$gameMode' found.");
      }

      Utils_database::insertRowIntoTable
      (
         $dbc, 'score', array
         (
            'score'      => $score                                            ,
            'details'    => $details                                          ,
            'idPlayer'   => self::getOrCreateAndGetIdPlayer($dbc, $playerName),
            'idGame'     => Utils_database::getFieldFromRowOfTable
            (
               $dbc, 'id', 'game', array('nameShort' => $gameNameShort)
            ),
            'idGameMode' => Utils_database::getFieldFromRowOfTable
            (
               $dbc, 'id', 'gameMode', array('name' => $gameMode)
            )
         )
      );

      return true;
   }

   /*
    *
    */
   public static function getHighScores(DatabaseConnection $dbc, $params)
   {
      Utils_validator::checkArray
      (
         $params, array
         (
            'gameNameShort' => 'string'           ,
            'gameModeName'  => 'string'           ,
            'idPlayer'      => 'nullOrPositiveInt',
            'n_rowsPerPage' => 'positiveInt'      ,
            'pageNo'        => 'positiveInt'
         )
      );
      extract($params);

      $sqlConditions = array('`game`.`nameShort`=?', '`gameMode`.`name`=?');
      $sqlParams     = array($gameNameShort        , $gameModeName        );
      $playerName    = null;

      if ($idPlayer !== null)
      {
         $sqlConditions[] = '`score`.`idPlayer`=?';
         $sqlParams[]     = $idPlayer;
         $playerName      = Util_database::getFieldFromRowOfTable
         (
            $dbc, 'player', 'playerName', array('id' => $idPlayer)
         );
      }

      // Add SQL params for limit and offset.
      $sqlParams[] = $n_rowsPerPage;
      $sqlParams[] = $n_rowsPerPage * ($pageNo - 1);

      $rows = $dbc->query
      (
         'SELECT `gameMode`.`name` AS `gameModeName`,
                 `player`.`playerName` AS `playerName`,
                 DATE(`score`.`create`) AS `create`,
                 `score`.`score` AS `score`,
                 `score`.`details` AS `details`
          FROM `score`
          JOIN `game`     ON (`score`.`idGame`    =`game`.`id`    )
          JOIN `gameMode` ON (`score`.`idGameMode`=`gameMode`.`id`)
          JOIN `player`   ON (`score`.`idPlayer`  =`player`.`id`  )
          WHERE ' . implode(' AND ', $sqlConditions) . '
          ORDER BY `score` DESC, `score`.`create` ASC
          LIMIT ?
          OFFSET ?',
         $sqlParams
      );

      return array
      (
         'gameModeName' => $gameModeName,
         'playerName'   => $playerName  ,
         'rows'         => $rows
      );
   }

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private static function getOrCreateAndGetIdPlayer(DatabaseConnection $dbc, $playerName)
   {
      if (Utils_database::rowExistsInTable($dbc, 'player', array('playerName' => $playerName)))
      {
         return Utils_database::getFieldFromRowOfTable
         (
            $dbc, 'id', 'player', array('playerName' => $playerName)
         );
      }

      return Utils_database::insertRowIntoTable
      (
         $dbc, 'player', array('playerName' => $playerName)
      );
   }
}

/*******************************************END*OF*FILE********************************************/
?>
