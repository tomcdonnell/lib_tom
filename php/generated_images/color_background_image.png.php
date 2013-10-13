<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "color_background_image_png.php"
*
* Project: Color background image generator.
*
* Purpose: This file should be used as an image.
*
* Author: Tom McDonnell 2013-10-13.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../lib/tom/php/utils/UtilsValidator.php';

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   UtilsValidator::checkArrayAndSetDefaults
   (
      $_GET, array
      (
         'r'      => 'ctype_digit', // Range [0, 255].
         'g'      => 'ctype_digit', // Range [0, 255].
         'b'      => 'ctype_digit', // Range [0, 255].
         'height' => 'ctype_digit',
         'width'  => 'ctype_digit'
      ),
      array('fill_type' => array('string', 'solid'))
   );
   extract($_GET);

   foreach (array($r, $g, $b) as $c)
   {
      if ($c < 0 || $c > 255)
      {
         die('R, G, or B, out of range.  Expected range [0, 255].');
      }
   }

   header('Content-type: image/png');

   $image = imagecreatetruecolor($width, $height);
   $color = imagecolorallocate($image, $r, $g, $b);

   imagefilledrectangle($image, 0, 0, $width, $height, $color);

   imagepng($image);
   imagedestroy($image);
}
catch (Exception $e)
{
   echo $e->getMessage();
}

/*******************************************END*OF*FILE********************************************/
?>
