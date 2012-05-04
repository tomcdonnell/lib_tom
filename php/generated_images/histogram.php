<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "histogram.php"
*
* Project: IndoorCricketStats.net.
*
* Purpose: Charting class using functions from the 'gd' library.
*
*          This file should be used as an image file once $_SESSION[] vars are set appropriately.
*          Eg. In HTML file: <img src="column_chart.php" />
*
* Author: Tom McDonnell 2008-05-25.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../utils/UtilsDate.php';
require_once dirname(__FILE__) . '/../utils/UtilsImage.php';

// Settings. ///////////////////////////////////////////////////////////////////////////////////////

session_start();

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   $histogram = new Histogram
   (
      array
      (
         'values'            => $_SESSION['values'           ],
         'dates'             => $_SESSION['dates'            ],
         'horizStripeHeight' => $_SESSION['horizStripeHeight'],
         'headingAxisV'      => $_SESSION['headingAxisV'     ],
         'headingAxisH'      => $_SESSION['headingAxisH'     ]
      )
   );

   $histogram->display();
}
catch (Exception $e)
{
   UtilsImage::printExceptionAsImage($e, $columnChart->getImage());
}

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/**
 * @param $testData {array}
 *    The following array shows the format expected and may be used as test data.
 *    array
 *    (
 *       'values' => array
 *       (
 *          -5, -5, 19, -7, -8, -12, 1, 1, -4, 6, -6, 8, 15, 15, 15, 6, 22, -10, -10
 *       ),
 *       'dates' => array
 *       (
 *          array(16, 02, 2005), array(16, 02, 2005), array(23, 02, 2005), array(02, 03, 2005),
 *          array(08, 03, 2005), array(16, 03, 2005), array(23, 03, 2005), array(23, 03, 2005),
 *          array(13, 04, 2005), array(21, 04, 2005), array(27, 04, 2005), array(04, 05, 2005),
 *          array(11, 05, 2005), array(18, 05, 2005), array(18, 05, 2005), array(25, 05, 2005),
 *          array(31, 05, 2005), array(14, 06, 2005), array(14, 06, 2005)
 *       ),
 *       'horizStripeHeight' => 10,
 *       'headingAxisV'      => 'Runs',
 *       'headingAxisH'      => 'Innings'
 *    )
 */
