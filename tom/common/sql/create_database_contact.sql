/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "create_database_people.sql"
*
* Project: General databases.
*
* Purpose: Script for creating the MySQL database `contact`.
*          The `contact` database will be used for storing contact details for multiple projects.
*
* Author: Tom McDonnell 2008-09-28.
*
\**************************************************************************************************/

CREATE DATABASE `people`;

USE `people`;

CREATE TABLE `person`
(
   `id` int(10) unsigned NOT NULL auto_increment,
   `create` timestamp NOT NULL default CURRENT_TIMESTAMP,
   `idAddress` int(10) unsigned default NULL auto_increment,
   `idEmail` int(10) unsigned default NULL auto_increment,
   `idWebsite` int(10) unsigned default NULL auto_increment,
   `nameFirst` varchar(32) NOT NULL,
   `nameLast` varchar(32) NOT NULL,
   `dateOfBirth` date default NULL,
   PRIMARY KEY  (`id`),
   KEY `nameFirst` (`nameFirst`),
   KEY `nameLast` (`nameLast`),
   CONSTRAINT `person_fk_1` FOREIGN KEY (`idAddress`) REFERENCES `address` (`id`),
   CONSTRAINT `person_fk_2` FOREIGN KEY (`idEmail`) REFERENCES `email` (`id`),
   CONSTRAINT `person_fk_3` FOREIGN KEY (`idWebsite`) REFERENCES `website` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=latin1;

CREATE TABLE `address`
(
   `id` int(10) unsigned NOT NULL auto_increment,
   `create` timestamp NOT NULL default CURRENT_TIMESTAMP,
   `idPerson` int(10) unsigned NOT NULL,
   `idCountry` int(10) unsigned NOT NULL,
   `premiseName` varchar(32) default NULL,
   `premiseNumber` int(10) unsigned default NULL,
   `subpremiseNumber` int(10) unsigned default NULL,
   `streetName` varchar(32) default NULL,
   `idStreetType` int(10) unsigned default NULL,
   `streetNumber` int(10) unsigned default NULL,
   `idState` int(10) unsigned NOT NULL,
   `city` varchar(32) default NULL,
   `suburb` varchar(32) default NULL,
   PRIMARY KEY  (`id`),
   UNIQUE KEY `unique_1`
   (
      `idCountry`,`premiseName`,`premiseNumber`,`subpremiseNumber`,
      `streetName`,`idStreetType`,`streetNumber`,`idState`,`city`,`suburb`
   ),
   KEY `address_ibfk_2` (`idState`),
   KEY `address_ibfk_3` (`idStreetType`),
   CONSTRAINT `address_ibfk_1` FOREIGN KEY (`idCountry`) REFERENCES `country` (`id`),
   CONSTRAINT `address_ibfk_2` FOREIGN KEY (`idState`) REFERENCES `state` (`id`),
   CONSTRAINT `address_ibfk_3` FOREIGN KEY (`idStreetType`) REFERENCES `streetType` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `streetType`
(
   `id` int(10) unsigned NOT NULL auto_increment,
   `create` timestamp NOT NULL default CURRENT_TIMESTAMP,
   `name` varchar(32) default NULL,
   `abbreviation` varchar(16) default NULL,
   PRIMARY KEY  (`id`),
   UNIQUE KEY `name` (`name`),
   UNIQUE KEY `abbreviation` (`abbreviation`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `state`
(
   `id` int(10) unsigned NOT NULL auto_increment,
   `create` timestamp NOT NULL default CURRENT_TIMESTAMP,
   `idCountry` int(10) unsigned NOT NULL,
   `name` varchar(64) NOT NULL,
   `abbreviation` varchar(16) default NULL,
   PRIMARY KEY  (`id`),
   UNIQUE KEY `unique_1` (`idCountry`,`name`),
   UNIQUE KEY `unique_2` (`idCountry`,`abbreviation`),
   KEY `index_idCountry` (`idCountry`),
   CONSTRAINT `state_ibfk_1` FOREIGN KEY (`idCountry`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `country`
(
   `id` int(10) unsigned NOT NULL auto_increment,
   `create` timestamp NOT NULL default CURRENT_TIMESTAMP,
   `domain` varchar(2) default NULL,
   `name` varchar(64) NOT NULL,
   `isCommon` tinyint(1) NOT NULL,
   PRIMARY KEY  (`id`),
   UNIQUE KEY `unique_2` (`name`),
   UNIQUE KEY `unique_1` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `email`
(
   `id` int(10) unsigned NOT NULL auto_increment,
   `create` timestamp NOT NULL default CURRENT_TIMESTAMP,
   `username` varchar(32) NOT NULL,
   `domain` varchar(32) NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `index_userName` (`username`),
   KEY `index_domain` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

CREATE TABLE `website`
(
   `id` int(10) unsigned NOT NULL auto_increment,
   `create` timestamp NOT NULL default CURRENT_TIMESTAMP,
   `domain` varchar(32) NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `index_domain` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*******************************************END*OF*FILE********************************************/
