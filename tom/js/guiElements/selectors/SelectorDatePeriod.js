/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "SelectorDatePeriod.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the SelectorDatePeriod object.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

/*
 *
 */
function SelectorDatePeriod()
{
   var f = 'SelectorDatePeriod()';
   UTILS.checkArgs(f, arguments, []);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.getSelectedPeriod = function ()
   {
      var p =
      {
         start : sDateSelector.getSelectedDate(),
         finish: fDateSelector.getSelectedDate()
      };

      return p;
   };

   /*
    *
    */
   this.getSelectors = function ()
   {
      var s =
      {
         start : sDateSelector.getSelectors(),
         finish: fDateSelector.getSelectors()
      };

      return s;
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setSelectedPeriod = function (sY, sM, sD, fY, fM, fD)
   {
      var f = 'SelectorDatePeriod.setSelectedPeriod()';
      UTILS.checkArgs(f, arguments, [Number, Number, Number, Number, Number, Number]);

      if (UTILS.date.compare(sY, sM, sD, fY, fM, fD) > 0)
      {
         throw new Exception(f, 'Attempted to set invalid period.', '');
      }

      sDateSelector.setSelectedDate(sY, sM, sD);
      fDateSelector.setSelectedDate(fY, fM, fD);
   };

   /*
    *
    */
   this.setSelectedPeriodToMaximum = function ()
   {
      var f = 'SelectorDatePeriod.setSelectedPeriodToMaximum()';
      UTILS.checkArgs(f, arguments, []);

      sDateSelector.setSelectedDateToMinimum();
      fDateSelector.setSelectedDateToMaximum();
   }

   /*
    *
    */
   this.setDisabled = function (bool)
   {
      sDateSelector.setDisabled(bool);
      fDateSelector.setDisabled(bool);
   };

   // Other public functions. -----------------------------------------------------------------//

   /*
    *
    */
   this.selectedPeriodEquals = function (sY, sM, sD, fY, fM, fD)
   {
      var bool =
      (
         sDateSelector.selectedDateEquals(sY, sM, sD) &&
         fDateSelector.selectedDateEquals(fY, fM, fD)
      );

      return bool;
   };

   /*
    *
    */
   this.addEventListener = function (eventStr, funct, bool)
   {
      sDateSelector.addEventListener(eventStr, funct, bool);
      fDateSelector.addEventListener(eventStr, funct, bool);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function onChangeSdate(e)
   {
      try
      {
         var f = 'SelectorDatePeriod.onChangeSdate()';
         UTILS.checkArgs(f, arguments, [Event]);

         var s = sDateSelector.getSelectedDate();
         var f = fDateSelector.getSelectedDate();

         // If the start date is after the finish date...
         if (UTILS.date.compare(s.year, s.month, s.day, f.year, f.month, f.day) > 0)
         {
            // Set the finish date to equal the start date.
            fDateSelector.setSelectedDate(s.year, s.month, s.day);
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
   function onChangeFdate()
   {
      try
      {
         var f = 'SelectorDatePeriod.onChangeFdate()';
         UTILS.checkArgs(f, arguments, [Event]);

         var s = sDateSelector.getSelectedDate();
         var f = fDateSelector.getSelectedDate();

         // If the finish date is before the start date...
         if (UTILS.date.compare(f.year, f.month, f.day, s.year, s.month, s.day) < 0)
         {
            // Set the start date to equal the finish date.
            sDateSelector.setSelectedDate(f.year, f.month, f.day);
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
   function init()
   {
      var f = 'SelectorDatePeriod.init()';
      UTILS.checkArgs(f, arguments, []);

      var s = sDateSelector.getSelectors();
      var f = fDateSelector.getSelectors();

      s.year.addEventListener('change', onChangeSdate, false);
      f.year.addEventListener('change', onChangeFdate, false);
      s.month.addEventListener('change', onChangeSdate, false);
      f.month.addEventListener('change', onChangeFdate, false);
      s.day.addEventListener('change', onChangeSdate, false);
      f.day.addEventListener('change', onChangeFdate, false);
   }

   // Public variables. /////////////////////////////////////////////////////////////////////////

   var sDateSelector = new SelectorDate();
   var fDateSelector = new SelectorDate();

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
