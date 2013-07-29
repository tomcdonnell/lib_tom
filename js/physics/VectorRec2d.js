/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "VectorRec2d.js"
*
* Project: Library.
*
* Purpose: Mathematical vector objects and functions.
*          NOTE: For a more complete vector library, see C++ file "home/tom/TomsLibrary/vector.h".
*
* Author: Tom McDonnell 08/11/2007
*
\**************************************************************************************************/

// Object definition. //////////////////////////////////////////////////////////////////////////////

/**
 * Two dimensional rectangular vector.
 */
function VectorRec2d(x, y)
{
   var f = 'VectorRec2d()';
   UTILS.checkArgs(f, arguments, ['number', 'number']);

   // Getters. --------------------------------------------------------------------------------//

   this.getX         = function () {return x;};
   this.getY         = function () {return y;};
   this.getMagnitude = function () {return Math.sqrt(x * x + y * y);};
   this.getAngle     = function () {return Math.atan2(y, x);        };

   // Setters. --------------------------------------------------------------------------------//

   this.setX = function (x1)
   {
      var f = 'VectorRec2d.setX()';
      UTILS.checkArgs(f, arguments, ['number']);

      x = x1;
   };

   this.setY = function (y1)
   {
      var f = 'VectorRec2d.setY()';
      UTILS.checkArgs(f, arguments, ['number']);

      y = y1;
   };

   // Operations. -----------------------------------------------------------------------------//

   this.add = function (a)
   {
      var f = 'VectorRec2d.add()';
      UTILS.checkArgs(f, arguments, ['VectorRec2d']);

      return new VectorRec2d(x + a.getX(), y + a.getY());
   };

   this.subtract = function (a)
   {
      var f = 'VectorRec2d.subtract()';
      UTILS.checkArgs(f, arguments, ['VectorRec2d']);

      return new VectorRec2d(x - a.getX(), y - a.getY());
   };

   this.multiply = function (a)
   {
      var f = 'VectorRec2d.multiply()';
      UTILS.checkArgs(f, arguments, ['number']);

      return new VectorRec2d(x * a, y * a);
   };

   this.divide = function (a)
   {
      var f = 'VectorRec2d.divide()';
      UTILS.checkArgs(f, arguments, ['number']);

      return new VectorRec2d(x / a, y / a);
   };

   this.convToPol = function () {return new VectorPol2d(this.getMagnitude(), this.getAngle());};

   this.clone = function () {return new VectorRec2d(x, y);};

   this.asString = function ()
   {
      return string = 'VectorRec2d(x: ' + x + '; y: ' + y + ')';
   };
}

/*******************************************END*OF*FILE********************************************/
