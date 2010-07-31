/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "SelectorCalendar2.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the SelectorColor2 object.
*
* TODO: The large HTML table used at present is too slow to generate.
*       A better idea is to use a pre-generated image, then determine which pixel was clicked using
*       the coordinates supplied with the MouseEvent and knowledge of the layout of the image.
*
* Author: Tom McDonnell 2008-04-06.
*
\**************************************************************************************************/

function SelectorColor2(tableWidth, n_cols)
{
   var f = 'SelectorColor()';
   UTILS.checkArgs(f, arguments, [Number, Number]);
   UTILS.assert(f, 0, tableWidth > 0 && tableWidth % 1 == 0);
   UTILS.assert(f, 1, n_cols     > 0 && n_cols     % 1 == 0);
   UTILS.assert(f, 2, tableWidth % n_cols == 0);
   UTILS.assert(f, 3, n_cols     % 3      == 0);

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getDiv = function () {return div;      };
   this.getR   = function () {return selectedR;};
   this.getG   = function () {return selectedG;};
   this.getB   = function () {return selectedB;};

   this.getCssStr = function ()
   {
      return convertColorComponentsToCssStr(selectedR, selectedG, selectedB, selectedIntensity);
   };

   // Setters. --------------------------------------------------------------------------------//

   this.setR = function (r) {UTILS.assert('SelectorColor.setR()', 0, 0<=r && r<=1); selectedR = r;};
   this.setG = function (g) {UTILS.assert('SelectorColor.setG()', 0, 0<=g && g<=1); selectedG = g;};
   this.setB = function (b) {UTILS.assert('SelectorColor.setB()', 0, 0<=b && b<=1); selectedB = b;};

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onClickTd(e)
   {
      try
      {
         var f = 'SelectorColor.onClickColorGrid()';
         UTILS.checkArgs(f, arguments, [MouseEvent]);

         var x = UTILS.DOM.countPreviousSiblings(e.target);
         var y = n_rows - UTILS.DOM.countPreviousSiblings(e.target.parentNode);

         setSelectedColorComponents(x, y);

         var colorStr = convertColorComponentsToCssStr
         (
            selectedR, selectedG, selectedB
         );

         updateSelectedColorStr(colorStr);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onBlurSelectedColorTextBox(e)
   {
      try
      {
         var f = 'SelectorColor.onBlurSelectedColorTextBox()';
         UTILS.checkArgs(f, arguments, [Event]);

         colorStr = tdSelectedColorTextBox.value;

         // TODO: Check validity of colorStr using regular expression.

         // Extract color components from colorStr.
         var colorComponents = convertCssStrToColorComponents(colorStr);

         // Set selected color components.
         selectedR = colorComponents.r;
         selectedG = colorComponents.g;
         selectedB = colorComponents.b;

         updateSelectedColorStr(colorStr);
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
   function updateSelectedColorStr(colorStr)
   {
      var f = 'SelectorColor.updateSelectedColorStr()';
      UTILS.checkArgs(f, arguments, [String]);

      var compColStrR = getComplementaryColorStr(colorStr, 'r');
      var compColStrG = getComplementaryColorStr(colorStr, 'g');
      var compColStrB = getComplementaryColorStr(colorStr, 'b');

      tdSelectedColor.style.background = colorStr;

      tdCompColR.style.background = compColStrR;
      tdCompColG.style.background = compColStrG;
      tdCompColB.style.background = compColStrB;

      tdSelectedColorTextBox.value = colorStr;

      tdCompColR.innerHTML = compColStrR;
      tdCompColG.innerHTML = compColStrG;
      tdCompColB.innerHTML = compColStrB;
   }

   /*
    *
    */
   function convertColorComponentsToCssStr(r, g, b)
   {
      // var f = 'SelectorColor.convertColorComponentsToCssStr()';
      // UTILS.checkArgs(f, arguments, [Number, Number, Number]);
      // UTILS.assert(f, 0, 0 <= r && r <= 1);
      // UTILS.assert(f, 1, 0 <= g && g <= 1);
      // UTILS.assert(f, 2, 0 <= b && b <= 1);

      // Scale from range [0, 1] to range [0, 255].
      var r256 = r * 255;
      var g256 = g * 255;
      var b256 = b * 255;

      var cssStr =
      (
         '#' +
         convertNumberToHexChar(r256 / 16) + convertNumberToHexChar(r256 % 16) +
         convertNumberToHexChar(g256 / 16) + convertNumberToHexChar(g256 % 16) +
         convertNumberToHexChar(b256 / 16) + convertNumberToHexChar(b256 % 16)
      );

      return cssStr;
   };

   /*
    *
    */
   function convertCssStrToColorComponents(colorStr)
   {
      var f = 'SelectorColor.convertCssStrToColorComponents()';
      UTILS.checkArgs(f, arguments, [String]);

      var s = colorStr; // Abbreviation.

      var r = (convertHexCharToNumber(s.charAt(1))* 16 + convertHexCharToNumber(s.charAt(2))) / 255;
      var g = (convertHexCharToNumber(s.charAt(3))* 16 + convertHexCharToNumber(s.charAt(4))) / 255;
      var b = (convertHexCharToNumber(s.charAt(5))* 16 + convertHexCharToNumber(s.charAt(6))) / 255;

      return {r: r, g: g, b: b};
   };

   /*
    * Convert a decimal number [0, 15] to a single hexadecimal character.
    */
   function convertNumberToHexChar(d)
   {
      // var f = 'SelectorColor.convertToHexChar()';
      // UTILS.checkArgs(f, arguments, [Number]);

      d = Math.floor(d);

      if (0 <= d && d <= 9)
      {
         return String(d);
      }

      switch (d)
      {
       case 10: return 'a';
       case 11: return 'b';
       case 12: return 'c';
       case 13: return 'd';
       case 14: return 'e';
       case 15: return 'f';
       default: throw new Exception(f, 'Supplied number ' + d + ' out of range [0, 15].', '');
      }
   }

   /*
    * Convert an hexadecimal character to a number.
    */
   function convertHexCharToNumber(c)
   {
      var f = 'SelectorColor.convertToHexChar()';
      UTILS.checkArgs(f, arguments, [String]);

      switch (c)
      {
       case '0': return  0;
       case '1': return  1;
       case '2': return  2;
       case '3': return  3;
       case '4': return  4;
       case '5': return  5;
       case '6': return  6;
       case '7': return  7;
       case '8': return  8;
       case '9': return  9;
       case 'a': return 10;
       case 'b': return 11;
       case 'c': return 12;
       case 'd': return 13;
       case 'e': return 14;
       case 'f': return 15;
       default:
         throw new Exception
         (
            f, "Expected lower-case hexadecimal digit.  Received '" + d + "'.", ''
         );
      }
   }

   /*
    *
    */
   function setSelectedColorComponents(x, y)
   {
      // var f = 'SelectorColor.setSelectedColorComponents()';
      // UTILS.checkArgs(f, arguments, [Number, Number]);
      // UTILS.assert(f, 0, squareIsInsideTriangle(x, y));

      with (Math)
      {
         // Build color string with r, g, and b values determined by the
         // square's position relative to the centres of the three spotlights.
         var distToR = sqrt(pow(x - rCoords.x, 2) + pow(y - rCoords.y, 2));
         var distToG = sqrt(pow(x - gCoords.x, 2) + pow(y - gCoords.y, 2));
         var distToB = sqrt(pow(x - bCoords.x, 2) + pow(y - bCoords.y, 2));
//console.debug(f, 'dist r, g, b: ', distToR, distToG, distToB);
//console.debug(f, 'radius: ', radius);
         selectedR = (0 <= distToR && distToR <= radius)? -distToR / radius + 1: 0;
         selectedG = (0 <= distToG && distToG <= radius)? -distToG / radius + 1: 0;
         selectedB = (0 <= distToB && distToB <= radius)? -distToB / radius + 1: 0;

//console.debug(f, 'r, g, b: ', selectedR, selectedG, selectedB);
      }
   }

   /*
    *
    */
   function setSelectedIntensity(x, y)
   {
      // var f = 'SelectorColor.setSelectedIntensity()';
      // UTILS.checkArgs(f, arguments, [Number, Number]);
      // UTILS.assert(f, 0, !squareIsInsideTriangle(x, y));

      selectedIntensity = y / n_rows;
   }

   /*
    *
    */
   function getComplementaryColorStr(colorStr, rORgORb)
   {
      // var f = 'SelectorColor.getComplementaryColorStr()';
      // UTILS.checkArgs(f, arguments, [String, String]);

      var rStr = colorStr.substr(1, 2);
      var gStr = colorStr.substr(3, 2);
      var bStr = colorStr.substr(5, 2);

      switch (rORgORb)
      {
       case 'r': return '#' + rStr + bStr + gStr;
       case 'g': return '#' + bStr + gStr + rStr;
       case 'b': return '#' + gStr + rStr + bStr;
       default: throw new Exception(f, "Expected 'r' or 'g' or 'b'.  Received '" + rORgORb + "'.");
      }
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function init()
   {
      var f = 'SelectorColor.init()';
      UTILS.checkArgs(f, arguments, []);

      for (var y = n_rows; y > 0; --y)
      {
         var tr = TR();

         for (var x = 0; x < n_cols; ++x)
         {
            setSelectedColorComponents(x, y);

            var td = TD
            (
               {
                  style:
                  (
                     'height: ' + squareHeight + 'px; width: ' + squareWidth + 'px; background: ' +
                     convertColorComponentsToCssStr(selectedR, selectedG, selectedB) + ';'
                  )
               }
            );

            td.addEventListener('click', onClickTd, false);

            tr.appendChild(td);
         }

         tbody.appendChild(tr);
      }

      tdSelectedColorTextBox.addEventListener('blur', onBlurSelectedColorTextBox, false);

      var height = Math.floor(tableWidth * (1 - root3 / 2) * (4 / 3));

      tdSelectedColor = TD
      (
         {colspan: n_cols, style: 'height: ' + height + 'px; text-align: center'},
         tdSelectedColorTextBox
      );

      var attribs =
      {
         colspan: n_cols / 3,
         style: 'height: ' + height + 'px; width: ' + tableWidth / 3 + 'px; text-align: center;'
      };

      tdCompColR = TD(attribs);
      tdCompColG = TD(attribs);
      tdCompColB = TD(attribs);

      tbody.appendChild(TR(tdSelectedColor));
      tbody.appendChild(TR(tdCompColR, tdCompColG, tdCompColB));
   }

   // Private constants. ////////////////////////////////////////////////////////////////////////

   const root3 = Math.sqrt(3);
   const piOn6 = Math.PI / 6;

   const radius = n_cols / 3;

   const rCoords = {x: 3 * radius / 2, y: radius * root3 / 2};
   const gCoords = {x:     radius    , y: radius * root3    };
   const bCoords = {x: 2 * radius    , y: radius * root3    };

   const squareWidth  = tableWidth / n_cols;
   const squareHeight = (4 / 3) * squareWidth;

   const n_rows = Math.ceil(n_cols * root3 / 2);

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var selectedR = 0;
   var selectedG = 0;
   var selectedB = 0;

   var selectedIntensity = 0;

   // DOM elements. ---------------------------------------------------------------------------//

   var tdSelectedColor        = null;
   var tdSelectedColorTextBox = INPUT({type: 'text', style: 'text-align: center;'});

   var tdCompColR = null;
   var tdCompColG = null;
   var tdCompColB = null;

   var tbody = TBODY();
   var div = DIV(TABLE({style: 'border-collapse: collapse;'}, tbody));

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
