/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "inheritance.js"
*
* Project: Utilities.
*
* Purpose: Functions for implementing inheritance.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

/*
 * An example of the use of the inherits() function:
 *
 * Cat.inherits(Mammal);
 * function Cat(name)
 * {
 *    Mammal.apply(this, [name]);
 * }
 *
 * ColoredCat.inherits(Cat);
 * function ColoredCat(name, color)
 * {
 *    Cat.apply(this, [name]);
 * }
 *
 * Lion.inherits(ColoredCat);
 * function Lion(name)
 * {
 *    ColoredCat.apply(this, [name, "gold"]);
 * }
 *
 * NOTE: Each object to be inherited from must be able to accept no arguments.
 *       The implications of the object being created with undefined arguments should be understood.
 */
Function.prototype.inherits = function (Parent)
{
   var f = 'Object.prototype.inherits()';
   UTILS.checkArgs(f, arguments, ['function']);

   this.prototype = new Parent();
   this.prototype.constructor = this;
}

/*
 * This function is useful for checking the type of arguments of inheritable functions.
 */
UTILS.assertUndefinedOrTypeAndCondition = function (functionName, assertNo, v, type, condition)
{
   var f = 'UTILS.assertUndefinedOrTypeAndCondition()';
   var argsAreCorrect =
   (
      arguments.length         == 5        &&
      functionName.constructor == String   &&
      assertNo.constructor     == Number   &&
      type.constructor         == Function &&
      condition.constructor    == Boolean
   );

   if (!argsAreCorrect)
   {
      console.error
      (
         'Error detected.' +
         '\n  Function: UTILS.assertUndefinedOrTypeAndCondition()' +
         '\n  Type    : Incorrect arguments.' +
         '\n  Details : Expected [String, Number, <Anything>, Function, Boolean].' +
         '\n            Received ', arguments, '.'
      );
   }

   if (!(typeof v == 'undefined' || (v.constructor == type && condition)))
   {
      throw new Exception
      (
         f, 'Assertion failed.',
         'Assertion ' + assertNo + ' failed in function "' + functionName + '".'
      )
   }
}

/*******************************************END*OF*FILE********************************************/
