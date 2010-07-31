<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "database_definitions.php"
*
* Project: High Scores.
*
* Purpose: Single place where database connections are defined.  If it is ever desired that the
*          working database should change, it can be done easily here.
*
* Author: Tom McDonnell 2009-07-06.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../database/DatabaseManager.php';

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   DatabaseManager::addMany
   (
      array
      (
         array
         (
            'name'     => 'highscores_read',
            'host'     => 'localhost'      ,
            'user'     => 'highscores_read',
            'password' => 'sn00pc@t'       ,
            'database' => 'highscores'
         ),
         array
         (
            'name'     => 'highscores_write',
            'host'     => 'localhost'       ,
            'user'     => 'highscores_write',
            'password' => '1itt1eJimmy'     ,
            'database' => 'highscores'
         )
      )
   );
}
catch (Exception $e)
{
   echo $e;
}

/*******************************************END*OF*FILE********************************************/
?>
