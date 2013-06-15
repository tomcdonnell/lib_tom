/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "create_users.sql"
*
* Project: High Scores.
*
* Purpose: Create MySQL users for accessing the `highscores` database.
*
* Author: Tom McDonnell 2009-07-04.
*
\**************************************************************************************************/

CREATE USER 'highscores_read'@'localhost'  IDENTIFIED BY 'sn00pc@t';
CREATE USER 'highscores_write'@'localhost' IDENTIFIED BY '1itt1eJimmy';

GRANT SELECT                 ON `highscores`.* TO 'highscores_read'@'localhost';
GRANT SELECT, INSERT, UPDATE ON `highscores`.* TO 'highscores_write'@'localhost';

/*******************************************END*OF*FILE********************************************/
