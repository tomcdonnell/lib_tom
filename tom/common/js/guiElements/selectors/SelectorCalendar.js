/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "SelectorCalendar.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the SelectorCalendar object.
*
* Author: Tom McDonnell 2007-12-24.
*
\**************************************************************************************************/

function SelectorCalendar(initialDate)
{
   var f = 'SelectorCalendar()';
   UTILS.checkArgs(f, arguments, [Date]);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getSelectedYear  = function () {return selectedYear; };
   this.getSelectedMonth = function () {return selectedMonth;};
   this.getSelectedDay   = function () {return selectedDay   };

   this.getSelectedDate = function ()
   {
      return d =
      {
         year : selectedYear,
         month: selectedMonth,
         day  : selectedDay
      };
   };

   this.getTable = function ()
   {
      return table;
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    * NOTE: Functions for setting year, month, and day separately are not
    *       provided because the resulting selected date may not exist.
    */
   this.setSelectedDate = function (y, m, d)
   {
      var f = 'SelectorCalendar.setSelectedDate()';
      UTILS.checkArgs(f, arguments, [Number, Number, Number]);

      if (UTILS.date.dateExists(y, m, d))
      {
         selectedYear  = y;
         selectedMonth = m;
         selectedDay   = d;

         removeDayTableRows();
         appendDayTableRows();
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

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onClickDecrementYear(e)
   {
      try
      {
         var f = 'SelectorCalendar.onClickDecrementYear()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         --selectedYear;
         if (selectedMonth == 2)
         {
            ensureSelectedDateExists();
         }

         removeDayTableRows();
         selectedYearSquare.innerHTML = String(selectedYear);
         appendDayTableRows();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickIncrementYear(e)
   {
      try
      {
         var f = 'SelectorCalendar.onClickIncrementYear()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         ++selectedYear;
         if (selectedMonth == 2)
         {
            ensureSelectedDateExists();
         }

         removeDayTableRows();
         selectedYearSquare.innerHTML = String(selectedYear);
         appendDayTableRows();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickDecrementMonth(e)
   {
      try
      {
         var f = 'SelectorCalendar.onClickDecrementMonth()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         if (selectedMonth == 1)
         {
            --selectedYear;
            selectedYearSquare.innerHTML = String(selectedYear);
            selectedMonth = 12;
         }
         else
         {
            --selectedMonth;
         }

         ensureSelectedDateExists();

         removeDayTableRows();
         selectedMonthSquare.innerHTML = UTILS.date.getMonthAbbrev(selectedMonth);
         appendDayTableRows();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickIncrementMonth(e)
   {
      try
      {
         var f = 'SelectorCalendar.onClickIncrementMonth()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         if (selectedMonth == 12)
         {
            ++selectedYear;
            selectedYearSquare.innerHTML = String(selectedYear);
            selectedMonth = 1;
         }
         else
         {
            ++selectedMonth;
         }

         ensureSelectedDateExists();

         removeDayTableRows();
         selectedMonthSquare.innerHTML = UTILS.date.getMonthAbbrev(selectedMonth);
         appendDayTableRows();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickDaySquare(e)
   {
      try
      {
         var f = 'SelectorCalendar.onClickDaySquare()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         selectedDaySquare.removeAttribute('class');

         selectedDaySquare = e.target;
         selectedDaySquare.setAttribute('class', 'selected');
         selectedDay = Number(selectedDaySquare.innerHTML);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Other private functions. ----------------------------------------------------------------//

   /*
    * If the selected date (given by selectedYear, selectedMonth, selectedDay) refers to a date
    * that does not exist (eg 30th Feb), decrement the selectedDay until an existing date is found.
    * This function should be called after the selectedYear or selectedMonth is incremented or
    * decremented.
    */
   function ensureSelectedDateExists()
   {
      var f = 'SelectorCalendar.ensureSelectedDateExists()';
      UTILS.checkArgs(f, arguments, []);

      while (!UTILS.date.dateExists(selectedYear, selectedMonth, selectedDay))
      {
         --selectedDay;
      }
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function init(date)
   {
      var f = 'SelectorCalendar.init()';
      UTILS.checkArgs(f, arguments, [Date]);

      appendDayTableRows();

      yDecrementButton.addEventListener('click', onClickDecrementYear , false);
      yIncrementButton.addEventListener('click', onClickIncrementYear , false);
      mDecrementButton.addEventListener('click', onClickDecrementMonth, false);
      mIncrementButton.addEventListener('click', onClickIncrementMonth, false);
   }

   /*
    * Append to the main table:
    *   A TR element for each week of the month,
    *   containing a TD element for each day of the week.
    */
   function appendDayTableRows()
   {
      var f = 'SelectorCalendar.appendDayTableRows()';
      UTILS.checkArgs(f, arguments, []);

      // Range of weekDay: [0, 6].
      // NOTE: JS month days start at 0, so decrement by 1.
      var weekDay = UTILS.date.getFirstDayOfMonth(selectedYear, selectedMonth);
      var weekNo  = UTILS.date.getFirstWeekOfMonth(selectedYear, selectedMonth);
      var weekRow = TR(TD({class: 'weekNumber'}, String(++weekNo)));

      // Fill blank day squares (before beginning of month).
      var n_daysInPrevMonth =
      (
         (month = 1)? 31: UTILS.date.getN_daysInMonth(selectedYear, selectedMonth - 1)
      );
      var d = n_daysInPrevMonth - weekDay - 1;
      for (var wd = 0; wd < weekDay; ++wd)
      {
         weekRow.appendChild(TD({class: 'prevMonth'}, String(++d)));
      }

      // Fill month day squares.
      var n_daysInMonth = UTILS.date.getN_daysInMonth(selectedYear, selectedMonth);
      var n_weekRowsAppended = 0;
      for (var d = 1; d <= n_daysInMonth; ++d)
      {
         daySquare = TD(String(d));
         daySquare.addEventListener('click', onClickDaySquare, false);

         if (d == selectedDay)
         {
            daySquare.setAttribute('class', 'selected');
            selectedDaySquare = daySquare;
         }

         weekRow.appendChild(daySquare);

         if (++weekDay == 7)
         {
            weekDay = 0;
            tbody.appendChild(weekRow);
            ++n_weekRowsAppended;
            weekRow = TR(TD({class: 'weekNumber'}, String(++weekNo)));
         }
      }

      // Fill blank day squares (after end of month).
      var d = 0; 
      for (var wd = weekDay; wd < 7; ++wd)
      {
         weekRow.appendChild(TD({class: 'nextMonth'}, String(++d)));
      }

      tbody.appendChild(weekRow);
      ++n_weekRowsAppended;

      // If only four week rows have been appended...
      if (n_weekRowsAppended == 5)
      {
         // Append a fifth week row so that five weeks are displayed for all months.
         weekRow = TR(TD({class: 'weekNumber'}, String(++weekNo)));
         for (var wd = 0; wd < 7; ++wd)
         {
            weekRow.appendChild(TD({class: 'nextMonth'}, String(++d)));
         }
         tbody.appendChild(weekRow);
      }
   }

   /*
    * Remove the rows of the table that contain the day squares (all but the top two rows).
    */
   function removeDayTableRows()
   {
      var f = 'SelectorCalendar.removeDayTableRows()';
      UTILS.checkArgs(f, arguments, []);

      var rows = tbody.childNodes;

      var n_rows = rows.length;

      for (r = 2; r < n_rows; ++r)
      {
         tbody.removeChild(rows[2]);
      }
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var maxYear;
   var minYear;

   var selectedYear  = initialDate.getFullYear();
   var selectedMonth = initialDate.getMonth() + 1;
   var selectedDay   = initialDate.getDate();

   var selectedDaySquare = null;

   var selectedYearSquare  = TH({class: 'year' }, String(selectedYear));
   var selectedMonthSquare = TH({class: 'month'}, UTILS.date.getMonthAbbrev(selectedMonth));

   var mDecrementButton = INPUT({type: 'button', value: '<'});
   var mIncrementButton = INPUT({type: 'button', value: '>'});
   var yDecrementButton = INPUT({type: 'button', value: '<'});
   var yIncrementButton = INPUT({type: 'button', value: '>'});

   var weekDayAttributes = {class: 'day', width: String(100 / 8) + '%'};

   var tbody = TBODY
   (
      TR
      (
         TH({class: 'week'  , rowspan: 2}, 'Week', BR(), 'No.'),
         TH({class: 'year' }, yDecrementButton), selectedYearSquare,
         TH({class: 'year' }, yIncrementButton), TH(),
         TH({class: 'month'}, mDecrementButton), selectedMonthSquare,
         TH({class: 'month'}, mIncrementButton)
      ),
      TR
      (
         TH(weekDayAttributes, 'Sun'),
         TH(weekDayAttributes, 'Mon'),
         TH(weekDayAttributes, 'Tue'),
         TH(weekDayAttributes, 'Wed'),
         TH(weekDayAttributes, 'Thu'),
         TH(weekDayAttributes, 'Fri'),
         TH(weekDayAttributes, 'Sat')
      )
   );

   var table = TABLE({class: 'calendar'}, tbody);

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init(initialDate);
}

/*******************************************END*OF*FILE********************************************/
