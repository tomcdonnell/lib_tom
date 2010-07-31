/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "SelectorCalendar.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the SelectorColor object.
*
* TODO: The large HTML table used at present is too slow to generate.
*       A better idea is to use a pre-generated image, then determine which pixel was clicked using
*       the coordinates supplied with the MouseEvent and knowledge of the layout of the image.
*
* Author: Tom McDonnell 2008-03-29.
*
\**************************************************************************************************/

function SelectorColor(tableWidth, n_cols)
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

         switch (squareIsInsideTriangle(x, y))
         {
          case true : setSelectedColorComponents(x, y); break;
          case false: setSelectedIntensity(x, y);       break;
         }

         var colorStr = convertColorComponentsToCssStr
         (
            selectedR, selectedG, selectedB, selectedIntensity
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

         // Extract color components and intensity from colorStr.
         var colorComponents = convertCssStrToColorComponents(colorStr);

         // Set selected color components.
         selectedR         = colorComponents.r;
         selectedG         = colorComponents.g;
         selectedB         = colorComponents.b;
         selectedIntensity = colorComponents.i;

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
   function convertColorComponentsToCssStr(r, g, b, i)
   {
      // var f = 'SelectorColor.convertColorComponentsToCssStr()';
      // UTILS.checkArgs(f, arguments, [Number, Number, Number, Number]);
      // UTILS.assert(f, 0, 0 <= r && r <= 1);
      // UTILS.assert(f, 1, 0 <= g && g <= 1);
      // UTILS.assert(f, 2, 0 <= b && b <= 1);
      // UTILS.assert(f, 3, 0 <= i && i <= 1 || i == -1);

      // If i not -1, set scaling factor sf such that max(sf * r, sf * g, sf * b) = i.
      sf = (i == -1)? 1: i / Math.max(r, g, b);

      // Scale from range [0, 1] to range [0, 255].
      var r256 = r * sf * 255;
      var g256 = g * sf * 255;
      var b256 = b * sf * 255;

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

      return {r: r, g: g, b: b, i: Math.max(r, g, b)};
   };

   /*
    *
    */
   function squareIsInsideTriangle(x, y)
   {
      // var f = 'SelectorColor.squareIsInsideTriangle()';
      // UTILS.checkArgs(f, arguments, [Number, Number]);

      return (y < root3 * x && y < -root3 * x + 2 * n_rows);
   }

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
            f, "Expected lower-case hexadecimal digit.  Received '" + c + "'.", ''
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
         // square's position relative to the three vertices of the triangle.
         var distToT = n_rows - y;
         var distToL = sqrt(pow(         x, 2) + pow(y, 2));
         var distToR = sqrt(pow(n_cols - x, 2) + pow(y, 2));
         var angleToL = atan2(y,          x);
         var angleToR = atan2(y, n_cols - x);
         var angleToLcentreLine = abs(angleToL - piOn6);
         var angleToRcentreLine = abs(angleToR - piOn6);

         selectedR = (n_rows - distToT                          ) / n_rows,
         selectedG = (n_rows - distToL * cos(angleToLcentreLine)) / n_rows,
         selectedB = (n_rows - distToR * cos(angleToRcentreLine)) / n_rows

         var iRangeLow  = 0.0; // Possible range: [0, iRangeHigh).
         var iRangeHigh = 1.0; // Possible range: (iRangeLow , 1].

         var iRangeFraction = iRangeHigh - iRangeLow;

         selectedR = selectedR * iRangeFraction + iRangeLow;
         selectedG = selectedG * iRangeFraction + iRangeLow;
         selectedB = selectedB * iRangeFraction + iRangeLow;
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
            switch (squareIsInsideTriangle(x, y))
            {
             case true:
               setSelectedColorComponents(x, y);
               var r = selectedR;
               var g = selectedG;
               var b = selectedB;
               break;
             case false:
               setSelectedIntensity(x, y);
               var r = selectedIntensity;
               var g = selectedIntensity;
               var b = selectedIntensity;
               break;
            }

            var td = TD
            (
               {
                  style:
                  (
                     'height: ' + squareHeight + 'px; width: ' + squareWidth +
                     'px; background: ' + convertColorComponentsToCssStr(r, g, b, -1) + ';'
                  )
               }
            );

            td.addEventListener('click', onClickTd, false);

            tr.appendChild(td);
         }

         tbody.appendChild(tr);
      }

      tdSelectedColorTextBox.addEventListener('blur', onBlurSelectedColorTextBox, false);

      var height = Math.floor(tableWidth * (1 - root3 / 2));

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

      selectedIntensity = -1;
   }

   // Private constants. ////////////////////////////////////////////////////////////////////////

   const root3 = Math.sqrt(3);
   const piOn6 = Math.PI / 6;

   const squareWidth  = tableWidth / n_cols;
   const squareHeight = (4 / 3) * squareWidth;

   const n_rows = Math.ceil(n_cols * (root3 / 2));

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
