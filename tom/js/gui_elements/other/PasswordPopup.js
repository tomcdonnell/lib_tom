/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "PasswordPopup.js"
*
* Project: GUI Elements.
*
* Purpose: Popup GUI element containing a submit and cancel button, and featuring an AJAX port so
*          that the password entered may be checked at the server without a new page having to be
*          loaded.
*
* Author: Tom McDonnell 2008-08-18.
*
\**************************************************************************************************/

// Globally executed code. /////////////////////////////////////////////////////////////////////////

/*
 *
 */
function PasswordPopup(serverSideFilename)
{
   var f = 'PasswordPopup()';
   UTILS.checkArgs(f, arguments, [String]);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getDiv      = function () {return mainDiv                        ;};
   this.getInputs   = function () {return inputs                         ;};
   this.getUserName = function () {return inputs.textboxes.userName.value;};
   this.getPassword = function () {return inputs.textboxes.password.value;};

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setUserName = function (userName)
   {
      var f = 'PasswordPopup.setUserName()';
      UTILS.checkArgs(f, arguments, [String]);

      inputs.textboxes.userName.value = userName;
   };

   /*
    *
    */
   this.setCallbacks = function (onClosePopup, onPasswordMatch)
   {
      var f = 'PasswordPopup.setCallbacks()';
      UTILS.checkArgs(f, arguments, [Function, Function]);

      userCallbacks.onClosePopup    = onClosePopup;
      userCallbacks.onPasswordMatch = onPasswordMatch;
   };

   // Other priviliges functions. -------------------------------------------------------------//

   /*
    *
    */
   this.reveal = function ()
   {
      var f = 'PasswordPopup.reveal()';
      UTILS.checkArgs(f, arguments, []);

      mainDiv.style.display            = 'block';
      divs.enterPassword.style.display = 'block';
      inputs.textboxes.password.focus();
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onClickPasswordSubmit(e)
   {
      try
      {
         var f = 'PasswordPopup.onClickPasswordSubmit()';
         UTILS.checkArgs(f, arguments, [Object]);

         var bp = inputs.buttons.password;
         var t  = inputs.textboxes;

         bp.submit.disabled = true;
         bp.cancel.disabled = true;

         ajaxPort.send(['check_password', [t.userName.value, t.password.value]]);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickPasswordCancel(e)
   {
      try
      {
         var f = 'PasswordPopup.onClickPasswordCancel()';
         UTILS.checkArgs(f, arguments, [Object]);

         divs.message.style.display = 'none' ;
         mainDiv.style.display      = 'none' ;
         divs.enterPassword.display = 'block';

         userCallbacks.onClosePopup();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickEmailSend(e)
   {
      try
      {
         var f = 'PasswordPopup.onClickEmailSend()';
         UTILS.checkArgs(f, arguments, [Object]);

         var be = inputs.buttons.email;

         be.send.disabled   = true;
         be.cancel.disabled = true;

         ajaxPort.send(['send_password_email', inputs.textboxes.userName.value]);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickEmailCancel(e)
   {
      try
      {
         var f = 'PasswordPopup.onClickEmailCancel()';
         UTILS.checkArgs(f, arguments, [Object]);

         divs.forgotPassword.style.display = 'none' ;
         divs.enterPassword.style.display  = 'block';
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickForgotPassword(e)
   {
      try
      {
         var f = 'PasswordPopup.onClickForgotPassword()';
         UTILS.checkArgs(f, arguments, [Object]);

         divs.enterPassword.style.display  = 'none' ;
         divs.forgotPassword.style.display = 'block';
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Ajax reply handlers. --------------------------------------------------------------------//

   /*
    *
    */
   function receiveAjaxMsg(replyMsg)
   {
      try
      {
         var f = 'PasswordPopup.receiveAjaxMsgs()';
         UTILS.checkArgs(f, arguments, [Array]);
         UTILS.assert(f, 0, replyMsg.length == 2);

         var header  = replyMsg[0];
         var payload = replyMsg[1];

         switch (header)
         {
          case 'reply_password_check':
            UTILS.assert(f, 1, payload.constructor == Boolean);
            var bp = inputs.buttons.password;
            bp.submit.disabled               = false;
            bp.cancel.disabled               = false;
            divs.enterPassword.style.display = 'none';
            if (payload)
            {
               userCallbacks.onPasswordMatch();
               divs.accessGranted.style.display = 'block';
               mainDiv.style.background = '#00bb00';
               // NOTE: Background color is set above to mainDiv
               //       and not divs.accessGranted to avoid red border.
            }
            else
            {
               setMessageDivMessage('The password you supplied was incorrect.');
               divs.message.style.display = 'block';
            }
            break;
          case 'reply_send_password_email':
            UTILS.assert(f, 1, payload.constructor == Boolean);
            var be = inputs.buttons.email;
            be.send.disabled                  = false;
            be.cancel.disabled                = false;
            divs.forgotPassword.style.display = 'none';
            divs.message.style.display        = 'block';
            setMessageDivMessage
            (
               'An email ' +
               (
                  (payload)?
                  'was sent to the email address registered for the selected team.':
                  'could not be sent because an error occurred at the server.'
               )
            );
            break;
          default:
            throw new Exception(f, 'Unknown header "' + header + '".', '');
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Other private functions. ----------------------------------------------------------------//

   /*
    *
    */
   function setMessageDivMessage(msg)
   {
      var f = 'PasswordPopup.setMessageDivMessage()';
      UTILS.checkArgs(f, arguments, [String]);

      $(divs.message.firstChild).replaceWith(document.createTextNode(msg));
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function init()
   {
      var f = 'PasswordPopup.init()';
      UTILS.checkArgs(f, arguments, []);

      var b  = inputs.buttons;
      var bp = b.password;
      var be = b.email;
      var bm = b.message;

      $(bp.submit          ).click(onClickPasswordSubmit);
      $(bp.cancel          ).click(onClickPasswordCancel);
      $(be.send            ).click(onClickEmailSend     );
      $(be.cancel          ).click(onClickEmailCancel   );
      $(bm.ok              ).click(onClickPasswordCancel);
      $(inputs.links.forgot).click(onClickForgotPassword);
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var ajaxPort = new AjaxPort(serverSideFilename, receiveAjaxMsg);

   var userCallbacks =
   {
      onPasswordMatch: function () {},
      onClosePopup   : function () {}
   };

   var inputs =
   {
      textboxes:
      {
         userName: INPUT({type: 'text'    , style: 'width: 153px;'}),
         password: INPUT({type: 'password', style: 'width: 153px;'})
      },
      buttons:
      {
         password:
         {
            submit: INPUT({type: 'button', value: 'Submit', style: 'width: 75px; float: left;' }),
            cancel: INPUT({type: 'button', value: 'Cancel', style: 'width: 75px; float: right;'})
         },
         email:
         {
            send  : INPUT({type: 'button', value: 'Send'  , style: 'width: 75px; float: left;' }),
            cancel: INPUT({type: 'button', value: 'Cancel', style: 'width: 75px; float: right;'})
         },
         message:
         {
            ok: INPUT({type: 'button', value: 'OK'})
         }
      },
      links:
      {
         forgot: P
         (
            {style: 'text-decoration: underline; cursor: pointer;'},
            'Forgotten Password?'
         )
      }
   };

   var divs =
   {
      enterPassword: DIV
      (
         P({class: 'heading'}, 'Enter Password'),
         inputs.textboxes.userName     , BR(),
         inputs.textboxes.password     , BR(),
         inputs.buttons.password.submit,
         inputs.buttons.password.cancel,
         DIV({style: 'clear: both;'})  ,
         inputs.links.forgot
      ),
      forgotPassword: DIV
      (
         {style: 'display: none;'},
         "Click 'Send' to send the password to the email address registered for the selected team.",
         BR(),
         inputs.buttons.email.send  ,
         inputs.buttons.email.cancel,
         DIV({style: 'clear: both;'})
      ),
      message: DIV
      (
         {style: 'display: none;'},
         '', BR(),
         inputs.buttons.message.ok
      ),
      accessGranted: DIV
      (
         {class: 'accessGranted', style: 'display: none;'},
         P({class: 'heading'}, '.........', BR(), 'Access Granted', BR(), '.........')
      )
   };

   var mainDiv = DIV
   (
      {id: 'passwordPopup', style: 'display: none; width: 155px;'},
      divs.enterPassword ,
      divs.forgotPassword,
      divs.message,
      divs.accessGranted
   );

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
