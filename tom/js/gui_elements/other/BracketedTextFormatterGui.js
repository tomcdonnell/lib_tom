/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "BracketedTextFormatterGui.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the BracketedTextFormatterGui object.
*
* Author: Tom McDonnell 2009-01-14.
*
\**************************************************************************************************/

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function BracketedTextFormatterGui(bracketedTextFormatter)
{
   var f = 'BracketedTextFormatter()';
   UTILS.checkArgs(f, arguments, [BracketedTextFormatter]);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getDiv = function () {return domElements.divs.main;}

   // Setters. --------------------------------------------------------------------------------//

   this.getSettings = function () {return settings;}

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onClickToggleFormat(e)
   {
      try
      {
         var f = 'BracketedTextFormatterGui.onClickToggleFormat()';
         UTILS.checkArgs(f, arguments, [Object]);

         var inputTextarea      = inputs.textareas.input;
         var outputPre          = domElements.pres.output;
         var errorPre           = domElements.pres.error;
         var toggleFormatButton = inputs.buttons.toggleFormat;

         switch (UTILS.DOM.getStyleProperty(outputPre, 'display'))
         {
          case 'none':
            try
            {
               outputPre.innerHTML = bracketedTextFormatter.formatText(inputTextarea.value);
            }
            catch (e)
            {
               errorPre.innerHTML          = 'ERROR: ' + e.type + '\n\n' + e.details;
               errorPre.style.display      = 'block';
               inputTextarea.style.display = 'none';
               toggleFormatButton.value    = 'Unformat Text';
            }
            outputPre.style.display     = 'block';
            inputTextarea.style.display = 'none';
            toggleFormatButton.value    = 'Unformat Text';
            break;
          case 'block':
            inputTextarea.style.display = 'block';
            outputPre.style.display     = 'none';
            errorPre.style.display      = 'none';
            toggleFormatButton.value    = 'Format Text';
            break;
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
   function onClickClear(e)
   {
      try
      {
         var f = 'BracketedTextFormatterGui.onClickToggleFormat()';
         UTILS.checkArgs(f, arguments, [Object]);

         inputs.textareas.input.value = '';

         if (UTILS.DOM.getStyleProperty(domElements.pres.output, 'display') == 'block')
         {
            onClickToggleFormat(e);
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
   function onBlurMaxCharsPerLineTextbox(e)
   {
      try
      {
         var f = 'BracketedTextFormatterGui.onBlurMaxCharsPerLineTextbox()';
         UTILS.checkArgs(f, arguments, [Object]);

         var mcplTextbox = inputs.textboxes.maxCharsPerLine;

         if (!UTILS.validator.validatePositiveInteger(mcplTextbox.value))
         {
            mcplTextbox.value = 100;
         }

         var settings = bracketedTextFormatter.getSettings();
         settings.maxCharsPerLine = Number(mcplTextbox.value);
         bracketedTextFormatter.setSettings(settings);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickIgnoreMaxCharsPerLineCheckbox(e)
   {
      try
      {
         var f = 'BracketedTextFormatterGui.onClickIgnoreMaxCharsPerLineCheckbox()';
         UTILS.checkArgs(f, arguments, [Object]);

         var settings = bracketedTextFormatter.getSettings();
         settings.ignoreMaxCharsPerLineForUnbreakableStrings = e.target.checked;
         bracketedTextFormatter.setSettings(settings);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickRemoveAllNewLineCharactersFromStrings(e)
   {
      try
      {
         var f = 'BracketedTextFormatterGui.onClickRemoveAllNewLineCharactersFromStrings()';
         UTILS.checkArgs(f, arguments, [Object]);

         var settings = bracketedTextFormatter.getSettings();
         settings.removeAllNewLineCharactersFromStrings = e.target.checked;
         bracketedTextFormatter.setSettings(settings);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickInsertExampleText(e)
   {
      try
      {
         var f = 'BracketedTextFormatterGui.onClickInsertExampleText()';
         UTILS.checkArgs(f, arguments, [Object]);

         inputs.textareas.input.value =
         (
            '[["supply_options_season",[{"id":"0","name":"Select Season"},{"id":12,"name":"Curre' +
            'nt Season (18 matches)"},{"id":11,"name":"Sum\/Aut 2008 (33 matches)"},{"id":10,"na' +
            'me":"Win\/Spr 2007 (16 matches)"},{"id":9,"name":"Aut\/Win 2007 (20 matches)"},{"id' +
            '":8,"name":"Spr\/Sum 2006\/2007 (23 matches)"},{"id":7,"name":"Aut\/Win 2006 (15 ma' +
            'tches)"},{"id":6,"name":"Summer 2005\/2006 (17 matches)"},{"id":5,"name":"Winter 20' +
            '05 (13 matches)"},{"id":4,"name":"Autumn 2005 (17 matches)"},{"id":3,"name":"Spr\/S' +
            'um 2004\/2005 (23 matches)"},{"id":1,"name":"Aut\/Win 2004 (8 matches)"}]],["supply' +
            '_match_date_range",{"start":{"year":2004,"month":4,"day":22},"finish":{"year":2008,' +
            '"month":12,"day":17}}],["supply_season_date_ranges",{"1":{"start":{"year":2004,"mon' +
            'th":4,"day":22},"finish":{"year":2004,"month":8,"day":30}},"3":{"start":{"year":200' +
            '4,"month":8,"day":31},"finish":{"year":2005,"month":2,"day":6}},"4":{"start":{"year' +
            '":2005,"month":2,"day":7},"finish":{"year":2005,"month":6,"day":15}},"5":{"start":{' +
            '"year":2005,"month":6,"day":16},"finish":{"year":2005,"month":10,"day":19}},"6":{"s' +
            'tart":{"year":2005,"month":10,"day":20},"finish":{"year":2006,"month":3,"day":30}},' +
            '"7":{"start":{"year":2006,"month":3,"day":31},"finish":{"year":2006,"month":7,"day"' +
            ':19}},"8":{"start":{"year":2006,"month":7,"day":20},"finish":{"year":2007,"month":2' +
            ',"day":7}},"9":{"start":{"year":2007,"month":2,"day":8},"finish":{"year":2007,"mont' +
            'h":7,"day":25}},"10":{"start":{"year":2007,"month":7,"day":26},"finish":{"year":200' +
            '7,"month":11,"day":27}},"11":{"start":{"year":2007,"month":11,"day":28},"finish":{"' +
            'year":2008,"month":8,"day":8}},"12":{"start":{"year":2008,"month":8,"day":9},"finis' +
            'h":null}}]]'
         );
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function init()
   {
      var f = 'BracketedTextFormatter.init()';
      UTILS.checkArgs(f, arguments, []);

      domElements.divs.main.appendChild(domElements.pres.output);
      domElements.divs.main.appendChild(domElements.pres.error );

      var buttons    = inputs.buttons;
      var checkboxes = inputs.checkboxes;
      var textboxes  = inputs.textboxes;

      $(buttons.clear            ).click(onClickClear               );
      $(buttons.toggleFormat     ).click(onClickToggleFormat        );
      $(buttons.insertExampleText).click(onClickInsertExampleText   );
      $(textboxes.maxCharsPerLine).blur(onBlurMaxCharsPerLineTextbox);

      $(checkboxes.ignoreMaxCharsPerLineForUnbreakableStrings).click
      (
         onClickIgnoreMaxCharsPerLineCheckbox
      );
      $(checkboxes.removeAllNewLineCharactersFromStrings).click
      (
         onClickRemoveAllNewLineCharactersFromStrings
      );

      bracketedTextFormatter.setSettings(defaultBracketedTextFormatterSettings);

      inputs.textboxes.maxCharsPerLine.value =defaultBracketedTextFormatterSettings.maxCharsPerLine;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var buttonStyle = 'font-size: medium; text-align: center; width: 15em; height: 3em;';
   var preStyle    = 'width: 100%; display: none; margin: 0; padding: 0; text-align: left;';

   var inputs =
   {
      buttons:
      {
         toggleFormat     : INPUT({type: 'button', value: 'Format Text', style: buttonStyle  }),
         clear            : INPUT({type: 'button', value: 'Clear'      , style: buttonStyle  }),
         insertExampleText: INPUT({type: 'button', value: '+'          , style: 'width: 32px'})
      },
      textareas:
      {
         input: TEXTAREA({rows: 32, cols: 100, style: 'width: 100%; display: block;'})
      },
      textboxes:
      {
         maxCharsPerLine: INPUT({type: 'textbox', value: '', size: 3, style: 'width: 30px'})
      },
      checkboxes:
      {
         ignoreMaxCharsPerLineForUnbreakableStrings: INPUT({type: 'checkbox', checked: 'checked'}),
         removeAllNewLineCharactersFromStrings     : INPUT({type: 'checkbox', checked: 'checked'})
      }
   };

   var domElements =
   {
      divs:
      {
         main: DIV
         (
            TABLE
            (
               {style: 'margin-left: auto; margin-right: auto;'},
               TBODY
               (
                  TR
                  (
                     TD
                     (
                        {style: 'font-size: x-small; text-align: right;'},
                        'Insert example text '                           ,
                        inputs.buttons.insertExampleText                 , BR(),
                        'Width limit (max characters per line) '         ,
                        inputs.textboxes.maxCharsPerLine
                     ),
                     TD(inputs.buttons.toggleFormat),
                     TD(inputs.buttons.clear       ),
                     TD
                     (
                        {style: 'font-size: x-small; text-align: left;'}            ,
                        inputs.checkboxes.ignoreMaxCharsPerLineForUnbreakableStrings,
                        'Ignore width limit for unbreakable strings'                , BR(),
                        inputs.checkboxes.removeAllNewLineCharactersFromStrings     ,
                        'Remove all newLine characters from strings'
                     )
                  )
               )
            ),
            inputs.textareas.input
         )
      },
      pres:
      {
         output: PRE({style: preStyle + 'background-color: #ffff00;'}),
         error : PRE({style: preStyle + 'background-color: #ff0000;'})
      }
   };

   var defaultBracketedTextFormatterSettings =
   {
      maxCharsPerLine                           : 100  ,
      indentIncrement                           : '   ',
      ignoreMaxCharsPerLineForUnbreakableStrings: true ,
      removeAllNewLineCharactersFromStrings     : true
   };

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
