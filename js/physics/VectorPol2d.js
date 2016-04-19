/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "VectorPol2d.js"
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
 * Two dimensional polar vector.
 */
function VectorPol2d(r, angle)
{
   var f = 'VectorPol2d()';
   UTILS.checkArgs(f, arguments, ['number', 'number']);
   UTILS.assert(f, 0, 0 <= r);
   UTILS.assert(f, 1, -Math.PI <= angle && angle <= Math.PI);

   // Getters. --------------------------------------------------------------------------------//

   this.getR     = function () {return     r;};
   this.getAngle = function () {return angle;};

   this.getComponentY = function () {return r * Math.sin(angle);};
   this.getComponentX = function () {return r * Math.cos(angle);};

   // Setters. --------------------------------------------------------------------------------//

   this.setR = function (r1)
   {
      var f = 'VectorPol2d()';
      UTILS.checkArgs(f, arguments, ['number']);
      UTILS.assert(f, 0, r1 >= 0);

      r = r1;
   };

   this.setAngle = function (a)
   {
      var f = 'VectorPol2d()';
      UTILS.checkArgs(f, arguments, ['number']);
      UTILS.assert(f, 0, -Math.PI <= a && a <= Math.PI);

      angle = a;
   };

   // Operations. -----------------------------------------------------------------------------//

   this.multiply = function (a)
   {
      var f = 'VectorPol2d.multiply()';
      UTILS.checkArgs(f, arguments, ['number']);

      return new VectorPol2d
      (
         r * Math.abs(a), ((a < 0)? (angle + ((angle < 0)? Math.PI: -Math.PI)): angle)
      );
   };

   this.rotate = function (a) {angle += a; if (a > Math.PI) angle -= twoPi;};

   this.convToRec = function ()
   {
      return new VectorRec2d(this.getComponentX(), this.getComponentY());
   };

   this.clone = function () {return new VectorPol2d(r, angle);};

   this.asString = function ()
   {
      return string = 'VectorPol2d(r: ' + r + '; angle: ' + angle + ')';
   };
};

/*******************************************END*OF*FILE********************************************/
