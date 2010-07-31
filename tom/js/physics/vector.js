/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "vector.js"
*
* Project: Library.
*
* Purpose: Mathematical vector objects and functions.
*          NOTE: For a more complete vector library, see C++ file "home/tom/TomsLibrary/vector.h".
*
* Author: Tom McDonnell 08/11/2007
*
\**************************************************************************************************/

// Global variables. ///////////////////////////////////////////////////////////////////////////////

const pi = 3.14159273;

// Objects. ////////////////////////////////////////////////////////////////////////////////////////

// 2d vector objects. ----------------------------------------------------------------------------//

/**
 * Two dimensional rectangular vector.
 */
function VectorRec2d(x, y)
{
   var f = 'VectorRec2d()';
   UTILS.checkArgs(f, arguments, [Number, Number]);

   // Getters. --------------------------------------------------------------------------------//

   this.getX         = function () {return x;};
   this.getY         = function () {return y;};
   this.getMagnitude = function () {return Math.sqrt(x * x + y * y);};
   this.getAngle     = function () {return Math.atan2(y, x);        };

   // Setters. --------------------------------------------------------------------------------//

   this.setX = function (x1)
   {
      var f = 'VectorRec2d.setX()';
      UTILS.checkArgs(f, arguments, [Number]);

      x = x1;
   };

   this.setY = function (y1)
   {
      var f = 'VectorRec2d.setY()';
      UTILS.checkArgs(f, arguments, [Number]);

      y = y1;
   };

   // Operations. -----------------------------------------------------------------------------//

   this.add = function (a)
   {
      var f = 'VectorRec2d.add()';
      UTILS.checkArgs(f, arguments, [VectorRec2d]);

      return new VectorRec2d(x + a.getX(), y + a.getY());
   };

   this.subtract = function (a)
   {
      var f = 'VectorRec2d.subtract()';
      UTILS.checkArgs(f, arguments, [VectorRec2d]);

      return new VectorRec2d(x - a.getX(), y - a.getY());
   };

   this.multiply = function (a)
   {
      var f = 'VectorRec2d.multiply()';
      UTILS.checkArgs(f, arguments, [Number]);

      return new VectorRec2d(x * a, y * a);
   };

   this.divide = function (a)
   {
      var f = 'VectorRec2d.divide()';
      UTILS.checkArgs(f, arguments, [Number]);

      return new VectorRec2d(x / a, y / a);
   };

   this.convToPol = function () {return new VectorPol2d(this.getMagnitude(), this.getAngle());};

   this.clone = function () {return new VectorRec2d(x, y);};

   this.asString = function ()
   {
      return string = 'VectorRec2d(x: ' + x + '; y: ' + y + ')';
   };
}

/**
 * Two dimensional polar vector.
 */
function VectorPol2d(r, angle)
{
   var f = 'VectorPol2d()';
   UTILS.checkArgs(f, arguments, [Number, Number]);
   UTILS.assert(f, 0, 0 <= r);
   UTILS.assert(f, 1, -pi <= angle && angle <= pi);

   // Getters. --------------------------------------------------------------------------------//

   this.getR     = function () {return     r;}
   this.getAngle = function () {return angle;}

   this.getComponentY = function () {return r * Math.sin(angle);};
   this.getComponentX = function () {return r * Math.cos(angle);};

   // Setters. --------------------------------------------------------------------------------//

   this.setR = function (r1)
   {
      var f = 'VectorPol2d()';
      UTILS.checkArgs(f, arguments, [Number]);
      UTILS.assert(f, 0, r1 >= 0);

      r = r1;
   };

   this.setAngle = function (a)
   {
      var f = 'VectorPol2d()';
      UTILS.checkArgs(f, arguments, [Number]);
      UTILS.assert(f, 0, -pi <= a && a <= pi);

      angle = a;
   }

   // Operations. -----------------------------------------------------------------------------//

   this.multiply = function (a)
   {
      var f = 'VectorPol2d.multiply()';
      UTILS.checkArgs(f, arguments, [Number]);

      return new VectorPol2d(r * Math.abs(a), ((a < 0)? (angle + ((angle < 0)? pi: -pi)): angle));
   };

   this.rotate = function (a) {angle += a; if (a > pi) angle -= twoPi;}

   this.convToRec = function ()
   {
      return new VectorRec2d(this.getComponentX(), this.getComponentY());
   };

   this.clone = function () {return new VectorPol2d(r, angle);};

   this.asString = function ()
   {
      return string = 'VectorPol2d(r: ' + r + '; angle: ' + angle + ')';
   }
};

// 3d vector objects. ----------------------------------------------------------------------------//

/**
 * Three dimensional rectangular vector.
 */
function VectorRec3d(x, y, z)
{
   var f = 'VectorRec2d()';
   UTILS.checkArgs(f, arguments, [Number, Number, Number]);

   this.getX = function () {return x;};
   this.getY = function () {return y;};
   this.getZ = function () {return z;};
   this.setX = function (x1) {x = x1;};
   this.setY = function (y1) {y = y1;};
   this.setZ = function (z1) {z = z1;};

   this.asString = function ()
   {
      return string = 'VectorRec3d(x: ' + x + '; y: ' + y + '; z: ' + z + ')';
   }
}

/**
 * Three dimensional rectangular vector.
 */
function VectorPol3d(r, aXZ, aY)
{
   var f = 'VectorPol2d()';
   UTILS.checkArgs(f, arguments, [Number, Number, Number]);
   UTILS.assert(f, 0, 0 <= r);
   UTILS.assert(f, 1, -pi <= aXZ && aXZ <= pi);
   UTILS.assert(f, 2, -pi <= aY  && aY  <= pi);

   this.getR   = function () {return r  ;};
   this.getAXZ = function () {return aXZ;};
   this.getAY  = function () {return aY ;};

   this.setR = function (r1)
   {
      var f = 'VectorPol3d.setR()';
      UTILS.checkArgs(f, arguments, [Number]);
      UTILS.assert(f, 0, r1 >= 0);

      r = r1;
   };

   this.setAXZ = function (aXZ1)
   {
      var f = 'VectorPol3d.setAXZ()';
      UTILS.checkArgs(f, arguments, [Number]);
      UTILS.assert(f, 0, -pi <= aXZ1 && aXZ1 <= pi);

      aXZ = aXZ1;
   };

   this.setAY = function (aY1)
   {
      var f = 'VectorPol3d.setAY()';
      UTILS.checkArgs(f, arguments, [Number]);
      UTILS.assert(f, 0, -pi <= aY1 && aY1 <= pi);

      aY = aY1;
   };

   this.asString = function ()
   {
      return string = 'VectorPol3d(r: ' + r + '; aXZ: ' + aXZ + '; aY: ' + aY + ')';
   }
}

/*******************************************END*OF*FILE********************************************/
