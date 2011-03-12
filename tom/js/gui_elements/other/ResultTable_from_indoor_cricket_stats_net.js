/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap go-=b
*
* Filename: "ResultTable.js"
*
* Project: GUI elements.
*
* Purpose: Definition of the ResultTable object.
*
* Author: Tom McDonnell 2008-02-21.
*
\**************************************************************************************************/

/*
 * @param data {Object}
 * {
 *    heading:
 *      String.  The table heading.
 *    subheading:
 *      String.  The table subheading.
 *    colHeadings:
 *      Array of strings with pipes ('|') representing line breaks.
 *    colClasses:
 *      Array of strings (CSS class names) to be added to table column heading elements.
 *    n_rowsTotal:
 *      The total number of rows that the table would have been returned if the SQL 'LIMIT' clause
 *      was disregarded.
 *    offset:
 *      The SQL 'OFFSET' clause from the query that generated the table.
 *    firstRowRank:
 *      Integer.  If not -1, a rank column will be included in the result table at far left.
 *      The rank of the first row will be set to firstRowRank.  If -1, a rank column will not
 *      be included.
 *    rows:
 *      Array of arrays.  Each array contains data for each row.  Strings may contain pipes ('|')
 *      for line breaks.
 *    footer:
 *      String.  To be included in its own row at the foot of the table (above the previous/next
 *      page buttons).
 *    sortOverride:
 * }
 */
