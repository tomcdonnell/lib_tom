/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "TablePosition.js"
*
* Project: Library.
*
* Purpose: Definition of the TablePosition object.
*
* Author: Tom McDonnell 11/2007
*
\**************************************************************************************************/

function TablePosition(r, c)
{
   var f = 'TablePosition()';
   UTILS.checkArgs(f, arguments, [Number, Number]);
   UTILS.assert(f, 0, r >= 0 && c >= 0);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   this.getRow = function () {return row;};
   this.getCol = function () {return col;};

   this.setRow = function (r)
   {
      var f = 'Particle.setRow()';
      UTILS.checkArgs(f, arguments, [Number]);

      if (r >= 0)
      {
         row = m;
      }
      else
      {
         throw new Exception
         (
            'TablePosition.setRow()', 'Attempted to set row to a negative value.', ''
         );
      }
   };

   this.setCol = function (c)
   {
      var f = 'TablePosition.setCol()';
      UTILS.checkArgs(f, arguments, [Number]);

      if (c >= 0)
      {
         radius = c;
      }
      else
      {
         throw new Exception
         (
            'Particle.setCol()', 'Attempted to set col to a negative value.', ''
         );
      }
   };

   this.asString = function ()
   {
      return string = 'TablePosition(row: ' + row + '; col: ' + col + ')';
   };

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var row = r;
   var col = c;
}

/*****************************************END*OF*FILE**********************************************/
