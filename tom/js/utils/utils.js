/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "utils.js"
*
* Project: Utilities.
*
* Purpose: Useful general functions and objects.
*
* @author: Tom McDonnell 2007.
*
\**************************************************************************************************/

// Global variables. ///////////////////////////////////////////////////////////////////////////////

/**
 * Namespace for general utility objects and functions.
 */
var UTILS = {};

// Global objects. -------------------------------------------------------------------------------//

/**
 * Exception object definition.
 *
 * If this object was defined in the style of: "UTILS.Exception = function (...) {...}", its type
 * would be "function()", and it would be indistinguishable from any other anonymous function.
 * That is why it is defined outside the 'UTILS' namespace.
 *
 * @param f       {String} The name of the function throwing the exception.
 * @param type    {String} A short description of what went wrong.
 * @param details {String} A longer description of what went wrong.
 */
function Exception(f, type, details)
{
   // NOTE
   // ----
   // Function UTILS.checkArgs() is not used here to avoid recursion.
   // Better to keep things simple for exception functions.

   if
   (
      arguments.length    == 3      &&
      f.constructor       == String &&
      type.constructor    == String &&
      details.constructor == String
   )
   {
      this.f       = f;
      this.type    = type;
      this.details = details;
   }
   else
   {
      console.error
      (
         'Error detected.' +
         '\n  Function: Exception()' +
         '\n  Type    : Incorrect arguments.' +
         '\n  Details : Expected [String, String, String].' +
         '\n            Received ', arguments, '.'
      );
   }
};

// Namespace 'UTILS' functions. ------------------------------------------------------------------//

/**
 * Print an error message to the Firebug console.
 *
 * @params e {UTILS.Exception}
 */
UTILS.printExceptionToConsole = function (f, e)
{
   // NOTE
   // ----
   // Must not call functions that throw exceptions from here.
   // Reason: This function is intended to be called from within a catch block.

   // If the arguments supplied to this function are correct...
   if (arguments.length == 2 && f.constructor == String && typeof e != 'undefined')
   {
      // Print the information given in the supplied exception.
      if (e.constructor == Exception)
      {
         console.error
         (
            'Exception caught in function ' + f + '.' +
            '\n  Function: ' + e.f +
            '\n  Type    : ' + e.type +
            '\n  Details : ' + e.details
         );
         console.trace();
      }
      else
      {
         console.error('Exception of unknown type caught in function ' + f + '.');
         console.error(e);
         console.trace();
      }
   }
   else
   {
      console.error
      (
         'Error detected.' +
         '\n  Function: UTILS.printExceptionToConsole()' +
         '\n  Type    : Incorrect arguments.' +
         "\n  Details : Expected [String, 'Defined']." +
         '\n            Received ', arguments, '.'
      );
      console.trace();
   }
};

/**
 * Check the arguments supplied to a function.
 * Throw an exception if an incorrect number of arguments were
 * supplied, or if the arguments supplied are not of the expected type.
 *
 * @param f     {String} The name of the calling function.
 * @param args  {Object} Array of arguments supplied to the function.
 * @param types {Array}  Array of expected types for the arguments.
 */
UTILS.checkArgs = function (f, args, types)
{
   if
   (
      arguments.length  == 3      &&
      f.constructor     == String &&
      args.constructor  == Object && // NOTE: Special variable 'arguments' is Object, not Array.
      types.constructor == Array
   )
   {
      // Check that the number of arguments supplied to 'f' is correct.
      if (args.length != types.length)
      {
         throw new Exception
         (
            f, 'Incorrect number of arguments.',
            'Expected ' + types.length + '.\n            Received ' + args.length + '.'
         );
      }

      // Check that the types of arguments supplied to 'f' are correct.
      var type, arg;
      for (var i = 0; i < args.length; ++i)
      {
         type = types[i];
         arg  = args[i];

         if (type == 'Defined' && typeof arg != 'undefined')
         {
            continue;
         }

         // If UTILS.validator is included in the project,
         // use the extra type checking capabilities of UTILS.validator.
         if (typeof UTILS.validator == 'object' && type.constructor == String)
         {
            UTILS.validator.checkType(arg, type);
            continue;
         }

         if (typeof arg == 'undefined' || arg === null || arg.constructor != type)
         {
            throw new Exception
            (
               f, 'Incorrect type for argument[' + i + '].',
               'Expected "' + type + '".\n            Received "' +
               ((typeof arg == 'undefined' || arg === null)? arg: arg.constructor) + '".'
            );
         }
      }
   }
   else
   {
      throw new Exception
      (
         'UTILS.checkArgs()', 'Incorrect arguments.', 'Expected [String, Object, Array].'
      );
   }
};

/*
 * Confirm that the expression given is true.
 *
 * @param functionName {String}  The name of the calling function.
 * @param assertNo     {Number}  The number of the assert (should be unique for the function).
 * @param expression   {Boolean} An expression expected to evaluate as 'true'.
 */
UTILS.assert = function (functionName, assertNo, expression)
{
   var f = 'UTILS.assert()';
   UTILS.checkArgs(f, arguments, [String, Number, Boolean]);

   if (!expression)
   {
      throw new Exception
      (
         f, 'Assertion failed.',
         'Assertion ' + assertNo + ' failed in function "' + functionName + '".'
      );
   }
};

/*
 * Confirm that the variable given is equal to one of the elements in the options array.
 *
 * @param functionName {String}  The name of the calling function.
 * @param assertNo     {Number}  The number of the assert (should be unique for the function).
 * @param variable               The variable to be tested.
 * @param options      {Array}   Array containing all expected values of variable.
 */
UTILS.assertEqualsOneOf = function (functionName, assertNo, variable, options)
{
   var f = 'UTILS.assertEqualsOneOf()';
   UTILS.checkArgs(f, arguments, [String, Number, 'Defined', Array]);

   // Search options until a match is found.
   // When a match is found, return.
   for (var i = 0; i < options.length; ++i)
   {
      if (variable == options[i]) return;
   }

   // No match was found.
   throw new Exception
   (
      f, 'Assertion failed.',
      'Assertion ' + assertNo + ' failed in function "' + functionName + '".'
   );
};

/*******************************************END*OF*FILE********************************************/
