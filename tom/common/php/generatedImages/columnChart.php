<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et co=100 go-=b
*
* Filename: "columnChart.php"
*
* Project: IndoorCricketStats.net.
*
* Purpose: Charting class using functions from the 'gd' library.
*
*          This file should be used as an image file once $_SESSION[] vars are set appropriately.
*          Eg. In HTML file: <img src="column_chart.php" />
*
* Author: Tom McDonnell 2008-05-04.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../utils/Utils_date.php';
require_once dirname(__FILE__) . '/../utils/Utils_image.php';

// Settings. ///////////////////////////////////////////////////////////////////////////////////////

session_start();

// Globally executed code. /////////////////////////////////////////////////////////////////////////

try
{
   $columnChart = new ColumnChart
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

   $columnChart->display();
}
catch (Exception $e)
{
   Utils_image::printExceptionAsImage($e, $columnChart->getImage());
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
class ColumnChart
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
         'stripeDark'     => imagecolorallocate($this->image, 0x19, 0x8a, 0xcc), // Dark blue.
         'stripeLight'    => imagecolorallocate($this->image, 0x20, 0xac, 0xff), // Light blue.
         'columnDark'     => imagecolorallocate($this->image, 0x00, 0x99, 0x00), // Dark green.
         'columnLight'    => imagecolorallocate($this->image, 0x00, 0xaa, 0x00), // Light green.
         'averageLine'    => imagecolorallocate($this->image, 0xff, 0x00, 0x00), // Red.
         'black'          => imagecolorallocate($this->image, 0x00, 0x00, 0x00), // Black.
         'white'          => imagecolorallocate($this->image, 0xff, 0xff, 0xff), // White.
         'expAverageLine' => imagecolorallocate($this->image, 0xff, 0xff, 0x00), // Yellow.
         'background'     => imagecolorallocate($this->image, 0xff, 0xff, 0xff)  // White.
      );

      // Chart dimensions.
      $this->chartWidth  = self::imageWidth - 100;
      $this->chartHeight = self::imageHeight - 65;

      // Image extremities.
      $this->imageMinX = 0;
      $this->imageMinY = 0;
      $this->imageMaxX = $this->imageMinX + self::imageWidth  - 1;
      $this->imageMaxY = $this->imageMaxY + self::imageHeight - 1;

      // Chart extremities.
      // NOTE: For all drawing done relating to the chart, if the coordinate to be used is not
      //       $chartMinX or $chartMinY, scaled data units must be used so that rounding is done
      //       consistently preventing 'out by one pixel' errors.
      $this->chartMaxY = $this->imageMaxY - 50;
      $this->chartMinX = $this->imageMinX + 50;
      $this->chartMaxX = $this->chartMinX + $this->chartWidth;
      $this->chartMinY = $this->chartMaxY - $this->chartHeight;

      // Data range constants.
      $this->n_dataValues = count($data['values']);
      $this->dataMax      = max($data['values']);
      $this->dataMin      = min($data['values']);
      $this->dataRange    = $this->dataMax - $this->dataMin;

      // Define x and y scaling factors (to scale from data units to pixels).
      $this->scalingFactorX = $this->chartWidth / $this->n_dataValues;
      $this->scalingFactorY =
      (
         $this->chartHeight / (($this->dataMin > 0)? $this->dataMax: $this->dataRange)
      );

      // Set stripe height (units are data units, not pixels).
      $this->stripeCycleHeight = $data['horizStripeHeight'];
      $this->darkStripeHeight  = $this->stripeCycleHeight / 2;

      $this->fontSize         = 5;
      $this->n_pixelsPerCharX = imagefontwidth($this->fontSize);
      $this->n_pixelsPerCharY = imagefontheight($this->fontSize);

      // Set axis headings.
      $this->headingAxisV = $data['headingAxisV'];
      $this->headingAxisH = $data['headingAxisH'];

      $this->dates  = $data['dates' ];
      $this->values = $data['values'];
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

      $this->drawAxisLabels($this->headingAxisH, $this->headingAxisV);
      $this->drawHorizontalAxisTimeScale($this->dates);
      $this->drawVerticalAxisNumbers();
      $this->drawVerticalAxisKey();
      $this->drawColumnsAndAverageLines($this->values);

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
      $offset = ($this->dataMin < 0)? $this->dataMin: 0;

      return $this->chartMaxY - $this->scalingFactorY * ($y - $offset);
   }

   /*
    *
    */
   private function convChartXtoImageX($x)
   {
      return $this->chartMinX + $this->scalingFactorX * $x;
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
      imagefilledrectangle
      (
         $this->image,
         $this->chartMinX, $this->convChartYtoImageY($this->dataMax),
         $this->chartMaxX, $this->chartMaxY,
         $this->colors['stripeLight']
      );

      // Draw dark blue stripes for portion of chart in which y > 0.
      for ($i = 0; $i <= $this->dataMax; $i += $this->stripeCycleHeight)
      {
         // Calculate stripe position in chart data units and chart coords.
         $stripeBottom = $i;
         $stripeTop    = $i + $this->darkStripeHeight;

         if ($stripeTop > $this->dataMax)
         {
            $stripeTop = $this->dataMax;
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

      // Draw dark blue stripes for portion of graph in which y < 0.
      for ($i = -$this->darkStripeHeight; $i >= $this->dataMin; $i -= $this->stripeCycleHeight)
      {
         // Calculate stripe position in chart data units and chart coords.
         $stripeTop    = $i;
         $stripeBottom = $i - $this->darkStripeHeight;

         if ($stripeBottom < $this->dataMin)
         {
            $stripeBottom = $this->dataMin;
         }

         // Calculate stripe position in pixels and screen coords.
         $y_stripeTop    = $this->convChartYtoImageY($stripeTop   );
         $y_stripeBottom = $this->convChartYtoImageY($stripeBottom);

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
   private function drawAxisLabels($hAxisLabel, $vAxisLabel)
   {
      // Draw horizontal axis label.
      Utils_image::printXcenteredHorizTextString
      (
         $this->image, $this->fontSize,
         $this->chartMinX, $this->chartMaxX, $this->chartMaxY + 30,
         $hAxisLabel, $this->colors['black']
      );

      // Draw vertical axis label.
      Utils_image::printYcenteredVertTextString
      (
         $this->image, $this->fontSize,
         $this->chartMinX - 50, $this->chartMinY, $this->chartMaxY,
         $vAxisLabel, $this->colors['black']
      );
   }

   /*
    *
    */
   private function drawHorizontalAxisTimeScale($dates)
   {
      // Draw horizontal axis month and year descriptions and dividing lines.
      $prevMonth       = -1;
      $currMonth       = -1;
      $prevYear        = -1;
      $currYear        = -1;
      $prevMonthStartX = $this->chartMinX;
      $prevYearStartX  = $this->chartMinX;

      for ($i = 0; $i <= $this->n_dataValues; ++$i)
      {
         // Get current month.
         if ($i < $this->n_dataValues)
         {
            $currMonth = $dates[$i][1];
         }
         // Else the previous value is used.

         if ($currMonth != $prevMonth || $i == $this->n_dataValues)
         {
            // A new month has been discovered, or the last data value has been reached.
            // In either case, draw a dividing line, and draw the month name for the
            // previous month in the center of the space between the dividing lines.

            // Draw dividing line at start of new month.
            $x_newMonthLine = $this->convChartXtoImageX($i);
            $y              = $this->chartMaxY + 15;
            if ($i == 0)
            {
               // Must also draw new year dividing line.
               $y += 15;

               // Update $prevYearStartX and $currYear.
               $currYear = $dates[$i][0];
               $prevYearStartX = $x_newMonthLine;
            }
            imageline
            (
               $this->image,
               $x_newMonthLine, $this->chartMaxY,
               $x_newMonthLine, $y,
               $this->colors['black']
            );

            if ($i > 0)
            {
               // Create a month abbreviation string that will fit in the available space.
               $textStr = $this->getMonthAbbrevStrForWidth
               (
                  $prevMonth, $x_newMonthLine - $prevMonthStartX
               );

               // Draw month abbreviation at center of previous month.
               Utils_image::printXcenteredHorizTextString
               (
                  $this->image, $this->fontSize,
                  $prevMonthStartX, $x_newMonthLine, $this->chartMaxY,
                  $textStr, $this->colors['black']
               );

               // Update $prevMonthStartX.
               $prevMonthStartX = $x_newMonthLine;

               // Get current year.
               if ($i < $this->n_dataValues)
               {
                  $currYear = $dates[$i][0];
               }
               // Else the previous value is used.

               // Test for new year and draw lines and text if necessary.
               if ($currYear != $prevYear || $i == $this->n_dataValues)
               {
                  // Draw dividing line at start of new year.
                  $x_newYearLine = $this->convChartXtoImageX($i);
                  imageline
                  (
                     $this->image,
                     $x_newMonthLine, $this->chartMaxY + 16,
                     $x_newMonthLine, $this->chartMaxY + 30,
                     $this->colors['black']
                  );

                  if ($i > 0)
                  {
                     // Create a year abbreviation string that will fit in the available space.
                     $textStr = $this->getYearAbbrevForWidth
                     (
                        $prevYear, $x_newYearLine - $prevYearStartX
                     );

                     // Draw year text at center of previous year.
                     Utils_image::printXcenteredHorizTextString
                     (
                        $this->image, $this->fontSize,
                        $prevYearStartX, $x_newMonthLine,
                        $this->chartMaxY + $this->n_pixelsPerCharY,
                        $textStr, $this->colors['black']
                     );

                     // Update $prevYearStartX.
                     $prevYearStartX = $x_newYearLine;
                  }
               }
            }

            // Update $prevMonth and $prevYear.
            $prevMonth = $currMonth;
            $prevYear  = $currYear;
         }
      }

      // Draw black line at top of year text.
      imageline
      (
         $this->image,
         $this->chartMinX, $this->chartMaxY + 16,
         $this->chartMaxX, $this->chartMaxY + 16,
         $this->colors['black']
      );

      // Draw black line at bottom of year text.
      imageline
      (
         $this->image,
         $this->chartMinX, $this->chartMaxY + 30,
         $this->chartMaxX, $this->chartMaxY + 30,
         $this->colors['black']
      );
   }

   /*
    *
    */
   private function getMonthAbbrevStrForWidth($monthNo, $width)
   {
      $monthName = Utils_date::getMonthName($monthNo);

      $limit1 = strlen($monthName) * $this->n_pixelsPerCharX + 10;
      $limit2 = 3 * $this->n_pixelsPerCharX + 5;
      $limit3 = $this->n_pixelsPerCharX + 2;

      return
      (
         ($width > $limit1)? $monthName:
         (
            ($width > $limit2)? Utils_date::getMonthThreeLetterAbbrev($monthNo):
            (
               ($width > $limit3)? Utils_date::getMonthOneLetterAbbrev($monthNo): ''
            )
         )
      );
   }

   /*
    *
    */
   private function getYearAbbrevForWidth($year, $width)
   {
      $yearStr = (string)$year;
      assert('strlen($yearStr) == 4');

      $limit1 = 4 * $this->n_pixelsPerCharX + 10;
      $limit2 = 3 * $this->n_pixelsPerCharX + 2;
      $limit3 = 2 * $this->n_pixelsPerCharX + 1;

      return
      (
         ($width > $limit1)? $yearStr: // Eg. "2006".
         (
            ($width > $limit2)? "'" . substr($yearStr, 2, 2): // Eg. "'06".
            (
               ($width > $limit3)? "'" . substr($yearStr, 3, 1): '' // Eg."'6".
            )
         )
      );
   }

   /*
    *
    */
   private function drawVerticalAxisKey()
   {
      // Draw right axis label (for cumulative average line).
      $textStr = 'Cumulative Average ';
      $n_charsInTextStr = strlen($textStr);
      $y = $this->chartMinY +
      (
         ($this->chartHeight + $n_charsInTextStr * $this->n_pixelsPerCharX) / 2 + 0.5
      );
      $y -= 1 * $this->n_pixelsPerCharX; // Correction for inclusion of line key indicator.
      $x = $this->chartMaxX + $this->n_pixelsPerCharY; // Right of chart.
      imagestringup($this->image, $this->fontSize, $x, $y, $textStr, $this->colors['black']);

      // Draw cumulative average line key indicator.
      $y_top    = $y     + $this->n_pixelsPerCharX;
      $y_bottom = $y_top + $this->n_pixelsPerCharX;
      $x_left   = $x;
      $x_middle = $x + $this->n_pixelsPerCharY / 2;
      $x_right  = $x + $this->n_pixelsPerCharY;
      imagefilledrectangle
      (
         $this->image,
         $x_left , $y_top,
         $x_right, $y_bottom,
         $this->colors['columnDark']
      );
      $x += $this->n_pixelsPerCharY / 2;
      imageline
      (
         $this->image, $x_middle, $y_top, $x_middle, $y_bottom, $this->colors['averageLine']
      );

      // Draw right axis label (for exponential moving average line).
      $textStr = 'Exp. Moving Average';
      $n_charsInTextStr = strlen($textStr);
      $y = $this->chartMinY +
      (
         ($this->chartHeight + $n_charsInTextStr * $this->n_pixelsPerCharX) / 2 + 0.5
      );
      $y -= 1 * $this->n_pixelsPerCharX; // Correction for inclusion of line key indicator.
      $x = $this->chartMaxX + 2 * $this->n_pixelsPerCharY; // Right of chart.
      imagestringup($this->image, $this->fontSize, $x, $y, $textStr, $this->colors['black']);

      // Draw exponential moving average line key indicator.
      $y_top    = $y     + $this->n_pixelsPerCharX;
      $y_bottom = $y_top + $this->n_pixelsPerCharX;
      $x_left   = $x;
      $x_middle = $x + $this->n_pixelsPerCharY / 2;
      $x_right  = $x + $this->n_pixelsPerCharY;
      imagefilledrectangle
      (
         $this->image,
         $x_left , $y_top,
         $x_right, $y_bottom,
         $this->colors['columnDark']
      );
      $x += $this->n_pixelsPerCharY / 2;
      imageline
      (
         $this->image, $x_middle, $y_top, $x_middle, $y_bottom, $this->colors['expAverageLine']
      );
   }

   /*
    *
    */
   private function drawVerticalAxisNumbers()
   {
      // Draw vertical axis numbers for data >= 0 on left side.
      for ($i = 0; $i <= $this->dataMax; $i += $this->stripeCycleHeight / 2)
      {
         $textStr = (string)$i;
         $n_charsInTextStr = strlen($textStr);
         $x = $this->chartMinX - 5 - $this->n_pixelsPerCharX * $n_charsInTextStr;
         $y = $this->convChartYtoImageY($i) - $this->n_pixelsPerCharY / 2;
         imagestring($this->image, $this->fontSize, $x, $y, $textStr, $this->colors['black']);
      }

      // Draw vertical axis numbers for data < 0 on left side.
      $stepSize = $this->stripeCycleHeight / 2;
      for ($i = -$stepSize; $i >= $this->dataMin; $i -= $stepSize)
      {
         $textStr = (string)$i;
         $n_charsInTextStr = strlen($textStr);
         $x = $this->chartMinX - 5 - $this->n_pixelsPerCharX * $n_charsInTextStr;
         $y = $this->convChartYtoImageY($i) - $this->n_pixelsPerCharY / 2;
         imagestring($this->image, $this->fontSize, $x + 1, $y, $textStr, $this->colors['black']);
      }
   }

   /*
    *
    */
   private function drawColumnsAndAverageLines($values)
   {
      $y_dataZero      = $this->convChartYtoImageY(0); // Y coordinate of data zero level.
      $cumulativeTotal = 0;
      $exponentialAvg  = $values[0]; // Exponential average initial value.
      $maxAlpha        = 0.98;

      foreach ($values as $key => $value)
      {
         // Draw column.
         $this->color = ($key % 2 == 0)? $this->colors['columnDark']: $this->colors['columnLight'];
         $x_l     = $this->convChartXtoImageX($key    );
         $x_r     = $this->convChartXtoImageX($key + 1);
         $y_value = $this->convChartYtoImageY($value  );

         // NOTE: Must use different rectangle descriptions below depending on
         //       whether $value is positive because of bug in PHP on web host's server.
         //       When PHP is upgraded, check whether still needed.
         switch ($value > 0)
         {
          case true:
            imagefilledrectangle($this->image, $x_l, $y_value, $x_r, $y_dataZero, $this->color);
            break;
          case false:
            imagefilledrectangle($this->image, $x_l, $y_dataZero, $x_r, $y_value, $this->color);
            break;
         }

         // Draw cumulative average line.
         $cumulativeTotal += $value;
         $cumulativeAvg    = $cumulativeTotal / ($key + 1);
         $y_avg            = $this->convChartYtoImageY($cumulativeAvg);
         imageline($this->image, $x_l, $y_avg, $x_r, $y_avg , $this->colors['averageLine']);

         // Draw exponential moving average line.
         $alpha            = $maxAlpha * ($key / ($key + 1));
         $exponentialAvg   = ($alpha * $exponentialAvg) + (1 - $alpha) * $value;
         $y_avg            = $this->convChartYtoImageY($exponentialAvg);
         imageline($this->image, $x_l, $y_avg, $x_r, $y_avg , $this->colors['expAverageLine']);
      }

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
   //
   // NOTE
   // ----
   // For all drawing done relating to the chart, if the coordinate to be used is not $chartMinX or
   // $chartMinY, scaled data units must be used so that rounding is done consistently preventing
   // 'out by one pixel' errors.
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
