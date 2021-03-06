import StringService from './../../../shared/services/StringService.js';

class BudgetComparisonReportExcelService {
  downloadAsExcel(viewState, year, workgroupName) {
    var filename = "Budget-Comparison-Report-" + workgroupName + "-" + (year - 1) + "-" + year + ".xlsx";
    var data = [];

    var stringService = new StringService();

    // ------
    // HEADER
    // ------
    var previousBudgetName = viewState.calculations.calculatedView.ui.previousSelectedBudgetScenario.name;
    var currentBudgetName = viewState.calculations.calculatedView.ui.currentSelectedBudgetScenario.name;

    // Scenario names
    data.push([previousBudgetName, '', '', '', currentBudgetName]);

    // Academic years
    var previousYear = year - 1;
    var currentYear = year;
    data.push([stringService.toAcademicYear(previousYear), '', '', '', stringService.toAcademicYear(currentYear), '', '', '', 'Changes', '', '', '', '']);

    data.push(['']);

    data = data.concat(this.generateCourseCostRows(viewState));

    data.push(['']);

    data = data.concat(this.generateSupportCostRows(viewState));

    data.push(['']);

    // Add instruction plus TAs and readers for total supplemental instruction costs
    // (Requested by Sandra C. on 3-7-19)
    var row = ['Total Supplemental Instruction'];
    var costs = viewState.calculations.calculatedView.previous.costs;
    row.push(costs.supportCosts.totalCost + costs.instructorCosts.total.cost);
    row.push('');
    row.push('');
    row.push('Total');
    var costs = viewState.calculations.calculatedView.current.costs;
    row.push(costs.supportCosts.totalCost + costs.instructorCosts.total.cost);
    row.push('');
    row.push('');
    // Changes
    var costs = viewState.calculations.calculatedView.change.costs;
    row.push(costs.supportCosts.rawTotalCost + costs.instructorCosts.total.rawCost);
    row.push('');
    row.push('');
    row.push('');
    data.push(row);

    data.push(['']);

    data = data.concat(this.generateFundingRows(viewState));

    data.push(['']);

    data = data.concat(this.generateMiscStats(viewState));

    var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
    var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef

    // Set column widths
    var wscols = [
      {wch: 35},
      {wch: 10},
      {wch: 10},
      {wch: 10},
      {wch: 35},
      {wch: 10},
      {wch: 10},
      {wch: 10},
      {wch: 35}
    ];
    ws['!cols'] = wscols;

    /* add worksheet to workbook */
    // Note: XLSX does not allow sheet names exceeding 31 characters
    // Note: XLSX does not allow sheet names containing: \ / ? * [ ]
    var sheetName = workgroupName.replace(/\\/g, '').replace(/\//g, '').replace(/\?/g, '').replace(/\*/g, '').replace(/\[/g, '').replace(/\]/g, '');
    XLSX.utils.book_append_sheet(wb, ws, stringService.truncate(sheetName, 31)); // eslint-disable-line no-undef

    /* write workbook */
    XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
  }

  generateCourseCostRows(viewState) {
    var data = [];
    data.push(['Categories', 'Total Cost', '# Courses', '', 'Categories', 'Total Cost', '# Courses', '', 'Cost', '# Courses', '% Cost', '% Courses', '']);

    var instructorTypes = viewState.instructorTypes;
    for (var i = 0; i < instructorTypes.current.ids.length; i++) {
      var instructorTypeId = instructorTypes.current.ids[i];
      var row = [];

      var costs = viewState.calculations.calculatedView.previous.costs;
      row.push(instructorTypes.current.list[instructorTypeId].description);
      row.push(costs.instructorCosts.byType[instructorTypeId] ? costs.instructorCosts.byType[instructorTypeId].cost : 0); // toCurrency
      row.push(costs.instructorCosts.byType[instructorTypeId] ? costs.instructorCosts.byType[instructorTypeId].courses : 0);
      row.push('');

      var costs = viewState.calculations.calculatedView.current.costs;
      row.push(instructorTypes.current.list[instructorTypeId].description);
      row.push(costs.instructorCosts.byType[instructorTypeId] ? costs.instructorCosts.byType[instructorTypeId].cost : 0); // toCurrency
      row.push(costs.instructorCosts.byType[instructorTypeId] ? costs.instructorCosts.byType[instructorTypeId].courses : 0);
      row.push('');

      var costs = viewState.calculations.calculatedView.change.costs;
      if (costs.instructorCosts.byType[instructorTypeId]) {
        row.push(costs.instructorCosts.byType[instructorTypeId].rawCost || 0); // toCurrency
        row.push(costs.instructorCosts.byType[instructorTypeId].rawCourses || 0);
        row.push(costs.instructorCosts.byType[instructorTypeId].percentageCost || "N/A");
        row.push(costs.instructorCosts.byType[instructorTypeId].percentageCourses || "N/A");
      }

      data.push(row);
    }

    // 'Total' row
    var row = [];
    var costs = viewState.calculations.calculatedView.previous.costs;
    row.push('', costs.instructorCosts.total.cost, costs.instructorCosts.total.courses || 0, '');  // toCurrency (2)
    var costs = viewState.calculations.calculatedView.current.costs;
    row.push('', costs.instructorCosts.total.cost, costs.instructorCosts.total.courses || 0, '');  // toCurrency (2)
    var costs = viewState.calculations.calculatedView.change.costs;
    row.push(costs.instructorCosts.total.rawCost, costs.instructorCosts.total.rawCourses, costs.instructorCosts.total.percentageCost || 'N/A', costs.instructorCosts.total.percentageCourses || 'N/A');  // toCurrency (1)

    data.push(row);

    return data;
  }

  generateSupportCostRows(viewState) {
    var data = [];

    data.push(['', 'Total Cost', '# Courses', '', '', 'Total Cost', '# Courses', '', 'Cost', 'Count', '% Cost', '% Count']);
    var row = ['TAs'];
    var costs = viewState.calculations.calculatedView.previous.costs;
    row.push(costs.supportCosts.taCost);
    row.push(costs.supportCosts.taCount);
    row.push('');
    row.push('TAs');
    var costs = viewState.calculations.calculatedView.current.costs;
    row.push(costs.supportCosts.taCost);
    row.push(costs.supportCosts.taCount);
    row.push('');
    // Changes
    var costs = viewState.calculations.calculatedView.change.costs;
    row.push(costs.supportCosts.ta.rawCost);
    row.push(costs.supportCosts.ta.rawCount);
    row.push(costs.supportCosts.ta.percentageCost || 'N/A');
    row.push(costs.supportCosts.ta.percentageCount || 'N/A');
    data.push(row);

    var row = ['Readers'];
    var costs = viewState.calculations.calculatedView.previous.costs;
    row.push(costs.supportCosts.readerCost);
    row.push(costs.supportCosts.readerCount);
    row.push('');
    row.push('Readers');
    var costs = viewState.calculations.calculatedView.current.costs;
    row.push(costs.supportCosts.readerCost);
    row.push(costs.supportCosts.readerCount);
    row.push('');
    // Changes
    var costs = viewState.calculations.calculatedView.change.costs;
    row.push(costs.supportCosts.reader.rawCost);
    row.push(costs.supportCosts.reader.rawCount);
    row.push(costs.supportCosts.reader.percentageCost || 'N/A');
    row.push(costs.supportCosts.reader.percentageCount || 'N/A');
    data.push(row);

    // Total
    var row = ['Total'];
    var costs = viewState.calculations.calculatedView.previous.costs;
    row.push(costs.supportCosts.totalCost);
    row.push(costs.supportCosts.totalCount.toFixed(2));
    row.push('');
    row.push('Total');
    var costs = viewState.calculations.calculatedView.current.costs;
    row.push(costs.supportCosts.totalCost);
    row.push(costs.supportCosts.totalCount.toFixed(2));
    row.push('');
    // Changes
    var costs = viewState.calculations.calculatedView.change.costs;
    row.push(costs.supportCosts.rawTotalCost);
    row.push('');
    row.push(costs.supportCosts.percentageTotalCost || 'N/A');
    row.push('');
    data.push(row);

    return data;
  }

  generateFundingRows(viewState) {
    var data = [];

    data.push(['Funding', 'Amount', '', '', 'Funding', 'Amount', '', '', 'Funding', 'Amount', '% Change']);
    for (var i = 0; i < viewState.lineItemCategories.current.ids.length; i++) {
      var lineItemCategoryId = viewState.lineItemCategories.current.ids[i];
      var row = [];

      row.push(viewState.lineItemCategories.current.list[lineItemCategoryId].description);
      var funding = viewState.calculations.calculatedView.previous.funding;
      row.push(funding.types[lineItemCategoryId] || 0);
      row.push('');
      row.push('');

      row.push(viewState.lineItemCategories.current.list[lineItemCategoryId].description);
      var funding = viewState.calculations.calculatedView.current.funding;
      row.push(funding.types[lineItemCategoryId] || 0);
      row.push('');
      row.push('');

      var funding = viewState.calculations.calculatedView.change.funding;
      row.push(viewState.lineItemCategories.current.list[lineItemCategoryId].description);
      row.push(funding.types[lineItemCategoryId].raw);
      row.push(funding.types[lineItemCategoryId].percentage || 'N/A');

      data.push(row);
    }

    data.push(['', viewState.calculations.calculatedView.previous.funding.total, '', '', '', viewState.calculations.calculatedView.current.funding.total, '', '', '', viewState.calculations.calculatedView.change.funding.rawTotal]);

    return data;
  }

  generateMiscStats(viewState) {
    var data = [];

    data.push(['Courses Offered', '', '', '', 'Courses Offered', '', '', '', 'Courses Offered', '', '', '']);
    data.push(['# Lower div.', '# Upper div.', '# Grad.', 'Total', '# Lower div.', '# Upper div.', '# Grad.', 'Total', '# Lower div.', '# Upper div.', '# Grad.', 'Total']);

    var row = [];
    var miscStats = viewState.calculations.calculatedView.previous.miscStats;
    row.push(miscStats.lower.courses);
    row.push(miscStats.upper.courses);
    row.push(miscStats.grad.courses);
    row.push(miscStats.total.courses);
    var miscStats = viewState.calculations.calculatedView.current.miscStats;
    row.push(miscStats.lower.courses);
    row.push(miscStats.upper.courses);
    row.push(miscStats.grad.courses);
    row.push(miscStats.total.courses);
    var miscStats = viewState.calculations.calculatedView.change.miscStats;
    row.push(miscStats.lower.courses);
    row.push(miscStats.upper.courses);
    row.push(miscStats.grad.courses);
    row.push(miscStats.total.courses);

    data.push(row);

    data.push(['']);

    data.push(['Total Seats Offered', '', '', '', 'Total Seats Offered', '', '', '', 'Total Seats Offered', '', '', '']);
    data.push(['# Lower div.', '# Upper div.', '# Grad.', 'Total', '# Lower div.', '# Upper div.', '# Grad.', 'Total', '# Lower div.', '# Upper div.', '# Grad.', 'Total']);

    var row = [];
    var miscStats = viewState.calculations.calculatedView.previous.miscStats;
    row.push(miscStats.lower.seats);
    row.push(miscStats.upper.seats);
    row.push(miscStats.grad.seats);
    row.push(miscStats.total.seats);
    var miscStats = viewState.calculations.calculatedView.current.miscStats;
    row.push(miscStats.lower.seats);
    row.push(miscStats.upper.seats);
    row.push(miscStats.grad.seats);
    row.push(miscStats.total.seats);
    var miscStats = viewState.calculations.calculatedView.change.miscStats;
    row.push(miscStats.lower.seats);
    row.push(miscStats.upper.seats);
    row.push(miscStats.grad.seats);
    row.push(miscStats.total.seats);

    data.push(row);

    return data;
  }
}

export default BudgetComparisonReportExcelService;
