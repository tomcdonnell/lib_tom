/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "particle.js"
*
* Project: Library.
*
* Purpose: Definition of the Particle object.
*
* Author: Tom McDonnell 11/2007
*
\**************************************************************************************************/

/*
 * @param p {VectorRec2d} Position.
 * @param v {VectorRec2d} Velocity.
 * @param m {Number     } Mass.
 * @param r {Number     } Radius.
 */
function Particle(p, v, m, r)
{
   // Since Particle is designed to be inheritable,
   // it must accept zero arguments (see "inheritance.js").
   var f = 'Particle()';

   // Public functions. /////////////////////////////////////////////////////////////////////////

   this.getMass   = function () {return mass;  };
   this.getRadius = function () {return radius;};

   this.setMass = function (m)
   {
      var f = 'Particle.setMass()';
      UTILS.checkArgs(f, arguments, ['number']);

      if (m >= 0)
      {
         mass = m;
      }
      else
      {
         throw new Exception
         (
            'Particle.setMass()', 'Attempted to set mass to a negative value.', ''
         );
      }
   };

   this.setRadius = function (r)
   {
      var f = 'Particle.setRadius()';
      UTILS.checkArgs(f, arguments, ['number']);

      if (r >= 0)
      {
         radius = r;
      }
      else
      {
         throw new Exception
         (
            'Particle.setRadius()', 'Attempted to set radius to a negative value.', ''
         );
      }
   };

   this.asString = function ()
   {
      return string =
      (
         'Particle\n' +
         '(\n' +
         '   pos: ' + this.pos.asString() + ';\n' +
         '   vel: ' + this.vel.asString() + ';\n' +
         '   mass: ' + mass + ';\n' +
         '   radius: ' + radius + ';\n' +
         ')'
      );
   };

   // Public variables. /////////////////////////////////////////////////////////////////////////

   this.pos = p;
   this.vel = v;

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var mass   = m;
   var radius = r;

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   switch (arguments.length)
   {
    case 0:
      p = new VectorRec2d(0, 0);
      v = new VectorRec2d(0, 0);
      m = 1;
      r = 0;
      break;
    case 4:
      UTILS.checkArgs(f, arguments, ['VectorRec2d', 'VectorRec2d', 'number', 'number']);
      this.p = p;
      this.v = v;
      this.setMass(m);
      this.setRadius(r);
      break;
    default:
      throw new Exception
      (
         f, 'Incorrect arguments.',
         'Expected 0 or 4 arguments.  Received ' + arguments.length + '.'
      );
   }
}

/*******************************************END*OF*FILE********************************************/
