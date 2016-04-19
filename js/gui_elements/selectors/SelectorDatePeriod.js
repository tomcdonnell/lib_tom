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
      var f = 'SelectorDatePeriod.getSelectedPeriod()';
      UTILS.checkArgs(f, arguments, []);

      var sDate = sDateSelector.getSelectedDate();
      var fDate = fDateSelector.getSelectedDate();

      return p =
      {
         sYear : sDate.year ,
         sMonth: sDate.month,
         sDay  : sDate.day  ,
         fYear : fDate.year ,
         fMonth: fDate.month,
         fDay  : fDate.day
      };
   };

   /*
    *
    */
   this.getSelectors = function ()
   {
      var f = 'SelectorDatePeriod.getSelectors()';
      UTILS.checkArgs(f, arguments, []);

      var sDate = sDateSelector.getSelectors();
      var fDate = fDateSelector.getSelectors();

      return s =
      {
         sYear : sDate.year ,
         sMonth: sDate.month,
         sDay  : sDate.day  ,
         fYear : fDate.year ,
         fMonth: fDate.month,
         fDay  : fDate.day
      };
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setSelectedPeriod = function (sY, sM, sD, fY, fM, fD)
   {
      var f = 'SelectorDatePeriod.setSelectedPeriod()';
      UTILS.checkArgs(f, arguments, ['number', 'number', 'number', 'number', 'number', 'number']);

      var dateComparison = UTILS.date.compare(sY, sM, sD, fY, fM, fD);

      if (dateComparison > 0)
      {
         throw new Exception(f, 'Attempted to set invalid period (sDate > fDate).', '');
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
   };

   /*
    *
    */
   this.setDisabled = function (bool)
   {
      var f = 'SelectorDatePeriod.setDisabled()';
      UTILS.checkArgs(f, arguments, ['boolean']);

      sDateSelector.setDisabled(bool);
      fDateSelector.setDisabled(bool);
   };

   /*
    *
    */
   this.setSelectableYearRange = function (minY, maxY)
   {
      var f = 'SelectorDatePeriod.setSelectableYearRange()';
      UTILS.checkArgs(f, arguments, ['nullOrPositiveInt', 'nullOrPositiveInt']);
      UTILS.assert(f, 0, minY === null || maxY === null || minY > 0 && minY <= maxY);

      sDateSelector.setSelectableYearRange(minY, maxY);
      fDateSelector.setSelectableYearRange(minY, maxY);
   };

   // Other public functions. -----------------------------------------------------------------//

   /*
    *
    */
   this.selectedPeriodEquals = function (sY, sM, sD, fY, fM, fD)
   {
      var f = 'SelectorDatePeriod.selectedPeriodEquals()';
      UTILS.checkArgs(f, arguments, ['number', 'number', 'number', 'number', 'number', 'number']);

      return bool =
      (
         sDateSelector.selectedDateEquals(sY, sM, sD) &&
         fDateSelector.selectedDateEquals(fY, fM, fD)
      );
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
         UTILS.checkArgs(f, arguments, ['object']);

         var sDate = sDateSelector.getSelectedDate();
         var fDate = fDateSelector.getSelectedDate();
         var dateComparison = UTILS.date.compare
         (
            sDate.year, sDate.month, sDate.day,
            fDate.year, fDate.month, fDate.day
         );

         // If the start date is after the finish date...
         if (dateComparison > 0)
         {
            // Set the finish date to equal the start date.
            fDateSelector.setSelectedDate(sDate.year, sDate.month, sDate.day);
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
         UTILS.checkArgs(f, arguments, ['object']);

         var sDate = sDateSelector.getSelectedDate();
         var fDate = fDateSelector.getSelectedDate();
         var dateComparison = UTILS.date.compare
         (
            fDate.year, fDate.month, fDate.day,
            sDate.year, sDate.month, sDate.day
         );

         // If the finish date is before the start date...
         if (dateComparison < 0)
         {
            // Set the start date to equal the finish date.
            sDateSelector.setSelectedDate(fDate.year, fDate.month, fDate.day);
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

      var sDate = sDateSelector.getSelectors();
      var fDate = fDateSelector.getSelectors();

      $(sDate.year ).change(onChangeSdate);
      $(sDate.month).change(onChangeSdate);
      $(sDate.day  ).change(onChangeSdate);
      $(fDate.year ).change(onChangeFdate);
      $(fDate.month).change(onChangeFdate);
      $(fDate.day  ).change(onChangeFdate);

      $(sDate.year ).attr('name', 'sYear' );
      $(sDate.month).attr('name', 'sMonth');
      $(sDate.day  ).attr('name', 'sDay'  );
      $(fDate.year ).attr('name', 'fYear' );
      $(fDate.month).attr('name', 'fMonth');
      $(fDate.day  ).attr('name', 'fDay'  );

      fTimeSelector.setSelectedTime(23, 59, 59);
   }

   // Public variables. /////////////////////////////////////////////////////////////////////////

   var sDateSelector = new SelectorDate();
   var sTimeSelector = new SelectorTime();
   var fDateSelector = new SelectorDate();
   var fTimeSelector = new SelectorTime();

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
