<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go -=b
*
* Filename: "AnagramFinder.php"
*
* Project: Dictionary Fun.
*
* Purpose: Definition of the AnagramFinder class.
*
* Author: Tom McDonnell 2010-02-22.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/StringJumbler.php';
require_once dirname(__FILE__) . '/../utils/Utils_string.php';

// Class definition. ///////////////////////////////////////////////////////////////////////////////

/*
 *
 */
class AnagramFinder
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

   // Non-static functions. -------------------------------------------------------------------//

   /*
    *
    */
   public function __construct ()
   {
      $this->allWordsAsKeys = $this->getAllWordsAsKeys();

      $this->singleWordAnagramsBySortedWord = array();

      foreach (array_keys($this->allWordsAsKeys) as $word)
      {
         $sortedWord = self::sortLettersInWord($word);

         if (!array_key_exists($sortedWord, $this->singleWordAnagramsBySortedWord))
         {
            $this->singleWordAnagramsBySortedWord[$sortedWord] = array();
         }

         $this->singleWordAnagramsBySortedWord[$sortedWord][] = $word;
      }
   }

   /*
    *
    */
   public function getSingleWordAnagrams($string)
   {
      $string = strtolower(Utils_string::removeAllNonAlphaCharacters($string));

      return $this->getSingleWordAnagramsOfAlphaString($string);
   }

   /*
    *
    */
   public function getSingleWordAnagramsOfAlphaString($string)
   {
      $sortedWord = self::sortLettersInWord(strtolower($string));

      return $this->getSingleWordAnagramsOfSortedAlphaString($string);
   }

   /*
    *
    */
   public function getSingleWordAnagramsOfSortedAlphaString($sortedWord)
   {
      if (!array_key_exists($sortedWord, $this->singleWordAnagramsBySortedWord))
      {
         return array();
      }

      return $this->singleWordAnagramsBySortedWord[$sortedWord];
   }

   /*
    *
    */
   public function getMultipleWordAnagramTree($string, $boolShowProgress = false)
   {
      $string = strtolower(Utils_string::removeAllNonAlphaCharacters($string));

      return $this->getMultipleWordAnagramTreeRecursively($string);
   }

   /*
    *
    */
   public function getAnagramsAsKeysFromAnagramTreeRecursively($anagramTree, $prefix = '')
   {
      $anagramsAsKeys = array();

      foreach ($anagramTree as $sortedWord => $anagramTreeBranch)
      {
         $words = $this->singleWordAnagramsBySortedWord[$sortedWord];

         foreach ($words as $word)
         {
            if ($anagramTreeBranch === null)
            {
               $anagramsAsKeys[ltrim("$prefix $word")] = true;
               continue;
            }

            $anagramsAsKeys = array_merge
            (
               $anagramsAsKeys,
               $this->getAnagramsAsKeysFromAnagramTreeRecursively
               (
                  $anagramTreeBranch, "$prefix $word"
               )
            );
         }
      }

      return $anagramsAsKeys;
   }

   /*
    * NOTE: Remove spaces and punctuation before submitting the string to this function.
    */
   public function getSortedKSubsetsWithAnagramsByLength($string)
   {
      $startN_letters         = min($this->longestWordLength, strlen($string));
      $sortedKSubsetsByLength = array();

      for ($n_letters = $startN_letters; $n_letters > 0; --$n_letters)
      {
         $kSubsets             = Utils_string::findAllKSubsets($string, $n_letters);
         $sortedKSubsetsAsKeys = array();

         foreach ($kSubsets as $kSubset)
         {
            $sortedKSubset = self::sortLettersInWord($kSubset);

            if (array_key_exists($sortedKSubset, $this->singleWordAnagramsBySortedWord))
            {
               $sortedKSubsetsAsKeys[$sortedKSubset] = true;
            }
         }

         if (count($sortedKSubsetsAsKeys) > 0)
         {
            ksort($sortedKSubsetsAsKeys);
            $sortedKSubsetsByLength[$n_letters] = array_keys($sortedKSubsetsAsKeys);
         }
      }

      return $sortedKSubsetsByLength;
   }

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Static functions. -----------------------------------------------------------------------//

   /*
    *
    */
   private static function sortLettersInWord($word)
   {
      $wordAsArray = str_split($word, 1);

      sort($wordAsArray);

      if (!ctype_alpha($wordAsArray[0]))
      {
         array_shift($wordAsArray);
      }

      return implode('', $wordAsArray);
   }

   /*
    *
    */
   private static function wordContainsLetterInSet($word, $letters)
   {
      foreach ($letters as $letter)
      {
         if (strpos($word, $letter) !== false)
         {
            return true;
         }
      }

      return false;
   }

   // Non-static functions. -------------------------------------------------------------------//

   /*
    *
    */
   private function getMultipleWordAnagramTreeRecursively($string)
   {
      $anagramTree                        = array();
      $sortedKSubsetsWithAnagramsByLength = $this->getSortedKSubsetsWithAnagramsByLength($string);

      foreach ($sortedKSubsetsWithAnagramsByLength as $length => $sortedKSubsets)
      {
         foreach ($sortedKSubsets as $sortedKSubset)
         {
            $stringMinusSortedKSubset = Utils_string::diff($string, $sortedKSubset);

            if ($stringMinusSortedKSubset == '')
            {
               $anagramTree[$sortedKSubset] = null;
               continue;
            }

            $anagramTreeBranch = $this->getMultipleWordAnagramTreeRecursively
            (
               $stringMinusSortedKSubset
            );

            if (count($anagramTreeBranch) > 0)
            {
               $anagramTree[$sortedKSubset] = $anagramTreeBranch;
            }
         }
      }

      return $anagramTree;
   }

   /*
    *
    */
   private function getAllWordsAsKeys()
   {
      $allWords       = file('/etc/dictionaries-common/words');
      $allWordsAsKeys = array();
      array_shift($allWords);

      $this->longestWordLength = 0;

      foreach ($allWords as &$word)
      {
         if (strtolower($word) != $word)
         {
            $word = 'a';
         }

         $word   = rtrim(strtolower($word));
         $strlen = strlen($word);

         // Exclude small words with no vowels.
         if ($strlen <= 3 && !self::wordContainsLetterInSet($word, array('a','e','i','o','u','y')))
         {
            continue;
         }

         if ($strlen == 1 && $word != 'a' && $word != 'i' && $word != 'o')
         {
            $word = 'a';
         }

         if (!ctype_alpha($word))
         {
            $word = 'a';
         }

         $allWordsAsKeys[$word] = true;

         if ($strlen > $this->longestWordLength)
         {
            $this->longestWordLength = $strlen;
         }
      }

      // Add some words that were previously excluded or not in the dictionary.
      $allWordsAsKeys['im'    ] = true;
      $allWordsAsKeys['mullet'] = true;

      ksort($allWordsAsKeys);

      return $allWordsAsKeys;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   private $singleWordAnagramsBySortedWord = null;
   private $longestWordLength              = null;

   // Class constants. //////////////////////////////////////////////////////////////////////////

   const MAX_CHARS_PER_STRING = 32;
}

/*******************************************END*OF*FILE********************************************/
?>
