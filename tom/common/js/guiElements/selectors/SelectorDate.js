/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "SelectorDate.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the SelectorDate object.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

/*
 *
 */
function SelectorDate()
{
   var f = 'SelectorDate()';
   UTILS.checkArgs(f, arguments, []);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getSelectedYear  = function () {return ySelector.selectedIndex + minYear;};
   this.getSelectedMonth = function () {return mSelector.selectedIndex + 1;      };
   this.getSelectedDay   = function () {return dSelector.selectedIndex + 1;      };

   /*
    *
    */
   this.getSelectedDate = function ()
   {
      var d =
      {
         year : ySelector.selectedIndex + minYear,
         month: mSelector.selectedIndex + 1,
         day  : dSelector.selectedIndex + 1
      };

      return d;
   };

   /*
    *
    */
   this.getSelectors = function ()
   {
      var s =
      {
         year : ySelector,
         month: mSelector,
         day  : dSelector
      };

      return s;
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    * NOTE: Functions for setting year, month, and day separately are not
    *       provided because the resulting selected date may not exist.
    */
   this.setSelectedDate = function (y, m, d)
   {
      var f = 'SelectorDate.setSelectedDate()';
      UTILS.checkArgs(f, arguments, [Number, Number, Number]);

      if (UTILS.date.dateExists(y, m, d))
      {
         ySelector.selectedIndex = y - minYear;
         mSelector.selectedIndex = m - 1;
         dSelector.selectedIndex = d - 1;
      }
      else
      {
         throw new Exception
         (
            f, 'Invalid date.',
            '{year: ' + y + ', month: ' + m + ', day: ' + d + '}.'
         );
      }
   };

   /*
    *
    */
   this.setSelectedDateToMinimum = function ()
   {
      var f = 'SelectorDate.setSelectedDateToMinimum()';
      UTILS.checkArgs(f, arguments, []);

      ySelector.selectedIndex = 0;
      mSelector.selectedIndex = 0;
      dSelector.selectedIndex = 0;
   };

   /*
    *
    */
   this.setSelectedDateToMaximum = function ()
   {
      var f = 'SelectorDate.setSelectedDateToMaximum()';
      UTILS.checkArgs(f, arguments, []);

      ySelector.selectedIndex = ySelector.options.length - 1;
      mSelector.selectedIndex = mSelector.options.length - 1;
      dSelector.selectedIndex = dSelector.options.length - 1;
   };

   /*
    *
    */
   this.setSelectableYearRange = function (minY, maxY)
   {
      var f = 'SelectorDate.setSelectableYearRange()';
      UTILS.checkArgs(f, arguments, [Number, Number]);
      UTILS.assert(f, 0, minY > 0 && maxY > minY);

      maxYear = maxY;
      minYear = minY;
   };

   /*
    *
    */
   this.setDisabled = function (bool)
   {
      var f = 'SelectorDate.setDisabled()';
      UTILS.checkArgs(f, arguments, [Boolean]);

      ySelector.disabled = bool;
      mSelector.disabled = bool;
      dSelector.disabled = bool;
   };

   // Other public functions. -----------------------------------------------------------------//

   /*
    *
    */
   this.selectedDateEquals = function (y, m, d)
   {
      var bool =
      (
         0 == UTILS.date.compare
         (
            y, m, d,
            this.getSelectedYear(),
            this.getSelectedMonth(),
            this.getSelectedDay()
         )
      );

      return bool;
   };

   /*
    *
    */
   this.addEventListener = function (eventStr, funct, bool)
   {
      var f = 'SelectorDate.addEventListener()';
      UTILS.checkArgs(f, arguments, [String, Function, Boolean]);

      ySelector.addEventListener(eventStr, funct, bool);
      mSelector.addEventListener(eventStr, funct, bool);
      dSelector.addEventListener(eventStr, funct, bool);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onChangeYear(e)
   {
      try
      {
         var f = 'SelectorDate.onChangeYear()';
         UTILS.checkArgs(f, arguments, [Event]);

         if (mSelector.selectedIndex == 1)
         {
            dSelector.options[28].disabled = !UTILS.date.isLeapYear
            (
               ySelector.selectedIndex + minYear
            );
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onChangeMonth(e)
   {
      try
      {
         var f = 'SelectorDate.onChangeMonth()';
         UTILS.checkArgs(f, arguments, [Event]);

         var n = UTILS.date.getN_daysInMonth
         (
            ySelector.selectedIndex + minYear,
            mSelector.selectedIndex + 1
         );

         dSelector.options[28].disabled = n < 29;
         dSelector.options[29].disabled = n < 30;
         dSelector.options[30].disabled = n < 31;
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function init()
   {
      var f = 'SelectorDate.init()';
      UTILS.checkArgs(f, arguments, []);

      var today = new Date();

      maxYear = today.getFullYear();
      minYear = maxYear - 10;

      for (var y = minYear; y <= maxYear; ++y)
      {
         ySelector.appendChild(OPTION(String(y)));
      }

      for (var m = 1; m <= 12; ++m)
      {
         mSelector.appendChild(OPTION(UTILS.date.getMonthAbbrev(m)));
      }

      for (var d = 1; d <= 31; ++d)
      {
         dSelector.appendChild(OPTION(String(d)));
      }

      ySelector.selectedIndex = maxYear - minYear;
      mSelector.selectedIndex = today.getMonth();
      dSelector.selectedIndex = today.getDate() - 1;

      ySelector.addEventListener('change', onChangeYear , false);
      mSelector.addEventListener('change', onChangeMonth, false);
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var maxYear;
   var minYear;

   var ySelector = document.createElement('select');
   var mSelector = document.createElement('select');
   var dSelector = document.createElement('select');

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
