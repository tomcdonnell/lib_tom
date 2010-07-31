<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Utils_date.php"
*
* Project: Utilities.
*
* Purpose: Utilities relating to dates.
*
* Author: Tom McDonnell 2008-01-07.
*
\**************************************************************************************************/

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class Utils_date
{
   // Public functions. -----------------------------------------------------------------------//

   /*
    *
    */
   public function __construct()
   {
      throw new Exception('This class is not intended to be instatiated.');
   }

   /*
    *
    */
   public static function getMonthOneLetterAbbrev($month)
   {
      switch ($month)
      {
       case  1: return 'J';
       case  2: return 'F';
       case  3: return 'M';
       case  4: return 'A';
       case  5: return 'M';
       case  6: return 'J';
       case  7: return 'J';
       case  8: return 'A';
       case  9: return 'S';
       case 10: return 'O';
       case 11: return 'N';
       case 12: return 'D';
       default: throw new Exception("Invalid month number '$monthNo'.");
      }
   }

   /*
    *
    */
   public static function getMonthThreeLetterAbbrev($month)
   {
      switch ($month)
      {
       case  1: return 'Jan';
       case  2: return 'Feb';
       case  3: return 'Mar';
       case  4: return 'Apr';
       case  5: return 'May';
       case  6: return 'Jun';
       case  7: return 'Jul';
       case  8: return 'Aug';
       case  9: return 'Sep';
       case 10: return 'Oct';
       case 11: return 'Nov';
       case 12: return 'Dec';
       default: throw new Exception("Invalid month number '$monthNo'.");
      }
   }

   /*
    *
    */
   public static function getMonthName($monthNo)
   {
      switch ($monthNo)
      {
       case  1: return 'January';
       case  2: return 'February';
       case  3: return 'March';
       case  4: return 'April';
       case  5: return 'May';
       case  6: return 'June';
       case  7: return 'July';
       case  8: return 'August';
       case  9: return 'September';
       case 10: return 'October';
       case 11: return 'November';
       case 12: return 'December';
       default: throw new Exception("Invalid month number '$monthNo'.");
      }
   }

   /*
    *
    */
   public static function parseSqlDateString($dateStr)
   {
      assert('is_string($dateStr)'   );
      assert('strlen($dateStr) == 10');

      return array
      (
         'year'  => (int)(substr($dateStr,  0,  4)),
         'month' => (int)(substr($dateStr,  5,  2)),
         'day'   => (int)(substr($dateStr,  8,  2))
      );
   }

   /*
    *
    */
   public static function createSqlDateStr($date)
   {
      assert('is_array($date)');

      // NOTE: The following tests are necessary to prevent SQL insertion attacks.
      if (!is_int($date['year']) || !is_int($date['month']) || !is_int($date['day']))
      {
         throw new Exception('Unexpected type(s) encountered.');
      }

      $y = $date['year' ];
      $m = $date['month'];
      $d = $date['day'  ];

      if ($y < 1000 || $y > 9999)
      {
         throw new Exception('Year must be four digits.');
      }

      return $y . '-' . (($m < 10)? '0': '') . $m . '-' . (($d < 10)? '0': '') . $d;
   }

   /*
    * This function may not be necessary due to the existence of function strtotime().
    * It is used for now because I do not know how function strtotime differentiates between
    * strings in format 'dd-mm-yyyy' and those in format 'mm-dd-yyyy' where dd is <= 12.
    */
   public static function getTimestampFromDateString($dateStr, $format = 'yyyy-mm-dd')
   {
      switch ($format)
      {
       case 'yyyy-mm-dd': $regEx = '/^(\d{4})-(\d{2})-(\d{2})$/'  ; $y = 1; $m = 2; $d = 3; break;
       case 'yyyy/mm/dd': $regEx = '/^(\d{4})\/(\d{2})\/(\d{2})$/'; $y = 1; $m = 2; $d = 3; break;
       case 'dd-mm-yyyy': $regEx = '/^(\d{2})-(\d{2})-(\d{4})$/'  ; $d = 1; $m = 2; $y = 3; break;
       case 'dd/mm/yyyy': $regEx = '/^(\d{2})\/(\d{2})\/(\d{4})$/'; $d = 1; $m = 2; $y = 3; break;
       default: throw new Exception("Unknown format string '$format'");
      }

      if (preg_match($regEx, $dateStr, $matches))
      {
         $y = $matches[$y];
         $m = $matches[$m];
         $d = $matches[$d];

         if (checkdate($m, $d, $y))
         {
            return mktime(0, 0, 0, $m, $d, $y);
         }
      }

      return false;
   }
}

/*******************************************END*OF*FILE********************************************/
?>
