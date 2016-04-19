/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "utilsGeometry.js"
*
* Project: Utilities.
*
* Purpose: Utilities pertaining to geometry.
*
* @author: Tom McDonnell 2013-06-28.
*
\**************************************************************************************************/

// Namespace 'UTILS' variables. ////////////////////////////////////////////////////////////////////

/**
 * Namespace for math utilities.
 */
UTILS.geometry = {};

// Namespace 'UTILS.geometry' functions. ///////////////////////////////////////////////////////////

/*
 *
 */
UTILS.geometry.fitBoxInsideBox = function (o)
{
   var f = 'UTILS.geometry.fitBoxInsideBox()';
   UTILS.checkArgs(f, arguments, ['object']);
   UTILS.validator.checkObject
   (
      o,
      {
         outerBoxHeight             : 'positiveInt'  ,
         outerBoxWidth              : 'positiveInt'  ,
         innerBoxMinHeightWidthRatio: 'positiveFloat',
         innerBoxMaxHeightWidthRatio: 'positiveFloat'
      }
   );

   if (o.innerBoxMinHeightWidthRatio > o.innerBoxMaxHeightWidthRatio)
   {
      throw new Exception(f, 'Supplied minimum height:width ratio exceeds supplied maximum.');
   }

   var outerBoxHeightWidthRatio = o.outerBoxHeight / o.outerBoxWidth;
   var tooTall = (outerBoxHeightWidthRatio > o.innerBoxMaxHeightWidthRatio);
   var tooWide = (outerBoxHeightWidthRatio < o.innerBoxMinHeightWidthRatio);

   switch (((tooTall)? '1': '0') + '-' + ((tooWide)? '1': '0'))
   {
    case '0-0': 
      var innerBoxHeight = o.outerBoxHeight;
      var innerBoxWidth  = o.outerBoxWidth;
      break;

    case '0-1':
      var innerBoxHeight = o.outerBoxHeight;
      var innerBoxWidth  = o.outerBoxHeight / o.innerBoxMinHeightWidthRatio;
      break;

    case '1-0':
      var innerBoxHeight = o.outerBoxWidth * o.innerBoxMaxHeightWidthRatio;
      var innerBoxWidth  = o.outerBoxWidth;
      break;

    case '1-1': // Fall through.
    default   :
      throw new Exception(f, 'Impossible case.');
   }

   return {height: innerBoxHeight, width: innerBoxWidth};
};

/*******************************************END*OF*FILE********************************************/
