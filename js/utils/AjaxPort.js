/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "AjaxPort.js"
*
* Project: Utilities.
*
* Purpose: Definition of the AjaxPort object.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/**
 * A port through which to sent ajax messages to the server.
 *
 * This class is now deprecated.  Use jQuery instead.
 * Setup jQuery as in following example for equivalent behaviour.
 *
 *  $.ajax
 *  (
 *     {
 *        data       : JSON.stringify({header: 'test', payload: 'testPayload'}),
 *        dataType   : 'json'                  ,
 *        success    : receiveAjaxMessage      ,
 *        type       : 'POST'                  ,
 *        url        : 'www.collaborativecomic.com/pages/main/ajax.php'
 *     }
 *  );
 *
 * @param defUrl {String or null}
 *    The default url to which ajax messages are sent.
 *    Supply null if no default url is to be used.
 *
 * @param defReplyFunct {Function or null}
 *    The default function to be used to process reply messages from the server.
 *    Supply null if no default reply function is to be used.
 */
function AjaxPort(defUrl, defReplyFunct)
{
   var f = 'AjaxPort()';
   UTILS.assert(f, 0, defUrl        == null || defUrl.constructor        == String  );
   UTILS.assert(f, 1, defReplyFunct == null || defReplyFunct.constructor == Function);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   /**
    * Send messages to the server.
    *
    * @param msg {'Defined'}
    *    Message to send to the server.
    *    Type of message is unrestricted, but must be what is expected by the server.
    *
    * @param Alt {Function} (Optional)
    *    Supply this optional argument if you wish to use an alternate processReplyFunct.
    *
    * @param urlAlternate {String} (Optional)
    *    Supply this optional argument if you wish to use an alternate url.
    */
   this.send = function (msg, replyFunct, url)
   {
      var f = 'AjaxPort.send()';
      UTILS.assert(f, 0, 0 < arguments.length && arguments.length <= 3);

      // If a replyFunct was supplied...
      if (typeof replyFunct != 'undefined')
      {
         // Set object scope variables so that altReplyFunct
         // is used instead of defReplyFunct when receive() is called.
         useAltReplyFunct = true;
         altReplyFunct    = replyFunct;
         UTILS.assert(f, 1, altReplyFunct.constructor == Function);
      }

      // If a url was not supplied, use the default.
      if (typeof url == 'undefined') {url = defUrl;}
      UTILS.assert(f, 2, url.constructor == String);

      getNewXMLHttpObject();

      if (httpRequest)
      {
         var jsonMsg = JSON.stringify(msg);
         httpRequest.onreadystatechange = receive;
         httpRequest.open('POST', url, true);
         httpRequest.send(jsonMsg);
      }
      else
      {
         throw new Exception(f, 'AJAX error.', 'Cannot create an XMLHTTP instance.');
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function receive()
   {
      try
      {
         var f = 'AjaxPort.receive()';
         UTILS.checkArgs(f, arguments, [Event]);

         if (httpRequest.readyState == 4)
         {
            if (httpRequest.status == 200)
            {
               var jsonReply = httpRequest.responseText;
               var reply     = JSON.parse(jsonReply);

               switch (useAltReplyFunct)
               {
                case true:
                  altReplyFunct(reply);
                  useAltReplyFunct = false;
                  break;
                case false:
                  defReplyFunct(reply);
                  break;
               }
            }
            else
            {
               throw new Exception(f, 'AJAX error.', 'HTTP request status: ' + httpRequest.status);
            }
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    * Return an XMLHttp object (used for sending AJAX messages).
    * The method to get an XMLHttp object depends upon which browser the client is using.
    */
   function getNewXMLHttpObject()
   {
      var f = 'ajaxPort.getNewXMLHttpObject()';
      UTILS.checkArgs(f, arguments, []);

      if (window.XMLHttpRequest)
      {
         // Mozilla, Safari.
         httpRequest = new XMLHttpRequest();
      }
      else if (window.ActiveXObject)
      {
         // Internet Explorer.
         try       {httpRequest = new ActiveXObject('Msxml2.XMLHTTP'   );}
         catch (e) {httpRequest = new ActiveXObject('Microsoft.XMLHTTP');}
      }
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var httpRequest      = false;
   var useAltReplyFunct = false;
   var altReplyFunct    = null;
}

/*******************************************END*OF*FILE********************************************/
