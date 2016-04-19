/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "SelectorTimePeriod.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the SelectorTimePeriod object.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

/*
 *
 */
function SelectorTimePeriod()
{
   var f = 'SelectorTimePeriod()';
   UTILS.checkArgs(f, arguments, []);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.getSelectedPeriod = function ()
   {
      var f = 'SelectorTimePeriod.getSelectedPeriod()';
      UTILS.checkArgs(f, arguments, []);

      var sTime = sTimeSelector.getSelectedTime();
      var fTime = fTimeSelector.getSelectedTime();

      return p =
      {
         sHour  : sTime.hour  ,
         sMinute: sTime.minute,
         sSecond: sTime.second,
         fHour  : fTime.hour  ,
         fMinute: fTime.minute,
         fSecond: fTime.second
      };
   };

   /*
    *
    */
   this.getSelectors = function ()
   {
      var f = 'SelectorTimePeriod.getSelectors()';
      UTILS.checkArgs(f, arguments, []);

      var sTime = sTimeSelector.getSelectors();
      var fTime = fTimeSelector.getSelectors();

      return s =
      {
         sHour  : sTime.hour  ,
         sMinute: sTime.minute,
         sSecond: sTime.second,
         fHour  : fTime.hour  ,
         fMinute: fTime.minute,
         fSecond: fTime.second
      };
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setSelectedPeriod = function (sH, sM, sS, fH, fM, sS)
   {
      var f = 'SelectorTimePeriod.setSelectedPeriod()';
      UTILS.checkArgs(f, arguments, ['number', 'number', 'number', 'number', 'number', 'number']);

      if (UTILS.time.compare(sH, sM, sS, fH, fM, sS) > 0)
      {
         throw new Exception(f, 'Attempted to set invalid period.', '');
      }

      sTimeSelector.setSelectedTime(sH, sM, sS);
      fTimeSelector.setSelectedTime(fH, fM, sS);
   };

   /*
    *
    */
   this.setDisabled = function (bool)
   {
      sTimeSelector.setDisabled(bool);
      fTimeSelector.setDisabled(bool);
   };

   // Other public functions. -----------------------------------------------------------------//

   /*
    *
    */
   this.selectedPeriodEquals = function (sH, sM, sS, fH, fM, fS)
   {
      return bool =
      (
         sTimeSelector.selectedTimeEquals(sH, sM, sS) &&
         fTimeSelector.selectedTimeEquals(fH, fM, fS)
      );
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function onChangeStime(e)
   {
      try
      {
         var f = 'SelectorTimePeriod.onChangeStime()';
         UTILS.checkArgs(f, arguments, ['object']);

         var sTime = sTimeSelector.getSelectedTime();
         var fTime = fTimeSelector.getSelectedTime();
         var c     = UTILS.time.compare
         (
            sTime.hour, sTime.minute, sTime.second,
            fTime.hour, fTime.minute, fTime.second
         );

         // If the start time is after the finish time...
         if (c > 0)
         {
            // Set the finish time to equal the start time.
            fTimeSelector.setSelectedTime(sTime.hour, sTime.minute, sTime.second);
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
   function onChangeFtime()
   {
      try
      {
         var f = 'SelectorTimePeriod.onChangeFtime()';
         UTILS.checkArgs(f, arguments, ['object']);

         var sTime = sTimeSelector.getSelectedTime();
         var fTime = fTimeSelector.getSelectedTime();
         var c     = UTILS.time.compare
         (
            sTime.hour, sTime.minute, sTime.second,
            fTime.hour, fTime.minute, fTime.second
         );

         // If the start time is after the finish time...
         if (c > 0)
         {
            // Set the start time to equal the finish time.
            sTimeSelector.setSelectedTime(fTime.hour, fTime.minute, fTime.second);
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
      var f = 'SelectorTimePeriod.init()';
      UTILS.checkArgs(f, arguments, []);

      var sSelectors = sTimeSelector.getSelectors();
      var fSelectors = fTimeSelector.getSelectors();

      $(sSelectors.hour  ).change(onChangeStime);
      $(fSelectors.hour  ).change(onChangeFtime);
      $(sSelectors.minute).change(onChangeStime);
      $(fSelectors.minute).change(onChangeFtime);
      $(sSelectors.second).change(onChangeStime);
      $(fSelectors.second).change(onChangeFtime);
   }

   // Public variables. /////////////////////////////////////////////////////////////////////////

   var sTimeSelector = new SelectorTime();
   var fTimeSelector = new SelectorTime();

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
