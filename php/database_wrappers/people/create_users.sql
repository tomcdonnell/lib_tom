/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "create_users.sql"
*
* Project: People.
*
* Purpose: Create MySQL users for accessing the `people` database.
*
* Author: Tom McDonnell 2009-02-06.
*
\**************************************************************************************************/

/* Password mnemonic: People of the proletariat unite! */
CREATE USER 'people_read'@'localhost'  IDENTIFIED BY 'p0tpu!_r';
CREATE USER 'people_write'@'localhost' IDENTIFIED BY 'p0tpu!_w';

GRANT SELECT         ON `people`.* TO 'people_read'@'localhost';
GRANT INSERT, UPDATE ON `people`.* TO 'people_write'@'localhost';

/*******************************************END*OF*FILE********************************************/