class Histogram
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

   public function getImage() {return $this->image;}

   /*
    *
    */
   public function __construct($data)
   {
      assert('is_array($data)');
      assert('array_key_exists("values"           , $data)');
      assert('array_key_exists("dates"            , $data)');
      assert('array_key_exists("horizStripeHeight", $data)');
      assert('array_key_exists("headingAxisV"     , $data)');
      assert('array_key_exists("headingAxisH"     , $data)');

      $this->image = imagecreate(self::imageWidth, self::imageHeight);

      // Create colors.
      $this->colors = array
      (
         'stripeDark'       => imagecolorallocate($this->image, 0x19, 0x8a, 0xcc), // Dark blue.
         'stripeLight'      => imagecolorallocate($this->image, 0x20, 0xac, 0xff), // Light blue.
         'columnDark'       => imagecolorallocate($this->image, 0x00, 0x99, 0x00), // Dark green.
         'columnLight'      => imagecolorallocate($this->image, 0x00, 0xaa, 0x00), // Light green.
         'averageLine'      => imagecolorallocate($this->image, 0xff, 0x00, 0x00), // Red.
         'black'            => imagecolorallocate($this->image, 0x00, 0x00, 0x00), // Black.
         'white'            => imagecolorallocate($this->image, 0xff, 0xff, 0xff), // White.
         'stdDeviationLine' => imagecolorallocate($this->image, 0xff, 0xff, 0x00), // Yellow.
         'background'       => imagecolorallocate($this->image, 0xff, 0xff, 0xff)  // White.
      );

      // Chart dimensions.
      $this->chartWidth  = self::imageWidth - 100;
      $this->chartHeight = self::imageHeight - 65;

      // Image extremities.
      $this->imageMinX = 0;
      $this->imageMinY = 0;
      $this->imageMaxX = $this->imageMinX + self::imageWidth  - 1;
      $this->imageMaxY = $this->imageMaxY + self::imageHeight - 1;

      // Data range constants.
      $this->values        = $data['values'];
      $this->n_dataValues  = count($this->values);
      $this->dataMax       = max($this->values);
      $this->dataMin       = min($this->values);
      $this->dataRange     = $this->dataMax - $this->dataMin;
      $this->dataTotal     = array_sum($this->values);
      $this->dataMean      = $this->dataTotal / $this->n_dataValues;
      $this->dataFreqArray = array_count_values($this->values);
      $this->dataMaxFreq   = max($this->dataFreqArray);

      // Create a new array $this->modifiedDataFreqArray containing: for each histogram column,
      // the number of data values falling within the allowed range for that column.
      // The range for each column is given by $this->dataRangePerColumn, and is calculated using a
      // function designed to give a nice bell curve for varying dataMaxFreq and dataRange values.
      $this->dataRangePerColumn = (int)($this->dataRange * exp(-4)) + 1;
      $this->n_columns = ceil(($this->dataRange + 1) / $this->dataRangePerColumn);
      $this->modifiedDataFreqArray = array();
      for ($i = 0; $i < $this->n_columns; ++$i)
      {
         $dataColumnMin = $this->dataMin + $this->dataRangePerColumn * $i;
         $dataColumnMax = $dataColumnMin + $this->dataRangePerColumn;
     
         $this->modifiedDataFreqArray[$i] = 0;
         foreach ($this->dataFreqArray as $key => $value)
         {
            if ($dataColumnMin <= $key and $key < $dataColumnMax)
            {
               $this->modifiedDataFreqArray[$i] += $value;
            }
         }
      }
      $this->modifiedDataMinFreq = min($this->modifiedDataFreqArray);
      $this->modifiedDataMaxFreq = max($this->modifiedDataFreqArray);
  
      // Define x and y scaling factors (to scale from data units to pixels).
      $this->x_scalingFactor = $this->chartWidth  / $this->n_columns;
      $this->y_scalingFactor = $this->chartHeight / $this->modifiedDataMaxFreq;

      // Chart extremities.
      // NOTE: For all drawing done relating to the chart, if the coordinate to be used is not
      //       $chartMinX or $chartMinY, scaled data units must be used so that rounding is done
      //       consistently preventing 'out by one pixel' errors.
      $this->chartMinX = $this->imageMinX + 50;
      $this->chartMaxY = $this->imageMaxY - 50;
      $this->chartMaxX = $this->chartMinX + $this->n_columns           * $this->x_scalingFactor;
      $this->chartMinY = $this->chartMaxY - $this->modifiedDataMaxFreq * $this->y_scalingFactor;
  
      // Set stripe height (units are data units, not pixels).
      $this->stripeCycleHeight = round($this->modifiedDataMaxFreq / 5);
      switch ($this->stripeCycleHeight == 0)
      {
       case true : $this->stripeCycleHeight = 2;                                        break;
       case false: if ($this->stripeCycleHeight % 2 != 0) {++$this->stripeCycleHeight;} break;
      }
      $this->darkStripeHeight = $this->stripeCycleHeight / 2;

      $this->fontSize         = 5;
      $this->n_pixelsPerCharX = imagefontwidth($this->fontSize);
      $this->n_pixelsPerCharY = imagefontheight($this->fontSize);

      // Set axis headings.
      $this->headingAxisV = $data['headingAxisV'];
      $this->headingAxisH = $data['headingAxisH'];

      $this->dates = $data['dates'];
   }

   /*
    *
    */
   public function display()
   {
      header('Content-type: image/png');

      // Prevent caching.  See php.net documentation for function header().
      header('Cache-Control: no-cache, must-revalidate');
      header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

      $this->drawImageBackground();
      $this->drawChartBackground();

      $this->drawAxisLabelsHorizontal();
      $this->drawAxisLabelsVertical();
      $this->drawVerticalAxisNumbers();
      $this->drawColumnsAndAverageLines();

      // Output graph and clear image from memory.
      imagepng($this->image);
      imagedestroy($this->image);
   }

   // Private Functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private function convChartYtoImageY($y)
   {
      return $this->chartMaxY - $this->y_scalingFactor * $y;
   }

   /*
    *
    */
   private function convChartXtoImageX($x)
   {
      return $this->chartMinX + $this->x_scalingFactor * $x;
   }

   /*
    *
    */
   function drawImageBackground()
   {
      imagefilledrectangle
      (
         $this->image,
         $this->imageMinX, $this->imageMinY,
         $this->imageMaxX, $this->imageMaxY,
         $this->colors['background']
      );
   }

   /*
    *
    */
   private function drawChartBackground()
   {
      // Draw light blue background over entire chart.
      imagefilledrectangle
      (
         $this->image,
         $this->chartMinX, $this->chartMinY,
         $this->chartMaxX, $this->chartMaxY,
         $this->colors['stripeLight']
      );

      // Draw dark stripes for portion of chart in which y > 0.
      for ($i = 0; $i <= $this->modifiedDataMaxFreq; $i += $this->stripeCycleHeight)
      {
         // Calculate stripe position in chart data units and chart coords.
         $stripeBottom = $i;
         $stripeTop    = $i + $this->darkStripeHeight;
         if ($stripeTop > $this->modifiedDataMaxFreq)
         {
            $stripeTop = $this->modifiedDataMaxFreq;
         }

         // Calculate stripe position in pixels and screen coords.
         $y_stripeBottom = $this->convChartYtoImageY($stripeBottom);
         $y_stripeTop    = $this->convChartYtoImageY($stripeTop   );

         imagefilledrectangle
         (
            $this->image,
            $this->chartMinX, $y_stripeTop,
            $this->chartMaxX, $y_stripeBottom,
            $this->colors['stripeDark']
         );
      }
   }

   /*
    *
    */
   private function drawAxisLabelsHorizontal()
   {
      // Draw horizontal axis label.
      UtilsImage::printXcenteredHorizTextString
      (
         $this->image, $this->fontSize, $this->chartMinX, $this->chartMaxX,
         $this->chartMaxY + 30, $this->headingAxisV, $this->colors['black']
      );

      // Draw short vertical lines at bottom of columns.
      for ($i = 0; $i <= $this->n_columns; ++$i)
      {
         $x = $this->convChartXtoImageX($i);
         $y = $this->chartMaxY + 5;
         imageline($this->image, $x, $this->chartMaxY, $x, $y, $this->colors['black']);
      }

      // Calculate width of columns.
      $columnWidth = $this->x_scalingFactor;
     
      // Find the minimum number of column widths required for the column text labels.
      $intDataMin = (int)$this->dataMin;
      $intDataMax = (int)$this->dataMax;
      $testStringWidth1 = (strlen("($intDataMin - $intDataMin)") + 1) * $this->n_pixelsPerCharX;
      $testStringWidth2 = (strlen("($intDataMax - $intDataMax)") + 1) * $this->n_pixelsPerCharX;
      $n_columnsPerLabel = 1;
      while
      (
         $n_columnsPerLabel * $columnWidth < $testStringWidth1 ||
         $n_columnsPerLabel * $columnWidth < $testStringWidth2
      )
      {
         ++$n_columnsPerLabel;
      }

      // Draw column labels at base of one in every $n_columns columns.
      $startColumn = (int)(($this->n_columns % $n_columnsPerLabel) / 2 + $n_columnsPerLabel / 2);
      for ($i = $startColumn; $i < $this->n_columns; $i += $n_columnsPerLabel)
      {
         $colRangeMin = $this->dataMin + $i * $this->dataRangePerColumn;
         $colRangeMax = $colRangeMin + $this->dataRangePerColumn;
         $textString = "[$colRangeMin to $colRangeMax)";
         $x =
         (
            $this->convChartXtoImageX($i) +
            ($columnWidth - strlen($textString) * $this->n_pixelsPerCharX) / 2 + 1
         );
         $y = $this->chartMaxY + 5;
         UtilsImage::printXcenteredHorizTextString
         (
            $this->image, $this->fontSize,
            $this->convChartXToImageX($i    ),
            $this->convChartXToImageX($i + 1),
            $this->chartMaxY + 5, $textString, $this->colors['black']
         );
      }
   }

   /*
    *
    */
   private function drawAxisLabelsVertical()
   {
      // Draw left axis label.
      UtilsImage::printYcenteredVertTextString
      (
         $this->image, $this->fontSize, $this->chartMinX - 50, $this->chartMinY, $this->chartMaxY,
         'Frequency', $this->colors['black']
      );

      // Draw vertical axis numbers for data >= 0 on left side.
      for ($i = 0; $i <= $this->modifiedDataMaxFreq; $i += $this->stripeCycleHeight / 2)
      {
         $textStr = (string)$i;
         $n_charsInTextStr = strlen($textStr);
         $x = $this->chartMinX - 5 - $this->n_pixelsPerCharX * $n_charsInTextStr;
         $y = $this->convChartYtoImageY($i) - $this->n_pixelsPerCharY / 2;
         imagestring($this->image, $this->fontSize, $x, $y, $textStr, $this->colors['black']);
      }
     
      // Draw right axis label (for data mean line).
      $textStr = sprintf('Average (mean) = %.3f', $this->dataMean);
      $n_charsInTextStr = strlen($textStr);
      $y = $this->chartMinY +
      (
         ($this->chartHeight + $n_charsInTextStr * $this->n_pixelsPerCharX) / 2 + 0.5
      );
      $y -= 1 * $this->n_pixelsPerCharX; // Correction for inclusion of line key indicator.
      $x = $this->chartMaxX + $this->n_pixelsPerCharY; // Right of chart.
      imagestringup($this->image, $this->fontSize, $x, $y, $textStr, $this->colors['black']);

      // Draw data mean line key indicator.
      $y_top    = $y     + $this->n_pixelsPerCharX;
      $y_bottom = $y_top + $this->n_pixelsPerCharX;
      $x_left   = $x;
      $x_middle = $x + $this->n_pixelsPerCharY / 2;
      $x_right  = $x + $this->n_pixelsPerCharY;
      imagefilledrectangle
      (
         $this->image, $x_left, $y_bottom, $x_right, $y_top, $this->colors['columnDark']
      );
      $x += $this->n_pixelsPerCharY / 2;
      imageline
      (
         $this->image, $x_middle, $y_top, $x_middle, $y_bottom, $this->colors['averageLine']
      );
/*
      // Draw right axis label (for standard deviation line).
      $textStr = 'Standard Deviation';
      $this->n_charsInTextStr = strlen($textStr);
      $y = $this->chartMinY +
      (
         ($this->chartHeight + $this->n_charsInTextStr * $this->n_pixelsPerCharX) / 2 + 0.5
      );
      $y -= 1 * $this->n_pixelsPerCharX; // Correction for inclusion of line key indicator.
      $x = $this->chartMaxX + 2 * $this->n_pixelsPerCharY; // Right of chart.
      imagestringup($this->image, $this->fontSize, $x, $y, $textStr, $this->colors['black']);

      // Draw standard deviation line key indicator.
      $y_top    = $y     + $this->n_pixelsPerCharX;
      $y_bottom = $y_top + $this->n_pixelsPerCharX;
      $x_left   = $x;
      $x_middle = $x + $this->n_pixelsPerCharY / 2;
      $x_right  = $x + $this->n_pixelsPerCharY;
      imagefilledrectangle
      (
         $this->image, $x_left, $y_top, $x_right, $y_bottom, $this->colors['columnDark']
      );
      $x += $this->n_pixelsPerCharY / 2;
      imageline
      (
         $this->image, $x_middle, $y_top, $x_middle, $y_bottom, $this->colors['stdDeviationLine']
      );
*/
   }

   /*
    *
    */
   private function drawVerticalAxisNumbers()
   {
      // Draw vertical axis numbers for data >= 0 on left side.
      for ($i = 0; $i <= $this->modifiedDataMaxFreq; $i += $this->stripeCycleHeight / 2)
      {
         $textStr = (string)$i;
         $n_charsInTextStr = strlen($textStr);
         $x = $this->chartMinX - 5 - $this->n_pixelsPerCharX * $n_charsInTextStr;
         $y = $this->convChartYtoImageY($i) - $this->n_pixelsPerCharY / 2;
         imagestring($this->image, $this->fontSize, $x, $y, $textStr, $this->colors['black']);
      }
   }

   /*
    *
    */
   private function drawColumnsAndAverageLines()
   {
      foreach ($this->modifiedDataFreqArray as $key => $value)
      {
         // Draw column.
         $color   = ($key % 2 == 0)? $this->colors['columnDark']: $this->colors['columnLight'];
         $x_left  = $this->convChartXtoImageX($key    );
         $x_right = $this->convChartXtoImageX($key + 1);
         $y_data  = $this->convChartYtoImageY($value  );

         // NOTE: Must use particular rectangle description below
         //       because of bug in PHP on web host's server.
         //       Must use (left, top, right, bottom) and not (left, bottom, right, top).
         //       When PHP is upgraded, check whether still needed.
         imagefilledrectangle($this->image, $x_left, $y_data, $x_right, $this->chartMaxY, $color);
      }

      // Draw vertical lines for mean and +/-standard deviation.
      $x_dataMean = $this->convChartXtoImageX
      (
         (-$this->dataMin + $this->dataMean) / $this->dataRangePerColumn
      );
      imageline
      (
         $this->image,
         $x_dataMean, $this->chartMinY, $x_dataMean, $this->chartMaxY,
         $this->colors['averageLine']
      );

      // Draw black border at edge of chart.
      imagerectangle
      (
         $this->image,
         $this->chartMinX, $this->chartMinY,
         $this->chartMaxX, $this->chartMaxY,
         $this->colors['black']
      );
   }

   // Private Constants. ////////////////////////////////////////////////////////////////////////

   // Image dimensions.
   const imageHeight = 500;
   const imageWidth  = 900;

   // Private Variables. ////////////////////////////////////////////////////////////////////////

   private $image  = null;
   private $colors = null;

   // Chart dimensions.
   private $chartWidth  = null;
   private $chartHeight = null;

   // Image extremities.
   private $imageMinX = null;
   private $imageMinY = null;
   private $imageMaxX = null;
   private $imageMaxY = null;

   // Chart extremities.
   // NOTE: For all drawing done relating to the chart, if the coordinate to be used is not
   //       $chartMinX or $chartMinY, scaled data units must be used so that rounding is done
   //       consistently preventing 'out by one pixel' errors.
   private $chartMinX = null;
   private $chartMinY = null;
   private $chartMaxX = null;
   private $chartMaxY = null;

   // Data range constants.
   private $n_dataValues = null;
   private $dataMax      = null;
   private $dataMin      = null;
   private $dataRange    = null;

   // Define x and y scaling factors (to scale from data units to pixels).
   private $scalingFactorY = null;
   private $scalingFactorX = null;

   // Set stripe height (units are data units, not pixels).
   private $stripeCycleHeight = null;
   private $darkStripeHeight  = null;

   private $fontSize         = null;
   private $n_pixelsPerCharX = null;
   private $n_pixelsPerCharY = null;
}

/*******************************************END*OF*FILE********************************************/
?>