function ResultTable(data)
{
   var f = 'ResultTable()';
   UTILS.checkArgs(f, arguments, [Object]);

   UTILS.validator.checkObject
   (
      data,
      {
         heading     : 'string'        ,
         subheading  : 'string'        ,
         colHeadings : 'array'         ,
         colClasses  : 'array'         ,
         n_rowsTotal : 'nonNegativeInt',
         offset      : 'nonNegativeInt',
         firstRowRank: 'int'           ,
         rows        : 'array'         ,
         footer      : 'string'        ,
         sortOverride: 'nullOrArray'
      }
   );

   // Priviliged functions. /////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getTable = function () {return table;};

   // Setters. --------------------------------------------------------------------------------//

   /*
    *
    */
   this.setOnUpdateFunction = function (funct)
   {
      var f = 'ResultTable.setOnUpdateFunction()';
      UTILS.checkArgs(f, arguments, [Function]);

      onUpdateFunction = funct;
   };

   /*
    * Disable all buttons in the ResultTable object.
    * This function is public because it needs to be called from the StatisticsForm object in
    * response to a click on the 'Retrieve Data' button (to prevent multiple queries to server
    * while waiting for first response).
    */
   this.disableAllButtons = function ()
   {
      inputs.prevPageButton.disabled = true;
      inputs.nextPageButton.disabled = true;

      var sortButtonPairs = inputs.sortButtonPairs;

      for (var i = 0, len = sortButtonPairs.length; i < len; ++i)
      {
         sortButtonPair = sortButtonPairs[i];
         sortButtonPair.asc.disabled = true;
         sortButtonPair.dsc.disabled = true;
      }
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function onClickPrevOrNextButton(e)
   {
      try
      {
         var f = 'ResultTable.onClickPrevOrNextButton()';
         UTILS.checkArgs(f, arguments, [Object]);

         that.disableAllButtons();

         // Determine whether 'prev' or 'next' was clicked.
         switch (e.target)
         {
          case inputs.prevPageButton: var nextClicked = false; break;
          case inputs.nextPageButton: var nextClicked = true ; break;
          default:
            throw new Exception(f, 'Unexpected e.target.', '');
         }

         // Update data.offset.
         var n_rowsPerPage = data.rows.length;
         var n_rowsTotal   = data.n_rowsTotal;
         data.offset       = data.offset + n_rowsPerPage * ((nextClicked)? 1: -1);
         if (data.offset < 0                          ) {data.offset = 0;                          }
         if (data.offset > n_rowsTotal - n_rowsPerPage) {data.offset = n_rowsTotal - n_rowsPerPage;}

         // Call onUpdateFunction().
         switch (onUpdateFunction === null)
         {
          case true:
            throw new Exception(f, 'Button clicked but onUpdateFunction not defined.', '');
          case false:
            onUpdateFunction({offset: data.offset, sortOverride: data.sortOverride});
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function onClickSortButton(e)
   {
      try
      {
         var f = 'ResultTable.onClickSortButton()';
         UTILS.checkArgs(f, arguments, [Object]);

         that.disableAllButtons();

         // Determine whether 'asc' or 'dsc' was clicked.
         switch ($(e.target).index())
         {
          case 0: var ascORdesc = 'asc' ; break;
          case 1: var ascORdesc = 'desc'; break;
          default: throw new Exception(f, "Neither 'asc' nor 'dsc' clicked.", '');
         }

         // Determine which column contains the button clicked.
         var colNo = $(e.target.parentNode).index();
         UTILS.assert(f, 0, 0 <= colNo && colNo < n_cols);

         // Update data.sortOverride.
         var elem = [colNo, ascORdesc];
         if (data.sortOverride === null)
         {
            data.sortOverride = [elem];
         }
         else
         {
            // If array that determines the 'ORDER BY' clause already includes
            // the column clicked, then remove that column from the array.
            var index = UTILS.array.findIndexOfElement(data.sortOverride, elem);
            if (index !== null)
            {
               data.sortOverride.splice(index, 1);
            }

            // Add the column clicked to the start of the
            // array that determines the 'ORDER BY' clause.
            data.sortOverride = [elem].concat(data.sortOverride);
         }

         // Call onUpdateFunction().
         switch (onUpdateFunction === null)
         {
          case true :
            throw new Exception(f, 'Sort button clicked but onUpdateFunction not defined.', '');
          case false:
            onUpdateFunction({offset: data.offset, sortOverride: data.sortOverride});
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Other private functions. ----------------------------------------------------------------//

   /*
    *
    */
   function createTrElemsH()
   {
      var f = 'ResultTable.createTrElemsH()';
      UTILS.checkArgs(f, arguments, []);

      var subheading2 =
      (
         (data.rows.length == 0)? 'No rows to display':
         'Rows ' + (data.offset + 1) + ' to ' +
         Math.min(data.offset + data.rows.length, data.n_rowsTotal) + ' of ' + data.n_rowsTotal
      );

      var o = UTILS.table;

      var trElems =
      [
         TR({class: 'heading'    }, o.buildTCellWithBRs('h', data.heading   , {colspan: n_cols})),
         TR({class: 'subheading1'}, o.buildTCellWithBRs('h', data.subheading, {colspan: n_cols})),
         TR({class: 'subheading2'}, o.buildTCellWithBRs('h', subheading2    , {colspan: n_cols})),
      ];

      return trElems;
   }

   /*
    * Create and return the column headings row.
    */
   function createTrElemsC()
   {
      var f = 'ResultTable.createTrElemsC()';
      UTILS.checkArgs(f, arguments, []);

      var tr = TR();

      if (includeRankColumn)
      {
         tr.appendChild(TH({class: 'l'}, 'Rank'));
      }

      var shadeBool = false;

      for (var c = 0, len = data.colHeadings.length; c < len; ++c)
      {
         tr.appendChild
         (
            UTILS.table.buildTCellWithBRs('h', data.colHeadings[c], {class: (shadeBool)? 'l': 'd'})
         );

         shadeBool = !shadeBool;
      }

      var trElems = [tr];

      if (!includeRankColumn)
      {
         trElems.push(createSortButtonsRow())
      }

      return trElems;
   }

   /*
    * @param rows {array}
    *    [
    *       {0: <String or Number>, 1: <String or Number>, 2: ...},
    *       ...
    *    ]
    */
   function createTrElemsD()
   {
      var f = 'ResultTable.createTrElemsD()';
      UTILS.checkArgs(f, arguments, []);

      var trElems           = [];
      var rank              = data.firstRowRank;
      var rankStr           = '';
      var rowShadeChar      = 'l';
      var prevLastColValue  = NaN;
      var lastColIndex      = data.colClasses.length - 1;

      // For each data row...
      for (var r = 0, n_rows = data.rows.length; r < n_rows; ++r)
      {
         var tr  = TR();
         var row = data.rows[r];

         if (includeRankColumn)
         {
            if (row[lastColIndex] == prevLastColValue)
            {
               rankStr = '=';
            }
            else
            {
               rankStr = String(rank++);
               prevLastColValue = row[lastColIndex];
               rowShadeChar = (rowShadeChar == 'l')? 'd': 'l';
            }

            tr.appendChild(TD({class: 'alignR ' + rowShadeChar + 'l'}, rankStr))
         }
         else
         {
            rowShadeChar = (rowShadeChar == 'l')? 'd': 'l';
         }

         // For each data column...
         for (var c = 0, len = row.length; c < len; ++c)
         {
            var str          = row[c];
            var cellShadeStr = rowShadeChar + ((c % 2 == 1)? 'l': 'd');

            tr.appendChild
            (
               UTILS.table.buildTCellWithBRs
               (
                  'd', str, {class: cellShadeStr + ' ' + data.colClasses[c]}
               )
            );
         }

         trElems.push(tr);
      }

      return trElems;
   }

   /*
    *
    */
   function createTrElemsF()
   {
      var f = 'ResultTable.createTrElemsF()';
      UTILS.checkArgs(f, arguments, []);

      var trElems =
      [
         TR({class: 'footer'}, UTILS.table.buildTCellWithBRs('h', data.footer, {colspan: n_cols})),
         TR
         (
            {class: 'footer'},
            TD({class: 'alignL'}, inputs.prevPageButton),
            TD({class: 'alignC', colspan: n_cols - 2}, ''),
            TD({class: 'alignR'}, inputs.nextPageButton)
         )
      ];

      $(inputs.prevPageButton).click(onClickPrevOrNextButton);
      $(inputs.nextPageButton).click(onClickPrevOrNextButton);

      var n_rowsPerPage = data.rows.length;
      var n_rowsTotal   = data.n_rowsTotal;

      if (data.offset == 0 || n_rowsTotal <= n_rowsPerPage) {inputs.prevPageButton.disabled = true;}
      if (data.offset >=      n_rowsTotal -  n_rowsPerPage) {inputs.nextPageButton.disabled = true;}

      return trElems;
   }

   /*
    * Create a row of sort buttons consisting of two buttons (asc and dsc) for each column.
    *
    * Sort buttons should only be used for tables without rank columns.
    */
   function createSortButtonsRow()
   {
      var f = 'ResultTable.createSortButtonsRow()';
      UTILS.checkArgs(f, arguments, []);

      var tr            = TR();
      var shadeBool     = false;
      var dataRowsCount = data.rows.length;

      for (var c = 0, len = data.colHeadings.length; c < len; ++c)
      {
         var buttons =
         {
            asc: INPUT({type: 'button', value: '^'}),
            dsc: INPUT({type: 'button', value: 'v'}),
         };

         $(buttons.asc).click(onClickSortButton);
         $(buttons.dsc).click(onClickSortButton);

         // Add sort buttons to class global variable so they can all be disabled later.
         inputs.sortButtonPairs.push(buttons);

         if (dataRowsCount <= 1)
         {
            buttons.asc.disabled = true;
            buttons.dsc.disabled = true;
         }

         tr.appendChild
         (
            TH
            (
               {class: (shadeBool)? 'l': 'd'},
               buttons.asc, buttons.dsc
            )
         );

         shadeBool = !shadeBool;
      }

      return tr;
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function init()
   {
      var f = 'ResultTable.init()';
      UTILS.checkArgs(f, arguments, []);

      // Create Heading, Column heading, Data, and Footer TR elements.
      var trElemsH = createTrElemsH();
      var trElemsC = createTrElemsC();
      var trElemsD = createTrElemsD();
      var trElemsF = createTrElemsF();

      for (var i = 0; i < trElemsH.length; ++i) {thead.appendChild(trElemsH[i]);}
      for (var i = 0; i < trElemsC.length; ++i) {thead.appendChild(trElemsC[i]);}
      for (var i = 0; i < trElemsD.length; ++i) {tbody.appendChild(trElemsD[i]);}
      for (var i = 0; i < trElemsF.length; ++i) {tfoot.appendChild(trElemsF[i]);}
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   // HTML elements. --------------------------------------------------------------------------//

   var inputs =
   {
      prevPageButton : INPUT({type: 'button', value: 'Prev Page'}),
      nextPageButton : INPUT({type: 'button', value: 'Next Page'}),
      sortButtonPairs: []
   };

   var thead = THEAD();
   var tbody = TBODY();
   var tfoot = TFOOT();

   var table = TABLE({class: 'resultTable'}, thead, tbody, tfoot);

   // Other variables. ------------------------------------------------------------------------//

   var onUpdateFunction  = null;
   var includeRankColumn = (data.firstRowRank != -1);
   var n_cols            = data.colHeadings.length + ((includeRankColumn)? 1: 0);

   var that = this;

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   init();
}

/*******************************************END*OF*FILE********************************************/
