/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "SelectorTime.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the SelectorTime object.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

/*
 *
 */
function SelectorTime()
{
   var f = 'SelectorTime()';
   UTILS.checkArgs(f, arguments, []);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getSelectedHour   = function () {return hSelector.selectedIndex;};
   this.getSelectedMinute = function () {return mSelector.selectedIndex;};

   /*
    *
    */
   this.getSelectedTime = function ()
   {
      var t =
      {
         hour  : hSelector.selectedIndex,
         minute: mSelector.selectedIndex,
         second: 0
      };

      return t;
   };

   /*
    *
    */
   this.getSelectors = function ()
   {
      var s =
      {
         hour  : hSelector,
         minute: mSelector
      };

      return s;
   };

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setSelectedTime = function (h, m)
   {
      var f = 'SelectorTime.setSelectedTime()';
      UTILS.checkArgs(f, arguments, [Number, Number]);
      UTILS.assert(f, 0, 0 <= h && h < 24);
      UTILS.assert(f, 1, 0 <= m && m < 60);

      hSelector.selectedIndex = h;
      mSelector.selectedIndex = m;
   };

   // Other public functions. -----------------------------------------------------------------//

   /*
    *
    */
   this.selectedTimeEquals = function (h, m)
   {
      var bool =
      (
         0 == UTILS.time.compare
         (
            h, m,
            this.getSelectedHour(),
            this.getSelectedMinute()
         )
      );

      return bool;
   };

   /*
    *
    */
   this.addEventListener = function (eventStr, funct, bool)
   {
      var f = 'SelectorTime.addEventListener()';
      UTILS.checkArgs(f, arguments, [String, Function, Boolean]);

      hSelector.addEventListener(eventStr, funct, bool);
      mSelector.addEventListener(eventStr, funct, bool);
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function init()
   {
      var f = 'SelectorTime.init()';
      UTILS.checkArgs(f, arguments, []);

      for (var h = 0; h < 24; ++h)
      {
         hSelector.appendChild(OPTION(((h < 10)? '0': '') + String(h)));
      }

      for (var m = 0; m < 60; ++m)
      {
         mSelector.appendChild(OPTION(((m < 10)? '0': '') + String(m)));
      }
   }

   /*
    *
    */
   this.setDisabled = function (bool)
   {
      var f = 'SelectorTime.setDisabled()';
      UTILS.checkArgs(f, arguments, [Boolean]);

      hSelector.disabled = bool;
      mSelector.disabled = bool;
   };

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var hSelector = SELECT();
   var mSelector = SELECT();

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
