class BudgetExcelService {
	constructor (ApiService) { // eslint-disable-line no-unused-vars
		
	}

	generateDownload(viewState) {
		console.dir(viewState); // eslint-disable-line no-console
		console.log('its alive!'); // eslint-disable-line no-console

		var filename = "Budget-Comparison-Report.xlsx";
		var data = [];
		var termDescriptions = {
			'05': 'Summer Session 1',
			'06': 'Summer Special Session',
			'07': 'Summer Session 2',
			'08': 'Summer Quarter',
			'09': 'Fall Semester',
			'10': 'Fall Quarter',
			'01': 'Winter Quarter',
			'02': 'Spring Semester',
			'03': 'Spring Quarter'
		};


		// Generate Schedule Costs
		// Header
		data.push(['Term',
								'Subject Code',
								'Course Number',
								'Unique Key',
								'Title',
								'Units High',
								'Units Low',
								'Sequence',
								'Enrollment',
								'Sections',
								'Instructor',
								'Regular Instructor',
								'Reason',								
								'TAs',
								'Readers',
								'TA Cost',
								'Reader Cost',
								'Support Cost',
								'Instructor Cost',
								'Total Cost']);

		console.dir(viewState.calculatedScheduleCosts); // eslint-disable-line no-console

		viewState.calculatedScheduleCosts.terms.forEach(function(term) {
			var scheduleCosts = viewState.calculatedScheduleCosts.byTerm[term];
			console.log("scheduleCosts");// eslint-disable-line no-console
			console.dir(scheduleCosts); // eslint-disable-line
			for (var i = 0; i < scheduleCosts.length; i++) {
				var row = [];
				let termDescription = termDescriptions[term];
				row.push(termDescription);
				row.push(scheduleCosts[i].subjectCode);
				row.push(scheduleCosts[i].courseNumber);
				row.push(scheduleCosts[i].uniqueKey);
				row.push(scheduleCosts[i].title);
				row.push(scheduleCosts[i].unitsHigh);
				row.push(scheduleCosts[i].unitsLow);
				
				let sectionGroupCosts = scheduleCosts[i].sectionGroupCosts;
				for (var _i = 0; _i < sectionGroupCosts.length; _i++) {
					let childRow = [];
					childRow.push(sectionGroupCosts[_i].sequencePattern);
					childRow.push(sectionGroupCosts[_i].enrollment);
					childRow.push(sectionGroupCosts[_i].sectionCount);
					childRow.push(sectionGroupCosts[_i].instructorDescription);
					childRow.push(sectionGroupCosts[_i].originalInstructorDescription);
					childRow.push(sectionGroupCosts[_i].reason);
					childRow.push(sectionGroupCosts[_i].taCount);
					childRow.push(sectionGroupCosts[_i].readerCount);
					childRow.push(sectionGroupCosts[_i].taCost);
					childRow.push(sectionGroupCosts[_i].readerCost);
					childRow.push(sectionGroupCosts[_i].courseCostSubTotal);
					childRow.push(sectionGroupCosts[_i].instructorCostSubTotal);
					childRow.push(sectionGroupCosts[_i].totalCost);
					var parentRow = row.concat(childRow);
					data.push(parentRow);
				}
					
			}
		});
		
		var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
    var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef

    // Set column widths
    var wscols = [
      {wch: 15},
      {wch: 15},
      {wch: 15},
      {wch: 15},
      {wch: 30},
      {wch: 10},
      {wch: 10},
      {wch: 10},
      {wch: 10},
      {wch: 10},
      {wch: 25},
      {wch: 25},
      {wch: 20},
      {wch: 10},
      {wch: 10},
      {wch: 13},
      {wch: 13},
      {wch: 13},
      {wch: 13},
      {wch: 13},
    ];
    ws['!cols'] = wscols;

    /* add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule Costs'); // eslint-disable-line no-undef

    /* write workbook */
    XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
	}
}

BudgetExcelService.$inject = ['ApiService'];

export default BudgetExcelService;
