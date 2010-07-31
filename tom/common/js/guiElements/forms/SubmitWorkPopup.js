/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "SubmitWorkPopup.js"
*
* Project: General forms.
*
* Purpose: Popup GUI element containing a form with inputs for name, story fork name, email
*          address, password.
*
* Author: Tom McDonnell 2008-10-01.
*
\**************************************************************************************************/

// Object definition. //////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function SubmitWorkPopup(onSubmitWorkFunction)
{
   var f = 'SubmitWorkPopup()';
   UTILS.checkArgs(f, arguments, [Function]);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getDiv    = function () {return mainDiv;};
   this.getInputs = function () {return inputs ;};

   /*
    *
    */
   this.getData = function ()
   {
      var f = 'SubmitWorkPopup.getData()';
      UTILS.checkArgs(f, arguments, []);

      var c = inputs.checkboxes;
      var s = inputs.selectors;
      var t = inputs.textboxes;
      var p = inputs.passwords;

      var selectedIndex  = s.n_cellsNotify.selectedIndex;
      var n_cellsNotify = s.n_cellsNotify.options[selectedIndex].value;

      var data =
      {
         artistName     : t.artistName.value,
         emailAddress   : t.emailAddress.value,
         n_cellsNotify  : (c.notifyOfAdditions.checked)? Number(n_cellsNotify): 0,
         password1      : p.one.value,
         password2      : p.two.value,
         storyForkName  : t.storyForkName.value,
         submittedBefore: c.submittedBefore.checked
      };

      return data;
   };

   // Other priviliged functions. -------------------------------------------------------------//

   /*
    *
    */
   this.reveal = function ()
   {
      var f = 'SubmitWorkPopup.reveal()';
      UTILS.checkArgs(f, arguments, []);

      showOrHideMessageDiv('hide');
      mainDiv.style.display = 'block';
      inputs.textboxes.artistName.focus();
   };

   /*
    *
    */
   this.showSuccessMessage = function ()
   {
      var f = 'SubmitWorkPopup.showSuccessMessage()';
      UTILS.checkArgs(f, arguments, []);

      setMessageRowText
      (
         [
            'Success'
         ]
      );
      showOrHideMessageDiv('show');
   };

   /*
    *
    */
   this.showFailureMessage = function (errorMsg)
   {
      var f = 'SubmitWorkPopup.showFailureMessage()';
      UTILS.checkArgs(f, arguments, [String]);

      setMessageRowText
      (
         [
            'Failure: ' + errorMsg
         ]
      );
      showOrHideMessageDiv('show');
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onFocusInput(e)
   {
      try
      {
         var f = 'SubmitWorkPopup.onFocusInput()';
         UTILS.checkArgs(f, arguments, [Event]);

         showOrHideMessageDiv('hide');
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onChangeSubmittedWorkBefore(e)
   {
      try
      {
         var f = 'SubmitWorkPopup.onChangeSubmittedWorkBefore()';
         UTILS.checkArgs(f, arguments, ['nullOrEvent']);

         var elements        = domElements.conditionalDisplay;
         var submittedBefore = inputs.checkboxes.submittedBefore.checked;

         function getDefaultDisplayForElement(element)
         {
            switch (element.tagName)
            {
             case 'LI'   : return 'list-item';
             case 'H2'   : return 'block';
             case 'INPUT': return 'block';
             default:
               throw new Exception
               (
                  f, "Unknown DOM element tag name '" + element.tagName + "'.", ''
               );
            }
         }

         for each (element in elements.ifSubmittedBefore)
         {
            element.style.display = (submittedBefore)? getDefaultDisplayForElement(element): 'none';
         }

         for each (element in elements.ifNotSubmittedBefore)
         {
            element.style.display = (submittedBefore)? 'none': getDefaultDisplayForElement(element);
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
   function onClickSubmit(e)
   {
      try
      {
         var f = 'SubmitWorkPopup.onClickSubmit()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         if (validate())
         {
            userCallbacks.onSubmitWork();
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
   function onClickCancel(e)
   {
      try
      {
         var f = 'SubmitWorkPopup.onClickCancel()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         mainDiv.style.display = 'none';
         userCallbacks.onCancel();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    *
   function onClickSubmittedWorkOk(e)
   {
      try
      {
         var f = 'SubmitWorkPopup.onClickSubmittedWorkOk()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         // Hide main div but prepare to show table if main div is revealed.
         successDiv.style.display = 'none';
         table.style.display      = 'inline';
         mainDiv.style.display    = 'none';
         mainDiv.style.background = '#ff0000';
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }
    */

   // Other private functions. ----------------------------------------------------------------//

   // Validation functions. -------------------------------------------------------------------//

   /*
    * The the form is filled in correctly, return true.
    * If the form is filled in incorrectly, display a message describing the first problem found.
    */
   function validate()
   {
      var f = 'SubmitWorkPopup.validate()';
      UTILS.checkArgs(f, arguments, []);

      var msgLines = getFirstProblemWithPopupInLines();

      if (msgLines !== null)
      {
         setMessageRowText(msgLines);
         showOrHideMessageDiv('show');
         return false;
      }
      else
      {
         return true;
      }
   }

   /*
    *
    */
   function setMessageRowText(lines)
   {
      var f = 'SubmitWorkPopup.setMessageRowText()';
      UTILS.checkArgs(f, arguments, [Array]);

      var n_lines   = lines.length;
      var div       = domElements.messageDiv;
      div.innerHTML = '';

      if (n_lines == 0)
      {
         return;
      }

      div.appendChild(document.createTextNode(lines[0]));

      for (var i = 1, len = lines.length; i < len; ++i)
      {
         div.appendChild(BR());
         div.appendChild(document.createTextNode(lines[i]));
      }
   }

   /*
    *
    */
   function getFirstProblemWithPopupInLines()
   {
      var f = 'SubmitWorkPopup.getFirstProblemWithPopupInLines()';
      UTILS.checkArgs(f, arguments, []);

      var cs = inputs.checkboxes;
      var ss = inputs.selectors;
      var ts = inputs.textboxes;
      var ps = inputs.passwords;
      var bs = inputs.buttons;

      var firstLine = 'The form is not yet ready to be submitted.';

      // Artist name.
      if (!UTILS.validator.checkMinLengthAndTextCharSet(ts.artistName.value, 2))
      {
         var strs =
         [
            firstLine,
            'Your name must be at least two characters long and each character' +
            ' must be either be an alphabet character or a single quote or a hyphen.'
         ];

         return strs;
      }

      // Passwords.
      var p1 = ps.one.value;
      var p2 = ps.two.value;
      if (!UTILS.validator.checkMinLengthAndTextCharSet(p1, 5))
      {
         return [firstLine, 'Passwords must be at least 5 characters long.'];
      }
      if (!cs.submittedBefore.checked && p1 != p2)
      {
         return [firstLine, 'The two passwords must match exactly.'];
      }

      // Story fork name.
      if (!UTILS.validator.checkMinLengthAndExtendedTextCharSet(ts.storyForkName.value, 2))
      {
         var strs =
         [
            firstLine,
            'The story fork name must be at least two characters long and each character' +
            ' must be either be an alphabet character or a single quote or a hyphen.'
         ];

         return strs;
      }

      // Email address.
      var emailAddress = ts.emailAddress.value
      if (emailAddress != '' && !UTILS.validator.checkEmailAddress(emailAddress))
      {
         var strs =
         [
            firstLine,
            'The email address must either be blank or be a valid email address.'
         ];

         return strs;
      }

      return null;
   }

   /*
    *
    */
   function showOrHideMessageDiv(showORhide)
   {
      var f = 'SubmitWorkPopup.showOrHideMessageDiv()';
      UTILS.checkArgs(f, arguments, [String]);

      var style = domElements.messageDiv.style;

      switch (showORhide)
      {
       case 'show': style.display = 'inline'; break;
       case 'hide': style.display = 'none'  ; break;
       default:
         throw new Exception(f, "Expected 'show' or 'hide'.  Received '" + showORhide + "'.", '');
      }
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function init()
   {
      var f = 'SubmitWorkPopup.init()';
      UTILS.checkArgs(f, arguments, []);

      var c = inputs.checkboxes;
      var b = inputs.buttons;
      var s = inputs.selectors;
      var t = inputs.textboxes;

      c.submittedBefore.addEventListener('change', onChangeSubmittedWorkBefore, false);
      b.submit.addEventListener('click', onClickSubmit, false);
      b.cancel.addEventListener('click', onClickCancel, false);

      showOrHideMessageDiv('hide');

      // Note: Array function 'concat' does not exist for ElementLists.
      for each (c in inputs.checkboxes) {c.addEventListener('focus', onFocusInput, false);}
      for each (s in inputs.selectors ) {s.addEventListener('focus', onFocusInput, false);}
      for each (t in inputs.textboxes ) {t.addEventListener('focus', onFocusInput, false);}
      for each (b in inputs.buttons   ) {b.addEventListener('focus', onFocusInput, false);}
      for each (p in inputs.passwords ) {p.addEventListener('focus', onFocusInput, false);}

      // Show or hide conditional display elements.
      onChangeSubmittedWorkBefore(null);
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   // DOM elements. ---------------------------------------------------------------------------//

   var inputs =
   {
      checkboxes:
      {
         submittedBefore  : INPUT({type: 'checkbox'}),
         notifyOfAdditions: INPUT({type: 'checkbox'})
      },
      textboxes:
      {
         // NOTE: The maxLength attributes must match restrictions imposed at the server.
         artistName   : INPUT({type: 'text', class: 'textbox', maxlength: 32}),
         storyForkName: INPUT({type: 'text', class: 'textbox', maxlength: 64}),
         emailAddress : INPUT({type: 'text', class: 'textbox', maxlength: 32})
      },
      passwords:
      {
         one: INPUT({type: 'password', class: 'textbox'                         }),
         two: INPUT({type: 'password', class: 'textbox displayIfSubmittedBefore'})
      },
      selectors:
      {
         n_cellsNotify: SELECT
         (
            OPTION({value:  '10'},  '10'),
            OPTION({value:  '25'},  '25'),
            OPTION({value:  '50'},  '50'),
            OPTION({value: '100'}, '100')
         )
      },
      buttons:
      {
         submit: INPUT({class: 'submit', type: 'button', value: 'Submit'}),
         cancel: INPUT({class: 'cancel', type: 'button', value: 'Cancel'})
      },
      links:
      {
         resendPassword: SPAN({class: 'link'}, 'here')
      }
   };

   var domElements =
   {
      messageDiv: DIV({class: 'errorMsg heading', style: 'float: left;'}),
      successDiv: DIV
      (
         {class: 'success', style: 'visibility: hidden;'},
         inputs.buttons.submit
      ),
      conditionalDisplay:
      {
         ifSubmittedBefore:
         {
            artistNameLi: LI
            (
               'Your name must match the name you provided on your first submission.'
            ),
            confirmPasswordH2: H2('Confirm Password'),
            resendPasswordLi: LI
            (
               'Click ', inputs.links.resendPassword,
               ' to have your password re-sent to the email address stored for your name.'
            ),
            emailAddressLi: LI
            (
               'Leave blank to use the email address you last provided, or enter' +
               ' a new one to change the email address stored for your name.'
            ),
            enterPasswordH2: H2('Password')
         },
         ifNotSubmittedBefore:
         {
            choosePasswordH2 : H2('Choose Password' ),
            confirmPasswordH2: H2('Confirm Password'),
            inputPasswordTwo : inputs.passwords.two
         }
      }
   };

   var mainDiv = DIV
   (
      {id: 'submitWorkPopup', style: 'display: none;'},
      H1('Submit Work'),
      P
      (
         {class: 'leftSideWrapper'},
         P
         (
            inputs.checkboxes.submittedBefore, 'I have submitted work before.'
         ),
         P
         (
            H2('Your Name'), inputs.textboxes.artistName,
            DIV({class: 'clearFloats'}),
            UL
            (
               LI
               (
                  'Your name will be displayed above each of your submitted' +
                  " cells next to the heading 'Author'."
               ),
               domElements.conditionalDisplay.ifSubmittedBefore.artistNameLi
            )
         ),
         P
         (
            domElements.conditionalDisplay.ifSubmittedBefore.enterPasswordH2,
            domElements.conditionalDisplay.ifNotSubmittedBefore.choosePasswordH2,
            inputs.passwords.one,
            DIV({class: 'clearFloats'}),
            domElements.conditionalDisplay.ifNotSubmittedBefore.confirmPasswordH2,
            inputs.passwords.two,
            DIV({class: 'clearFloats'}),
            UL
            (
               LI('A password is required to stop others submitting work in your name.'),
               domElements.conditionalDisplay.ifSubmittedBefore.resendPasswordLi
            )
         )
      ),
      P({class: 'verticalGap'}),
      P
      (
         {class: 'rightSideWrapper'},
         P
         (
            H2('Story Fork Name'), inputs.textboxes.storyForkName,
            DIV({class: 'clearFloats'}),
            UL
            (
               LI('Short description of plot development.  Eg. "Frankie goes to Hollywood".')
            )
         ),
         P
         (
            H2('Email Address'), inputs.textboxes.emailAddress,
            DIV({class: 'clearFloats'}),
            UL
            (
               domElements.conditionalDisplay.ifSubmittedBefore.emailAddressLi,
               LI
               (
                  'Your email address will only be used to:',
                  UL
                  (
                     LI('Remind you of your password if you forget it'),
                     LI('Notify you of additions to your story (if you check the checkbox below)')
                  )
               )
            ),
            P
            (
               inputs.checkboxes.notifyOfAdditions,
               'Notify me of additions to my story for the next',
               inputs.selectors.n_cellsNotify, 'cells.'
            )
         )
      ),
      DIV({class: 'clearFloats'  }), domElements.messageDiv,
      DIV({style: 'float: right;'} , inputs.buttons.submit , inputs.buttons.cancel),
      DIV({class: 'clearFloats'  })
   );

   // Other private variables. ----------------------------------------------------------------//

   var self = this;

   var userCallbacks =
   {
      onSubmitWork: onSubmitWorkFunction,
      onCancel    : function () {}
   };

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
