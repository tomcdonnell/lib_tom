<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go -=b
*
* Filename: "StringJumbler.php"
*
* Project: General Objects.
*
* Purpose: Definition of the StringJumbler class.
*
* Author: Tom McDonnell 2010-03-03.
*
\**************************************************************************************************/

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class StringJumbler
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   public function __construct ($n_toSkiptring)
   {
      $this->string         = $n_toSkiptring;
      $this->stringLength   = strlen($n_toSkiptring);
      $this->n_permutations = self::factorial($this->stringLength);
   }

   /*
    *
    */
   public function getN_permutations()
   {
      return $this->n_permutations;
   }

   /*
    * @param $n {int}
    *    Integer in the range [0, factorial(strlen($this->string))].
    *
    * The purpose of this function is best explained by way of an example.
    *
    * If $this->string = 'ABCD', the table shows the returned string for each value of n.
    *
    *  n return       n return       n return       n return
    * ----------    -----------    -----------    -----------
    *  0 'ABCD'       6 'BACD'      12 'CABD'      18 'DABC'
    *  1 'ABDC'       7 'BADC'      13 'CADB'      19 'DACB'
    *  2 'ACBD'       8 'BCAD'      14 'CBAD'      20 'DBAC'
    *  3 'ACDB'       9 'BCDA'      15 'CBDA'      21 'DBCA'
    *  4 'ADBC'      10 'BDAC'      16 'CDAB'      22 'DCAB'
    *  5 'ADCB'      11 'BDCA'      17 'CDBA'      23 'DCBA'
    */
   public function getNthPermutation($n)
   {
      $n_toSkiptringIndexByPStringIndex = array();
      $availableStringIndicesAsKeys     = array_fill_keys(range(0, $this->stringLength, 1), true);

      for ($pStringIndex = 0; $pStringIndex < $this->stringLength; ++$pStringIndex)
      {
         $pStringRemainingLength = $this->stringLength;

         $n_toSkip = $n;

         for ($i = 0; $i <= $pStringIndex; ++$i)
         {
            if ($i < $this->stringLength - 1)
            {
               $n_toSkip = $n_toSkip % self::factorial($pStringRemainingLength--);
            }
         }

         $n_toSkip = (int)floor($n_toSkip / self::factorial($pStringRemainingLength));

         for ($index = 0; true; $index = ($index + 1) % $this->stringLength)
         {
            if (!array_key_exists($index, $availableStringIndicesAsKeys))
            {
               continue;
            }

            if ($n_toSkip-- > 0)
            {
               continue;
            }

            unset($availableStringIndicesAsKeys[$index]);
            break;
         }

         $n_toSkiptringIndexByPStringIndex[$pStringIndex] = $index;
      }

      $permutationString = '';
      foreach ($n_toSkiptringIndexByPStringIndex as $pStringIndex => $n_toSkiptringIndex)
      {
         $permutationString .= $this->string[$n_toSkiptringIndex];
      }

      return $permutationString;
   }

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private static function factorial($n)
   {
      static $factorialByN = array();

      if (!array_key_exists($n, $factorialByN))
      {
         $factorialByN[$n] =  ($n == 0)? 1: $n * self::factorial($n - 1);
      }

      return $factorialByN[$n];
   }


   // Private variables. ////////////////////////////////////////////////////////////////////////

   private $n_toSkiptring         = null;
   private $n_toSkiptringLength   = null;
   private $n_permutations = null;
}

/*******************************************END*OF*FILE********************************************/
?>
