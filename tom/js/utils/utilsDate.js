/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "utilsDate.js"
*
* Project: Utilities.
*
* Purpose: Functions relating to date.
*
* Author: Tom McDonnell 2006
*
\**************************************************************************************************/

// Namespace 'UTILS' variables. ////////////////////////////////////////////////////////////////////

/**
 * Namespace for date utilities.
 */
UTILS.date = {};

// Namespace 'UTILS.date' functions. ///////////////////////////////////////////////////////////////

/*
 *
 */
UTILS.date.getMonthName = function (m)
{
   var f = 'UTILS.date.getMonthName()';
   UTILS.checkArgs(f, arguments, [Number]);

   switch (m)
   {
    case  1: return 'January'  ;
    case  2: return 'February' ;
    case  3: return 'March'    ;
    case  4: return 'April'    ;
    case  5: return 'May'      ;
    case  6: return 'June'     ;
    case  7: return 'July'     ;
    case  8: return 'August'   ;
    case  9: return 'September';
    case 10: return 'October'  ;
    case 11: return 'November' ;
    case 12: return 'December' ;
    default: throw new Exception(f, 'Invalid month', 'Expected [1, 12].  Received "' + m + '".');
   }
};

/*
 *
 */
UTILS.date.getMonthAbbrev = function (m)
{
   var f = 'UTILS.date.getMonthAbbrev()';
   UTILS.checkArgs(f, arguments, [Number]);

   switch (m)
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
    default: throw new Exception(f, 'Invalid month', 'Expected [1, 12].  Received "' + m + '".');
   }
};

/*
 *
 */
UTILS.date.dateExists = function (y, m, d)
{
   var f = 'UTILS.date.dateExists()';
   UTILS.checkArgs(f, arguments, [Number, Number, Number]);

   var n = UTILS.date.getN_daysInMonth(y, m);

   return (y > 0 && 1 <= d && d <= n);
};

/*
 * Return true if year is leap year, false otherwise.
 */
UTILS.date.isLeapYear = function (y)
{
   var f = 'UTILS.date.isLeapYear()';
   UTILS.checkArgs(f, arguments, [Number]);

   return (y % 4 == 0 && !((y % 100 == 0) && (y % 400 != 0)));
};

/*
 *
 */
UTILS.date.getN_daysInMonth = function (y, m)
{
   var f = 'UTILS.date.getN_daysInMonth()';
   UTILS.checkArgs(f, arguments, [Number, Number]);

   switch (m)
   {
    // Feruary (28 days, except in leap years in which case 29) 
    case 2:
      return (UTILS.date.isLeapYear(y))? 29: 28;

    // Months with 30 days.
    case 4: case 6: case 9: case 11:
      return 30;

    // Months with 31 days.
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      return 31;

    default: throw new Exception(f, 'Invalid month', 'Expected [1, 12].  Received "' + m + '".');
   }
};

/*
 * If A < B return -1
 * If A = B return  0
 * If A > B return +1
 *
 * NOTE: Casts to number are done to avoid problems when numeric strings are compared.
 *       Eg. ('7' < '11') will evaluate to false.
 */
UTILS.date.compare = function (yA, mA, dA, yB, mB, dB)
{
   var f = 'UTILS.date.compare()';
   UTILS.checkArgs(f, arguments, [Number, Number, Number, Number, Number, Number]);

   return c =
   (
      (yA == yB)?
      (
         (mA == mB)?
         (
            (dA == dB)?
            0:
            ((Number(dA) > Number(dB))? 1: -1)
         ):
         ((Number(mA) > Number(mB))? 1: -1)
      ):
      ((Number(yA) > Number(yB))? 1: -1)
   );
};

/*
 * Same as above, but with dates stored in objects {day, month, year}.
 */
UTILS.date.compareObjects = function (dA, dB)
{
   return UTILS.date.compare
   (
      dA.y, dA.m, dA.d,
      dB.y, dB.m, dB.d
   );
};

/*
 * Return a number [0, 6] representing the weekday [Sun, ..., Sat]
 * of the first day of the given month in the given year.
 */
UTILS.date.getFirstDayOfMonth = function (year, month)
{
   var f = 'UTILS.date.getFirstDayOfMonth()';
   UTILS.checkArgs(f, arguments, [Number, Number]);
   UTILS.assert(f, 0, 0 < year);
   UTILS.assert(f, 1, 0 < month && month <= 12);

   var firstDayOfMonth = new Date(year, month - 1, 1);

   return firstDayOfMonth.getDay();
};

/*
 * Return a number [0, 51] representing the week number
 * of the first week of the given month in the given year.
 *
 * Weeks begin on Sunday and end on Saturday.
 * The first week of the year is the week ending on the first Saturday of the year.
 */
UTILS.date.getFirstWeekOfMonth = function (year, month)
{
   var f = 'UTILS.date.getFirstWeekOfMonth()';
   UTILS.checkArgs(f, arguments, [Number, Number]);
   UTILS.assert(f, 0, 0 < year);
   UTILS.assert(f, 1, 0 < month && month <= 12);

   if (month == 1)
   {
      return 0;
   }
   else
   {
      // Get the number of days in the first week of the year.
      var n_daysInFirstWeek = 1;
      var day = new Date(year, 0, n_daysInFirstWeek);
      while (day.getDay() != 6)
      {
         day.setDate(++n_daysInFirstWeek);
      }

      // Count the days in the year before the start of the given month.
      var n_days = 0;
      for (var m = 1; m < month; ++m)
      {
         n_days += UTILS.date.getN_daysInMonth(year, m);
      }

      var n_daysSinceEndOfFirstWeek = n_days - n_daysInFirstWeek;

      return (1 + Math.floor(n_daysSinceEndOfFirstWeek / 7));
   }
};

/*******************************************END*OF*FILE********************************************/
