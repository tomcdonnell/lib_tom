/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "EventRegistry.js"
*
* Project: General objects.
*
* Purpose: Definition of the EventRegistry object.
*
* Author: Tom McDonnell 2007
*
\**************************************************************************************************/

/*
 *
 */
function EventRegistry()
{
   var f = 'EventRegistry()';
   UTILS.checkArgs(f, arguments, []);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   /*
    *
    */
   this.fire = function (eventName, paramsObject)
   {
      var f = 'EventRegistry.fire()';
      UTILS.checkArgs(f, arguments, [String, Object]);

      var subscriberFunctions = _getSubscriberFunctions(eventName);

      for (var i = 0; i < subscriberFunctions.length; ++i)
      {
         try
         {
            subscriberFunctions[i](paramsObject);
         }
         catch (e)
         {
            UTILS.printExceptionToConsole(f, e);
         }
      }
   };

   /*
    *
    */
   this.subscribe = function (eventName, subscriberF)
   {
      var f = 'EventRegistry.subscribe()';
      UTILS.checkArgs(f, arguments, [String, Function]);

      if (typeof _subscriberFunctionsByEventName[eventName] == 'undefined')
      {
         _subscriberFunctionsByEventName[eventName] = [];
      }

      _subscriberFunctionsByEventName[eventName].push(subscriberF);
   };

   /*
    *
    */
   this.isSubscribed = function (eventName, subscriberF)
   {
      var f = 'EventRegistry.isSubscribed()';
      UTILS.checkArgs(f, arguments, [String, Function]);

      var subscriberFunctions = _getSubscriberFunctions(eventName);

      for (var i = 0; i < subscriberFunctions.length; ++i)
      {
         if (subscriberF === subscriberFunctions[i])
         {
            return true;
         }
      }

      return false;
   };

   /*
    *
    */
   this.unsubscribe = function (eventName, subscriberF)
   {
      var f = 'EventRegistry.unsubscribe()';
      UTILS.checkArgs(f, arguments, [String, Function]);

      var subscriberFunctions = _getSubscriberFunctions(eventName);

      for (var i = 0; i < subscriberFunctions.length; ++i)
      {
         if (subscriberF === subscriberFunctions[i])
         {
            subscriberFunctions.splice(i, 1);
            return;
         }
      }

      throw new Exception
      (
         f, 'Impossible unsubscribe.',
         'Could not cancel subscription from the event named "' +
         eventName + '", because no event with that name has been registered.'
      );
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _getSubscriberFunctions(eventName)
   {
      var f = 'EventRegistry._getSubscriberFunctions()';
      UTILS.checkArgs(f, arguments, [String]);

      if (typeof _subscriberFunctionsByEventName[eventName] == 'undefined')
      {
         throw new Exception
         (
            f, "Attempted to get subscribers for non-existent event '" + eventName + "'.", ''
         );
      }

      return _subscriberFunctionsByEventName[eventName];
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _subscriberFunctionsByEventName = {};
}

/******************************************END*OF*FILE*********************************************/
